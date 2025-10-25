import Badge from '@shared/components/Badge';
import Link from 'next/link';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  name: string;
  descriptionList: string[];
  githubLink: string;
  siteLink?: string;
  tools: string[];
}

const PortfolioCard: FC<Props> = ({ name, descriptionList, githubLink, siteLink, tools }) => {
  return (
    <div className={twMerge('flex flex-col gap-4 border-r border-b p-6 even:border-r-0')}>
      <div className='grid grid-cols-6 gap-2 border-gray-400'>
        <h3 className='col-span-3 text-lg font-semibold text-gray-800 md:col-span-2 md:text-xl'>
          {name}
        </h3>
        <ul className='col-span-3 ml-4 w-full list-inside list-disc text-sm md:col-span-4 md:ml-0 md:text-base'>
          {descriptionList.map(description => (
            <li key={description}>{description}</li>
          ))}
          <li className='max-md:text-sm'>
            <Link
              href={githubLink}
              target='_blank'
              className='text-blue-500 underline underline-offset-2'
              rel='noopener noreferrer'
            >
              깃허브 주소
            </Link>
          </li>
          {siteLink && (
            <li>
              <Link
                href={siteLink}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 underline underline-offset-2'
              >
                사이트 주소
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div className='flex flex-wrap gap-2'>
        {tools.map((tool, index) => (
          <Badge variant='blue' key={index}>
            {tool}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default PortfolioCard;
