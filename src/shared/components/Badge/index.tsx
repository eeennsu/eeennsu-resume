import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps, FC, PropsWithChildren } from 'react';

const badgeVariants = cva('inline-flex items-center justify-center w-fit font-medium rounded-sm', {
  variants: {
    variant: {
      gray: 'bg-slate-600 text-white',
      cyan: 'bg-cyan-500 text-white',
      orange: 'bg-orange-400 text-white',
      emerald: 'bg-emerald-500 text-white',
      black: 'bg-black text-white',
      dark: 'bg-gray-700 text-white',
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
