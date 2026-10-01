# Deploy in three steps — no environment variables

1. Open **https://vercel.com/drop** and sign in.
2. Upload **`VAHLEN-Vercel-ready.zip`** directly. Do not unzip it for Vercel Drop.
3. Select your team, enter a project name, and click **Deploy**.

Leave Environment Variables empty. Build settings are already in `vercel.json`:

| Setting | Included value |
| --- | --- |
| Framework | Vite |
| Install | `npm ci` |
| Build | `npm run build` |
| Output | `dist` |
| Node | 22.x |
| Project root | `.` |

For a Git import, unzip the package and put its contents at the repository root before importing the repo into Vercel.

For CLI deployment, run `npx vercel --prod` from the extracted folder and follow the account/project prompts.

**Forms run locally in the visitor’s browser.** No email, payment or reservation service is connected. Currency conversion uses a public, keyless feed with an offline fallback. All eight images and fonts are included.
