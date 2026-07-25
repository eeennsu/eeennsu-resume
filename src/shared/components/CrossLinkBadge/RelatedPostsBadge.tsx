import { VELOG_BASE_URL } from '@shared/consts/velog';
import type { IVelogPost } from '@shared/types/velog';
import { NotebookText } from 'lucide-react';
import { type FC } from 'react';

interface Props {
  posts: IVelogPost[];
  label: string;
  emptyLabel?: string;
}

const MAX_PREVIEW = 3;

const RelatedPostsBadge: FC<Props> = ({ posts, label, emptyLabel }) => {
  if (posts.length === 0) {
    if (!emptyLabel) return null;
    return <p className='text-[12px] text-gray-500 dark:text-gray-500'>{emptyLabel}</p>;
  }

  const preview = posts.slice(0, MAX_PREVIEW);

  return (
    <div className='flex flex-col gap-2'>
      <p className='inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-600 dark:text-blue-300'>
        <NotebookText className='size-3.5' aria-hidden />
        {label.replace('{{count}}', String(posts.length))}
      </p>
      <ul className='flex flex-col gap-1'>
        {preview.map(post => (
          <li key={post.id}>
            <a
              href={`${VELOG_BASE_URL}/${post.urlSlug}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-[12.5px] text-gray-700 underline-offset-2 hover:text-blue-600 hover:underline dark:text-gray-300 dark:hover:text-blue-300'
            >
              {post.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedPostsBadge;
