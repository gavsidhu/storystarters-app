import type { ComponentProps } from 'react';
import React, { forwardRef } from 'react';

export interface LabelInputProps extends Omit<ComponentProps<'label'>, 'ref'> {
  value: string;
}
const Label = forwardRef<HTMLLabelElement, LabelInputProps>(
  ({ value, ...props }, ref) => {
    return (
      <label
        className='block text-sm font-medium text-gray-700'
        {...props}
        ref={ref}
      >
        {value}
      </label>
    );
  }
);

export default Label;
