import { GoogleGenAI } from '@google/genai';

let client: GoogleGenAI | null = null;

// 서버 전용 Gemini 클라이언트. GEMINI_API_KEY 미설정 시 명확히 실패한다.
export const getGemini = (): GoogleGenAI => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }

  return client;
};

// 챗봇·JD 분석 모두 무료 티어 Gemini Flash. JD는 구조화(JSON) 출력.
export const CHAT_MODEL = 'gemini-3.6-flash';
export const JD_MODEL = 'gemini-3.6-flash';

// 기본 모델이 과부하(503)일 때의 폴백. auto-current 별칭.
export const FALLBACK_MODEL = 'gemini-flash-latest';

// thinkingBudget:0은 3.5-flash에서만 허용(타 모델은 400) → 모델별로 결정.
// 3.6-flash는 400을 반환해 제외 (thinking 기본값으로 동작).
const THINKING_OFF_ALLOWED = new Set(['gemini-3.5-flash']);

export const thinkingConfigFor = (model: string): { thinkingBudget: number } | undefined =>
  THINKING_OFF_ALLOWED.has(model) ? { thinkingBudget: 0 } : undefined;

const RETRYABLE_STATUS = new Set([429, 500, 503]);

// Gemini 일시 오류(과부하/레이트리밋)만 재시도 대상으로 판별.
export const isRetryableGeminiError = (err: unknown): boolean => {
  const e = err as { status?: number; code?: number; message?: string };
  if (typeof e?.status === 'number' && RETRYABLE_STATUS.has(e.status)) return true;
  if (typeof e?.code === 'number' && RETRYABLE_STATUS.has(e.code)) return true;
  const msg = String(e?.message ?? '');
  return /unavailable|overloaded|high demand|try again later|rate limit|resource has been exhausted/i.test(
    msg,
  );
};

// 재시도 가능한 오류에 한해 지수 백오프(0.5s, 1s)로 재시도.
export const withGeminiRetry = async <T>(fn: () => Promise<T>, attempts = 3): Promise<T> => {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i === attempts - 1 || !isRetryableGeminiError(err)) throw err;
      await new Promise(res => setTimeout(res, 500 * 2 ** i));
    }
  }
  throw lastErr;
};
