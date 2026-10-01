import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const expected = {
  'hero-chronometre.jpg': [1920, 1080],
  'movement-detail.jpg': [1200, 800],
  'leather-craft.jpg': [1200, 800],
  'product-chrono-slate.jpg': [1000, 1000],
  'product-tourbillon.jpg': [1000, 1000],
  'product-valise.jpg': [1000, 1000],
  'product-folio.jpg': [1000, 1000],
  'artisan-portrait.jpg': [1200, 800],
};

function jpegDimensions(buffer) {
  assert.equal(buffer.readUInt16BE(0), 0xffd8, 'Valid JPEG SOI');
  let position = 2;
  while (position < buffer.length) {
    assert.equal(buffer[position], 0xff, 'Valid JPEG marker');
    while (buffer[position] === 0xff) position++;
    const marker = buffer[position++];
    if (marker === 0xd9 || marker === 0xda) break;
    const length = buffer.readUInt16BE(position);
    if ([0xc0, 0xc1, 0xc2].includes(marker)) return [buffer.readUInt16BE(position + 5), buffer.readUInt16BE(position + 3)];
    position += length;
  }
  throw new Error('JPEG dimensions not found');
}

const manifest = JSON.parse(readFileSync('docs/image-manifest.json', 'utf8'));
const images = readdirSync('public/assets/images').filter(name => name.endsWith('.jpg'));
assert.equal(images.length, 8, 'Exactly eight requested photographic JPEGs');
for (const [filename, dimensions] of Object.entries(expected)) {
  const buffer = readFileSync(`public/assets/images/${filename}`);
  assert.deepEqual(jpegDimensions(buffer), dimensions, `${filename}: requested delivery dimensions`);
  const record = manifest.find(item => item.filename === filename);
  assert.ok(record, `${filename}: manifest record`);
  assert.equal(createHash('sha256').update(buffer).digest('hex'), record.sha256, `${filename}: image integrity`);
  console.log(`✓ ${filename} — ${dimensions.join(' × ')} — ${(buffer.length / 1024).toFixed(0)} KB`);
}
console.log('All eight custom production photographs are present and verified.');
