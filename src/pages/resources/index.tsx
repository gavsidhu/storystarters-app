import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { AuthAction, withAuthUserTokenSSR } from 'next-firebase-auth';
import React from 'react';

import { admin } from '@/lib/firebaseAdmin';
import useAuth from '@/hooks/useAuth';

import Layout from '@/components/layout/Layout';
import freytagsPyramidTemplate from '@/components/resources/freytagsPyramidTemplate';
import herosJourneyTemplate from '@/components/resources/herosJourneyTemplate';
import ResourceCard from '@/components/resources/ResourceCard';
import threeActTemplate from '@/components/resources/threeActTemplate';
import Skeleton from '@/components/Skeleton';

import { plans } from '@/constant/plans';

type Props = {
  subscription: { status: string; plan: string };
};

const Resources = ({ subscription }: Props) => {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) {
    router.replace('/login');
  }
  const [loading, setLoading] = React.useState(false);
  if (loading) {
    return <Skeleton className='h-screen w-screen' />;
  }
  const resources = [
    {
      id: '1',
      title: 'Prompt library',
      description: 'Collection of writing prompts for inspiration',
      href: '/resources/prompt-library',
      template: false,
    },
    {
      id: '2',
      title: "Hero's journey template",
      description: "Create a project using the hero's journey story structure",
      href: '#',
      template: true,
      onClick: async () => {
        setLoading(true);
        await herosJourneyTemplate(user as User, router);
      },
    },
    {
      id: '3',
      title: 'Three act structure template',
      description: 'Create a project using the three act story structure',
      href: '#',
      template: true,
      onClick: async () => {
        setLoading(true);
        await threeActTemplate(user as User, router);
      },
    },
    {
      id: '4',
      title: "Freytag's pyramid template",
      description: "Create a project using Freytag's pyramid story structure",
      href: '#',
      template: true,
      onClick: async () => {
        setLoading(true);
        await freytagsPyramidTemplate(user as User, router);
      },
    },
    // {
    //   id: '5',
    //   title: 'Seven-Point structure template',
    //   description: 'Template of the seven-point story structure',
    //   href: '#',
    //   template: true,
    //   onClick: async () => {
    //     autoId();
    //   },
    // },
  ];
  return (
    <Layout title='Resources' subscription={subscription}>
      <div className='mx-auto lg:max-w-7xl '>
        <div className='mt-4 py-6'>
          <div className='grid gap-4 py-6 lg:grid-cols-3'>
            {resources.map((resource) => {
              return (
                <ResourceCard
                  onClick={resource.onClick ? resource.onClick : () => false}
                  key={resource.id}
                  id={resource.id}
                  title={resource.title}
                  description={resource.description}
                  href={resource.href}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;

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
