import { Card } from 'flowbite-react';
import React from 'react';

type Props = {
  href: string;
  title: string;
  description: string;
};
const ToolCard = ({ href, title, description }: Props) => {
  return (
    <Card href={href} className='p-5 shadow-none hover:shadow-lg'>
      <div>
        <h3 className='font-body text-xl font-extrabold tracking-tight text-gray-900'>
          {title}
        </h3>
      </div>

      <p className='font-body font-normal text-gray-700'>{description}</p>
    </Card>
  );
};

export default ToolCard;
