# HemeBench

[Open the study bench](https://hemebench.vercel.app/)

HemeBench is a hematology workbook for interpreting adult blood films and laboratory reports. Seven modules cover peripheral smears, CBCs, anemia, coagulation, flow cytometry, molecular findings and integrated cases. Practice decisions include feedback and links to the underlying evidence.

Start in the smear atlas to compare cell structures, then identify the circled cells on unfamiliar films. Use the integrated cases to work through a diagnostic decision before the next results arrive. Mixed review draws one question from each module, records the first answer and lets you revisit missed decisions. The next full round draws alternate questions.

The app saves module checks, review rounds and preferences in the current browser. The first online visit caches the workbook, micrographs and fonts for offline practice. External references require a connection.

## Run locally

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

## Verify a change

```sh
npm run lint
npm run type-check
npx playwright install chromium
npm test
```

The Playwright suite builds the production app and starts the Vite preview server. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to use an existing Chromium installation. Use `npm run build` to generate the Vercel static site in `dist/`.

## Content and image provenance

The [clinical content guide](CONTENT.md) lists the practice formats and evidence checks. Sources appear next to the decision or reference entry they support. The smear atlas credits the Acevedo et al. peripheral blood dataset under CC BY 4.0. The home micrograph is Tommaso Leonardi’s public-domain photograph. Font licenses are included in `public/fonts/`.

[Blood-cell dataset](https://doi.org/10.17632/snkd93bnjr.1) · [Home micrograph](https://commons.wikimedia.org/wiki/File:Neutrophil.jpg)
