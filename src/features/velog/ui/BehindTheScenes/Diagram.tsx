import { ChevronRight } from 'lucide-react';
import { Fragment, type FC } from 'react';

interface DiagramLabels {
  steps: {
    source: string;
    fetch: string;
    seed: string;
    render: string;
    output: string;
  };
  cronNote: string;
}

interface Props {
  labels: DiagramLabels;
}

const nodes = [
  { key: 'source', title: 'Velog @diso592', sub: 'GraphQL API' },
  { key: 'fetch', title: 'scripts/fetch-velog.ts', sub: 'try/catch + exit(0)' },
  { key: 'seed', title: 'src/data/velog-posts.json', sub: 'committed seed' },
  { key: 'render', title: 'Next.js 16 RSC', sub: 'utilFetchVelogArchive' },
  { key: 'output', title: '/{locale}/writings', sub: 'static HTML' },
] as const;

const Diagram: FC<Props> = ({ labels }) => (
  <figure className='w-full'>
    <div className='flex flex-col items-stretch gap-3 md:flex-row md:items-stretch md:gap-2'>
      {nodes.map((node, index) => (
        <Fragment key={node.key}>
          <div className='bg-background flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-gray-300 px-3 py-4 text-center dark:border-gray-700'>
            <p className='text-foreground md:text-body-m text-[14px] leading-tight font-semibold'>
              {node.title}
            </p>
            <p className='text-muted-foreground md:text-body-s text-xs leading-tight'>{node.sub}</p>
          </div>
          {index < nodes.length - 1 && (
            <div className='flex items-center justify-center md:px-0.5'>
              <ChevronRight
                className='hidden size-5 shrink-0 text-gray-400 md:block dark:text-gray-600'
                aria-hidden
              />
              <div className='h-px w-full bg-gray-300 md:hidden dark:bg-gray-700' aria-hidden />
            </div>
          )}
        </Fragment>
      ))}
    </div>
    <p className='text-body-s text-muted-foreground mt-4'>{labels.cronNote}</p>
    <figcaption className='text-body-s text-muted-foreground mt-4 grid grid-cols-2 gap-3 md:grid-cols-5'>
      {(Object.keys(labels.steps) as Array<keyof DiagramLabels['steps']>).map(step => (
        <div
          key={step}
          className='border-border rounded-lg border bg-white/60 px-3 py-2 dark:bg-gray-950/40'
        >
          <p className='font-semibold text-gray-800 dark:text-gray-200'>{step.toUpperCase()}</p>
          <p className='mt-0.5 leading-snug'>{labels.steps[step]}</p>
        </div>
      ))}
    </figcaption>
  </figure>
);

export default Diagram;
