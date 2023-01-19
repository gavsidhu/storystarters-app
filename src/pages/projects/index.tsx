import React, { useState } from 'react';
import { HiPlus } from 'react-icons/hi2';

import useProjects from '@/hooks/useProjects';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import NewProjectModal from '@/components/projects/NewProjectModal';
import ProjectCard from '@/components/projects/ProjectCard';
import Skeleton from '@/components/Skeleton';

const Projects = () => {
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
    <Layout title='Projects'>
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
