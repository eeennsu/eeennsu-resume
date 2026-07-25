# Velog 기술 블로그 정리 페이지 기획

Velog(`@diso592`)의 전체 포스트를 이력서 사이트에 태그 중심의 창의적인 UI로 재구성해 노출하고,
회사 Activity(실무 경험)와 velog 정리 글을 상호 연결해 학습-실무의 인과 체인을 시각화하는 페이지 기획.

원본: https://velog.io/@diso592/posts

> **v3 — v2 sanity check(BLOCKING 2 + HIGH 2 + MEDIUM 5 + LOW 1 + What's Missing 8) 반영본**.
> A1 / B1(수정) / C1 결정 유지. B1은 F2 Option B로 재조정 (`ISkill.items` 승격 제거, `items: string[]` 유지, `SKILL_KEYS`는 velog 카테고리 canonical만).
> 착수 전 [§5 사전 리팩터](#5-사전-리팩터-velog-작업-착수-전-필수) 3개 리팩터 완료 필수.

---

## 1. 목표

- Velog `@diso592`의 **모든 포스트 + 태그**를 이력서 사이트에 통합
- 이력서 스킬 세트 + **회사 Activity와 상호 연결**된 형태로 학습-실무 궤적을 시각화
- 이 페이지 자체가 어떻게 만들어졌는지 하단에 노출해 프론트엔드 실력 어필
- **주 타깃 방문자: 채용자·HR (다수가 개발자 출신)**
- 페이지 경로: **`/[locale]/writings`** (i18n 라우팅 통일 필수) + 상단 nav 강한 티저

---

## 2. 데이터 소스

### 2.1 Velog GraphQL API (비공식)

- 엔드포인트: `https://v2.velog.io/graphql`
- 커서 기반 페이지네이션으로 전체 포스트 fetch
- 비공식이라 스키마 변경 리스크 → fetch 스크립트 fallback (실패 시 이전 JSON 유지)

### 2.2 쿼리 (초안)

**전체 포스트 (페이지네이션)**

```graphql
query Posts($username: String!, $cursor: ID, $limit: Int) {
  posts(username: $username, cursor: $cursor, limit: $limit) {
    id
    title
    short_description
    thumbnail
    url_slug
    released_at
    tags
  }
}
```

**`userTags` 쿼리는 사용하지 않음** — `posts` 응답에서 파생 계산 (single source of truth, 정렬 일관성).

### 2.3 원본 URL

`https://velog.io/@diso592/${url_slug}` — 카드 클릭 시 원본 velog 이동 (자체 상세 페이지 없음).

### 2.4 실무 매핑 저장 — A1 확정

**언어 무관 매핑 파일**로 분리해 로케일 sync 붕괴 리스크 원천 제거.

**신규 파일: `src/data/activity-velog-mapping.yaml`**

```yaml
- activityId: eunsu-payments-refactor-2024
  techTags: [react, typescript, react-query] # 자동 매칭용
  featuredVelogSlugs: # 강조 (velog url_slug)
    - react-query-cache-strategy
  excludeVelogSlugs: [] # 매칭 제외
```

**`experience.{ko,en}.yaml`은 언어 종속 콘텐츠만** + **stable `id` 필드만 신설**. 날짜 필드(`startDate/endDate`, dot 포맷)는 **변경 없음**:

```yaml
- company: 회사X
  activities:
    - id: eunsu-payments-refactor-2024 # 신규 필수 (매핑 조인 키, §5.2 참조)
      title: 결제 시스템 리팩토링
      startDate: '2024.06' # 기존 유지
      endDate: '2024.09' # 기존 유지
      # 그 외 기존 필드 전부 그대로
```

velog slug는 experience YAML이 알지 않음 → velog slug 변경 시 이력서 원본 안 깨짐.

---

## 3. 데이터 파이프라인

### 3.1 전략 — C1 확정: 배포 시에만 fetch, committed JSON은 시드

- 배포 파이프라인에서만 `scripts/fetch-velog.ts` 실행 → `src/data/velog-posts.json` 갱신
- **커밋된 JSON은 로컬 dev · 오프라인 시드 용도로 재정의**
- CI에서 auto-push 하지 않음 (브랜치 보호 정책 충돌 회피)

### 3.2 실행 흐름 — bun 라이프사이클 훅 미실행 대응 + 스크립트 exit-code 계약

**bun은 `pre*`/`post*` 스크립트를 자동 실행하지 않음** → `build` 스크립트 명시적 체인:

```json
// package.json
{
  "scripts": {
    "fetch:velog": "bun scripts/fetch-velog.ts",
    "build": "bun run fetch:velog && bun run lint && bun run prettier && next build"
  }
}
```

**`scripts/fetch-velog.ts` 계약** (Step §14.2에 acceptance criteria로 포함):

- 모든 GraphQL 호출·파일 IO를 `try/catch`로 래핑
- 실패는 stderr에 로그, **반드시 `process.exit(0)`**
- 이전 `velog-posts.json` 존재 시 유지, 없으면 empty archive 생성
- non-zero exit은 `lint` / `prettier` / `next build` 단계 전용

이유: `&&` 체인에서 `fetch:velog`가 예외 propagate하면 build 전체 실패 → §15의 fallback 정책과 모순.

파이프라인 흐름:

```
bun run build
   ↓
fetch:velog       (내부 try/catch → 항상 exit 0)
   ↓
lint
   ↓
prettier
   ↓
next build
```

### 3.3 자동 갱신 — 새 글 감지 시 재빌드 (workflow artifact only)

- GitHub Actions cron으로 velog RSS(`VELOG_RSS_URL`) 폴링 (예: 1시간 간격)
- 최상단 글 `guid`/`pubDate`가 이전과 다르면 **배포 웹훅 트리거만**
- **state: workflow artifact only** (last-seen SHA + pubDate 저장). `last-seen.txt` in-repo 방식은 §3.1 auto-push 금지와 충돌하므로 **채택 안 함**
- artifact retention 기본 90일 내 cron 주기 유지 (미갱신 시 첫 폴링에서 full-fetch 재시딩)
- **debounce**: 짧은 시간창(예: 10분) 내 중복 트리거 억제, 동시 다발 새 글 시 배포 큐 스택 방지

### 3.4 데이터 스키마

```ts
// src/shared/types/velog.ts
export interface IVelogPost {
  id: string;
  title: string; // 원문(한국어) 그대로
  description: string;
  thumbnail: string | null;
  urlSlug: string;
  releasedAt: string; // ISO 8601
  tags: string[];
}

export interface IVelogArchive {
  fetchedAt: string;
  posts: IVelogPost[];
  /** posts로부터 파생, 정렬: count DESC, name ASC */
  tagStats: { name: string; count: number }[];
}
```

**tagStats 정렬 규약: `count DESC, name ASC`** — acceptance criteria에 명시.

### 3.5 사용자명 + RSS 상수

```ts
// src/shared/consts/velog.ts
export const VELOG_USERNAME = 'diso592';
export const VELOG_BASE_URL = `https://velog.io/@${VELOG_USERNAME}`;
export const VELOG_RSS_URL = `https://v2.velog.io/rss/@${VELOG_USERNAME}`;
```

### 3.6 `velog-posts.json` 배치 · git 관리

- 위치: **`src/data/velog-posts.json`** (`src/subjects/`는 로케일별 YAML 이력서 콘텐츠 전용 컨벤션)
- 커밋 O (시드용)
- 시드 없거나 로드 실패 시 **`utilFetchVelogArchive` 내부 empty 폴백** — checkout 직후 `bun run dev` 렌더 실패 안 함

### 3.7 `next.config.ts` `remotePatterns` (신규 스텝)

Velog 썸네일 CDN 도메인 등록 필수 (현재 config `{}` → `next/image` 사용 즉시 실패):

```ts
// next.config.ts
export default {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'velog.velcdn.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.velog.io', pathname: '/**' },
    ],
  },
};
```

**주의**: `velog.velcdn.com` / `images.velog.io` hostname은 라이브 검증 필요. **시드 fetch 후 최소 1개 포스트의 실제 thumbnail URL을 확인해 hostname을 확정**. `pathname: '/**'` 명시로 화이트리스트 명확화.

---

## 4. 폴더 구조 (FSD + i18n 라우팅 + RSC/Client 마커)

```
src/
├── app/
│   └── [locale]/                                # ⚠ 반드시 locale 하위
│       └── writings/
│           ├── page.tsx                          [server]
│           ├── loading.tsx                       [server] Suspense fallback (신규)
│           └── error.tsx                         [client] route-scope boundary (신규)
├── widgets/
│   ├── VelogArchive/                             [server] 페이지 컴포지션
│   ├── RecentWritings/                           [server] 홈 미니 위젯
│   └── BehindTheScenes/
│       ├── index.tsx                             [server]
│       ├── Diagram.tsx                           [server] 정적 SVG
│       └── FadeInWrapper.tsx                     [client] IO + reduced-motion
├── features/
│   ├── velog/
│   │   ├── ui/
│   │   │   ├── SkillMap/                         [server]
│   │   │   ├── TagCloud/
│   │   │   │   ├── index.tsx                     [server] 목록 렌더
│   │   │   │   └── TagCloudFilter.tsx            [client] 필터 상호작용
│   │   │   ├── Timeline/                         [server]
│   │   │   ├── VelogPostCard/                    [server, children slot]
│   │   │   └── VelogPostMiniCard/                [server]
│   │   └── model/
│   │       └── recentPosts.ts                    # 최근 N개 선별 유틸
│   ├── experience/
│   │   └── ui/ActivityCard/                      [server, children slot 확장]
│   ├── portfolio/
│   │   └── ui/Header/                            [client, ProfileHeader]
│   │       └── (Props에 latestVelogReleasedAt 확장, §5.3)
│   └── skill/
│       └── ui/
│           ├── SkillCard/                        [server] 상위 렌더러 (리팩터)
│           └── SkillBadge/                       [server] 배지 단위 (신규)
├── shared/
│   ├── consts/
│   │   ├── velog.ts                              # USERNAME / BASE_URL / RSS_URL
│   │   └── skills.ts                             # SKILL_KEYS = VelogSkillCategory canonical
│   ├── types/
│   │   ├── velog.ts
│   │   └── subjects.ts                           # IActivity 신설, IActivityVelogMapping 추가
│   ├── utils/
│   │   ├── utilFetchVelogArchive.ts              [server-only] `import 'server-only'`
│   │   ├── utilLoadYaml.ts                       # 로케일 무관 YAML 로더 (신규)
│   │   ├── utilMapTagToSkill.ts                  # SkillId 키 + label→SkillId best-effort
│   │   ├── utilMapActivityToVelog.ts             # (shared로 이동)
│   │   ├── utilIsRecentPost.ts                   # 빌드 시각 기준
│   │   └── tagColor.ts                           # 라이트/다크 페어
│   └── components/
│       ├── CrossLinkBadge/                       # features 간 오염 방지
│       │   ├── RelatedPostsBadge.tsx             # Activity → Velog
│       │   ├── ActivityBadge.tsx                 # Velog → Activity
│       │   └── RelatedPostsInline.tsx            # SkillBadge 슬롯 카운터
│       └── TagChip/                              # tagColor 적용
├── data/                                          # 신규
│   ├── velog-posts.json                           # 빌드 산출물 (시드 커밋)
│   └── activity-velog-mapping.yaml                # A1 매핑 (언어 무관)
└── subjects/
    ├── ko/experience.yaml                         # activity에 stable id만 추가 (날짜 필드 무변경)
    └── en/experience.yaml                         # 동일 (ko/en pairwise 검증)
