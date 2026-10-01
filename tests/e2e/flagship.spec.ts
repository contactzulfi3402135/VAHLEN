import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const test = base.extend<{ runtimeErrors: string[] }>({
  runtimeErrors: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await use(errors);
    expect(errors, 'No browser console or uncaught runtime errors').toEqual([]);
  }, { auto: true }],
});

test.beforeEach(async ({ page }) => {
  await page.route('https://api.frankfurter.dev/**', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ base: 'USD', date: '2026-09-30', rates: { EUR: .88067, GBP: .75265, CHF: .8347 } }),
  }));
  await page.goto('/');
});

test('cover, eight self-hosted photographs and responsive boundaries', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mechanicalpermanence inan ephemeral era.');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => { image.loading = 'eager'; return image.decode(); }));
  });
  const dimensions = await page.evaluate(() => ({ viewport: innerWidth, page: document.documentElement.scrollWidth }));
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport);
  expect(await page.evaluate(() => new Set([...document.images].map(image => image.getAttribute('src'))).size)).toBe(8);
  expect(await page.evaluate(() => [...document.images].every(image => image.naturalWidth > 0))).toBe(true);
});

test('all collection filters return real matching pieces', async ({ page }) => {
  const panel = page.getByRole('tabpanel');
  await expect(panel.locator('article')).toHaveCount(4);
  await page.getByRole('tab', { name: 'Haute horlogerie' }).click();
  await expect(panel.locator('article')).toHaveCount(2);
  await expect(panel.getByRole('heading', { name: 'Chronomètre V-04' })).toBeVisible();
  await page.getByRole('tab', { name: 'Leathergoods & valises' }).click();
  await expect(panel.locator('article')).toHaveCount(2);
  await expect(panel.getByRole('heading', { name: 'Valise No. 12' })).toBeVisible();
  await page.getByRole('tab', { name: 'Writing instruments' }).click();
  await expect(panel.locator('article')).toHaveCount(1);
  await expect(panel.getByRole('heading', { name: 'The Writer’s Folio' })).toBeVisible();
  await page.getByRole('tab', { name: /All pieces/ }).click();
  await expect(panel.locator('article')).toHaveCount(4);
});

test('currency converts collection, studio, surcharge and persists on return', async ({ page }) => {
  await page.getByRole('button', { name: 'Currency: USD' }).click();
  await page.getByRole('menuitemradio', { name: /EUR/ }).click();
  await expect(page.getByTestId('price-chrono')).toHaveText('€16,292 EUR');
  await expect(page.getByTestId('commission-price')).toHaveText('€16,292 EUR');
  await page.getByRole('radio', { name: /18k Rose Gold/ }).check();
  await expect(page.getByTestId('commission-price')).toHaveText('€21,753 EUR');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Currency: EUR' })).toBeVisible();
  await expect(page.getByTestId('commission-price')).toHaveText('€21,753 EUR');
  await page.getByRole('button', { name: 'Currency: EUR' }).click();
  await page.getByRole('menuitemradio', { name: /GBP/ }).click();
  await expect(page.getByTestId('price-chrono')).toHaveText('£13,924 GBP');
  await page.getByRole('button', { name: 'Currency: GBP' }).click();
  await page.getByRole('menuitemradio', { name: /CHF/ }).click();
  await expect(page.getByTestId('price-chrono')).toHaveText('Fr. 15,442 CHF');
});

