const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// 허용 Origin (프로덕션 + Vercel 프리뷰 + 로컬)
const isAllowedOrigin = (origin: string | null): boolean => {
  if (!origin) return false;
  try {
    const { hostname } = new URL(origin);
    return (
      hostname === 'resume.eunsu.pro' ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.endsWith('.vercel.app')
    );
  } catch {
    return false;
  }
};

export const checkOrigin = (request: Request): boolean => {
  const origin = request.headers.get('origin');
  // 동일 출처 fetch는 origin 헤더가 없을 수 있음 → referer로 보조 판단
  if (!origin) {
    const referer = request.headers.get('referer');
    return referer ? isAllowedOrigin(new URL(referer).origin) : false;
  }
  return isAllowedOrigin(origin);
};

// Cloudflare Turnstile 토큰 서버 검증.
// 시크릿 미설정 시: 프로덕션은 거부(fail-closed), 개발은 통과(로컬 편의).
export const verifyTurnstile = async (token: string | undefined): Promise<boolean> => {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === 'production') return false;
    console.warn('[turnstile] TURNSTILE_SECRET_KEY not set — bypassing in development');
    return true;
  }

  if (!token) return false;

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error('[turnstile] verify failed', err);
    return false;
  }
};

// 신뢰불가 입력을 태그로 래핑하기 전, 델리미터 토큰을 중화한다.
// 사용자가 </jd_data> 같은 걸 넣어 태그를 조기 종료시키는 인젝션을 막는다.
export const wrapUntrusted = (tag: string, content: string): string => {
  const neutralized = content
    .split(`<${tag}>`)
    .join(`< ${tag} >`)
    .split(`</${tag}>`)
    .join(`< /${tag} >`);
  return `<${tag}>\n${neutralized}\n</${tag}>`;
};
