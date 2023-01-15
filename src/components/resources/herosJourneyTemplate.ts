import { User } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { NextRouter } from 'next/router';

import { db } from '@/lib/firebaseClient';

const documents = [
  {
    id: 'ywvqDv3rJiAn6TaRyeT0',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: '1. The Ordinary World',
    },
  },
  {
    id: 'aLyKWQLSchwKtY29Htco',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: 'ywvqDv3rJiAn6TaRyeT0',
      droppable: false,
      text: 'The Ordinary World',
    },
  },
  {
    id: 'inEM6jGwZfJv05ugezhN',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: '2. The Call to Adventure',
    },
  },
  {
    id: '6Pb3egGFvGJnEzQPZ7Qh',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: 'inEM6jGwZfJv05ugezhN',
      droppable: false,
      text: 'The Call to Adventure',
    },
  },
  {
    id: 'ToWckUlFF9kIdtPwWU3H',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: '3. Refusal of the Call',
    },
  },
  {
    id: 'mJj85s63AR4Z8TzGt7DN',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: 'ToWckUlFF9kIdtPwWU3H',
      droppable: false,
      text: 'Refusal of the Call',
    },
  },
  {
    id: '1OdFAOvkqCRKXmFEznvj',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: '4. Meeting with the Mentor',
    },
  },
  {
    id: 'xhEWzVXisOYGODIBFR7C',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: '1OdFAOvkqCRKXmFEznvj',
      droppable: false,
      text: 'Meeting with the Mentor',
    },
  },
  {
    id: 'f0qFRYz5LnxGCgKdbmea',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: '5. Crossing the Threshold',
    },
  },
  {
    id: 'lk6Q78u3EEDc2jjoCliP',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: 'f0qFRYz5LnxGCgKdbmea',
      droppable: false,
      text: 'Crossing the Threshold',
    },
  },
  {
    id: 'czPTIomgAg0IxvJipjPW',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: '6. Tests, Allies, Enemies',
    },
  },
  {
    id: 'ftwbtGv8Ctp42kPlfvPU',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: 'czPTIomgAg0IxvJipjPW',
      droppable: false,
      text: 'Tests, Allies, Enemies',
    },
  },
  {
    id: 'ouIO52YWi0kpNeMOlKU8',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: '7. Approach to the Innermost Cave',
    },
  },
  {
    id: 'S02uhHa2J5xBBqQVd9Hh',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: 'ouIO52YWi0kpNeMOlKU8',
      droppable: false,
      text: 'Approach to the Innermost Cave',
    },
  },
  {
    id: '5vLyTYC6S2aSUd6vfE48',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: '8. Ordeal',
    },
  },
  {
    id: 'Y6UfCcZfiMQLc4k0VdoQ',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: '5vLyTYC6S2aSUd6vfE48',
      droppable: false,
      text: 'Ordeal',
    },
  },
  {
    id: '6nLrfAc5vYNlA9C653Mk',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: '9. Reward',
    },
  },
  {
    id: 'hky7sJOGvD7AWDabLXnb',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: '6nLrfAc5vYNlA9C653Mk',
      droppable: false,
      text: 'Reward',
    },
  },
  {
    id: 'gTc4bxlcmOpbBLwb22I7',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: '10. The Road Back',
    },
  },
  {
    id: 'FbNZJYRn2eR3P70ZgQul',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: 'gTc4bxlcmOpbBLwb22I7',
      droppable: false,
      text: 'The Road Back',
    },
  },
  {
    id: 'sSaiWxOjChtV0ndbK34T',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: '11. Resurrection',
    },
  },
  {
    id: 'Ao6tzxQoERH2GFYd0g7O',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: 'sSaiWxOjChtV0ndbK34T',
      droppable: false,
      text: 'Resurrection',
    },
  },
  {
    id: 'uDxJ7QXO1UdGFiebi3K5',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: '12. Return with the Elixir',
    },
  },
  {
    id: 'KshMLwECdAkzXnApNj6n',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content: '<p>Test</p>',
      },
      parent: 'uDxJ7QXO1UdGFiebi3K5',
      droppable: false,
      text: 'Return with the Elixir',
    },
  },
];

const herosJourneyTemplate = async (user: User, router: NextRouter) => {
  const projectColRef = collection(db, 'projects');
  const sortingArray: string[] = [];
  const projectData = {
    uid: user.uid,
    projectName: "Hero's Journey Template",
    projectDescription:
      "Write a story using the hero's journey story structure",
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

export default herosJourneyTemplate;
