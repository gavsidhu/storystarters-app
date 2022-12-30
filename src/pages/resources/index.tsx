import React from 'react';

import Layout from '@/components/layout/Layout';
import ResourceCard from '@/components/resources/ResourceCard';

const resources = [
  {
    id: '1',
    title: 'Prompt library',
    description: 'Hundreds of writing prompts',
    href: '#',
  },
  {
    id: '2',
    title: "Hero's journey template",
    description: "Template of hero's journey story structure",
    href: '#',
  },
  {
    id: '3',
    title: 'Three act structure template',
    description: 'Template of the three act story structure',
    href: '#',
  },
];

const Resources = () => {
  return (
    <Layout title='Resources'>
      <div className='mx-auto lg:max-w-7xl '>
        <div className='mt-4 py-6'>
          <div className='grid gap-4 py-6 lg:grid-cols-3'>
            {resources.map((resource) => {
              return (
                <ResourceCard
                  key={resource.id}
                  id={resource.id}
                  title={resource.title}
                  description={resource.description}
                  href={resource.href}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
