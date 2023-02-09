import { sendEmailVerification, User } from 'firebase/auth';
import React from 'react';

import useAuth from '@/hooks/useAuth';

import Button from '@/components/buttons/Button';

const VerifyEmail = () => {
  const { user } = useAuth();

  const resendEmail = async () => {
    await sendEmailVerification(user as User);
  };
  return (
    <div className='mx-auto max-w-3xl space-y-3'>
      <div className='space-y-3'>
        <h1>Please confirm your email address</h1>
        <p>
          We have sent an email to {user?.email} to confirm your accout. After
          recieving the email follow the link provided to confirm your email
          address.{' '}
        </p>
      </div>
      <div>
        <Button onClick={resendEmail}>Resend confirmation email</Button>
      </div>
    </div>
  );
};

export default VerifyEmail;
