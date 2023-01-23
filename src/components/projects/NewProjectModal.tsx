import { Dialog, Transition } from '@headlessui/react';
import { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';
import { addDoc, collection } from 'firebase/firestore';
import React, { Fragment, useContext, useState } from 'react';

import { db } from '@/lib/firebaseClient';
import useAuth from '@/hooks/useAuth';

import Button from '@/components/buttons/Button';
import Label from '@/components/inputs/Label';
import TextInput from '@/components/inputs/TextInput';

import { AlertContext } from '@/context/AlertState';

type Props = {
  isOpen: boolean;
  handleShowModal: (value: boolean) => void;
};
export default function MyModal({ isOpen, handleShowModal }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    wordCountGoal: 0,
  });
  const alertContext = useContext(AlertContext);

  function closeModal() {
    setFormData({ projectName: '', projectDescription: '', wordCountGoal: 0 });
    handleShowModal(false);
  }

  const addProject = async () => {
    if (!formData?.projectName) {
      return;
    }
    setLoading(true);
    try {
      const { projectName, projectDescription, wordCountGoal } = formData;
      const colRef = collection(db, 'projects');
      const newWordCountGoal = parseInt(wordCountGoal.toString());
      await addDoc(colRef, {
        uid: user?.uid,
        projectName,
        projectDescription,
        wordCountGoal: newWordCountGoal,
        dateCreated: new Date().toISOString(),
        lastOpened: Date.now(),
      });

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

                  <div className='mt-4 space-x-3'>
                    <Button onClick={addProject} isLoading={loading}>
                      Create Project
                    </Button>
                    <Button
                      onClick={closeModal}
                      variant='outline'
                      className='border border-red-500 text-red-500 hover:bg-red-50 active:bg-primary-100 disabled:bg-primary-100'
                    >
                      Cancel
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
