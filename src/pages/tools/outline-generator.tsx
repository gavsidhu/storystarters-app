import { AxiosError } from 'axios';
import { Card, Textarea } from 'flowbite-react';
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

const OutlineGenerator = () => {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) {
    router.replace('/login');
  }
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [outline, setOutline] = useState('');
  const alertContext = useContext(AlertContext);

  const generateOutline = async () => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.post(
        `${url}/api/generate/outline-generator`,
        {
          uid: user?.uid,
          text: textInput,
        }
      );
      const resText = res.data.choices[0].text.replace(
        /(\r\n|\r|\n){2,}/g,
        '$1\n'
      );

      setOutline(resText.replace(/^\s+|\s+$/g, ''));

      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        alertContext.addAlert(error.message, 'error', 5000);
      } else {
        alertContext.addAlert('Something went wrong', 'error', 5000);
      }
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };
  return (
    <Layout title='Outline Generator'>
      <Alert />
      <div className='mx-auto lg:max-w-7xl '>
        <div className='mt-4 py-6'>
          <div className='my-3'>
            <p>Enter a story idea or plot to generate an outline</p>
          </div>
          <div className='space-y-3'>
            <Textarea
              className='resize-none !bg-transparent'
              rows={6}
              onChange={onChange}
            />
            <Button onClick={generateOutline} isLoading={loading}>
              Generate outline{' '}
              <span>
                <HiOutlineArrowPath className=' ml-2 h-4 w-4' />
              </span>
            </Button>
          </div>
          <div className='mt-6'>
            {outline ? (
              <Card>
                <div className='flex flex-row items-center justify-between'>
                  {outline ? (
                    <p className='flex-grow whitespace-pre-line'>{outline}</p>
                  ) : null}
                  <div className='px-1 '>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(outline);
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

export default OutlineGenerator;
