import React from 'react';

import Layout from '@/components/layout/Layout';
import ToolCard from '@/components/tools/ToolCard';
const tools = [
  {
    id: '1',
    title: 'Story idea generator',
    description: 'generates story ideas',
    href: '#',
  },
  {
    id: '2',
    title: 'Character Creator',
    description: 'Create memorable character',
    href: '#',
  },
  {
    id: '3',
    title: 'Scene builder',
    description: 'builds scenses',
    href: '#',
  },
];

const Tools = () => {
  return (
    <Layout title='Tools'>
      <div className='mx-auto lg:max-w-7xl '>
        <div className='mt-4 py-6'>
          <div className='grid gap-4 py-6 lg:grid-cols-3'>
            {tools.map((tool) => {
              return (
                <ToolCard
                  key={tool.id}
                  id={tool.id}
                  title={tool.title}
                  description={tool.description}
                  href={tool.href}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Tools;
