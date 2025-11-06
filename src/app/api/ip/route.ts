import { NextRequest } from 'next/server';

export const GET = (req: NextRequest) => {
  const forwarded = req.headers.get('x-forwarded-for');

  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';

  return Response.json({ ip });
};
