import { ArrowUpRight, Github } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

interface Props {
  name: string;
  descriptionList: string[];
  githubLink: string;
  siteLink?: string;
  tools: string[];
}

const PortfolioCard: FC<Props> = ({ name, descriptionList, githubLink, siteLink, tools }) => {
  return (
    <div className='flex flex-col gap-5 border-r border-b border-gray-100 p-6 last:border-b-0 max-md:border-r-0 md:gap-6 md:p-8 md:even:border-r-0 dark:border-gray-800 md:[&:nth-last-child(-n+2)]:border-b-0 md:[&:nth-last-child(2):nth-child(odd)]:border-b-0'>
      <div className='flex flex-col gap-3'>
        <h3 className='text-lg font-semibold tracking-tight text-gray-900 md:text-xl dark:text-gray-100'>
          {name}
        </h3>
        <ul className='flex flex-col gap-1.5'>
          {descriptionList.map(description => (
            <li
              key={description}
              className='text-[14px] leading-relaxed text-gray-700 md:text-[15px] dark:text-gray-300'
            >
              {description}
            </li>
          ))}
        </ul>
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <Link
          href={githubLink}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[12px] font-medium text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900 md:text-[13px] dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-100'
        >
          <Github className='size-3.5' />
          GitHub
        </Link>
        {siteLink && (
          <Link
            href={siteLink}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50/60 px-2.5 py-1 text-[12px] font-medium text-blue-600 transition-colors hover:border-blue-300 hover:bg-blue-50 md:text-[13px] dark:border-blue-900/70 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/50'
          >
            <ArrowUpRight className='size-3.5' />
            Live
          </Link>
        )}
      </div>

      <div className='flex flex-wrap gap-1.5'>
        {tools.map((tool, index) => (
          <span
            key={index}
            className='rounded-md bg-gray-100 px-2 py-0.5 text-[11.5px] font-medium text-gray-600 md:text-xs dark:bg-gray-800 dark:text-gray-300'
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PortfolioCard;
