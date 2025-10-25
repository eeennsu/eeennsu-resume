import { Tooltip, TooltipContent, TooltipTrigger } from '@shared/shadcn-ui/ui/tooltip';
import type { FC, PropsWithChildren, ReactNode } from 'react';

interface IProps {
  content: ReactNode;
}

const SharedTooltip: FC<PropsWithChildren<IProps>> = ({ content, children }) => {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent className='bg-slate-600 px-3 py-2 text-white shadow-md'>
        {content}
      </TooltipContent>
    </Tooltip>
  );
};

export default SharedTooltip;
