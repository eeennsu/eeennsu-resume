# Design Audit — eunsu-resume

[design.md](./design.md) 기준 전체 점검 결과. **코드는 수정하지 않았다.**

점검 범위: `src/widgets` 12개, `src/features` 8개, `src/shared/components` 9개, `src/shared/shadcn-ui` 3개, `globals.css`, `layout.tsx`.

검증 방법: 소스 grep + **빌드된 CSS**(`.next/static/chunks/1udroahq-2awl.css`) 대조. 클래스가 실제로 CSS를 생성하는지까지 확인했다.

---

## 요약

| 등급 | 건수 | 성격                                  | 상태          |
| ---- | ---- | ------------------------------------- | ------------- |
| P1   | 4    | 화면에 보이거나 기능이 깨짐            | ✅ 전부 수정됨 |
| P2   | 5    | 디자인 시스템 일관성                   | 미착수         |
| P3   | 4    | 접근성 / 시맨틱                        | 미착수         |

> **P1 수정 완료** (tsc / eslint / prettier 통과). 상세는 각 항목 하단 `✅ 수정` 참고.

전반적으로 **기본기는 탄탄하다.** reduced-motion 전역 처리, 다크모드 FOUC 방지 인라인 스크립트, 외부 링크 `rel`+`aria-label`+`sr-only` 3종 세트, `break-keep` 한글 처리, 빈 데이터 방어(`console.warn` + `return null`) — 이 정도까지 챙긴 개인 사이트는 흔치 않다.

문제는 대부분 **"한 번 정하고 안 지킨 것"**이다. 새 기능(JdMatch, AiChat)을 추가하면서 새 컨벤션이 생겼는데 기존 코드는 옛 컨벤션에 남아 있다.

---

## P1 — 화면에 보이는 문제

### P1-1. Profile 섹션만 좌우 폭이 112px 좁다 ⭐ 가장 눈에 띔

