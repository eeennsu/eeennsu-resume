'use client';

import Script from 'next/script';
import { FC, useEffect, useRef } from 'react';

interface TurnstileApi {
  render: (
    el: HTMLElement,
    opts: {
      'sitekey': string;
      'callback': (token: string) => void;
      'error-callback'?: () => void;
      'expired-callback'?: () => void;
      'size'?: 'normal' | 'flexible' | 'compact';
    },
  ) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface Props {
  siteKey: string;
  // 발급 성공 시 토큰, 실패/만료 시 null. 부모는 이 값으로 전송 가능 여부를 판단.
  onToken: (token: string | null) => void;
  // 값이 바뀔 때마다 위젯을 reset 해 새 토큰을 발급받는다(토큰은 단발성).
  resetSignal: number;
}

const Turnstile: FC<Props> = ({ siteKey, onToken, resetSignal }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const render = () => {
    if (!window.turnstile || !containerRef.current || widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      'sitekey': siteKey,
      'size': 'flexible',
      'callback': onToken,
      'error-callback': () => onToken(null),
      'expired-callback': () => onToken(null),
    });
  };

  useEffect(() => {
    render();
    return () => {
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (resetSignal > 0 && window.turnstile && widgetIdRef.current) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [resetSignal]);

  return (
    <>
      <Script
        src='https://challenges.cloudflare.com/turnstile/v0/api.js'
        strategy='lazyOnload'
        onReady={render}
      />
      <div ref={containerRef} />
    </>
  );
};

export default Turnstile;
