import CharacterCount from '@tiptap/extension-character-count';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { Content, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  where,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDebounce } from 'use-debounce';

import useProjects from '@/hooks/useProjects';

import { TextEditorMenu } from './TextEditorMenu';
import { db } from '../../lib/firebaseClient';

type Props = {
  content: Content;
  docId: string | number | undefined;
};
const TextEditor = ({ content, docId }: Props) => {
  const router = useRouter();
  const { id } = router.query;
  const { projectLoading } = useProjects();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
          HTMLAttributes: {
            class: 'text-2xl font-bold',
          },
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      FontFamily,
      Underline,
      CharacterCount,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'border border-gray-300 py-4 px-6 h-screen',
      },
    },
    // async onUpdate({ editor }) {
    //   const html = editor.getHTML();
    //   const docRef = doc(db, `projects/${id}/documents/${docId}`);
    //   setDoc(docRef, { wordCount: editor.storage.characterCount.words(), node: { data: { content: html } } }, { merge: true });
    // },
    async onFocus() {
      const projectRef = doc(db, `projects/${id}`);
      const colRef = collection(db, `projects/${id}/documents`);

      const q = query(colRef, where('projectId', '==', id));

      try {
        await runTransaction(db, async (transaction) => {
          let wordCount = 0;
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.wordCount != undefined) {
              wordCount = wordCount + data.wordCount;
            }
          });

          const projectDoc = await transaction.get(projectRef);
          if (!projectDoc.exists()) {
            throw 'Document does not exist!';
          }

          // const newCount = projectDoc.data().wordCount + editor.storage.characterCount.words();
          transaction.update(projectRef, { wordCount: wordCount });
          return wordCount;
        });
      } catch (e: unknown) {
        throw new Error('Something went wrong');
      }
    },
  });
  const [debouncedEditor] = useDebounce(editor?.getHTML(), 500);
  useEffect(() => {
    if (debouncedEditor) {
      const html = editor?.getHTML();
      const docRef = doc(db, `projects/${id}/documents/${docId}`);
      setDoc(
        docRef,
        {
          wordCount: editor?.storage.characterCount.words(),
          node: { data: { content: html } },
        },
        { merge: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedEditor]);

  useEffect(() => {
    const save = async () => {
      if (editor != null) {
        const html = editor.getHTML();
        const wordCount = editor?.storage.characterCount.words();
        const docRef = doc(db, `projects/${id}/documents/${docId}`);
        await setDoc(
          docRef,
          { wordCount: wordCount, node: { data: { content: html } } },
          { merge: true }
        );
      }
    };
    const exitingFunction = async () => {
      await save();
    };

    router.events.on('routeChangeStart', exitingFunction);

    return () => {
      exitingFunction();
      router.events.off('routeChangeStart', exitingFunction);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exitingFunction = async (event: any) => {
      event.preventDefault();
      event.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', exitingFunction);
    return () => window.removeEventListener('beforeunload', exitingFunction);
  }, []);

  if (projectLoading) {
    return <p>Loading</p>;
  } else
    return (
      <div className='w-full'>
        <TextEditorMenu editor={editor} />
        <EditorContent editor={editor} />
      </div>
    );
};

export default TextEditor;
