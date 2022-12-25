/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Dialog, Transition } from '@headlessui/react';
import { getDescendants, NodeModel } from '@minoru/react-dnd-treeview';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import {
  HiCheck,
  HiChevronDoubleRight,
  HiPencil,
  HiTrash,
  HiXMark,
} from 'react-icons/hi2';

import { db } from '@/lib/firebaseClient';
import useAuth from '@/hooks/useAuth';

import DeleteModal from '@/components/projects/DeleteModal';
import ProjectTree from '@/components/projects/ProjectTree';
import TextEditor from '@/components/projects/TextEditor';
import Skeleton from '@/components/Skeleton';

import { CustomData } from '@/types';

const Project = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<NodeModel<unknown>[]>([]);
  const [activeDocument, setActiveDocument] =
    useState<NodeModel<CustomData> | null>();
  const [activeEditor, setActiveEditor] = useState<React.ReactNode>(null);
  //@ts-ignore
  const [selectedNode, setSelectedNode] = useState<NodeModel<CustomData>>(null);
  const [visibleTextInput, setVisibleTextInput] = useState(false);
  const [title, setTitle] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, `projects/${id}/documents`),
      orderBy('index', 'asc')
    );
    return onSnapshot(q, async (snapshot) => {
      const arr: NodeModel<unknown>[] = [];
      snapshot.docs.map((doc) => {
        const obj = {
          id: doc.id,
          ...doc.data().node,
        };
        arr.push(obj);
      });
      setDocuments(arr);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db]);

  const handleSelect = (node: NodeModel<CustomData>) => {
    setSelectedNode(node);
    if (node.data?.fileType === 'document') {
      setLoading(true);
      setActiveDocument(node);
      setActiveEditor(null);
      setActiveEditor(
        <TextEditor key={node.id} content={node.data.content} docId={node.id} />
      );
      setLoading(false);
    }
    if (node.data?.fileType === 'folder') {
      setLoading(true);
      setActiveDocument(node);
      setActiveEditor(null);
      setLoading(false);
    }
  };

  const handleTextChange = async () => {
    if (title === '') {
      setVisibleTextInput(false);
      return;
    }
    const docRef = doc(db, `projects/${id}/documents/${activeDocument?.id}`);
    await setDoc(docRef, { node: { text: title } }, { merge: true });
    const newNode = { ...activeDocument, text: title };
    setActiveDocument(newNode as NodeModel<CustomData>);
    setVisibleTextInput(false);
    setTitle('');
  };
  const addDocument = async () => {
    const newDocument = {
      uid: user?.uid,
      projectId: id,
      index: 0,
      node: {
        parent: 0,
        droppable: false,
        text: 'New File',
        data: {
          fileType: 'document',
        },
      },
    };
    const colRef = collection(db, `projects/${id}/documents`);
    await addDoc(colRef, newDocument).then((d) => d.id);
  };

  const addFolder = async () => {
    const newFolder = {
      uid: user?.uid,
      projectId: id,
      index: 0,
      node: {
        parent: 0,
        droppable: true,
        text: 'added Folder',
        data: {
          fileType: 'folder',
        },
      },
    };
    const colRef = collection(db, `projects/${id}/documents`);
    await addDoc(colRef, newFolder).then((d) => d.id);
  };

  const handleDelete = async () => {
    const deleteIds = [
      activeDocument?.id,
      ...getDescendants(documents, activeDocument?.id as string).map(
        (node) => node.id
      ),
    ];
    setActiveEditor(null);
    setActiveDocument(null);
    deleteIds.map(async (docId) => {
      await deleteDoc(doc(db, `projects/${id}/documents/${docId}`));
    });
  };
  const handleShowDeleteModal = (value: boolean) => {
    setShowDeleteModal(value);
  };
  if (loading) () => <Skeleton />;

  return (
    <>
      <div className='flex h-screen'>
        <DeleteModal
          isOpen={showDeleteModal}
          handleShowModal={handleShowDeleteModal}
          handleDelete={handleDelete}
        />
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as='div'
            className='relative z-40 lg:hidden'
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
                <Dialog.Panel className='relative flex w-full max-w-xs flex-1 flex-col bg-white focus:outline-none'>
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
                      <Link href='/'>
                        <Image
                          className='h-8 w-auto'
                          src='/svg/logo-icon.svg'
                          alt='Story Starters'
                          width={32}
                          height={32}
                        />
                      </Link>
                    </div>
                    <nav aria-label='Sidebar' className='mt-5'>
                      <div className='space-y-1 px-2'>
                        {/* Project tree */}
                        <ProjectTree
                          addDocument={addDocument}
                          addFolder={addFolder}
                          documents={documents}
                          projectId={id as string}
                          handleSelect={handleSelect}
                          selectedNode={selectedNode}
                        />
                      </div>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className='w-14 flex-shrink-0' aria-hidden='true'>
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className='hidden lg:flex lg:flex-shrink-0'>
          <div className='flex w-72 flex-col'>
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className='flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-gray-100'>
              <div className='flex flex-1 flex-col overflow-y-auto pt-5 pb-4'>
                <div className='flex flex-shrink-0 items-center px-4'>
                  <Link href='/'>
                    <Image
                      className='h-8 w-auto'
                      src='/svg/logo-icon.svg'
                      alt='Story Starters'
                      width={32}
                      height={32}
                    />
                  </Link>
                </div>
                <nav className='mt-5 flex-1' aria-label='Sidebar'>
                  <div className='space-y-1 px-2'>
                    {/* Project tree */}
                    <ProjectTree
                      addDocument={addDocument}
                      addFolder={addFolder}
                      documents={documents}
                      projectId={id as string}
                      handleSelect={handleSelect}
                      selectedNode={selectedNode}
                    />
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
          <div className='lg:hidden'>
            <div className='flex items-center justify-between border-b border-gray-200 bg-gray-50 px-2 py-1.5'>
              <div>
                <button
                  type='button'
                  className='inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900'
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className='sr-only'>Open sidebar</span>
                  <HiChevronDoubleRight
                    className='h-6 w-6'
                    aria-hidden='true'
                  />
                </button>
              </div>
            </div>
          </div>
          <div className='relative z-0 flex flex-1 overflow-hidden'>
            <main className='relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last'>
              {/* Start main area*/}
              <div>
                <div className='flex h-16 flex-row items-center space-x-4 border-b border-black bg-white py-4 px-4 sm:px-6 lg:px-8'>
                  {!visibleTextInput ? (
                    <div className='flex w-full flex-row space-x-3'>
                      <h2 className='text-xl'>
                        {activeDocument
                          ? documents.find((x) => x.id === activeDocument.id)
                              ?.text
                          : null}
                      </h2>
                      {activeDocument ? (
                        <button
                          onClick={() => setVisibleTextInput(true)}
                          className='p-1 text-black hover:bg-gray-100'
                        >
                          <HiPencil className='h-4 w-4' />
                        </button>
                      ) : null}
                    </div>
                  ) : (
                    <div className='flex flex-row space-x-2'>
                      <input
                        type='text'
                        name='text'
                        id='text'
                        className='block w-full border-0 border-b border-transparent bg-gray-50 focus:border-primary-500 focus:ring-0 sm:text-sm'
                        defaultValue={activeDocument?.text}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <div className='flex flex-row text-black'>
                        <button
                          onClick={handleTextChange}
                          className='p-1 hover:bg-gray-100'
                        >
                          <HiCheck className='h-5 w-5' />
                        </button>
                        <button
                          onClick={() => {
                            setVisibleTextInput(false);
                            setTitle('');
                          }}
                          className='p-1 hover:bg-gray-100'
                        >
                          <HiXMark className='h-5 w-5' />
                        </button>
                      </div>
                    </div>
                  )}
                  {!visibleTextInput && activeDocument ? (
                    <div className='right-0 text-red-500 hover:bg-red-500 hover:text-white'>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className='p-1'
                      >
                        <HiTrash className='h-5 w-5' />
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className='absolute inset-0 mt-12 py-6 px-4 sm:px-6 lg:px-8'>
                  <div className='mx-auto h-full lg:max-w-5xl'>
                    {loading ? <p>loading</p> : activeEditor}
                  </div>
                </div>
              </div>

              {/* Workspace */}

              {/* End main area */}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Project;