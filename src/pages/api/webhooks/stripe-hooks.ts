/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-console */
import { buffer } from 'micro';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { admin } from '@/lib/firebaseAdmin';
import { insertInvoiceRecord, insertPaymentRecord } from '@/lib/stripeHelpers';

import { oneTimeIds } from '@/constant/oneTimeIds';
import { plans } from '@/constant/plans';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});
export const config = {
  api: {
    bodyParser: false,
  },
};

interface Subscription extends Stripe.Subscription {
  plan?: Stripe.Plan;
}

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
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const checkoutSessionId = checkoutSession.id;
        const expandCheckoutSession = await stripe.checkout.sessions.retrieve(
          checkoutSessionId,
          {
            expand: ['line_items'],
          }
        );
        try {
          const invoiceId = checkoutSession.invoice as string;
          if (invoiceId != null) {
            const invoice = await stripe.invoices.retrieve(invoiceId);
            await insertInvoiceRecord(invoice);
          }
          if (checkoutSession.mode === 'payment') {
            const paymentIntent = await stripe.paymentIntents.retrieve(
              expandCheckoutSession.payment_intent as string
            );
            await insertPaymentRecord(paymentIntent, expandCheckoutSession);
            const customerId = paymentIntent.customer;
            const lineItems = await stripe.checkout.sessions.listLineItems(
              checkoutSessionId
            );
            const priceId = lineItems.data[0].price?.id;
            const customerSnap = await db
              .collection('users')
              .where('stripeId', '==', customerId)
              .get();
            if (!customerSnap) {
              res.status(500).json({ message: 'Customer does not exist' });
            }
            const uid = customerSnap.docs[0].id;

            if (priceId === oneTimeIds.tier1) {
              await admin.firestore().collection('users').doc(uid).update({
                'subscription.tokens': 5000,
              });
            }
            if (priceId === oneTimeIds.tier2) {
              await admin.firestore().collection('users').doc(uid).update({
                'subscription.tokens': 10000,
              });
            }
            if (priceId === oneTimeIds.tier3) {
              await admin.firestore().collection('users').doc(uid).update({
                'subscription.tokens': 25000,
              });
            }
          }
        } catch (error) {
          return;
        }
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Subscription;
        // Then define and call a function to handle the event customer.subscription.created
        const customerId = subscription.customer;
        const customerSnap = await db
          .collection('users')
          .where('stripeId', '==', customerId)
          .get();
        const uid = customerSnap.docs[0].id;
        const planId = (subscription.plan as Stripe.Plan).id;
        if (planId === plans.tier1) {
          await admin
            .firestore()
            .collection('users')
            .doc(uid)
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
        if (planId === plans.tier2) {
          await admin
            .firestore()
            .collection('users')
            .doc(uid)
            .update({
              subscription: {
                status: subscription.status,
                planId: subscription.plan?.id,
                upgradedToTier2: false,
                upgradedToTier3: false,
                tokens: 100000,
              },
            });
        }
        if (planId === plans.tier3) {
          await admin
            .firestore()
            .collection('users')
            .doc(uid)
            .update({
              subscription: {
                status: subscription.status,
                planId: subscription.plan?.id,
                upgradedToTier2: false,
                upgradedToTier3: false,
                tokens: 200000,
              },
            });
        }

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
        try {
          const subscription = event.data.object as Stripe.Subscription;
          // Then define and call a function to handle the event customer.subscription.updated
          const customerId = subscription.customer;
          const customerSnap = await db
            .collection('users')
            .where('stripeId', '==', customerId)
            .get();
          const uid = customerSnap.docs[0].id;
          if (!customerSnap.docs[0].data().subscription) {
            res.status(500).json({ message: 'Customer is not subscribed' });
          }
          if (subscription.trial_end === null) {
            res.status(500).json({ message: 'Trial end is null' });
          }
          if (
            customerSnap.docs[0].data().subscription.status !=
            subscription.status
          ) {
            await admin.firestore().collection('users').doc(uid).update({
              'subscription.status': subscription.status,
            });
          }

          // if (subscription.cancel_at_period_end === true) {
          //   await admin.firestore().collection('users').doc(uid).update({
          //     'subscription.status': 'canceled',
          //     'subscription.cancel_at': subscription.cancel_at,
          //   });
          // }
        } catch (error) {
          return;
        }
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
        const invoice = event.data.object as Stripe.Invoice;
        console.log('invoice', invoice);
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
        const tier1Price = plans.tier1;
        const tier2Price = plans.tier2;
        const tier3Price = plans.tier3;
        switch (billing_reason) {
          case 'subscription_create': {
            if (planId === tier1Price) {
              await admin
                .firestore()
                .collection('users')
                .doc(uid)
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
                .doc(uid)
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
                .doc(uid)
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
                .doc(uid)
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
                .doc(uid)
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
                .doc(uid)
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
  } catch (error) {
    res.status(500).json({
      code: 'webhook_failed',
      error,
    });
  }
};

export default handler;
