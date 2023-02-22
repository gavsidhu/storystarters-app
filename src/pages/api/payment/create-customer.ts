import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
// This is your test secret API key.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_DEV as string, {
  apiVersion: '2022-11-15',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, name } = req.body;

  try {
    const customer = await stripe.customers.create({
      name,
      email,
    });

    res.status(200).json({ code: 'customer_created', customer });
  } catch (e) {
    res.status(400).json({
      code: 'customer_creation_failed',
      error: e,
    });
  }
}
