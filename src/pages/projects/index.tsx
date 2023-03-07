import { useRouter } from 'next/router';
import { AuthAction, withAuthUserTokenSSR } from 'next-firebase-auth';
import React, { useState } from 'react';
import { HiPlus } from 'react-icons/hi2';

import { admin } from '@/lib/firebaseAdmin';
import useAuth from '@/hooks/useAuth';
import useProjects from '@/hooks/useProjects';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import NewProjectModal from '@/components/projects/NewProjectModal';
import ProjectCard from '@/components/projects/ProjectCard';
import Skeleton from '@/components/Skeleton';

import { plans } from '@/constant/plans';

type Props = {
  subscription: { status: string; plan: string };
};

const Projects = ({ subscription }: Props) => {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) {
    router.replace('/login');
  }
  const { projects, projectLoading } = useProjects();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  if (projectLoading) {
    return <Skeleton />;
  }

  const handleShowModal = (value: boolean) => {
    setShowModal(value);
  };
  const handleSetLoading = (value: boolean) => {
    setLoading(value);
  };
  if (loading) {
    return <Skeleton className='h-screen w-screen' />;
  }
  return (
    <Layout title='Projects' subscription={subscription}>
      <div className='mx-auto lg:max-w-7xl '>
        <div className='mt-4 py-6'>
          <div className='flex justify-end'>
            <NewProjectModal
              handleShowModal={handleShowModal}
              isOpen={showModal}
            />

            <Button onClick={() => handleShowModal(true)}>
              <HiPlus className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
              New Project
            </Button>
          </div>
          <div className='grid gap-6 py-6 lg:grid-cols-3'>
            {!projects
              ? null
              : projects.map((project) => {
                  return (
                    <ProjectCard
                      key={project.id}
                      id={project.id}
                      projectDescription={project.projectDescription}
                      projectName={project.projectName}
                      wordCountGoal={project.wordCountGoal as number}
                      wordCount={project.wordCount as number}
                      dateCreated={new Date(project.dateCreated).toDateString()}
                      setLoading={handleSetLoading}
                    />
                  );
                })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Projects;

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