```

`scripts/fetch-velog.ts` 는 프로젝트 루트 `scripts/` 하위 (신규).

### RSC/Client 마커 원칙

- **default: server** (RSC)
- client가 필요한 지점만 별도 파일로 분리해 `'use client'` 상단 표기
- **cross-feature 지식은 features 밖으로**: cross-link 배지 3종은 `shared/components/CrossLinkBadge/`, features는 순수 UI + slot(children)만 노출

---

## 5. 사전 리팩터 — velog 작업 착수 전 필수

v2 sanity check로 `ISkill.items` 승격은 실행 불가능하다는 결론 → **F2 Option B**: `items: string[]` 유지. 대신 아래 **3개 리팩터**를 별개 PR로 완료한 뒤 velog 작업 착수.

### 5.1 `SkillBadge` 컴포넌트 추출

- 현재 `SkillCard`가 카테고리 그룹 + 배지 렌더까지 직접 담당
- 배지 단위를 `features/skill/ui/SkillBadge/` 로 분리
- `SkillCard`는 상위 렌더러(카테고리 그룹)로 재작성
- velog 인라인 카운터(`RelatedPostsInline`)가 배지 옆 슬롯으로 붙을 수 있게 slot 준비

### 5.2 `IActivity` 타입 신설 + id 3-stage 단일 PR

**중요**: 타입 필수화와 YAML 갱신을 시간차로 두면 silent 런타임 홀 발생 (activity.id가 undefined인데 TS는 통과 → mapping join 실패가 "매핑 없음"과 구별 불가). **반드시 아래 3단계를 단일 PR에 묶음**.

**5.2a — 익명 배열 → 명명 타입 + id optional 도입**

```ts
// src/shared/types/subjects.ts
export interface IActivity {
  id?: string; // 임시 optional (5.2c에서 required로 승격)
  title: string;
  startDate?: string; // 기존 유지 (변경 없음, dot 포맷 '2024.06')
  endDate?: string; // 기존 유지 (변경 없음)
  description?: string;
  // ... 그 외 기존 필드 전부 그대로
}

