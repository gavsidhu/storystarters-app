import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
// This is your test secret API key.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_DEV as string, {
  apiVersion: '2022-11-15',
});
//Commented out to remove warning
// const calculateOrderAmount = (items: object) => {

//   return 1400;
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Commented out to remove warning
  // const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1400,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
}
