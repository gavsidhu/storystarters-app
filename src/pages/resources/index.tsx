import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import React from 'react';

import useAuth from '@/hooks/useAuth';

import Layout from '@/components/layout/Layout';
import freytagsPyramidTemplate from '@/components/resources/freytagsPyramidTemplate';
import herosJourneyTemplate from '@/components/resources/herosJourneyTemplate';
import ResourceCard from '@/components/resources/ResourceCard';
import threeActTemplate from '@/components/resources/threeActTemplate';

const Resources = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  if (loading) {
    return <p>Loading Please wait</p>;
  }
  const resources = [
    {
      id: '1',
      title: 'Prompt library',
      description: 'Hundreds of writing prompts',
      href: '#',
      template: false,
    },
    {
      id: '2',
      title: "Hero's journey template",
      description: "Template of hero's journey story structure",
      href: '#',
      template: true,
      onClick: async () => {
        setLoading(true);
        await herosJourneyTemplate(user as User, router);
        setLoading(false);
      },
    },
    {
      id: '3',
      title: 'Three act structure template',
      description: 'Template of the three act story structure',
      href: '#',
      template: true,
      onClick: async () => {
        setLoading(true);
        await threeActTemplate(user as User, router);
        setLoading(false);
      },
    },
    {
      id: '4',
      title: "Freytag's pyramid template",
      description: 'Template of the three act story structure',
      href: '#',
      template: true,
      onClick: async () => {
        setLoading(true);
        await freytagsPyramidTemplate(user as User, router);
        setLoading(false);
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