export interface ICompanyExperience {
  // ...
  activities: IActivity[];
}
```

- `ActivityCard.Props`가 `IActivity`를 직접 참조 (`ICompanyExperience['activities'][number]` 인덱스 액세스 제거)
- **날짜 필드는 절대 변경 안 함** — `period` 필드 도입 금지 (v2 findings F3)

**5.2b — `experience.{ko,en}.yaml` id 부여**

- 명명 규칙: `{company-shortname}-{topic-kebab}-{yyyy}` (예: `eunsu-payments-refactor-2024`)
- ko/en 양쪽에 **동일 id** 부여
- pairwise 검증 스크립트: `activities.length` 일치 + id 배열 순서 일치 (`bun scripts/verify-experience-ids.ts`)

**5.2c — id required 승격**

```ts
export interface IActivity {
  id: string; // 필수화
  title: string;
  // ...
}
```

- TypeScript가 즉시 강제
- `utilMapActivityToVelog`의 join이 safe

**`IActivityVelogMapping` 타입도 함께 정의**:

```ts
export interface IActivityVelogMapping {
  activityId: string;
  techTags: string[];
  featuredVelogSlugs?: string[];
  excludeVelogSlugs?: string[];
}
```

### 5.3 `ProfileHeader` / `Header` velog 데이터 프롭 확장

v2 sanity check F1으로 발견: `[locale]/layout.tsx`는 `Header`를 직접 렌더하지 않음. **실제 렌더 체인**:

```
[locale]/layout.tsx → {children}
   ↓
[locale]/page.tsx
   ↓
widgets/Profile/index.tsx (RSC, profile.yaml 로드 중)
   ↓
features/portfolio/ui/Header/index.tsx (ProfileHeader, client, useVisibilityObserver)
   ↓
