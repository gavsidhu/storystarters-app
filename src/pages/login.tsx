import Image from 'next/image';
import { AuthAction, withAuthUser } from 'next-firebase-auth';
import React from 'react';

import LoginForm from '@/components/auth/LoginForm';
import PrimaryLink from '@/components/links/PrimaryLink';
import Skeleton from '@/components/Skeleton';

const Login = () => {
  return (
    <div className='flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <Image
          className='mx-auto'
          src='/images/logo-full.png'
          alt='Your Company'
          width={280}
          height={160}
        />
        <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
          Login to your account
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Or{' '}
          <PrimaryLink href='/register' openNewTab={false}>
            Start your free trial
          </PrimaryLink>
        </p>
      </div>
      <LoginForm />
    </div>
  );
};

const LoginLoader = () => {
  return <Skeleton className='h-screen w-screen' />;
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  LoaderComponent: LoginLoader,
})(Login);
