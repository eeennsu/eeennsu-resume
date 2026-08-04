# ADR-0001: AI 에이전트 하네스 강화 (2026-07-27)

## Status

Accepted — 2026-07-27

## Context

`eunsu-resume` 리포에 대해 두 종류의 하네스 감사를 실시.

- **결정론적 개발 하네스** (ECC harness-audit.js): 30/49 (61%)
- **AI 에이전트 하네스** (7축 정성): 37/70 (53%)

두 감사가 공통으로 지목한 근본 문제는 **"문서화된 규칙이 도구로 강제되지 않음"**. AGENTS.md에 명시된 Don'ts(bun 전용, `any` 금지, FSD 경계, `'use client'` 자제)가 lint/CI/hook으로 자동 검증되지 않아 문서와 실제 설정이 다수 충돌하고 있었음.

## Decision

Quick Wins 및 잔여 P0/P1 항목을 한 세션에 묶어 반영한다.

| #   | 변경                                                                                       | 파일                                            |
| --- | ------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| 1   | `packageManager: "bun@1.3.13"` 명시                                                        | `package.json`                                  |
| 2   | `@typescript-eslint/no-explicit-any` 를 `'error'` 로 강화                                  | `eslint.config.js`                              |
| 3   | `tsc strict: true` 활성화                                                                  | `tsconfig.json`                                 |
| 4   | 미사용 alias `@entities/*`·`@lib/*` 제거                                                   | `tsconfig.json`                                 |
| 5   | AGENTS.md 의 YAML 경로 `{ko,en}` 로케일 구조 + `loadSubjects(rel, locale)` 시그니처로 갱신 | `AGENTS.md`                                     |
| 6   | CI 워크플로우 신설 (lint + typecheck + build)                                              | `.github/workflows/ci.yml`                      |
| 7   | FSD widgets 경계 위반 해소: `BehindTheScenes` 를 `features/velog/ui/` 로 이동              | `src/features/velog/ui/BehindTheScenes/*`       |
| 8   | widgets 간 `@widgets/*` import 를 ESLint 로 차단                                           | `eslint.config.js`                              |
| 9   | README 배포 섹션을 Vercel 자동 배포로 정정 (유령 `bun run deploy` 제거)                    | `README.md`                                     |
| 10  | `husky` + `lint-staged` 로 pre-commit 훅 도입                                              | `.husky/`, `.lintstagedrc.json`, `package.json` |

## Consequences

**긍정**

- 규칙이 실행 가능한 게이트(lint / typecheck / pre-commit / CI)로 강제되어 문서-코드 드리프트가 감소.
- 신규 AI 에이전트가 콜드 스타트할 때 자동 검증 루프로 즉시 실수를 감지 가능.
- FSD 위반이 lint 에러로 노출되어 확산 방지.

**부정 / 트레이드오프**

- `strict: true` 는 향후 리팩터링에서 타입 오류를 더 많이 노출할 수 있음(현재 코드는 통과).
- pre-commit 훅이 커밋 시간을 늘림 (lint-staged 로 staged 파일만 처리해 완화).
- Vercel 통합 배포로 전환됨을 명시했으나, 실제 Vercel 프로젝트 설정은 이 ADR 범위 외.

## 향후 과제 (Non-goals for this ADR)

- **features 간 크로스 참조 정리**: `src/features/profile/ui/LastUpdate/index.tsx:8` 의 `@features/github/apis/getBranchCommitDate` 참조. `getBranchCommitDate` 를 `shared/apis/` 로 승격하는 별도 세션 필요. 이번엔 widgets 규칙만 lint 로 강제.
- **`'use client'` 남용 감시**: 현재 25개 파일. 대형 widget 을 서버/클라이언트로 분리하는 리팩터링은 별도 과제.
- **evals/ 및 시각적 회귀 테스트**: 이력서 UI 특성상 스토리북 도입 여부는 후속 결정.
- **SECURITY.md**: 개인 이력서 성격상 스코프 검토 필요.