widgets/Header/index.tsx (client)
```

**해결 (F1 Option A, 최소 침습)**: `ProfileWidget` → `ProfileHeader` → `Header` prop drill.

**사전 리팩터 스코프**: 세 파일 인터페이스만 확장. velog 데이터는 아직 없어도 `null` 기본값으로 안전:

- `Header.Props`에 `latestVelogReleasedAt: string | null` 추가
- `ProfileHeader.Props`에 `latestVelogReleasedAt: string | null` 추가, `Header`에 그대로 전달
- `ProfileWidget`에서는 우선 `latestVelogReleasedAt={null}` 하드코딩으로 prop만 흘려보냄
- velog 인프라 준비 이후 `utilFetchVelogArchive()` 호출로 대체 (§14.7 step 34)

이 인터페이스 확장이 사전에 완료되면 velog 작업 시점에 데이터만 갈아끼우면 됨.

### 5.4 순서

세 리팩터를 별개 PR로 순차 진행 (병렬 안 됨 — 리팩터 간 코드 충돌 회피):

1. **5.1** SkillBadge 추출
2. **5.2** IActivity 3-stage (단일 PR로 5.2a → 5.2b → 5.2c 순)
3. **5.3** ProfileHeader / Header prop 확장 (null 기본값)

세 PR 모두 main에 안착, 프로덕션 회귀 없음 확인 후 velog 작업 착수.

---

## 6. UI 뷰 4종 (RSC/Client 명시)

### 6.1 Skill Map (#1)

- 배치: `features/velog/ui/SkillMap/` [server]
- 각 velog 카테고리(`SkillId`)별로 관련 velog 글 리스트 노출
- 확장 상호작용은 `<details>` 시맨틱 (client 불필요) 또는 얇은 client 서브
- 매핑: `utilMapTagToSkill.ts` — `Record<SkillId, readonly string[]>`

### 6.2 Tag Cloud + Filter (#2)

- 렌더: [server] — 태그 목록 + 카드 그리드
- **필터 상태는 URL query 기반** `?view=tag&tag=react`
- `TabTriggers` / `TagCloudFilter`만 얇은 [client] (Next `<Link>` 활용) — 뷰 컴포넌트는 RSC 유지
- 태그 컬러: `TagChip` + `tagColor.ts`
- MVP: 단일 태그 선택

### 6.3 Timeline (#3)

- 렌더: [server]
- 시맨틱: `<ol>` + `<time>`
- hover는 CSS만
- 태그 색 범례 상단 고정
- 기존 `ExperienceWidget` 톤 유지

### 6.4 Behind the Scenes — 파이프라인 다이어그램 (#4)

- 배치: `widgets/BehindTheScenes/`
- 구조:
  - `Diagram.tsx` [server] — 정적 SVG
  - `FadeInWrapper.tsx` [client] — IntersectionObserver + `prefers-reduced-motion` 존중
  - 서버 SVG를 client wrapper의 **children slot으로 주입** → hydration 비용 최소화

**시각화할 파이프라인**

```
[Velog @diso592]
    ↓  GraphQL 커서 페이지네이션 (배포 시)
[scripts/fetch-velog.ts]
    ↓  try/catch + process.exit(0) 강제
[src/data/velog-posts.json]  ← 시드 커밋 + 배포 시 갱신
    ↓  Next.js 16 App Router (RSC 정적 렌더링)
[/{locale}/writings]

+ GitHub Actions cron이 velog RSS 폴링 → 새 글 감지 시 배포 웹훅 트리거 (workflow artifact state)
```

**함께 노출할 메타**

- `fetchedAt` 기반 "3일 전" 배지
- 총 포스트 수 / 태그 수
- 기술 스택 배지: `Velog GraphQL`, `Next.js RSC`, `TypeScript`, `GitHub Actions`

---

## 7. UI 컴포지션 (확정: A)

```
┌──────────────────────────────────┐
│   Skill Map (히어로)              │
├──────────────────────────────────┤
│  [Tag Cloud] [Timeline]           │
│  ?view=tag  |  ?view=timeline     │
│                                   │
│   선택된 탭 뷰                    │
├──────────────────────────────────┤
│   Behind the Scenes                │
│   (server Diagram + client Fade)   │
└──────────────────────────────────┘
```

- 탭 전환은 URL query, `TabTriggers`만 얇은 client
- 뷰 컴포넌트는 RSC 유지 → 초기 번들 최소화

---

## 8. Activity ↔ Velog 상호 연결 (핵심)

### 8.1 방향 (확정: 후보 1 + 3 양방향)

- **Activity → Velog**: `ActivityCard` 하단 slot에 `RelatedPostsBadge`
- **Velog → Activity**: `VelogPostCard`(모든 뷰) slot에 `ActivityBadge`
- 클릭:
  - Activity → 관련 글 팝오버 or 확장
  - Velog → `/{locale}/#experience-{activityId}` 홈 앵커

### 8.2 매핑 파일 위치 — A1 확정

- `src/data/activity-velog-mapping.yaml` — 언어 무관
- 조인 키: `IActivity.id` (§5.2에서 필수화)
- experience YAML은 velog slug 미인지

### 8.3 매핑 로직 위치 — shared로 이동

- **`src/shared/utils/utilMapActivityToVelog.ts`** (`features/velog/model/` 아님 — 비대칭 결합 회피)
- 시그니처: `(activities: IActivity[], mappings: IActivityVelogMapping[], archive: IVelogArchive) => Map<activityId, IVelogPost[]>`
- `utilMapTagToSkill.ts`도 shared/utils

### 8.4 FSD 데이터 흐름

```
[widget: VelogArchive / ExperienceWidget]
    │
    ├─ loadSubjects('experience.yaml', locale)              # 기존 유틸
    ├─ utilLoadYaml('data/activity-velog-mapping.yaml')     # 신규 유틸 (§14.2 step 14)
    ├─ utilFetchVelogArchive()                              # [server-only]
    ├─ utilMapActivityToVelog(...) → Map<activityId, posts>
    │
    ├─→ ActivityCard 에 children slot으로 <RelatedPostsBadge posts={...} />
    └─→ VelogPostCard 에 children slot으로 <ActivityBadge activity={...} />
```

- **`loadYaml`은 기존 `loadSubjects`로 대체 불가** — `loadSubjects`는 `src/subjects/{locale}/` 하드코딩. 로케일 무관 YAML을 로드하는 신규 유틸 `utilLoadYaml.ts` 필요.
- `ActivityCard` / `VelogPostCard`는 순수 UI (slot children만 받음)
- Cross-link 컴포넌트는 `shared/components/CrossLinkBadge/`

---

## 9. 이력서 메인과의 연결점

### 9.1 상단 nav "Writings" 링크 + 새 글 dot — 데이터 흐름 (F1 Option A)

**실제 렌더 체인** (v2 sanity check로 확인):

```
[locale]/layout.tsx → {children}
  → [locale]/page.tsx
  → widgets/Profile (RSC)
  → features/portfolio/ui/Header (ProfileHeader, client)
  → widgets/Header (client)
```

