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
    { date: '2026-10-20', lessonIndex: 1, textbook: 'Big English 1' },
    { date: '2026-10-27', lessonIndex: 2, textbook: 'Big English 1' }
  ]
};

test('current textbook changes on the first dated lesson of the new book', () => {
  assert.equal(current(schedule, '2026-11-01').textbook, 'Big English 1');
  assert.equal(current(schedule, '2026-11-03').textbook, 'Big English 2');
  assert.equal(current(schedule, '2026-11-10').textbook, 'Big English 2');
});

test('before first class, textbook is marked upcoming', () => {
  const result = current(schedule, '2026-10-01');
  assert.equal(result.textbook, 'Big English 1');
  assert.equal(result.upcoming, true);
});
