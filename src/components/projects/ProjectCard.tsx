import { doc, setDoc } from 'firebase/firestore';
import { Card } from 'flowbite-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { HiCog8Tooth } from 'react-icons/hi2';

import { db } from '@/lib/firebaseClient';

import ProjectSettingsModal from '@/components/projects/ProjectSettingsModal';

type Props = {
  wordCountGoal: string | number;
  wordCount: number | string;
  dateCreated: string;
  projectName: string;
  projectDescription: string;
  id: string | number;
  setLoading: (value: boolean) => void;
};

const ProjectCard = ({
  wordCountGoal,
  dateCreated,
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
        <Card className='h-full shadow-none hover:shadow-lg'>
          <div className='flex flex-row justify-between'>
            <h5 className='font-body text-2xl font-extrabold tracking-tight text-gray-900'>
              {projectName}
            </h5>
            <button
              name='settingsButton'
              onClick={(e) => handleShowModal(true, e)}
              className='p-1 hover:bg-gray-100'
            >
              <span>
                <HiCog8Tooth className='h-6 w-6' />
              </span>
            </button>
          </div>

          <p className='font-body font-normal text-gray-700'>
            {projectDescription}
          </p>
          <div className='flex flex-row items-center justify-between'>
            <p>
              {wordCount}/{wordCountGoal} words
            </p>
            <p>{dateCreated}</p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ProjectCard;
