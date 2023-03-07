import { useRouter } from 'next/router';
import { AuthAction, withAuthUserTokenSSR } from 'next-firebase-auth';
import React from 'react';

import { admin } from '@/lib/firebaseAdmin';
import useAuth from '@/hooks/useAuth';

import Layout from '@/components/layout/Layout';
import PromptCard from '@/components/resources/PromptCard';

import { plans } from '@/constant/plans';

import story_prompts from '../../constant/story_prompts.json';

type Props = {
  subscription: { status: string; plan: string };
};

const PromptLibrary = ({ subscription }: Props) => {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) {
    router.replace('/login');
  }
  return (
    <Layout title='Prompt Library' subscription={subscription}>
      <div className='mx-auto lg:max-w-7xl '>
        <div className='mt-4 py-6'>
          <div className='grid gap-4 py-6 lg:grid-cols-3'>
            {story_prompts.map((prompt, index) => {
              return <PromptCard prompt={prompt} key={index} />;
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PromptLibrary;

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  let subscription = null;

  const data = await admin.firestore().doc(`users/${AuthUser.id}`).get();

  if (!data.data()?.subscription) {
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
