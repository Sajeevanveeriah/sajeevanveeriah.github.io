'use strict';

const { contextBridge } = require('electron');
const catalog = require('./product-catalog.json');
const metadata = require('./package.json');

contextBridge.exposeInMainWorld('oiaDesktop', Object.freeze({
  desktop: true,
  platform: process.platform,
  architecture: process.arch,
  product: metadata.oiaProduct || 'suite',
  version: metadata.version,
  suiteVersion: catalog.suiteVersion,
  sharedWorkspaceId: catalog.sharedWorkspaceId,
}));
