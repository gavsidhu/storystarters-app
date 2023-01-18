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
      className='cardShadow rounded-2xl border-none bg-[#F48E19] p-5 text-white hover:bg-white hover:text-gray-900'
      onClick={onClick}
    >
      <div className='h-full'>
        <h3 className='font-body text-xl font-extrabold  tracking-tight '>
          {title}
        </h3>
      </div>

      <p className='font-body font-normal  '>{description}</p>
    </Card>
  );
};

export default ResourceCard;
