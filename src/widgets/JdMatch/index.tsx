'use client';

import ErrorBoundary from '@shared/components/ErrorBoundary';
import SharedTooltip from '@shared/components/Tooltip';
import type { Locale } from '@shared/i18n/config';
import type { Dictionary } from '@shared/i18n/dictionaries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@shared/shadcn-ui/ui/dialog';
import { cn } from '@shared/shadcn-ui/utils';
import {
  Briefcase,
  CircleAlert,
  CircleCheck,
  Info,
  Loader2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FC, FormEvent, ReactNode, useEffect, useRef, useState } from 'react';

import Turnstile from '@features/ai-chat/ui/Turnstile';
import { useJdMatch } from '@features/jd-match/model/JdMatchContext';

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

// 마지막 분석 결과를 세션 동안 유지(새로고침 대비). 로케일이 다르면 무시.
const STORAGE_KEY = 'jd-match:last-result';

interface StoredResult {
  locale: string;
  result: JdResult;
}

const isJdResult = (value: unknown): value is JdResult => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as JdResult;
  return (
    typeof candidate.fitScore === 'number' &&
    [
      candidate.summary,
      candidate.matchedSkills,
      candidate.gaps,
      candidate.pitch,
      candidate.relevantExperience,
    ].every(Array.isArray)
  );
};

const loadStoredResult = (locale: Locale): JdResult | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredResult;
    return parsed.locale === locale && isJdResult(parsed.result) ? parsed.result : null;
  } catch {
    return null;
  }
};

const saveStoredResult = (locale: Locale, result: JdResult) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ locale, result } satisfies StoredResult));
  } catch {
    // 시크릿 모드 등 저장 불가 환경은 무시
  }
};

const TONES = {
  match: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  gap: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  neutral: 'bg-muted text-foreground',
} as const;

// 적합도 점수 밴드 → 색상(한눈에 좋음/보통/낮음 신호)
const scoreBand = (score: number): 'low' | 'mid' | 'high' =>
  score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low';

const SCORE_TEXT = {
  high: 'text-emerald-600 dark:text-emerald-400',
  mid: 'text-amber-600 dark:text-amber-400',
  low: 'text-rose-400 dark:text-rose-400/90',
} as const;

const SCORE_BAR = {
  high: 'bg-emerald-500',
  mid: 'bg-amber-500',
  low: 'bg-rose-400/80',
} as const;

// 적합도 헤드라인 패널 — 흰 배경과 구분되되 은은한 밴드 색 틴트
const SCORE_PANEL = {
  high: 'border-emerald-200/50 bg-emerald-50/40 dark:border-emerald-500/15 dark:bg-emerald-500/[0.04]',
  mid: 'border-amber-200/50 bg-amber-50/40 dark:border-amber-500/15 dark:bg-amber-500/[0.04]',
  low: 'border-rose-200/50 bg-rose-50/40 dark:border-rose-500/15 dark:bg-rose-500/[0.04]',
} as const;

const TagList: FC<{ items: string[]; tone?: keyof typeof TONES }> = ({
  items,
  tone = 'neutral',
}) => (
  <div className='flex flex-wrap gap-2.5'>
    {items.map(item => (
      <span key={item} className={cn('rounded-full px-3 py-1 text-xs', TONES[tone])}>
        {item}
      </span>
    ))}
  </div>
);

const ResultHeading: FC<{ icon: LucideIcon; children: ReactNode }> = ({ icon: Icon, children }) => (
  <span className='flex items-center gap-1.5 text-sm font-semibold'>
    <Icon className='text-muted-foreground size-4' />
    {children}
  </span>
);

