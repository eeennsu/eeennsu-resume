import { type FC } from 'react';

const WritingsLoading: FC = () => (
  <main
    className='flex flex-col gap-14 pt-10 pb-20 md:gap-20 md:pt-16'
    aria-busy='true'
    aria-live='polite'
  >
    <header className='flex flex-col gap-4 px-6 md:mx-auto md:max-w-6xl md:px-12'>
      <div className='h-9 w-2/3 max-w-md animate-pulse rounded-md bg-gray-200 dark:bg-gray-800' />
      <div className='h-4 w-full max-w-3xl animate-pulse rounded-md bg-gray-100 dark:bg-gray-900' />
      <div className='h-4 w-1/2 max-w-xl animate-pulse rounded-md bg-gray-100 dark:bg-gray-900' />
    </header>

    <section className='flex flex-col gap-3 px-6 md:mx-auto md:max-w-6xl md:px-12'>
      <div className='h-4 w-32 animate-pulse rounded-md bg-gray-100 dark:bg-gray-900' />
      <div className='flex flex-wrap gap-2'>
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className='h-6 w-20 animate-pulse rounded-full bg-gray-100 dark:bg-gray-900'
          />
        ))}
      </div>
    </section>

    <section className='flex flex-col gap-4 px-6 md:mx-auto md:max-w-6xl md:px-12'>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className='flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-gray-950/40'
        >
          <div className='h-5 w-3/4 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800' />
          <div className='h-3.5 w-full animate-pulse rounded-md bg-gray-100 dark:bg-gray-900' />
          <div className='h-3.5 w-2/3 animate-pulse rounded-md bg-gray-100 dark:bg-gray-900' />
        </div>
      ))}
    </section>
  </main>
);

export default WritingsLoading;
