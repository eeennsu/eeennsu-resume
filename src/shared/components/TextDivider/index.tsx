import type { FC } from 'react';

interface IProps {
  text: string;
}

const TextDivider: FC<IProps> = ({ text }) => {
  return (
    <div className='my-14 flex items-center gap-4'>
      <div className='grow border-t border-gray-300 dark:border-gray-700' />
      <span className='text-sm whitespace-nowrap text-gray-400 dark:text-gray-500'>{text}</span>
      <div className='grow border-t border-gray-300 dark:border-gray-700' />
    </div>
  );
};

export default TextDivider;
