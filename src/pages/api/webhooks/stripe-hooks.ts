/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-console */
import { buffer } from 'micro';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { admin } from '@/lib/firebaseAdmin';
import { handleTokens } from '@/lib/stripeHelpers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const signingSecret = process.env.STRIPE_SIGNING_SECRET as string;
  const sig = req.headers['stripe-signature'] as string;
  const reqBuffer = await buffer(req);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  const db = admin.firestore();

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      break;
    }

    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription;
      // Then define and call a function to handle the event customer.subscription.created
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      // Then define and call a function to handle the event customer.subscription.deleted
      break;
    }

    case 'customer.subscription.trial_will_end': {
      const subscription = event.data.object;
      // Then define and call a function to handle the event customer.subscription.trial_will_end
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      // Then define and call a function to handle the event customer.subscription.updated
      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object;
      // Then define and call a function to handle the event invoice.paid
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      // Then define and call a function to handle the event invoice.payment_failed
      break;
    }

    case 'invoice.payment_succeeded': {
      interface Subscription extends Stripe.Subscription {
        plan?: Stripe.Plan;
      }
      const invoice = event.data.object as Stripe.Invoice;
      // Then define and call a function to handle the event invoice.payment_succeeded
      const customerId = invoice.customer;
      const billing_reason = invoice.billing_reason;
      const subscription = (await stripe.subscriptions.retrieve(
        invoice.subscription as string
      )) as Subscription;
      const planId = (subscription.plan as Stripe.Plan).id;
      //get customer uid from firestore
      const customerSnap = await db
        .collection('users')
        .where('stripeId', '==', customerId)
        .get();
      const uid = customerSnap.docs[0].id;

      if (customerSnap.size !== 1) {
        throw new Error('User not found!');
      }
      handleTokens(
        billing_reason,
        subscription,
        planId,
        uid,
        customerId as string
      );
      break;
    }

    case 'payment_intent.canceled': {
      const paymentIntent = event.data.object;
      // Then define and call a function to handle the event payment_intent.canceled
      break;
    }

    case 'payment_intent.created': {
      const paymentIntent = event.data.object;
      // Then define and call a function to handle the event payment_intent.created
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      // Then define and call a function to handle the event payment_intent.payment_failed
      break;
    }

    case 'payment_intent.processing': {
      const paymentIntent = event.data.object;
      // Then define and call a function to handle the event payment_intent.processing
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    }

    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.send({ recieved: true });
};

export default handler;
