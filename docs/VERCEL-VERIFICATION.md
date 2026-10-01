# Vercel-ready package — verification

Checked 1 October 2026 under Node 22.23.3.

- Vercel project configuration: zero validation errors against the published configuration schema.
- Framework: Vite. Install: `npm ci`. Build: `npm run build`. Output: `dist`.
- Node 22 declared in `package.json` and the lockfile.
- No `.env` or `.env.example` files included.
- No custom application runtime environment-variable reads.
- Forms use browser-local dossiers only; the zero-configuration tests verify that registration does not call a server.
- Public Frankfurter / ECB reference feed is hardcoded and requires no API key; a dated cached fallback is included.
- All eight photographic assets verified against requested dimensions and SHA-256 manifest.
- Production build passed: zero TypeScript / CSS compilation errors.
- ESLint passed: zero errors or warnings.
- Unit tests: 17 passed, zero failed.
- Desktop / tablet / mobile browser tests: 38 passed, zero failed; one intentionally inapplicable desktop mobile-menu test skipped.
- Automated WCAG 2.1 AA page and bag-dialog checks passed at all three tested sizes.
- Browser error checks passed in all tested flows.
- Dependency audit: zero known vulnerabilities at the check time.
- ZIP contains `package.json` and `vercel.json` at the archive root, all source/assets and the compiled production output.

Evidence: `vercel-build.log`, `vercel-browser-tests.log`, `unit-results.json`, `e2e-results.json` and `image-manifest.json`.

This verifies the configuration, production build and local browser operation. A deployment to your personal Vercel account has not been performed. Upload the ZIP at https://vercel.com/drop and click Deploy; leave environment variables empty.

The storefront is a creative concept. Forms do not send emails, process payments or reserve real inventory.
