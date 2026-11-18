import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const context = {};
vm.runInNewContext(readFileSync(new URL('../assets/textbook-context.js', import.meta.url), 'utf8'), context);
const { current } = context.ClassTableTextbook;
const schedule = {
  textbook: 'Big English 2',
  lessons: [
    { date: '2026-11-03', lessonIndex: 3, textbook: 'Big English 2' },
    { date: '2026-10-20', lessonIndex: 1, textbook: 'Big English 1', status: 'completed' },
    { date: '2026-10-27', lessonIndex: 2, textbook: 'Big English 1', status: 'completed' }
  ]
};

test('current textbook changes on the first dated lesson of the new book', () => {
  assert.equal(current(schedule, '2026-11-01').textbook, 'Big English 1');
  assert.equal(current(schedule, '2026-11-03').textbook, 'Big English 2');
  assert.equal(current(schedule, '2026-11-10').textbook, 'Big English 2');
});

test('upgrading preserves earlier lessons and waits for the old book to finish', () => {
  const bundle = readFileSync(new URL('../assets/index-C_N6_LWa.js', import.meta.url), 'utf8');
  const upgradeSource = bundle.slice(bundle.indexOf('function Fh('), bundle.indexOf('function mf('));
  const upgrade = vm.runInNewContext(upgradeSource + ';Fh', {
    xf: () => [{ unit: 0, lessonInUnit: 1, code: 'U0L1' }]
  });
  const original = {
    textbook: 'Next Move',
    lessons: [
      { date: '2026-11-11', lessonCode: 'U5L5', status: 'scheduled' },
      { date: '2026-11-18', lessonCode: 'U5L6', status: 'scheduled' },
      { date: '2026-11-25', lessonCode: 'U6L1', status: 'scheduled' }
    ]
  };
  const updated = upgrade(original, 3, { name: 'BE1', textbook: 'Big English 1' }, 0, 1);
  assert.equal(updated.textbook, 'Next Move');
  assert.equal(updated.lessons[0].lessonCode, 'U5L5');
  assert.equal(updated.lessons[1].textbook, 'Next Move');
  assert.equal(updated.lessons[2].textbook, 'Big English 1');
  assert.equal(updated.lessons[2].lessonCode, 'U0L1');
  assert.equal(current(updated, '2026-11-25').textbook, 'Next Move');
  updated.lessons[0].status = 'completed';
  updated.lessons[1].status = 'completed';
  assert.equal(current(updated, '2026-11-24').textbook, 'Next Move');
  assert.equal(current(updated, '2026-11-25').textbook, 'Big English 1');
});

test('before first class, textbook is marked upcoming', () => {
  const result = current(schedule, '2026-10-01');
  assert.equal(result.textbook, 'Big English 1');
  assert.equal(result.upcoming, true);
});
