# Design Spec — eunsu-resume UI 총 점검

## Context

- **Project**: eunsu-resume (Next.js 15 App Router + React 19 + TypeScript + Tailwind CSS 4 + shadcn-ui)
- **Live**: https://resume.eunsu.pro/
- **Scope**: `src/widgets/**`, `src/features/**`, `src/shared/components/**` (필요 시 shadcn primitive)
- **Constraints**:
  - 패키지 매니저: **bun 전용** (npm/pnpm/yarn 금지)
  - `src/subjects/*.yaml`은 콘텐츠 소스, 편집 금지
  - FSD 레이어 규칙 준수 (widgets↔widgets, features↔features import 금지)
  - `bun run lint` 통과 필수
  - Prettier tailwindcss plugin이 클래스 순서 자동 정렬

## Design Direction

- **Tone**: 미니멀 + 무난하지 않게 (약간의 개성)
- **Color**: 파란 계열 유지, 액센트는 **자연스럽고 일반적인 강도**
  - 파란 액센트 확대는 subtle~medium (bold fill 남발 X)
  - 라이트/다크 모두 대응
- **Whitespace**: 편안한 가독성 (밀도 낮지도 답답하지도 않게)
- **Personality**: 자연스러운 개성 포인트 1~2개 (과한 애니메이션·비대칭 레이아웃 지양)

## Improvement Backlog

### Phase 1 — 핵심 위계·색

| ID  | 위치                        | 개선                                                                      |
| --- | --------------------------- | ------------------------------------------------------------------------- |
| G1  | 전역                        | 파란 액센트 자연스럽게 확대 (섹션 제목 좌측 세로 bar, 카드 hover accent)  |
| G2  | 전역                        | 개성 포인트 1~2 (예: 좌측 sticky 제목 accent bar, subtle Portfolio hover) |
| D1  | Skills 뱃지                 | 핵심 스택(React/Next/TS 등)에 파란 톤 부여, 그 외 outline — 위계          |
| D2  | Skills 카운트 chip (+46 등) | 다른 뱃지와 톤 조화 (outline-blue + text-blue)                            |
| E2  | Portfolio 카드 버튼         | Live=primary, GitHub=secondary 로 스타일 통일                             |
| E5  | Portfolio 카드 hover        | subtle blue border/shadow, 카드 감각 강화                                 |

### Phase 2 — 정렬·여백

| ID  | 위치                               | 개선                                      |
| --- | ---------------------------------- | ----------------------------------------- |
| A1  | 프로필 사진 ↔ 이름 블록            | vertical 정렬 기준 통일 (top or baseline) |
| A2  | "마지막 업데이트" 우상단           | 프로필 라인에 붙이거나 위계 재조정        |
| A3  | 4개 링크 (email/github/velog/blog) | 균등 grid, 아이콘 색·크기 밸런스          |
| A4  | 이름 ↔ 생년월일                    | 폰트 크기 대비 조정 (부제 승격)           |
| C1  | Experience "467일째 근무 중"       | text-xs → text-[13px]                     |
| C2  | Activity "01 번호 ↔ 제목"          | 시각 위계 강화 (letter-spacing, weight)   |
| E1  | Portfolio 카드 내부 padding        | p-6 → p-7                                 |
| E3  | Portfolio 카드 요소 순서           | 제목 → 설명 → 스택 → 버튼(하단 CTA)       |

### Phase 3 — 마이너 폴리시

| ID  | 위치                                | 개선                                      |
| --- | ----------------------------------- | ----------------------------------------- |
| B1  | Introduce 본문                      | 핵심 문장 파란 강조 or gray-900 대비 강화 |
| B2  | Introduce 상단                      | "27세 · 2년 3개월 경력" 요약 chip         |
| D3  | Skills 카테고리 라벨 (LANGUAGES 등) | 대비 강화 or 좌측 세로 bar                |
| F1  | Certification                       | 아이콘 + 취득일 metadata, 리스트 시각화   |
| F2  | Writings 카드                       | date/NEW 뱃지 위치 정리 (corner pin)      |
| F3  | Writings 태그 chip                  | Skills 뱃지와 구분 (더 subordinate)       |
| F4  | "전체 정리 글 보기 →"               | 링크 → outline blue 버튼 승격             |
| F5  | Footer                              | 심심함 완화 (미묘한 divider/서명)         |
| A5  | 우상단 nav                          | 텍스트 링크 vs 아이콘 버튼 그룹 분리      |
| A6  | Writings NEW dot                    | 크기·위치 미세 조정                       |
| G3  | 좌측 sticky 제목 컬럼               | 데스크탑에서 width 재조정                 |
| G4  | 섹션 간 vertical gap                | 일관된 spacing scale                      |
| G5  | 다크 모드                           | 파란 액센트 라이트/다크 모두 대응 검증    |

## Files (start-of-loop snapshot)

- `src/app/[locale]/page.tsx` — 홈 페이지 조립
- `src/app/[locale]/layout.tsx` — 전역 레이아웃
- `src/widgets/Header/index.tsx` — 상단 nav (Writings/JD Match/설정/GitHub)
- `src/widgets/Profile/index.tsx`
- `src/widgets/Introduce/index.tsx`
- `src/widgets/Experience/index.tsx` (편집 완료 상태에서 시작)
- `src/widgets/Skill/index.tsx`
- `src/widgets/Portfolio/index.tsx`
- `src/widgets/Education/index.tsx`
- `src/widgets/Certification/index.tsx`
- `src/widgets/Writings/index.tsx` (또는 상응 파일)
- `src/features/**` 하위 UI 컴포넌트들
- `src/shared/components/SectionTitle/index.tsx`
- `src/shared/components/TagChip/index.tsx`

Generator는 시작 시 실제 파일 트리 확인 후 정확한 대상 파일 확정.

## Success Criteria

- Weighted evaluator score ≥ **7.5** (max 10)
- `bun run lint` — 오류/경고 0
- 라이트/다크 모드 모두 정상 렌더
- 사용자 방향성(미니멀 + 자연스러운 개성 + 파란 유지 + 편안한 여백) 준수
- 스크린샷 기반 시각 검증 통과