**`layout.tsx`는 Header를 렌더하지 않으므로 layout에서 prop drill 불가.** 대신:

1. **`ProfileWidget`**(RSC, 이미 `profile.yaml` 로드 중)에서 `utilFetchVelogArchive()` 호출
2. `posts` 중 최신 `releasedAt`을 `latestVelogReleasedAt`으로 추출
3. `ProfileHeader`에 prop 전달 (§5.3 인터페이스 확장이 사전에 완료된 상태)
4. `ProfileHeader`는 `Header`에 재전달
5. `Header` 내부에서 `utilIsRecentPost(latestVelogReleasedAt, buildTime)` 판정으로 dot on/off
6. Nav 링크 target: `/{locale}/writings`

### 9.2 SkillWidget 인라인 노출

- `SkillBadge` 옆 slot으로 `RelatedPostsInline` (정리 글 개수)
- **label → SkillId best-effort 매핑** (`LABEL_TO_SKILL` 상수, §12 참조): 매칭 안 되는 item은 카운터 노출 안 함 (조용히 skip)
- CTA 딥링크: **`/{locale}/writings?view=skill&skill={SkillId}`** — 로케일 + URL query 통일

### 9.3 홈 "최근 글 3개" 미니 위젯 `RecentWritings`

- 시그니처: `<RecentWritings locale={locale} />`
- velog 데이터는 로케일 무관 로드, `locale`은 dictionary 라벨용
- 위치: **권장: Introduce 섹션 다음, Experience 섹션 앞** (구현 시 2안 스크린샷 최종 확정)
- 카드(`VelogPostMiniCard`): 썸네일, 원문 제목(한국어), 날짜, 태그 1-2개
- 하단 CTA: `/{locale}/writings` 이동

### 9.4 profile.yaml external link

기존 velog 링크 유지 (원본 계정 이동용).

---

## 10. 대응 정책 (프로젝트 표준 정합)

### 10.1 다크모드 + 태그 컬러 팔레트

- 프로젝트 이미 도입, 모든 신규 뷰 라이트/다크 대응 필수
- 색상은 프로젝트 CSS 변수 재사용, **하드코딩 금지**
- `tagColor.ts` 는 **뷰 착수 전에** 정의:

```ts
// src/shared/utils/tagColor.ts
export const TAG_CATEGORY_COLORS = {
  frontend: { light: 'var(--tag-frontend-light)', dark: 'var(--tag-frontend-dark)' },
  backend: { light: '...', dark: '...' },
  cs: { light: '...', dark: '...' },
  retrospect: { light: '...', dark: '...' },
  etc: { light: '...', dark: '...' },
};
```

- **WCAG AA 3:1 이상 대비 실측** (배경 vs 텍스트/아이콘)
- 색약 시뮬레이터로 페어 검증 — QA acceptance 항목화

### 10.2 i18n dictionary

- **velog 글 제목·설명 원문(한국어) 유지**
- **UI 라벨만 번역** — `dictionary.writings` 네임스페이스:

```
writings.pageTitle
writings.tab.tagCloud
writings.tab.timeline
writings.relatedPosts.zero / one / other      # {{count}} 인터폴레이션
writings.activityBadge.label                   # "실무 연결"
writings.recent.badge                          # "NEW"
writings.behindTheScenes.title
writings.lastFetched                           # "{{count}}일 전"
writings.nav.link                              # "Writings"
```

- **타입 미러링**: `Dictionary = typeof ko` 강제로 en.ts 미갱신 시 컴파일 실패 → ko/en 동시 갱신 checklist화 (§14 step 26)

### 10.3 접근성 (a11y)

- Skill Map / Tag Cloud: 키보드 네비, 명확한 포커스 링
- Timeline: `<ol>` + `<time>` 시맨틱
- **`prefers-reduced-motion: reduce` 존중 범위 (신규 + 기존 감사)**:
  - **신규**: Behind the Scenes fade-in, nav dot pulse, Tag Cloud / Skill Map hover transition
  - **기존 감사**: `AnimatedSection`(ProfileWidget 등), `useVisibilityObserver` 사용처, 프로젝트 내 기타 Framer Motion 애니메이션이 이미 reduced-motion 준수하는지 QA 라운드에 포함
- 태그 색상만으로 정보 구분 금지 → 텍스트 라벨 병기

### 10.4 네이밍

- `VelogPostCard`, `VelogPostMiniCard`
- `RelatedPostsBadge` / `ActivityBadge` / `RelatedPostsInline`
- YAML 인터페이스 prefix `I`
- Canonical `SkillId` 상수: `SKILL_KEYS` (velog 카테고리 enum, ISkill.items id 아님)

---

## 11. 자잘한 액션

### 11.1 RSS 링크 노출

- Behind the Scenes 근처 or Footer에 아이콘 → `VELOG_RSS_URL`

### 11.2 NEW 배지 — 서버 사전 계산

- **빌드 시각 기준** `utilIsRecentPost(post, buildTime)` → `isRecent: boolean`
- 컴포넌트는 boolean만 소비 → **RSC 유지**, hydration 불일치 회피
- 클라 현재시각(`Date.now()`) 사용 금지

### 11.3 태그 컬러 팔레트 통일

- §10.1 참조. `tagColor.ts` 뷰 착수 전 정의

---

## 12. 스킬 ↔ 태그 매핑 (`SKILL_KEYS` = VelogSkillCategory)

**중요**: `SKILL_KEYS`는 skill.yaml item의 id가 아니라 **velog 태그 매핑용 카테고리 enum**. skill.yaml의 28개 item은 `items: string[]` 그대로 유지.

