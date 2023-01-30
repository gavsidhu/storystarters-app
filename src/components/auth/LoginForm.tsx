import { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';
import { useContext, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';

import useAuth from '@/hooks/useAuth';

import ResetModal from '@/components/auth/ResetModal';
import Button from '@/components/buttons/Button';
import Alert from '@/components/layout/Alert';

import authErrors from '@/constant/authErrors';
import { AlertContext } from '@/context/AlertState';

const LoginForm = () => {
  const { signInWithEmail, signInWithGoogle, loading } = useAuth();
  const alertContext = useContext(AlertContext);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = (value: boolean) => {
    setShowModal(value);
  };
  // const [loading, setLoading] = useState(false)
  //Form validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-console
  const onSubmit = async (data: FieldValues) => {
    // setLoading(true)
    try {
      await signInWithEmail(data.email, data.password);
    } catch (error) {
      // setLoading(false)
      if (error instanceof AxiosError) {
        // setLoading(false)
        alertContext.addAlert(error.code as string, 'error', 3000);
      }
      if (error instanceof FirebaseError) {
        // setLoading(false)
        alertContext.addAlert(authErrors[error.code] as string, 'error', 5000);
      }
    }
  };

  const googleSubmit = async () => {
    // setLoading(true)
    try {
      await signInWithGoogle();
    } catch (error) {
      // setLoading(false)
      if (error instanceof AxiosError) {
        // setLoading(false)
        alertContext.addAlert(error.code as string, 'error', 3000);
      }
      if (error instanceof FirebaseError) {
        // setLoading(false)
        alertContext.addAlert(error.message as string, 'error', 3000);
      }
    }
  };
  return (
    <>
      <Alert />
      <ResetModal isOpen={showModal} handleShowModal={handleShowModal} />
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
                  <Button
                    variant='ghost'
                    className='bg-transparent text-black outline-none hover:bg-transparent hover:text-gray-500 active:bg-transparent'
                    onClick={() => handleShowModal(true)}
                  >
                    Forgot your password?
                  </Button>
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
            <div className='mt-6'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='bg-white px-2 text-gray-500'>Or</span>
                </div>
              </div>
              <Button
                type='submit'
                variant='outline'
                className='mt-6 flex w-full justify-center border-gray-300 text-gray-600'
                isLoading={loading}
                onClick={googleSubmit}
              >
                {loading ? (
                  <span className='h-5'></span>
                ) : (
                  <FaGoogle className='mr-4 h-5 w-5' />
                )}
                <span className='sr-only'>Login with Google</span>
                {loading ? null : 'Login with Google'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
