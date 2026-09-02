(function () {
  'use strict';

  function promoteDefinitionGrids(root) {
    root.querySelectorAll('.property-grid').forEach((grid) => {
      if (grid.tagName === 'DL') return;
      const terms = Array.from(grid.children).filter((child) => child.tagName === 'DT' || child.tagName === 'DD');
      if (!terms.length) return;

      const definitionList = document.createElement('dl');
      for (const attribute of grid.attributes) definitionList.setAttribute(attribute.name, attribute.value);
      while (grid.firstChild) definitionList.appendChild(grid.firstChild);
      grid.replaceWith(definitionList);
    });
  }

  function labelModuleButtons(root) {
    root.querySelectorAll('#moduleList .module-button[data-module]').forEach((button) => {
      const visibleLabel = button.querySelector('span')?.textContent?.trim();
      if (visibleLabel) button.setAttribute('aria-label', visibleLabel);
    });
  }

  function improveDynamicSemantics(root) {
    promoteDefinitionGrids(root);
    labelModuleButtons(root);
  }

  let queued = false;
  function queueRepair() {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      improveDynamicSemantics(document);
    });
  }

  const observer = new MutationObserver(queueRepair);
  const workspace = document.querySelector('#workspace');
  const moduleList = document.querySelector('#moduleList');
  if (workspace) observer.observe(workspace, { childList: true, subtree: true });
  if (moduleList) observer.observe(moduleList, { childList: true, subtree: true });

  improveDynamicSemantics(document);
})();
