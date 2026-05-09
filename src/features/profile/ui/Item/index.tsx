import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { ProfileIconType } from '@shared/types/subjects';
import { Github, Mail, Notebook, NotebookPen } from 'lucide-react';
import Link from 'next/link';
import type { FC, ReactNode } from 'react';

const Icon: Record<ProfileIconType, ReactNode> = {
  'email': <Mail className='size-[18px]' aria-hidden='true' />,
  'github': <Github className='size-[18px]' aria-hidden='true' />,
  'velog': <Notebook className='size-[18px]' aria-hidden='true' />,
  'self-blog': <NotebookPen className='size-[18px]' aria-hidden='true' />,
};

interface Props {
  icon: ProfileIconType;
  href: string;
  value: ReactNode;
  locale: Locale;
  textValue?: string;
}

const ProfileItem: FC<Props> = ({ icon, href, value, locale, textValue }) => {
  const IconComp = Icon[icon];
  const dict = getDictionary(locale);
  const label = dict.profile.iconLabel[icon];
  const ariaValue = textValue ?? (typeof value === 'string' ? value : label);
  const ariaLabel = dict.profile.itemAriaLabel
    .replace('{{label}}', label)
    .replace('{{value}}', ariaValue);

  return (
    <div className='flex items-center gap-2.5'>
      <span className='text-gray-400 dark:text-gray-500'>{IconComp}</span>
      <Link
        href={href}
        aria-label={ariaLabel}
        className='text-gray-700 underline-offset-2 transition-colors hover:text-blue-600 hover:underline max-md:text-sm dark:text-gray-300 dark:hover:text-blue-400'
      >
        {value}
      </Link>
    </div>
  );
};

export default ProfileItem;
