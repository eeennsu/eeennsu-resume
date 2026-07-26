'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from 'react';

interface JdMatchContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openModal: () => void;
}

const JdMatchContext = createContext<JdMatchContextValue | null>(null);

export const JdMatchProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);

  const value = useMemo(() => ({ open, setOpen, openModal }), [open, openModal]);

  return <JdMatchContext.Provider value={value}>{children}</JdMatchContext.Provider>;
};

export const useJdMatch = (): JdMatchContextValue => {
  const ctx = useContext(JdMatchContext);
  if (!ctx) throw new Error('useJdMatch must be used within JdMatchProvider');
  return ctx;
};
