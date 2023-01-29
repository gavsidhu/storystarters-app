import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import React from 'react';

import useAuth from '@/hooks/useAuth';

import Layout from '@/components/layout/Layout';
import freytagsPyramidTemplate from '@/components/resources/freytagsPyramidTemplate';
import herosJourneyTemplate from '@/components/resources/herosJourneyTemplate';
import ResourceCard from '@/components/resources/ResourceCard';
import threeActTemplate from '@/components/resources/threeActTemplate';
import Skeleton from '@/components/Skeleton';

const Resources = () => {
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
      description: 'Hundreds of writing prompts for inspiration',
      href: '/resources/prompts',
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
    <Layout title='Resources'>
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
