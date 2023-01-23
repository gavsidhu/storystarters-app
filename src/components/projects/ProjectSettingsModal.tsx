import { Dialog, Transition } from '@headlessui/react';
import { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc } from 'firebase/firestore';
import React, { Fragment, useContext, useState } from 'react';

import { db } from '@/lib/firebaseClient';
import axiosApiInstance from '@/lib/updateIdToken';
import useAuth from '@/hooks/useAuth';

import Button from '@/components/buttons/Button';
import Label from '@/components/inputs/Label';
import TextInput from '@/components/inputs/TextInput';

import { url } from '@/constant/url';
import { AlertContext } from '@/context/AlertState';

type Props = {
  isOpen: boolean;
  handleShowModal: (value: boolean, event?: React.MouseEvent) => void;
  wordCountGoal: number;
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
  const alertContext = useContext(AlertContext);

  function closeModal() {
    handleShowModal(false);
  }

  const editProject = async () => {
    setLoading(true);
    try {
      const { projectName, projectDescription, wordCountGoal } = formData;
      const newWordCountGoal = parseInt(wordCountGoal.toString());
      const docRef = doc(db, `projects/${id}`);
      await setDoc(
        docRef,
        {
          projectName,
          projectDescription,
          wordCountGoal: newWordCountGoal,
        },
        { merge: true }
      );

      setLoading(false);
      closeModal();
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        alertContext.addAlert(error.message, 'error', 5000);
      }
      if (error instanceof FirebaseError) {
        alertContext.addAlert(error.message, 'error', 5000);
      }
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axiosApiInstance.post(`${url}/api/projects/delete-project`, {
        uid: user?.uid,
        projectId: id,
      });
      setLoading(false);
      alertContext.addAlert('Project deleted successfuly', 'info', 5000);
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        alertContext.addAlert(error.message, 'error', 5000);
      }
      if (error instanceof FirebaseError) {
        alertContext.addAlert(error.message, 'error', 5000);
      }
    }
  };
  // if (loading) {
  //   return <Skeleton />;
  // }
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
                      <Button onClick={editProject} isLoading={loading}>
                        Edit project
                      </Button>
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
                      isLoading={loading}
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
