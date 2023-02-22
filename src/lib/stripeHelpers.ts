import Stripe from 'stripe';

import { admin } from '@/lib/firebaseAdmin';

import { plans } from '@/constant/plans';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_DEV as string, {
  apiVersion: '2022-11-15',
});
interface Subscription extends Stripe.Subscription {
  plan?: Stripe.Plan;
}

interface PaymentIntent extends Stripe.PaymentIntent {
  prices?: admin.firestore.DocumentReference<admin.firestore.DocumentData>[];
  items?: Stripe.LineItem[];
}
export const handleTokens = async (
  billing_reason: Stripe.Invoice.BillingReason | null,
  subscription: Subscription,
  planId: string,
  userId: string,
  customerId: string
) => {
  const customerSnap = await admin
    .firestore()
    .collection('users')
    .where('stripeId', '==', customerId)
    .get();
  const tier1Price = plans.tier1;
  const tier2Price = plans.tier2;
  const tier3Price = plans.tier3;
  switch (billing_reason) {
    case 'subscription_create': {
      if (planId === tier1Price) {
        await admin
          .firestore()
          .collection('users')
          .doc(userId)
          .update({
            subscription: {
              status: subscription.status,
              planId: subscription.plan?.id,
              upgradedToTier2: false,
              upgradedToTier3: false,
              tokens: 20000,
            },
          });
      }
      if (planId === tier2Price) {
        await admin
          .firestore()
          .collection('users')
          .doc(userId)
          .update({
            subscription: {
              status: subscription.status,
              planId: subscription.plan?.id,
              upgradedToTier2: true,
              upgradedToTier3: false,
              tokens: 100000,
            },
          });
      }
      if (planId === tier3Price) {
        await admin
          .firestore()
          .collection('users')
          .doc(userId)
          .update({
            subscription: {
              status: subscription.status,
              planId: subscription.plan?.id,
              upgradedToTier2: true,
              upgradedToTier3: true,
              tokens: 200000,
            },
          });
      }
      break;
    }
    case 'subscription_update': {
      const userData = customerSnap.docs[0].data();
      const upgradedToTier2 = userData.subscription.upgradedToTier2;
      const upgradedToTier3 = userData.subscription.upgradedToTier3;
      if (planId === tier2Price && !upgradedToTier2 && !upgradedToTier3) {
        await customerSnap.docs[0].ref.update({
          subscription: { tokens: 100000 },
        });
        await customerSnap.docs[0].ref.update({
          upgradedToTier2: true,
          upgradedToTier3: false,
        });
      }

      if (planId === tier3Price && !upgradedToTier3) {
        await customerSnap.docs[0].ref.update({
          subscription: { tokens: 200000 },
        });
        await customerSnap.docs[0].ref.update({
          upgradedToTier2: true,
          upgradedToTier3: true,
        });
      }
      break;
    }
    case 'subscription_cycle': {
      if (planId === tier1Price) {
        await admin
          .firestore()
          .collection('users')
          .doc(userId)
          .update({
            subscription: {
              status: subscription.status,
              planId: subscription.plan?.id,
              upgradedToTier2: false,
              upgradedToTier3: false,
              tokens: 20000,
            },
          });
      }

      if (planId === tier2Price) {
        await admin
          .firestore()
          .collection('users')
          .doc(userId)
          .update({
            subscription: {
              status: subscription.status,
              planId: subscription.plan?.id,
              upgradedToTier2: true,
              upgradedToTier3: false,
              tokens: 100000,
            },
          });
      }

      if (planId === tier3Price) {
        await admin
          .firestore()
          .collection('users')
          .doc(userId)
          .update({
            subscription: {
              status: subscription.status,
              planId: subscription.plan?.id,
              upgradedToTier2: true,
              upgradedToTier3: true,
              tokens: 200000,
            },
          });
      }

      break;
    }
    default: {
      break;
    }
  }
};

export const insertPaymentRecord = async (
  payment: PaymentIntent,
  checkoutSession?: Stripe.Checkout.Session
) => {
  // Get customer's UID from Firestore
  const customersSnap = await admin
    .firestore()
    .collection('users')
    .where('stripeId', '==', payment.customer)
    .get();
  if (customersSnap.size !== 1) {
    throw new Error('User not found!');
  }
  if (checkoutSession) {
    const lineItems = await stripe.checkout.sessions.listLineItems(
      checkoutSession.id
    );
    const prices = [];
    for (const item of lineItems.data) {
      prices.push(
        admin
          .firestore()
          .collection('products')
          .doc(item.price?.product as string)
          .collection('prices')
          .doc(item.price?.id as string)
      );
    }
    payment['prices'] = prices;
    payment['items'] = lineItems.data;
  }
  // Write to invoice to a subcollection on the subscription doc.
  await customersSnap.docs[0].ref
    .collection('payments')
    .doc(payment.id)
    .set(payment, { merge: true });
};

export const insertInvoiceRecord = async (invoice: Stripe.Invoice) => {
  try {
    // Get customer's UID from Firestore
    const customersSnap = await admin
      .firestore()
      .collection('users')
      .where('stripeId', '==', invoice.customer)
      .get();
    if (customersSnap.size !== 1) {
      throw new Error('User not found!');
    }
    // Write to invoice to a subcollection on the subscription doc.
    await customersSnap.docs[0].ref
      .collection('subscriptions')
      .doc(invoice.subscription as string)
      .collection('invoices')
      .doc(invoice.id)
      .set(invoice);

    const prices = [];
    for (const item of invoice.lines.data) {
      prices.push(
        admin
          .firestore()
          .collection('products')
          .doc(item.price?.product as string)
          .collection('prices')
          .doc(item.price?.id as string)
      );
    }

    // Update subscription payment with price data
    await customersSnap.docs[0].ref
      .collection('payments')
      .doc(invoice.payment_intent as string)
      .set({ prices }, { merge: true });
  } catch (error) {
    return;
  }
};
