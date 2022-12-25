import { NodeModel } from '@minoru/react-dnd-treeview';
import React from 'react';

type Props = {
  node: NodeModel;
  depth: number;
};

export const Placeholder: React.FC<Props> = (props) => {
  const left = props.depth * 24;
  return (
    <div
      className='absolute right-0 top-0 h-[2px] bg-black'
      style={{ left }}
    ></div>
  );
};
