import { Card } from 'flowbite-react';
import React, { ComponentProps } from 'react';

interface Props extends ComponentProps<'div'> {
  prompt: string;
}
const PromptCard = ({ prompt }: Props) => {
  return (
    <Card>
      <p className='font-body font-normal text-gray-700 group-hover:text-white'>
        {prompt}
      </p>
    </Card>
  );
};

export default PromptCard;
