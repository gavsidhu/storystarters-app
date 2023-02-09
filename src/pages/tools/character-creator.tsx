import { AxiosError } from 'axios';
import { Card, Label, Select, Textarea } from 'flowbite-react';
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

// const genres = [
//   {
//     id: '1',
//     name: 'Drama',
//     value: 'drama',
//   },
//   {
//     id: '2',
//     name: 'Fantasy',
//     value: 'fantasy',
//   },
//   {
//     id: '3',
//     name: 'Mystery',
//     value: 'mystery',
//   },
//   {
//     id: '4',
//     name: 'Romance',
//     value: 'romance',
//   },
//   {
//     id: '5',
//     name: 'Sci-Fi',
//     value: 'sci-fi',
//   },
// ];

const roles = [
  {
    id: '1',
    name: 'Protaganist',
  },
  {
    id: '2',
    name: 'Antagonist',
  },
  {
    id: '3',
    name: 'Secondary character',
  },
  {
    id: '4',
    name: 'Love interest',
  },
  // {
  //   id: '5',
  //   name: 'Foil',
  // },
  // {
  //   id: '6',
  //   name: 'Confidant',
  // },
  {
    id: '7',
    name: 'Tertiary character',
  },
];

const CharacterCreator = () => {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) {
    router.replace('/login');
  }
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    genre: 'Drama',
    role: 'Protaganist',
    plot: '',
  });
  const [character, setCharacter] = useState('');
  const alertContext = useContext(AlertContext);
  const onChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateCharacter = async () => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.post(
        `${url}/api/generate/character-creator`,
        {
          uid: user?.uid,
          // genre: formData.genre,
          role: formData.role,
          plot: formData.plot,
        }
      );

      setCharacter(res.data.choices[0].text);

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
    <Layout title='Character Creator'>
      <Alert />
      <div className='mx-auto lg:max-w-7xl '>
        <div className='mt-4 py-6'>
          <div className='my-3'>
            <p>Create a basic character profile for your story</p>
          </div>
          <div className='space-y-4'>
            {/* <div>
              <Label htmlFor='genre' value='Select a genre' />
              <Select color='bg-transparent' onChange={onChange} name='genre'>
                {genres.map((genre) => {
                  return (
                    <option key={genre.id} id={genre.id}>
                      {genre.name}
                    </option>
                  );
                })}
              </Select>
            </div> */}
            <div>
              <Label htmlFor='role' value='Select a role' />
              <Select color='bg-transparent' onChange={onChange} name='role'>
                {roles.map((role) => {
                  return (
                    <option key={role.id} id={role.id}>
                      {role.name}
                    </option>
                  );
                })}
              </Select>
            </div>
            <div>
              <Label htmlFor='plot' value='Enter your plot' />
              <Textarea
                className='resize-none !bg-transparent'
                name='plot'
                rows={6}
                onChange={onChange}
              />
            </div>
            <div>
              <Button onClick={generateCharacter} isLoading={loading}>
                Generate outline{' '}
                <span>
                  <HiOutlineArrowPath className=' ml-2 h-4 w-4' />
                </span>
              </Button>
            </div>
          </div>
          <div className='mt-6'>
            {character ? (
              <Card>
                <div className='flex flex-row items-center justify-between'>
                  {character ? (
                    <p className='flex-grow whitespace-pre-line'>{character}</p>
                  ) : null}
                  <div className='px-1 '>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(character);
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

export default CharacterCreator;
