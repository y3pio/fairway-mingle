# Fairway Friends

A mobile-first, fictional prototype for golf-centered dating and social outings.

This repository is a stakeholder demo—not a production dating service. All people, messages, courses, events, and offers are fictional, and all state stays in the browser.

## Prerequisites

- Node 22.14 (see `.nvmrc`)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite. The canonical reset URL is:

```text
/?reset=1&scenario=dustin-dating
```

Other scenarios:

```text
/?reset=1&scenario=outings
/?reset=1&scenario=premium
/__demo
```

## Quality commands

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
npm run verify
```

Regenerate local stylized demo artwork with `npm run generate:assets`.

## Deployment

`npm run build` produces static files in `dist/`. The prototype is designed for deployment at the root of a dedicated Apache subdomain with SPA fallback routing.

See [the full specification](./FAIRWAY_MINGLE_PROTOTYPE_SPEC.md), [spec analysis](./docs/SPEC_ANALYSIS.md), and [recorded decisions](./docs/DECISIONS.md).
