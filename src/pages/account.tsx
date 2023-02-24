import { useRouter } from 'next/router';
import { AuthAction, withAuthUserTokenSSR } from 'next-firebase-auth';
import React from 'react';

import { admin } from '@/lib/firebaseAdmin';
import useAuth from '@/hooks/useAuth';

import AccountSectionCard from '@/components/account/AccountSectionCard';
import BillingSectionCard from '@/components/account/SubscriptionSectionCard';
import Layout from '@/components/layout/Layout';

import { plans } from '@/constant/plans';

type Props = {
  subscription: { status: string; plan: string };
};

const Account = ({ subscription }: Props) => {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) {
    router.replace('/login');
    return;
  }
  return (
    <Layout title='Account' subscription={subscription}>
      <div className='mx-auto lg:max-w-7xl '>
        <div className='mt-4 space-y-5 py-6'>
          <AccountSectionCard />
          <BillingSectionCard />
        </div>
      </div>
    </Layout>
  );
};

export default Account;

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  let subscription = null;

  const data = await admin.firestore().doc(`users/${AuthUser.id}`).get();

  if (!data.data()?.subscription) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  if (!data.data()?.subscription.planId) {
    return {
      props: {
        subscription,
      },
    };
  }

  const plan = data.data()?.subscription.planId;

  if (plan === plans.tier1 || plan === plans.tier2 || plan === plans.tier3) {
    subscription = { status: data.data()?.subscription.status, plan };
  }

  return {
    props: {
      subscription,
    },
  };
});
