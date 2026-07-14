import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const MAX_ITEMS = 20;
const MAX_QUANTITY = 99;

// Invalid client input — distinguished from unexpected errors so we can 400 vs 500
class BadRequestError extends Error {}

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  let items: unknown, email: string | undefined;
  try {
    ({ items, email } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items provided' }, { status: 400 });
  }
  if (items.length > MAX_ITEMS) {
    return NextResponse.json({ error: 'Too many items' }, { status: 400 });
  }

  const ids = [...new Set(items.map((item) => Number(item?.id)))];
  if (ids.some((id) => !Number.isInteger(id))) {
    return NextResponse.json({ error: 'Invalid item id' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Prices always come from the database — client-sent prices are never trusted
  const { data: books, error: dbError } = await supabase
    .from('books')
    .select('id, title, price, autographed_price, is_autographed_available, status, inventory')
    .in('id', ids);

  if (dbError) {
    console.error('Supabase error:', dbError);
    return NextResponse.json({ error: 'Could not verify items' }, { status: 500 });
  }

  try {
    const validatedItems = items.map((item) => {
      const book = (books ?? []).find((b) => b.id === Number(item.id));
      if (!book || book.status !== 'available') {
        throw new BadRequestError('One of the items is not available for purchase');
      }

      const quantity = Math.min(Math.max(Math.trunc(Number(item.quantity)) || 1, 1), MAX_QUANTITY);
      if (book.inventory != null && quantity > book.inventory) {
        throw new BadRequestError(`Not enough stock for "${book.title}"`);
      }

      const autographed =
        Boolean(item.autographed) &&
        book.is_autographed_available &&
        book.autographed_price != null;

      return {
        id: book.id,
        quantity,
        name: autographed ? `${book.title} (Autographed)` : book.title,
        unitAmount: Math.round((autographed ? book.autographed_price! : book.price) * 100),
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: validatedItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: item.unitAmount,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      metadata: {
        app: 'beresta',
        items: JSON.stringify(
          validatedItems.map((item) => ({ id: item.id, quantity: item.quantity }))
        ),
      },
      customer_email: email || undefined,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      shipping_address_collection: { allowed_countries: ['US'] },
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: any) {
    if (error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message || 'Stripe error' }, { status: 500 });
  }
}
