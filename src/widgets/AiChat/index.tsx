'use client';

import ErrorBoundary from '@shared/components/ErrorBoundary';
import Markdown from '@shared/components/Markdown';
import SharedTooltip from '@shared/components/Tooltip';
import type { Locale } from '@shared/i18n/config';
import type { Dictionary } from '@shared/i18n/dictionaries';
import { cn } from '@shared/shadcn-ui/utils';
import { Info, MessageCircle, Send, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FC, FormEvent, useRef, useState } from 'react';
import type { Components } from 'react-markdown';

import Turnstile from '@features/ai-chat/ui/Turnstile';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  locale: Locale;
  labels: Dictionary['aiChat'];
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const newId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.round(Math.random() * 1e6)}`;

// 링크는 새 창으로 안전하게 열도록 커스터마이즈. 나머지 마크다운 요소는 상위 wrapper의
// Tailwind arbitrary variant 로 스타일한다.
const markdownComponents: Components = {
  a({ node, ...props }) {
    void node;

    return (
      <a
        {...props}
        target='_blank'
        rel='noreferrer noopener'
        className='underline underline-offset-2 hover:opacity-80'
      />
    );
  },
};

const AiChat: FC<Props> = ({ locale, labels }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);

  const [token, setToken] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // SITE_KEY가 설정된 환경에서만 Turnstile을 강제. 토큰 발급 전에는 전송 UI 비활성.
  const turnstileBlocked = Boolean(SITE_KEY) && !token;

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    });
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const userMsg: ChatMessage = { id: newId(), role: 'user', content: trimmed };
    const assistantMsg: ChatMessage = { id: newId(), role: 'assistant', content: '' };
    const history = [...messages, userMsg];

    setMessages([...history, assistantMsg]);
    setInput('');
    setErrorMsg(null);
    setStreaming(true);
    scrollToBottom();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
          locale,
          turnstileToken: token ?? undefined,
        }),
      });

      // 토큰은 단발성 → 즉시 무효화 후 위젯 reset(다음 발급 전까지 전송 UI 잠금).
      setToken(null);
      setResetSignal(signal => signal + 1);

      if (res.status === 503) {
        setMessages(prev => prev.filter(message => message.id !== assistantMsg.id));
        setErrorMsg(labels.limit);
        return;
      }

      if (!res.ok || !res.body) {
        setMessages(prev => prev.filter(message => message.id !== assistantMsg.id));
        setErrorMsg(labels.error);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages(prev =>
          prev.map(message =>
            message.id === assistantMsg.id
              ? { ...message, content: message.content + chunk }
              : message,
          ),
        );
        scrollToBottom();
      }
    } catch {
      setMessages(prev =>
        prev.filter(message => message.id !== assistantMsg.id || message.content),
      );
      setErrorMsg(labels.error);
    } finally {
      setStreaming(false);
      scrollToBottom();
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void send(input);
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        type='button'
        aria-label={labels.launcher}
        onClick={() => setOpen(prev => !prev)}
        className={cn(
          'fixed right-4 bottom-4 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-colors',
          'bg-foreground text-background hover:opacity-90',
        )}
      >
        {open ? <X className='size-6' /> : <MessageCircle className='size-6' />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key='ai-chat-panel'
            initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: 'easeOut' }}
            className={cn(
              'fixed right-4 bottom-24 z-50 flex max-h-[70vh] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border shadow-2xl',
              'bg-background text-foreground border-border',
            )}
          >
            {/* 헤더 */}
            <div className='border-border flex items-center justify-between border-b px-4 py-3'>
              <div className='flex items-center gap-1.5'>
                <span className='text-sm font-semibold'>{labels.title}</span>
                <SharedTooltip
                  content={
                    <div className='max-w-xs'>
                      <p className='mb-1.5 text-xs font-semibold'>{labels.flow.title}</p>
                      <ol className='space-y-1 pl-4 text-xs leading-relaxed break-keep'>
                        {labels.flow.steps.map((step, index) => (
                          <li key={index} className='list-decimal'>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  }
                >
                  <span
                    aria-label={labels.flow.ariaLabel}
                    className='text-muted-foreground hover:text-foreground -m-1 inline-flex cursor-help items-center justify-center p-1 transition-colors'
                  >
                    <Info className='size-3.5' aria-hidden />
                  </span>
                </SharedTooltip>
              </div>
              <button
                type='button'
                aria-label={labels.close}
                onClick={() => setOpen(false)}
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <X className='size-4' />
              </button>
            </div>

            {/* 메시지 목록 */}
            <ErrorBoundary
              fallback={
                <div className='flex flex-1 items-center justify-center px-4 py-6'>
                  <p className='text-destructive text-xs'>{labels.error}</p>
                </div>
              }
            >
              <div ref={scrollRef} className='flex-1 space-y-3 overflow-y-auto px-4 py-4'>
                <p className='text-muted-foreground text-sm'>{labels.greeting}</p>

                {messages.length === 0 && (
                  <div className='flex flex-wrap gap-2 pt-1'>
                    {labels.starters.map(starter => (
                      <button
                        key={starter}
                        type='button'
                        onClick={() => void send(starter)}
                        disabled={streaming || turnstileBlocked}
                        className='border-border hover:bg-muted rounded-full border px-3 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                )}

                {messages.map(message => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start',
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-3 py-2 text-sm',
                        message.role === 'user'
                          ? 'bg-foreground text-background whitespace-pre-wrap'
                          : cn(
                              'bg-muted text-foreground',
                              // 어시스턴트 마크다운 렌더링 스타일
                              '[&_p:not(:first-child)]:mt-2',
                              '[&_ul]:mt-1 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-4',
                              '[&_ol]:mt-1 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-4',
                              '[&_ol_ol]:mt-0 [&_ul_ul]:mt-0',
                              '[&_li>p]:mt-0',
                              '[&_strong]:font-semibold',
                              '[&_em]:italic',
                              '[&_code]:bg-background/60 [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.85em]',
                              '[&_pre]:bg-background/60 [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:p-2',
                              '[&_hr]:border-border [&_hr]:my-2',
                              '[&_h1]:mt-2 [&_h1]:mb-1 [&_h1]:text-base [&_h1]:font-semibold',
                              '[&_h2]:mt-2 [&_h2]:mb-1 [&_h2]:text-sm [&_h2]:font-semibold',
                              '[&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold',
                            ),
                      )}
                    >
                      {message.role === 'user' ? (
                        message.content
                      ) : message.content ? (
                        <Markdown components={markdownComponents}>{message.content}</Markdown>
                      ) : streaming ? (
                        <span
                          role='status'
                          aria-label={labels.thinking}
                          className='flex items-center gap-1 py-1'
                        >
                          <span className='size-1.5 rounded-full bg-current opacity-60 motion-safe:animate-bounce motion-safe:[animation-delay:-0.32s]' />
                          <span className='size-1.5 rounded-full bg-current opacity-60 motion-safe:animate-bounce motion-safe:[animation-delay:-0.16s]' />
                          <span className='size-1.5 rounded-full bg-current opacity-60 motion-safe:animate-bounce' />
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                ))}

                {errorMsg && <p className='text-destructive text-xs'>{errorMsg}</p>}
              </div>
            </ErrorBoundary>

            {/* 입력 */}
            <form onSubmit={onSubmit} className='border-border border-t p-3'>
              <div className='flex items-center gap-2'>
                <input
                  value={input}
                  onChange={event => setInput(event.target.value)}
                  placeholder={labels.placeholder}
                  disabled={streaming || turnstileBlocked}
                  className='border-border bg-background focus:ring-ring flex-1 rounded-full border px-3 py-2 text-sm outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-60'
                />
                <button
                  type='submit'
                  aria-label={labels.send}
                  disabled={streaming || !input.trim() || turnstileBlocked}
                  className='bg-foreground text-background flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <Send className='size-4 translate-y-px' />
                </button>
              </div>

              {SITE_KEY && (
                <div className='mt-2'>
                  <Turnstile siteKey={SITE_KEY} onToken={setToken} resetSignal={resetSignal} />
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiChat;
