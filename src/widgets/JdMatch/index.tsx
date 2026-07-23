'use client';

import AnimatedSection from '@shared/components/AnimatedSection';
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
  ArrowRight,
  Briefcase,
  CircleAlert,
  CircleCheck,
  Info,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FC, FormEvent, ReactNode, useEffect, useRef, useState } from 'react';

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
  const [open, setOpen] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const tokenRef = useRef<string | undefined>(undefined);
  const reduceMotion = useReducedMotion();

  // 로딩 중 분석 단계 문구를 순환시켜 "AI가 분석 중"인 느낌을 준다.
  useEffect(() => {
    if (!loading) return;
    setStepIndex(0);
    const id = setInterval(() => {
      setStepIndex(prev => (prev + 1) % labels.analyzingSteps.length);
    }, 1600);
    return () => clearInterval(id);
  }, [loading, labels.analyzingSteps.length]);

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
        body: JSON.stringify({ jd: trimmed, locale, turnstileToken: tokenRef.current }),
      });

      // 토큰은 단발성 → 다음 분석용으로 갱신
      setResetSignal(signal => signal + 1);

      if (res.status === 503) {
        setModalError(labels.limit);
        return;
      }
      if (!res.ok) {
        setModalError(labels.error);
        return;
      }

      setResult((await res.json()) as JdResult);
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
    <AnimatedSection id='jd-match' className='flex w-full max-md:flex-col max-md:gap-4'>
      {/* 제목 없이 콘텐츠만 우측 정렬(형제 섹션 콘텐츠 열과 라인 일치) */}
      <div aria-hidden className='hidden md:block md:min-w-[210px]' />
      <div className='flex grow flex-col gap-4'>
        {/* 기능 진입 CTA 카드 — 클릭 시 모달에서 입력·분석·결과 */}
        <button
          type='button'
          onClick={() => setOpen(true)}
          className='group border-border bg-muted/30 hover:bg-muted/50 flex cursor-pointer items-center gap-4 rounded-2xl border p-5 text-left transition-colors hover:border-blue-500/40'
        >
          <span className='border-border bg-background flex size-11 shrink-0 items-center justify-center rounded-xl border'>
            <Sparkles className='size-5 text-blue-500 dark:text-blue-400' />
          </span>
          <span className='flex grow flex-col gap-0.5'>
            <span className='font-semibold'>{labels.title}</span>
            <span className='text-muted-foreground text-sm break-keep'>{labels.description}</span>
          </span>
          <span className='text-muted-foreground group-hover:text-foreground flex shrink-0 items-center gap-1 text-sm font-medium transition-colors'>
            <span className='max-sm:hidden'>{labels.cta}</span>
            <ArrowRight className='size-4 transition-transform group-hover:translate-x-0.5' />
          </span>
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-h-[85vh] max-w-[92vw] overflow-y-auto sm:max-w-3xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Sparkles className='size-5 text-blue-500 dark:text-blue-400' />
              {labels.title}
            </DialogTitle>
            <DialogDescription>{labels.description}</DialogDescription>
          </DialogHeader>

          {/* 입력 */}
          <form onSubmit={onSubmit} className='flex flex-col gap-3'>
            <textarea
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
                {loading ? labels.analyzing : labels.analyze}
              </button>
            </div>
          </form>

          {/* 작동 방식 안내 */}
          <p className='text-muted-foreground flex items-start gap-1.5 text-xs leading-relaxed break-keep'>
            <Info className='mt-0.5 size-3.5 shrink-0' />
            <span>{labels.modelNote}</span>
          </p>

          {errorMsg && <p className='text-destructive text-sm'>{errorMsg}</p>}

          {/* 로딩: 결과 스켈레톤(생성 중) + 분석 단계 순환 문구 */}
          {loading && (
            <div className='flex flex-col gap-5'>
              {/* AI 상태 라인 */}
              <div className='flex items-center gap-2'>
                <Sparkles className='size-4 shrink-0 animate-pulse text-blue-500 dark:text-blue-400' />
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
                className='bg-foreground text-background rounded-full px-5 py-2 text-sm font-medium transition-colors hover:opacity-90'
              >
                {labels.analyze}
              </button>
            </div>
          )}

          {/* 결과 */}
          {!loading && !modalError && result && (
            <div className='flex flex-col gap-8'>
              {/* 적합도 — 헤드라인 패널 */}
              <div className='bg-muted/40 flex flex-col gap-3 rounded-xl p-5'>
                <div className='flex items-baseline justify-between'>
                  <span className='text-sm font-medium'>{labels.fitScore}</span>
                  <span
                    className={cn('text-4xl font-bold', SCORE_TEXT[scoreBand(result.fitScore)])}
                  >
                    {result.fitScore}
                    <span className='text-muted-foreground text-base font-normal'>/100</span>
                  </span>
                </div>
                <div className='bg-muted h-2.5 w-full overflow-hidden rounded-full'>
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      SCORE_BAR[scoreBand(result.fitScore)],
                    )}
                    style={{ width: `${result.fitScore}%` }}
                  />
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
                      <li key={index} className='border-border rounded-lg border p-4'>
                        <p className='text-sm font-semibold break-keep'>{item.title}</p>
                        <p className='text-muted-foreground mt-1 text-sm leading-relaxed break-keep'>
                          {item.why}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className='text-muted-foreground pt-1 text-[10px]'>{labels.disclaimer}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AnimatedSection>
  );
};

export default JdMatch;
