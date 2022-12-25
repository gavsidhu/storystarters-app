import { Editor } from '@tiptap/react';
import axios from 'axios';
import { Select, Spinner } from 'flowbite-react';
import React, { useState } from 'react';
import {
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaHeading,
  FaItalic,
  FaParagraph,
  FaUnderline,
} from 'react-icons/fa';

import Button from '@/components/buttons/Button';

type Props = {
  editor: Editor | null;
};

const fonts = [
  {
    id: '1',
    name: 'Times New Roman',
  },
  {
    id: '2',
    name: 'Arial',
  },
  {
    id: '3',
    name: 'Inter',
  },
];
export const TextEditorMenu = ({ editor }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const fontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    editor?.chain().focus().setFontFamily(e.target.value).run();
  };
  const onExpand = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const text =
      typeof window != 'undefined' ? window?.getSelection()?.toString() : '';
    if (text === undefined) {
      return;
    }

    if (text.length > 0 && text) {
      try {
        const res = await axios.post(
          `http://localhost:3000/api/generate/expand`,
          {
            text: text,
          }
        );

        const resText = res.data.choices[0].text.replace(
          /(\r\n|\r|\n){2,}/g,
          '$1\n'
        );
        const resArr = resText.split(/\r?\n/);

        for (let i = 0; i < resArr.length; i++) {
          editor?.commands.insertContentAt(
            editor?.state.selection.ranges[0].$to.pos,
            `<p>${resArr[i]}</p>`,
            {
              updateSelection: true,
              parseOptions: {
                preserveWhitespace: false,
              },
            }
          );
        }
      } catch (error) {
        throw new Error('Something went wrong');
      }
    }
  };
  return (
    <div className='overflow-x-auto'>
      <div className='flex w-full flex-row items-center space-x-4 py-2'>
        <div className='w-1/4'>
          <Select onChange={fontChange}>
            {fonts.map((font) => {
              return (
                <option key={font.id} id={font.id}>
                  {font.name}
                </option>
              );
            })}
          </Select>
        </div>
        <div className='flex w-1/2 flex-1 flex-row items-center space-x-4'>
          <div className=''>
            <button
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor?.isActive('heading') ? 'is-active' : 'menuButton'
              }
            >
              <FaHeading className='h-[20px] w-[20px]' />
            </button>
          </div>
          <div className=''>
            <button
              onClick={() => editor?.chain().focus().setParagraph().run()}
              className={
                editor?.isActive('paragraph') ? 'is-active' : 'menuButton'
              }
            >
              <FaParagraph className='h-[20px] w-[20px]' />
            </button>
          </div>
          <div className=''>
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={editor?.isActive('bold') ? 'is-active' : 'menuButton'}
            >
              <FaBold className='h-[20px] w-[20px]' />
            </button>
          </div>
          <div className=''>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={
                editor?.isActive('italic') ? 'is-active' : 'menuButton'
              }
            >
              <FaItalic className='h-[20px] w-[20px]' />
            </button>
          </div>
          <div className=''>
            <button
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={
                editor?.isActive('underline') ? 'is-active' : 'menuButton'
              }
            >
              <FaUnderline className='h-[20px] w-[20px]' />
            </button>
          </div>
          <div className=''>
            <button
              onClick={() => editor?.chain().focus().setTextAlign('left').run()}
              className={
                editor?.isActive({ textAlign: 'left' })
                  ? 'is-active'
                  : 'menuButton'
              }
            >
              <FaAlignLeft className='h-[20px] w-[20px]' />
            </button>
          </div>
          <div className=''>
            <button
              onClick={() =>
                editor?.chain().focus().setTextAlign('center').run()
              }
              className={
                editor?.isActive({ textAlign: 'center' })
                  ? 'is-active'
                  : 'menuButton'
              }
            >
              <FaAlignCenter className='h-[20px] w-[20px]' />
            </button>
          </div>
          <div className=''>
            <button
              onClick={() =>
                editor?.chain().focus().setTextAlign('right').run()
              }
              className={
                editor?.isActive({ textAlign: 'right' })
                  ? 'is-active'
                  : 'menuButton'
              }
            >
              <FaAlignRight className='h-[20px] w-[20px]' />
            </button>
          </div>
          <div>
            <Button
              onClick={() => setLoading(true)}
              variant='outline'
              className='py-1'
            >
              Rewrite
            </Button>
          </div>
          <div>
            <Button onClick={onExpand} variant='outline' className='py-1'>
              Expand
            </Button>
            {loading ? (
              <div className='mr-3'>
                <Spinner />
              </div>
            ) : null}
          </div>
          <div>Words: {editor?.storage.characterCount.words()}</div>
        </div>
      </div>
    </div>
  );
};
