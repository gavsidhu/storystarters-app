import { Dialog, Transition } from '@headlessui/react';
import { doc, setDoc } from 'firebase/firestore';
import React, { Fragment, useState } from 'react';

import { db } from '@/lib/firebaseClient';
import axiosApiInstance from '@/lib/updateIdToken';
import useAuth from '@/hooks/useAuth';

import Button from '@/components/buttons/Button';
import Label from '@/components/inputs/Label';
import TextInput from '@/components/inputs/TextInput';
import Skeleton from '@/components/Skeleton';

import { url } from '@/constant/url';

type Props = {
  isOpen: boolean;
  handleShowModal: (value: boolean, event?: React.MouseEvent) => void;
  wordCountGoal: string | number;
  projectName: string;
  projectDescription: string;
  id: string | number;
};
export default function ProjectSettingsModal({
  isOpen,
  handleShowModal,
  wordCountGoal,
  projectName,
  projectDescription,
  id,
}: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    projectName: projectName,
    projectDescription: projectDescription,
    wordCountGoal: wordCountGoal,
  });

  function closeModal() {
    handleShowModal(false);
  }

  const editProject = async () => {
    setLoading(true);
    const { projectName, projectDescription, wordCountGoal } = formData;
    const docRef = doc(db, `projects/${id}`);
    await setDoc(
      docRef,
      {
        projectName,
        projectDescription,
        wordCountGoal,
      },
      { merge: true }
    );

    closeModal();
    setLoading(false);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onDelete = async () => {
    await axiosApiInstance.post(`${url}/api/projects/delete-project`, {
      uid: user?.uid,
      projectId: id,
    });
  };
  if (loading) {
    return <Skeleton />;
  }
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    Create New Project
                  </Dialog.Title>
                  <div className='mt-2 space-y-3'>
                    <div className='space-y-2'>
                      <Label value='Project Name' htmlFor='projectName' />
                      <TextInput
                        name='projectName'
                        id='projectName'
                        onChange={onChange}
                        required
                        value={formData.projectName}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label
                        value='Project description'
                        htmlFor='projectDescription'
                      />
                      <TextInput
                        name='projectDescription'
                        id='projectDescription'
                        onChange={onChange}
                        required
                        value={formData.projectDescription}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label value='Word count goal' htmlFor='wordCountGoal' />
                      <TextInput
                        type='number'
                        name='wordCountGoal'
                        id='wordCountGoal'
                        onChange={onChange}
                        value={formData.wordCountGoal}
                      />
                    </div>
                  </div>
                  <div className='mt-4 flex items-center justify-between'>
                    <div className='space-x-3'>
                      <Button onClick={editProject}>Edit project</Button>
                      <Button
                        onClick={closeModal}
                        variant='outline'
                        className='border border-black text-black hover:bg-black hover:text-white active:bg-primary-100 disabled:bg-primary-100'
                      >
                        Cancel
                      </Button>
                    </div>
                    <Button
                      onClick={onDelete}
                      className='border-none bg-red-500 text-white hover:bg-red-600'
                    >
                      Delete project
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
