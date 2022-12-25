import Link from 'next/link';
import * as React from 'react';
import { HiArrowLongRight } from 'react-icons/hi2';

import useProjects from '@/hooks/useProjects';
import useSubscription from '@/hooks/useSubscription';

import EmptyState from '@/components/home/EmptyState';
import ProjectsTable from '@/components/home/ProjectsTable';
import Layout from '@/components/layout/Layout';
import ResourceCard from '@/components/resources/ResourceCard';
import Seo from '@/components/Seo';
import Skeleton from '@/components/Skeleton';
import ToolCard from '@/components/tools/ToolCard';

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

const popularTools = [
  {
    id: '1',
    title: 'Story idea generator',
    description: 'generates story ideas',
    href: '#',
  },
  {
    id: '2',
    title: 'Character Creator',
    description: 'Create memorable character',
    href: '#',
  },
  {
    id: '3',
    title: 'Scene builder',
    description: 'builds scenses',
    href: '#',
  },
];

const popularResources = [
  {
    id: '1',
    title: 'Prompt library',
    description: 'Hundreds of writing prompts',
    href: '#',
  },
  {
    id: '2',
    title: "Hero's journey template",
    description: "Template of hero's journey story structure",
    href: '#',
  },
  {
    id: '3',
    title: 'Three act structure template',
    description: 'Template of the three act story structure',
    href: '#',
  },
];

export default function HomePage() {
  const { projects, projectLoading } = useProjects();
  useSubscription();
  if (projectLoading) {
    return <Skeleton />;
  }
  return (
    <Layout title='Home'>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <div className='mx-auto lg:max-w-7xl '>
        <div className='mt-4 py-6'>
          {!projects ? <EmptyState /> : <ProjectsTable projects={projects} />}
        </div>
        <div>
          <div className='flex flex-row justify-between border-b-2'>
            <div className='px-1 py-2'>
              <h2 className='text-2xl font-semibold'>Popular tools</h2>
            </div>
            <Link
              href='/tools'
              className='flex flex-row items-center space-x-2 px-1 py-2'
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
          <div className='flex flex-row justify-between border-b-2'>
            <div className='px-1 py-2'>
              <h2 className='text-2xl font-semibold'>Popular resources</h2>
            </div>
            <Link
              href='/resources'
              className='flex flex-row items-center space-x-2 px-1 py-2'
            >
              <p>See all resources</p>
              <HiArrowLongRight className='h-4 w-4' />
            </Link>
          </div>
          <div className='grid gap-4 py-6 lg:grid-cols-3'>
            {popularResources.map((resource) => {
              return (
                <ResourceCard
                  key={resource.id}
                  href={resource.href}
                  title={resource.title}
                  description={resource.description}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
