import { Card } from 'flowbite-react';
import React, { ComponentProps } from 'react';
import { HiWrenchScrewdriver } from 'react-icons/hi2';

interface Props extends ComponentProps<'div'> {
  href: string;
  title: string;
  description: string;
}
const ToolCard = ({ href, title, description, ...props }: Props) => {
  return (
    <Card
      href={href}
      {...props}
      className='cardShadow group rounded-2xl border-none p-5 hover:bg-primary-500'
    >
      <div className='space-y-2'>
        <div className='inline-flex rounded-full bg-primary-500 p-2 group-hover:bg-white'>
          <HiWrenchScrewdriver className='h-3 w-3 text-white group-hover:text-primary-500' />
        </div>
        <h3 className='font-body text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-white'>
          {title}
        </h3>
      </div>

      <p className='font-body font-normal text-gray-700 group-hover:text-white'>
        {description}
      </p>
    </Card>
  );
};

export default ToolCard;
