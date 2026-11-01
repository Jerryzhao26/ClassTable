import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../server.js';

async function withServer(callback) {
  const server = app.listen(0, '127.0.0.1');
  try {
    await new Promise((resolve, reject) => {
      server.once('listening', resolve);
      server.once('error', reject);
    });
    const { port } = server.address();
    await callback(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
  }
}

test('frontend is served but repository files are not', async () => {
  await withServer(async base => {
    const home = await fetch(base + '/');
    assert.equal(home.status, 200);
    assert.match(await home.text(), /ClassTable/);
    assert.equal(home.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(home.headers.get('x-powered-by'), null);

    const asset = await fetch(base + '/assets/index-ByUpw9Er.css');
    assert.equal(asset.status, 200);

    for (const path of ['/package.json', '/server.js', '/README.md', '/patch_bundle.cjs', '/.env.example', '/assets/not-found.js']) {
      const response = await fetch(base + path);
      assert.equal(response.status, 404, path);
    }
  });
});
