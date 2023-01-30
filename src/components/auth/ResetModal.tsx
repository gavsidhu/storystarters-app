import { Dialog, Transition } from '@headlessui/react';
import { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Label } from 'flowbite-react';
import React, { Fragment, useContext, useState } from 'react';

import { auth } from '@/lib/firebaseClient';

import Button from '@/components/buttons/Button';

import { AlertContext } from '@/context/AlertState';

type Props = {
  isOpen: boolean;
  handleShowModal: (value: boolean) => void;
};
const ResetModal = ({ isOpen, handleShowModal }: Props) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const alertContext = useContext(AlertContext);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const resetPassword = async () => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email as string);
      alertContext.addAlert('Password reset email sent', 'info', 4000);
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

  function closeModal() {
    setEmail('');
    handleShowModal(false);
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
                      <Label value='Enter email' htmlFor='email' />
                      <input
                        name='email'
                        id='email'
                        onChange={onChange}
                        required
                        value={email}
                        color='bg-transparent'
                        className='block h-8 w-full rounded-md border border-gray-300 px-2 shadow-sm outline-none focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                        placeholder='Email address'
                      />
                    </div>
                  </div>

                  <div className='mt-4 space-x-3'>
                    <Button onClick={resetPassword} isLoading={loading}>
                      Reset Password
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
};

export default ResetModal;