```ts
// src/shared/consts/skills.ts
// VelogSkillCategory canonical enum — velog 정리 글이 존재할 만한 카테고리 subset
export const SKILL_KEYS = {
  react: 'react',
  reactNative: 'react-native',
  nextjs: 'nextjs',
  typescript: 'typescript',
  javascript: 'javascript',
  css: 'css',
  stateManagement: 'state-management',
  test: 'test',
  cs: 'cs',
  retrospect: 'retrospect',
} as const;
export type SkillId = (typeof SKILL_KEYS)[keyof typeof SKILL_KEYS];
```

**사용 범위**:

- Skill Map 뷰(#1)와 딥링크(`#skill-map-{SkillId}`, `?skill={SkillId}`) — SkillId만 유효
- `utilMapTagToSkill.ts`의 매핑 키

**skill.yaml item 대응**:

- SkillWidget 인라인 카운터는 `LABEL_TO_SKILL`로 label → SkillId 매핑 (best-effort). 매칭 안 되면 카운터 없음.

```ts
// src/shared/utils/utilMapTagToSkill.ts
import { SKILL_KEYS, SkillId } from '@shared/consts/skills';

// velog 태그 → SkillId (Skill Map 렌더용)
export const TAG_TO_SKILL: Record<SkillId, readonly string[]> = {
  [SKILL_KEYS.react]: ['react', 'reactjs', 'react-hooks'],
  [SKILL_KEYS.reactNative]: ['react-native', 'rn', 'expo'],
  [SKILL_KEYS.nextjs]: ['nextjs', 'next', 'app-router'],
  [SKILL_KEYS.typescript]: ['typescript', 'ts'],
  [SKILL_KEYS.javascript]: ['javascript', 'js', 'es6'],
  [SKILL_KEYS.css]: ['css', 'tailwind', 'tailwindcss'],
  [SKILL_KEYS.stateManagement]: ['zustand', 'redux', 'react-query'],
  [SKILL_KEYS.test]: ['jest', 'testing-library', 'vitest'],
  [SKILL_KEYS.cs]: ['algorithm', '자료구조', 'cs'],
  [SKILL_KEYS.retrospect]: ['회고', 'retrospect'],
};

// SkillWidget 인라인 카운터용 — skill.yaml item label → SkillId (없으면 카운터 없음)
export const LABEL_TO_SKILL: Record<string, SkillId> = {
  'React.js (vite)': SKILL_KEYS.react,
  'Next.js': SKILL_KEYS.nextjs,
  'TypeScript': SKILL_KEYS.typescript,
  // ... 추가. 매핑 없으면 카운터 안 붙음. skill.yaml 실제 label로 확정.
};
```

매핑 안 되는 velog 태그는 "기타" 버킷.

---

## 13. RSC vs Client 경계 맵

| 대상                                                       | 경계        | 이유                                  |
| ---------------------------------------------------------- | ----------- | ------------------------------------- |
| `[locale]/writings/page.tsx`                               | server      | Next.js 16 RSC 기본                   |
| `[locale]/writings/loading.tsx`                            | server      | Suspense fallback                     |
| `[locale]/writings/error.tsx`                              | client      | error boundary 요구                   |
| `[locale]/layout.tsx`                                      | server      | `{children}` 렌더만 (Header 미포함)   |
| `VelogArchive` widget                                      | server      | 데이터 조립                           |
| `SkillMap`, `TagCloud` 목록, `Timeline`                    | server      | 정적 목록                             |
| `TabTriggers`                                              | client      | Next `<Link>` 활용 얇은 client        |
| `TagCloudFilter`                                           | client      | 필터 상호작용 (URL query)             |
| `BehindTheScenes/Diagram`                                  | server      | 정적 SVG                              |
| `BehindTheScenes/FadeInWrapper`                            | client      | IntersectionObserver + reduced-motion |
| `VelogPostCard`, `VelogPostMiniCard`                       | server      | 정적 카드                             |
| `RelatedPostsBadge`, `ActivityBadge`, `RelatedPostsInline` | server      | slot 렌더링                           |
| `widgets/Profile` (ProfileWidget)                          | server      | velog fetch 및 prop 주입              |
| `features/portfolio/ui/Header` (ProfileHeader)             | client      | `useVisibilityObserver` + prop 통과   |
| `widgets/Header`                                           | client      | `useParams` + dot 렌더                |
| `utilFetchVelogArchive`                                    | server-only | `import 'server-only'` 상단 강제      |

원칙: default RSC, 인터랙션 island만 별도 파일로 분리해 `'use client'`.

---

## 14. 다음 스텝 (재정렬 v3)

### 14.1 사전 리팩터 (§5, velog 작업보다 먼저, 3개 별개 PR)

1. **`SkillBadge` 컴포넌트 추출** — `SkillCard` 상위 렌더러 재작성, slot 준비
2. **`IActivity` 타입 신설 + id 3-stage 단일 PR** (5.2a → 5.2b → 5.2c):
   - 2a. `IActivity` 명명 타입 + `id?: string` optional 도입, `activities: IActivity[]` 참조, `ActivityCard.Props` 갱신 (날짜 필드 무변경)
   - 2b. ko/en experience.yaml 각 activity에 stable `id` 부여, `bun scripts/verify-experience-ids.ts` 통과
   - 2c. `id: string` 필수화
3. **`ProfileHeader` / `Header` Props에 `latestVelogReleasedAt: string | null` 확장** — `ProfileWidget`에서 우선 `null` 전달

### 14.2 인프라

4. `src/shared/consts/velog.ts` — `VELOG_USERNAME`, `VELOG_BASE_URL`, `VELOG_RSS_URL`
5. `src/shared/consts/skills.ts` — `SKILL_KEYS` (VelogSkillCategory canonical)
6. `src/shared/types/velog.ts` — `IVelogPost`, `IVelogArchive`
7. `src/shared/types/subjects.ts` — `IActivityVelogMapping` 추가
8. **`next.config.ts` `images.remotePatterns` velog CDN 추가** (`pathname: '/**'` 포함) + **시드 후 실 hostname 확인**
9. **`server-only` 의존성 확인** — `package.json`에 없으면 `bun add server-only` (Next 16 번들 여부 재확인)
10. `scripts/fetch-velog.ts` — try/catch + `process.exit(0)` 강제, exit-code 계약 명시. Acceptance: `bun run fetch:velog`가 GraphQL 실패 시에도 exit 0
11. `package.json` scripts:
    - `"fetch:velog": "bun scripts/fetch-velog.ts"`
    - `"build": "bun run fetch:velog && bun run lint && bun run prettier && next build"`
12. 로컬에서 `src/data/velog-posts.json` 초기 생성 → 시드 커밋
13. `src/shared/utils/utilFetchVelogArchive.ts` — `import 'server-only'` 상단, empty 폴백
14. **`src/shared/utils/utilLoadYaml.ts`** — 로케일 무관 YAML 로더 (`src/data/*.yaml` 용)

### 14.3 매핑 인프라

15. `src/data/activity-velog-mapping.yaml` — 초기 매핑 데이터
16. `src/shared/utils/utilMapTagToSkill.ts` — `TAG_TO_SKILL` + `LABEL_TO_SKILL`
17. `src/shared/utils/utilMapActivityToVelog.ts`
18. `src/shared/utils/utilIsRecentPost.ts`
19. **`src/shared/utils/tagColor.ts`** — 라이트/다크 페어, WCAG 3:1 실측 (뷰 착수 **전**)
20. `src/shared/components/TagChip/`, `CrossLinkBadge/{RelatedPostsBadge, ActivityBadge, RelatedPostsInline}/`

### 14.4 라우트 + 위젯 뼈대

21. `src/app/[locale]/writings/page.tsx` — RSC, `params: Promise<{ locale }>` 검증
22. **`src/app/[locale]/writings/loading.tsx`** — Suspense fallback (신규)
23. **`src/app/[locale]/writings/error.tsx`** — `'use client'` route-scope error boundary (신규)
24. **`generateStaticParams`** — `LOCALES.map(locale => ({ locale }))` (신규, 정적 pre-render)
25. `src/widgets/VelogArchive/` — 히어로 + 탭(URL query) + Behind the Scenes 슬롯
26. `dictionary.writings` 네임스페이스 (ko / en 동시, `Dictionary = typeof ko` 컴파일 강제)

### 14.5 뷰 구현

27. **Skill Map** (핵심 메시지 우선)
28. Tag Cloud → Timeline (URL query 기반)
29. Behind the Scenes: `Diagram.tsx` [server] + `FadeInWrapper.tsx` [client]

### 14.6 상호 연결

30. widget 레벨에서 `utilMapActivityToVelog` 호출 → `ActivityCard` children slot에 `<RelatedPostsBadge />`
31. widget 레벨에서 `VelogPostCard` children slot에 `<ActivityBadge />`
32. `SkillBadge` slot 옆 `RelatedPostsInline` (`LABEL_TO_SKILL` 매칭 시에만)

### 14.7 홈 통합

33. `RecentWritings` 미니 위젯 (권장 위치: Introduce 다음)
34. **`ProfileWidget`에서 `utilFetchVelogArchive` 호출 → `latestVelogReleasedAt` 추출 → `ProfileHeader` prop 실제 값 주입** (§5.3에서 인터페이스는 사전 완비)
35. Header 새 글 dot 로직 (`utilIsRecentPost` 30일)

### 14.8 자잘한 액션

36. RSS 링크(`VELOG_RSS_URL`), NEW 배지 서버 계산

### 14.9 QA & CI

37. 다크모드 / i18n / a11y — `prefers-reduced-motion` **신규 + 기존 애니메이션 감사** QA 라운드
38. WCAG AA 3:1 대비 실측 + 색약 시뮬레이터
39. **`src/app/sitemap.ts` 확인** — `/{locale}/writings` 자동 포함되는지 검증, 필요 시 `next-sitemap` 설정 갱신
40. GitHub Actions "새 글 감지 → 배포 웹훅" 워크플로우:
    - state: **workflow artifact only**
    - **debounce** (10분 창 내 중복 트리거 억제)
    - auto-push 없음

---

## 15. 리스크 & 대응

| 리스크                                                   | 대응                                                                      |
| -------------------------------------------------------- | ------------------------------------------------------------------------- |
| Velog GraphQL 스키마 변경                                | fetch 스크립트 try/catch + `process.exit(0)` + 이전 JSON 유지             |
| 스킬-태그 매핑 누락                                      | "기타" 버킷 + 매핑 테이블 주기 검토                                       |
| 원본 글 삭제/수정                                        | 배포 시 fetch 전면 pull                                                   |
| Activity ↔ Velog 매핑 노이즈                             | `featured` / `exclude` 오버라이드 + `activityId` 안정 조인                |
| velog slug 변경 → 이력서 원본 붕괴                       | 매핑을 `src/data/activity-velog-mapping.yaml` 로 분리                     |
| `[locale]` 라우팅 누락                                   | `/[locale]/writings` 강제, 전 딥링크 로케일 포함                          |
| bun 라이프사이클 훅 미실행                               | `build` 명시적 체인, `prebuild` 의존 금지                                 |
| CI auto-push 정책 충돌                                   | 배포 시 fetch만, committed JSON은 시드                                    |
| **fetch:velog 예외 propagate → build 전체 중단**         | 스크립트 내부 try/catch + `process.exit(0)` 강제, acceptance criteria     |
| **GH Actions state repo push 시도**                      | workflow artifact only, `last-seen.txt` 옵션 금지                         |
| **동시 다발 새 글 → 배포 큐 스택**                       | 10분 debounce                                                             |
| `utilFetchVelogArchive` 우연 client import               | `import 'server-only'` 상단 강제                                          |
| **Header client에서 server fetch 시도**                  | ProfileWidget → ProfileHeader → Header prop drill 강제 (§5.3 사전 리팩터) |
| **`IActivity.id` silent 홀**                             | 5.2a→5.2b→5.2c 단일 PR 필수, TS 필수화 후 pairwise 검증                   |
| **YAML 확장 시 date 필드 회귀**                          | `IActivity`에 `period` 도입 금지, `startDate/endDate` 유지 명시           |
| `ISkill.items` 스코프 오해                               | items string[] 유지, SKILL_KEYS는 VelogSkillCategory 명시                 |
| skill.yaml 28 item ↔ SKILL_KEYS 10 mismatch              | LABEL_TO_SKILL best-effort, 매칭 없으면 카운터 없음                       |
| dev 서버 velog-posts.json 부재                           | 시드 커밋 + empty 폴백                                                    |
| **thumbnail CDN hostname 미확정**                        | 시드 fetch 후 실 URL로 hostname·pathname 검증 후 확정                     |
| **`server-only` dep 미확인**                             | 스텝 9에서 `package.json` 확인 및 필요 시 `bun add server-only`           |
| **loading/error 부재로 fallback UX 저하**                | route-scope `loading.tsx` + `error.tsx` 신설                              |
| **`generateStaticParams` 미정의 → 정적 pre-render 실패** | 스텝 24 필수                                                              |
| **sitemap에 /writings 누락**                             | 스텝 39 검증 필수                                                         |
| **Next.js 15 표기 오도 (실제 16.2.4)**                   | 문서 전역 정정 (v3 반영)                                                  |
| dictionary type mirroring 실패                           | ko/en 동시 갱신 checklist화                                               |
| tag color 다크 회귀                                      | `tagColor.ts` 뷰 착수 전 정의, WCAG 3:1 실측                              |
| NEW 배지 hydration 불일치                                | 빌드 시각 기준 서버 계산 (`isRecent: boolean`)                            |
| 탭 상태 client 전파로 RSC 이점 상실                      | URL query 기반, `TabTriggers`만 얇은 client                               |
| cross-link 배지 features 오염                            | `shared/components/CrossLinkBadge/`, features는 slot                      |
| tagStats 이중 소스                                       | `userTags` 미사용, posts 파생 `count DESC, name ASC`                      |
| Behind the Scenes 애니메이션 부담                        | MVP 정적 + fade-in, `prefers-reduced-motion` 존중                         |
| **기존 애니메이션 reduced-motion 미감사**                | QA 라운드에 기존 `AnimatedSection` / `useVisibilityObserver` 포함         |
| i18n 한국어 글 UX                                        | UI 라벨만 번역, 글 원문 유지                                              |
| a11y 회귀                                                | 시맨틱, 키보드 네비, 색상 외 정보 병기, reduced-motion 전 요소            |

---

## 16. Changelog

- **v3 (2026-07, v2 sanity check 반영)**: BLOCKING 2 + HIGH 2 + MEDIUM 5 + LOW 1 + What's Missing 8건 반영
  - **F1 Header 데이터 흐름 (Option A)**: layout이 Header를 안 렌더 → `ProfileWidget` → `ProfileHeader` → `Header` prop drill. §5.3 사전 리팩터로 인터페이스 확장을 별도 PR화. §9.1 재작성.
  - **F2 SkillId 스키마 (Option B, B1 결정 수정)**: `ISkill.items` 승격 제거. `items: string[]` 유지. `SKILL_KEYS`는 **VelogSkillCategory canonical만** (10개 subset). SkillWidget 카운터는 `LABEL_TO_SKILL` best-effort.
  - **F3 `IActivity.period` 삭제**: 실제 YAML은 `startDate/endDate` (dot 포맷) 유지. `IActivity`에는 `id`만 추가, 날짜 필드 무변경 명시.
  - **F4 3-stage 단일 PR**: 5.2a `id?` optional → 5.2b YAML 갱신 → 5.2c `id` required. Silent 런타임 홀 방지.
  - **F5 `utilLoadYaml` 스텝 추가**: 로케일 무관 YAML 로더 (기존 loadSubjects 재사용 불가).
  - **F6 fetch:velog exit-code 계약**: try/catch + `process.exit(0)` 강제, acceptance criteria.
  - **F7 GH Actions state**: workflow artifact only (`last-seen.txt` 옵션 삭제).
  - **F8 Next.js 15 → 16.2.4** 전역 표기 정정.
  - **F9 activity id 명명 규칙 + pairwise 검증** 스텝 12에 명시.
  - **F10 CDN pathname 명시 + 시드 후 실 hostname 검증** 스텝 8에 반영.
  - What's Missing: `/writings/loading.tsx`, `error.tsx`, `generateStaticParams`, sitemap 검증, `server-only` dep 확인, dictionary type mirroring, cron debounce, 기존 애니메이션 reduced-motion 감사 — 모두 §14 스텝화.
- **v2 (2026-07, Critic 리뷰 v1 반영)**: 29건 findings 반영. A1/B1/C1 확정. §5 사전 리팩터, §13 RSC/Client 경계 맵 신규.
- **v1**: 초안. Tag Graph 제거, 후보 A 확정, Activity ↔ Velog 후보 1+3, MVP 정적 파이프라인.
