'use client';

import { useEffect, useRef, useState, type FC, type ReactNode } from 'react';

import { cn } from '@shared/shadcn-ui/utils';

interface Props {
  children: ReactNode;
  className?: string;
}

const FadeInWrapper: FC<Props> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);
    const listener = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        reducedMotion
          ? 'opacity-100'
          : visible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-4 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default FadeInWrapper;
