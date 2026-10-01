# VAHLEN & CO. — Vercel-ready

**Complete React / TypeScript / Vite / Tailwind flagship. Zero environment-variable setup.**

All eight custom photographs, self-hosted fonts, responsive layouts, collections, bag, currency conversion, commission studio, archive, provenance lookup and validated local forms are included.

## Fastest deployment — upload this ZIP

1. Open **https://vercel.com/drop** and sign in to your Vercel account.
2. Drop **`VAHLEN-Vercel-ready.zip`** onto the page. Do not unzip it for Vercel Drop.
3. Choose your team/project name and click **Deploy**.

**Leave Environment Variables empty.** No API keys, `.env` files, database accounts or server configuration are required.

`vercel.json` already selects Vite, installs with `npm ci`, builds with `npm run build`, publishes `dist/`, and handles SPA refreshes/deep links. `package.json` selects Node 22.

Vercel Drop creates a new project for each upload. For ongoing updates at the same URL, use the Git workflow below.

## Deploy from Git instead

1. Unzip the package into an empty folder.
2. Push the extracted contents to GitHub, GitLab or Bitbucket. Keep `package.json` and `vercel.json` at the repository root.
3. In Vercel, choose **Add New → Project** and import that repository.
4. Use root directory **`.`**, accept the included Vite build settings, leave environment variables empty, and click **Deploy**.

## CLI alternative

From the extracted project folder:

```bash
npx vercel --prod
```

Sign in and follow the team/project prompts. No environment-variable setup is needed.

## What “no environment variables” means

- All photographs, fonts and interface assets are included in `public/`.
- Currency conversion uses the public Frankfurter / ECB feed directly, with no key or configured URL. If it is unavailable, the app uses the validated, dated cached reference rates and labels them accordingly.
- Bag, currency and commission preferences are saved in the visitor’s browser.
- Appointment, allocation and gazette forms validate the inputs and create a browser-local dossier. Dossiers can be exported and deleted through the privacy panel.
- **No emails are sent, no payment is taken and no actual object is reserved.** This is the explicit local demonstration mode; the application does not depend on a hidden backend or a missing service key.
- The deployed build cannot be changed into a live sender by setting an environment variable. Real email/payment/CRM operation would be a separate integration, not a prerequisite for this package.

VAHLEN & CO. is a creative concept. The heritage, addresses, product specifications, sample provenance records and editorial acclaim are illustrative, and the imagery is AI-generated.

## Local development

Use Node 22:

```bash
npm ci
npm run dev
```

## Build and checks

```bash
npm run verify:assets
npm run lint
npm test
npm run build
```

For the desktop/tablet/mobile browser suite:

```bash
npx playwright install --with-deps chromium
npm run test:e2e
```

The ZIP includes source, the npm lockfile, all eight images and font licences, tests, Vercel configuration, and a precompiled `dist/` for reference. Vercel rebuilds that folder from the source during deployment.

See `docs/VERCEL-VERIFICATION.md` for the checks performed on this package.

## Structure

```text
vercel.json          Ready-made Vercel project configuration
package.json         Vite commands and Node 22 requirement
package-lock.json    Reproducible dependency install
src/                 Complete typed React application
public/              Eight photographs, local fonts and favicon
scripts/             Asset verification and standalone export helper
tests/               Unit and desktop/tablet/mobile interaction tests
dist/                Precompiled production site
```

Official deployment references: [Vercel Drop](https://vercel.com/docs/drop) and [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite).
