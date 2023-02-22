import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { admin } from '@/lib/firebaseAdmin';

import { url } from '@/constant/url';
// This is your test secret API key.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_DEV as string, {
  apiVersion: '2022-11-15',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { customerId, uid } = req.body;
  const idToken = req.headers.authorization;

  if (!idToken) {
    return res.status(401).send('Unauthorized 1');
  }
  let user: DecodedIdToken;
  try {
    user = await admin.auth().verifyIdToken(idToken as string);
  } catch (error) {
    return res.status(401).send('Unauthorized 2');
  }

  if (user.uid != uid) {
    return res.status(401).send('Unauthorized 3');
  }

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
