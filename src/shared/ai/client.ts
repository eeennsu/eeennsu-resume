import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

// 서버 전용 Anthropic 클라이언트. ANTHROPIC_API_KEY 미설정 시 명확히 실패한다.
export const getAnthropic = (): Anthropic => {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  if (!client) {
    client = new Anthropic();
  }

  return client;
};

// 챗봇은 저비용 Haiku, JD 분석은 추론 품질이 필요한 Sonnet.
export const CHAT_MODEL = 'claude-haiku-4-5';
export const JD_MODEL = 'claude-sonnet-5';
