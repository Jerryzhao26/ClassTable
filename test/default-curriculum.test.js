import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const defaults = JSON.parse(readFileSync(new URL('../default-curriculum.json', import.meta.url), 'utf8'));
const bundle = readFileSync(new URL('../assets/index-C_N6_LWa.js', import.meta.url), 'utf8');

test('backup curriculum is the built default without importing classes', () => {
  assert.equal(defaults.templates.length, 12);
  assert.equal(new Set(defaults.customTextbooks).size, defaults.customTextbooks.length);
  for (const template of defaults.templates) {
    assert.ok(template.textbook);
    assert.ok(defaults.customTextbooks.includes(template.textbook));
    assert.ok(Array.isArray(template.units) && template.units.length > 0);
    assert.ok(bundle.includes(JSON.stringify(template.id)));
  }
  assert.ok(bundle.includes('return []}),[Me,pe]=_.useState'));
  assert.ok(!('schedules' in defaults));
  assert.ok(!('teachers' in defaults));
});
