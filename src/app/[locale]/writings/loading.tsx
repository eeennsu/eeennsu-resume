import { type FC } from 'react';

const CARD_COUNT = 4;

const WritingsLoading: FC = () => (
  <main
    className='flex flex-col gap-12 pt-10 pb-20 md:gap-16 md:pt-16'
    aria-busy='true'
    aria-live='polite'
  >
    <header className='flex flex-col gap-5 px-6 md:mx-auto md:max-w-6xl md:px-12'>
      <div className='h-7 w-32 animate-pulse rounded-md bg-gray-100 dark:bg-white/5' />
      <div className='h-10 w-96 animate-pulse rounded-md bg-gray-100 md:h-11 dark:bg-white/5' />
      <div className='h-5 w-full max-w-3xl animate-pulse rounded-md bg-gray-100 dark:bg-white/5' />
      <div className='h-4 w-72 animate-pulse rounded-md bg-gray-100 dark:bg-white/5' />
    </header>

    <section className='px-6 md:mx-auto md:w-full md:max-w-6xl md:px-12'>
      <ul className='grid gap-4 md:grid-cols-2'>
        {Array.from({ length: CARD_COUNT }).map((_, index) => (
          <li
            key={index}
            className='h-28 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/5'
          />
        ))}
      </ul>
    </section>
  </main>
);

export default WritingsLoading;
