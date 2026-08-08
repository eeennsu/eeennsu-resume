import type { FC } from 'react';
import ReactMarkdown, { Options as ReactMarkdownProps } from 'react-markdown';
import remarkBreaks from 'remark-breaks';

const defaultComponents: ReactMarkdownProps['components'] = {
  a: ({ node: _node, href, children, ...rest }) => {
    const isInternalAnchor = typeof href === 'string' && href.startsWith('#');
    const isExternal = typeof href === 'string' && /^https?:\/\//.test(href);

    return (
      <a
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className='font-medium text-blue-600 underline decoration-blue-400/40 decoration-dotted underline-offset-[3px] transition-colors hover:text-blue-700 hover:decoration-blue-500 hover:decoration-solid dark:text-blue-300 dark:decoration-blue-300/40 dark:hover:text-blue-200 dark:hover:decoration-blue-200'
        {...rest}
      >
        {children}
        {isInternalAnchor && (
          <span aria-hidden='true' className='ml-0.5 text-[0.85em] opacity-70'>
            ↓
          </span>
        )}
      </a>
    );
  },
};

export const Markdown: FC<ReactMarkdownProps> = ({ components, ...props }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkBreaks]}
      components={{ ...defaultComponents, ...components }}
      {...props}
    />
  );
};

export default Markdown;
