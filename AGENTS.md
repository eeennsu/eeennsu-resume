<!-- BEGIN:nextjs-agent-rules -->

# Next.js: 코드 작성 전 항상 docs를 먼저 읽을 것

Next.js 관련 작업을 하기 전에 `node_modules/next/dist/docs/`에서 관련 문서를 찾아 읽으세요. 학습 데이터는 오래되었으며, docs가 source of truth입니다.

<!-- END:nextjs-agent-rules -->

---

# Project Overview

**eunsu-resume** — Next.js 15 App Router + React 19 + TypeScript + Tailwind CSS 4 기반의 프론트엔드 개발자 개인 이력서 사이트.
이력서 콘텐츠는 코드가 아닌 `src/subjects/*.yaml` 파일로 관리되며, 빌드 타임에 정적으로 로드됩니다.

라이브: https://resume.eunsu.pro/

---

# Project Rules

- **패키지 매니저는 항상 `bun`을 사용할 것.** `npm`, `pnpm`, `yarn` 사용 금지. `package-lock.json` / `pnpm-lock.yaml` 생성 금지.
- 의존성을 추가할 때는 `bun add <pkg>` (런타임), `bun add -d <pkg>` (개발). 스크립트 실행은 `bun run <script>`.
- 새 파일 생성보다 기존 파일 수정을 우선할 것.
- 문서 파일(`*.md`, `README.md`)은 사용자가 명시적으로 요청하지 않는 한 새로 만들지 말 것.

---

# Architecture (Feature-Sliced Design)

`src/` 하위는 FSD 컨벤션을 따른다. 의존성은 **위 레이어 → 아래 레이어** 한 방향으로만 흐른다.

```
src/
├── app/          # Next.js App Router (page, layout, route handler)
├── widgets/      # 페이지 단위 섹션 (Profile, Experience, Skill, Portfolio …)
├── features/     # 도메인별 UI/로직 단위 (experience, portfolio, profile, skill, github)
├── shared/       # 재사용 가능한 공용 코드 (components, hooks, libs, types, utils, consts, shadcn-ui, font)
├── db/           # Drizzle ORM 스키마 / 클라이언트 (방문자 트래킹용)
└── subjects/     # 이력서 콘텐츠 YAML (profile, introduce, experience, skill, portfolio, education, certification)
```

## Import Alias

`tsconfig.json` 경로 별칭을 반드시 사용할 것. 상대경로 `../../`는 금지.

| Alias         | 대상             |
| ------------- | ---------------- |
| `@app/*`      | `src/app/*`      |
| `@widgets/*`  | `src/widgets/*`  |
| `@features/*` | `src/features/*` |
| `@shared/*`   | `src/shared/*`   |
| `@db/*`       | `src/db/*`       |

## Layer Rules

- **app**: 라우팅, 메타데이터, 레이아웃만. 비즈니스 로직 금지.
- **widgets**: 여러 features를 조합해 페이지 섹션을 만든다. 다른 widget을 import하지 않는다.
- **features**: 도메인별 작은 UI 단위 (Card, Item, Head 등). 다른 feature를 import하지 않는다.
- **shared**: 모든 레이어가 사용 가능. 도메인 지식이 없는 순수 유틸/공용 컴포넌트만.

---

# Content Management (YAML)

이력서 콘텐츠는 모두 `src/subjects/*.yaml`로 관리된다. 본문 텍스트, 회사 경력, 프로젝트 등을 수정할 때는 **컴포넌트가 아닌 YAML을 수정할 것**.

- 로딩: `loadSubjects<T>('xxx.yaml')` ([src/shared/utils/utilFetchSubjects.ts](src/shared/utils/utilFetchSubjects.ts))
- 타입: [src/shared/types/subjects.ts](src/shared/types/subjects.ts) — YAML 스키마를 변경할 때는 이 파일의 인터페이스도 함께 수정해야 한다.
- YAML은 서버 컴포넌트에서 빌드 타임에 fs로 읽으므로, **클라이언트 컴포넌트(`'use client'`)에서 직접 호출 금지**.

문서/뱃지/링크 같은 표시용 텍스트는 가능하면 YAML로 빼고, 컴포넌트는 렌더링만 책임지게 유지한다.

---

# Tech Stack & Conventions

## Framework

- **Next.js 15 App Router** (Turbopack dev) — RSC가 기본. `'use client'`는 진짜 필요할 때만 (브라우저 API, 이벤트 핸들러, hooks).
- **React 19** — `use()`, Actions, ref-as-prop 등 신기능 활용 가능.
- **TypeScript** — `any` 금지. 외부 데이터(YAML, API)는 `src/shared/types/`에 인터페이스 정의 후 사용.

## Styling

- **Tailwind CSS 4** — 유틸리티 퍼스트. 커스텀 CSS는 `src/app/globals.css`에 한정.
- 클래스 머지는 `cn()` ([src/shared/shadcn-ui/utils.ts](src/shared/shadcn-ui/utils.ts)) 사용. `clsx` + `tailwind-merge` 직접 호출 금지.
- 반응형은 모바일 퍼스트로 작성 (`md:`, `lg:`, `xl:`).
- 폰트: Pretendard(본문) + Open Sans(영문) — `font-pretendard`, `--font-open-sans` 변수로 사용.

