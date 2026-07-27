# Eunsu Resume

> Next.js 기반의 개인 웹 이력서 프로젝트

<p align="center">
  <a href="https://resume.eunsu.pro/">
    <img src="https://img.shields.io/badge/Live-resume.eunsu.pro-0070F3?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Site" />
  </a>
</p>

YAML 파일 기반으로 이력서 콘텐츠를 관리하고, 최신 프론트엔드 스택으로 빌드한 정적 웹 이력서입니다.

---

## Tech Stack

### Core

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

### Styling & Animation

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Motion-000000?style=flat-square&logo=framer&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat-square&logo=radixui&logoColor=white)

### Database

![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)
![Neon](<https://img.shields.io/badge/Neon_(PostgreSQL)-00E5A0?style=flat-square&logo=postgresql&logoColor=black>)

### Tooling

![Bun](https://img.shields.io/badge/Bun-000000?style=flat-square&logo=bun&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=black)

---

## Key Features

### 데이터 기반 콘텐츠 관리

이력서의 모든 콘텐츠는 `src/subjects/` 디렉터리의 YAML 파일로 관리됩니다. 코드를 수정하지 않고도 YAML 파일만 편집하여 이력서 내용을 업데이트할 수 있습니다.

```
src/subjects/
├── profile.yaml        # 기본 프로필 정보
├── introduce.yaml      # 자기소개
├── experience.yaml     # 경력 사항
├── skill.yaml          # 기술 스택
├── portfolio.yaml      # 포트폴리오
├── education.yaml      # 학력
└── certification.yaml  # 자격증
```

### 최신 스택 활용

- **Next.js 15 App Router** 및 **Turbopack** 기반의 빠른 개발 환경
- **React 19** 최신 기능 적용
- **Tailwind CSS 4**를 활용한 유틸리티 퍼스트 스타일링

### 반응형 디자인 & 애니메이션

- 모바일부터 데스크톱까지 대응하는 반응형 레이아웃
- **Motion (Framer Motion)** 을 활용한 부드러운 인터랙션
- **Radix UI** 기반의 접근성 높은 UI 컴포넌트 (Accordion, Dialog, Tooltip 등)

### SEO 최적화 & 배포

- **next-sitemap**을 통한 자동 사이트맵 생성
- GitHub Pages를 활용한 정적 배포 파이프라인

---

## Local Development

```bash
# 의존성 설치
bun install

# 개발 서버 실행 (Turbopack)
bun run dev

# 린트 & 포맷팅
bun run lint
bun run prettier

# 데이터베이스 관련
bun run db:generate   # 마이그레이션 파일 생성
bun run db:migrate    # 마이그레이션 실행
bun run db:studio     # Drizzle Studio 실행
```

---

## Deployment

### 빌드

```bash
bun run build
```

velog fetch → lint → prettier → Next.js 빌드 순서로 실행됩니다.

### 배포 (Vercel)

`main` 브랜치에 push하면 [Vercel Git 통합](https://vercel.com/docs/deployments/git)이 자동으로 프로덕션 배포를 수행합니다. PR 브랜치에는 미리보기 배포가 자동 생성되며, CI 검증(`.github/workflows/ci.yml`)은 lint / typecheck / next build를 별도로 실행합니다.

---

## License

This project is for personal use.
