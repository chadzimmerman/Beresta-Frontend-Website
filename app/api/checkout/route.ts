import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const { items, email } = await req.json();

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items provided' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: { title: string; price: number; quantity?: number }) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.title },
          unit_amount: Math.round(Number(item.price)),
        },
        quantity: item.quantity || 1,
      })),
      mode: 'payment',
      metadata: {
        app: 'beresta',
        items: JSON.stringify(
          items.map((item: { id: number; quantity?: number }) => ({
            id: item.id,
            quantity: item.quantity || 1,
          }))
        ),
      },
      customer_email: email || undefined,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      shipping_address_collection: { allowed_countries: ['US'] },
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message || 'Stripe error' }, { status: 500 });
  }
}
