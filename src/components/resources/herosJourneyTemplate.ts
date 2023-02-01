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
        content:
          '<p>The protagonist is introduced in their normal life, before their adventure begins. We see their daily routine, their relationships, their fears and desires. This establishes the normal world the protagonist will leave and return to.</p>',
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
        content:
          "<p>An event or person disrupts the protagonist's normal life, presenting a problem, challenge, or opportunity that sets them on their journey. This call can take many forms, it could be something like a prophecy, a threat, or a desire to help others.</p>",
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
        content:
          "<p>The protagonist initially resists the call to adventure, often due to fear, uncertainty, or lack of self-confidence. This shows the protagonist's initial reluctance to change and their attachment to the safety and familiar of their normal life.</p>",
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
        content:
          '<p>The protagonist meets a guide or mentor who offers guidance, wisdom, and encouragement. This person can take many forms such as a wizard, a wise old man, or a spiritual guide. The mentor offers the protagonist tools and training for the journey ahead.</p>',
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
        content:
          '<p>The protagonist commits to the journey, leaving the ordinary world behind, and entering the special world. This marks the point of no return, and the protagonist must accept the consequences of their decision.</p>',
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
        content:
          "<p>The protagonist faces various tests and obstacles, meets allies, and enemies along the way. These challenges can be physical, mental, or spiritual, and they serve to test the protagonist's skills and determination. The allies and enemies the protagonist meets help to define their character, and can also offer help or hindrance to the journey.</p>",
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
        content:
          '<p>The protagonist reaches a crisis point and must confront their innermost fear or challenge. This is often symbolized as a journey into a dark and dangerous place, where the protagonist must face their deepest fear or insecurity.</p>',
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
        content:
          '<p>The protagonist suffers a major setback or faces their greatest challenge yet. This is often a moment of death and rebirth, and marks a turning point in the journey.</p>',
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
        content:
          '<p>The protagonist achieves a victory or discovers a new power or understanding. This can be a physical object, a new skill, or a deeper understanding of oneself or the world.</p>',
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
        content:
          '<p>The protagonist must return to the ordinary world, but with new knowledge or skills. This is a journey back home, with the new understanding, the protagonist acquired and the dangers they must overcome.</p>',
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
        content:
          "<p>The protagonist is transformed by their journey and is able to face a final test or challenge. This marks the protagonist's return to the normal world, but with a new understanding and perspective.</p>",
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
        content:
          '<p>The protagonist brings a new understanding or solution back to the ordinary world and shares it with others. This marks the end of the journey, and the protagonist can now live a new life, with the knowledge and skills they gained.</p>',
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
