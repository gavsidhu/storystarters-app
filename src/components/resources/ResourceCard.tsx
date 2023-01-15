import { Card } from 'flowbite-react';
import React, { ComponentProps } from 'react';

interface Props extends ComponentProps<'div'> {
  href?: string;
  title: string;
  description: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}
const ResourceCard = ({ href, title, description, onClick }: Props) => {
  return (
    <Card
      href={href}
      className='p-5 shadow-none hover:shadow-lg'
      onClick={onClick}
    >
      <div className='h-full'>
        <h3 className='font-body text-xl font-extrabold  tracking-tight text-gray-900'>
          {title}
        </h3>
      </div>

      <p className='font-body font-normal  text-gray-700'>{description}</p>
    </Card>
  );
};

export default ResourceCard;
