import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { incrementAndCheck, recordTokens, refund } from '@shared/ai/cap';
import { getAnthropic, JD_MODEL } from '@shared/ai/client';
import { buildJdSystemPrompt } from '@shared/ai/prompts';
import { checkOrigin, verifyTurnstile, wrapUntrusted } from '@shared/ai/security';
import { DEFAULT_LOCALE, isLocale } from '@shared/i18n/config';
import { z } from 'zod';

// fs(이력서 로드) + dotenv(db) 때문에 Edge 불가. Sonnet 원샷 여유.
export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_JD_LENGTH = 8000;

// output_config.format은 min/max 등 수치 제약 미지원 → fitScore 범위는 코드에서 clamp.
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
  const client = getAnthropic();

  try {
    // 5. Sonnet 구조화 출력. Sonnet 5는 temperature 미지원 → effort low로 바운드.
    //    JD는 태그로 래핑(인젝션 방어).
    const message = await client.messages.parse({
      model: JD_MODEL,
      max_tokens: 2048,
      system,
      output_config: { format: zodOutputFormat(jdSchema), effort: 'low' },
      messages: [{ role: 'user', content: wrapUntrusted('jd_data', jd) }],
    });

    const parsed = message.parsed_output;
    if (!parsed) {
      await refund('jd');
      return new Response('Analysis failed', { status: 502 });
    }

    void recordTokens('jd', message.usage.input_tokens, message.usage.output_tokens);

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
