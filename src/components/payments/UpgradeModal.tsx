import { Dialog, Transition } from '@headlessui/react';
import { Card } from 'flowbite-react';
import { Fragment } from 'react';
import { HiXMark } from 'react-icons/hi2';

import Button from '@/components/buttons/Button';

type Props = {
  isOpen: boolean;
  handleShowModal: (value: boolean) => void;
};
export default function UpgradeModal({ isOpen, handleShowModal }: Props) {
  // const { user } = useAuth();
  // const [loading, setLoading] = useState<boolean>(false);
  // const [open, setOpen] = useState(true)

  function closeModal() {
    handleShowModal(false);
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={setOpen}>
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

        <div className='fixed inset-0 z-10 overflow-y-auto'>
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
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
                  <div className='mt-3 space-y-6 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                    <Dialog.Title
                      as='h3'
                      className='text-lg font-medium leading-6 text-gray-900'
                    >
                      Upgrade
                    </Dialog.Title>
                    <div className='mt-2'>
                      <Card className='w-full'>
                        <div className='flex-row items-center justify-between space-y-4 md:flex'>
                          <div className='space-y-2'>
                            <div className='flex flex-row items-center space-x-1 text-left'>
                              <h4>Test</h4>
                              <p>$10</p>
                            </div>
                            <p className='text-left text-sm'>
                              Get an additional 10,000 A.I generated words
                            </p>
                          </div>
                          <div>
                            <Button>Continue</Button>
                          </div>
                        </div>
                      </Card>
                      <div className='relative flex justify-center text-sm'>
                        <span className='mt-3 bg-white px-2 text-gray-500'>
                          Or
                        </span>
                      </div>
                      <div className='mt-3 text-center'>
                        <Button variant='outline'>Upgrade plan</Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
                  <button
                    type='button'
                    className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm'
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
