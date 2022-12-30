import { Content } from '@tiptap/react';
export interface Project {
  id: string;
  userId: string;
  projectName: string;
  projectDescription: string;
  wordCountGoal: string | number;
  wordCount: string | number;
  dateCreated: string | Date;
  lastOpened: string | Date;
}

export type CustomData = {
  fileType: string;
  fileSize: string;
  content: Content;
} | null;

export type DocumentModel = {
  id?: string | number;
  projectId: string;
  userId: string;
  node: {
    parent: string | number;
    droppable: boolean;
    text: string;
    data: {
      content: string;
      fileSize: string;
      fileType: string;
    };
  };
};

export type Alert = {
  id: string;
  msg: string;
  type: string;
};
