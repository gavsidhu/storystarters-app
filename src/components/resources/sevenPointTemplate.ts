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
      text: 'Hook',
    },
  },
  {
    id: 'O2wQWwMLJm8rfbQfFOzu',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content:
          "<p>This is the opening scene that grabs the reader's attention and makes them want to keep reading. It sets the tone for the story and introduces the protagonist. The hook could be a question, a mystery, an action, a quote, an image, a dialogue or anything that creates suspense, interest, and intrigue.</p>",
      },
      parent: 'lIPDwh0EMWJkz7hCoZda',
      droppable: false,
      text: 'Hook',
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
      text: 'Plot Point 1',
    },
  },
  {
    id: '17gHnCj5pwy1nFeFFMTX',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content:
          "<p>This marks the turning point of the story, the event that propels the protagonist into action. This could be a decision, a discovery, a confrontation, an opportunity or a challenge that forces the protagonist to embark on the journey. This is where the protagonist's normal world is disrupted and the story's conflict is established.</p>",
      },
      parent: 'gywvfNvx0zqk2Gifpw15',
      droppable: false,
      text: 'Plot Point 1',
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
      text: 'Pinch Point 1',
    },
  },
  {
    id: 'pyGXWYX3VIRVfl1LkfgN',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content:
          "<p>This is the first confrontation that raises the stakes and makes the protagonist realize the consequences of their decision. The pinch point is where the protagonist is tested and their skills, beliefs, and values are challenged. The pinch point creates tension and increases the difficulty of the protagonist's journey.</p>",
      },
      parent: 'tuU2PRA5pFJISbnh87Mn',
      droppable: false,
      text: 'Pinch Point 1',
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
      text: 'Midpoint',
    },
  },
  {
    id: 'ouKnd70BlqfYa0wEGddB',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content:
          "<p>This is the halfway point of the story and the climax of the first act. It is a turning point that changes the protagonist's perspective and forces them to reassess their goals and their journey. The midpoint is where the protagonist realizes the true nature of the conflict and the significance of their journey.</p>",
      },
      parent: 'ZZBp39IQSTWj4fApuT65',
      droppable: false,
      text: 'Midpoint',
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
      text: 'Pinch Point 2',
    },
  },
  {
    id: 'XV5hO9jEzAU0xnJaEee0',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content:
          "<p>This is the second confrontation that increases the difficulty and danger of the protagonist's journey. The pinch point creates more tension and raises the stakes, putting the protagonist's goal in jeopardy.</p>",
      },
      parent: '0rIIgBh5wzdAHALvbR8x',
      droppable: false,
      text: 'Pinch Point 2',
    },
  },
  {
    id: 's8SA9S0H08sYP69RfGYF',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: 'Plot Point 2',
    },
  },
  {
    id: 'S8Fh86D8hd7D9Hhw86aB',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content:
          "<p>This marks the climax of the story and the resolution of the conflict. The plot point is the turning point that leads to the final showdown and the resolution of the story's conflict. It's the moment where the protagonist must use their skills, beliefs, and values to overcome the final obstacle and achieve their goal.</p>",
      },
      parent: 's8SA9S0H08sYP69RfGYF',
      droppable: false,
      text: 'Plot Point 2',
    },
  },
  {
    id: 'pP3fgBh5wzdgu89vbe0n',
    index: 0,
    node: {
      data: {
        fileType: 'folder',
      },
      droppable: true,
      parent: 0,
      text: 'Resolution',
    },
  },
  {
    id: 'oGF1hO9F0Oi3txnJag87',
    index: 0,
    node: {
      data: {
        fileType: 'document',
        content:
          "<p>This is the conclusion of the story, where the protagonist's journey is resolved and the story's conflict is resolved. The resolution shows the outcome of the protagonist's journey and the impact it had on their life. The resolution is where the reader gets to see the protagonist's growth, change, and the attainment of their goal.</p>",
      },
      parent: 'pP3fgBh5wzdgu89vbe0n',
      droppable: false,
      text: 'Resolution',
    },
  },
];

const sevenPointTemplate = async (user: User, router: NextRouter) => {
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

export default sevenPointTemplate;
