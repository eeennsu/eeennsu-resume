import { ArrowUpRight, Github } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { cn } from '@shared/shadcn-ui/utils';

interface Props {
  name: string;
  descriptionList: string[];
  githubLink: string;
  siteLink?: string;
  tools: string[];
  locale: Locale;
}

const CTA_BASE =
  'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors md:text-[13px]';

const CTA_VARIANTS = {
  primary:
    'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:bg-blue-500/20',
  secondary:
    'border-gray-200 bg-white text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400 dark:hover:bg-gray-800',
} as const;

const PortfolioCard: FC<Props> = ({
  name,
  descriptionList,
  githubLink,
  siteLink,
  tools,
  locale,
}) => {
  const dict = getDictionary(locale);
  return (
    <div className='flex flex-col gap-5 border-r border-b border-gray-100 p-7 transition-colors last:border-b-0 hover:border-blue-100 hover:bg-blue-50 max-md:border-r-0 md:gap-6 md:p-9 md:even:border-r-0 dark:border-gray-800 dark:hover:border-blue-500/20 dark:hover:bg-blue-500/10 md:[&:nth-last-child(-n+2)]:border-b-0 md:[&:nth-last-child(2):nth-child(odd)]:border-b-0'>
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

      <div className='mt-auto flex flex-wrap items-center gap-2 pt-1'>
        <Link
          href={githubLink}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={`${name} GitHub (${dict.externalLink.newTab})`}
          className={cn(CTA_BASE, CTA_VARIANTS.secondary)}
        >
          <Github className='size-3.5' aria-hidden='true' />
          GitHub
          <span className='sr-only'> ({dict.externalLink.newTab})</span>
        </Link>
        {siteLink && (
          <Link
            href={siteLink}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={`${name} Live (${dict.externalLink.newTab})`}
            className={cn(CTA_BASE, CTA_VARIANTS.primary)}
          >
            <ArrowUpRight className='size-3.5' aria-hidden='true' />
            Live
            <span className='sr-only'> ({dict.externalLink.newTab})</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PortfolioCard;
