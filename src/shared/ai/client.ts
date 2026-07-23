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
export const CHAT_MODEL = 'gemini-2.5-flash';
export const JD_MODEL = 'gemini-2.5-flash';
