const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const app = require('../src/server');

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => server?.close());

async function get(route) {
  const response = await fetch(`${baseUrl}${route}`);
  return { status: response.status, text: await response.text() };
}

test('homepage renders portfolio introduction', async () => {
  const response = await get('/');
  assert.equal(response.status, 200);
  assert.match(response.text, /Engineering software, built from the geometry up/);
});

test('project list and individual project routes render', async () => {
  const list = await get('/projects');
  assert.equal(list.status, 200);
  assert.match(list.text, /AI-powered CAD geometry creation/);
  assert.match(list.text, /Generative AI Integration for PLM/);
  assert.doesNotMatch(list.text, /AI and knowledge retrieval experiments/);
  const detail = await get('/projects/ai-cad-geometry');
  assert.equal(detail.status, 200);
  assert.match(detail.text, /Architecture &amp; approach|Architecture & approach/);
  assert.match(detail.text, /\/videos\/NUT_Flange\.mp4/);
  const plmAi = await get('/projects/generative-ai-plm-integration');
  assert.equal(plmAi.status, 200);
  assert.match(plmAi.text, /Generative AI Integration for PLM/);
  assert.match(plmAi.text, /PostgreSQL/);
  assert.match(plmAi.text, /Ollama/);
  assert.match(plmAi.text, /\/videos\/3DX_PLM\.mp4/);
  const oldAiProject = await get('/projects/ai-knowledge-retrieval');
  assert.equal(oldAiProject.status, 404);
});

test('content pages and presentation mode render', async () => {
  for (const route of ['/about', '/cad-development', '/3dexperience-plm', '/ai-innovation', '/software-projects', '/achievements', '/resume', '/contact', '/interview']) {
    const response = await get(route);
    assert.equal(response.status, 200, `${route} should render`);
  }
});

test('missing routes return a branded 404', async () => {
  const response = await get('/not-a-page');
  assert.equal(response.status, 404);
  assert.match(response.text, /isn't in the model/);
});
