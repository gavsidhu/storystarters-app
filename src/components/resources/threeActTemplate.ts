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
        content:
          "<p>We are introduced to the protagonist and their normal life, before the story's events begin. We see their daily routine, their relationships, their fears, and desires. This establishes the normal world the protagonist will leave and return to.</p>",
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
        content:
          "<p>An event or person disrupts the protagonist's normal life, presenting a problem, challenge, or opportunity that sets them on their journey. This event is the catalyst for the story and marks the beginning of the journey.</p>",
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
        content:
          '<p>The protagonist is faced with challenges, conflicts, and obstacles that they must overcome. These conflicts can be external (like fighting a villain) or internal (like overcoming a personal flaw). The protagonist begins to take actions to solve the problem introduced in the inciting incident.</p>',
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
        content:
          "<p>The protagonist reaches a turning point where they must make a significant decision or take a decisive action. This decision is a turning point and the story's direction is determined by this moment.</p>",
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
        content:
          '<p>The protagonist continues to face challenges, conflicts, and obstacles. They may experience setbacks and failures, but they learn new information and skills that will help them overcome the problem.</p>',
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
        content:
          "<p>The protagonist faces their final, most difficult challenge. All of their struggles come to a head in this moment, and the outcome is determined by the choices they've made and the skills they've acquired.</p>",
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
        content:
          "<p>The protagonist deals with the aftermath of the climax, and any loose ends are tied up. The protagonist may reflect on their journey and the lessons they've learned.</p>",
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
        content:
          "<p>The problem introduced in the inciting incident is resolved. The protagonist's journey is complete, and they have achieved their goal.</p>",
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
        content:
          "<p>The story concludes, and we see the protagonist's life after the journey. This can be used to show the protagonist's new life, and how the journey has changed them.</p>",
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
