import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature error:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.metadata?.app !== 'beresta') {
      return NextResponse.json({ received: true });
    }

    let items: { id: number; quantity: number }[] = [];
    try {
      items = JSON.parse(session.metadata?.items || '[]');
    } catch {
      return NextResponse.json({ received: true });
    }

    const lowStockBooks: { title: string; inventory: number }[] = [];

    for (const item of items) {
      const decrementRes = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/rpc/decrement_inventory`,
        {
          method: 'POST',
          headers: {
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ book_id: item.id, qty: item.quantity }),
        }
      );

      if (!decrementRes.ok) {
        console.error('Failed to decrement inventory for book', item.id);
        continue;
      }

      const checkRes = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/books?id=eq.${item.id}&select=title,inventory`,
        {
          headers: {
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
          },
        }
      );

      const books = await checkRes.json();
      const book = books[0];
      if (book && book.inventory !== null && book.inventory < 5) {
        lowStockBooks.push(book);
      }
    }

    if (lowStockBooks.length > 0) {
      const bookList = lowStockBooks
        .map((b) => `• ${b.title}: ${b.inventory} remaining`)
        .join('\n');

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL,
          to: 'halftonellc@gmail.com',
          subject: 'Low Stock Alert — Beresta Literary Press',
          text: `The following books are running low on inventory:\n\n${bookList}\n\nLog in to Supabase to reorder or update counts:\nhttps://supabase.com/dashboard`,
        }),
      });
    }
  }

  return NextResponse.json({ received: true });
}
