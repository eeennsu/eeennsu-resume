# UI/UX 전체 폴리싱 플로우

이력서 사이트 전체 페이지·컴포넌트를 검사해서 "AI가 만든 듯한 부자연스러움"을 걷어내는 작업 절차.

## 목표

- 디자인 토큰 일관성 확보
- AI 특유 UI 냄새(rounded+border+shadow 3종세트, gradient 남발, 대칭 강박 등) 제거
- 다크모드/반응형/접근성 회귀 없이 폴리싱

## 사용 스킬

- `frontend-design:frontend-design` — 방향/시스템 정합성
- `ecc:make-interfaces-feel-better` — spacing/typography/border/shadow/motion 디테일 (핵심)
- `ecc:taste` — 취향 캘리브레이션 (과한 장식 걸러냄)
- `ecc:react-reviewer` — 최종 코드 리뷰

보조:

- Chrome DevTools MCP — 스크린샷/반응형 검증
- `ecc:code-explorer` (agent) — 인벤토리 수집

## Phase 0 — 준비

```bash
git status                          # working tree clean 확인
git checkout -b ui-polish/full-sweep
mkdir .polish                       # 진행 상태 저장
echo ".polish/" >> .gitignore       # 작업 산출물은 커밋 제외
```

## Phase 1 — 인벤토리

`ecc:code-explorer` 서브에이전트에 위임 (메인 컨텍스트 아낌).

수집:

- `src/app/[locale]/**/page.tsx` 라우트 전부
- `src/widgets/**` 위젯 전부
- `src/features/**/ui/**` feature UI 전부
- `src/shared/components/**` 공용 컴포넌트 전부

산출: `.polish/inventory.md`

## Phase 2 — 디자인 시스템 감사 (수정 전 필수)

**컴포넌트 손대기 전에 토큰부터 잡아야 이중작업 안 남는다.**

스킬 로드:

```
Skill: ecc:make-interfaces-feel-better
Skill: frontend-design:frontend-design
```

감사 대상:

- `tailwind.config.*` — spacing/radius/shadow/font scale
- `src/app/globals.css` — CSS 변수, 색 토큰
- 실제 사용 빈도 grep — `bg-`, `text-`, `rounded-`, `shadow-`
- font-weight/size 계층 실사용 분포

산출: `.polish/system-audit.md`

- 스케일 이탈 사례
- 색 팔레트 실사용 히스토그램
- 중복/충돌 토큰 목록

## Phase 3 — 페이지별 진단 배치

각 페이지 반복:

1. Chrome DevTools MCP `navigate_page`
2. `take_screenshot` — light/dark × desktop(1440)/mobile(375)
3. AI-smell 체크리스트 대조
4. `.polish/pages/<route>.md` 에 저장 (스샷 경로, 체크 결과, 우선순위 P0/P1/P2)

### AI-smell 체크리스트

- [ ] `rounded-2xl + border + shadow` 3종 세트 남발
- [ ] gradient / `backdrop-blur` 과잉
- [ ] 모든 카드 `hover:scale-*` 획일 적용
- [ ] 이모지 헤딩, 색깔 원형 아이콘 배지 남용
- [ ] font-weight 계층 얕음 (전부 semibold)
- [ ] spacing 균일 (리듬 없음)
- [ ] 대칭 강박 (모든 그리드 정렬)
- [ ] 카드 내부 여백 = 카드 사이 여백 (계층 안 보임)
- [ ] 모바일 터치 타겟 <44px
- [ ] 텍스트 wrap 어색 (한 단어만 다음 줄)
- [ ] 다크모드 대비 부족
- [ ] focus ring 없음 / 어색함

## Phase 4 — 수정 배치

**배치 단위는 페이지가 아니라 관심사별.** 페이지 단위로 하면 공용 컴포넌트 중복 수정.

배치 순서 (각 배치 = 1커밋):

1. **디자인 토큰** — `globals.css`, `tailwind.config.*`
2. **공용 primitives** — `src/shared/components/**` (버튼/카드/뱃지/badge)
3. **feature UI** — `src/features/**/ui/**` (feature별로 나눔)
4. **widgets** — `src/widgets/**` (widget별로 나눔)
5. **page 조립부** — `src/app/[locale]/**/page.tsx` (route별)

매 배치 후:

```bash
bun run build           # 회귀 확인
bun run lint            # 린트 확인
git add -p
git commit -m "polish: <scope>"
```

Dev server는 배치 내내 띄워놓고 브라우저에서 실시간 확인.

## Phase 5 — Before/After 회귀 검증

Phase 3 대상 페이지 재촬영:

- Chrome DevTools MCP로 스크린샷 다시
- `.polish/diff/<route>-before-after.md` 나란히 배치

체크:

- 시각적 밸런스 개선?
- 다크모드 깨짐 없음?
- 반응형 (375 / 768 / 1440) 깨짐 없음?
- Lighthouse a11y 점수 유지 또는 개선?

## Phase 6 — 최종 리뷰

```
Skill: ecc:taste             # 취향 최종 캘리브레이션
```

`/agents ecc:react-reviewer` — 코드 품질 리뷰 (성능 회귀, 훅 안전성)

## 세션 분할 전략

**한 세션에서 다 하지 마.** 컨텍스트 오염 심함.

- 세션 A: Phase 0 + 1 + 2 (준비, 인벤토리, 시스템 감사)
- 세션 B: Phase 3 (진단만) — 페이지 많으면 B1/B2로 쪼갬
- 세션 C~: Phase 4 배치 하나당 세션 하나
- 세션 Z: Phase 5 + 6 (검증, 최종 리뷰)

각 세션 시작 시 이 문서(`docs/ui-polish-flow.md`) + 이전 세션 산출물(`.polish/**`) 읽히기.

## 새 세션 첫 프롬프트 (복붙용)

```
이 문서 읽고 이력서 사이트 UI/UX 전체 폴리싱 시작해줘: docs/ui-polish-flow.md

이전 세션 산출물 있으면 .polish/ 확인.

이번 세션은 Phase [X] 진행. 시작 전 현 phase 목표/산출물 확인시켜줘.
```

## 원칙

- **checkpoint 커밋 자주** — 배치 하나 = 커밋 하나. 되돌리기 쉬움
- **빌드만 믿지 마** — dev server + 브라우저 실시간 확인 필수
- **토큰 먼저** — 컴포넌트부터 만지면 나중에 토큰 바꿀 때 전부 다시
- **다크모드/모바일 매번** — 라이트 데스크탑만 확인하면 회귀 놓침
- **`.polish/` 는 gitignore** — 스샷/오딧 산출물은 커밋 대상 아님
