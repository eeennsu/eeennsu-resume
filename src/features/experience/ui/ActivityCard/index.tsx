// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/lib/ui/accordion';
import Badge from '@shared/components/Badge';
import Markdown from '@shared/components/Markdown';
import { getEstimatedDuration } from '@shared/libs/date';
import { ICompanyExperience } from '@shared/types/subjects';
import { FC } from 'react';

type Props = ICompanyExperience['activities'][number];

const ActivityCard: FC<Props> = ({ title, startDate, endDate, estimatedDuration, doneList }) => {
  return (
    <div className='flex flex-col gap-3.5 border-b border-gray-400 pb-10 last:border-none last:pb-0'>
      <div className='flex flex-col gap-1 md:flex-row md:justify-between md:gap-4'>
        <h4 className='text-lg font-bold md:text-xl'>{title}</h4>
        <div className='flex items-center justify-end gap-3 md:justify-start'>
          <p className='text-sm text-gray-600'>
            {startDate} ~ {endDate || '현재'}
          </p>
          {endDate && (
            <Badge variant='cyan'>
              {estimatedDuration || getEstimatedDuration(startDate, endDate)}개월
            </Badge>
          )}
        </div>
      </div>
      <ol className='ml-4 flex list-inside list-decimal flex-col gap-10 md:gap-7'>
        {doneList?.map((done, index) => (
          <li key={`${done.subject}-${index}`} className='custom-decimal-list'>
            <span className='text-base font-semibold text-slate-800'>{done.subject}</span>

            {done.details && (
              <ul className='ml-4 list-outside list-disc text-sm'>
                {done.details.map((detail, index) => {
                  if (typeof detail === 'string') {
                    return (
                      <li key={index} className='ml-6 text-gray-800'>
                        <Markdown>{detail}</Markdown>
                      </li>
                    );
                  }

                  return (
                    <li
                      key={detail.problem}
                      className='mb-5 flex list-none flex-col gap-0.5 font-medium last:mb-0'
                    >
                      <Markdown className='marker-problem flex gap-0.5 text-orange-600'>
                        {detail.problem}
                      </Markdown>
                      <Markdown className='marker-solution flex gap-0.5 font-medium text-green-600'>
                        {detail.solution}
                      </Markdown>
                    </li>
                  );
                })}
              </ul>
            )}
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
