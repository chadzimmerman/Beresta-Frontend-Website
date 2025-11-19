// api/checkout.js
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const { items, email } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No items provided" });
  }

  try {
    // IMPORTANT: confirm whether client sends price in cents or dollars.
    // If items[].price is in dollars (e.g., 12.99), multiply by 100:
    // const unitAmount = Math.round(Number(item.price) * 100);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => {
        const unitAmount = Math.round(Number(item.price)); // expect cents; if dollars, multiply by 100
        return {
          price_data: {
            currency: "usd",
            product_data: { name: item.title },
            unit_amount: unitAmount,
          },
          quantity: item.quantity || 1,
        };
      }),
      mode: "payment",
      customer_email: email || undefined,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message || "Stripe error" });
  }
};

//Important: set FRONTEND_URL in Vercel to your frontend base (e.g. https://your-site.vercel.app).