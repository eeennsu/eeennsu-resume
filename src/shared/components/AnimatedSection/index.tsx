'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import type { FC } from 'react';

type Props = HTMLMotionProps<'section'> & {
  delay?: number;
};

const AnimatedSection: FC<Props> = ({ children, delay = 0, ...rest }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <motion.section {...rest}>{children}</motion.section>;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;
