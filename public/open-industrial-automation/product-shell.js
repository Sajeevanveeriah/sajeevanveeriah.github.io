(function () {
  'use strict';

  const PRODUCT_KEY = 'oia-active-product-v1';
  const catalog = {
    "suite": {
      name: "OIA Suite",
      title: "Open Industrial Automation",
      module: "overview",
      modules: null,
    },
    "operations": {
      name: "OIA Operations",
      title: "Operations and SCADA",
      module: "operations",
      modules: ["overview", "operations", "alarms", "historian", "performance"],
    },
    "control": {
      name: "OIA Control",
      title: "Control Engineering",
      module: "control-studio",
      modules: ["overview", "control-studio", "tags-io", "integration", "migration", "deployment"],
    },
    "hmi": {
      name: "OIA HMI",
      title: "HMI and SCADA Studio",
      module: "hmi-studio",
      modules: ["overview", "hmi-studio", "tags-io", "alarms", "historian", "identity"],
    },
    "alarms": {
      name: "OIA Alarm Management",
      title: "Alarm Management",
      module: "alarms",
      modules: ["overview", "alarms", "operations", "historian", "validation", "identity"],
    },
    "historian": {
      name: "OIA Historian",
      title: "Historian and Analytics",
      module: "historian",
      modules: ["overview", "historian", "operations", "performance", "integration", "deployment"],
    },
    "performance": {
      name: "OIA OEE",
      title: "OEE and Reporting",
      module: "performance",
      modules: ["overview", "performance", "batch-mes", "historian", "maintenance", "integration"],
    },
    "integration": {
      name: "OIA Integration Hub",
      title: "Industrial Integration Hub",
      module: "integration",
      modules: ["overview", "integration", "tags-io", "deployment", "migration", "cybersecurity"],
    },
    "mes": {
      name: "OIA MES",
      title: "Manufacturing Execution",
      module: "batch-mes",
      modules: ["overview", "batch-mes", "materials", "performance", "integration", "identity"],
    },
    "materials": {
      name: "OIA Materials",
      title: "Materials and Movement",
      module: "materials",
      modules: ["overview", "materials", "batch-mes", "integration", "maintenance"],
    },
    "assets": {
      name: "OIA Asset Care",
      title: "Maintenance and Asset Care",
      module: "maintenance",
      modules: ["overview", "maintenance", "historian", "tags-io", "validation", "materials"],
    },
    "quality": {
      name: "OIA Quality",
      title: "Quality and Validation",
      module: "validation",
      modules: ["overview", "validation", "identity", "batch-mes", "deployment", "documentation"],
    },
    "security": {
      name: "OIA OT Security",
      title: "OT Cybersecurity",
      module: "cybersecurity",
      modules: ["overview", "cybersecurity", "identity", "integration", "deployment", "validation"],
    },
    "identity": {
      name: "OIA Identity and Records",
      title: "Identity and Records",
      module: "identity",
      modules: ["overview", "identity", "validation", "cybersecurity", "deployment"],
    },
    "deployment": {
      name: "OIA Deployment Centre",
      title: "Deployment Centre",
      module: "deployment",
      modules: ["overview", "deployment", "integration", "cybersecurity", "validation", "migration"],
    },
    "migration": {
      name: "OIA Migration Workbench",
      title: "Migration Workbench",
      module: "migration",
      modules: ["overview", "migration", "hmi-studio", "tags-io", "control-studio", "validation"],
    }
  };

  const params = new URLSearchParams(location.search);
  const requested = params.get('product');
  const saved = sessionStorage.getItem(PRODUCT_KEY);
  const productId = Object.hasOwn(catalog, requested) ? requested : Object.hasOwn(catalog, saved) ? saved : 'suite';
  const product = catalog[productId];
  sessionStorage.setItem(PRODUCT_KEY, productId);
  document.documentElement.dataset.product = productId;

  const moduleAllowed = (id) => product.modules === null || product.modules.includes(id);

  function productUrl(id) {
    const target = catalog[id];
    return `./?product=${encodeURIComponent(id)}#${encodeURIComponent(target.module)}`;
  }

  function ensureControls() {
    const topActions = document.querySelector('.top-actions');
    if (!topActions || topActions.querySelector('[data-oia-product-controls]')) return;

    const wrapper = document.createElement('div');
    wrapper.dataset.oiaProductControls = 'true';
    wrapper.style.display = 'contents';

    const productControl = document.createElement('div');
    productControl.className = 'product-control';
    productControl.dataset.kind = 'product';
    productControl.innerHTML = `
      <label for="oiaProductSelect">Product</label>
      <select id="oiaProductSelect" aria-label="Open an OIA product">
        ${Object.entries(catalog).map(([id, item]) => `<option value="${id}" ${id === productId ? 'selected' : ''}>${item.name}</option>`).join('')}
      </select>`;

    const speedControl = document.createElement('div');
    speedControl.className = 'product-control';
    speedControl.dataset.kind = 'speed';
    const activeSpeed = Number(window.OIA_RUNTIME?.speed || 5);
    speedControl.innerHTML = `
      <label for="oiaSpeedSelect">Simulation speed</label>
      <select id="oiaSpeedSelect" aria-label="Simulation speed">
        ${[1, 2, 5, 10, 20].map((value) => `<option value="${value}" ${value === activeSpeed ? 'selected' : ''}>${value}x simulation</option>`).join('')}
      </select>`;

    wrapper.append(productControl, speedControl);
    topActions.prepend(wrapper);

    productControl.querySelector('select').addEventListener('change', (event) => {
      location.href = productUrl(event.target.value);
    });
    speedControl.querySelector('select').addEventListener('change', (event) => {
      window.OIA_RUNTIME?.setSpeed(event.target.value);
    });
  }

  function applyProduct() {
    const subtitle = document.querySelector('.brand-lockup span');
    if (subtitle) subtitle.textContent = product.title;

    document.querySelectorAll('#moduleList .module-button[data-module]').forEach((button) => {
      button.hidden = !moduleAllowed(button.dataset.module);
    });

    document.querySelectorAll('#moduleList .module-group-label').forEach((label) => {
      let next = label.nextElementSibling;
      let visible = false;
      while (next && !next.classList.contains('module-group-label')) {
        if (next.matches('.module-button') && !next.hidden) visible = true;
        next = next.nextElementSibling;
      }
      label.hidden = !visible;
    });

    const current = location.hash.slice(1) || 'overview';
    if (!moduleAllowed(current)) {
      location.hash = product.module;
      return;
    }

    const crumb = document.querySelector('#breadcrumb');
    if (crumb && !crumb.querySelector('.product-badge')) {
      const badge = document.createElement('span');
      badge.className = 'product-badge';
      badge.textContent = product.name;
      crumb.prepend(badge);
    }

    ensureControls();
    const moduleTitle = document.querySelector('#breadcrumb strong')?.textContent || product.title;
    document.title = `${moduleTitle} - ${product.name}`;
  }

  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      applyProduct();
    });
  }

  const observer = new MutationObserver(schedule);
  const moduleList = document.querySelector('#moduleList');
  const workspace = document.querySelector('#workspace');
  if (moduleList) observer.observe(moduleList, { childList: true, subtree: true });
  if (workspace) observer.observe(workspace, { childList: true, subtree: true });

  window.addEventListener('hashchange', schedule);
  applyProduct();
})();
