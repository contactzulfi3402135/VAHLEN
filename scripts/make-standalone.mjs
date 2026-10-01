import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const index = readFileSync('dist/index.html', 'utf8');
const scriptPath = index.match(/<script[^>]+src="([^"]+\.js)"/)[1];
const stylePath = index.match(/<link[^>]+href="([^"]+\.css)"/)[1];
let script = readFileSync(`dist${scriptPath}`, 'utf8');
let style = readFileSync(`dist${stylePath}`, 'utf8');
const dataURI = (path, mime) => `data:${mime};base64,${readFileSync(path).toString('base64')}`;

for (const name of readdirSync('public/assets/images').filter(file => file.endsWith('.jpg'))) {
  const path = `/assets/images/${name}`;
  assert.ok(script.includes(path), `Referenced photograph ${name}`);
  script = script.replaceAll(path, dataURI(`public${path}`, 'image/jpeg'));
}
for (const name of readdirSync('public/assets/fonts').filter(file => file.endsWith('.woff2'))) {
  const path = `/assets/fonts/${name}`;
  assert.ok(style.includes(path), `Referenced font ${name}`);
  style = style.replaceAll(path, dataURI(`public${path}`, 'font/woff2'));
}
const favicon = dataURI('public/favicon.svg', 'image/svg+xml');
// The file viewer permits scripts but not native HTML form navigation.
// Keep native constraint validation, then invoke React's client-side submit
// handler; no native navigation or extra network capability is introduced.
const previewBridge = `
document.addEventListener('click', function(event) {
  const button = event.target.closest?.('button[type="submit"]');
  if (!button || button.disabled || !button.form) return;
  event.preventDefault();
  if (button.form.reportValidity()) button.form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}, true);
document.addEventListener('keydown', function(event) {
  if (event.isComposing || event.key !== 'Enter' || event.target.tagName === 'TEXTAREA') return;
  const form = event.target.form;
  if (!form) return;
  event.preventDefault();
  if (form.reportValidity()) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}, true);
`;
script = (previewBridge + script).replaceAll('</script', '<\\/script');
const html = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="theme-color" content="#FBF9F5"><meta name="description" content="VAHLEN & CO. — Independent haute horlogerie and bespoke leathercraft. Self-contained interactive concept flagship."><title>VAHLEN & CO. — Objects of Permanence</title><link rel="icon" href="${favicon}"><style>${style}</style></head><body><div id="root"></div><script type="module">${script}</script></body></html>`;
const output = resolve(process.argv[2] || '../VAHLEN-flagship.html');
writeFileSync(output, html);
console.log(`Standalone flagship: ${output} (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB)`);
console.log('Application, photography and fonts are embedded. FX gracefully falls back to cached rates when unavailable.');
