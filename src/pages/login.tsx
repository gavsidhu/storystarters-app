import Image from 'next/image';
import React from 'react';

import LoginForm from '@/components/auth/LoginForm';
import PrimaryLink from '@/components/links/PrimaryLink';

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
            Create an account
          </PrimaryLink>
        </p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
