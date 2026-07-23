import { incrementAndCheck, recordTokens } from '@shared/ai/cap';
import { CHAT_MODEL, getGemini } from '@shared/ai/client';
import { buildChatSystemPrompt } from '@shared/ai/prompts';
import { checkOrigin, verifyTurnstile, wrapUntrusted } from '@shared/ai/security';
import { DEFAULT_LOCALE, isLocale } from '@shared/i18n/config';

// fs(이력서 로드) + dotenv(db) 때문에 Edge 불가. 스트림 전체를 덮도록 여유.
export const runtime = 'nodejs';
export const maxDuration = 30;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBody {
  messages?: ChatMessage[];
  locale?: string;
  turnstileToken?: string;
}

export async function POST(request: Request) {
  // 1. Origin 체크
  if (!checkOrigin(request)) {
    return new Response('Forbidden', { status: 403 });
  }

  let body: ChatBody;
  try {
    body = (await request.json()) as ChatBody;
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response('Bad Request', { status: 400 });
  }

  // 2. Turnstile 봇 차단
  const turnstileOk = await verifyTurnstile(body.turnstileToken);
  if (!turnstileOk) {
    return new Response('Turnstile verification failed', { status: 403 });
  }

  // 3. 전역 일일 캡 (원자적 선증가)
  const cap = await incrementAndCheck('chat');
  if (!cap.ok) {
    return new Response('Daily limit reached', { status: 503 });
  }

  const locale = body.locale && isLocale(body.locale) ? body.locale : DEFAULT_LOCALE;
  const system = buildChatSystemPrompt(locale);

  // 사용자 메시지는 태그로 래핑(인젝션 방어). assistant는 그대로 전달.
  // Gemini는 assistant 롤을 'model'로 표기한다.
  const contents = messages.map(message =>
    message.role === 'user'
      ? {
          role: 'user' as const,
          parts: [{ text: wrapUntrusted('user_question', String(message.content)) }],
        }
      : { role: 'model' as const, parts: [{ text: String(message.content) }] },
  );

  const client = getGemini();
  const encoder = new TextEncoder();

  // 4. Gemini Flash 스트리밍. 챗봇 응답성 위해 thinking 비활성.
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const geminiStream = await client.models.generateContentStream({
          model: CHAT_MODEL,
          contents,
          config: {
            systemInstruction: system,
            temperature: 0.3,
            maxOutputTokens: 1024,
            thinkingConfig: { thinkingBudget: 0 },
          },
        });

        let usage: { promptTokenCount?: number; candidatesTokenCount?: number } | undefined;
        for await (const chunk of geminiStream) {
          const text = chunk.text;
          if (text) controller.enqueue(encoder.encode(text));
          if (chunk.usageMetadata) usage = chunk.usageMetadata;
        }

        if (usage) {
          void recordTokens('chat', usage.promptTokenCount ?? 0, usage.candidatesTokenCount ?? 0);
        }
      } catch (err) {
        console.error('[api/chat] stream error', err);
        controller.enqueue(
          encoder.encode('\n[일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.]'),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
