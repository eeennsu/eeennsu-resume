'use client';

import { useEffect, useState } from 'react';

const useGetIp = () => {
  const [ip, setIp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    (async () => {
      try {
        // 1차: ipify
        const res = await fetch('https://api64.ipify.org?format=json', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('ipify 실패');
        const data = await res.json();
        setIp(data.ip);
      } catch {
        try {
          // 2차: Cloudflare fallback
          const res2 = await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
            signal: controller.signal,
          });
          const text = await res2.text();
          const line = text.split('\n').find(l => l.startsWith('ip='));
          setIp(line?.split('=')[1] ?? null);
        } catch {
          setError('IP 조회 실패');
        }
      } finally {
        clearTimeout(timer);
        setLoading(false);
      }
    })();

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, []);

  return { ip, error, loading };
};

export default useGetIp;
