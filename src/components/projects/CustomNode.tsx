import { NodeModel } from '@minoru/react-dnd-treeview';
import Typography from '@mui/material/Typography';
import React from 'react';
import { HiChevronRight } from 'react-icons/hi2';

import styles from './CustomNode.module.css';

import { TypeIcon } from '@/components/projects/TypeIcon';

import { CustomData } from '@/types';

type Props = {
  node: NodeModel<CustomData>;
  depth: number;
  isOpen: boolean;
  isSelected: boolean;
  onToggle: (id: NodeModel['id']) => void;
  onSelect: (node: NodeModel<CustomData>) => void;
  // onTextChange: (id: NodeModel["id"], value: string) => void;
};

export const CustomNode: React.FC<Props> = (props) => {
  const { droppable, data } = props.node;

  const indent = props.depth * 24;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  const handleSelect = () => {
    props.onSelect(props.node);
  };
  return (
    <div
      className={`tree-node cursor-pointer ${styles.root} ${
        props.isSelected ? styles.isSelected : ''
      }`}
      style={{ paddingInlineStart: indent }}
      onClick={handleSelect}
    >
      <div
        className={`${styles.expandIconWrapper} ${
          props.isOpen ? styles.isOpen : ''
        }`}
      >
        {props.node.droppable && (
          <div onClick={handleToggle}>
            <HiChevronRight className='h-5 w-5 p-0.5' />
          </div>
        )}
      </div>
      <div>
        <TypeIcon droppable={droppable} fileType={data?.fileType} />
      </div>
      <div className={styles.labelGridItem}>
        <Typography variant='body2'>{props.node.text}</Typography>
      </div>
    </div>
  );
};
