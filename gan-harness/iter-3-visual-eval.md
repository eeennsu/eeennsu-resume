# Iteration 3 — Visual Verification

- **Date**: 2026-07-26
- **Method**: puppeteer-core (시스템 Chrome) + `bun run dev`(localhost:3000) headless fullPage 캡처. 스크롤 트리거로 `AnimatedSection` (motion `whileInView + once`) IntersectionObserver 발동시킨 뒤 top으로 복귀해 캡처.
- **Coverage**: 홈(`/ko`) + Writings(`/ko/writings`) × desktop(1440×900) + mobile(375×812) × light + dark = 총 8장. 저장: [gan-harness/screenshots/](screenshots/)
- **Baseline (iter 2 final)**: 8.19 / 10 (코드 정적)

---

## Score: 8.47 / 10 (PASS)

| Axis           | Score    | Weight | Weighted | Δ vs iter 2 final |
| -------------- | -------- | ------ | -------- | ----------------- |
| Design Quality | 8.5 / 10 | 0.35   | 2.98     | +0.5              |
| Originality    | 7.8 / 10 | 0.30   | 2.34     | +0.1              |
| Craft          | 9.0 / 10 | 0.25   | 2.25     | +0.3              |
| Functionality  | 9.0 / 10 | 0.10   | 0.90     | 0.0               |
| **Total**      |          |        | **8.47** | **+0.28**         |

## Visual Confirmations (실제 렌더에서 확인됨)

| 항목                               | 확인 지점                                                                                                              |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| G1 SectionTitle 좌측 파란 세로 bar | 모든 섹션(Introduce·Experience·Skills·Portfolio·Education·Certification·Writings)에 일관                               |
| B2 Introduce hero chip             | 파란 pill + 좌측 dot + "27세 · 2년 3개월 경력" 정상 렌더. 다크 모드에서도 톤 유지                                      |
| D1 Skill 핵심 뱃지 파란 위계       | TypeScript / React.js / Next.js / React Native 등 CORE_SKILL_IDS 만 파란 fill로 강조. outline 나머지와 위계 명확       |
| D3 Skill 카테고리 좌측 mini bar    | LANGUAGES / LIBRARIES & FRAMEWORKS / TOOLS 앞에 짧은 파란 세로 tick                                                    |
| E2 Portfolio CTA 통일              | GitHub(secondary outline gray) / Live(primary blue-fill) 대비 명확                                                     |
| E3 Portfolio 카드 요소 순서        | 제목 → 설명 → tools chip → **하단 anchor CTA** 배치. 카드 감각 살아남                                                  |
| F1 Certification 아이콘 + time     | BadgeCheck 파란 아이콘 + 자격증명 + 우측 취득일 정렬. list의 시각 위계 발생                                            |
| F4 RecentWritings 전체 링크        | outline blue button 승격 확인. 카드 아래 우측 배치                                                                     |
| F5 Footer signature                | 짧은 파란 divider + Thanks + `© 2026 · Bang Eunsu` + 버전 태그. 마무리 톤 완결                                         |
| A1 프로필 사진 vertical 정렬       | 사진 top edge가 이름 라인과 자연스럽게 align                                                                           |
| A2 LastUpdate 위치                 | 데스크탑에서 이름 블록 우측 상단에 anchor, 모바일에서 프로필 아래로 이동. 이중 렌더 안정                               |
| A3 4개 링크 균등 grid              | 이메일/GitHub/Velog/tstory 링크가 데스크탑 2×2 grid로 정렬. 아이콘 크기 통일                                           |
| A4 이름/생년월일 위계              | 이름 3xl semibold ↔ 생일 base medium tabular ↔ 나이 sm gray. `·` 구분자로 리듬                                         |
| G5 다크 모드 파란 액센트           | Introduce chip / mini bar / CTA outline / Footer divider 모두 라이트 대비 유지 (border-blue-500/25, bg-blue-500/10 톤) |

## New Observations (스크린샷에서만 잡힌 것)

1. **Introduce hero chip이 브랜드 identity anchor 로 작동** — 파란 pill이 첫 스크롤 시야에 걸리면서 "누구인지 요약"이 순간 파악. hero moment에 signature accent가 확실히 자리잡음.
2. **Portfolio grid가 하단 CTA anchor 재배치로 시각 완결성 상승** — 4개 카드가 같은 baseline에 CTA row가 정렬. 카드 관용 패턴(하단 action)에 부합.
3. **Skills 위젯의 두 겹 위계** — 카테고리 라벨 mini bar(D3) + 뱃지 core fill/outline(D1)이 시각 위계를 이중으로 표현. 정보 밀도 대비 파싱 용이.
4. **모바일 홈**: 좌측 SectionTitle이 상단으로 stack되면서 sticky는 데스크탑에만 적용됨을 확인. 모바일에선 sticky가 UX 방해되지 않도록 잘 스코핑됨.

## Caveats (스크린샷 아티팩트)

- **fullPage 스크린샷에 상단 sticky header가 중복 등장** — puppeteer가 페이지를 스크롤하며 프레임을 잇는 과정에서, `sticky top-0` 로 걸린 헤더 nav가 각 스크롤 위치에 남아 결과 이미지 중간중간 다시 나타남. **실제 브라우저 UX에는 문제 없음** — 정상적인 sticky 동작. 스크린샷만 이상하게 보임.
- Console error / network failure 로그는 미확인. 시각적으로는 파손 없으나 hydration warning 등 잠재 이슈는 별도 확인 필요.

## Residual gaps (iter 4 후보)

1. **B1 첫 단락 blue accent** — 여전히 미착수. YAML `{{highlight}}` 마커 도입으로 처리 가능. Introduce hero chip이 어느 정도 커버하지만 본문 자체의 강조 포인트는 부재.
2. **`bun run build`** — 프로덕션 정적 빌드 통과 미확인. Turbopack dev 통과 ≠ Next 프로덕션 통과.
3. **Lighthouse 성능 audit** — LCP/CLS/INP 수치 미측정. hero 이미지 (`/images/profile.jpg`)에 `priority` 는 잘 걸림.
4. **접근성 audit** — axe-core / pa11y 미실행. focus-visible / aria-live 등은 코드상 잘 반영되어 있으나 실 검증은 별도 라운드 필요.

## Sign-off

- **PASS (8.47 / 10)** — pass threshold 7.5 대비 +0.97 여유.
- iter 2 코드 정적 채점(8.19) 대비 시각 검증 후 +0.28 상승 — 코드 판단이 실제 렌더와 잘 align 됨.
- 다음 loop 진행 여부는 사용자 판단. B1 + 프로덕션 빌드 + Lighthouse 셋을 iter 4로 묶으면 유의미.
