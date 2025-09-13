import { ProfileIconType } from '@shared/types/subjects';
import { Github, Mail, Notebook, NotebookPen } from 'lucide-react';
import Link from 'next/link';
import type { FC, ReactNode } from 'react';

const Icon: Record<ProfileIconType, ReactNode> = {
  'email': <Mail size={22} />,
  'github': <Github size={22} />,
  'velog': <Notebook size={22} />,
  'self-blog': <NotebookPen size={22} />,
};

interface Props {
  icon: ProfileIconType;
  href: string;
  value: ReactNode;
}

const ProfileItem: FC<Props> = ({ icon, href, value }) => {
  const IconComp = Icon[icon];

  return (
    <div className='flex items-center gap-3'>
      {IconComp}
      <Link href={href} className='text-blue-500 underline-offset-2 hover:underline max-md:text-sm'>
        {value}
      </Link>
    </div>
  );
};

export default ProfileItem;
