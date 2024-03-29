import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { plans } from '@/constant/plans';
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

  if (
    priceId === plans.tier1 ||
    priceId === plans.tier2 ||
    priceId === plans.tier3
  ) {
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        billing_address_collection: 'auto',
        success_url: `${url}/login?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}?canceled=true`,
        line_items: [
          {
            price: priceId,
            // For metered billing, do not pass quantity
            quantity: 1,
          },
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        subscription_data: {
          trial_period_days: 5,
        },
        payment_method_collection: 'always',
      });

      res.json({ url: session.url });
    } catch (e) {
      res.status(400).json({
        code: 'session_creation_failed',
        error: e,
      });
    }
  } else {
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
        mode: 'payment',
        allow_promotion_codes: true,
        success_url: `${url}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}?canceled=true`,
      });

      res.json({ url: session.url });
    } catch (e) {
      res.status(400).json({
        code: 'session_creation_failed',
        error: e,
      });
    }
  }
}
