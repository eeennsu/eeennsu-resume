# eunsu-resume

Next.js 기반의 개인 웹 이력서 프로젝트

## Safety Boundaries

- prod DB 마이그레이션: `bun run db:push` / `bun run db:migrate` 는 로컬 DB에서만. 프로덕션 Neon 인스턴스에 대한 직접 실행 금지. 승인 경로: 스키마 변경은 PR 리뷰 후 `db:generate` 로 생성한 마이그레이션 파일을 별도 배포 파이프라인으로 적용
- 비밀키 커밋 금지: `GEMINI_API_KEY`, `GITHUB_TOKEN`, `DATABASE_URL` 등 `.env*` 값이나 하드코딩된 키는 커밋 대상에서 제외. 승인 경로: `.env.example` 갱신 → Vercel/Neon 대시보드에서 로테이션

## Gotchas

<!--
  Facts that survive reading the code: a decision whose reason is not in the
  repo, a trap that looks like a bug, an invariant nothing checks.

  Empty is the correct state for a new repo. Do not fill this in by guessing;
  a wrong gotcha is worse than a missing one. Add entries as you hit them.

  Layer boundaries, slice isolation and public-API access are enforced by
  eslint (`npm run lint`), so they are deliberately not restated here.
-->
