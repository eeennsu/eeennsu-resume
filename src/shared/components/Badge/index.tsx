import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps, FC, PropsWithChildren } from 'react';

const badgeVariants = cva('inline-flex items-center justify-center w-fit font-medium rounded-sm', {
  variants: {
    variant: {
      gray: 'bg-slate-600 text-white dark:bg-slate-500 dark:text-slate-50',
      cyan: 'bg-cyan-500 text-white dark:bg-cyan-600 dark:text-cyan-50',
      orange: 'bg-orange-400 text-white dark:bg-orange-500 dark:text-orange-50',
      emerald: 'bg-emerald-500 text-white dark:bg-emerald-600 dark:text-emerald-50',
      black: 'bg-black text-white dark:bg-gray-100 dark:text-gray-900',
      dark: 'bg-gray-400 text-white dark:bg-gray-600 dark:text-gray-100',
      blue: 'bg-blue-400 text-white dark:bg-blue-500 dark:text-blue-50',
    },
    size: {
      sm: 'text-xs py-0.5 px-2 h-6',
      md: 'text-sm py-1 px-2 h-6',
      lg: 'text-base py-1.5 px-3 h-8',
    },
  },
  defaultVariants: {
    variant: 'gray',
    size: 'sm',
  },
  compoundVariants: [
    {
      size: ['md', 'lg'],
      className: 'max-md:text-xs max-md:py-0.5 max-md:px-1.5 max-md:h-6',
    },
  ],
});

type Props = ComponentProps<'span'> & VariantProps<typeof badgeVariants>;

const Badge: FC<PropsWithChildren<Props>> = ({ children, variant, size, className, ...props }) => {
  return (
    <span className={badgeVariants({ variant, size, className })} {...props}>
      {children}
    </span>
  );
};

export default Badge;
