import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const bundle = readFileSync(new URL('../assets/index-C_N6_LWa.js', import.meta.url), 'utf8');
const start = bundle.indexOf('onBatchDeleteSchedules:L=>');
const end = bundle.indexOf(',onOpenPrintModal:', start);
assert.ok(start > 0 && end > start);
const expression = bundle.slice(start + 'onBatchDeleteSchedules:'.length, end);

test('batch deletion rejects locked and unknown IDs before changing schedules', () => {
  const context = {
    Q: false, me: [{ id: 'one' }], j: null,
    prompts: 0, updates: 0, syncs: 0,
    b() { this.prompts++; },
    te(fn) { this.updates++; fn(); },
    O(fn) { this.me = fn(this.me); },
    u() {}, C() { this.syncs++; }
  };
  // Bind callbacks as normal functions because the extracted app callback uses lexical variables.
  context.b = () => context.prompts++;
  context.te = fn => { context.updates++; fn(); };
  context.O = fn => { context.me = fn(context.me); };
  context.C = () => context.syncs++;
  const remove = vm.runInNewContext('(' + expression + ')', context);
  assert.equal(remove(['one']), false);
  assert.equal(context.prompts, 1);
  assert.equal(context.updates, 0);
  context.Q = true;
  assert.equal(remove(['missing']), false);
  assert.equal(context.updates, 0);
  assert.equal(remove(['one']), true);
  assert.equal(context.me.length, 0);
  assert.equal(context.syncs, 1);
});
