# Design Guide — eunsu-resume

이 문서는 **현재 코드에 실제로 쓰이는 디자인 패턴을 정리한 기록**이다.
새 UI를 만들거나 기존 UI를 고칠 때 여기 정의된 값을 먼저 찾고, 없을 때만 새로 만든다.

> 스캔 기준: `src/widgets`, `src/features`, `src/shared/components`, `src/app/globals.css`

---

## 1. 스택

| 항목      | 선택                                                              |
| --------- | ----------------------------------------------------------------- |
| CSS       | Tailwind CSS v4 (`@theme` / `@theme inline` 디렉티브, CSS-first)   |
| 컴포넌트  | shadcn/ui — `accordion`, `dialog`, `tooltip` 3개만 설치            |
| 프리미티브| Radix UI (accordion, dialog, separator, tooltip)                  |
| 아이콘    | `lucide-react`                                                    |
| 애니메이션| `motion` (v12, `motion/react`) + `tw-animate-css`                 |
| variant   | `class-variance-authority` (cva) + `tailwind-merge` (`cn`)         |
| 다크모드  | `.dark` 클래스 기반 (`@custom-variant dark (&:is(.dark *))`)      |
| 폰트      | Pretendard(기본) / Open Sans(영문 강조)                            |

포매팅은 `prettier-plugin-tailwindcss`가 클래스 순서를 자동 정렬한다. 클래스 순서는 손으로 맞추지 않는다.

---

## 2. 레이아웃

### 컨테이너

[layout.tsx](../src/app/%5Blocale%5D/layout.tsx)에서 단 한 곳만 정의된다.

```tsx
<div className='3xl:max-w-[1500px] mx-auto max-w-(--breakpoint-xl) grow px-3 xl:px-0'>
```

- 기본 최대 폭: `--breakpoint-xl` (1280px)
- 초광폭(`3xl` = 120rem / 1920px 이상): 1500px
- 좌우 패딩: 모바일 `px-3`, `xl` 이상에서 0 (컨테이너가 이미 여백을 가짐)

**위젯은 자체 컨테이너를 만들지 않는다.** 예외는 [Profile](../src/widgets/Profile/index.tsx)의 `md:max-w-6xl md:px-12` — 히어로 영역이라 의도적으로 다른 폭을 쓴다.

### 섹션 배치

[page.tsx](../src/app/%5Blocale%5D/page.tsx):

```tsx
<main className='flex flex-col gap-10 md:gap-16'>
```

섹션 간 간격은 `main`이 소유한다. 위젯에 `mt-*` / `mb-*`를 붙이지 않는다.

### 위젯 내부 표준 골격

```tsx
<AnimatedSection className='flex w-full max-md:flex-col max-md:gap-4'>
  <SectionTitle>{dict.sections.xxx}</SectionTitle>
  <div className='flex w-full grow flex-col'>{/* 본문 */}</div>
</AnimatedSection>
```

데스크톱은 **좌측 제목 + 우측 본문** 2컬럼, 모바일은 세로 스택. `SectionTitle`이 `md:min-w-[210px]`로 좌측 컬럼 폭을 고정한다.

### 브레이크포인트

- 모바일 우선이 아니라 **`max-md:` 역방향 유틸을 자주 쓴다** (기존 코드 컨벤션). 새 코드도 이를 따른다.
- 실사용: `max-md` / `md` / `xl` / `3xl`. `sm`, `lg`, `2xl`은 사실상 쓰지 않는다.

---

## 3. 컬러

### 3-1. 두 계층이 공존한다 (⚠️ 현재 분열 상태)

