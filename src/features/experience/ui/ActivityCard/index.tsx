import Markdown from '@shared/components/Markdown';
import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@shared/shadcn-ui/ui/accordion';
import { IActivity } from '@shared/types/subjects';
import { FC, type ReactNode } from 'react';

type Props = IActivity & {
  index: number;
  locale: Locale;
  children?: ReactNode;
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

const ActivityCard: FC<Props> = ({
  id,
  startDate,
  endDate,
  title,
  doneList,
  index,
  locale,
  children,
}) => {
  const dict = getDictionary(locale);
  const periodText = formatPeriod(dict.experience.activityInProgress, startDate, endDate);

  return (
    <AccordionItem
      id={`experience-${id}`}
      value={`activity-${index}`}
      className='scroll-mt-24 overflow-hidden rounded-xl border border-gray-200 bg-white px-5 transition-colors target:ring-2 target:ring-blue-400/60 target:ring-offset-2 hover:border-gray-300 data-[state=open]:border-gray-300 md:px-7 dark:border-gray-800 dark:bg-gray-950/40 dark:target:ring-blue-300/50 dark:target:ring-offset-gray-950 dark:hover:border-gray-700 dark:data-[state=open]:border-gray-700'
    >
      <AccordionTrigger className='cursor-pointer gap-4 py-5 hover:no-underline motion-safe:active:scale-[0.997] md:py-6 [&>svg]:size-5 [&>svg]:text-gray-400 dark:[&>svg]:text-gray-500'>
        <div className='flex flex-1 flex-col gap-1.5 text-left'>
          {periodText && (
            <p className='text-xs tracking-tight text-gray-500 tabular-nums md:text-[13px] dark:text-gray-400'>
              {periodText}
            </p>
          )}
          <div className='flex items-baseline gap-4'>
            <span className='shrink-0 text-base font-semibold tracking-[0.08em] text-blue-500 tabular-nums md:text-xl dark:text-blue-400'>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className='text-lg leading-snug font-semibold text-balance break-keep text-gray-900 md:text-xl dark:text-gray-100'>
              {title}
            </span>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className='pt-0 pb-7 md:pb-9'>
        <div className='border-t border-gray-100 pt-6 md:pt-7 dark:border-gray-800'>
          {children && (
            <div className='mb-6 border-b border-gray-100 pb-6 md:mb-7 md:pb-7 dark:border-gray-800'>
              {children}
            </div>
          )}
          <ol className='flex flex-col divide-y divide-gray-100 dark:divide-gray-800'>
            {doneList?.map((done, j) => (
              <li
                key={`${done.subject}-${j}`}
                className='flex flex-col gap-4 py-7 first:pt-0 last:pb-0 md:py-9'
              >
                <h4 className='flex items-baseline gap-2.5 text-[15px] font-semibold text-pretty break-keep text-gray-900 md:text-[17px] dark:text-gray-100'>
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
                            className='list-outside list-disc text-[15px] leading-relaxed text-gray-800 marker:text-gray-300 dark:text-gray-200 dark:marker:text-gray-600'
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
