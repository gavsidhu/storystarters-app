import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

type Props = {
  isOpen: boolean;
  handleShowModal: (value: boolean) => void;
  handleDelete: () => void;
};
export default function DeleteModal({
  isOpen,
  handleShowModal,
  handleDelete,
}: Props) {
  function closeModal() {
    handleShowModal(false);
  }
  const deleteFile = async () => {
    handleDelete();
    handleShowModal(false);
  };
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
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
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    Are you sure you want to delete this item?
                  </Dialog.Title>
                  <div className='mt-2'>
                    <p className='text-sm text-gray-500'>
                      This action cannot be undone.
                    </p>
                  </div>

                  <div className='mt-4 space-x-3'>
                    <button
                      type='button'
                      className='inline-flex justify-center rounded-md border border-black bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      className='inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      onClick={() => deleteFile()}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
