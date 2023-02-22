import { User } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { HiArrowLongRight } from 'react-icons/hi2';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useMount } from 'react-use';

import useAuth from '@/hooks/useAuth';
import useProjects from '@/hooks/useProjects';
import useSubscription from '@/hooks/useSubscription';
import { useTour } from '@/hooks/useTour';

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

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { projects, projectLoading } = useProjects();
  const [loading, setLoading] = React.useState(false);
  const { homeTour, setHomeTour } = useTour();
  useSubscription();
  useMount(() => {
    const checkIfPassed = localStorage.getItem('homeTourPassed');
    if (checkIfPassed === 'true') {
      return;
    } else {
      setHomeTour({
        run: true,
        tourActive: true,
        steps: [
          {
            content: <p className='pt-4'> Let's begin our journey</p>,
            locale: { skip: <strong aria-label='skip'>S-K-I-P</strong> },
            placement: 'center',
            target: 'body',
            title: 'Welcome to Story Starters!',
          },
          {
            content: (
              <p className='pt-4'>
                {' '}
                Generate ideas, create characters and outline your story with
                our powerful tools.
              </p>
            ),
            spotlightPadding: 20,
            target: '.home-tools-step',
            title: 'Tools',
          },
          {
            content: 'Find writing prompts and story structure templates here.',
            placement: 'bottom',
            styles: {
              options: {
                width: 300,
              },
            },
            target: '.home-resources-step',
            title: 'Resources',
          },
          {
            content: (
              <p>Let's create a project using the Hero's Journey Template</p>
            ),
            placement: 'top',
            target: '#resource2',
            title: 'Create a project',
          },
        ],
      });
    }
  });
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
      id: 'resource2',
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

  const handleTourCallback = (data: CallBackProps) => {
    const { status } = data;
    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      window.localStorage.setItem('homeTourPassed', 'true');
    }
  };
  return (
    <Layout title='Home'>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <Joyride
        callback={handleTourCallback}
        steps={homeTour.steps}
        run={homeTour.run}
        continuous
        hideCloseButton
        scrollToFirstStep
        showProgress
        showSkipButton
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
      <div className='home-step-1 mx-auto lg:max-w-7xl'>
        <div className='mt-4 py-6'>
          {!projects || projects.length === 0 ? (
            <EmptyState />
          ) : (
            <ProjectsTable projects={projects} />
          )}
        </div>
        <div className='home-tools-step'>
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
        <div className='home-resources-step'>
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
