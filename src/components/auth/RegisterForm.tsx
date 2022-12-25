import Image from 'next/image';
import React from 'react';
import { FieldValues, useForm } from 'react-hook-form';

import Button from '@/components/buttons/Button';
import PrimaryLink from '@/components/links/PrimaryLink';

interface Props {
  onSubmit: (data: FieldValues) => {
    //function that submits data to firebase auth and creates user
  };
}
const RegisterForm = ({ onSubmit }: Props) => {
  //Form validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  return (
    <>
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
            Create your account
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Or{' '}
            <PrimaryLink href='/login' openNewTab={false}>
              Login to your account
            </PrimaryLink>
          </p>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
            <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
              <div className='flex flex-row space-x-3'>
                <div>
                  <label
                    htmlFor='firstname'
                    className='block text-sm font-medium text-gray-700'
                  >
                    First name
                  </label>
                  <div className='mt-1'>
                    <input
                      id='firstname'
                      type='text'
                      autoComplete='firstname'
                      className={
                        !errors.firstname
                          ? 'block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm outline-none focus:border-primary-500 focus:ring-0 sm:text-sm'
                          : 'block w-full appearance-none rounded-md border border-red-600 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-red-600 focus:ring-0 sm:text-sm'
                      }
                      {...register('firstname', {
                        required: 'First name is required',
                      })}
                    />
                    {errors.firstname && (
                      <p className='pt-1 text-sm text-red-600'>
                        {errors.firstname?.message as string}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='lastname'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Last name
                  </label>
                  <div className='mt-1'>
                    <input
                      id='lastname'
                      type='text'
                      autoComplete='lastname'
                      className={
                        !errors.lastname
                          ? 'block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm outline-none focus:border-primary-500 focus:ring-0 sm:text-sm'
                          : 'block w-full appearance-none rounded-md border border-red-600 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-red-600 focus:ring-0 sm:text-sm'
                      }
                      {...register('lastname', {
                        required: 'Last name is required',
                      })}
                    />
                    {errors.lastname && (
                      <p className='pt-1 text-sm text-red-600'>
                        {errors.lastname?.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </div>
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
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Confirm Password
                </label>
                <div className='mt-1'>
                  <input
                    id='cpassword'
                    type='password'
                    className={
                      !errors.cpassword
                        ? 'block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm outline-none focus:border-primary-500 focus:ring-0 sm:text-sm'
                        : 'block w-full appearance-none rounded-md border border-red-600 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-red-600 focus:ring-0 sm:text-sm'
                    }
                    {...register('cpassword', {
                      required: 'Confirm password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must have at least 8 characters',
                      },
                      validate: (val: string) => {
                        if (watch('password') != val) {
                          return 'Passwords do not match';
                        }
                      },
                    })}
                  />
                  {errors.cpassword && (
                    <p className='pt-1 text-sm text-red-600'>
                      {errors.cpassword?.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Button
                  type='submit'
                  variant='primary'
                  className='flex w-full justify-center'
                >
                  Register
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
