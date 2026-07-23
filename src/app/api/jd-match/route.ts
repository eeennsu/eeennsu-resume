import { Type } from '@google/genai';
import { incrementAndCheck, recordTokens, refund } from '@shared/ai/cap';
import {
  FALLBACK_MODEL,
  getGemini,
  isRetryableGeminiError,
  JD_MODEL,
  thinkingConfigFor,
  withGeminiRetry,
} from '@shared/ai/client';
import { buildJdSystemPrompt } from '@shared/ai/prompts';
import { checkOrigin, verifyTurnstile, wrapUntrusted } from '@shared/ai/security';
import { DEFAULT_LOCALE, isLocale } from '@shared/i18n/config';
import { z } from 'zod';

// fs(이력서 로드) + dotenv(db) 때문에 Edge 불가. 원샷 분석 여유.
export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_JD_LENGTH = 8000;

// Gemini 응답 스키마(구조화 출력 강제). 수치 범위는 미보장 → fitScore는 코드에서 clamp.
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    fitScore: { type: Type.NUMBER },
    summary: { type: Type.ARRAY, items: { type: Type.STRING } },
    matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
    pitch: { type: Type.ARRAY, items: { type: Type.STRING } },
    relevantExperience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          why: { type: Type.STRING },
        },
        required: ['title', 'why'],
      },
    },
  },
  required: ['fitScore', 'summary', 'matchedSkills', 'gaps', 'pitch', 'relevantExperience'],
};

// 파싱 결과 런타임 검증(모델이 스키마를 어겨도 안전).
const jdSchema = z.object({
  fitScore: z.number(),
  summary: z.array(z.string()),
  matchedSkills: z.array(z.string()),
  gaps: z.array(z.string()),
  pitch: z.array(z.string()),
  relevantExperience: z.array(z.object({ title: z.string(), why: z.string() })),
});

interface JdBody {
  jd?: string;
  locale?: string;
  turnstileToken?: string;
}

export async function POST(request: Request) {
  // 1. Origin 체크
  if (!checkOrigin(request)) {
    return new Response('Forbidden', { status: 403 });
  }

  let body: JdBody;
  try {
    body = (await request.json()) as JdBody;
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  // 2. 입력 검증 (빈 값 / 길이 상한)
  const jd = typeof body.jd === 'string' ? body.jd.trim() : '';
  if (!jd) {
    return new Response('Empty JD', { status: 400 });
  }
  if (jd.length > MAX_JD_LENGTH) {
    return new Response('JD too long', { status: 400 });
  }

  // 3. Turnstile 봇 차단
  const turnstileOk = await verifyTurnstile(body.turnstileToken);
  if (!turnstileOk) {
    return new Response('Turnstile verification failed', { status: 403 });
  }

  // 4. 전역 일일 캡 (원자적 선증가)
  const cap = await incrementAndCheck('jd');
  if (!cap.ok) {
    return new Response('Daily limit reached', { status: 503 });
  }

  const locale = body.locale && isLocale(body.locale) ? body.locale : DEFAULT_LOCALE;
  const system = buildJdSystemPrompt(locale);
  const client = getGemini();

  // 5. Gemini 구조화 출력. JD는 태그로 래핑(인젝션 방어).
  const requestFor = (model: string) => {
    const thinking = thinkingConfigFor(model);
    return client.models.generateContent({
      model,
      contents: wrapUntrusted('jd_data', jd),
      config: {
        systemInstruction: system,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema,
        ...(thinking ? { thinkingConfig: thinking } : {}),
      },
    });
  };

  try {
    // 기본 모델 재시도 → 지속 과부하 시 폴백 모델로 1회 시도.
    let response;
    try {
      response = await withGeminiRetry(() => requestFor(JD_MODEL));
    } catch (err) {
      if (!isRetryableGeminiError(err)) throw err;
      console.warn('[api/jd-match] primary model overloaded, falling back');
      response = await requestFor(FALLBACK_MODEL);
    }

    const text = response.text;
    if (!text) {
      await refund('jd');
      return new Response('Analysis failed', { status: 502 });
    }

    let parsed: z.infer<typeof jdSchema>;
    try {
      parsed = jdSchema.parse(JSON.parse(text));
    } catch {
      await refund('jd');
      return new Response('Analysis failed', { status: 502 });
    }

    const usage = response.usageMetadata;
    void recordTokens('jd', usage?.promptTokenCount ?? 0, usage?.candidatesTokenCount ?? 0);

    // 6. fitScore 0~100 clamp (스키마가 범위를 보장하지 않음)
    const result = {
      ...parsed,
      fitScore: Math.max(0, Math.min(100, Math.round(parsed.fitScore))),
    };

    return Response.json(result);
  } catch (err) {
    console.error('[api/jd-match] error', err);
    await refund('jd');
    return new Response('Analysis failed', { status: 502 });
  }
}
