import { AxiosError } from 'axios';
import { Card, Select } from 'flowbite-react';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { HiOutlineArrowPath, HiOutlineClipboard } from 'react-icons/hi2';

import axiosApiInstance from '@/lib/updateIdToken';
import useAuth from '@/hooks/useAuth';

import Button from '@/components/buttons/Button';
import Alert from '@/components/layout/Alert';
import Layout from '@/components/layout/Layout';

import { url } from '@/constant/url';
import { AlertContext } from '@/context/AlertState';

const genres = [
  {
    id: '1',
    name: 'Drama',
    value: 'drama',
  },
  {
    id: '2',
    name: 'Fantasy',
    value: 'fantasy',
  },
  {
    id: '3',
    name: 'Mystery',
    value: 'mystery',
  },
  {
    id: '4',
    name: 'Romance',
    value: 'romance',
  },
  {
    id: '5',
    name: 'Sci-Fi',
    value: 'sci-fi',
  },
];

const StoryIdeaGenerator = () => {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) {
    router.replace('/login');
  }
  const [loading, setLoading] = useState(false);
  const [storyIdea, setStoryIdea] = useState('');
  const [genre, setGenre] = useState('Drama');
  const alertContext = useContext(AlertContext);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenre(e.target.value);
  };

  const generateIdea = async () => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.post(
        `${url}/api/generate/story-idea-generator`,
        {
          uid: user?.uid,
          genre,
        }
      );
      setStoryIdea(res.data.choices[0].text);
      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        alertContext.addAlert(error.response?.data.message, 'error', 5000);
        if (
          error.response?.data.message ===
          'You have exceeded your monthly word limit.'
        ) {
          alertContext.setUpgradeModal();
        }
      } else {
        alertContext.addAlert('Something went wrong', 'error', 5000);
      }
      setLoading(false);
    }
  };
  return (
    <Layout title='Plot Generator'>
      <Alert />
      <div className='mx-auto lg:max-w-7xl '>
        <div className='mt-4 py-6'>
          <div className='my-3'>
            <p>Select a genre and hit generate to get a story idea.</p>
          </div>
          <div className='flex flex-row items-center space-x-4'>
            <Select color='bg-transparent' onChange={onChange}>
              {genres.map((genre) => {
                return (
                  <option key={genre.id} id={genre.id}>
                    {genre.name}
                  </option>
                );
              })}
            </Select>
            <Button onClick={generateIdea} isLoading={loading}>
              Generate{' '}
              <span>
                <HiOutlineArrowPath className=' ml-2 h-4 w-4' />
              </span>
            </Button>
          </div>
          <div className='mt-6'>
            {storyIdea ? (
              <Card>
                <div className='flex flex-row items-center justify-between'>
                  {storyIdea ? <p className='flex-grow'>{storyIdea}</p> : null}
                  <div className='px-1 '>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(storyIdea);
                        alertContext.addAlert(
                          'Copied to clipboard',
                          'info',
                          3000
                        );
                      }}
                    >
                      <HiOutlineClipboard className='h-5  w-5 hover:shadow-sm' />
                    </button>
                  </div>
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StoryIdeaGenerator;
