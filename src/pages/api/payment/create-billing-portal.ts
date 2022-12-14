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
  const { customerId } = req.body;

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${url}/account`,
    });

    res
      .status(200)
      .json({ code: 'billing_portal_session_created', url: session.url });
  } catch (e) {
    res.status(400).json({
      code: 'billing_portal_session_failed',
      error: e,
    });
  }
}
