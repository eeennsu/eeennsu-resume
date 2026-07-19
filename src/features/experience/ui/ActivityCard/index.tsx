import Markdown from '@shared/components/Markdown';
import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@shared/shadcn-ui/ui/accordion';
import { IActivity } from '@shared/types/subjects';
import { FC } from 'react';

type Props = IActivity & {
  index: number;
  locale: Locale;
};

const toYearMonth = (date: string) => {
  const parts = date.replace(/-/g, '.').split('.');
  if (parts.length < 2) return date;
  return `${parts[0]}.${parts[1]}`;
};

const formatPeriod = (inProgressLabel: string, start?: string, end?: string) => {
  if (!start) return null;

  return `${toYearMonth(start)} ~ ${end ? toYearMonth(end) : inProgressLabel}`;
};

const ActivityCard: FC<Props> = ({ startDate, endDate, title, doneList, index, locale }) => {
  const dict = getDictionary(locale);
  const periodText = formatPeriod(dict.experience.activityInProgress, startDate, endDate);

  return (
    <AccordionItem
      value={`activity-${index}`}
      className='overflow-hidden rounded-xl border border-gray-200 bg-white px-5 transition-colors hover:border-gray-300 data-[state=open]:border-gray-300 md:px-7 dark:border-gray-800 dark:bg-gray-950/40 dark:hover:border-gray-700 dark:data-[state=open]:border-gray-700'
    >
      <AccordionTrigger className='cursor-pointer gap-4 py-5 hover:no-underline md:py-6 [&>svg]:size-5 [&>svg]:text-gray-400 dark:[&>svg]:text-gray-500'>
        <div className='flex flex-1 flex-col gap-1.5 text-left'>
          {periodText && (
            <p className='text-xs tracking-tight text-gray-500 md:text-[13px] dark:text-gray-400'>
              {periodText}
            </p>
          )}
          <div className='flex items-baseline gap-3'>
            <span className='shrink-0 text-base font-semibold tracking-wider text-blue-500 tabular-nums md:text-lg dark:text-blue-400'>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className='text-lg leading-snug font-semibold break-keep text-gray-900 md:text-xl dark:text-gray-100'>
              {title}
            </span>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className='pt-0 pb-7 md:pb-9'>
        <div className='border-t border-gray-100 pt-6 md:pt-7 dark:border-gray-800'>
          <ol className='flex flex-col divide-y divide-gray-100 dark:divide-gray-800'>
            {doneList?.map((done, j) => (
              <li
                key={`${done.subject}-${j}`}
                className='flex flex-col gap-4 py-7 first:pt-0 last:pb-0 md:py-9'
              >
                <h4 className='flex items-baseline gap-2.5 text-[15px] font-semibold break-keep text-gray-900 md:text-[17px] dark:text-gray-100'>
                  <span className='shrink-0 text-blue-500/80 tabular-nums dark:text-blue-400/90'>
                    {j + 1}.
                  </span>
                  <span className='flex-1'>
                    <Markdown>{done.subject}</Markdown>
                  </span>
                </h4>

                {done.details && done.details.length > 0 && (
                  <ul className='flex flex-col gap-4 pl-5'>
                    {done.details.map((detail, k) => {
                      if (typeof detail === 'string') {
                        return (
                          <li
                            key={k}
                            className='leading-1.2 list-outside list-disc text-[15px] text-gray-800 marker:text-gray-300 dark:text-gray-200 dark:marker:text-gray-600'
                          >
                            <Markdown>{detail}</Markdown>
                          </li>
                        );
                      }

                      return (
                        <li key={k} className='-ml-5 list-none'>
                          <ProblemSolution
                            problem={detail.problem}
                            solution={detail.solution}
                            problemLabel={dict.experience.problemLabel}
                            solutionLabel={dict.experience.solutionLabel}
                          />
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

interface ProblemSolutionProps {
  problem: string;
  solution: string;
  problemLabel: string;
  solutionLabel: string;
}

const ProblemSolution: FC<ProblemSolutionProps> = ({
  problem,
  solution,
  problemLabel,
  solutionLabel,
}) => (
  <div className='rounded-lg border border-gray-200 bg-gray-50 px-4 py-3.5 md:px-5 md:py-4 dark:border-gray-800 dark:bg-gray-900/60'>
    <div className='flex flex-col gap-1.5 md:flex-row md:gap-5'>
      <span className='shrink-0 text-[10.5px] font-semibold tracking-[0.14em] text-rose-500 uppercase md:mt-[5px] md:w-[68px] dark:text-rose-400'>
        {problemLabel}
      </span>
      <div className='flex-1 text-[15px] leading-[1.75] text-gray-700 dark:text-gray-300'>
        <Markdown>{problem}</Markdown>
      </div>
    </div>
    <div className='my-3 h-px bg-gray-200/70 md:my-3.5 dark:bg-gray-700/60' />
    <div className='flex flex-col gap-1.5 md:flex-row md:gap-5'>
      <span className='shrink-0 text-[10.5px] font-semibold tracking-[0.14em] text-blue-500 uppercase md:mt-[5px] md:w-[68px] dark:text-blue-400'>
        {solutionLabel}
      </span>
      <div className='flex-1 text-[15px] leading-[1.75] text-gray-800 dark:text-gray-200'>
        <Markdown>{solution}</Markdown>
      </div>
    </div>
  </div>
);

export default ActivityCard;