const JdMatch: FC<Props> = ({ locale, labels }) => {
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JdResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const [token, setToken] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { open, setOpen } = useJdMatch();

  // SITE_KEY가 설정된 환경에서만 Turnstile을 강제. 토큰 발급 전에는 전송 UI 비활성.
  const turnstileBlocked = Boolean(SITE_KEY) && !token;

  // 새로고침 후에도 마지막 결과 복원 (sessionStorage는 클라이언트 전용이라 effect에서)
  useEffect(() => {
    const stored = loadStoredResult(locale);
    if (stored) setResult(stored);
  }, [locale]);

  // 로딩 중 분석 단계 문구를 순환시켜 "AI가 분석 중"인 느낌을 준다.
  useEffect(() => {
    if (!loading) return;
    setStepIndex(0);
    const id = setInterval(() => {
      setStepIndex(prev => (prev + 1) % labels.analyzingSteps.length);
    }, 1600);
    return () => clearInterval(id);
  }, [loading, labels.analyzingSteps.length]);

  // 결과 도착 시 결과 섹션으로 부드럽게 스크롤 (form 아래 새 컨텐츠 인지 유도).
  useEffect(() => {
    if (!result) return;
    const id = requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(id);
  }, [result]);

  const analyze = async () => {
    const trimmed = jd.trim();
    if (!trimmed) {
      setErrorMsg(labels.empty);
      return;
    }
    if (loading) return;

    setErrorMsg(null);
    setModalError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch('/api/jd-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd: trimmed, locale, turnstileToken: token ?? undefined }),
      });

      // 토큰은 단발성 → 즉시 무효화 후 위젯 reset(다음 발급 전까지 전송 UI 잠금).
      setToken(null);
      setResetSignal(signal => signal + 1);

      if (res.status === 503) {
        setModalError(labels.limit);
        return;
      }
      if (!res.ok) {
        setModalError(labels.error);
        return;
      }

      const data = (await res.json()) as JdResult;
      setResult(data);
      saveStoredResult(locale, data);
    } catch {
      setModalError(labels.error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void analyze();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className='flex max-h-[85vh] max-w-[92vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl'
        onOpenAutoFocus={event => {
          event.preventDefault();
          textareaRef.current?.focus();
        }}
      >
        <DialogHeader className='border-border/70 shrink-0 space-y-1.5 border-b px-5 py-4 pr-12 sm:px-6 sm:pr-14'>
          <DialogTitle className='flex items-center gap-2'>
            <Sparkles className='size-5 text-blue-500 dark:text-blue-400' />
            <span className='leading-none'>{labels.title}</span>
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
          </DialogTitle>
          <DialogDescription className='text-xs'>{labels.description}</DialogDescription>
        </DialogHeader>

        <div className='flex flex-1 flex-col gap-4 overflow-y-auto scroll-smooth px-5 py-5 sm:px-6'>
          {/* 입력 */}
          <form onSubmit={onSubmit} className='flex flex-col gap-3'>
            <textarea
              ref={textareaRef}
              value={jd}
              onChange={event => setJd(event.target.value)}
              placeholder={labels.placeholder}
              rows={8}
              maxLength={8000}
              disabled={loading}
              className='border-border bg-background focus:ring-ring w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none focus:ring-1 disabled:opacity-60'
            />

            <div className='flex items-center justify-between gap-3'>
              {SITE_KEY ? (
                <Turnstile siteKey={SITE_KEY} onToken={setToken} resetSignal={resetSignal} />
              ) : (
                <span />
              )}
              <button
                type='submit'
                disabled={loading || !jd.trim() || turnstileBlocked}
                className='bg-foreground text-background flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {loading ? labels.analyzing : labels.analyze}
              </button>
            </div>
          </form>

          {errorMsg && <p className='text-destructive text-sm'>{errorMsg}</p>}

          {/* 로딩: 결과 스켈레톤(생성 중) + 분석 단계 순환 문구 */}
          {loading && (
            <div className='flex flex-col gap-5'>
              {/* AI 상태 라인 */}
              <div className='flex items-center gap-2'>
                <Loader2 className='size-4 shrink-0 animate-spin text-blue-500 dark:text-blue-400' />
                <div className='flex h-5 items-center overflow-hidden text-sm'>
                  {reduceMotion ? (
                    <span className='text-muted-foreground'>
                      {labels.analyzingSteps[stepIndex]}
                    </span>
                  ) : (
                    <AnimatePresence mode='wait'>
                      <motion.span
                        key={stepIndex}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        className='text-muted-foreground'
                      >
                        {labels.analyzingSteps[stepIndex]}
                      </motion.span>
                    </AnimatePresence>
                  )}
                </div>
              </div>

              {/* 결과 레이아웃 고스트 */}
              <div className='flex animate-pulse flex-col gap-5'>
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center justify-between'>
                    <div className='bg-muted h-4 w-14 rounded' />
                    <div className='bg-muted h-7 w-16 rounded' />
                  </div>
                  <div className='bg-muted h-2 w-full rounded-full' />
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='bg-muted h-3 w-full rounded' />
                  <div className='bg-muted h-3 w-11/12 rounded' />
                  <div className='bg-muted h-3 w-4/5 rounded' />
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='bg-muted h-4 w-24 rounded' />
                  <div className='flex flex-wrap gap-2'>
                    <div className='bg-muted h-6 w-28 rounded-full' />
                    <div className='bg-muted h-6 w-40 rounded-full' />
                    <div className='bg-muted h-6 w-24 rounded-full' />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 에러 + 재시도 */}
          {!loading && modalError && (
            <div className='flex flex-col items-center gap-4 py-8 text-center'>
              <CircleAlert className='text-destructive size-6' />
              <p className='text-destructive text-sm'>{modalError}</p>
              <button
                type='button'
                onClick={() => void analyze()}
                className='bg-foreground text-background cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors hover:opacity-90'
              >
                {labels.analyze}
              </button>
            </div>
          )}

          {/* 결과 */}
          {!loading && !modalError && result && (
            <ErrorBoundary fallback={<p className='text-destructive text-sm'>{labels.error}</p>}>
              <motion.div
                ref={resultRef}
                className='flex flex-col gap-8'
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                {/* 적합도 — 헤드라인 패널 */}
                <div
                  className={cn(
                    'flex flex-col gap-3 rounded-xl border p-5',
                    SCORE_PANEL[scoreBand(result.fitScore)],
                  )}
                >
                  <div className='flex items-baseline justify-between'>
                    <span className='text-sm font-medium'>{labels.fitScore}</span>
                    <span
                      className={cn('text-4xl font-bold', SCORE_TEXT[scoreBand(result.fitScore)])}
                    >
                      {result.fitScore}
                      <span className='text-muted-foreground text-base font-normal'>/100</span>
                    </span>
                  </div>
                  <div className='h-2.5 w-full overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/10'>
                    {reduceMotion ? (
                      <div
                        className={cn('h-full rounded-full', SCORE_BAR[scoreBand(result.fitScore)])}
                        style={{ width: `${result.fitScore}%` }}
                      />
                    ) : (
                      <motion.div
                        className={cn('h-full rounded-full', SCORE_BAR[scoreBand(result.fitScore)])}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.fitScore}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                      />
                    )}
                  </div>
                  {result.summary.length > 0 && (
                    <div className='flex flex-col gap-1.5 pt-1'>
                      {result.summary.map((line, index) => (
                        <p
                          key={index}
                          className='text-foreground/80 text-sm leading-relaxed break-keep'
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {result.matchedSkills.length > 0 && (
                  <div className='flex flex-col gap-3'>
                    <ResultHeading icon={CircleCheck}>{labels.matchedSkills}</ResultHeading>
                    <TagList items={result.matchedSkills} tone='match' />
                  </div>
                )}

                {result.gaps.length > 0 && (
                  <div className='flex flex-col gap-3'>
                    <ResultHeading icon={CircleAlert}>{labels.gaps}</ResultHeading>
                    <TagList items={result.gaps} tone='gap' />
                  </div>
                )}

                {result.pitch.length > 0 && (
                  <div className='flex flex-col gap-3'>
                    <ResultHeading icon={Sparkles}>{labels.pitch}</ResultHeading>
                    <ul className='marker:text-muted-foreground flex list-disc flex-col gap-2.5 pl-5 text-sm leading-relaxed break-keep'>
                      {result.pitch.map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.relevantExperience.length > 0 && (
                  <div className='flex flex-col gap-3'>
                    <ResultHeading icon={Briefcase}>{labels.relevantExperience}</ResultHeading>
                    <ul className='flex flex-col gap-3'>
                      {result.relevantExperience.map((item, index) => (
                        <li key={index} className='border-border bg-muted/30 rounded-lg border p-4'>
                          <p className='text-sm font-semibold break-keep'>{item.title}</p>
                          <p className='text-muted-foreground mt-1 text-sm leading-relaxed break-keep'>
                            {item.why}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className='text-muted-foreground border-border/60 border-t pt-3 text-[10px]'>
                  {labels.disclaimer}
                </p>
              </motion.div>
            </ErrorBoundary>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JdMatch;
