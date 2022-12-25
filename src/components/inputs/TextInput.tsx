import type { ComponentProps } from 'react';
import React, { forwardRef } from 'react';

export type TextInputProps = Omit<ComponentProps<'input'>, 'ref'>;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ ...props }, ref) => {
    return (
      <input
        className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm outline-none focus:border-primary-500 focus:ring-0 sm:text-sm'
        {...props}
        ref={ref}
      />
    );
  }
);

export default TextInput;
