import fs from 'fs';
import path from 'path';

import { Locale } from '@shared/i18n/config';

// 이력서를 구성하는 subject YAML 파일들 (읽는 순서 = 문서 순서)
const SUBJECTS = [
  'profile',
  'introduce',
  'experience',
  'skill',
  'portfolio',
  'education',
  'certification',
] as const;

const cache = new Map<Locale, string>();

// locale별 전체 이력서를 하나의 라벨링된 텍스트로 조립한다.
// 콘텐츠가 작아(수만 자) 통째로 시스템 프롬프트에 주입한다. 벡터DB/청킹 불필요.
// 빌드당 정적이므로 모듈 레벨에서 메모이즈한다.
export const getResumeContext = (locale: Locale): string => {
  const cached = cache.get(locale);
  if (cached) return cached;

  const sections = SUBJECTS.map(subject => {
    const filePath = path.join(process.cwd(), 'src/subjects', locale, `${subject}.yaml`);
    try {
      const raw = fs.readFileSync(filePath, 'utf8').trim();
      return `## ${subject}\n${raw}`;
    } catch (err) {
      console.error(`[resumeContext] failed to read ${locale}/${subject}.yaml`, err);
      return '';
    }
  }).filter(Boolean);

  const context = sections.join('\n\n');
  cache.set(locale, context);

  return context;
};
