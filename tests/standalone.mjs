import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', request => requests.push(request.url()));
  await page.route('https://api.frankfurter.dev/**', route => route.fulfill({
    status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ base: 'USD', date: '2026-09-30', rates: { EUR: .88067, GBP: .75265, CHF: .8347 } }),
  }));
  const path = resolve('../VAHLEN-flagship.html');
  await page.goto(pathToFileURL(path).href, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => { image.loading = 'eager'; return image.decode(); }));
  });
  assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1);
  assert.equal(await page.evaluate(() => new Set([...document.images].map(image => image.src)).size), 8);
  assert.equal(await page.evaluate(() => [...document.images].every(image => image.src.startsWith('data:') && image.naturalWidth > 0)), true);
  await page.getByRole('radio', { name: /18k Rose Gold/ }).check();
  assert.equal(await page.getByTestId('commission-price').innerText(), '$24,700 USD');
  await page.getByRole('button', { name: 'Add Valise No. 12 to bag', exact: true }).click();
  assert.equal(await page.getByTestId('bag-total').innerText(), '$4,985');
  await page.keyboard.press('Escape');
  await page.locator('#register-email').fill('preview@example.test');
  await page.locator('.salon-form').getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Join the register' }).click();
  await page.getByRole('heading', { name: 'A conversation, begun.' }).waitFor();
  assert.deepEqual(errors, []);
  assert.equal(requests.some(url => /^https?:/.test(url) && !url.startsWith('https://api.frankfurter.dev/')), false);
  console.log('✓ Standalone browser file: eight embedded photographs, local fonts, pricing, bag and registration.');

  const html = await readFile(path, 'utf8');
  await page.goto('http://127.0.0.1:4173/');
  await page.setContent(`<iframe title="Flagship file preview" sandbox="allow-scripts" style="width:100%;height:100vh;border:0" srcdoc="${html.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"></iframe>`);
  const frame = page.frameLocator('iframe');
  await frame.getByRole('heading', { level: 1 }).waitFor();
  await frame.locator('#register-email').fill('sandbox-preview@example.test');
  await frame.locator('.salon-form').getByRole('checkbox').check();
  await frame.getByRole('button', { name: 'Join the register' }).click();
  await frame.getByRole('heading', { name: 'A conversation, begun.' }).waitFor();
  assert.equal(await frame.locator('.register-success').getByText('Preview only: held in this session. No request has been transmitted.').count(), 1);
  await frame.getByRole('button', { name: /THE PROVENANCE REGISTER/ }).click();
  await frame.getByLabel('OBJECT ARCHIVE REFERENCE').fill('VC-2026-004');
  await frame.getByLabel('OBJECT ARCHIVE REFERENCE').press('Enter');
  await frame.getByText('SAMPLE ARCHIVE ENTRY FOUND').waitFor();
  assert.deepEqual(errors, []);
  console.log('✓ Opaque-origin file viewer: storage-disabled session fallback, scripted form validation and keyboard provenance lookup.');
  await writeFile('docs/standalone-check.json', JSON.stringify({
    checkedAt: new Date().toISOString(), embeddedImages: 8, externalAssetRequests: 0,
    errors, opaqueOriginViewer: 'passed', localFormWorkflow: 'passed',
  }, null, 2));
} finally {
  await browser.close();
}
