import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';
import { HiArrowRight } from 'react-icons/hi2';

import { db } from '@/lib/firebaseClient';

import { findDaysDifferent } from '@/utils/findDaysDifferent';

import { Project } from '@/types';

type Props = {
  projects: Project[];
};
const ProjectsTable = ({ projects }: Props) => {
  const getProject = async (id: string) => {
    const docRef = doc(db, `projects/${id}`);
    await setDoc(docRef, { lastOpened: Date.now() }, { merge: true });
  };
  return (
    <>
      <div className='flex flex-row justify-between border-b-2'>
        <div className='px-1 py-2'>
          <h2 className='text-2xl font-semibold'>Recent projects</h2>
        </div>
        <Link
          href='/projects'
          className='flex flex-row items-center space-x-2 px-1 py-2'
        >
          <p>See all projects</p>
          <HiArrowRight className='h-4 w-4' />
        </Link>
      </div>
      <div className='py-6'>
        <div className='overflow-hidden bg-white shadow sm:rounded-md'>
          <ul role='list' className='divide-y divide-gray-200'>
            {projects.map((project) => (
              <li key={project.id} id={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className='block hover:bg-gray-50'
                  onClick={() => getProject(project.id)}
                >
                  <div className='flex items-center justify-between px-4 py-4 sm:px-6'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-primary truncate text-lg font-medium'>
                        {project.projectName}
                      </h3>
                    </div>
                    <div className='mt-2 sm:flex sm:justify-end'>
                      <div className='mt-2 flex items-center text-sm text-gray-500 sm:mt-0'>
                        <p>
                          Last opened {findDaysDifferent(project.lastOpened)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProjectsTable;
