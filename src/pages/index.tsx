import { User } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { HiArrowLongRight } from 'react-icons/hi2';

import useAuth from '@/hooks/useAuth';
import useProjects from '@/hooks/useProjects';
import useSubscription from '@/hooks/useSubscription';

import EmptyState from '@/components/home/EmptyState';
import ProjectsTable from '@/components/home/ProjectsTable';
import Layout from '@/components/layout/Layout';
import herosJourneyTemplate from '@/components/resources/herosJourneyTemplate';
import ResourceCard from '@/components/resources/ResourceCard';
import threeActTemplate from '@/components/resources/threeActTemplate';
import Seo from '@/components/Seo';
import Skeleton from '@/components/Skeleton';
import ToolCard from '@/components/tools/ToolCard';

import popularTools from '@/constant/popularTools';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { projects, projectLoading } = useProjects();
  const [loading, setLoading] = React.useState(false);
  useSubscription();
  if (!user) {
    router.replace('/login');
    return;
  }
  if (projectLoading) {
    return <Skeleton className='h-screen w-screen' />;
  }
  if (loading) {
    return <Skeleton className='h-screen w-screen' />;
  }

  const popularResources = [
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
  ];
  return (
    <Layout title='Home'>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <div className='mx-auto lg:max-w-7xl '>
        <div className='mt-4 py-6'>
          {!projects || projects.length === 0 ? (
            <EmptyState />
          ) : (
            <ProjectsTable projects={projects} />
          )}
        </div>
        <div>
          <div className='flex flex-row justify-between'>
            <div className='px-1 py-2'>
              <h2 className='text-2xl font-semibold'>Popular tools</h2>
            </div>
            <Link
              href='/tools'
              className='animated-underline flex flex-row items-center space-x-2 px-1 py-2'
            >
              <p>See all tools</p>
              <HiArrowLongRight className='h-4 w-4' />
            </Link>
          </div>
          <div className='grid gap-4 py-6 lg:grid-cols-3'>
            {popularTools.map((tool) => {
              return (
                <ToolCard
                  key={tool.id}
                  href={tool.href}
                  title={tool.title}
                  description={tool.description}
                />
              );
            })}
          </div>
        </div>
        <div>
          <div className='flex flex-row justify-between'>
            <div className='px-1 py-2'>
              <h2 className='text-2xl font-semibold'>Popular resources</h2>
            </div>
            <Link
              href='/resources'
              className='animated-underline flex flex-row items-center space-x-2 px-1 py-2'
            >
              <p>See all resources</p>
              <HiArrowLongRight className='h-4 w-4' />
            </Link>
          </div>
          <div className='grid gap-4 py-6 lg:grid-cols-3'>
            {popularResources.map((resource) => {
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
}
