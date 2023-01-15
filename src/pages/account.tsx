import React from 'react';

import AccountSectionCard from '@/components/account/AccountSectionCard';
import BillingSectionCard from '@/components/account/SubscriptionSectionCard';
import Layout from '@/components/layout/Layout';

const Account = () => {
  return (
    <Layout title='Account'>
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
