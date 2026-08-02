---
name: verification
description: Use when validating a change in this repo, where knowing the repo is required and running the tests is not enough on its own.
---

# Verification

What this repo knows and the model cannot work out by reading it:

- 빌드 전 `bun run fetch:velog` 필수: `next build` 는 `scripts/fetch-velog.ts` 가 최신 posts 를 저장한다는 전제로 돌아간다. `build` 스크립트가 이미 체이닝되어 있으니 순서를 우회한 부분 빌드는 실제 배포와 다르다
- husky pre-commit + lint-staged 를 우회하지 말 것 (`--no-verify` 금지). commit 시 lint-staged 가 변경된 파일만 자동 포맷/린트한다. 우회하면 CI에서 max-warnings 0 로 실패한다

<!--
  Generated from interview Q3. Everything here came from an answer.

  There is deliberately no "identify the change, run the smallest test set,
  report what you ran" procedure: the model already does that unprompted, and
  writing it down compounds with its own behaviour instead of adding to it.
  If this file ever holds only such steps, delete the file.
-->
