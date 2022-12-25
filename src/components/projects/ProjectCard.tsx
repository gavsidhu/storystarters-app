import { doc, setDoc } from 'firebase/firestore';
import { Card } from 'flowbite-react';
import Link from 'next/link';
import React from 'react';

import { db } from '@/lib/firebaseClient';

type Props = {
  wordCountGoal: string | number;
  wordCount: number | string;
  dateCreated: string;
  projectName: string;
  projectDescription: string;
  id: string | number;
};

const ProjectCard = ({
  wordCountGoal,
  dateCreated,
  projectDescription,
  projectName,
  wordCount,
  id,
}: Props) => {
  const getProject = async () => {
    const docRef = doc(db, `projects/${id}`);
    await setDoc(docRef, { lastOpened: Date.now() }, { merge: true });
  };
  return (
    <Link href={`/projects/${id}`} onClick={getProject}>
      <Card className='shadow-none hover:shadow-lg'>
        <div className='flex flex-row justify-between'>
          <h5 className='font-body text-2xl font-extrabold tracking-tight text-gray-900'>
            {projectName}
          </h5>
          {/* <button onClick={(e) => e.preventDefault()} className="p-1 hover:bg-gray-800"><span><Cog8ToothIcon className='h-6 w-6' /></span></button> */}
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
    </Link>
  );
};

export default ProjectCard;
