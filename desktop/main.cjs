'use strict';

const { app, BrowserWindow, Menu, net, protocol, session, shell } = require('electron');
const { readFile } = require('node:fs/promises');
const path = require('node:path');
const catalog = require('./product-catalog.json');
const packageMetadata = require('./package.json');

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'oia',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);

const products = new Map(catalog.products.map((product) => [product.id, product]));
const requestedProduct = packageMetadata.oiaProduct || process.env.OIA_PRODUCT || 'suite';
const product = products.get(requestedProduct) || products.get('suite');
const sharedDataRoot = path.join(app.getPath('appData'), 'Open-Industrial-Automation');

app.setName(product.name);
app.setPath('userData', sharedDataRoot);

let mainWindow = null;

function suiteRoot() {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'suite')
    : path.resolve(__dirname, '..', 'public', 'open-industrial-automation');
}

function safeAssetPath(url) {
  const parsed = new URL(url);
  let pathname = decodeURIComponent(parsed.pathname || '/');
  if (pathname.endsWith('/')) pathname += 'index.html';
  const root = suiteRoot();
  const candidate = path.resolve(root, `.${pathname}`);
  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) {
    throw new Error('Path escapes suite root');
  }
  return candidate;
}

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.webmanifest': 'application/manifest+json',
  }[extension] || 'application/octet-stream';
}

async function registerSuiteProtocol() {
  protocol.handle('oia', async (request) => {
    try {
      const filePath = safeAssetPath(request.url);
      const bytes = await readFile(filePath);
      return new Response(bytes, {
        status: 200,
        headers: {
          'content-type': contentType(filePath),
          'cache-control': 'no-store',
          'content-security-policy': [
            "default-src 'self'",
            "img-src 'self' data:",
            "style-src 'self' 'unsafe-inline'",
            "script-src 'self'",
            "connect-src 'self'",
            "font-src 'self' data:",
            "object-src 'none'",
            "base-uri 'none'",
            "form-action 'self'",
            "frame-ancestors 'none'",
          ].join('; '),
        },
      });
    } catch {
      return new Response('Not found', {
        status: 404,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
    }
  });
}

function buildMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        { role: 'close' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Open source repository',
          click: () => shell.openExternal('https://github.com/Sajeevanveeriah/sajeevanveeriah.github.io/tree/main/public/open-industrial-automation'),
        },
        {
          label: 'Security boundary',
          click: () => shell.openExternal('https://sajeevanveeriah.github.io/open-industrial-automation/#documentation'),
        },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 940,
    minWidth: 900,
    minHeight: 640,
    backgroundColor: '#ffffff',
    show: false,
    title: product.name,
    autoHideMenuBar: process.platform !== 'darwin',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      spellcheck: true,
      devTools: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) void shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const parsed = new URL(url);
    if (parsed.protocol !== 'oia:' || parsed.hostname !== 'app') {
      event.preventDefault();
      if (parsed.protocol === 'https:') void shell.openExternal(url);
    }
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('closed', () => { mainWindow = null; });

  const target = `oia://app/index.html?product=${encodeURIComponent(product.id)}#${encodeURIComponent(product.module)}`;
  void mainWindow.loadURL(target);
}

app.on('ready', async () => {
  await registerSuiteProtocol();

  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  session.defaultSession.setPermissionCheckHandler(() => false);

  buildMenu();
  createWindow();
});

app.on('web-contents-created', (_event, contents) => {
  contents.on('will-attach-webview', (event) => event.preventDefault());
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

const gotLock = app.requestSingleInstanceLock({ product: product.id });
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });
}
