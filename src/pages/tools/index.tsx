import React from 'react';

import Layout from '@/components/layout/Layout';
import ToolCard from '@/components/tools/ToolCard';
const tools = [
  {
    id: '1',
    title: 'Plot generator',
    description: 'Generate interesting story ideas',
    href: 'plot-generator',
  },
  {
    id: '2',
    title: 'Character creator',
    description: 'Create memorable characters for your story',
    href: 'character-creator',
  },
  // {
  //   id: '3',
  //   title: 'Scene builder',
  //   description: 'builds scenses',
  //   href: 'scene-builder',
  // },
  {
    id: '4',
    title: 'Outline generator',
    description: 'Turn your story idea into an organized outline',
    href: 'outline-generator',
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
                  href={`tools/${tool.href}`}
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
