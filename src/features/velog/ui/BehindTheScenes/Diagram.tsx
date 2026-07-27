import { type FC } from 'react';

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

const NODE_WIDTH = 220;
const NODE_HEIGHT = 56;
const GAP = 24;
const START_X = 60;
const START_Y = 40;

const nodes = [
  { key: 'source', title: 'Velog @diso592', sub: 'GraphQL API' },
  { key: 'fetch', title: 'scripts/fetch-velog.ts', sub: 'try/catch + exit(0)' },
  { key: 'seed', title: 'src/data/velog-posts.json', sub: 'committed seed' },
  { key: 'render', title: 'Next.js 16 RSC', sub: 'utilFetchVelogArchive' },
  { key: 'output', title: '/{locale}/writings', sub: 'static HTML' },
] as const;

const Diagram: FC<Props> = ({ labels }) => (
  <figure className='w-full overflow-x-auto'>
    <svg
      role='img'
      aria-label='Velog fetch pipeline diagram'
      viewBox={`0 0 ${START_X + nodes.length * (NODE_WIDTH + GAP)} 200`}
      className='w-full min-w-[900px] text-gray-800 dark:text-gray-200'
    >
      <defs>
        <marker
          id='writings-diagram-arrow'
          viewBox='0 0 10 10'
          refX='9'
          refY='5'
          markerWidth='8'
          markerHeight='8'
          orient='auto-start-reverse'
        >
          <path d='M0 0 L10 5 L0 10 z' fill='currentColor' />
        </marker>
      </defs>

      {nodes.map((node, index) => {
        const x = START_X + index * (NODE_WIDTH + GAP);
        return (
          <g key={node.key}>
            <rect
              x={x}
              y={START_Y}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              rx={12}
              className='fill-white stroke-gray-300 dark:fill-gray-950 dark:stroke-gray-700'
            />
            <text
              x={x + NODE_WIDTH / 2}
              y={START_Y + 22}
              textAnchor='middle'
              className='fill-current text-[12px] font-semibold'
            >
              {node.title}
            </text>
            <text
              x={x + NODE_WIDTH / 2}
              y={START_Y + 40}
              textAnchor='middle'
              className='fill-current text-[10.5px] opacity-70'
            >
              {node.sub}
            </text>
            {index < nodes.length - 1 && (
              <line
                x1={x + NODE_WIDTH}
                y1={START_Y + NODE_HEIGHT / 2}
                x2={x + NODE_WIDTH + GAP}
                y2={START_Y + NODE_HEIGHT / 2}
                className='stroke-gray-400 dark:stroke-gray-600'
                strokeWidth={1.5}
                markerEnd='url(#writings-diagram-arrow)'
              />
            )}
          </g>
        );
      })}

      <text x={START_X} y={160} className='fill-current text-[11px] opacity-70'>
        {labels.cronNote}
      </text>
    </svg>

    <figcaption className='mt-4 grid grid-cols-2 gap-3 text-[12px] text-gray-600 md:grid-cols-5 dark:text-gray-400'>
      {(Object.keys(labels.steps) as Array<keyof DiagramLabels['steps']>).map(step => (
        <div
          key={step}
          className='rounded-lg border border-gray-200 bg-white/60 px-3 py-2 dark:border-gray-800 dark:bg-gray-950/40'
        >
          <p className='font-semibold text-gray-800 dark:text-gray-200'>{step.toUpperCase()}</p>
          <p className='mt-0.5 leading-snug'>{labels.steps[step]}</p>
        </div>
      ))}
    </figcaption>
  </figure>
);

export default Diagram;
