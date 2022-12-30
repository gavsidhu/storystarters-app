import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '@/lib/firebaseClient';
import useAuth from '@/hooks/useAuth';

import { plans } from '@/constant/plans';

const getData = async (docRef: DocumentReference<DocumentData>) => {
  const data = await getDoc(docRef);
  return data;
};

const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<object | null>(null);
  const [subLoading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const docRef = doc(db, 'users', user?.uid as string);
      getData(docRef).then(async (data) => {
        if (!data.data()?.subscription.planId) {
          setSubscription(null);
          setLoading(false);
        }
        const plan = data.data()?.subscription.planId;
        if (data.data() === undefined) {
          setSubscription(null);
          setLoading(false);
        }
        if (
          plan === plans.tier1 ||
          plan === plans.tier2 ||
          plan === plans.tier3
        ) {
          setSubscription({ status: data.data()?.subscription.status, plan });
          setLoading(false);
        } else {
          setSubscription(null);
          setLoading(false);
        }
      });
    } else {
      return;
    }
  }, [user]);
  return { subscription, subLoading };
};

export default useSubscription;
