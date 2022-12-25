import { Menu } from '@headlessui/react';
import { NodeModel, Tree } from '@minoru/react-dnd-treeview';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { doc, DocumentData, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  HiDocument,
  HiDocumentPlus,
  HiFolder,
  HiFolderPlus,
} from 'react-icons/hi2';

import styles from './Main.module.css';

import { db } from '@/lib/firebaseClient';

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
  const [treeData, setTreeData] = useState<NodeModel<unknown>[]>();
  const [project, setProject] = useState<DocumentData | undefined>();
  const [sortingArray, setSortingArray] = useState<DocumentData>([]);

  useEffect(() => {
    const setSort = async () => {
      const docRef = doc(db, `projects/${projectId}`);
      const docSnap = (await getDoc(docRef)).data();
      setSortingArray(docSnap?.sort);
    };
    setSort();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeData]);

  const handleDrop = async (newTree: NodeModel[]) => {
    const arr = [];
    for (let i = 0; i < newTree.length; i++) {
      arr.push(newTree[i].id);
    }

    const docRef = doc(db, `projects/${projectId}`);

    await setDoc(docRef, { sort: arr }, { merge: true });
    setTreeData(newTree);
  };

  useEffect(() => {
    const getProject = async () => {
      const docRef = doc(db, `projects/${projectId}`);
      const docSnap = (await getDoc(docRef)).data();
      setProject(docSnap);
    };

    getProject();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore

  return (
    <ThemeProvider theme={theme}>
      <div className='flex flex-row'>
        <h2 className='flex-1'>{project?.projectName}</h2>
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
