import { useRouter } from 'next/router';
import React from 'react';

import useAuth from '@/hooks/useAuth';

import AccountSectionCard from '@/components/account/AccountSectionCard';
import BillingSectionCard from '@/components/account/SubscriptionSectionCard';
import Layout from '@/components/layout/Layout';

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
