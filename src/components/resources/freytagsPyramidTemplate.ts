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
        content:
          '<p>The beginning of the story, where the setting, characters, and the main conflicts are introduced. The audience is given the background information that they need to understand the story.</p>',
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
        content:
          '<p>This is the part of the story where the conflict and tension are built up. The protagonist is faced with a problem or challenge, and they begin to take actions to solve it. This is the part of the story where the audience gets to know the characters and their struggles.</p>',
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
        content:
          '<p>The turning point of the story, the highest point of tension. The protagonist reaches the climax where they face the most difficult challenge or conflict, this is the point where the story reaches its peak.</p>',
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
        content:
          '<p>The events that follow the climax, where the characters react to the climax and try to resolve the conflicts they faced, the tension decreases. The audience gets to see the aftermath of the climax and how the characters are affected by it.</p>',
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
        content:
          "<p>The end of the story, where the conflicts are resolved and the story comes to a close. The audience gets to see the final outcome and the consequences of the protagonist's actions, and how the characters' lives have been affected by the events of the story.</p>",
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
    projectName: "Freytag's Pyramid Template",
    projectDescription: "Write a story using freytag's pyramid story structure",
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
