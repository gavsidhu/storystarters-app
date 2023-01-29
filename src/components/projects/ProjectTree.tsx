import { Menu } from '@headlessui/react';
import { DropOptions, NodeModel, Tree } from '@minoru/react-dnd-treeview';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import { doc, DocumentData, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  HiDocument,
  HiDocumentPlus,
  HiFolder,
  HiFolderPlus,
} from 'react-icons/hi2';

import styles from './Main.module.css';

import { db } from '@/lib/firebaseClient';
import useAuth from '@/hooks/useAuth';

import PlusDropdown from '@/components/dropdown/PlusDropdown';
import { CustomNode } from '@/components/projects/CustomNode';
import { Placeholder } from '@/components/projects/Placeholder';

import { CustomData } from '@/types';

export const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          margin: 0,
          padding: 0,
        },
        'html, body, #root': {
          height: '100%',
        },
        ul: {
          listStyle: 'none',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: { verticalAlign: 'middle' },
      },
    },
  },
});

type Props = {
  projectId: string;
  addFolder: () => void;
  addDocument: () => void;
  handleSelect: (node: NodeModel<CustomData>) => void;
  documents: NodeModel<unknown>[];
  selectedNode: NodeModel<CustomData>;
};

const ProjectTree = ({
  projectId,
  addFolder,
  addDocument,
  documents,
  handleSelect,
  selectedNode,
}: Props) => {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) {
    router.replace('/login');
  }
  const [treeData, setTreeData] = useState<NodeModel<unknown>[]>();
  const [project, setProject] = useState<DocumentData | undefined>();
  const [sortingArray, setSortingArray] = useState<DocumentData>([]);

  useEffect(() => {
    try {
      const setSort = async () => {
        try {
          const docRef = doc(db, `projects/${projectId}`);
          const docSnap = (await getDoc(docRef)).data();
          setSortingArray(docSnap?.sort);
        } catch (error) {
          if (error instanceof FirebaseError) {
            return;
          }
        }
      };
      setSort();
    } catch (error) {
      if (error instanceof FirebaseError) {
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeData]);

  const handleDrop = async (
    newTree: NodeModel[],
    { dragSourceId, dropTargetId }: DropOptions<unknown>
  ) => {
    const docRef = doc(db, `projects/${projectId}/documents/${dragSourceId}`);
    await setDoc(docRef, { node: { parent: dropTargetId } }, { merge: true });

    const arr = [];
    for (let i = 0; i < newTree.length; i++) {
      arr.push(newTree[i].id);
    }

    const projRef = doc(db, `projects/${projectId}`);

    await setDoc(projRef, { sort: arr }, { merge: true });
    setTreeData(newTree);
  };

  useEffect(() => {
    try {
      const getProject = async () => {
        try {
          const docRef = doc(db, `projects/${projectId}`);
          const docSnap = (await getDoc(docRef)).data();
          setProject(docSnap);
        } catch (error) {
          if (error instanceof FirebaseError) {
            return;
          }
        }
      };

      getProject();
    } catch (error) {
      if (error instanceof FirebaseError) {
        return;
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return (
    <ThemeProvider theme={theme}>
      <div className='flex flex-col space-y-3'>
        <h2 className='flex-1 text-xl'>{project?.projectName}</h2>
        {project?.wordCountGoal > 0 ? (
          <div>
            <div className='mb-1 flex justify-between'>
              <span className='text-base font-medium text-black'>
                {project?.wordCount}/{parseInt(project?.wordCountGoal)} words
              </span>
              <span className='text-sm font-medium text-black'>{`${Math.round(
                (project?.wordCount / parseInt(project?.wordCountGoal)) * 100
              )}%`}</span>
            </div>
            <div className='h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
              <div
                className='h-2.5 max-w-[100%] rounded-full bg-primary-600'
                style={{
                  width: `${
                    (project?.wordCount / parseInt(project?.wordCountGoal)) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        ) : null}

        <PlusDropdown>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-primary-500 text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={addFolder}
              >
                {active ? (
                  <HiFolderPlus className='mr-2 h-5 w-5' aria-hidden='true' />
                ) : (
                  <HiFolder className='mr-2 h-5 w-5' aria-hidden='true' />
                )}
                Add folder
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-primary-500 text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={addDocument}
              >
                {active ? (
                  <HiDocumentPlus className='mr-2 h-5 w-5' aria-hidden='true' />
                ) : (
                  <HiDocument className='mr-2 h-5 w-5' aria-hidden='true' />
                )}
                Add document
              </button>
            )}
          </Menu.Item>
        </PlusDropdown>
      </div>
      <CssBaseline />
      <div className={styles.app}>
        <Tree
          tree={
            sortingArray
              ? documents.sort(
                  (a, b) =>
                    sortingArray.indexOf(a.id) - sortingArray.indexOf(b.id)
                )
              : documents
          }
          rootId={0}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          render={(
            node: NodeModel<CustomData>,
            { depth, isOpen, onToggle }
          ) => (
            <CustomNode
              node={node}
              depth={depth}
              isOpen={isOpen}
              isSelected={node.id === selectedNode?.id}
              onToggle={onToggle}
              onSelect={handleSelect}
            />
          )}
          onDrop={handleDrop}
          classes={{
            root: styles.treeRoot,
            draggingSource: styles.draggingSource,
            dropTarget: styles.dropTarget,
            placeholder: styles.placeholderContainer,
          }}
          sort={false}
          insertDroppableFirst={false}
          canDrop={(tree, { dragSource, dropTargetId }) => {
            if (dragSource?.parent === dropTargetId) {
              return true;
            }
          }}
          dropTargetOffset={6}
          placeholderRender={(node, { depth }) => (
            <Placeholder node={node} depth={depth} />
          )}
        />
      </div>
    </ThemeProvider>
  );
};

export default ProjectTree;