## UI Components

- **shadcn-ui + Radix UI** — Accordion, Dialog, Tooltip, Separator. 새 primitive가 필요하면 `src/shared/shadcn-ui/ui/`에 추가.
- **lucide-react** — 아이콘은 이걸로 통일. 다른 아이콘 라이브러리 추가 금지.
- **motion (Framer Motion)** — 애니메이션. 과도한 애니메이션은 지양 (이력서는 가독성이 우선).

## Data / DB

- **Drizzle ORM + Neon PostgreSQL** — 방문자 트래킹 등 부가 기능 전용. 이력서 본문은 YAML이 source of truth.
- DB 스키마 변경 시: `bun run db:generate` → `bun run db:migrate`.

---

# Code Style

## Component

- 함수형 컴포넌트 + `FC` 타입. `default export` 사용 (FSD 디렉토리당 `index.tsx` 컨벤션).
- 디렉토리 구조: `widgets/Profile/index.tsx`, `features/profile/ui/Item/index.tsx` 식으로 폴더 단위로 구성.
- props 인터페이스는 컴포넌트 파일 안에서 `Props` 또는 `IXxxProps`로 선언.

## Naming

- 컴포넌트 폴더: `PascalCase` (예: `ActivityCard`, `LastUpdate`).
- 위젯/페이지 widget 컴포넌트는 `XxxWidget` 접미사 권장 (`ProfileWidget`, `ExperienceWidget`).
- YAML 인터페이스 prefix `I` (`IProfile`, `ICompanyExperience`).
- 유틸 함수 prefix `util` (예: `utilFetchSubjects`).

## Formatting / Lint

- **Prettier + ESLint** 강제. 빌드 시 `lint` → `prettier` → `next build` 순으로 실행되므로 둘 다 통과해야 한다.
- import 정렬은 `@trivago/prettier-plugin-sort-imports` 가 처리. 수동으로 재정렬하지 말 것.
- Tailwind 클래스 정렬은 `prettier-plugin-tailwindcss` 가 처리.

---

# SEO & Metadata

- 글로벌 메타데이터/JSON-LD는 [src/app/layout.tsx](src/app/layout.tsx)에서 관리. `Person` 스키마, OG, Twitter Card, robots 모두 여기에.
- 사이트 URL은 `SITE_URL` 상수 ([src/shared/consts/commons.ts](src/shared/consts/commons.ts))를 통해 사용. 하드코딩 금지.
- 검색엔진 verification 토큰(google, naver)을 변경할 때는 `metadata.verification` / `metadata.other`를 수정.
- 사이트맵은 `next-sitemap`으로 빌드 시 자동 생성. 새 페이지를 추가했다면 자동으로 포함되는지 확인.

---

# Commands

```bash
bun install              # 의존성 설치
bun run dev              # 개발 서버 (Turbopack)
bun run lint             # ESLint
bun run prettier         # Prettier 포맷팅
bun run build            # lint → prettier → next build
bun run start            # 프로덕션 서버

bun run db:generate      # Drizzle 마이그레이션 파일 생성
bun run db:migrate       # 마이그레이션 실행
bun run db:studio        # Drizzle Studio
bun run db:push          # 스키마 푸시
bun run db:pull          # 스키마 풀
```

---

# Don'ts

- ❌ `npm` / `pnpm` / `yarn` 사용
- ❌ `src/subjects/*.yaml` 대신 컴포넌트 안에 이력서 텍스트 하드코딩
- ❌ 컴포넌트 간 상대경로 import (`../../widgets/...`)
- ❌ `'use client'` 남발 — 가능하면 RSC로 유지
- ❌ `any` 타입
- ❌ 새 문서/README 파일 생성 (사용자가 요청하지 않는 한)
- ❌ widgets끼리 / features끼리 import
- ❌ Tailwind 외 별도 CSS-in-JS 도입

## Safety Boundaries

- Neon 프로덕션 DB에 쓰는 명령(`db:push`, `db:migrate`, `db:pull`)은 실행하지 않는다.
  `db:push`는 마이그레이션 파일 없이 스키마를 반영하므로 컬럼 드롭이 조용히 일어난다.
  → `src/db/schema.ts`까지만 고치고, 실행할 명령과 그 영향을 보고한 뒤 사람이 직접 돌린다.
- `.env`, `.env.production`은 읽지 않는다.
  → 키가 필요하면 이름만 말하고 `.env.example`에만 추가한다.
- `main`에 푸시하지 않는다. 푸시가 CI와 Vercel 프로덕션 배포를 건다.
  → 브랜치와 PR까지 만들고, 머지는 사람이 한다.
- `SLACK_WEBHOOK_URL`을 호출하지 않는다. 실행하면 실제 슬랙으로 메시지가 나간다.
  → 보낼 페이로드를 보여주고 사람이 보낸다.
- `velog-cron.yml`을 `workflow_dispatch`로 트리거하지 않는다. 외부 GraphQL을 치고 커밋까지 만든다.
  → 사람이 Actions에서 실행한다.
