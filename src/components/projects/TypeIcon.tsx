import React from 'react';
import { HiDocument, HiFolder } from 'react-icons/hi2';

type Props = {
  droppable: boolean | undefined;
  fileType?: string;
};

export const TypeIcon: React.FC<Props> = (props) => {
  if (props.droppable) {
    return <HiFolder />;
  }

  switch (props.fileType) {
    case 'document':
      return <HiDocument />;
    default:
      return null;
  }
};
