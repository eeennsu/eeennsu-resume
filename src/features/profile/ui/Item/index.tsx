import { ProfileIconType } from '@shared/types/subjects';
import { Github, Mail, Notebook, NotebookPen } from 'lucide-react';
import Link from 'next/link';
import type { FC, ReactNode } from 'react';

const Icon: Record<ProfileIconType, ReactNode> = {
  'email': <Mail className='size-[18px]' />,
  'github': <Github className='size-[18px]' />,
  'velog': <Notebook className='size-[18px]' />,
  'self-blog': <NotebookPen className='size-[18px]' />,
};

interface Props {
  icon: ProfileIconType;
  href: string;
  value: ReactNode;
}

const ProfileItem: FC<Props> = ({ icon, href, value }) => {
  const IconComp = Icon[icon];

  return (
    <div className='flex items-center gap-2.5'>
      <span className='text-gray-400 dark:text-gray-500'>{IconComp}</span>
      <Link
        href={href}
        className='text-gray-700 underline-offset-2 transition-colors hover:text-blue-600 hover:underline max-md:text-sm dark:text-gray-300 dark:hover:text-blue-400'
      >
        {value}
      </Link>
    </div>
  );
};

export default ProfileItem;
