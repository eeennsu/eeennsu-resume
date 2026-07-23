'use client';

import type { Locale } from '@shared/i18n/config';
import type { Dictionary } from '@shared/i18n/dictionaries';
import { cn } from '@shared/shadcn-ui/utils';
import { Loader2, MessageCircle, Send, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { FC, FormEvent, useRef, useState } from 'react';

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

const AiChat: FC<Props> = ({ locale, labels }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);

  const tokenRef = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

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
          turnstileToken: tokenRef.current,
        }),
      });

      // 토큰은 단발성 → 다음 메시지용으로 갱신
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
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn(
              'fixed right-4 bottom-24 z-50 flex max-h-[70vh] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border shadow-2xl',
              'bg-background text-foreground border-border',
            )}
          >
            {/* 헤더 */}
            <div className='border-border flex items-center justify-between border-b px-4 py-3'>
              <span className='text-sm font-semibold'>{labels.title}</span>
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
            <div ref={scrollRef} className='flex-1 space-y-3 overflow-y-auto px-4 py-4'>
              <p className='text-muted-foreground text-sm'>{labels.greeting}</p>

              {messages.length === 0 && (
                <div className='flex flex-wrap gap-2 pt-1'>
                  {labels.starters.map(starter => (
                    <button
                      key={starter}
                      type='button'
                      onClick={() => void send(starter)}
                      className='border-border hover:bg-muted rounded-full border px-3 py-1 text-xs transition-colors'
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              )}

              {messages.map(message => (
                <div
                  key={message.id}
                  className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap',
                      message.role === 'user'
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-foreground',
                    )}
                  >
                    {message.content ||
                      (streaming ? (
                        <Loader2 className='size-4 animate-spin' aria-label={labels.thinking} />
                      ) : (
                        ''
                      ))}
                  </div>
                </div>
              ))}

              {errorMsg && <p className='text-destructive text-xs'>{errorMsg}</p>}
            </div>

            {/* 입력 */}
            <form onSubmit={onSubmit} className='border-border border-t p-3'>
              <div className='flex items-center gap-2'>
                <input
                  value={input}
                  onChange={event => setInput(event.target.value)}
                  placeholder={labels.placeholder}
                  disabled={streaming}
                  className='border-border bg-background focus:ring-ring flex-1 rounded-full border px-3 py-2 text-sm outline-none focus:ring-1 disabled:opacity-60'
                />
                <button
                  type='submit'
                  aria-label={labels.send}
                  disabled={streaming || !input.trim()}
                  className='bg-foreground text-background flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:opacity-90 disabled:opacity-50'
                >
                  {streaming ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : (
                    <Send className='size-4' />
                  )}
                </button>
              </div>

              {SITE_KEY && (
                <div className='mt-2'>
                  <Turnstile
                    siteKey={SITE_KEY}
                    onToken={token => {
                      tokenRef.current = token;
                    }}
                    resetSignal={resetSignal}
                  />
                </div>
              )}

              <p className='text-muted-foreground mt-2 text-[10px]'>{labels.disclaimer}</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiChat;