test('bag additions, quantity, deletion, shipping and converted totals', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Valise No. 12 to bag', exact: true }).click();
  const bag = page.getByRole('dialog', { name: 'Your bag.' });
  await expect(bag).toBeVisible();
  await expect(page.getByTestId('bag-subtotal')).toHaveText('$4,800');
  await expect(page.getByTestId('bag-shipping')).toHaveText('$185');
  await expect(page.getByTestId('bag-total')).toHaveText('$4,985');
  await bag.getByRole('button', { name: 'Increase quantity of Valise No. 12' }).click();
  await expect(page.getByTestId('bag-subtotal')).toHaveText('$9,600');
  await bag.getByLabel('DELIVERY DESTINATION').selectOption('EU');
  await expect(page.getByTestId('bag-shipping')).toHaveText('$95');
  await bag.getByLabel('DELIVERY DESTINATION').selectOption('CH');
  await expect(page.getByTestId('bag-shipping')).toHaveText('Complimentary');
  await bag.getByRole('button', { name: 'Currency: USD' }).click();
  await bag.getByRole('menuitemradio', { name: /EUR/ }).click();
  await expect(page.getByTestId('bag-subtotal')).toHaveText('€8,454');
  await bag.getByRole('button', { name: 'Decrease quantity of Valise No. 12' }).click();
  await expect(page.getByTestId('bag-subtotal')).toHaveText('€4,227');
  await bag.getByRole('button', { name: 'Remove Valise No. 12 from bag' }).click();
  await expect(bag.getByRole('heading', { name: 'Room for something enduring.' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open bag, 0 items' })).toBeVisible();
});

test('quick view transfers the selected finish and quantity to a persistent bag', async ({ page }) => {
  await page.getByTestId('product-chrono').getByRole('button', { name: 'Quick view', exact: true }).click();
  const view = page.getByRole('dialog', { name: 'Chronomètre V-04' });
  await view.getByLabel('YOUR SELECTED FINISH').selectOption('Bone enamel / Cognac bridle');
  await view.getByRole('button', { name: 'Increase quantity of Chronomètre V-04' }).click();
  await view.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Your bag.' }).getByText('Bone enamel / Cognac bridle', { exact: true })).toBeVisible();
  await expect(page.getByTestId('bag-subtotal')).toHaveText('$37,000');
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Open bag, 2 items' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Chronomètre V-04 to bag', exact: true }).click();
  await expect(page.locator('.bag-item')).toHaveCount(2);
});

test('bespoke configuration becomes a tailored, downloadable consultation dossier', async ({ page }) => {
  await page.getByRole('radio', { name: /Tourbillon Sovereign/ }).check();
  await page.getByRole('radio', { name: /18k Rose Gold/ }).check();
  await page.getByRole('radio', { name: 'Forest Sunburst', exact: true }).check();
  await page.getByRole('radio', { name: 'Noir Matte Alligator', exact: true }).check();
  await page.getByRole('textbox', { name: 'Monogram, maximum 3 characters' }).fill('av.');
  await expect(page.locator('.engraving-preview')).toHaveText('HAND-ENGRAVED CASEBACK: [ AV. ]');
  await expect(page.getByTestId('commission-price')).toHaveText('$34,200 USD');
  await page.getByRole('button', { name: 'Request allocation', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Your private commission.' });
  await expect(dialog.locator('.build-summary')).toContainText('18k Rose Gold');
  await expect(dialog.locator('.build-summary')).toContainText('Forest Sunburst');
  await expect(dialog.locator('#concierge-note')).toHaveValue(/Tourbillon Sovereign; 18k Rose Gold; Forest Sunburst; Noir Matte Alligator; caseback engraving AV\./);
  await dialog.getByLabel('FULL NAME', { exact: true }).fill('Alex Collector');
  await dialog.getByLabel('EMAIL ADDRESS', { exact: true }).fill('collector@example.test');
  await dialog.getByLabel('PREFERRED SALON').selectOption('Mayfair salon');
  await dialog.getByRole('checkbox').check();
  await dialog.getByRole('button', { name: 'Request private allocation' }).click();
  await expect(dialog.getByRole('heading', { name: 'A conversation, begun.' })).toBeVisible();
  await expect(dialog.getByText('Preview only: saved in this browser. No request has been transmitted.')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await dialog.getByRole('button', { name: 'Keep your dossier' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^vahlen-dossier-gen-26-.*\.json$/);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('vahlen.dossiers.v1') || '[]'));
  expect(stored[0].input.build).toMatchObject({ model: 'tourbillon', alloy: 'rose', dial: 'forest', strap: 'noir', monogram: 'AV.' });
  expect(stored[0].input.estimateUSD).toBe(34200);
});

test('allocation checkout calculates delivery and submits without collecting payment', async ({ page }) => {
  await page.getByRole('button', { name: 'Add The Writer’s Folio to bag', exact: true }).click();
  await page.getByRole('button', { name: 'Proceed to allocation checkout' }).click();
  const dialog = page.getByRole('dialog', { name: 'Allocation checkout.' });
  await expect(page.getByTestId('checkout-total')).toHaveText('$1,435');
  await dialog.getByLabel('DELIVERY DESTINATION').selectOption('GB');
  await expect(page.getByTestId('checkout-total')).toHaveText('$1,375');
  await dialog.getByLabel('FULL NAME', { exact: true }).fill('Casey Custodian');
  await dialog.getByLabel('EMAIL ADDRESS', { exact: true }).fill('custodian@example.test');
  await dialog.getByRole('checkbox').check();
  await dialog.getByRole('button', { name: 'Confirm allocation enquiry' }).click();
  await expect(dialog.getByText('No payment has been taken. An object is only reserved after personal confirmation by the salon.')).toBeVisible();
  await expect(dialog.locator('.receipt-estimate')).toContainText('$1,375 USD');
});

test('salon validates email, preserves role and confirms a local registration', async ({ page }) => {
  await page.locator('#register-email').fill('not-an-email');
  await page.getByRole('button', { name: 'Join the register' }).click();
  expect(await page.locator('#register-email').evaluate((input: HTMLInputElement) => input.validity.valid)).toBe(false);
  await page.getByRole('radio', { name: 'Press', exact: true }).check();
  await page.locator('#register-email').fill('press@example.test');
  await page.locator('.salon-form').getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Join the register' }).click();
  await expect(page.getByRole('heading', { name: 'A conversation, begun.' })).toBeVisible();
  await expect(page.getByText('Your dossier has been registered with the Geneva salon concierge.', { exact: true })).toBeVisible();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('vahlen.dossiers.v1') || '[]'));
  expect(stored[0].input.role).toBe('Press');
  await page.getByRole('button', { name: 'Privacy & discretion', exact: true }).click();
  await page.getByRole('button', { name: 'Delete saved enquiry dossiers' }).click();
  expect(await page.evaluate(() => localStorage.getItem('vahlen.dossiers.v1'))).toBeNull();
});

