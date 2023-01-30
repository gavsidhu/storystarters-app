import { doc, setDoc } from 'firebase/firestore';
import { Card } from 'flowbite-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { HiCog8Tooth } from 'react-icons/hi2';

import { db } from '@/lib/firebaseClient';

import ProjectSettingsModal from '@/components/projects/ProjectSettingsModal';

type Props = {
  wordCountGoal: number;
  wordCount: number;
  dateCreated?: string;
  projectName: string;
  projectDescription: string;
  id: string | number;
  setLoading: (value: boolean) => void;
};

const ProjectCard = ({
  wordCountGoal,
  projectDescription,
  projectName,
  wordCount,
  id,
  setLoading,
}: Props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const getProject = async () => {
    setLoading(true);
    const docRef = doc(db, `projects/${id}`);
    await setDoc(docRef, { lastOpened: Date.now() }, { merge: true });
    router.push(`/projects/${id}`);
  };

  const handleShowModal = (value: boolean, event?: React.MouseEvent) => {
    event?.stopPropagation();
    setIsOpen(value);
  };
  return (
    <>
      <ProjectSettingsModal
        isOpen={isOpen}
        handleShowModal={handleShowModal}
        wordCountGoal={wordCountGoal}
        projectDescription={projectDescription}
        projectName={projectName}
        id={id}
      />
      <div onClick={getProject} className='hover:cursor-pointer'>
        <Card className='cardShadow group h-full rounded-2xl border-none p-5 hover:bg-primary-500'>
          <div className='flex flex-row justify-between'>
            <h3 className='font-body text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-white'>
              {projectName}
            </h3>
            <button
              name='settingsButton'
              onClick={(e) => handleShowModal(true, e)}
              className='p-1'
            >
              <span>
                <div className='rounded-full p-2 hover:bg-black'>
                  <HiCog8Tooth className='h-5 w-5 text-black group-hover:text-white' />
                </div>
              </span>
            </button>
          </div>

          <p className='font-body truncate font-normal text-gray-700 group-hover:text-white'>
            {projectDescription}
          </p>
          {wordCount && wordCountGoal > 0 ? (
            <div>
              <div className='mb-1 flex justify-between'>
                <span className='text-sm font-medium text-gray-700 group-hover:text-white'>
                  Progress
                </span>
                <span className='text-sm font-medium text-gray-700 group-hover:text-white'>{`${Math.round(
                  (wordCount / wordCountGoal) * 100
                )}%`}</span>
              </div>
              <div className='h-2.5 w-full rounded-full bg-primary-50'>
                <div
                  className='h-2.5 rounded-full bg-primary-600 group-hover:bg-black'
                  style={{ width: `${(wordCount / wordCountGoal) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </Card>
      </div>
    </>
  );
};

export default ProjectCard;
