import { getBackendOptions, MultiBackend } from '@minoru/react-dnd-treeview';
import React from 'react';
//import { createDragDropManager } from 'dnd-core';
import { DndProvider } from 'react-dnd';
import { HTML5BackendOptions } from 'react-dnd-html5-backend';
import { TouchBackendOptions } from 'react-dnd-touch-backend';

type Props = {
  children: React.ReactNode;
};

const touchOptions: Partial<TouchBackendOptions> = {
  // some options
};

const html5Options: Partial<HTML5BackendOptions> = {
  // some options
};

const multiOptions = {
  touch: touchOptions,
  html5: html5Options,
};

//const DNDManager = createDragDropManager(HTML5Backend);
export const GlobalDndContext = ({ children }: Props) => {
  //const manager = useRef(DNDManager);
  // the following line solve the problem only with key property
  return (
    <DndProvider
      backend={MultiBackend}
      options={getBackendOptions(multiOptions)}
      key={1}
    >
      {children}
    </DndProvider>
  );
};

export default GlobalDndContext;
