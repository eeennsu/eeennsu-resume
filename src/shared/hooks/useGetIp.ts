'use client';

import { trackVisitor } from '@shared/actions/tracker';
import { useEffect } from 'react';

const useGetIp = () => {
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    (async () => {
      try {
        const res = await fetch('https://api64.ipify.org?format=json', {
          signal: controller.signal,
        });
        const data = await res.json();

        await trackVisitor(data.ip, navigator.userAgent);
      } catch (err) {
        console.error(err);
      } finally {
        clearTimeout(timer);
      }
    })();

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, []);
};

export default useGetIp;
