import { User } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { NextRouter } from 'next/router';

import { db } from '@/lib/firebaseClient';

const documents = [
  {
    id: '2uwkUKoRNhANO8w9zTaM',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: 'Act I',
    },
  },
  {
    id: '9IQKYwzMJT31MLcVM0Hs',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: '2uwkUKoRNhANO8w9zTaM',
      droppable: false,
      text: 'Introduction',
    },
  },
  {
    id: 'PzDGX0uO4QOTxfF8OCNd',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: '2uwkUKoRNhANO8w9zTaM',
      droppable: false,
      text: 'Inciting Incident',
    },
  },
  {
    id: '49BgpPmzR6TnweaowBjT',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: '2uwkUKoRNhANO8w9zTaM',
      droppable: false,
      text: 'Rising Action',
    },
  },
  {
    id: '9bd6kcdIGjhcGHMZ2GDN',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: 'Act II',
    },
  },
  {
    id: 'NHKr7WcusEVHaFFwW4uj',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: '9bd6kcdIGjhcGHMZ2GDN',
      droppable: false,
      text: 'Midpoint',
    },
  },
  {
    id: 'WcgQZgLImvmVuUK87WOO',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: '9bd6kcdIGjhcGHMZ2GDN',
      droppable: false,
      text: 'Rising Action',
    },
  },
  {
    id: 'pqAKWPYuJTgC3cvPAjMM',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: '9bd6kcdIGjhcGHMZ2GDN',
      droppable: false,
      text: 'Climax',
    },
  },
  {
    id: 'ZXe1qXGbCPgmFIQLARgM',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: 'Act III',
    },
  },
  {
    id: 'fxamJVboVSKEmIgdSUlI',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: 'ZXe1qXGbCPgmFIQLARgM',
      droppable: false,
      text: 'Falling Action',
    },
  },
  {
    id: 'EUCxQ1NxtdqfOgFkg5jM',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: 'ZXe1qXGbCPgmFIQLARgM',
      droppable: false,
      text: 'Resolution',
    },
  },
  {
    id: '2x56o3V4jHFMFVsw0Al7',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: 'ZXe1qXGbCPgmFIQLARgM',
      droppable: false,
      text: 'Denouement',
    },
  },
];

const threeActTemplate = async (user: User, router: NextRouter) => {
  const projectColRef = collection(db, 'projects');
  const sortingArray: string[] = [];
  const projectData = {
    uid: user.uid,
    projectName: 'Three Act Structure Template',
    projectDescription: 'Write a story using the three act story structure',
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

export default threeActTemplate;