전체 페이지 컨테이너는 [layout.tsx:150](../src/app/%5Blocale%5D/layout.tsx#L150):

```tsx
<div className='3xl:max-w-[1500px] mx-auto max-w-(--breakpoint-xl) grow px-3 xl:px-0'>
```

`--breakpoint-xl` = **80rem = 1280px** (빌드 CSS 확인)

그런데 [Profile/index.tsx:30](../src/widgets/Profile/index.tsx#L30)은 자체 컨테이너를 또 만든다:

```tsx
<div className='flex flex-col gap-10 px-6 md:mx-auto md:max-w-6xl md:flex-row ... md:px-12'>
```

`max-w-6xl` = **72rem = 1152px** (빌드 CSS 확인) + `px-12`(48px×2)

**뷰포트 1280px 이상에서:**

```
다른 섹션 콘텐츠 시작점:  0px  ────────────────────────── 1280px
Profile 콘텐츠 시작점:  112px  ──────────────────  1168px
                        └─ 64px(폭 차이) + 48px(px-12)
```

이력서 최상단 = 첫인상 영역인데 아래 모든 섹션과 좌측 정렬이 안 맞는다. 스크롤하면 콘텐츠가 좌우로 튀어 보인다.

[Header](../src/widgets/Header/index.tsx) 도 `max-w-6xl px-4 sm:px-6` 라서 같은 문제를 공유한다 — 헤더의 이름/토글이 본문 열과 안 맞는다.

> `design.md` §2는 "위젯은 자체 컨테이너를 만들지 않는다"고 적혀 있고 Profile을 "의도적 예외"로 기록했다.
>
> **✅ 수정** — Profile 내부 `px-6 md:mx-auto md:max-w-6xl md:px-12` 제거 → 페이지 컨테이너 폭에 정렬. Header 내부 `max-w-6xl px-4 sm:px-6` → `3xl:max-w-[1500px] max-w-(--breakpoint-xl) px-3 xl:px-0`으로 본문과 동일한 폭 시스템 적용. 이제 최상단부터 모든 섹션 좌측 시작점 일치.

---

### P1-2. `leading-1.2` 는 존재하지 않는 클래스 — CSS가 생성되지 않음

[ActivityCard/index.tsx:81](../src/features/experience/ui/ActivityCard/index.tsx#L81)

```tsx
className = 'leading-1.2 list-outside list-disc text-[15px] text-gray-800 ...';
```

빌드된 CSS 검증:

| 클래스            | CSS 생성 |
| ----------------- | -------- |
| `leading-relaxed` | ✅        |
| `leading-snug`    | ✅        |
| `leading-[1.85]`  | ✅ `line-height:1.85` |
| `leading-[1.75]`  | ✅ `line-height:1.75` |
| **`leading-1.2`** | **❌ 0건** |

의도한 행간이 **전혀 적용되지 않고 있다.** 경력 상세의 불릿 리스트 — 사이트에서 가장 많이 읽히는 텍스트다.

올바른 표기는 `leading-[1.2]`. 다만 1.2는 한글 본문에 너무 좁다 — 같은 파일 안의 다른 본문은 `leading-[1.75]`를 쓴다.

**✅ 수정** — `leading-relaxed`(1.625)로 교체. design.md §4가 "본문 리스트 = `leading-relaxed`"로 정의했고, Education·JdMatch pitch 리스트도 이미 이 값을 쓴다. 임의값 1.2/1.75 대신 표준 유틸로 통일.

---

### P1-3. Dialog 닫기 버튼 — 키보드 포커스 링이 완전히 사라짐

[dialog.tsx:47](../src/shared/shadcn-ui/ui/dialog.tsx#L47)

```tsx
className = '... focus:ring-offset-2 focus:outline-none active:ring-2 ...';
```

두 겹으로 깨져 있다:

1. **`focus:outline-none`** 이 전역 포커스 링을 죽인다.
   [globals.css:167](../src/app/globals.css#L167)의 `button:focus-visible { outline-2 ... }` 는 `@layer base`에 있고, `focus:outline-none`은 utilities 레이어다. **Tailwind 레이어 순서상 utilities가 무조건 이긴다** (특정도 비교조차 필요 없음).

2. **`active:ring-2`** 는 대체재가 못 된다. `:active`는 마우스 버튼을 누르고 있는 동안만 걸린다. 키보드 Tab으로 이동했을 때는 **아무 표시도 안 나온다.**

`ring-offset-2`와 `focus:ring-ring`도 짝이 되는 `ring-N`이 없어서 무의미하게 남아 있다.

JD 분석 모달을 키보드로 쓰면 닫기 버튼에 포커스가 갔는지 알 수 없다.

**✅ 수정** — 죽은 유틸(`focus:outline-none` `focus:ring-ring` `ring-offset-background` `focus:ring-offset-2` `active:ring-2`) 전부 제거. 이제 [globals.css:167](../src/app/globals.css#L167)의 전역 `button:focus-visible { outline-2 outline-offset-2 outline-blue-500 }`가 살아나 키보드 포커스 시 파란 링이 보인다. 요소에 이미 `rounded-sm`이 있어 전역 규칙과 맞물린다.

---

### P1-4. `#jd-match` 앵커 — fixed 헤더에 가려짐 (잠재)

[JdMatch/index.tsx:217](../src/widgets/JdMatch/index.tsx#L217)에 `id='jd-match'`가 있다. [Header](../src/widgets/Header/index.tsx)는 `fixed top-0`에 실제 높이 약 68px.

`scroll-mt-*` / `scroll-margin-top`이 **프로젝트 전체에 0건**이다. `html`에는 `scroll-smooth`가 걸려 있다.

지금은 이 앵커로 이동하는 링크가 없어서 증상이 안 나온다. 하지만 외부에서 `resume.eunsu.pro/ko#jd-match` 로 들어오거나 목차를 추가하는 순간 CTA 카드 상단이 헤더에 잘린다.

**✅ 수정** — JdMatch 섹션에 `scroll-mt-24`(96px) 추가. 헤더 실측 높이(~68px)보다 여유 있게 확보. 앵커 이동/직접 진입 시 CTA 카드가 헤더에 가리지 않는다.

---

## P2 — 디자인 시스템 일관성

### P2-1. `Badge` 컴포넌트가 죽어 있고, 칩이 3벌로 중복

[Badge](../src/shared/components/Badge/index.tsx) — cva로 variant 7종 × size 3종 + compound variant까지 구현. **import 0건.**

대신 같은 역할의 칩이 세 군데에 제각각 인라인으로 있다:

| 위치                                                              | radius         | 폰트            | 배경                        |
| ----------------------------------------------------------------- | -------------- | --------------- | --------------------------- |
| [SkillCard:15](../src/features/skill/ui/Card/index.tsx#L15)        | `rounded-md`   | `text-[13px]`   | `bg-white` + 보더           |
| [PortfolioCard:76](../src/features/portfolio/ui/Card/index.tsx#L76)| `rounded-md`   | `text-[11.5px]` | `bg-gray-100` 보더 없음     |
| [JdMatch:126](../src/widgets/JdMatch/index.tsx#L126)               | `rounded-full` | `text-xs`       | `bg-emerald-50` 등 톤별     |

같은 "기술 태그"인데 스킬 섹션과 포트폴리오 섹션에서 크기·모양이 다르다.

**선택**: (a) 인라인 칩을 Badge로 흡수, (b) Badge 삭제하고 레시피만 유지. 지금 상태(둘 다 존재, 하나는 미사용)가 최악이다.

---

### P2-2. 시맨틱 토큰 vs 원시 팔레트 — 신·구 코드 분열

| 코드                                  | 방식        | 예시                                       |
| ------------------------------------- | ----------- | ------------------------------------------ |
| JdMatch, AiChat (최신)                | 시맨틱 토큰 | `border-border` `bg-muted/30` `bg-foreground` |
| Profile, Skill, Portfolio, Experience, Education, Certification, Header, Footer | 원시 팔레트 | `border-gray-200` `bg-white` `text-gray-900` |

같은 페이지에서 두 방식이 섞이면 **다크모드 미세 톤이 어긋난다.** 시맨틱 `--card`는 다크에서 `oklch(0.208 0.042 265.755)`(푸른기 도는 남색)인데, 원시 팔레트 `dark:bg-gray-950/40`은 중성 회색이다.

`dark:` 클래스가 현재 146개다. 시맨틱으로 통일하면 절반 이하로 줄어든다.

---

### P2-3. Tooltip — 시맨틱 스타일이 즉시 덮여서 사라짐

[tooltip.tsx:23](../src/shared/shadcn-ui/ui/tooltip.tsx#L23) 기본값:

```tsx
'bg-primary text-primary-foreground ... rounded-md px-3 py-1.5 text-xs';
```

[SharedTooltip:13](../src/shared/components/Tooltip/index.tsx#L13) 이 매번 덮어씀:

```tsx
className = 'bg-slate-700 px-3 py-2 text-white shadow-md dark:bg-slate-200 dark:text-slate-900';
```

`cn()`(tailwind-merge)이 `bg-primary` → `bg-slate-700`, `py-1.5` → `py-2`로 교체한다. **shadcn 기본 스타일은 100% 죽은 코드다.**

게다가 이게 `slate` 계열이 이 프로젝트에 남아 있는 유일한 이유다. 시맨틱(`bg-primary`)이 이미 다크모드 반전을 처리하는데, 굳이 `bg-slate-700`/`dark:bg-slate-200`으로 같은 일을 수동으로 하고 있다.

---

### P2-4. 다크모드 반투명 관례가 두 갈래

| 패턴        | 사용처                                        |
| ----------- | --------------------------------------------- |
| `-950/30`   | [PortfolioCard:60](../src/features/portfolio/ui/Card/index.tsx#L60) 외부 링크 |
| `-500/10`   | [JdMatch:108-110](../src/widgets/JdMatch/index.tsx#L108-L110) 상태 칩 |
| `-500/[0.04]` | [JdMatch:115-117](../src/widgets/JdMatch/index.tsx#L115-L117) 패널 |

셋 다 "은은한 색 틴트"라는 같은 목적인데 계산식이 다르다. `-500/10`이 라이트의 `-50`과 밝기 대응이 가장 잘 맞는다.

---

### P2-5. 임의값 난립 — 폰트 11종, 스페이싱 중간값 9건

**폰트 사이즈 `text-[Npx]`:** `10px` `10.5px` `11px` `11.5px` `12px` `13px` `14px` `15px` `17px` `22px` `26px`

`10px`↔`10.5px`, `11px`↔`11.5px`는 **육안으로 구분 불가**다. 서로 다른 두 값을 유지할 이유가 없다.

**스페이싱:** `gap-2.5`(6회) `gap-7`(2회) `gap-9`(1회) `gap-y-3.5` — design.md §5 권장 스케일 밖.

임의값 자체가 나쁜 건 아니다. 한글 본문에 Tailwind 기본 스텝(`text-sm`=14px → `text-base`=16px)은 간격이 크다. 다만 **`@theme`에 커스텀 스텝으로 등록**하면 임의값 없이 같은 결과를 얻고 값도 강제된다.

---

## P3 — 접근성 / 시맨틱

### P3-1. 아이콘 전용 툴팁 트리거에 접근 가능한 이름이 없음

[ExperienceHead:46](../src/features/experience/ui/Head/index.tsx#L46)

```tsx
<SharedTooltip content={experience.note!.description}>
  <CircleHelp className='size-4 ...' />
</SharedTooltip>
```

Radix `TooltipTrigger`는 `<button>`을 렌더한다. 안에 SVG만 있고 텍스트도 `aria-label`도 없다 → 스크린리더가 **"버튼"** 이라고만 읽는다. 툴팁 내용은 열렸을 때만 `aria-describedby`로 연결된다.

프로젝트의 다른 아이콘 버튼들([Header GitHub](../src/widgets/Header/index.tsx#L57), [ThemeToggle](../src/shared/components/ThemeToggle/index.tsx), [LanguageToggle](../src/shared/components/LanguageToggle/index.tsx))은 전부 `aria-label`이 있다. **여기만 빠졌다.**

---

### P3-2. 입력 필드 포커스 표시가 1px

[JdMatch:274](../src/widgets/JdMatch/index.tsx#L274), [AiChat:213](../src/widgets/AiChat/index.tsx#L213)

```tsx
'... outline-none focus:ring-1 focus:ring-ring ...';
```

`ring-1` = 1px, `--ring`(라이트) = `oklch(0.704 0.04 256.788)` — 흰 배경 대비 약 2.8:1.

WCAG 2.2 SC 2.4.13(Focus Appearance)는 최소 2px 두께와 3:1 대비를 요구한다. 나머지 인터랙티브 요소는 전역 규칙으로 `outline-2 outline-blue-500`(대비 충분)을 받는데, **입력 필드만 더 약하다.**

---

### P3-3. JdMatch 섹션이 heading 아웃라인에서 빠짐

[JdMatch:219](../src/widgets/JdMatch/index.tsx#L219)

```tsx
{/* 제목 없이 콘텐츠만 우측 정렬(형제 섹션 콘텐츠 열과 라인 일치) */}
<div aria-hidden className='hidden md:block md:min-w-[210px]' />
```

`SectionTitle`(h2) 자리에 빈 스페이서를 넣었다. 시각적 정렬 목적은 이해되지만, 결과적으로 **이 섹션만 페이지 heading 구조에 존재하지 않는다.**

현재 아웃라인:

```
h1  이름 (Profile)
 h2  자기소개 / 경력 / 스킬 / 포트폴리오 / 학력 / 자격증
      ⚠️ JD 맞춤 분석 — 없음
  h3  회사명 / 활동 제목 / 프로젝트명 / 스킬 카테고리 / 학교명
   h4  활동 상세 항목
```

heading으로 페이지를 훑는 스크린리더 사용자는 AI 기능을 **통째로 못 만난다.** 이력서 사이트의 차별화 포인트인데 아깝다.

`sr-only` h2 하나면 시각 레이아웃 그대로 두고 해결된다.

---

### P3-4. 자격증 항목만 heading이 아님

| 섹션        | 항목 태그                                          |
| ----------- | -------------------------------------------------- |
| 경력        | `h3`(회사) → `h3`(활동, Radix AccordionHeader) → `h4` |
| 스킬        | `h3`(카테고리)                                      |
| 포트폴리오  | `h3`(프로젝트명)                                    |
| 학력        | `h3`(학교명)                                        |
| **자격증**  | **`span`** ([Certification:34](../src/widgets/Certification/index.tsx#L34)) |

일관성만 놓고 보면 어긋나지만, 자격증은 단순 나열이라 `h3`가 과할 수도 있다. **정보 구조상 판단이 필요한 항목** — 반드시 고쳐야 하는 건 아니다.

---

## 잘 되어 있는 것 (유지할 것)

- **reduced-motion** — [globals.css:175-188](../src/app/globals.css#L175-L188) 전역 차단 + [AnimatedSection](../src/shared/components/AnimatedSection/index.tsx)/[JdMatch](../src/widgets/JdMatch/index.tsx)의 `useReducedMotion()` 개별 분기까지 이중으로 처리. 스코어 바 애니메이션도 분기되어 있다.
- **다크모드 FOUC 방지** — [layout.tsx](../src/app/%5Blocale%5D/layout.tsx)의 인라인 `themeInitScript` + `suppressHydrationWarning` + `viewport.themeColor` 라이트/다크 양쪽 지정.
- **외부 링크 3종 세트** — `target='_blank'` + `rel='noopener noreferrer'` + `aria-label` + `sr-only` 새 탭 안내가 예외 없이 붙어 있다.
- **한글 조판** — `break-keep`, `tabular-nums`, `tracking-tight` 사용처가 정확하다.
- **로딩 상태** — JdMatch 스켈레톤이 실제 결과 레이아웃을 모사하고, `aria-live='polite'` + `aria-busy`([LastUpdate](../src/features/profile/ui/LastUpdate/index.tsx))까지 있다.
- **빈 데이터 방어** — 모든 위젯이 `console.warn`(dev only) 후 `return null`.
- **아코디언 모션** — 열림 360ms / 닫힘 280ms 비대칭 + `will-change` 지정. 세심하다.

---

## 권장 처리 순서

| 순서 | 항목                          | 난이도 | 효과                      |
| ---- | ----------------------------- | ------ | ------------------------- |
| 1    | P1-2 `leading-1.2`            | 1줄    | 본문 가독성 즉시 개선      |
| 2    | P1-3 Dialog 포커스 링         | 1줄    | 키보드 접근성 복구         |
| 3    | P3-1 툴팁 `aria-label`        | 1줄    | 스크린리더                 |
| 4    | P1-1 Profile/Header 폭 정렬   | 2파일  | **시각적으로 가장 큰 변화** |
| 5    | P3-3 JdMatch `sr-only` h2     | 1줄    | 아웃라인 복구              |
| 6    | P2-3 Tooltip 중복 스타일 정리 | 1파일  | 죽은 코드 제거             |
| 7    | P2-1 Badge 결정 (흡수/삭제)   | 3~4파일| 칩 통일                    |
| 8    | P2-2 시맨틱 토큰 통일         | 전 위젯| 대공사, 마지막에           |

1~5번은 합쳐도 소규모다. 여기까지만 해도 눈에 띄는 문제는 정리된다.
