import { AxiosError } from 'axios';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';

import { db } from '@/lib/firebaseClient';
import axiosApiInstance from '@/lib/updateIdToken';
import useAuth from '@/hooks/useAuth';

import Button from '@/components/buttons/Button';

import { url } from '@/constant/url';
import { AlertContext } from '@/context/AlertState';

const TrialEnded = () => {
  const { user } = useAuth();
  const router = useRouter();
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
    <div className='mx-auto max-w-3xl space-y-3'>
      <div className='space-y-3'>
        <h1>Your free trial has ended</h1>
        <p>Please add a payment method to continue using Story Starters.</p>
      </div>
      <div>
        <Button isLoading={loading} onClick={createBillingPortal}>
          Add payment method
        </Button>
      </div>
    </div>
  );
};

export default TrialEnded;
