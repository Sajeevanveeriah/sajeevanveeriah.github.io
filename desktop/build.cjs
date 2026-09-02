'use strict';
/* CommonJS is required by Electron and electron-builder entry points. */
/* eslint-disable @typescript-eslint/no-require-imports */

const { build, Platform, Arch } = require('electron-builder');
const path = require('node:path');
const catalog = require('./product-catalog.json');

const desktopRoot = __dirname;
const repositoryRoot = path.resolve(desktopRoot, '..');
const productId = process.env.OIA_PRODUCT || 'suite';
const product = catalog.products.find((item) => item.id === productId);
if (!product) throw new Error(`Unknown OIA product: ${productId}`);

const platformId = process.env.OIA_PLATFORM || {
  win32: 'windows',
  darwin: 'mac',
  linux: 'linux',
}[process.platform];

const platform = {
  windows: Platform.WINDOWS,
  mac: Platform.MAC,
  linux: Platform.LINUX,
}[platformId];

if (!platform) throw new Error(`Unsupported OIA platform: ${platformId}`);

const archId = process.env.OIA_ARCH || (platformId === 'mac' ? 'universal' : 'x64');
const architecture = {
  x64: Arch.x64,
  arm64: Arch.arm64,
  universal: Arch.universal,
}[archId];

if (architecture === undefined) throw new Error(`Unsupported OIA architecture: ${archId}`);

const targetMap = {
  windows: ['nsis', 'portable'],
  mac: ['dmg', 'zip'],
  linux: ['AppImage', 'deb'],
};
const targetNames = targetMap[platformId];

const version = catalog.suiteVersion;
const output = path.join(repositoryRoot, 'dist', 'installers', platformId, product.id);

const config = {
  appId: product.appId,
  productName: product.name,
  copyright: `Copyright ${new Date().getFullYear()} Open Industrial Automation contributors`,
  electronVersion: '44.1.1',
  artifactName: `${product.artifact}-${version}-${platformId}-${archId}.\${ext}`,
  asar: true,
  npmRebuild: false,
  removePackageScripts: true,
  files: [
    'main.cjs',
    'preload.cjs',
    'product-catalog.json',
    'package.json',
    'assets/**/*',
  ],
  extraMetadata: {
    name: `oia-${product.id}`,
    version,
    description: product.description,
    oiaProduct: product.id,
  },
  extraResources: [
    {
      from: path.join(repositoryRoot, 'public', 'open-industrial-automation'),
      to: 'suite',
      filter: ['**/*'],
    },
  ],
  directories: {
    app: desktopRoot,
    output,
    buildResources: path.join(desktopRoot, 'assets'),
  },
  publish: null,
  win: {
    target: targetMap.windows,
    icon: path.join(desktopRoot, 'assets', 'icon.png'),
    legalTrademarks: 'Open Industrial Automation',
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    deleteAppDataOnUninstall: false,
    shortcutName: product.name,
  },
  portable: {
    artifactName: `${product.artifact}-${version}-windows-portable-${archId}.\${ext}`,
  },
  mac: {
    target: targetMap.mac,
    icon: path.join(desktopRoot, 'assets', 'icon.png'),
    category: 'public.app-category.developer-tools',
    identity: null,
    hardenedRuntime: false,
  },
  dmg: {
    title: `${product.name} ${version}`,
    backgroundColor: '#ffffff',
    window: { width: 600, height: 420 },
  },
  linux: {
    target: targetMap.linux,
    icon: path.join(desktopRoot, 'assets', 'icon.png'),
    category: 'Development',
    maintainer: 'Open Industrial Automation contributors',
    synopsis: product.description,
    executableName: `oia-${product.id}`,
  },
};

build({
  targets: platform.createTarget(targetNames, architecture),
  config,
  publish: 'never',
}).then(() => {
  console.log(`Built ${product.name} for ${platformId}/${archId} in ${output}`);
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
