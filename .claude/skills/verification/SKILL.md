---
name: verification
description: Use when validating a change in this repo, where knowing the repo is required and running the tests is not enough on its own.
---

# Verification

What this repo knows and the model cannot work out by reading it:

- 테스트 스위트가 없다. `test` 스크립트 자체가 없으므로 "테스트 통과"라는 신호는 존재하지 않는다. 실질 게이트는 `bun run build`다.
- `build`는 `fetch:velog`를 먼저 돌리므로 네트워크가 필요하다. velog GraphQL에 닿지 못해 실패한 빌드는 코드 문제가 아니다 — 구분해서 보고한다.
- `lint`가 `--max-warnings 0`으로 돌고 `build`에 물려 있다. 경고 하나가 빌드를 세운다.
- `@db/*`를 타는 코드는 `DATABASE_URL` 없이 실행되지 않는다. 그 경로는 로컬에서 확인할 수 없으므로 "수동 확인 필요"로 명시 보고한다.

<!--
  Generated from interview Q3. Everything here came from an answer.

  There is deliberately no "identify the change, run the smallest test set,
  report what you ran" procedure: the model already does that unprompted, and
  writing it down compounds with its own behaviour instead of adding to it.
  If this file ever holds only such steps, delete the file.
-->
