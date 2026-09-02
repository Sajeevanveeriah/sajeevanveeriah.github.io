'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const desktopRoot = __dirname;
const repositoryRoot = path.resolve(desktopRoot, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(desktopRoot, 'product-catalog.json'), 'utf8'));
const dataSource = fs.readFileSync(path.join(repositoryRoot, 'public', 'open-industrial-automation', 'data.js'), 'utf8');
const mainSource = fs.readFileSync(path.join(desktopRoot, 'main.cjs'), 'utf8');

assert.equal(catalog.schemaVersion, '1.0.0');
assert.equal(catalog.suiteVersion, '2.2.0');
assert.equal(catalog.products.length, 16, 'Expected the suite plus fifteen focused products');

for (const field of ['id', 'name', 'artifact', 'appId', 'module', 'description']) {
  const values = catalog.products.map((product) => product[field]);
  assert.ok(values.every(Boolean), `Missing ${field}`);
  assert.equal(new Set(values).size, values.length, `Duplicate ${field}`);
}

for (const product of catalog.products) {
  assert.match(dataSource, new RegExp(`id:\\s*['"]${product.module.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`), `Missing module ${product.module}`);
}

for (const file of [
  'public/open-industrial-automation/index.html',
  'public/open-industrial-automation/styles.css',
  'public/open-industrial-automation/dub.css',
  'public/open-industrial-automation/data.js',
  'public/open-industrial-automation/app.js',
  'public/open-industrial-automation/runtime-bootstrap.js',
  'public/open-industrial-automation/product-shell.js',
  'desktop/assets/icon.png',
]) {
  const full = path.join(repositoryRoot, file);
  assert.ok(fs.existsSync(full), `Missing ${file}`);
  assert.ok(fs.statSync(full).size > 0, `Empty ${file}`);
}

for (const requiredSecuritySetting of [
  'contextIsolation: true',
  'nodeIntegration: false',
  'sandbox: true',
  'webSecurity: true',
  'setPermissionRequestHandler',
  'setPermissionCheckHandler',
  'will-attach-webview',
  'requestSingleInstanceLock',
]) {
  assert.ok(mainSource.includes(requiredSecuritySetting), `Missing desktop security setting: ${requiredSecuritySetting}`);
}

assert.ok(mainSource.includes('Open-Industrial-Automation'), 'Desktop products must share one user data root');
assert.ok(!mainSource.includes('http://'), 'Desktop runtime must not use insecure HTTP');
console.log(`Desktop catalog verified: ${catalog.products.length} interconnected products, secure shell, shared workspace.`);
