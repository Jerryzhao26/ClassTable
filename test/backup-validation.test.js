import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const context = {};
vm.runInNewContext(readFileSync(new URL('../assets/backup-validation.js', import.meta.url), 'utf8'), context);
const { validateBackup } = context.ClassTableBackup;
const valid = () => ({
  version: '1.0.0',
  schedules: [{ id: 'class-1', startDate: '2026-09-01', slots: [], lessons: [{ id: 'lesson-1', date: '2026-09-01' }] }],
  templates: [{ id: 'template-1', units: [{ lessons: [] }] }],
  levels: [], holidays: [], teachers: [], customTextbooks: []
});

test('accepts complete local backup without changing it', () => {
  const backup = valid();
  assert.equal(validateBackup(backup), backup);
});

test('rejects partial and malformed backups before restore', () => {
  for (const mutate of [
    data => { delete data.teachers; },
    data => { data.schedules = {}; },
    data => { data.schedules[0].lessons[0].date = '2026-02-30'; },
    data => { data.schedules.push({ ...data.schedules[0] }); },
    data => { data.schedules[0].lessons.push({ ...data.schedules[0].lessons[0] }); },
    data => { data.templates[0].units = null; }
  ]) {
    const backup = valid();
    mutate(backup);
    assert.throws(() => validateBackup(backup));
  }
});
