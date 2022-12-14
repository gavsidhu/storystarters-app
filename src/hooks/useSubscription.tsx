import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '@/lib/firebaseClient';
import axiosApiInstance from '@/lib/updateToken';
import useAuth from '@/hooks/useAuth';

import { url } from '@/constant/url';

const getData = async (docRef: DocumentReference<DocumentData>) => {
  const data = await getDoc(docRef);
  return data;
};

const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<object | null>(null);

  useEffect(() => {
    if (user) {
      const docRef = doc(db, 'users', user?.uid as string);
      getData(docRef).then(async (data) => {
        const res = await axiosApiInstance.post(
          `${url}/api/payment/check-subscription`,
          {
            customerId: data.data()?.stripeId,
          }
        );
        if (res.data.subscriptions.data.length > 0) {
          const status = res.data.subscriptions.data[0].status;
          const priceId = res.data.subscriptions.data[0].plan.id;
          setSubscription({ status: status, priceId: priceId });
        } else {
          setSubscription(null);
        }
      });
    }
  }, [user]);
  return subscription;
};

export default useSubscription;
