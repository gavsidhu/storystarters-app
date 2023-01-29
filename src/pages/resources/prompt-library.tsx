import { useRouter } from 'next/router';
import React from 'react';

import useAuth from '@/hooks/useAuth';

import Layout from '@/components/layout/Layout';
import PromptCard from '@/components/resources/PromptCard';

import story_prompts from '../../constant/story_prompts.json';

const PromptLibrary = () => {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) {
    router.replace('/login');
  }
  return (
    <Layout title='Prompt Library'>
      <div className='mx-auto lg:max-w-7xl '>
        <div className='mt-4 py-6'>
          <div className='grid gap-4 py-6 lg:grid-cols-3'>
            {story_prompts.map((prompt, index) => {
              return <PromptCard prompt={prompt} key={index} />;
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PromptLibrary;
