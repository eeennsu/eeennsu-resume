import type { FC, PropsWithChildren } from 'react';

const SectionTitle: FC<PropsWithChildren> = ({ children }) => {
  return (
    <h2 className='open-sans flex items-center gap-3 text-3xl font-semibold text-blue-500 max-md:w-full max-md:justify-center md:sticky md:top-24 md:min-w-[210px] md:self-start dark:text-blue-400'>
      <span
        aria-hidden='true'
        className='h-7 w-0.75 shrink-0 rounded-full bg-blue-500 dark:bg-blue-400'
      />
      {children}
    </h2>
  );
};

export default SectionTitle;
