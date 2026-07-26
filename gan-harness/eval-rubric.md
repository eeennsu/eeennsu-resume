# Evaluation Rubric — Design-Focused

가중치는 `/ecc:gan-design` 기본값을 따름. 각 축은 0~10점, 최종 = Σ(score × weight).

Pass threshold: **7.5**

---

## Design Quality (weight: 0.35)

전문 프론트엔드 디자이너 관점에서 "이 UI가 아름답고 완성도 높은가".

- **시각 위계 (2점)** — 제목/본문/캡션 구분이 명확한가? 정보 우선순위가 시각적으로 드러나는가?
- **여백/리듬 (2점)** — spacing이 편안한가? 밀도가 적절한가? 좌우/상하 balance?
- **정렬 (2점)** — 요소들이 격자에 맞고 baseline/edge가 정돈되었는가?
- **색상 조화 (2점)** — 파란 액센트가 자연스럽게 녹아드는가? 대비/톤이 조화로운가?
- **타이포 (2점)** — 폰트 크기·굵기·자간이 목적에 맞는가? 국문/영문 조화?

## Originality (weight: 0.30)

"안전한 스탠다드 이력서 → 자연스러운 개성 이력서"로의 이동 정도.

- **차별화 (4점)** — 밋밋한 부트스트랩 톤을 벗어났는가? 개인의 취향/톤이 느껴지는가?
- **디테일 (3점)** — 카드/뱃지/hover/section accent 등에 정성적 디테일이 있는가?
- **자연스러움 (3점)** — 개성이 튀지 않고 미니멀 톤 안에서 균형 잡혔는가?
  - 과도한 애니메이션/그라디언트/비대칭은 감점
  - 사용자 방향("자연스럽고 일반적") 위배 시 감점

## Craft (weight: 0.25)

구현 완성도.

- **코드 품질 (3점)** — Tailwind 클래스 정돈, cn() 사용, 재사용성
- **접근성 (2점)** — WCAG 색대비, focus-visible, aria, semantic HTML
- **반응형 (3점)** — 모바일/태블릿/데스크탑 브레이크포인트 대응
- **다크 모드 (2점)** — dark: variant 완비, 라이트/다크에서 모두 톤 유지

## Functionality (weight: 0.10)

- **회귀 없음 (5점)** — 기존 기능(accordion 열림, 링크 이동, tooltip 등) 정상
- **빌드 통과 (3점)** — `bun run lint` 통과
- **성능 (2점)** — 불필요한 transition/애니메이션 없음, 리렌더 이슈 없음

---

## Reporting Format (Evaluator 출력)

```
### Iteration N — Score: X.XX / 10

- Design Quality:  X/10 (× 0.35 = X.XX)
- Originality:     X/10 (× 0.30 = X.XX)
- Craft:           X/10 (× 0.25 = X.XX)
- Functionality:   X/10 (× 0.10 = X.XX)

**Weighted total: X.XX**

### Strengths
- ...

### Weaknesses (prioritized)
1. ...
2. ...

### Concrete next actions
- file:line — change
```
