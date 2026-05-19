const Stripe = require("stripe");

// Disable Vercel body parsing — Stripe needs the raw body to verify the signature
module.exports.config = {
  api: { bodyParser: false },
};

const getRawBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const rawBody = await getRawBody(req);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Ignore non-beresta payments (e.g. Python app purchases on same account)
    if (session.metadata?.app !== "beresta") {
      return res.status(200).json({ received: true });
    }

    let items = [];
    try {
      items = JSON.parse(session.metadata?.items || "[]");
    } catch {
      return res.status(200).json({ received: true });
    }

    const lowStockBooks = [];

    for (const item of items) {
      // Decrement inventory via Supabase RPC
      const decrementRes = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/rpc/decrement_inventory`,
        {
          method: "POST",
          headers: {
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ book_id: item.id, qty: item.quantity }),
        }
      );

      if (!decrementRes.ok) {
        console.error("Failed to decrement inventory for book", item.id);
        continue;
      }

      // Check new inventory level
      const checkRes = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/books?id=eq.${item.id}&select=title,inventory`,
        {
          headers: {
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
        }
      );

      const books = await checkRes.json();
      const book = books[0];
      if (book && book.inventory !== null && book.inventory < 5) {
        lowStockBooks.push(book);
      }
    }

    // Send low-stock alert email if any book dropped below 5
    if (lowStockBooks.length > 0) {
      const bookList = lowStockBooks
        .map((b) => `• ${b.title}: ${b.inventory} remaining`)
        .join("\n");

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL,
          to: "halftonellc@gmail.com",
          subject: "Low Stock Alert — Beresta Literary Press",
          text: `The following books are running low on inventory:\n\n${bookList}\n\nLog in to Supabase to reorder or update counts:\nhttps://supabase.com/dashboard`,
        }),
      });
    }
  }

  return res.status(200).json({ received: true });
};