test('archive editions and provenance lookup are complete, not dummy links', async ({ page }) => {
  await page.getByRole('button', { name: 'Enter the atelier archive' }).click();
  const archive = page.getByRole('dialog', { name: 'The atelier archive.' });
  await expect(archive.getByRole('heading', { name: 'On the patience of the hand.' })).toBeVisible();
  await archive.getByRole('button', { name: '2025', exact: true }).click();
  await expect(archive.getByRole('heading', { name: 'A stitch that will outlast us.' })).toBeVisible();
  await archive.getByRole('button', { name: '2024', exact: true }).click();
  await expect(archive.getByRole('heading', { name: 'The architecture of a calibre.' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /THE PROVENANCE REGISTER/ }).click();
  const register = page.getByRole('dialog', { name: 'The provenance register.' });
  await register.getByRole('button', { name: 'VC-2026-004', exact: true }).click();
  await expect(register.getByText('SAMPLE ARCHIVE ENTRY FOUND')).toBeVisible();
  await expect(register.locator('.provenance-record')).toContainText('Chronomètre V-04');
  await register.getByLabel('OBJECT ARCHIVE REFERENCE').fill('VC-2026-099');
  await register.getByRole('button', { name: 'Look up object' }).click();
  await expect(register.getByRole('heading', { name: 'No entry found for VC-2026-099.' })).toBeVisible();
});

test('modal traps focus, closes on Escape and restores focus', async ({ page }) => {
  const trigger = page.getByTestId('product-chrono').getByRole('button', { name: 'Quick view', exact: true });
  await trigger.click();
  await expect(page.locator('#app-shell')).toHaveAttribute('inert', '');
  for (let index = 0; index < 12; index++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('malformed persisted state does not break the storefront', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('vahlen.bag.v1', '[{"productId":"fake","quantity":-1}]');
    localStorage.setItem('vahlen.currency.v1', '"INVALID"');
    localStorage.setItem('vahlen.commission.v1', '{broken');
    localStorage.setItem('vahlen.fx.v1', '{"rates":{"CHF":-50}}');
  });
  await page.reload();
  await expect(page.getByRole('button', { name: 'Open bag, 0 items' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Currency: USD' })).toBeVisible();
  await expect(page.getByTestId('commission-price')).toHaveText('$18,500 USD');
});

test('mobile and tablet navigation remains fully usable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'Desktop', 'Desktop has the full navigation');
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('button', { name: 'Bespoke commissions' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'An expression entirely your own.' })).toBeInViewport();
});

test('WCAG AA automated audit passes on the page and bag dialog', async ({ page }) => {
  const pageResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(pageResults.violations).toEqual([]);
  await page.getByRole('button', { name: 'Add Valise No. 12 to bag', exact: true }).click();
  const bagResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(bagResults.violations).toEqual([]);
});
