// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/lib/ui/accordion';
import Markdown from '@shared/components/Markdown';
import { cn } from '@shared/shadcn-ui/utils';
import { ICompanyExperience } from '@shared/types/subjects';
import { FC } from 'react';

type Props = ICompanyExperience['activities'][number] & {
  index: number;
};

const ActivityCard: FC<Props> = ({ title, doneList, index }) => {
  return (
    <div className='group relative flex flex-col gap-6 overflow-hidden border-b border-b-slate-400/80 bg-white p-6 transition-all last-of-type:border-b-0 last-of-type:pb-0 md:p-9'>
      <div className='flex flex-col gap-1 md:flex-row md:justify-between md:gap-4'>
        <div className='flex items-start gap-3 md:gap-4'>
          <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-slate-100 md:h-8 md:w-8 md:text-base'>
            {index + 1}
          </span>
          <h4 className='text-xl font-bold text-slate-900 md:text-2xl'>{title}</h4>
        </div>
      </div>
      <ol className='flex list-outside list-decimal flex-col gap-8 pl-5 md:pl-6'>
        {doneList?.map((done, index) => (
          <li key={`${done.subject}-${index}`} className='pl-2'>
            <div className='flex flex-col gap-3 md:gap-4'>
              <span className='text-lg font-semibold text-slate-800 lg:text-xl'>
                {done.subject}
              </span>

              {done.details && (
                <ul className='flex list-outside list-disc flex-col gap-3 pl-5 text-slate-900 marker:text-slate-400 md:gap-4'>
                  {done.details.map((detail, idx) => {
                    const isPreviousString = idx > 0 && typeof done.details[idx - 1] === 'string';

                    if (typeof detail === 'string') {
                      return (
                        <li key={idx} className='pl-2 leading-relaxed'>
                          <Markdown>{detail}</Markdown>
                        </li>
                      );
                    }

                    return (
                      <li
                        key={detail.problem}
                        className={cn(
                          'flex list-none flex-col gap-4 rounded-lg bg-slate-100/80 p-4 text-sm md:text-base',
                          isPreviousString && 'mt-2',
                        )}
                      >
                        <div className='flex flex-col gap-1'>
                          <span className='text-xs font-bold tracking-wider text-orange-500 uppercase'>
                            Problem
                          </span>
                          <Markdown className='text-slate-700'>{detail.problem}</Markdown>
                        </div>
                        <div className='flex flex-col gap-1'>
                          <span className='text-xs font-bold tracking-wider text-blue-600 uppercase'>
                            Solution
                          </span>
                          <Markdown className='font-medium text-slate-800'>
                            {detail.solution}
                          </Markdown>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ActivityCard;

// TODO: 추후 컨텐츠가 많아지면 아코디언 사용
// const ActivityDetailAccordion: FC<{ trigger: string; content: string }> = ({
//   trigger,
//   content,
// }) => {
//   return (
//     <Accordion type='multiple'>
//       <AccordionItem value={trigger}>
//         <AccordionTrigger>{trigger}</AccordionTrigger>
//         <AccordionContent>{content}</AccordionContent>
//       </AccordionItem>
//     </Accordion>
//   );
// };
