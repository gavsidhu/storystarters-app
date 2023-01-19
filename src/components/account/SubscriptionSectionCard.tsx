import { AxiosError } from 'axios';
import { doc, getDoc } from 'firebase/firestore';
import { Card } from 'flowbite-react';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';

import { db } from '@/lib/firebaseClient';
import axiosApiInstance from '@/lib/updateIdToken';
import useAuth from '@/hooks/useAuth';
import useSubscription from '@/hooks/useSubscription';

import Button from '@/components/buttons/Button';
import Alert from '@/components/layout/Alert';

import { plans } from '@/constant/plans';
import { url } from '@/constant/url';
import { AlertContext } from '@/context/AlertState';

const SubscriptionSectionCard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { subscription } = useSubscription();
  const [loading, setLoading] = useState(false);
  const alertContext = useContext(AlertContext);

  const createBillingPortal = async () => {
    setLoading(true);
    const docRef = doc(db, `users/${user?.uid}`);
    const docSnap = await getDoc(docRef);
    const customerId = docSnap?.data()?.stripeId;
    setLoading(true);
    try {
      const re = await axiosApiInstance.post(
        `${url}/api/payment/create-billing-portal`,
        {
          customerId,
          uid: user?.uid,
        }
      );

      router.push(re.data.url);
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        alertContext.addAlert(error.message as string, 'error', 5000);
      } else {
        alertContext.addAlert('Unexpected error', 'error', 5000);
      }
    }
  };
  return (
    <>
      <div>
        <Alert />
      </div>
      <Card>
        <div className='flex flex-row items-center justify-between'>
          <h3>Subscription</h3>
        </div>
        <div className='space-y-6 px-2'>
          <div className='flex flex-row items-center justify-between'>
            <div>
              <h4>Plan</h4>

              <p>
                {subscription?.plan === plans.tier1 && 'Starter'}
                {subscription?.plan === plans.tier2 && 'Standard'}
                {subscription?.plan === plans.tier3 && 'Professional'}
              </p>
            </div>
            <div className='flex flex-col'>
              <Button
                variant='light'
                onClick={createBillingPortal}
                isLoading={loading}
              >
                Edit plan or payment info
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default SubscriptionSectionCard;
