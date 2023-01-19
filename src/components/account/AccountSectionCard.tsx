import {
  sendPasswordResetEmail,
  updateEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import { Card } from 'flowbite-react';
import React, { useContext, useState } from 'react';

import { auth } from '@/lib/firebaseClient';
import useAuth from '@/hooks/useAuth';

import Button from '@/components/buttons/Button';
import Alert from '@/components/layout/Alert';

import { AlertContext } from '@/context/AlertState';

const AccountSectionCard = () => {
  const { user } = useAuth();
  const alertContext = useContext(AlertContext);
  const [nameInput, viewNameInput] = useState(false);
  const [emailInput, viewEmailInput] = useState(false);
  const [data, setData] = useState({
    displayName: user?.displayName as string,
    email: user?.email as string,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const editName = () => {
    viewNameInput(true);
  };

  const saveName = async () => {
    await updateProfile(auth.currentUser as User, {
      displayName: data.displayName,
    });
    alertContext.addAlert('Succesfully changed name', 'info', 4000);
    viewNameInput(false);
  };

  const cancelNameChange = () => {
    setData((prevState) => ({
      displayName: user?.displayName as string,
      email: prevState.email,
    }));
    viewNameInput(false);
  };

  const cancelEmailChange = () => {
    setData((prevState) => ({
      displayName: prevState.displayName as string,
      email: user?.email as string,
    }));
    viewEmailInput(false);
  };

  const editEmail = async () => {
    viewEmailInput(true);
  };

  const saveEmail = async () => {
    await updateEmail(auth.currentUser as User, data.email);
    alertContext.addAlert('Succesfully changed email', 'info', 4000);
    viewEmailInput(false);
  };

  const resetPassword = async () => {
    await sendPasswordResetEmail(auth, user?.email as string);
    alertContext.addAlert('Password reset email sent', 'info', 4000);
  };

  return (
    <>
      <div>
        <Alert />
      </div>
      <Card>
        <div className='flex flex-row items-center justify-between'>
          <h3>Account</h3>
        </div>
        <div className='space-y-6 px-2'>
          <div className='flex flex-row items-center justify-between'>
            <div>
              <h4>Name</h4>
              {!nameInput ? (
                <p>{data.displayName}</p>
              ) : (
                <input
                  type='text'
                  name='displayName'
                  id='displayName'
                  className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  value={data.displayName}
                  onChange={onChange}
                />
              )}
            </div>
            <div>
              {!nameInput ? (
                <Button variant='light' onClick={editName}>
                  Change name
                </Button>
              ) : (
                <div className='flex flex-row space-x-3'>
                  <Button variant='light' onClick={saveName}>
                    Save
                  </Button>
                  <Button variant='light' onClick={cancelNameChange}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-row items-center justify-between'>
            <div>
              <h4>Email address</h4>
              {!emailInput ? (
                <p>{data.email}</p>
              ) : (
                <input
                  type='email'
                  name='email'
                  id='email'
                  className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  value={data.email as string}
                  onChange={onChange}
                />
              )}
            </div>
            <div>
              {!emailInput ? (
                <Button variant='light' onClick={editEmail}>
                  Change email
                </Button>
              ) : (
                <div className='flex flex-row space-x-3'>
                  <Button variant='light' onClick={saveEmail}>
                    Save
                  </Button>
                  <Button variant='light' onClick={cancelEmailChange}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-row items-center justify-between'>
            <div>
              <h4>Password</h4>
              <p>&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;</p>
            </div>
            <div>
              <Button variant='light' onClick={resetPassword}>
                Change password
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default AccountSectionCard;
