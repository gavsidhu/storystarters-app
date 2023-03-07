import { useRouter } from 'next/router';
import { AuthAction, withAuthUserTokenSSR } from 'next-firebase-auth';
import React from 'react';

import { admin } from '@/lib/firebaseAdmin';
import useAuth from '@/hooks/useAuth';

import Layout from '@/components/layout/Layout';
import ToolCard from '@/components/tools/ToolCard';

import { plans } from '@/constant/plans';
const tools = [
  {
    id: '1',
    title: 'Plot generator',
    description: 'Generate interesting story ideas',
    href: 'plot-generator',
  },
  {
    id: '2',
    title: 'Character creator',
    description: 'Create memorable characters for your story',
    href: 'character-creator',
  },
  // {
  //   id: '3',
  //   title: 'Scene builder',
  //   description: 'builds scenses',
  //   href: 'scene-builder',
  // },
  {
    id: '4',
    title: 'Outline generator',
    description: 'Turn your story idea into an organized outline',
    href: 'outline-generator',
  },
];

type Props = {
  subscription: { status: string; plan: string };
};

const Tools = ({ subscription }: Props) => {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) {
    router.replace('/login');
  }
  return (
    <Layout title='Tools' subscription={subscription}>
      <div className='mx-auto lg:max-w-7xl '>
        <div className='mt-4 py-6'>
          <div className='grid gap-4 py-6 lg:grid-cols-3'>
            {tools.map((tool) => {
              return (
                <ToolCard
                  key={tool.id}
                  id={tool.id}
                  title={tool.title}
                  description={tool.description}
                  href={`tools/${tool.href}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Tools;

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
