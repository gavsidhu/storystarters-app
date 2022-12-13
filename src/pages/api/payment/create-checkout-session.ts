import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { url } from '@/constant/url';
// This is your test secret API key.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { priceId, customerId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      billing_address_collection: 'auto',
      line_items: [
        {
          price: priceId,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 7,
      },
      success_url: `${url}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(400).json({
      code: 'customer_creation_failed',
      error: e,
    });
  }
}
