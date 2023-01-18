import { Card } from 'flowbite-react';
import React, { ComponentProps } from 'react';

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
      className='cardShadow rounded-2xl border-none p-5 hover:bg-primary-200'
    >
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