**A. 시맨틱 토큰** — shadcn 기본 slate 계열 oklch. [globals.css:86-153](../src/app/globals.css#L86-L153)

`background` `foreground` `card` `popover` `primary` `secondary` `muted` `accent` `destructive` `border` `input` `ring` `chart-1~5` `sidebar-*`

사용 예 (최신 코드 — [JdMatch](../src/widgets/JdMatch/index.tsx)):

```tsx
className = 'border-border bg-muted/30 hover:bg-muted/50';
className = 'bg-foreground text-background'; // primary CTA
```

**B. 원시 팔레트** — Tailwind 기본 색상 직접 사용. 기존 위젯 대부분.

| 계열      | 사용 횟수 | 용도                          |
| --------- | --------- | ----------------------------- |
| `gray-*`  | ~170      | 텍스트 / 보더 / 배경 / divide |
| `blue-*`  | ~38       | 브랜드 액센트                 |
| `emerald` | ~18       | 긍정 상태 (매칭됨, 성공)      |
| `amber`   | ~15       | 주의 상태 (갭, 경고)          |
| `rose`    | ~13       | 부정 상태 (Problem 라벨, 낮은 적합도) |
| `slate`   | ~6        | Tooltip 배경, Badge gray variant |

> **규칙**: 새로 만드는 컴포넌트는 **시맨틱 토큰(A)을 우선** 쓴다. 팔레트(B)는 상태색(emerald/amber)이나 기존 컴포넌트를 수정할 때만.

### 3-2. 브랜드 액센트

**blue-500 / dark:blue-400** — 유일한 브랜드 컬러.

- 섹션 제목: [SectionTitle](../src/shared/components/SectionTitle/index.tsx)
- 스킬 카테고리 라벨: [SkillCard](../src/features/skill/ui/Card/index.tsx)
- 활동 넘버링: [ActivityCard](../src/features/experience/ui/ActivityCard/index.tsx)
- 포커스 링: `outline-blue-500 dark:outline-blue-400`

### 3-3. 상태색

| 의미        | 라이트                                                  | 다크                                                |
| ----------- | ------------------------------------------------------- | --------------------------------------------------- |
| 긍정/매칭   | `text-emerald-600` `bg-emerald-50` `border-emerald-200`  | `dark:text-emerald-300` `dark:bg-emerald-500/10`    |
| 주의/갭     | `text-amber-600` `bg-amber-50` `border-amber-200`        | `dark:text-amber-300` `dark:bg-amber-500/10`        |
| 부정/문제   | `text-rose-500` `bg-rose-50` `border-rose-200/50`        | `dark:text-rose-400` `dark:bg-rose-500/10`          |
| 링크/외부   | `text-blue-600` `bg-blue-50/60` `border-blue-200`        | `dark:text-blue-300` `dark:bg-blue-950/30`          |

다크모드 배경은 **반투명**을 쓴다. 불투명 다크 배경은 카드 위에 얹었을 때 뜬다. 현재 두 방식이 섞여 있다 — `-950/30`(PortfolioCard 외부 링크)과 `-500/10`(JdMatch 상태 칩). 새 코드는 `-500/10` 쪽을 쓴다.

`rose`는 [ActivityCard](../src/features/experience/ui/ActivityCard/index.tsx)의 Problem 라벨과 [JdMatch](../src/widgets/JdMatch/index.tsx)의 낮은 적합도 밴드에 쓰인다. `destructive` 시맨틱 토큰과 역할이 겹치므로 혼용하지 않는다 — 에러는 `text-destructive`, 콘텐츠상의 "문제/약점"은 `rose`.

### 3-4. 텍스트 위계

| 역할        | 라이트          | 다크                  |
| ----------- | --------------- | --------------------- |
| 제목        | `text-gray-900` | `dark:text-gray-100`  |
| 본문        | `text-gray-700` | `dark:text-gray-300`  |
| 보조        | `text-gray-600` | `dark:text-gray-400`  |
| 메타/캡션   | `text-gray-500` | `dark:text-gray-400`  |
| 비활성      | `text-gray-400` | `dark:text-gray-500`  |

### 3-5. 보더 / 구분선

| 역할          | 클래스                                          |
| ------------- | ----------------------------------------------- |
| 카드 외곽선   | `border-gray-200 dark:border-gray-800`           |
| 내부 구분선   | `border-gray-100 dark:border-gray-800`           |
| 리스트 divide | `divide-gray-100 dark:divide-gray-800`           |
| hover 강조    | `hover:border-gray-300 dark:hover:border-gray-700` |

라이트는 200/100으로 구분하지만 **다크는 둘 다 800**이다. 다크에서 100↔200 차이가 보이지 않기 때문.

### 3-6. 카드 배경

```
라이트: bg-white
다크:   dark:bg-gray-900/60  (칩·소형)
        dark:bg-gray-950/40  (큰 카드)
```

---

## 4. 타이포그래피

### 폰트

```tsx
body        → font-pretendard  (한글 본문 전체)
.open-sans  → SectionTitle 등 영문 강조
```

`.open-sans`는 [globals.css:6-8](../src/app/globals.css#L6-L8)의 커스텀 클래스. Tailwind 유틸이 아니다.

### 스케일

Tailwind 기본 스텝과 **임의값(`text-[Npx]`)이 혼용**된다. 임의값은 한글 가독성을 위해 기본 스텝 사이를 메우려고 도입됐다.

| 용도                    | 모바일          | 데스크톱          |
| ----------------------- | --------------- | ----------------- |
| 이름 (h1)               | `text-3xl`      | `md:text-4xl`     |
| 섹션 제목 (h2)          | `text-3xl`      | —                 |
| 활동 제목 (h3)          | `text-lg`       | `md:text-xl`      |
| 항목 제목 (h4)          | `text-[15px]`   | `md:text-[17px]`  |
| 본문                    | `text-[14px]`   | `md:text-[15px]`  |
| 보조 본문               | `text-sm`       | `md:text-[15px]`  |
| 메타 / 캡션             | `text-xs`       | `md:text-[13px]`  |
| 칩 / 태그               | `text-[11.5px]` | `md:text-xs`      |
| 카테고리 라벨 (uppercase)| `text-[11px]`  | `md:text-xs`      |

가장 많이 쓰이는 임의값: `text-[15px]`(11회), `text-[13px]`(9회).

### 자간 / 행간 / 한글 처리

```tsx
tracking-tight        // 제목 (h1~h4)
tracking-[0.18em] uppercase  // 카테고리 라벨 전용
leading-relaxed       // 본문 리스트
leading-snug          // 제목 줄바꿈
break-keep            // ⚠️ 한글 제목·문장에 필수 — 단어 중간 줄바꿈 방지
tabular-nums          // 날짜·숫자 정렬
```

**한글 텍스트에는 `break-keep`을 반드시 붙인다.**

---

## 5. 스페이싱

### 실사용 빈도

```
gap-3(17) gap-4(15) gap-2(15) gap-1.5(11) gap-6(6) gap-5(6) gap-8(3) gap-7(2) gap-10(2)
```

### 권장 스케일 (⚠️ 현재 미준수 — §11 참조)

| 토큰   | px | 용도                            |
| ------ | -- | ------------------------------- |
| `1.5`  | 6  | 아이콘 ↔ 라벨, 인라인 요소       |
| `2`    | 8  | 칩/태그 사이                     |
| `3`    | 12 | 리스트 항목, 소형 그룹           |
| `4`    | 16 | 카드 내부 블록 간                |
| `5`    | 20 | 카드 내부 큰 블록 간             |
| `6`    | 24 | 카드 패딩(모바일), 그룹 간       |
| `8`    | 32 | 카드 패딩(데스크톱)              |
| `10`   | 40 | 섹션 내 대블록                   |
| `16`   | 64 | 섹션 간 (데스크톱)               |

`gap-2.5` / `gap-7` / `gap-9` / `gap-3.5` 같은 중간값은 새로 도입하지 않는다.

### 반응형 패딩 패턴

```tsx
p-6  md:p-8       // 카드
px-5 md:px-7      // 아코디언 아이템
py-5 md:py-6      // 행
py-7 md:py-9      // 큰 행
```

---

## 6. Radius / 그림자

### Radius

기준값은 `--radius: 0.625rem` (10px). [globals.css:87](../src/app/globals.css#L87)

| 클래스         | 값     | 용도                                      |
| -------------- | ------ | ----------------------------------------- |
| `rounded-sm`   | 6px    | Badge                                      |
| `rounded-md`   | 8px    | 칩, 태그, 소형 링크 버튼                   |
| `rounded-xl`   | 14px   | 아코디언 아이템, textarea, 아이콘 박스     |
| `rounded-2xl`  | 16px   | 프로필 이미지, 큰 인터랙티브 카드          |
| `rounded-full` | ∞      | pill 버튼, 진행 바, 스코어 칩 (16회 — 최다) |

`rounded-lg`는 3회만 등장(그중 1회는 shadcn `dialog.tsx` 원본). 새로 쓰지 않는다.

### 그림자

거의 쓰지 않는다 (`shadow-md` 2, `shadow-sm` 1, `shadow-lg` 1).

**깊이는 그림자가 아니라 보더 + 배경 대비로 표현한다.** 예외: 프로필 이미지(`shadow-sm ring-1`), 플로팅 요소.

---

## 7. 컴포넌트 레시피

실제 코드에서 추출한 패턴. 새 UI는 여기서 복사해 시작한다.

### 칩 / 태그 (읽기 전용)

```tsx
<span className='rounded-md bg-gray-100 px-2 py-0.5 text-[11.5px] font-medium text-gray-600 md:text-xs dark:bg-gray-800 dark:text-gray-300'>
```

### 아웃라인 칩 (스킬 항목)

```tsx
<li className='rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[13px] font-medium text-gray-800 md:text-sm dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-200'>
```

### 외부 링크 버튼

```tsx
<Link
  target='_blank'
  rel='noopener noreferrer'
  aria-label={`${name} GitHub (${dict.externalLink.newTab})`}
  className='inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[12px] font-medium text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900 md:text-[13px] dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-100'
>
  <Github className='size-3.5' aria-hidden='true' />
  GitHub
  <span className='sr-only'> ({dict.externalLink.newTab})</span>
</Link>
```

외부 링크 3종 세트는 항상 함께: `target='_blank'` + `rel='noopener noreferrer'` + `aria-label` + `sr-only` 새 탭 안내.

### Primary CTA (pill)

```tsx
<button className='bg-foreground text-background flex shrink-0 items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50'>
```

hover는 색 교체가 아니라 `opacity-90`. 다크모드 대응이 자동으로 된다.

### 인터랙티브 카드 (클릭 가능)

```tsx
<button className='group border-border bg-muted/30 hover:bg-muted/50 flex cursor-pointer items-center gap-4 rounded-2xl border p-5 text-left transition-colors hover:border-blue-500/40'>
```

### 입력 필드

```tsx
<textarea className='border-border bg-background focus:ring-ring w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none focus:ring-1 disabled:opacity-60' />
```

### 아이콘 박스

```tsx
<span className='border-border bg-background flex size-11 shrink-0 items-center justify-center rounded-xl border'>
```

### 아이콘 크기

`size-3.5`(칩 내부) / `size-5`(아코디언 셰브론) / `size-11`(아이콘 박스). 항상 `size-*` 사용, `w-* h-*` 조합 금지.

장식용 아이콘은 `aria-hidden='true'`.

### Badge (⚠️ 현재 미사용 — §11-7)

[Badge](../src/shared/components/Badge/index.tsx) — cva 기반. variant 7종(`gray` `cyan` `orange` `emerald` `black` `dark` `blue`), size 3종(`sm` `md` `lg`). `md`/`lg`는 compound variant로 모바일에서 자동 축소된다.

**어디에서도 import되지 않는다.** 지금 칩/태그는 전부 인라인 클래스로 직접 작성되고 있다. 새 칩을 만든다면 인라인 대신 이 컴포넌트를 쓰거나, 아예 삭제하고 레시피만 남기는 쪽으로 정리해야 한다.

### 스켈레톤

```tsx
<div className='bg-muted h-2 w-full rounded-full' />
<div className='bg-muted h-6 w-28 rounded-full' />
```

실제 콘텐츠의 형태를 모사한다 (텍스트 줄 = `h-2`, 칩 = `h-6` + 가변 폭).

---

## 8. 모션

### 섹션 진입

모든 위젯은 [AnimatedSection](../src/shared/components/AnimatedSection/index.tsx)으로 감싼다.

```tsx
initial={{ opacity: 0, y: 16 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: '-80px' }}
transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
```

`useReducedMotion()`이 true면 애니메이션 없이 렌더한다. 새 모션 컴포넌트도 이 가드를 반드시 넣는다.

### easing

| 커브                       | 용도                              |
| -------------------------- | --------------------------------- |
| `[0.16, 1, 0.3, 1]`        | 진입 애니메이션 (expo-out)         |
| `cubic-bezier(0.32,0.72,0,1)` | 아코디언 열림/닫힘              |

### duration

| 값     | 용도                    |
| ------ | ----------------------- |
| 200ms  | 즉각 피드백             |
| 280ms  | 아코디언 닫힘           |
| 300ms  | 일반 트랜지션           |
| 360ms  | 아코디언 열림           |
| 500ms  | 섹션 진입               |

닫힘은 열림보다 짧게 (280 vs 360).

### 트랜지션 유틸

`transition-colors`가 표준(18회). `transition-all`은 예외적으로만.

### 전역 reduced-motion

[globals.css:175-188](../src/app/globals.css#L175-L188)에서 모든 애니메이션/트랜지션/스크롤을 무력화한다. 이미 처리되어 있으므로 CSS 애니메이션마다 개별 가드를 넣을 필요 없다.

---

## 9. 다크모드

- `.dark` 클래스 기반. `ThemeProvider` + `localStorage`(`THEME_STORAGE_KEY`) + `layout.tsx`의 인라인 `themeInitScript`로 FOUC 방지.
- `light` / `dark` / `system` 3상태.
- `<html>`에 `suppressHydrationWarning` 필수.
- `viewport.themeColor`도 라이트/다크 각각 지정됨 (`#ffffff` / `#0a0e1a`).

### 체크리스트

- [ ] 모든 `text-` / `bg-` / `border-` 에 `dark:` 짝이 있는가 (현재 코드에 146개)
- [ ] 다크 배경은 반투명(`/30`, `/40`, `/60`)을 썼는가
- [ ] 다크 보더는 `gray-800`으로 통일했는가
- [ ] 상태색 다크는 `-300`(전경) / `-950/30`(배경) 조합인가

---

## 10. 접근성

이미 지켜지고 있는 것들 — 새 코드도 유지한다.

| 항목            | 구현                                                                   |
| --------------- | ---------------------------------------------------------------------- |
| 포커스 링       | [globals.css:167-172](../src/app/globals.css#L167-L172) 전역 `focus-visible` |
| reduced-motion  | 전역 CSS + `useReducedMotion()` 훅                                       |
| 외부 링크       | `aria-label` + `sr-only` 새 탭 안내                                      |
| 장식 아이콘     | `aria-hidden='true'`                                                     |
| 시맨틱 태그     | `main` / `section` / `figure` / `h1~h4` / `ul` / `ol` 계층 준수           |
| 이미지          | `alt`은 i18n dict 경유, 히어로는 `priority` + `sizes`                    |
| 스크롤          | `scroll-smooth` (reduced-motion 시 `auto`)                              |

포커스 링은 전역에서 처리되므로 **컴포넌트마다 `focus:outline-none`을 붙이지 않는다.**

---

## 11. 알려진 불일치 (개선 후보)

현재 코드 상태를 있는 그대로 기록. **이 문서는 코드를 바꾸지 않았다.**

### 11-1. 죽은 토큰 — 삭제 대상

[globals.css:78-83](../src/app/globals.css#L78-L83)

```css
--color-ivory: #fffff0;
--color-wood: #a0522d;
--color-ivory-secondary: #f8f3e6;
--color-wood-secondary: #8b4513;
--color-ivory-tertiary: #f8f3e6;
--color-wood-tertiary: #8b5e3c;
```

`.tsx` 전체에서 **사용 0회**. `ivory-secondary`와 `ivory-tertiary`는 값도 동일(`#f8f3e6`)해서 애초에 오타로 보인다.

### 11-2. 시맨틱 토큰 vs 원시 팔레트 분열

- 신규 코드([JdMatch](../src/widgets/JdMatch/index.tsx)): `border-border`, `bg-muted`, `bg-foreground` — 시맨틱
- 기존 코드(Profile, Skill, Portfolio, Experience): `border-gray-200`, `bg-white` — 원시 팔레트

같은 화면 안에서 두 방식이 섞여 있다. 통일하려면 원시 팔레트 → 시맨틱 방향이 맞다 (다크모드 클래스가 절반으로 줄어듦).

### 11-3. 스페이싱 스케일 미정

`gap-` 값이 0.5 / 1 / 1.5 / 2 / 2.5 / 3 / 4 / 5 / 6 / 7 / 8 / 10 전부 등장. 그중 §5 권장 스케일에 없는 중간값: `gap-2.5`(6회), `gap-7`(2회), `gap-9`(1회). 축별 유틸에도 `gap-y-3.5` 같은 값이 섞여 있다.

### 11-4. 폰트 사이즈 임의값 과다

`text-[Npx]` 형태가 11종. `10px` `10.5px` `11px` `11.5px` `12px` `13px` `14px` `15px` `17px` `22px` `26px`.

`10px`↔`10.5px`, `11px`↔`11.5px`는 시각적으로 구분되지 않는다. `@theme`에 커스텀 스텝으로 등록하면 임의값 없이 쓸 수 있다.

### 11-5. Radius 사용처 기준 부재

`rounded-full`(16) `rounded-md`(8) `rounded-xl`(5) `rounded-2xl`(4) `rounded-lg`(2). §6 표는 현재 관찰된 용법을 사후 정리한 것이지 강제된 규칙이 아니다. `rounded-lg` 2회는 다른 값으로 흡수 가능.

### 11-6. 브랜드 아이덴티티 약함

시맨틱 토큰이 shadcn 기본 slate 그대로다. 액센트는 Tailwind 기본 `blue-500` 하나. 이력서 포트폴리오인데 색으로 기억되는 지점이 없다.

### 11-7. Badge 컴포넌트 전체가 죽어 있음

[Badge](../src/shared/components/Badge/index.tsx)를 import하는 파일이 **0개**다. variant 7종 × size 3종 + compound variant까지 다 구현돼 있지만 렌더되는 곳이 없다.

대신 칩/태그가 [SkillCard](../src/features/skill/ui/Card/index.tsx), [PortfolioCard](../src/features/portfolio/ui/Card/index.tsx), [JdMatch](../src/widgets/JdMatch/index.tsx) 세 곳에서 각각 **다른 인라인 클래스**로 중복 작성돼 있다 (`rounded-md` vs `rounded-full`, `text-[11.5px]` vs `text-xs` vs `text-[13px]`).

선택지: (a) 인라인 칩들을 Badge로 흡수, (b) Badge 삭제하고 §7 레시피만 유지.

---

## 12. 새 UI 만들 때 순서

1. **§7 레시피**에 비슷한 패턴이 있는지 먼저 본다
2. 색은 **시맨틱 토큰(§3-1 A)** 우선, 상태색만 팔레트
3. 간격은 **§5 권장 스케일**에서 고른다
4. 한글 텍스트에 `break-keep`
5. 모션은 `AnimatedSection`으로 감싸거나 `useReducedMotion()` 가드
6. 다크모드 **§9 체크리스트** 통과
7. 외부 링크면 `rel` + `aria-label` + `sr-only` 3종 세트
8. `pnpm lint` (`--max-warnings 0`)
