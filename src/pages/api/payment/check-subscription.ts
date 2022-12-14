import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
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
    const customer = (await stripe.customers.retrieve(customerId, {
      expand: ['subscriptions'],
    })) as Stripe.Customer;

    res.status(200).json({
      code: 'customer_retrieved',
      subscriptions: customer.subscriptions,
    });
  } catch (e) {
    res.status(400).json({
      code: 'customer_retrieve_failed',
      error: e,
    });
  }
}
