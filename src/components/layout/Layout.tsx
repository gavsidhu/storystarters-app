import { Dialog, Transition } from '@headlessui/react';
import axios, { AxiosError } from 'axios';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, MouseEvent, useContext, useState } from 'react';
import {
  HiBars3,
  HiFolder,
  HiHome,
  HiQuestionMarkCircle,
  HiSquare2Stack,
  HiUsers,
  HiWrenchScrewdriver,
  HiXMark,
} from 'react-icons/hi2';

import { db } from '@/lib/firebaseClient';
import useAuth from '@/hooks/useAuth';
import useProjects from '@/hooks/useProjects';
import useSubscription from '@/hooks/useSubscription';

import VerifyEmail from '@/components/auth/VerifyEmail';
import Button from '@/components/buttons/Button';
import Alert from '@/components/layout/Alert';
import UnderlineLink from '@/components/links/UnderlineLink';
import Pricing from '@/components/payments/Pricing';
import SidebarCard from '@/components/payments/SidebarCard';
import UpgradeModal from '@/components/payments/UpgradeModal';
import Skeleton from '@/components/Skeleton';

import { url } from '@/constant/url';
import { AlertContext } from '@/context/AlertState';

const navigation = [
  { name: 'Home', href: '/', icon: HiHome },
  { name: 'Projects', href: '/projects', icon: HiFolder },
  { name: 'Tools', href: '/tools', icon: HiWrenchScrewdriver },
  {
    name: 'Resources',
    href: '/resources',
    icon: HiSquare2Stack,
  },
  { name: 'Account', href: '/account', icon: HiUsers },
  {
    name: 'Help Center',
    href: 'https://uplevel-hq-llc.outseta.com/support/kb',
    icon: HiQuestionMarkCircle,
  },
];

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function Layout({ children, title }: Props) {
  const router = useRouter();
  const { user, logout, loading, initialLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { subscription, subLoading } = useSubscription();
  const alertContext = useContext(AlertContext);
  const { projectLoading } = useProjects();
  // const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // const handleShowUpgradeModal = (value: boolean) => {
  //   setShowUpgradeModal(value);
  // };

  const handlePlanSelect = async (e: MouseEvent<HTMLButtonElement>) => {
    const price = (e.target as HTMLButtonElement).id;
    const userDoc = await getDoc(doc(db, 'users', user?.uid as string));
    if (userDoc.data() === undefined) {
      try {
        const createCustomer = await axios.post(
          `${url}/api/payment/create-customer`,
          {
            email: user?.email,
            name: user?.displayName,
          }
        );
        await setDoc(doc(db, 'users', user?.uid as string), {
          uid: user?.uid,
          name: user?.displayName,
          email: user?.email,
          stripeId: createCustomer.data.customer.id,
        });

        if (createCustomer.data.customer.id && price) {
          const createSession = await axios.post(
            `${url}/api/payment/create-checkout-session`,
            {
              customerId: createCustomer.data.customer.id,
              priceId: price,
            }
          );

          window.location.href = createSession.data.url;
        }
        return;
      } catch (error) {
        if (error instanceof AxiosError) {
          return;
        }
      }
    }
    const customerId = userDoc?.data()?.stripeId;
    if (customerId && price) {
      const createSession = await axios.post(
        `${url}/api/payment/create-checkout-session`,
        {
          customerId,
          priceId: price,
        }
      );

      window.location.href = createSession.data.url;
    }
  };
  if (loading || subLoading || initialLoading || projectLoading) {
    return <Skeleton className='h-screen w-screen' />;
  }
  if (!user) {
    router.replace('/login');
    return <Skeleton className='h-screen w-screen' />;
  }
  if (subscription === null) {
    return (
      <div>
        <div className='w-full space-x-5 py-6 px-4 text-right'>
          <UnderlineLink href='https://uplevel-hq-llc.outseta.com/support/kb'>
            Help Center
          </UnderlineLink>
          <Button className='text-right' variant='outline' onClick={logout}>
            Logout
          </Button>
        </div>
        <Pricing handlePlanSelect={handlePlanSelect} />
      </div>
    );
  }
  if (!user.emailVerified) {
    return (
      <div>
        <div className='w-full space-x-5 py-6 px-4 text-right'>
          <UnderlineLink href='https://uplevel-hq-llc.outseta.com/support/kb'>
            Help Center
          </UnderlineLink>
          <Button className='text-right' variant='outline' onClick={logout}>
            Logout
          </Button>
        </div>
        <VerifyEmail />
      </div>
    );
  }
  return (
    <>
      <Alert />
      {alertContext.showModal && (
        <UpgradeModal
          showModal={alertContext.showModal}
          closeModal={alertContext.closeUpgradeModal}
        />
      )}
      <div>
        {/* <UpgradeModal isOpen={showUpgradeModal} handleShowModal={handleShowUpgradeModal} /> */}
        <Transition.Root
          show={sidebarOpen && !alertContext.showModal}
          as={Fragment}
        >
          <Dialog
            as='div'
            className='relative z-40 md:hidden'
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter='transition-opacity ease-linear duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-linear duration-300'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-gray-600 bg-opacity-75' />
            </Transition.Child>

            <div className='fixed inset-0 z-40 flex'>
              <Transition.Child
                as={Fragment}
                enter='transition ease-in-out duration-300 transform'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'
              >
                <Dialog.Panel className='relative flex w-full max-w-xs flex-1 flex-col bg-[#f4f4f4]'>
                  <Transition.Child
                    as={Fragment}
                    enter='ease-in-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-300'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                  >
                    <div className='absolute top-0 right-0 -mr-12 pt-2'>
                      <button
                        type='button'
                        className='ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className='sr-only'>Close sidebar</span>
                        <HiXMark
                          className='h-6 w-6 text-white'
                          aria-hidden='true'
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className='h-0 flex-1 overflow-y-auto pt-5 pb-4'>
                    <div className='flex flex-shrink-0 items-center px-4'>
                      <Image
                        className='h-8 w-auto'
                        src='/svg/logo-icon.svg'
                        alt='Story Starters'
                        width={32}
                        height={32}
                      />
                    </div>
                    <nav className='mt-5 space-y-1 px-2'>
                      {navigation.map((item) => {
                        if (item.name === 'Help Center') {
                          return (
                            <a
                              key={item.name}
                              href={item.href}
                              className={
                                typeof window != 'undefined' &&
                                window.location.pathname === item.href
                                  ? 'flex items-center rounded-md bg-primary-500 px-2 py-2 text-sm font-medium text-white'
                                  : 'flex items-center rounded-md px-2 py-2 text-sm font-medium text-black hover:bg-gray-100'
                              }
                            >
                              <item.icon
                                className={
                                  typeof window != 'undefined' &&
                                  window.location.pathname === item.href
                                    ? 'mr-4 h-6 w-6 flex-shrink-0 text-white'
                                    : 'mr-4 h-6 w-6 flex-shrink-0 text-black'
                                }
                                aria-hidden='true'
                              />
                              {item.name}
                            </a>
                          );
                        }
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={
                              typeof window != 'undefined' &&
                              window.location.pathname === item.href
                                ? 'flex items-center rounded-md bg-primary-500 px-2 py-2 text-sm font-medium text-white'
                                : 'flex items-center rounded-md px-2 py-2 text-sm font-medium text-black hover:bg-gray-100'
                            }
                          >
                            <item.icon
                              className={
                                typeof window != 'undefined' &&
                                window.location.pathname === item.href
                                  ? 'mr-4 h-6 w-6 flex-shrink-0 text-white'
                                  : 'mr-4 h-6 w-6 flex-shrink-0 text-black'
                              }
                              aria-hidden='true'
                            />
                            {item.name}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                  <div>
                    <SidebarCard />
                  </div>

                  <div className='flex flex-shrink-0 border-t border-gray-200 p-4'>
                    <div className='flex items-center'>
                      <div>
                        {/* <Image
                          className='inline-block h-10 w-10 rounded-full'
                          src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                          alt='Profile'
                          width={40}
                          height={40}
                        /> */}
                      </div>
                      <div className='ml-3'>
                        <p className='text-base font-medium text-gray-700'>
                          {user?.displayName}
                        </p>
                        <a
                          href='#'
                          className='group block flex-shrink-0'
                          onClick={logout}
                        >
                          <p className='text-sm font-medium text-red-400 group-hover:text-red-600'>
                            Logout
                          </p>
                        </a>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className='w-14 flex-shrink-0'>
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className='hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col'>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className='flex min-h-0 flex-1 flex-col bg-[#f4f4f4]'>
            <div className='flex flex-1 flex-col overflow-y-auto pt-5 pb-4'>
              <div className='flex flex-shrink-0 items-center px-4'>
                <Image
                  src='/svg/logo-icon.svg'
                  alt='Story Starters'
                  width={32}
                  height={32}
                />
              </div>
              <nav className='mt-5 flex-1 space-y-1 bg-[#f4f4f4] px-2'>
                {navigation.map((item) => {
                  if (item.name === 'Help Center') {
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        className={
                          typeof window != 'undefined' &&
                          window.location.pathname === item.href
                            ? 'flex items-center rounded-md bg-primary-500 px-2 py-2 text-sm font-medium text-white'
                            : 'flex items-center rounded-md px-2 py-2 text-sm font-medium text-black hover:bg-gray-200'
                        }
                      >
                        <item.icon
                          className={
                            typeof window != 'undefined' &&
                            window.location.pathname === item.href
                              ? 'mr-4 h-6 w-6 flex-shrink-0 text-white'
                              : 'mr-4 h-6 w-6 flex-shrink-0 text-black'
                          }
                          aria-hidden='true'
                        />
                        {item.name}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={
                        typeof window != 'undefined' &&
                        window.location.pathname === item.href
                          ? 'flex items-center rounded-md bg-primary-500 px-2 py-2 text-sm font-medium text-white'
                          : 'flex items-center rounded-md px-2 py-2 text-sm font-medium text-black hover:bg-gray-200'
                      }
                    >
                      <item.icon
                        className={
                          typeof window != 'undefined' &&
                          window.location.pathname === item.href
                            ? 'mr-3 h-6 w-6 flex-shrink-0 text-white'
                            : 'mr-3 h-6 w-6 flex-shrink-0 text-black'
                        }
                        aria-hidden='true'
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <SidebarCard />
            <div className='flex flex-shrink-0 border-t border-gray-400 p-4'>
              <div className='flex items-center'>
                <div>
                  {/* <Image
                    className='inline-block h-9 w-9 rounded-full'
                    src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                    alt='Profile'
                    width={36}
                    height={36}
                  /> */}
                </div>
                <div className='ml-3'>
                  <p className='text-sm font-medium text-gray-700'>
                    {user?.displayName}
                  </p>
                  <a
                    href='#'
                    className='group block w-full flex-shrink-0'
                    onClick={logout}
                  >
                    <p className='text-xs font-medium text-red-400 group-hover:text-red-600'>
                      Logout
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-1 flex-col md:pl-64'>
          <div className='sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden'>
            <button
              type='button'
              className='-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500'
              onClick={() => setSidebarOpen(true)}
            >
              <span className='sr-only'>Open sidebar</span>
              <HiBars3 className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <main className='flex-1'>
            <div className='min-h-screen py-6'>
              <div className='mx-auto px-4 sm:px-6 md:px-8'>
                <h1 className='text-4xl font-bold text-gray-900'>{title}</h1>
              </div>
              <div className='mx-auto px-4 sm:px-6 md:px-8'>{children}</div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
