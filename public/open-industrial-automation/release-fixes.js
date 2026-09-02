(function () {
  'use strict';

  const SUITE_TITLE = 'Open Industrial Automation Suite';
  let titleScheduled = false;

  function labelledRegion(node, index) {
    if (!(node instanceof HTMLElement)) return;
    node.tabIndex = node.tabIndex >= 0 ? node.tabIndex : 0;
    if (!node.hasAttribute('role')) node.setAttribute('role', 'region');
    if (!node.hasAttribute('aria-label') && !node.hasAttribute('aria-labelledby')) {
      const container = node.closest('section, .panel, .hmi-shell, .studio-shell');
      const heading = container?.querySelector('h1, h2, h3, .panel-header strong, .studio-title strong');
      const label = heading?.textContent?.replace(/\s+/g, ' ').trim();
      node.setAttribute('aria-label', label ? `${label} scroll area` : `Scrollable content ${index + 1}`);
    }
  }

  function repairProgress(node) {
    if (!(node instanceof HTMLElement)) return;
    const indicator = node.querySelector(':scope > span');
    const raw = indicator instanceof HTMLElement ? Number.parseFloat(indicator.style.width) : Number.NaN;
    const value = Number.isFinite(raw) ? Math.min(100, Math.max(0, raw)) : 0;
    node.setAttribute('role', 'progressbar');
    node.setAttribute('aria-valuemin', '0');
    node.setAttribute('aria-valuemax', '100');
    node.setAttribute('aria-valuenow', String(value));
    node.setAttribute('aria-valuetext', `${value}% complete`);
    if (!node.hasAttribute('aria-label') && !node.hasAttribute('aria-labelledby')) {
      node.setAttribute('aria-label', 'Progress');
    }
  }

  function repairResizeHandle(node) {
    if (!(node instanceof HTMLElement)) return;
    node.tabIndex = node.tabIndex >= 0 ? node.tabIndex : 0;
    node.setAttribute('role', 'separator');
    node.setAttribute('aria-orientation', 'vertical');
    if (!node.hasAttribute('aria-label')) node.setAttribute('aria-label', 'Resize split panels');
    if (!node.hasAttribute('aria-valuemin')) node.setAttribute('aria-valuemin', '20');
    if (!node.hasAttribute('aria-valuemax')) node.setAttribute('aria-valuemax', '80');
    if (!node.hasAttribute('aria-valuenow')) node.setAttribute('aria-valuenow', '50');
  }

  function repairMissionTraceability(item) {
    if (!(item instanceof HTMLElement)) return;
    const button = item.querySelector('[aria-label^="Advance mission "]');
    const label = button?.getAttribute('aria-label') || '';
    const id = label.replace(/^Advance mission\s+/, '').trim();
    if (!id) return;
    const details = item.children.item(1);
    if (!(details instanceof HTMLElement)) return;

    let missionId = details.querySelector('.mission-id');
    if (!(missionId instanceof HTMLElement)) {
      missionId = document.createElement('span');
      missionId.className = 'mission-id';
      details.prepend(missionId);
    }
    if (missionId.textContent !== id) missionId.textContent = id;

    const progressbar = item.querySelector('.progress-track[role="progressbar"]');
    const progress = progressbar?.getAttribute('aria-valuenow');
    if (progress === null || progress === undefined) return;
    let progressText = details.querySelector('.mission-progress');
    if (!(progressText instanceof HTMLElement)) {
      progressText = document.createElement('span');
      progressText.className = 'mission-progress';
      details.append(progressText);
    }
    const nextText = `${progress}% complete`;
    if (progressText.textContent !== nextText) progressText.textContent = nextText;
  }

  function repairOperationsContract() {
    const mode = document.querySelector('.plant-status-ribbon > div:nth-child(2) strong');
    if (mode instanceof HTMLElement) mode.setAttribute('data-testid', 'plant-mode');
  }

  function repairCommandLabels(root) {
    const startCip = root.querySelector('[data-action="start-cip"]');
    if (startCip instanceof HTMLButtonElement && !startCip.hasAttribute('aria-label')) {
      startCip.setAttribute('aria-label', 'Start CIP');
    }
  }

  function dismissCommandPalette(event) {
    if (event.key !== 'Escape') return;
    const dialog = document.querySelector('#commandDialog');
    if (dialog instanceof HTMLDialogElement && dialog.open) dialog.close();
  }

  function repairTitle() {
    const moduleTitle = document.querySelector('#breadcrumb strong')?.textContent?.replace(/\s+/g, ' ').trim();
    if (!moduleTitle) return;
    const productId = document.documentElement.dataset.product || 'suite';
    const selectedProduct = document.querySelector('#oiaProductSelect option:checked')?.textContent?.replace(/\s+/g, ' ').trim();
    const suffix = productId === 'suite' ? SUITE_TITLE : selectedProduct || 'OIA Suite';
    document.title = `${moduleTitle} - ${suffix}`;
  }

  function scheduleTitleRepair() {
    if (titleScheduled) return;
    titleScheduled = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        titleScheduled = false;
        repairTitle();
      });
    });
  }

  function repair(root) {
    const scope = root instanceof Document || root instanceof Element ? root : document;
    scope.querySelectorAll('.progress-track').forEach(repairProgress);
    scope.querySelectorAll('.hmi-stage-scroll, .table-scroll').forEach(labelledRegion);
    scope.querySelectorAll('.split__resize').forEach(repairResizeHandle);
    scope.querySelectorAll('.queue-item').forEach(repairMissionTraceability);

    const productName = scope.querySelector('#product-name');
    if (productName instanceof HTMLElement) {
      ['aria-expanded', 'aria-selected', 'aria-pressed', 'aria-valuenow', 'aria-valuemin', 'aria-valuemax'].forEach((name) => {
        productName.removeAttribute(name);
      });
    }

    repairOperationsContract();
    repairCommandLabels(scope);
  }

  const observer = new MutationObserver(() => {
    repair(document);
    scheduleTitleRepair();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  const repairAfterInteraction = () => {
    repair(document);
    scheduleTitleRepair();
  };

  window.addEventListener('hashchange', repairAfterInteraction);
  window.addEventListener('popstate', repairAfterInteraction);
  document.addEventListener('click', repairAfterInteraction, true);
  document.addEventListener('change', repairAfterInteraction, true);
  document.addEventListener('keydown', dismissCommandPalette, true);

  repair(document);
  repairTitle();
  scheduleTitleRepair();
})();
