import React from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/buttons/Button';
import UnderlineLink from '@/components/links/UnderlineLink';

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-console
  const onSubmit = (data: any) => console.log(data);
  return (
    <>
      <div>
        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
            <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email address
                </label>
                <div className='mt-1'>
                  <input
                    id='email'
                    type='email'
                    autoComplete='email'
                    className={
                      !errors.email
                        ? 'block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm outline-none focus:border-primary-500 focus:ring-0 sm:text-sm'
                        : 'block w-full appearance-none rounded-md border border-red-600 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-red-600 focus:ring-0 sm:text-sm'
                    }
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && (
                    <p className='pt-1 text-sm text-red-600'>
                      {errors.email?.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Password
                </label>
                <div className='mt-1'>
                  <input
                    id='password'
                    type='password'
                    className={
                      !errors.password
                        ? 'block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm outline-none focus:border-primary-500 focus:ring-0 sm:text-sm'
                        : 'block w-full appearance-none rounded-md border border-red-600 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-red-600 focus:ring-0 sm:text-sm'
                    }
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must have at least 8 characters',
                      },
                    })}
                  />
                  {errors.password && (
                    <p className='pt-1 text-sm text-red-600'>
                      {errors.password?.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className='text-right text-sm'>
                  <UnderlineLink href='#' openNewTab={false}>
                    Forgot your password?
                  </UnderlineLink>
                </div>
              </div>

              <div>
                <Button
                  type='submit'
                  variant='primary'
                  className='flex w-full justify-center'
                >
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
