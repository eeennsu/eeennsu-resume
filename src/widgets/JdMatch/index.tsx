'use client';

import type { Locale } from '@shared/i18n/config';
import type { Dictionary } from '@shared/i18n/dictionaries';
import { Loader2, Sparkles } from 'lucide-react';
import { FC, FormEvent, useRef, useState } from 'react';

import Turnstile from '@features/ai-chat/ui/Turnstile';

interface JdResult {
  fitScore: number;
  summary: string[];
  matchedSkills: string[];
  gaps: string[];
  pitch: string[];
  relevantExperience: { title: string; why: string }[];
}

interface Props {
  locale: Locale;
  labels: Dictionary['jdMatch'];
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const TagList: FC<{ items: string[] }> = ({ items }) => (
  <div className='flex flex-wrap gap-2'>
    {items.map(item => (
      <span key={item} className='bg-muted rounded-full px-3 py-1 text-xs'>
        {item}
      </span>
    ))}
  </div>
);

const JdMatch: FC<Props> = ({ locale, labels }) => {
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JdResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);

  const tokenRef = useRef<string | undefined>(undefined);

  const analyze = async () => {
    const trimmed = jd.trim();
    if (!trimmed) {
      setErrorMsg(labels.empty);
      return;
    }
    if (loading) return;

    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch('/api/jd-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd: trimmed, locale, turnstileToken: tokenRef.current }),
      });

      // 토큰은 단발성 → 다음 분석용으로 갱신
      setResetSignal(signal => signal + 1);

      if (res.status === 503) {
        setErrorMsg(labels.limit);
        return;
      }
      if (!res.ok) {
        setErrorMsg(labels.error);
        return;
      }

      setResult((await res.json()) as JdResult);
    } catch {
      setErrorMsg(labels.error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void analyze();
  };

  return (
    <section id='jd-match' className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <h2 className='flex items-center gap-2 text-xl font-bold'>
          <Sparkles className='size-5' />
          {labels.title}
        </h2>
        <p className='text-muted-foreground text-sm'>{labels.description}</p>
      </div>

      <form onSubmit={onSubmit} className='flex flex-col gap-3'>
        <textarea
          value={jd}
          onChange={event => setJd(event.target.value)}
          placeholder={labels.placeholder}
          rows={6}
          maxLength={8000}
          disabled={loading}
          className='border-border bg-background focus:ring-ring w-full resize-y rounded-xl border px-4 py-3 text-sm outline-none focus:ring-1 disabled:opacity-60'
        />

        <div className='flex items-center justify-between gap-3'>
          {SITE_KEY ? (
            <Turnstile
              siteKey={SITE_KEY}
              onToken={token => {
                tokenRef.current = token;
              }}
              resetSignal={resetSignal}
            />
          ) : (
            <span />
          )}
          <button
            type='submit'
            disabled={loading || !jd.trim()}
            className='bg-foreground text-background flex shrink-0 items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50'
          >
            {loading && <Loader2 className='size-4 animate-spin' />}
            {loading ? labels.analyzing : labels.analyze}
          </button>
        </div>
      </form>

      {errorMsg && <p className='text-destructive text-sm'>{errorMsg}</p>}

      {result && (
        <div className='border-border flex flex-col gap-5 rounded-2xl border p-5'>
          {/* 적합도 */}
          <div className='flex flex-col gap-2'>
            <div className='flex items-baseline justify-between'>
              <span className='text-muted-foreground text-sm'>{labels.fitScore}</span>
              <span className='text-2xl font-bold'>
                {result.fitScore}
                <span className='text-muted-foreground text-sm font-normal'>/100</span>
              </span>
            </div>
            <div className='bg-muted h-2 w-full overflow-hidden rounded-full'>
              <div
                className='bg-foreground h-full rounded-full transition-all'
                style={{ width: `${result.fitScore}%` }}
              />
            </div>
            {result.summary.map((line, index) => (
              <p key={index} className='text-muted-foreground text-sm'>
                {line}
              </p>
            ))}
          </div>

          {result.matchedSkills.length > 0 && (
            <div className='flex flex-col gap-2'>
              <span className='text-sm font-semibold'>{labels.matchedSkills}</span>
              <TagList items={result.matchedSkills} />
            </div>
          )}

          {result.gaps.length > 0 && (
            <div className='flex flex-col gap-2'>
              <span className='text-sm font-semibold'>{labels.gaps}</span>
              <TagList items={result.gaps} />
            </div>
          )}

          {result.pitch.length > 0 && (
            <div className='flex flex-col gap-2'>
              <span className='text-sm font-semibold'>{labels.pitch}</span>
              <ul className='list-disc space-y-1 pl-5 text-sm'>
                {result.pitch.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          {result.relevantExperience.length > 0 && (
            <div className='flex flex-col gap-2'>
              <span className='text-sm font-semibold'>{labels.relevantExperience}</span>
              <ul className='space-y-2'>
                {result.relevantExperience.map((item, index) => (
                  <li key={index} className='text-sm'>
                    <span className='font-medium'>{item.title}</span>
                    <span className='text-muted-foreground'> — {item.why}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className='text-muted-foreground text-[10px]'>{labels.disclaimer}</p>
        </div>
      )}
    </section>
  );
};

export default JdMatch;
