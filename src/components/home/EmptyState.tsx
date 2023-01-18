import { Card } from 'flowbite-react';
import React, { useState } from 'react';
import { HiFolder, HiPlus } from 'react-icons/hi2';

import Button from '@/components/buttons/Button';
import NewProjectModal from '@/components/projects/NewProjectModal';

const EmptyState = () => {
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = (value: boolean) => {
    setShowModal(value);
  };
  return (
    <Card className='border-none py-6'>
      <div className='text-center'>
        <HiFolder className=' mx-auto h-12 w-12 text-gray-400' />
        <h3 className='mt-2 text-sm font-medium text-gray-900'>No projects</h3>
        <p className='mt-3 text-sm text-gray-500'>
          Get started by creating a new project.
        </p>
        <div className='mt-6'>
          <NewProjectModal
            handleShowModal={handleShowModal}
            isOpen={showModal}
          />
          <Button onClick={() => handleShowModal(true)}>
            <HiPlus className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
            New Project
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EmptyState;
