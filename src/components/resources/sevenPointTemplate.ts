import { User } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { NextRouter } from 'next/router';

import { db } from '@/lib/firebaseClient';

const documents = [
  {
    id: 'lIPDwh0EMWJkz7hCoZda',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: 'Exposition',
    },
  },
  {
    id: 'O2wQWwMLJm8rfbQfFOzu',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: 'lIPDwh0EMWJkz7hCoZda',
      droppable: false,
      text: 'Exposition',
    },
  },
  {
    id: 'gywvfNvx0zqk2Gifpw15',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: 'Rising Action',
    },
  },
  {
    id: '17gHnCj5pwy1nFeFFMTX',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: 'gywvfNvx0zqk2Gifpw15',
      droppable: false,
      text: 'Rising Action',
    },
  },
  {
    id: 'tuU2PRA5pFJISbnh87Mn',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: 'Climax',
    },
  },
  {
    id: 'pyGXWYX3VIRVfl1LkfgN',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: 'tuU2PRA5pFJISbnh87Mn',
      droppable: false,
      text: 'Climax',
    },
  },
  {
    id: 'ZZBp39IQSTWj4fApuT65',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: 'Falling Action',
    },
  },
  {
    id: 'ouKnd70BlqfYa0wEGddB',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: 'ZZBp39IQSTWj4fApuT65',
      droppable: false,
      text: 'Falling Action',
    },
  },
  {
    id: '0rIIgBh5wzdAHALvbR8x',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: 'Denouement',
    },
  },
  {
    id: 'XV5hO9jEzAU0xnJaEee0',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: '0rIIgBh5wzdAHALvbR8x',
      droppable: false,
      text: 'Denouement',
    },
  },
];

const freytagsPyramidTemplate = async (user: User, router: NextRouter) => {
  const projectColRef = collection(db, 'projects');
  const sortingArray: string[] = [];
  const projectData = {
    uid: user.uid,
    projectName: 'Seven-Point Structure Template',
    projectDescription: 'Write a story using the seven-point story structure',
    dateCreated: new Date().toISOString(),
    lastOpened: Date.now(),
    wordCountGoal: 0,
  };
  const projectRef = await addDoc(projectColRef, projectData);
  // const documentsColRef = collection(projectRef, 'documents');

  documents.forEach(async (document) => {
    const data = {
      index: document.index,
      node: document.node,
      uid: user.uid,
      projectId: projectRef.id,
    };
    sortingArray.push(document.id);
    await setDoc(doc(projectRef, 'documents', document.id), data);
  });
  await setDoc(
    projectRef,
    {
      sort: sortingArray,
    },
    { merge: true }
  );
  router.push(`/projects/${projectRef.id}`);
};

export default freytagsPyramidTemplate;
