import type { FC, PropsWithChildren, ReactNode } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@shared/shadcn-ui/ui/tooltip';

interface IProps {
  content: ReactNode;
}

const SharedTooltip: FC<PropsWithChildren<IProps>> = ({ content, children }) => {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent className='bg-slate-700 px-3 py-2 text-white shadow-md dark:bg-slate-200 dark:text-slate-900'>
        {content}
      </TooltipContent>
    </Tooltip>
  );
};

export default SharedTooltip;
