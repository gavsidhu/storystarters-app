import { Dialog, Listbox, Transition } from '@headlessui/react';
import axios, { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';
import { doc, getDoc } from 'firebase/firestore';
import { Fragment, useContext, useState } from 'react';
import { HiCheck, HiChevronUpDown, HiXMark } from 'react-icons/hi2';

import { db } from '@/lib/firebaseClient';
import useAuth from '@/hooks/useAuth';

import Button from '@/components/buttons/Button';

import { url } from '@/constant/url';
import { AlertContext } from '@/context/AlertState';

type Props = {
  showModal: boolean;
  closeModal: () => void;
};

const pricing = {
  tiers: [
    {
      title: 'Starter',
      price: 15,
      priceId:
        process.env.NODE_ENV === 'development'
          ? 'price_1Lc1WiLPakXEuKcnVSOx0jtw'
          : 'price_1LtOTvLPakXEuKcnyPOmETux',
      frequency: '/month',
      description:
        'Get 20,000 AI generated words per month plus access to all tools and resources',
      features: [
        '20,000 words per month',
        'Plot generator',
        'Character creator',
        'Story outline generator',
        '7-day money-back guarantee',
      ],
      cta: 'Try for free',
      mostPopular: false,
    },
    {
      title: 'Standard',
      price: 60,
      priceId:
        process.env.NODE_ENV === 'development'
          ? 'price_1Lc1l2LPakXEuKcn3JGCiRFE'
          : 'price_1LtOU4LPakXEuKcnUFAsI3Yr',
      frequency: '/month',
      description:
        'Get 100,000 AI generated words per month plus access to all tools and resources',
      features: [
        '100,000 words per month',
        'Plot generator',
        'Character creator',
        'Story outline generator',
        '7-day money-back guarantee',
      ],
      cta: 'Try for free',
      mostPopular: false,
    },
    {
      title: 'Professional',
      price: 100,
      priceId:
        process.env.NODE_ENV === 'development'
          ? 'price_1LpIRZLPakXEuKcnk2O4yrEq'
          : 'price_1LtOU9LPakXEuKcnxqPU1DcG',
      frequency: '/month',
      description:
        'Get 200,000 AI generated words per month plus access to all tools and resources',
      features: [
        '200,000 words per month',
        'Plot generator',
        'Character creator',
        'Story outline generator',
        '7-day money-back guarantee',
      ],
      cta: 'Try for free',
      mostPopular: false,
    },
  ],
};

const oneTime = [
  {
    price: 5,
    aiWords: '5,000 words',
    priceId: 'price_1MZRh2LPakXEuKcnlvgJBcbT',
  },
  {
    price: 10,
    aiWords: '10,000 words',
    priceId: 'price_1MZRhXLPakXEuKcnlSWE3MXI',
  },
  {
    price: 25,
    aiWords: '25,000 words',
    priceId: 'price_1MZRi8LPakXEuKcntCZB7JwR',
  },
];
export default function UpgradeModal({ showModal, closeModal }: Props) {
  const { user } = useAuth();
  const alertContext = useContext(AlertContext);
  // const [loading, setLoading] = useState<boolean>(false);

  // function closeModal() {
  //   handleShowModal(false);
  // }

  const [selected, setSelected] = useState(oneTime[0]);

  const onPlanSelect = async (priceId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user?.uid as string));
      if (userDoc.data() === undefined) {
        throw new Error('User does not exist');
      }
      const customerId = userDoc?.data()?.stripeId;
      const checkoutSession = await axios.post(
        `${url}/api/payment/create-checkout-session`,
        {
          customerId,
          priceId,
        }
      );

      window.location.href = checkoutSession.data.url;
    } catch (error) {
      if (error instanceof Error) {
        alertContext.addAlert(error.message, 'error', 4000);
      }
      if (error instanceof AxiosError) {
        alertContext.addAlert(error.message, 'error', 4000);
      }
      if (error instanceof FirebaseError) {
        alertContext.addAlert(error.message, 'error', 4000);
      }
    }
  };

  const oneTimePurchase = async (priceId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user?.uid as string));
      if (userDoc.data() === undefined) {
        throw new Error('User does not exist');
      }
      const customerId = userDoc?.data()?.stripeId;
      const checkoutSession = await axios.post(
        `${url}/api/payment/create-checkout-session`,
        {
          customerId,
          priceId,
        }
      );

      window.location.href = checkoutSession.data.url;
    } catch (error) {
      if (error instanceof Error) {
        alertContext.addAlert(error.message, 'error', 4000);
      }
      if (error instanceof AxiosError) {
        alertContext.addAlert(error.message, 'error', 4000);
      }
      if (error instanceof FirebaseError) {
        alertContext.addAlert(error.message, 'error', 4000);
      }
    }
  };
  return (
    <Transition.Root show={showModal} as={Fragment}>
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
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto '>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:px-4 sm:py-6'>
                <div className='absolute top-0 right-0 hidden pt-4 pr-4 sm:block'>
                  <button
                    type='button'
                    className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none'
                    onClick={closeModal}
                  >
                    <span className='sr-only'>Close</span>
                    <HiXMark className='h-6 w-6' aria-hidden='true' />
                  </button>
                </div>
                <div className='flex sm:items-start md:block'>
                  <div className='mt-3 space-y-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                    <div className='space-y-2'>
                      <Dialog.Title
                        as='h3'
                        className='text-lgxl font-bold leading-6 text-black'
                      >
                        Upgrade your account
                      </Dialog.Title>
                      <p className='text-sm'>
                        You've run out of AI generated words. Please upgrade to
                        a subscription plan or add more AI generated words.
                      </p>
                    </div>
                    <div className='mt-2'>
                      <p className='mt-3 mb-3 font-medium'>Choose a plan</p>
                      <div className='space-y-3'>
                        {pricing.tiers.map((tier) => {
                          return (
                            <div
                              key={tier.title}
                              className='cardShadow w-full rounded-2xl bg-white px-3 py-3'
                            >
                              <div className='flex-row items-center justify-between space-y-4 md:flex'>
                                <div className='space-y-2 px-3'>
                                  <div className='flex flex-row items-center space-x-3 text-left'>
                                    <h4 className='gont-bold'>{tier.title}</h4>
                                    <p className='flex items-center font-semibold text-black'>
                                      <span className='text-base '>
                                        ${tier.price}
                                      </span>
                                      <span className='ml-1 text-xs'>
                                        {tier.frequency}
                                      </span>
                                    </p>
                                  </div>
                                  <p className='text-left text-sm'>
                                    {tier.description}
                                  </p>
                                </div>
                                <div>
                                  <Button
                                    onClick={() => onPlanSelect(tier.priceId)}
                                    variant='outline'
                                  >
                                    Upgrade
                                  </Button>
                                </div>
                              </div>
                              <div></div>
                            </div>
                          );
                        })}
                      </div>
                      <div className='relative mt-6'>
                        <div className='absolute inset-0 flex items-center'>
                          <div className='w-full border-t border-gray-300' />
                        </div>
                        <div className='relative flex justify-center text-sm'>
                          <span className='bg-white px-2 text-gray-500'>
                            Or
                          </span>
                        </div>
                      </div>
                      <div className='mt-3 text-center'>
                        <div className='cardShadow w-full rounded-2xl bg-white px-3 py-3'>
                          <div className='flex-row items-center justify-between space-y-4 md:flex'>
                            <div className='flex-grow space-y-2 px-3'>
                              <div className='flex flex-row items-center space-x-3 text-left'>
                                <h4 className='gont-bold'>One-time purchase</h4>
                                <p className='flex items-center font-semibold text-black'>
                                  ${selected.price}
                                </p>
                              </div>
                              <div className='flex w-full grow flex-row items-center space-x-2'>
                                <p className='text-md text-left'>Add</p>
                                <div className='w-full px-2'>
                                  <Listbox
                                    value={selected}
                                    onChange={setSelected}
                                  >
                                    <div className='relative mt-1'>
                                      <Listbox.Button className='relative w-full cursor-default rounded-lg border bg-white py-1 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
                                        <span className='block truncate'>
                                          {selected.aiWords}
                                        </span>
                                        <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                                          <HiChevronUpDown
                                            className='h-5 w-5 text-gray-400'
                                            aria-hidden='true'
                                          />
                                        </span>
                                      </Listbox.Button>
                                      <Transition
                                        as={Fragment}
                                        leave='transition ease-in duration-100'
                                        leaveFrom='opacity-100'
                                        leaveTo='opacity-0'
                                      >
                                        <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                                          {oneTime.map((plan, index) => (
                                            <Listbox.Option
                                              key={index}
                                              className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                  active
                                                    ? 'bg-primary-100 text-primary-900'
                                                    : 'text-gray-900'
                                                }`
                                              }
                                              value={plan}
                                            >
                                              {({ selected }) => (
                                                <>
                                                  <span
                                                    className={`block truncate ${
                                                      selected
                                                        ? 'font-medium'
                                                        : 'font-normal'
                                                    }`}
                                                  >
                                                    {plan.aiWords}
                                                  </span>
                                                  {selected ? (
                                                    <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600'>
                                                      <HiCheck
                                                        className='h-5 w-5'
                                                        aria-hidden='true'
                                                      />
                                                    </span>
                                                  ) : null}
                                                </>
                                              )}
                                            </Listbox.Option>
                                          ))}
                                        </Listbox.Options>
                                      </Transition>
                                    </div>
                                  </Listbox>
                                </div>
                              </div>
                            </div>
                            <div className=''>
                              <Button
                                onClick={() =>
                                  oneTimePurchase(selected.priceId)
                                }
                                variant='outline'
                              >
                                Continue
                              </Button>
                            </div>
                          </div>
                          <div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
                  <button
                    type='button'
                    className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm'
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
