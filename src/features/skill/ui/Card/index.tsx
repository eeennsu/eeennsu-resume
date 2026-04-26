import { FC } from 'react';

interface Props {
  name: string;
  detailList: string[];
}

const SkillCard: FC<Props> = ({ name, detailList }) => {
  return (
    <div className='grid grid-cols-1 gap-3 py-5 md:grid-cols-7 md:gap-x-10 md:py-6'>
      <h3 className='text-[11px] font-semibold tracking-[0.18em] text-blue-500 uppercase md:col-span-2 md:mt-1 md:text-xs dark:text-blue-400'>
        {name}
      </h3>
      <ul className='flex flex-wrap gap-x-2 gap-y-2 md:col-span-5'>
        {detailList.map((detail, index) => (
          <li
            key={index}
            className='rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[13px] font-medium text-gray-800 md:text-sm dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-200'
          >
            {detail}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillCard;
