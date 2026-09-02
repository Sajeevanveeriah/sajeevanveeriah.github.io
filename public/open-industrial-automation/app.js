(function () {
  'use strict';

  const STORAGE_KEY = 'oia-suite-workspace-v2';
  const THEME_KEY = 'oia-suite-theme-v2';
  const DENSITY_KEY = 'oia-suite-density-v2';
  const seed = window.OIA_SEED;

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const stateClass = (value) => {
    const text = String(value || '').toLowerCase();
    if (/(critical|fault|failed|overdue|held|major|bad)/.test(text)) return 'danger';
    if (/(warning|partial|review|soon|minor|planned|draft|open|medium)/.test(text)) return 'warning';
    if (/(good|healthy|complete|completed|verified|approved|released|implemented|passed|available|current|managed|normal)/.test(text)) return 'good';
    if (/(info|running|active|ready|published|scheduled|assessment)/.test(text)) return 'info';
    return 'neutral';
  };

  const prettyState = (value) => String(value || '').replaceAll('_', ' ');
  const number = (value, digits = 1) => Number(value).toLocaleString('en-AU', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const nowIso = () => new Date().toISOString();
  const timeString = () => new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Melbourne',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date());

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(seed);
      const parsed = JSON.parse(raw);
      if (parsed?.meta?.schemaVersion !== seed.meta.schemaVersion) return clone(seed);
      return parsed;
    } catch {
      return clone(seed);
    }
  }

  let state = loadState();
  let activeModule = normaliseModule(location.hash.slice(1) || 'overview');
  let activeScreenId = 'HMI-001';
  let hmiFilter = '';
  let tagFilter = '';
  let tagQualityFilter = 'All';
  let alarmFilter = 'All';
  let docsSection = 'architecture';
  let controlView = 'ST';
  let historianSeries = ['level', 'temperature'];
  let notificationDrawer = null;
  let lastSecurityScore = null;
  let renderToken = 0;

  const workspace = document.querySelector('#workspace');
  const moduleList = document.querySelector('#moduleList');
  const breadcrumb = document.querySelector('#breadcrumb');
  const moduleNav = document.querySelector('#moduleNav');
  const navToggle = document.querySelector('#navToggle');
  const navScrim = document.querySelector('#navScrim');
  const commandDialog = document.querySelector('#commandDialog');
  const commandInput = document.querySelector('#commandInput');
  const commandResults = document.querySelector('#commandResults');
  const confirmDialog = document.querySelector('#confirmDialog');
  const toastRegion = document.querySelector('#toastRegion');
  const workspaceImport = document.querySelector('#workspaceImport');
  const migrationImport = document.querySelector('#migrationImport');

  function normaliseModule(id) {
    const aliases = { demo: 'operations', studio: 'control-studio', alarms: 'alarms' };
    const candidate = aliases[id] || id;
    return seed.modules.some((module) => module.id === candidate) ? candidate : 'overview';
  }

  function icon(name, className = '') {
    const paths = {
      grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
      activity: '<path d="M3 12h4l2.3-6 4.1 12 2.2-6H21"/>',
      logic: '<path d="M4 6h5v5H4zM15 13h5v5h-5zM9 8.5h3a3 3 0 0 1 3 3V13M6.5 11v5h8.5"/>',
      screen: '<rect x="3" y="4" width="18" height="13" rx="1"/><path d="M8 21h8M12 17v4"/>',
      io: '<path d="M4 5h16M4 12h16M4 19h16M8 3v4M16 10v4M11 17v4"/>',
      alarm: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7M10 19h4"/>',
      trend: '<path d="M3 19V5M3 19h18M6 15l4-4 3 2 6-7"/>',
      gauge: '<path d="M4 18a8 8 0 1 1 16 0M12 12l4-4M7 18h10"/>',
      link: '<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"/>',
      materials: '<path d="m4 7 8-4 8 4-8 4zM4 7v10l8 4 8-4V7M8 9v4l4 2 4-2V9"/>',
      batch: '<path d="M6 3h12v4H6zM7 7v14h10V7M9 11h6M9 15h6"/>',
      wrench: '<path d="M14.5 6.5a4 4 0 0 0-5-5l2.2 2.2-3 3L6.5 4.5a4 4 0 0 0 5 5L19 17l-2 2-7.5-7.5"/>',
      check: '<path d="M4 4h16v16H4zM8 12l2.5 2.5L16 9"/>',
      shield: '<path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6zM9 12l2 2 4-5"/>',
      deploy: '<path d="M12 3v12M8 7l4-4 4 4M5 14v6h14v-6"/>',
      migrate: '<path d="M4 7h12M13 4l3 3-3 3M20 17H8M11 14l-3 3 3 3"/>',
      docs: '<path d="M5 3h10l4 4v14H5zM15 3v5h5M8 12h8M8 16h8"/>',
      settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
      search: '<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>',
      play: '<path d="m8 5 10 7-10 7z"/>',
      pause: '<path d="M8 5v14M16 5v14"/>',
      stop: '<rect x="6" y="6" width="12" height="12"/>',
      reset: '<path d="M4 12a8 8 0 1 0 2-5.3M4 4v6h6"/>',
      fault: '<path d="M12 3 2.8 20h18.4zM12 9v5M12 17h.01"/>',
      download: '<path d="M12 3v12M8 11l4 4 4-4M5 20h14"/>',
      upload: '<path d="M12 21V9M8 13l4-4 4 4M5 4h14"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      filter: '<path d="M4 5h16l-6 7v6l-4 2v-8z"/>',
      external: '<path d="M14 4h6v6M20 4l-9 9M18 13v7H4V6h7"/>',
      warning: '<path d="M12 3 2.8 20h18.4zM12 9v5M12 17h.01"/>',
      close: '<path d="m6 6 12 12M18 6 6 18"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/>',
      package: '<path d="m12 3 8 4-8 4-8-4zM4 7v10l8 4 8-4V7M12 11v10"/>',
      user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
    };
    return `<svg class="${escapeHtml(className)}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.grid}</svg>`;
  }

  function tag(value, variant) {
    return `<span class="tag ${escapeHtml(variant || stateClass(value))}">${escapeHtml(value)}</span>`;
  }

  function metric(label, value, detail, iconName, detailClass = '') {
    return `<article class="metric-card">
      <div class="metric-top"><span class="metric-label">${escapeHtml(label)}</span><span class="metric-icon">${icon(iconName)}</span></div>
      <strong>${escapeHtml(value)}</strong>
      <small class="${escapeHtml(detailClass)}">${escapeHtml(detail)}</small>
    </article>`;
  }

  function panel(title, body, options = {}) {
    const tools = options.tools || '';
    const subtitle = options.subtitle ? `<p>${escapeHtml(options.subtitle)}</p>` : '';
    const cls = options.className ? ` ${options.className}` : '';
    const bodyClass = options.flush ? 'panel-body flush' : 'panel-body';
    return `<section class="panel${cls}">
      <header class="panel-header"><div><h2>${escapeHtml(title)}</h2>${subtitle}</div><div class="panel-tools">${tools}</div></header>
      <div class="${bodyClass}">${body}</div>
    </section>`;
  }

  function pageHeader(title, description, actions = '') {
    return `<header class="page-header">
      <div class="page-header-copy"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div>
      ${actions ? `<div class="page-actions">${actions}</div>` : ''}
    </header>`;
  }

  function boundaryBanner() {
    return `<div class="boundary-banner" role="note">
      ${icon('warning')}
      <div><strong>Engineering and simulation boundary</strong><span>Commands operate the deterministic browser reference plant. Safety instrumented functions, emergency stops and qualified field control remain independent.</span></div>
      <button class="button secondary small" type="button" data-module="documentation" data-doc-target="safety">Read boundary</button>
    </div>`;
  }

  function saveState(message = 'Workspace saved locally') {
    state.meta.generatedAt = nowIso();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const status = document.querySelector('#saveStatus');
    if (status) status.textContent = message;
  }

  function addAudit(action, object, reason, source = 'OIA Suite') {
    state.auditTrail.unshift({ time: nowIso(), user: 'System engineer', action, object, reason, source });
    state.auditTrail = state.auditTrail.slice(0, 100);
  }

  function addEvent(source, event, category = 'System', user = 'System engineer') {
    state.events.unshift({ time: timeString(), source, event, category, user });
    state.events = state.events.slice(0, 120);
  }

  function showToast(title, detail, variant = 'good') {
    const toast = document.createElement('div');
    toast.className = `toast ${variant}`;
    toast.innerHTML = `<span class="toast-mark">${variant === 'danger' ? '!' : variant === 'warning' ? '!' : 'OK'}</span><div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span></div>`;
    toastRegion.append(toast);
    setTimeout(() => toast.remove(), 3600);
  }

  function downloadFile(filename, content, type = 'application/json') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function csv(rows) {
    return rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
  }

  function renderNavigation() {
    const groups = ['Operate', 'Engineer', 'Manufacture', 'Govern'];
    moduleList.innerHTML = groups.map((group) => {
      const buttons = state.modules.filter((module) => module.group === group).map((module) => `
        <button class="module-button" type="button" data-module="${escapeHtml(module.id)}" ${module.id === activeModule ? 'aria-current="page"' : ''} title="${escapeHtml(module.description)}">
          ${icon(module.icon)}
          <span>${escapeHtml(module.label)}</span>
          <small>${escapeHtml(module.id === activeModule ? 'OPEN' : '')}</small>
        </button>`).join('');
      return `<div class="module-group-label">${escapeHtml(group)}</div>${buttons}`;
    }).join('');
  }

  function navigate(moduleId, options = {}) {
    activeModule = normaliseModule(moduleId);
    if (options.docTarget) docsSection = options.docTarget;
    location.hash = activeModule;
    closeNavigation();
    render();
    requestAnimationFrame(() => workspace.focus({ preventScroll: true }));
  }

  function openNavigation() {
    moduleNav.dataset.open = 'true';
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation');
    navScrim.hidden = false;
  }

  function closeNavigation() {
    moduleNav.dataset.open = 'false';
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
    navScrim.hidden = true;
  }

  function renderOverview() {
    const activeAlarms = state.alarms.filter((alarm) => alarm.state !== 'Normal').length;
    const openWork = state.workOrders.filter((order) => order.status !== 'Complete').length;
    const pendingTests = state.tests.filter((test) => test.status !== 'Passed').length;
    const healthyConnections = state.protocols.filter((connection) => !connection.status.includes('Offline')).length;
    const lifecycle = [
      ['01', 'Define', 'Model, requirements and risk'],
      ['02', 'Engineer', 'Control, HMI, I/O and recipes'],
      ['03', 'Verify', 'FAT, SAT and traceability'],
      ['04', 'Operate', 'Production, alarms and historian'],
      ['05', 'Improve', 'Maintenance, change and release']
    ];
    const workQueue = [
      { id: 'MO-260902-01', title: 'Release next production order', meta: 'Batch and MES - high priority', module: 'batch-mes', status: state.orders[0].status },
      { id: 'WO-260902-014', title: 'Review pump vibration work order', meta: 'Maintenance - due 15:00', module: 'maintenance', status: state.workOrders[0].status },
      { id: 'BATCH-260902-018', title: 'Complete batch record review', meta: 'Validation - quality review', module: 'validation', status: state.batches[0].review },
      { id: 'SEC-008', title: 'Complete incident response procedure', meta: 'OT cybersecurity - planned control', module: 'cybersecurity', status: 'Planned' }
    ];
    const capabilities = [
      ['Control engineering', 'Structured Text, ladder, FBD and SFC workspaces'],
      ['HMI and SCADA', 'Process graphics, bindings, navigation and operator states'],
      ['Connectivity', 'OPC UA, MQTT Sparkplug, Modbus and Profinet adapter definitions'],
      ['Integration gateway', 'ERP, MES, LIMS, historian and edge contracts with queue and replay'],
      ['Batch and MES', 'Recipes, orders, batches, genealogy and review'],
      ['Materials and movement', 'Lots, warehouse moves, line supply and AMR or AGV missions'],
      ['Historian', 'Deterministic time series, events, replay context and CSV export'],
      ['OEE and reporting', 'Transparent effectiveness, losses, downtime and report catalogue'],
      ['Alarm management', 'Priorities, acknowledgement, shelving and rationalisation'],
      ['Quality and validation', 'URS to test traceability, deviations and change control'],
      ['Asset management', 'Health, work orders, calibration and criticality'],
      ['OT security', 'Zones, conduits, controls, risk and recovery'],
      ['Identity and records', 'Named roles, audit trail, checksums and review signatures'],
      ['Release engineering', 'Environment comparison, manifests, export and rollback']
    ];

    return `<div class="page">
      ${boundaryBanner()}
      <section class="overview-command">
        <div class="overview-copy">
          <h1>Operations command centre</h1>
          <p>One open engineering workspace for industrial control, HMI and SCADA, integration, batch execution, materials, OEE, historian, validation, asset care, cybersecurity and controlled release.</p>
          <div class="overview-actions">
            <button class="button primary" type="button" data-module="operations">${icon('play')} Open live operations</button>
            <button class="button" type="button" data-module="control-studio">${icon('logic')} Open control studio</button>
            <button class="button secondary" type="button" data-action="export-workspace">${icon('download')} Export workspace</button>
          </div>
        </div>
        <div class="lifecycle-map" aria-label="Automation lifecycle coverage">
          ${lifecycle.map(([index, title, detail]) => `<div class="lifecycle-step"><b>${index}</b><div><strong>${title}</strong><small>${detail}</small></div><span>READY</span></div>`).join('')}
        </div>
      </section>

      <div class="grid metrics" style="margin-top:var(--page-gap)">
        ${metric('Plant state', prettyState(state.process.state), state.process.mode === 'None' ? 'Ready for production or CIP' : `${state.process.mode} mode`, 'activity', state.process.state === 'FAULT' ? 'warning' : 'good')}
        ${metric('Active alarms', String(activeAlarms), activeAlarms ? 'Operator action required' : 'No active alarm conditions', 'alarm', activeAlarms ? 'warning' : 'good')}
        ${metric('Open work', String(openWork), `${pendingTests} validation tests not executed`, 'wrench', openWork ? 'warning' : 'good')}
        ${metric('Connected definitions', `${healthyConnections}/${state.protocols.length}`, 'All reference adapters configured', 'io', 'good')}
      </div>

      <div class="grid main-aside" style="margin-top:var(--page-gap)">
        ${panel('Work queue', `<div class="work-queue">${workQueue.map((item, index) => `<button class="queue-item" type="button" data-module="${item.module}"><span class="queue-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.meta)}</span></span>${tag(item.status)}</button>`).join('')}</div>`, { subtitle: 'Prioritised operational, engineering and quality actions' })}
        ${panel('Reference plant', `<div class="property-grid">
          <dt>Project</dt><dd>${escapeHtml(state.meta.projectId)}</dd>
          <dt>Site</dt><dd>${escapeHtml(state.meta.site)}</dd>
          <dt>Unit</dt><dd>UNIT-MIX-01</dd>
          <dt>Assets</dt><dd>${state.assets.length}</dd>
          <dt>Tags</dt><dd>${state.tags.length}</dd>
          <dt>Recipes</dt><dd>${state.recipes.length}</dd>
          <dt>Release</dt><dd>${escapeHtml(state.meta.release)}</dd>
          <dt>Licence</dt><dd>${escapeHtml(state.meta.licence)}</dd>
        </div>`, { subtitle: 'Deterministic local project model' })}
      </div>

      <div style="margin-top:var(--page-gap)">
        ${panel('Suite capability coverage', `<div class="coverage-matrix">${capabilities.map(([title, detail]) => `<div class="coverage-cell"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span></div>`).join('')}</div>`, { subtitle: 'Executable browser modules and portable engineering records', flush: false })}
      </div>
    </div>`;
  }

  function activeSequence() {
    return state.process.mode === 'CIP' ? state.cipSequence : state.sequence;
  }

  function renderOperations() {
    const process = state.process;
    const activeAlarms = state.alarms.filter((alarm) => alarm.state !== 'Normal');
    const sequence = activeSequence();
    const liquidHeight = Math.max(0, Math.min(245, 245 * process.tankLevelPct / 100));
    const pumpActive = ['CHARGE_WATER', 'CIP_PRE_RINSE', 'CIP_CAUSTIC', 'CIP_INTERMEDIATE_RINSE', 'CIP_FINAL_RINSE'].includes(process.state);
    const agitatorActive = ['MIX', 'HEAT', 'HOLD'].includes(process.state);
    const isFault = process.state === 'FAULT';
    const actions = `<button class="button secondary" type="button" data-action="export-event-log">${icon('download')} Export event log</button>`;

    const mimic = `<div class="process-mimic" role="img" aria-label="Reference mixing, dosing and clean-in-place process mimic. Text values follow below.">
      <svg viewBox="0 0 960 450" aria-hidden="true">
        <path class="mimic-pipe ${pumpActive ? 'active' : ''}" d="M55 130H280M690 275H905M155 370H470V420H800M800 420V350H680"/>
        <g transform="translate(60 82)"><rect class="mimic-equipment" width="120" height="86" rx="5"/><text class="mimic-text" x="60" y="32">PROCESS WATER</text><text class="mimic-sub" x="60" y="58">FT-101 ${number(process.flowLMin, 0)} L/min</text></g>
        <g transform="translate(55 330)"><rect class="mimic-equipment" width="130" height="78" rx="5"/><text class="mimic-text" x="65" y="30">CIP RETURN</text><text class="mimic-sub" x="65" y="54">${number(process.conductivityMSCm, 1)} mS/cm</text></g>
        <g transform="translate(238 130)"><circle class="mimic-equipment ${pumpActive ? 'active' : ''}" r="27"/><path d="M-8-12 14 0-8 12Z" fill="${pumpActive ? 'var(--accent)' : 'var(--faint)'}"/><text class="mimic-sub" y="48">P-101</text></g>
        <g><path class="mimic-vessel" d="M300 70H680V305Q680 380 605 380H375Q300 380 300 305Z"/><clipPath id="oiaTankClip"><path d="M300 70H680V305Q680 380 605 380H375Q300 380 300 305Z"/></clipPath><rect class="mimic-liquid" x="300" y="${380 - liquidHeight}" width="380" height="${liquidHeight}" clip-path="url(#oiaTankClip)"/><text class="mimic-text" x="490" y="128">TK-101 MIX TANK</text><text class="mimic-value" x="490" y="175">${number(process.tankLevelPct)} %</text><text class="mimic-sub" x="490" y="202">${number(process.temperatureC)} degC | ${number(process.pressureKPa)} kPa</text><path d="M490 42V270M450 270H530" stroke="${agitatorActive ? 'var(--accent)' : 'var(--line-strong)'}" stroke-width="8" stroke-linecap="square"/><circle class="mimic-equipment ${agitatorActive ? 'active' : ''}" cx="490" cy="37" r="26"/><text class="mimic-text" x="490" y="42">M</text><text class="mimic-sub" x="490" y="325">AG-101 ${number(process.agitatorRpm, 0)} r/min</text></g>
        <g transform="translate(810 420)"><circle class="mimic-equipment ${process.mode === 'CIP' ? 'active' : ''}" r="27"/><path d="M-8-12 14 0-8 12Z" fill="${process.mode === 'CIP' ? 'var(--accent)' : 'var(--faint)'}"/><text class="mimic-sub" y="-42">P-201</text></g>
        <g transform="translate(820 225)"><rect class="mimic-equipment ${process.state === 'TRANSFER' ? 'active' : ''}" width="120" height="96" rx="5"/><text class="mimic-text" x="60" y="38">PACKING</text><text class="mimic-sub" x="60" y="63">TRANSFER LINE</text></g>
        ${isFault ? '<g transform="translate(736 80)"><rect width="180" height="62" rx="5" fill="rgba(255,107,107,.12)" stroke="var(--danger)"/><text class="mimic-text" x="90" y="28" fill="var(--danger)">COMMUNICATION FAULT</text><text class="mimic-sub" x="90" y="46">Local control boundary retained</text></g>' : ''}
      </svg>
    </div>
    <div class="measure-grid" aria-label="Current process values">
      <div><span>Tank level</span><strong>${number(process.tankLevelPct)} %</strong></div>
      <div><span>Temperature</span><strong>${number(process.temperatureC)} degC</strong></div>
      <div><span>Flow</span><strong>${number(process.flowLMin, 0)} L/min</strong></div>
      <div><span>Conductivity</span><strong>${number(process.conductivityMSCm, 1)} mS/cm</strong></div>
      <div><span>Agitator</span><strong>${number(process.agitatorRpm, 0)} r/min</strong></div>
    </div>`;

    const commandBody = `<div class="field"><label for="operatingRole">Operating role</label><select id="operatingRole"><option>Operator</option><option selected>Engineer</option><option>Quality</option><option>Viewer</option></select></div>
      <div class="command-stack" style="margin-top:14px">
        <button class="button primary" type="button" data-action="start-production" aria-label="Start production">${icon('play')} Start production <span>OPERATOR</span></button>
        <button class="button" type="button" data-action="start-cip">${icon('play')} Start CIP <span>OPERATOR</span></button>
        <button class="button" type="button" data-action="pause-process">${icon('pause')} Pause <span>OPERATOR</span></button>
        <button class="button" type="button" data-action="stop-process">${icon('stop')} Stop <span>OPERATOR</span></button>
        <button class="button danger" type="button" data-action="inject-fault" aria-label="Inject communications fault">${icon('fault')} Inject communications fault <span>ENGINEER</span></button>
        <button class="button" type="button" data-action="reset-process">${icon('reset')} Reset process <span>ENGINEER</span></button>
      </div>
      <p class="command-message" id="commandMessage">Commands are deterministic, locally simulated and recorded in the audit trail.</p>`;

    const sequenceBody = `<div class="progress-track" aria-label="Current phase progress"><span style="width:${process.progress}%"></span></div><div class="sequence-list" style="margin-top:12px">${sequence.map((phase, index) => `<div class="sequence-row ${escapeHtml(phase.status)}"><span class="sequence-index">${String(index + 1).padStart(2, '0')}</span><div><strong>${escapeHtml(phase.name)}</strong><small>${escapeHtml(phase.target)}</small></div><span>${escapeHtml(phase.status.toUpperCase())}</span></div>`).join('')}</div>`;

    const alarmBody = activeAlarms.length ? `<div class="alarm-list">${activeAlarms.slice(0, 4).map((alarm) => `<div class="alarm-card priority-${alarm.priority.toLowerCase()}"><small class="alarm-code">${escapeHtml(alarm.id)}</small><div><strong>${escapeHtml(alarm.message)}</strong><span>${escapeHtml(alarm.state)}</span></div>${tag(alarm.priority)}</div>`).join('')}</div>` : `<div class="empty-state">${icon('alarm')}<div><strong>No active alarms</strong><span>Configured alarm definitions remain available in Alarm management.</span></div></div>`;

    return `<div class="page">
      ${pageHeader('Live operations', 'Operate the deterministic reference process, inspect phase execution, monitor process values and exercise alarm response.', actions)}
      ${boundaryBanner()}
      <div class="plant-status-ribbon">
        <div><span>Plant state</span><strong data-testid="plant-state">${escapeHtml(prettyState(process.state))}</strong></div>
        <div><span>Mode</span><strong>${escapeHtml(process.mode)}</strong></div>
        <div><span>Phase</span><strong>${escapeHtml(process.phase)}</strong></div>
        <div><span>Progress</span><strong>${number(process.progress, 0)} %</strong></div>
        <div><span>Active alarms</span><strong data-testid="active-alarm-count">${activeAlarms.length}</strong></div>
      </div>
      <div class="operations-layout">
        ${panel('Process overview', mimic, { className: 'process-panel', subtitle: 'Mixing, dosing, heating, transfer and clean-in-place', flush: true })}
        ${panel('Commands', commandBody, { className: 'command-panel', subtitle: 'Role-checked reference actions' })}
        ${panel('Live process trend', '<div class="chart-wrap"><canvas id="operationsChart" width="900" height="250" role="img" aria-label="Tank level and temperature trend. Current values are listed in the process overview."></canvas></div><div class="chart-legend"><span><i class="chart-key"></i>Tank level %</span><span><i class="chart-key temperature"></i>Temperature degC</span></div>', { className: 'trend-panel', subtitle: 'Last 60 deterministic samples' })}
        ${panel('Sequence execution', sequenceBody, { className: 'sequence-panel', subtitle: process.mode === 'CIP' ? 'Reference CIP procedure' : 'Reference production procedure' })}
        ${panel('Active alarms', alarmBody, { className: 'mini-alarm-panel', subtitle: 'Highest-priority current conditions', tools: '<button class="button small secondary" type="button" data-module="alarms">Open register</button>' })}
      </div>
    </div>`;
  }

  function lineNumbers(code) {
    return code.split('\n').map((_, index) => String(index + 1)).join('\n');
  }

  function renderLogicCanvas(view) {
    if (view === 'LD') {
      return `<div class="logic-canvas" role="img" aria-label="Ladder diagram with two rungs. Text description follows in the inspector.">
        <div class="logic-rung"><i class="logic-rail"></i><div class="logic-contact active">StartProduction</div><div class="logic-contact active">TankLevel &lt; 85%</div><span></span><div class="logic-coil active">PumpCommand</div><i class="logic-rail"></i></div>
        <div class="logic-rung"><i class="logic-rail"></i><div class="logic-contact">StopRequest</div><div class="logic-contact">NOT</div><span></span><div class="logic-coil">PumpCommand</div><i class="logic-rail"></i></div>
      </div>`;
    }
    if (view === 'FBD') {
      return `<div class="logic-canvas" role="img" aria-label="Function block diagram for pump permissive logic.">
        <div style="display:grid;grid-template-columns:160px 120px 160px;align-items:center;gap:55px;min-height:360px">
          <div class="logic-block active">AND<br><small>StartProduction<br>TankLevel &lt; 85%</small></div>
          <div class="logic-block">SELECT<br><small>StopRequest</small></div>
          <div class="logic-block active">PumpCommand<br><small>BOOL output</small></div>
        </div>
      </div>`;
    }
    if (view === 'SFC') {
      const steps = ['Idle', 'Charge water', 'Dose concentrate', 'Mix', 'Heat', 'Hold', 'Transfer'];
      return `<div class="logic-canvas" role="img" aria-label="Sequential function chart for the production procedure."><div style="display:grid;place-items:center;gap:8px;padding:18px">${steps.map((step, index) => `<div class="logic-block ${index === 1 && state.process.state === 'CHARGE_WATER' ? 'active' : ''}" style="width:230px">${escapeHtml(step)}</div>${index < steps.length - 1 ? '<div style="height:22px;width:2px;background:#71878d"></div>' : ''}`).join('')}</div></div>`;
    }
    return `<div class="editor-shell"><div class="line-numbers" aria-hidden="true">${lineNumbers(state.controlProgram.code)}</div><textarea id="controlEditor" class="code-editor" spellcheck="false" aria-label="Structured Text program editor">${escapeHtml(state.controlProgram.code)}</textarea></div>`;
  }

  function renderControlStudio() {
    const program = state.controlProgram;
    const languageTabs = ['ST', 'LD', 'FBD', 'SFC'].map((item) => `<button type="button" data-control-view="${item}" aria-pressed="${controlView === item}">${item}</button>`).join('');
    const output = program.diagnostics.length
      ? program.diagnostics.map((item) => `<div class="output-line ${item.level === 'Error' ? 'error' : ''}"><b>${escapeHtml(item.level)}</b><span>${escapeHtml(item.message)}</span></div>`).join('')
      : '<div class="output-line"><b>Ready</b><span>Validate the program or run one deterministic scan.</span></div>';
    const tree = [
      ['Project', state.meta.projectId],
      ['Programs', 'PRG_MixingUnit'],
      ['Function blocks', 'FB_AnalogueAlarm'],
      ['Data types', 'UDT_EquipmentState'],
      ['Global variables', 'GVL_Process'],
      ['I/O mapping', 'CELL-MIX-01'],
      ['Tasks', 'Cyclic 100 ms'],
      ['Tests', '12 control tests']
    ];
    const actions = `<button class="button secondary" type="button" data-action="export-control-program">${icon('download')} Export program</button>`;
    return `<div class="page">
      ${pageHeader('Control studio', 'Create and verify portable control logic using Structured Text, ladder diagram, function block diagram and sequential function chart views.', actions)}
      ${boundaryBanner()}
      <section class="control-studio">
        <aside class="studio-sidebar" aria-label="Control project tree">
          <div class="studio-title"><strong>Control project</strong><span>${escapeHtml(state.meta.projectId)} / ${escapeHtml(program.version)}</span></div>
          <div class="project-tree">${tree.map(([label, detail], index) => `<button class="tree-row ${index === 1 ? 'selected' : ''}" type="button">${icon(index === 1 ? 'logic' : 'docs')}<span>${escapeHtml(label)} - ${escapeHtml(detail)}</span></button>`).join('')}</div>
        </aside>
        <section class="studio-main" aria-label="Control editor">
          <div class="studio-toolbar">
            <div class="segmented" aria-label="Programming view">${languageTabs}</div>
            <button class="button small" type="button" data-action="validate-program">${icon('check')} Validate program</button>
            <button class="button small primary" type="button" data-action="run-scan">${icon('play')} Run one scan</button>
            <span class="toolbar-spacer"></span>
            ${tag(program.lastValidation, program.lastValidation === 'Validation passed' ? 'good' : 'neutral')}
          </div>
          ${renderLogicCanvas(controlView)}
          <div class="studio-output" aria-live="polite">${output}</div>
        </section>
        <aside class="studio-inspector" aria-label="Program inspector">
          <div class="studio-title"><strong>Program inspector</strong><span>${escapeHtml(program.name)}</span></div>
          <section class="inspector-section"><h3>Properties</h3><dl class="property-grid"><dt>Language</dt><dd>${escapeHtml(controlView)}</dd><dt>Version</dt><dd>${escapeHtml(program.version)}</dd><dt>Task</dt><dd>Cyclic 100 ms</dd><dt>Priority</dt><dd>10</dd><dt>Watchdog</dt><dd>80 ms</dd><dt>Scans</dt><dd>${program.scans}</dd></dl></section>
          <section class="inspector-section"><h3>Runtime values</h3><dl class="property-grid"><dt>StartProduction</dt><dd>${state.process.mode === 'Production'}</dd><dt>StopRequest</dt><dd>${state.process.state === 'IDLE'}</dd><dt>TankLevelPct</dt><dd>${number(state.process.tankLevelPct)}</dd><dt>PumpCommand</dt><dd>${state.tags.find((tagItem) => tagItem.id === 'P-101.CMD')?.value || false}</dd></dl></section>
          <section class="inspector-section"><h3>Text equivalent</h3><p style="font-size:.65rem;line-height:1.55;margin:0">The program starts the water pump when production is requested, no stop request is active and tank level remains below 85 percent. A stop request always removes the command.</p></section>
        </aside>
      </section>
    </div>`;
  }

  function filteredHmiScreens() {
    const term = hmiFilter.trim().toLowerCase();
    return state.hmiScreens.filter((screen) => `${screen.name} ${screen.type} ${screen.route}`.toLowerCase().includes(term));
  }

  function hmiPreview(screen) {
    if (!screen) return '<div class="empty-state"><div><strong>No screen selected</strong><span>Select a screen from the library.</span></div></div>';
    const mode = screen.id === 'HMI-002' ? 'CIP' : state.process.mode;
    const leftName = screen.id === 'HMI-002' ? 'CIP SUPPLY' : 'PROCESS WATER';
    const rightName = screen.id === 'HMI-002' ? 'CIP RETURN' : 'PACKING LINE';
    return `<div class="hmi-stage">
      <header class="hmi-stage-header"><strong>${escapeHtml(screen.name)}</strong><span>${escapeHtml(screen.route)} | ${escapeHtml(screen.status)}</span></header>
      <div class="hmi-process-preview">
        <div class="hmi-preview-grid">
          <div class="preview-equipment"><div><strong>${leftName}</strong><span>${screen.id === 'HMI-002' ? '72.0 degC' : `${number(state.process.flowLMin, 0)} L/min`}</span></div></div>
          <div class="preview-equipment tank"><div><strong>${screen.id === 'HMI-002' ? 'CIP-201' : 'TK-101'}</strong><span>${screen.id === 'HMI-002' ? `${number(state.process.conductivityMSCm)} mS/cm` : `${number(state.process.tankLevelPct)} %`}</span></div></div>
          <div class="preview-equipment"><div><strong>${rightName}</strong><span>${mode === 'None' ? 'READY' : escapeHtml(mode.toUpperCase())}</span></div></div>
        </div>
      </div>
      <footer class="hmi-stage-footer"><div><span>Plant state</span><strong>${escapeHtml(prettyState(state.process.state))}</strong></div><div><span>Active mode</span><strong>${escapeHtml(state.process.mode)}</strong></div><div><span>Alarms</span><strong>${state.alarms.filter((alarm) => alarm.state !== 'Normal').length}</strong></div><div><span>Role</span><strong>ENGINEER</strong></div></footer>
    </div>`;
  }

  function renderHmiStudio() {
    const screens = filteredHmiScreens();
    if (!screens.some((screen) => screen.id === activeScreenId) && screens.length) activeScreenId = screens[0].id;
    const selected = state.hmiScreens.find((screen) => screen.id === activeScreenId);
    const bindings = state.hmiBindings;
    const actions = `<button class="button secondary" type="button" data-action="export-hmi-package">${icon('download')} Export HMI package</button>`;
    return `<div class="page">
      ${pageHeader('HMI studio', 'Build operator screens from reusable process objects, bound tags, navigation routes and deterministic preview states.', actions)}
      ${boundaryBanner()}
      <section class="hmi-studio-layout">
        <aside class="hmi-screen-list" aria-label="HMI screen library">
          <div class="studio-title"><strong>Screen library</strong><span>${state.hmiScreens.length} screens</span></div>
          <div class="hmi-list-filter"><label class="field"><span class="sr-only">Filter screens</span><input id="hmiFilter" type="search" placeholder="Filter screens" value="${escapeHtml(hmiFilter)}"></label></div>
          <div id="hmiScreenRows">${screens.length ? screens.map((screen) => `<button class="screen-row ${screen.id === activeScreenId ? 'selected' : ''}" type="button" data-screen-id="${escapeHtml(screen.id)}" aria-label="Open screen ${escapeHtml(screen.name)}"><strong>${escapeHtml(screen.name)} screen</strong><span>${escapeHtml(screen.type)} | ${escapeHtml(screen.status)} | ${screen.bindings} bindings</span></button>`).join('') : '<div class="empty-state"><div><strong>No matching screens</strong><span>Clear the filter to show the full library.</span></div></div>'}</div>
        </aside>
        <section class="hmi-canvas-shell" aria-label="HMI canvas">
          <div class="hmi-toolbar"><button class="button small" type="button" data-action="hmi-preview-idle">Idle state</button><button class="button small" type="button" data-action="hmi-preview-running">Running state</button><button class="button small danger" type="button" data-action="hmi-preview-fault">Fault state</button><span style="margin-left:auto">${selected ? tag(selected.status) : ''}</span></div>
          <div class="hmi-stage-scroll">${hmiPreview(selected)}</div>
        </section>
        <aside class="hmi-inspector" aria-label="HMI bindings inspector">
          <div class="studio-title"><strong>Binding inspector</strong><span>${bindings.length} visible bindings</span></div>
          ${bindings.map((binding) => `<div class="binding-row"><strong>${escapeHtml(binding.element)}</strong><span>${escapeHtml(binding.property)} | ${escapeHtml(binding.quality)}</span><code>${escapeHtml(binding.tag)} -> ${escapeHtml(binding.expression)}</code></div>`).join('')}
          <section class="inspector-section"><h3>Navigation integrity</h3><dl class="property-grid"><dt>Routes</dt><dd>${selected?.navigation || 0}</dd><dt>Broken links</dt><dd>0</dd><dt>Bindings</dt><dd>${selected?.bindings || 0}</dd><dt>Preview</dt><dd>Deterministic</dd></dl></section>
        </aside>
      </section>
    </div>`;
  }

  function filteredTags() {
    const term = tagFilter.trim().toLowerCase();
    return state.tags.filter((item) => {
      const matchesText = `${item.id} ${item.description} ${item.asset} ${item.source} ${item.address}`.toLowerCase().includes(term);
      const matchesQuality = tagQualityFilter === 'All' || item.quality === tagQualityFilter;
      return matchesText && matchesQuality;
    });
  }

  function renderTagsIo() {
    const rows = filteredTags();
    const directionCounts = state.tags.reduce((acc, item) => {
      acc[item.direction] = (acc[item.direction] || 0) + 1;
      return acc;
    }, {});
    const actions = `<button class="button secondary" type="button" data-action="export-tag-database">${icon('download')} Export tag database</button>`;
    const tagTable = `<div class="filter-row">
      <div class="field grow"><label for="tagFilter">Search tags</label><input id="tagFilter" type="search" value="${escapeHtml(tagFilter)}" placeholder="Tag, asset, source or address"></div>
      <div class="field"><label for="tagQualityFilter">Quality</label><select id="tagQualityFilter"><option ${tagQualityFilter === 'All' ? 'selected' : ''}>All</option><option ${tagQualityFilter === 'Good' ? 'selected' : ''}>Good</option><option ${tagQualityFilter === 'Bad' ? 'selected' : ''}>Bad</option><option ${tagQualityFilter === 'Uncertain' ? 'selected' : ''}>Uncertain</option></select></div>
      <button class="button" type="button" data-action="simulate-tag-quality">${icon('fault')} Simulate quality change</button>
    </div>
    <div class="table-scroll"><table class="data-table" style="min-width:1080px"><thead><tr><th>Tag</th><th>Description</th><th>Asset</th><th>Type</th><th>I/O</th><th>Value</th><th>Quality</th><th>Source</th><th>Address</th><th>Scan</th><th>Alarm</th></tr></thead><tbody>${rows.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(item.description)}</td><td>${escapeHtml(item.asset)}</td><td>${escapeHtml(item.type)}</td><td>${escapeHtml(item.direction)}</td><td class="mono">${escapeHtml(typeof item.value === 'boolean' ? String(item.value) : item.value)} ${item.unit === '-' ? '' : escapeHtml(item.unit)}</td><td>${tag(item.quality)}</td><td>${escapeHtml(item.source)}</td><td class="mono">${escapeHtml(item.address)}</td><td>${item.scanMs} ms</td><td>${escapeHtml(item.alarm)}</td></tr>`).join('')}</tbody></table></div>
    <div class="table-note">${rows.length} of ${state.tags.length} tags shown. Wide tables scroll within this panel without expanding the page.</div>`;

    const protocolTable = `<div class="table-scroll"><table class="data-table" style="min-width:820px"><thead><tr><th>Connection</th><th>Protocol</th><th>Endpoint</th><th>Mode</th><th>Security</th><th>Status</th><th>Latency</th><th></th></tr></thead><tbody>${state.protocols.map((item) => `<tr><td>${escapeHtml(item.name)}<br><small class="mono">${escapeHtml(item.id)}</small></td><td>${escapeHtml(item.protocol)}</td><td class="mono">${escapeHtml(item.endpoint)}</td><td>${escapeHtml(item.mode)}</td><td>${escapeHtml(item.security)}</td><td>${tag(item.status)}</td><td>${item.latencyMs} ms</td><td class="actions-cell"><button class="button small secondary" type="button" data-action="test-connection" data-id="${escapeHtml(item.id)}">Test</button></td></tr>`).join('')}</tbody></table></div>`;

    const hierarchy = `<div class="hierarchy-map" aria-label="Equipment hierarchy">${state.hierarchy.map((item) => `<div class="hierarchy-node"><small>${escapeHtml(item.level)}</small><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.id)}</span></div>`).join('')}</div>`;

    return `<div class="page">
      ${pageHeader('Tags and I/O', 'Configure the portable tag database, signal scaling, I/O mapping, equipment hierarchy and open protocol adapter definitions.', actions)}
      <div class="grid metrics">
        ${metric('Configured tags', String(state.tags.length), `${directionCounts.AI || 0} analogue inputs, ${directionCounts.DI || 0} digital inputs`, 'io', 'good')}
        ${metric('Good quality', String(state.tags.filter((item) => item.quality === 'Good').length), 'Quality evaluated on every scan', 'check', state.tags.some((item) => item.quality !== 'Good') ? 'warning' : 'good')}
        ${metric('Protocol definitions', String(state.protocols.length), 'OPC UA, MQTT, Modbus and Profinet', 'activity', 'good')}
        ${metric('Fastest scan', `${Math.min(...state.tags.map((item) => item.scanMs))} ms`, 'Reference browser scan classification', 'clock', 'good')}
      </div>
      <div class="section-stack" style="margin-top:var(--page-gap)">
        ${panel('Equipment hierarchy', hierarchy, { subtitle: 'Enterprise through control-module structure' })}
        ${panel('Tag database', tagTable, { subtitle: 'Engineering definitions, values, quality and alarm associations', flush: false })}
        ${panel('Protocol adapters', protocolTable, { subtitle: 'Browser-safe definitions for deployable edge connectors', flush: true })}
      </div>
    </div>`;
  }

  function activeAlarmRows() {
    return state.alarms.filter((alarm) => alarmFilter === 'All' || alarm.state === alarmFilter || alarm.priority === alarmFilter);
  }

  function renderAlarmManagement() {
    const rows = activeAlarmRows();
    const active = state.alarms.filter((alarm) => alarm.state !== 'Normal');
    const unack = active.filter((alarm) => alarm.state === 'Active unacknowledged').length;
    const shelved = active.filter((alarm) => alarm.state === 'Shelved').length;
    const critical = active.filter((alarm) => alarm.priority === 'Critical').length;
    const actions = `<button class="button secondary" type="button" data-action="export-alarm-register">${icon('download')} Export register</button>`;
    const table = `<div class="filter-row"><div class="field"><label for="alarmFilter">View</label><select id="alarmFilter"><option ${alarmFilter === 'All' ? 'selected' : ''}>All</option><option ${alarmFilter === 'Active unacknowledged' ? 'selected' : ''}>Active unacknowledged</option><option ${alarmFilter === 'Active acknowledged' ? 'selected' : ''}>Active acknowledged</option><option ${alarmFilter === 'Shelved' ? 'selected' : ''}>Shelved</option><option ${alarmFilter === 'Critical' ? 'selected' : ''}>Critical</option><option ${alarmFilter === 'High' ? 'selected' : ''}>High</option></select></div><button class="button danger" type="button" data-action="inject-fault" aria-label="Inject communications fault">${icon('fault')} Inject reference alarm</button></div>
      <div class="table-scroll"><table class="data-table" style="min-width:1120px"><thead><tr><th>Alarm</th><th>Priority</th><th>State</th><th>Message</th><th>Limit</th><th>Consequence</th><th>Operator response</th><th>Owner</th><th>Actions</th></tr></thead><tbody>${rows.map((alarm) => `<tr><td>${escapeHtml(alarm.id)}<br><small>${escapeHtml(alarm.tag)}</small></td><td>${tag(alarm.priority)}</td><td>${tag(alarm.state)}</td><td>${escapeHtml(alarm.message)}</td><td>${escapeHtml(alarm.limit)} / ${escapeHtml(alarm.delay)}</td><td>${escapeHtml(alarm.consequence)}</td><td>${escapeHtml(alarm.response)}</td><td>${escapeHtml(alarm.owner)}</td><td class="actions-cell">${alarm.state === 'Active unacknowledged' ? `<button class="button small good" type="button" data-action="ack-alarm" data-id="${escapeHtml(alarm.id)}" aria-label="Acknowledge alarm ${escapeHtml(alarm.id)}">Acknowledge</button>` : ''}${alarm.state === 'Active acknowledged' ? `<button class="button small" type="button" data-action="shelve-alarm" data-id="${escapeHtml(alarm.id)}" aria-label="Shelve alarm ${escapeHtml(alarm.id)}">Shelve</button> <button class="button small secondary" type="button" data-action="clear-alarm" data-id="${escapeHtml(alarm.id)}" aria-label="Clear alarm ${escapeHtml(alarm.id)}">Clear</button>` : ''}${alarm.state === 'Shelved' ? `<button class="button small" type="button" data-action="unshelve-alarm" data-id="${escapeHtml(alarm.id)}" aria-label="Unshelve alarm ${escapeHtml(alarm.id)}">Unshelve</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`;
    const timeline = `<div class="timeline">${state.alarmEvents.slice(0, 8).map((event) => `<div class="timeline-row"><span class="timeline-time">${escapeHtml(event.time)}</span><span class="timeline-line"></span><div class="timeline-content"><strong>${escapeHtml(event.alarm)} - ${escapeHtml(event.transition)}</strong><span>${escapeHtml(event.user)} | ${escapeHtml(event.comment)}</span></div></div>`).join('')}</div>`;
    const rationalisation = `<div class="work-queue">${state.alarms.map((alarm) => `<div class="queue-item"><span class="queue-index">${escapeHtml(alarm.priority.slice(0, 1))}</span><span><strong>${escapeHtml(alarm.id)} - ${escapeHtml(alarm.message)}</strong><span>${escapeHtml(alarm.consequence)} | Response: ${escapeHtml(alarm.response)}</span></span>${tag(alarm.lifecycle)}</div>`).join('')}</div>`;

    return `<div class="page">
      ${pageHeader('Alarm management', 'Manage priorities, states, acknowledgement, shelving, rationalisation and chronological alarm evidence.', actions)}
      <div class="alarm-kpi">
        <div><span>Active</span><strong>${active.length}</strong><small>All non-normal states</small></div>
        <div><span>Unacknowledged</span><strong>${unack}</strong><small>Needs operator attention</small></div>
        <div><span>Critical</span><strong>${critical}</strong><small>Highest consequence</small></div>
        <div><span>Shelved</span><strong>${shelved}</strong><small>Temporarily suppressed display</small></div>
        <div><span>Rationalised</span><strong>${state.alarms.filter((alarm) => alarm.lifecycle === 'Rationalised').length}/${state.alarms.length}</strong><small>Documented consequence and response</small></div>
      </div>
      <div class="section-stack" style="margin-top:var(--page-gap)">
        ${panel('Alarm register', table, { subtitle: 'Lifecycle state, consequence and response definitions' })}
        <div class="grid two">
          ${panel('Chronological event trail', timeline, { subtitle: 'State transitions and attribution' })}
          ${panel('Rationalisation register', rationalisation, { subtitle: 'Documented alarm intent and response' })}
        </div>
      </div>
    </div>`;
  }

  function renderHistorian() {
    const actions = `<button class="button secondary" type="button" data-action="export-historian-csv">${icon('download')} Export CSV</button>`;
    const seriesOptions = [
      ['level', 'Tank level'],
      ['temperature', 'Temperature'],
      ['flow', 'Flow'],
      ['conductivity', 'Conductivity']
    ];
    const qualityRows = state.tags.slice(0, 6).map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${tag(item.quality)}</td><td>60</td><td>0</td><td>${item.scanMs} ms</td><td>${escapeHtml(item.unit)}</td></tr>`).join('');
    const eventRows = state.events.slice(0, 12).map((event) => `<tr><td>${escapeHtml(event.time)}</td><td>${escapeHtml(event.source)}</td><td>${escapeHtml(event.category)}</td><td>${escapeHtml(event.event)}</td><td>${escapeHtml(event.user)}</td></tr>`).join('');
    return `<div class="page">
      ${pageHeader('Historian and analytics', 'Inspect deterministic time-series data, process events, quality flags and portable records without an external service.', actions)}
      <div class="grid metrics">
        ${metric('Samples retained', String(state.trend.length * 4), 'Four process series in the local reference set', 'database', 'good')}
        ${metric('Quality coverage', '100.0 %', 'No gaps in current deterministic window', 'check', 'good')}
        ${metric('Event records', String(state.events.length), 'Operations, alarm, validation and release events', 'activity', 'good')}
        ${metric('Window', '60 s', 'One-second reference samples', 'clock', 'good')}
      </div>
      <div class="section-stack" style="margin-top:var(--page-gap)">
        ${panel('Interactive trend', `<div class="filter-row"><div class="segmented" aria-label="Trend series">${seriesOptions.map(([id, label]) => `<button type="button" data-trend-series="${id}" aria-pressed="${historianSeries.includes(id)}">${escapeHtml(label)}</button>`).join('')}</div><button class="button small" type="button" data-action="append-trend-sample">Append sample</button></div><div class="chart-wrap"><canvas id="historianChart" width="1100" height="300" role="img" aria-label="Selected historian series. A tabular quality summary follows."></canvas></div><div class="chart-legend">${seriesOptions.filter(([id]) => historianSeries.includes(id)).map(([id, label]) => `<span><i class="chart-key ${id}"></i>${escapeHtml(label)}</span>`).join('')}</div>`, { subtitle: 'Select up to four deterministic process series' })}
        <div class="grid two">
          ${panel('Series quality', `<div class="table-scroll"><table class="data-table"><thead><tr><th>Tag</th><th>Quality</th><th>Samples</th><th>Gaps</th><th>Source scan</th><th>Unit</th></tr></thead><tbody>${qualityRows}</tbody></table></div>`, { subtitle: 'Coverage and sampling summary', flush: true })}
          ${panel('Event sequence', `<div class="table-scroll"><table class="data-table" style="min-width:620px"><thead><tr><th>Time</th><th>Source</th><th>Category</th><th>Event</th><th>User</th></tr></thead><tbody>${eventRows}</tbody></table></div>`, { subtitle: 'Chronological operating context', flush: true })}
        </div>
      </div>
    </div>`;
  }


  function renderPerformance() {
    const oee = state.oee;
    const calculation = (oee.availabilityPct * oee.performancePct * oee.qualityPct) / 10000;
    const downtime = state.downtimeReasons.reduce((sum, item) => sum + item.durationMin, 0);
    const actions = `<button class="button primary" type="button" data-action="recalculate-oee">${icon('gauge')} Recalculate OEE</button><button class="button secondary" type="button" data-action="export-oee-report">${icon('download')} Export report</button>`;
    const downtimeTable = `<div class="table-scroll"><table class="data-table"><thead><tr><th>Reason</th><th>Category</th><th>Duration</th><th>Occurrences</th><th>Owner</th><th>Contribution</th></tr></thead><tbody>${state.downtimeReasons.map((item) => `<tr><td>${escapeHtml(item.reason)}<br><small class="mono">${escapeHtml(item.id)}</small></td><td>${tag(item.category)}</td><td>${number(item.durationMin, 1)} min</td><td>${item.count}</td><td>${escapeHtml(item.owner)}</td><td>${number(item.durationMin / Math.max(0.1, downtime) * 100, 1)} %</td></tr>`).join('')}</tbody></table></div>`;
    const reportRows = `<div class="table-scroll"><table class="data-table"><thead><tr><th>Report</th><th>Scope</th><th>Cadence</th><th>Status</th></tr></thead><tbody>${state.reports.map((item) => `<tr><td>${escapeHtml(item.name)}<br><small class="mono">${escapeHtml(item.id)}</small></td><td>${escapeHtml(item.scope)}</td><td>${escapeHtml(item.cadence)}</td><td>${tag(item.status)}</td></tr>`).join('')}</tbody></table></div>`;
    return `<div class="page">
      ${pageHeader('OEE and reporting', 'Calculate equipment effectiveness from transparent source values, classify downtime and prepare shift, batch, alarm and utility reports.', actions)}
      <div class="grid metrics">
        ${metric('Availability', `${number(oee.availabilityPct, 1)} %`, `${number(oee.runMinutes, 1)} of ${number(oee.plannedMinutes, 0)} planned minutes`, 'activity', oee.availabilityPct >= 90 ? 'good' : 'warning')}
        ${metric('Performance', `${number(oee.performancePct, 1)} %`, `${number(oee.idealCycleS, 0)} s ideal cycle`, 'gauge', oee.performancePct >= 90 ? 'good' : 'warning')}
        ${metric('Quality', `${number(oee.qualityPct, 1)} %`, `${oee.goodCount} of ${oee.totalCount} good units`, 'check', 'good')}
        ${metric('OEE', `${number(calculation, 1)} %`, `Target ${number(oee.targetPct, 0)} %`, 'trend', calculation >= oee.targetPct ? 'good' : 'warning')}
      </div>
      <div class="grid main-aside" style="margin-top:var(--page-gap)">
        ${panel('Effectiveness calculation', `<div style="display:grid;grid-template-columns:minmax(180px,.6fr) minmax(0,1fr);gap:24px;align-items:center"><div class="score-ring" style="--score:${calculation}" data-testid="oee-value"><div><strong>${number(calculation, 1)}%</strong><span>current OEE</span></div></div><div><h3 style="margin:0 0 12px">Availability x performance x quality</h3><p style="margin:0 0 16px">${number(oee.availabilityPct, 1)}% x ${number(oee.performancePct, 1)}% x ${number(oee.qualityPct, 1)}% = <strong>${number(calculation, 1)}%</strong>.</p><div class="measure-grid" style="grid-template-columns:repeat(4,minmax(0,1fr))"><div><span>Planned time</span><strong>${number(oee.plannedMinutes, 0)} min</strong></div><div><span>Run time</span><strong>${number(oee.runMinutes, 1)} min</strong></div><div><span>Downtime</span><strong>${number(downtime, 1)} min</strong></div><div><span>Good count</span><strong>${oee.goodCount}</strong></div></div></div></div>`, { subtitle: `Period: ${oee.period}; transparent deterministic calculation` })}
        ${panel('Loss model', `<div class="health-list"><div class="health-row"><strong>Availability loss</strong><div class="health-bar"><span class="warning" style="width:${100 - oee.availabilityPct}%"></span></div><em>${number(100 - oee.availabilityPct, 1)}%</em></div><div class="health-row"><strong>Speed loss</strong><div class="health-bar"><span class="warning" style="width:${100 - oee.performancePct}%"></span></div><em>${number(100 - oee.performancePct, 1)}%</em></div><div class="health-row"><strong>Quality loss</strong><div class="health-bar"><span style="width:${100 - oee.qualityPct}%"></span></div><em>${number(100 - oee.qualityPct, 1)}%</em></div></div>`, { subtitle: 'Losses separated for corrective action' })}
      </div>
      <div class="section-stack" style="margin-top:var(--page-gap)">
        ${panel('Downtime classification', downtimeTable, { subtitle: 'Duration, frequency, ownership and contribution', flush: true })}
        ${panel('Production report catalogue', reportRows, { subtitle: 'Portable reporting definitions', flush: true })}
      </div>
    </div>`;
  }

  function renderIntegration() {
    const healthy = state.interfaces.filter((item) => item.state === 'Healthy').length;
    const queued = state.interfaces.reduce((sum, item) => sum + item.queued, 0);
    const actions = `<button class="button secondary" type="button" data-action="export-interface-register">${icon('download')} Export interface register</button>`;
    const interfaceTable = `<div class="table-scroll"><table class="data-table" style="min-width:1100px"><thead><tr><th>Interface</th><th>Source</th><th>Target</th><th>Transport</th><th>Contract</th><th>Direction</th><th>State</th><th>Queued</th><th>Last message</th><th></th></tr></thead><tbody>${state.interfaces.map((item) => `<tr><td>${escapeHtml(item.name)}<br><small class="mono">${escapeHtml(item.id)}</small></td><td>${escapeHtml(item.source)}</td><td>${escapeHtml(item.target)}</td><td>${escapeHtml(item.transport)}</td><td>${escapeHtml(item.contract)}</td><td>${escapeHtml(item.direction)}</td><td>${tag(item.state)}</td><td>${item.queued}</td><td>${escapeHtml(item.lastMessage)}</td><td><button class="button small secondary" type="button" data-action="test-interface" data-id="${escapeHtml(item.id)}" aria-label="Test interface ${escapeHtml(item.id)}">Test</button></td></tr>`).join('')}</tbody></table></div>`;
    const messageTable = `<div class="table-scroll"><table class="data-table" style="min-width:880px"><thead><tr><th>Message</th><th>Interface</th><th>Correlation</th><th>Object</th><th>Received</th><th>Status</th><th>Attempts</th><th></th></tr></thead><tbody>${state.interfaceMessages.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(item.interface)}</td><td class="mono">${escapeHtml(item.correlation)}</td><td>${escapeHtml(item.object)}</td><td>${escapeHtml(item.received)}</td><td>${tag(item.status)}</td><td>${item.attempts}</td><td>${item.status === 'Validation error' ? `<button class="button small primary" type="button" data-action="replay-interface" data-id="${escapeHtml(item.id)}" aria-label="Replay message ${escapeHtml(item.id)}">Replay</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`;
    return `<div class="page">
      ${pageHeader('Integration gateway', 'Orchestrate equipment-to-enterprise information exchange through explicit contracts, correlation IDs, validation, retries and reconciliation.', actions)}
      ${boundaryBanner()}
      <div class="grid metrics">
        ${metric('Interfaces healthy', `${healthy}/${state.interfaces.length}`, 'Controller, broker, historian, MES, ERP and quality boundaries', 'link', healthy === state.interfaces.length ? 'good' : 'warning')}
        ${metric('Queued messages', String(queued), 'Visible and never silently discarded', 'database', queued ? 'warning' : 'good')}
        ${metric('Contracts', String(new Set(state.interfaces.map((item) => item.contract)).size), 'Versioned payload and semantic definitions', 'docs', 'good')}
        ${metric('Correlation coverage', '100.0 %', 'Every reference transaction has an identifier', 'check', 'good')}
      </div>
      <div class="section-stack" style="margin-top:var(--page-gap)">
        ${panel('Interface architecture', `<div class="trace-map" role="img" aria-label="Enterprise to industrial integration flow. A tabular interface register follows."><div class="trace-node"><small>LEVEL 4</small><strong>ERP and LIMS</strong><span>Orders, master data and quality results</span></div><span class="trace-arrow">-></span><div class="trace-node"><small>LEVEL 3</small><strong>MES integration services</strong><span>Validation, correlation, retry and reconciliation</span></div><span class="trace-arrow">-></span><div class="trace-node"><small>LEVEL 2</small><strong>Historian and SCADA</strong><span>State, events, telemetry and commands</span></div><span class="trace-arrow">-></span><div class="trace-node"><small>LEVEL 1</small><strong>Edge and controls</strong><span>OPC UA, MQTT Sparkplug, Modbus and Profinet</span></div></div>`, { subtitle: 'Contracts isolate business systems from deterministic control' })}
        ${panel('Interface register', interfaceTable, { subtitle: 'Endpoints, transport, contracts, queue and health', flush: true })}
        ${panel('Message and replay queue', messageTable, { subtitle: 'No ambiguous or failed transaction is silently dropped', flush: true })}
      </div>
    </div>`;
  }

  function renderMaterials() {
    const inTransit = state.materialMovements.filter((item) => item.status === 'In transit').length;
    const held = state.materials.filter((item) => item.status === 'Held').length;
    const actions = `<button class="button secondary" type="button" data-action="export-material-register">${icon('download')} Export material register</button>`;
    const materialTable = `<div class="table-scroll"><table class="data-table" style="min-width:950px"><thead><tr><th>Lot</th><th>Material</th><th>Type</th><th>Quantity</th><th>Location</th><th>Status</th><th>Expiry</th><th>Supplier lot</th></tr></thead><tbody>${state.materials.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.type)}</td><td>${escapeHtml(item.quantity)}</td><td>${escapeHtml(item.location)}</td><td>${tag(item.status)}</td><td>${escapeHtml(item.expiry)}</td><td>${escapeHtml(item.supplierLot)}</td></tr>`).join('')}</tbody></table></div>`;
    const movementTable = `<div class="table-scroll"><table class="data-table" style="min-width:980px"><thead><tr><th>Movement</th><th>Material</th><th>From</th><th>To</th><th>Quantity</th><th>Method</th><th>Status</th><th>Verification</th></tr></thead><tbody>${state.materialMovements.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(item.material)}</td><td>${escapeHtml(item.from)}</td><td>${escapeHtml(item.to)}</td><td>${escapeHtml(item.quantity)}</td><td>${escapeHtml(item.method)}</td><td>${tag(item.status)}</td><td>${escapeHtml(item.verification)}</td></tr>`).join('')}</tbody></table></div>`;
    const missions = `<div class="work-queue">${state.mobileTasks.map((item, index) => `<div class="queue-item"><span class="queue-index">${String(index + 1).padStart(2, '0')}</span><div><strong>${escapeHtml(item.mission)}</strong><span>${escapeHtml(item.vehicle)} | ${escapeHtml(item.source)} to ${escapeHtml(item.destination)}</span><div class="progress-track" style="margin-top:8px"><span style="width:${item.progress}%"></span></div></div>${tag(item.state)}<button class="button small" type="button" data-action="advance-movement" data-id="${escapeHtml(item.id)}" aria-label="Advance mission ${escapeHtml(item.id)}">Advance</button></div>`).join('')}</div>`;
    return `<div class="page">
      ${pageHeader('Materials and movement', 'Control material status, lot identity, warehouse location, line supply, genealogy and mobile-equipment missions.', actions)}
      <div class="grid metrics">
        ${metric('Released lots', String(state.materials.filter((item) => item.status === 'Released').length), `${state.materials.length} material and utility records`, 'materials', 'good')}
        ${metric('Held lots', String(held), held ? 'Quarantine status blocks allocation' : 'No material holds', 'pause', held ? 'warning' : 'good')}
        ${metric('Movements active', String(inTransit), `${state.materialMovements.length} traceable movements`, 'migrate', inTransit ? 'info' : 'good')}
        ${metric('Mobile missions', String(state.mobileTasks.length), `${state.mobileTasks.filter((item) => item.state === 'Executing').length} executing`, 'activity', 'good')}
      </div>
      <div class="section-stack" style="margin-top:var(--page-gap)">
        ${panel('Material and lot register', materialTable, { subtitle: 'Identity, quantity, location, release and supplier traceability', flush: true })}
        ${panel('Material movements', movementTable, { subtitle: 'Source, destination, quantity, method and verification', flush: true })}
        ${panel('Mobile material-supply missions', missions, { subtitle: 'Vendor-neutral AMR and AGV task orchestration' })}
      </div>
    </div>`;
  }

  function renderIdentity() {
    const pending = state.electronicRecords.filter((item) => item.state === 'Pending review').length;
    const actions = `<button class="button secondary" type="button" data-action="export-audit-package">${icon('download')} Export audit package</button>`;
    const roles = `<div class="table-scroll"><table class="data-table" style="min-width:760px"><thead><tr><th>Role</th><th>Operate</th><th>Engineer</th><th>Recipes</th><th>Quality</th><th>Security</th></tr></thead><tbody>${state.users.map((item) => `<tr><td>${escapeHtml(item.role)}</td><td>${escapeHtml(item.operate)}</td><td>${escapeHtml(item.engineer)}</td><td>${escapeHtml(item.recipes)}</td><td>${escapeHtml(item.quality)}</td><td>${escapeHtml(item.security)}</td></tr>`).join('')}</tbody></table></div>`;
    const records = `<div class="table-scroll"><table class="data-table" style="min-width:1000px"><thead><tr><th>Record</th><th>Type</th><th>Object</th><th>Version</th><th>State</th><th>Checksum</th><th>Retention</th><th>Signatures</th><th></th></tr></thead><tbody>${state.electronicRecords.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(item.type)}</td><td>${escapeHtml(item.object)}</td><td>${escapeHtml(item.version)}</td><td>${tag(item.state)}</td><td class="mono">${escapeHtml(item.checksum)}</td><td>${escapeHtml(item.retention)}</td><td>${item.signatures}</td><td>${item.state === 'Pending review' ? `<button class="button small primary" type="button" data-action="sign-record" data-id="${escapeHtml(item.id)}" aria-label="Sign record ${escapeHtml(item.id)}">Review and sign</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`;
    const signatures = `<div class="timeline">${state.signatures.map((item) => `<div class="timeline-row"><span class="timeline-time">${escapeHtml(item.time.slice(11, 19))}</span><span class="timeline-line"></span><div class="timeline-content"><strong>${escapeHtml(item.record)} | ${escapeHtml(item.meaning)}</strong><span>${escapeHtml(item.user)} | ${escapeHtml(item.time)}</span></div></div>`).join('')}</div>`;
    const audit = `<div class="table-scroll"><table class="data-table" style="min-width:1000px"><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Object</th><th>Reason</th><th>Source</th></tr></thead><tbody>${state.auditTrail.slice(0, 20).map((item) => `<tr><td class="mono">${escapeHtml(item.time)}</td><td>${escapeHtml(item.user)}</td><td>${escapeHtml(item.action)}</td><td>${escapeHtml(item.object)}</td><td>${escapeHtml(item.reason)}</td><td>${escapeHtml(item.source)}</td></tr>`).join('')}</tbody></table></div>`;
    return `<div class="page">
      ${pageHeader('Identity and records', 'Apply named-role boundaries, preserve attributable audit trails and exercise electronic record review without claiming regulated compliance.', actions)}
      <div class="grid metrics">
        ${metric('Named roles', String(state.users.length), 'Viewer through administrator permission model', 'user', 'good')}
        ${metric('Electronic records', String(state.electronicRecords.length), 'Version, checksum and retention metadata', 'docs', 'good')}
        ${metric('Pending review', String(pending), pending ? 'A controlled review action is available' : 'No pending electronic records', 'check', pending ? 'warning' : 'good')}
        ${metric('Audit events', String(state.auditTrail.length), 'Chronological, attributable and reason-coded local records', 'activity', 'good')}
      </div>
      <div class="section-stack" style="margin-top:var(--page-gap)">
        ${panel('Role and permission matrix', roles, { subtitle: 'Reference least-privilege boundaries', flush: true })}
        ${panel('Electronic record register', records, { subtitle: 'Readiness workflow only; configured-system validation remains required', flush: true })}
        <div class="grid two">${panel('Electronic signatures', signatures, { subtitle: 'Identity, meaning, record and timestamp' })}${panel('Record-control boundary', `<div class="boundary-banner" style="margin:0"><div><strong>No compliance claim</strong><span>The hosted suite demonstrates attributable review concepts. Production use requires enterprise identity, independent audit storage, procedural controls, retention, validation and applicable regulatory assessment.</span></div></div>`, { subtitle: 'Explicit intended-use limitation' })}</div>
        ${panel('Attributable audit trail', audit, { subtitle: 'Local actions, objects, reasons and sources', flush: true })}
      </div>
    </div>`;
  }

  function renderBatchMes() {
    const running = state.orders.filter((order) => order.status === 'Running').length;
    const held = state.orders.filter((order) => order.status === 'Held').length;
    const pendingReview = state.batches.filter((batch) => batch.review !== 'Released').length;
    const actions = `<button class="button secondary" type="button" data-action="export-batch-record">${icon('download')} Export batch record</button>`;
    const orders = `<div class="table-scroll"><table class="data-table" style="min-width:900px"><thead><tr><th>Order</th><th>Product</th><th>Quantity</th><th>Start</th><th>Line</th><th>Recipe</th><th>Material lot</th><th>Priority</th><th>Status</th><th></th></tr></thead><tbody>${state.orders.map((order) => `<tr><td>${escapeHtml(order.id)}</td><td>${escapeHtml(order.product)}</td><td>${escapeHtml(order.quantity)}</td><td>${escapeHtml(order.plannedStart)}</td><td>${escapeHtml(order.line)}</td><td>${escapeHtml(order.recipe)}</td><td>${escapeHtml(order.materialLot)}</td><td>${tag(order.priority)}</td><td>${tag(order.status)}</td><td class="actions-cell">${order.status === 'Ready' ? `<button class="button small primary" type="button" data-action="release-order" data-id="${escapeHtml(order.id)}" aria-label="Release order ${escapeHtml(order.id)}">Release</button>` : order.status === 'Running' ? `<button class="button small" type="button" data-action="complete-order" data-id="${escapeHtml(order.id)}" aria-label="Complete order ${escapeHtml(order.id)}">Complete</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`;
    const recipes = `<div class="recipe-board">${state.recipes.map((recipe) => `<div class="recipe-row"><div><strong>${escapeHtml(recipe.name)}</strong><small>${escapeHtml(recipe.id)} v${escapeHtml(recipe.version)}</small></div><span>${recipe.phases} phases</span><span>${recipe.parameters} parameters</span><span>${escapeHtml(recipe.yield)}</span>${tag(recipe.state)}</div>`).join('')}</div>`;
    const batches = `<div class="table-scroll"><table class="data-table" style="min-width:900px"><thead><tr><th>Batch</th><th>Order</th><th>Recipe version</th><th>Unit</th><th>Started</th><th>Ended</th><th>Yield</th><th>Lot</th><th>Review</th></tr></thead><tbody>${state.batches.map((batch) => `<tr><td>${escapeHtml(batch.id)}</td><td>${escapeHtml(batch.order)}</td><td>${escapeHtml(batch.recipe)}</td><td>${escapeHtml(batch.unit)}</td><td>${escapeHtml(batch.started)}</td><td>${escapeHtml(batch.ended)}</td><td>${escapeHtml(batch.yield)}</td><td>${escapeHtml(batch.lot)}</td><td>${tag(batch.review)}</td></tr>`).join('')}</tbody></table></div>`;
    const genealogy = `<div class="table-scroll"><table class="data-table"><thead><tr><th>Input lot</th><th>Material or status</th><th>Quantity</th><th>Output lot</th><th>Verification</th></tr></thead><tbody>${state.genealogy.map((item) => `<tr><td>${escapeHtml(item.input)}</td><td>${escapeHtml(item.material)}</td><td>${escapeHtml(item.quantity)}</td><td>${escapeHtml(item.output)}</td><td>${tag(item.verification, 'good')}</td></tr>`).join('')}</tbody></table></div>`;

    return `<div class="page">
      ${pageHeader('Batch and MES', 'Coordinate versioned recipes, production orders, batch execution records, material genealogy and quality review.', actions)}
      <div class="grid metrics">
        ${metric('Orders running', String(running), `${state.orders.length} orders in the reference schedule`, 'batch', running ? 'good' : '')}
        ${metric('Orders held', String(held), held ? 'Release condition requires review' : 'No production holds', 'pause', held ? 'warning' : 'good')}
        ${metric('Approved recipes', String(state.recipes.filter((recipe) => recipe.state === 'Approved').length), `${state.recipes.length} versioned master recipes`, 'docs', 'good')}
        ${metric('Pending batch review', String(pendingReview), 'Electronic review workflow simulated locally', 'check', pendingReview ? 'warning' : 'good')}
      </div>
      <div class="section-stack" style="margin-top:var(--page-gap)">
        ${panel('Production orders', orders, { subtitle: 'Order release, priority, recipe and material allocation', flush: true })}
        <div class="grid two">
          ${panel('Master recipes', recipes, { subtitle: 'Version state, phases and parameters' })}
          ${panel('Material genealogy', genealogy, { subtitle: 'Input lots, process status and finished output', flush: true })}
        </div>
        ${panel('Batch production records', batches, { subtitle: 'Execution history, yields, lots and review state', flush: true })}
      </div>
    </div>`;
  }

  function renderMaintenance() {
    const healthRows = state.assets.map((asset) => `<div class="health-row"><strong>${escapeHtml(asset.id)}</strong><div class="health-bar" title="${asset.health} percent health"><span class="${asset.health < 85 ? 'warning' : ''}" style="width:${asset.health}%"></span></div><em>${asset.health}%</em></div>`).join('');
    const orders = `<div class="table-scroll"><table class="data-table" style="min-width:900px"><thead><tr><th>Work order</th><th>Asset</th><th>Type</th><th>Title</th><th>Priority</th><th>Status</th><th>Due</th><th>Owner</th><th></th></tr></thead><tbody>${state.workOrders.map((order) => `<tr><td>${escapeHtml(order.id)}</td><td>${escapeHtml(order.asset)}</td><td>${escapeHtml(order.type)}</td><td>${escapeHtml(order.title)}</td><td>${tag(order.priority)}</td><td>${tag(order.status)}</td><td>${escapeHtml(order.due)}</td><td>${escapeHtml(order.owner)}</td><td class="actions-cell">${order.status !== 'Complete' ? `<button class="button small good" type="button" data-action="complete-work-order" data-id="${escapeHtml(order.id)}" aria-label="Complete work order ${escapeHtml(order.id)}">Complete</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`;
    const calibration = `<div class="table-scroll"><table class="data-table"><thead><tr><th>Instrument</th><th>Range</th><th>Last calibration</th><th>Next due</th><th>Reference</th><th>Result</th></tr></thead><tbody>${state.calibrations.map((item) => `<tr><td>${escapeHtml(item.instrument)}</td><td>${escapeHtml(item.range)}</td><td>${escapeHtml(item.last)}</td><td>${escapeHtml(item.next)}</td><td>${escapeHtml(item.standard)}</td><td>${tag(item.result)}</td></tr>`).join('')}</tbody></table></div>`;
    const actions = `<button class="button" type="button" data-action="create-work-order">${icon('plus')} Create reference work order</button>`;
    return `<div class="page">
      ${pageHeader('Maintenance', 'Manage asset health, criticality, corrective and preventive work, calibration status and equipment history.', actions)}
      <div class="grid metrics">
        ${metric('Asset availability', '100.0 %', `${state.assets.length} reference assets available`, 'activity', 'good')}
        ${metric('Open work orders', String(state.workOrders.filter((item) => item.status !== 'Complete').length), 'Corrective, preventive and calibration work', 'wrench', 'warning')}
        ${metric('Lowest health', `${Math.min(...state.assets.map((asset) => asset.health))} %`, 'P-201 requires investigation', 'trend', 'warning')}
        ${metric('Calibration due', String(state.calibrations.filter((item) => item.result !== 'Pass').length), 'TT-101 due within this week', 'clock', 'warning')}
      </div>
      <div class="grid main-aside" style="margin-top:var(--page-gap)">
        ${panel('Work order register', orders, { subtitle: 'Prioritised asset work and close-out', flush: true })}
        ${panel('Asset health', `<div class="health-list">${healthRows}</div>`, { subtitle: 'Deterministic reference indicators' })}
      </div>
      <div style="margin-top:var(--page-gap)">${panel('Calibration register', calibration, { subtitle: 'Instrument range, due date and traceable reference', flush: true })}</div>
    </div>`;
  }

  function renderValidation() {
    const passed = state.tests.filter((test) => test.status === 'Passed').length;
    const coverage = state.requirements.filter((req) => req.design && req.test).length;
    const actions = `<button class="button secondary" type="button" data-action="export-validation-package">${icon('download')} Export validation package</button><button class="button" type="button" data-action="execute-all-tests">${icon('check')} Execute all tests</button>`;
    const trace = `<div class="table-scroll"><div class="trace-map">${state.requirements.map((req) => {
      const test = state.tests.find((item) => item.id === req.test);
      return `<div class="trace-row"><div class="trace-node"><strong>${escapeHtml(req.id)}</strong><span>${escapeHtml(req.statement)}</span></div><i class="trace-arrow"></i><div class="trace-node"><strong>${escapeHtml(req.design)}</strong><span>Design specification</span></div><i class="trace-arrow"></i><div class="trace-node"><strong>${escapeHtml(req.test)}</strong><span>${escapeHtml(test?.title || 'Test')}</span></div><i class="trace-arrow"></i><div class="trace-node"><strong>${escapeHtml(test?.status || 'Not executed')}</strong><span>${escapeHtml(test?.evidence || '-')}</span></div></div>`;
    }).join('')}</div></div>`;
    const tests = `<div class="table-scroll"><table class="data-table" style="min-width:980px"><thead><tr><th>Test</th><th>Type</th><th>Requirement</th><th>Title</th><th>Expected result</th><th>Status</th><th>Evidence</th><th></th></tr></thead><tbody>${state.tests.map((test) => `<tr><td>${escapeHtml(test.id)}</td><td>${escapeHtml(test.type)}</td><td>${escapeHtml(test.requirement)}</td><td>${escapeHtml(test.title)}</td><td>${escapeHtml(test.expected)}</td><td>${tag(test.status)}</td><td>${escapeHtml(test.evidence)}</td><td class="actions-cell">${test.status !== 'Passed' ? `<button class="button small primary" type="button" data-action="execute-test" data-id="${escapeHtml(test.id)}" aria-label="Execute test ${escapeHtml(test.id)}">Execute</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`;
    const deviations = `<div class="table-scroll"><table class="data-table"><thead><tr><th>Deviation</th><th>Title</th><th>Severity</th><th>Batch</th><th>Status</th><th>Owner</th><th>Opened</th></tr></thead><tbody>${state.deviations.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(item.title)}</td><td>${tag(item.severity)}</td><td>${escapeHtml(item.batch)}</td><td>${tag(item.status)}</td><td>${escapeHtml(item.owner)}</td><td>${escapeHtml(item.opened)}</td></tr>`).join('')}</tbody></table></div>`;
    const changes = `<div class="table-scroll"><table class="data-table"><thead><tr><th>Change</th><th>Title</th><th>Impact</th><th>Risk</th><th>Status</th><th>Owner</th></tr></thead><tbody>${state.changes.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(item.title)}</td><td>${escapeHtml(item.impact)}</td><td>${tag(item.risk)}</td><td>${tag(item.status)}</td><td>${escapeHtml(item.owner)}</td></tr>`).join('')}</tbody></table></div>`;
    const audit = `<div class="table-scroll"><table class="data-table" style="min-width:760px"><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Object</th><th>Reason</th><th>Source</th></tr></thead><tbody>${state.auditTrail.slice(0, 16).map((item) => `<tr><td>${escapeHtml(item.time)}</td><td>${escapeHtml(item.user)}</td><td>${escapeHtml(item.action)}</td><td>${escapeHtml(item.object)}</td><td>${escapeHtml(item.reason)}</td><td>${escapeHtml(item.source)}</td></tr>`).join('')}</tbody></table></div>`;
    return `<div class="page">
      ${pageHeader('Validation and quality', 'Maintain requirements, design links, executable tests, traceability, deviations, change control and attributable audit evidence.', actions)}
      <div class="grid metrics">
        ${metric('Requirements covered', `${coverage}/${state.requirements.length}`, 'Every requirement links to design and test', 'check', coverage === state.requirements.length ? 'good' : 'warning')}
        ${metric('Tests passed', `${passed}/${state.tests.length}`, passed === state.tests.length ? 'Current evidence set complete' : 'Execute remaining verification tests', 'activity', passed === state.tests.length ? 'good' : 'warning')}
        ${metric('Open deviations', String(state.deviations.filter((item) => item.status !== 'Closed').length), 'Risk-based review required', 'fault', 'warning')}
        ${metric('Active changes', String(state.changes.filter((item) => item.status !== 'Implemented').length), 'Impact assessment and controlled implementation', 'migrate', 'warning')}
      </div>
      <div class="section-stack" style="margin-top:var(--page-gap)">
        ${panel('Traceability matrix', trace, { subtitle: 'User requirement to design, test and evidence' })}
        ${panel('Verification tests', tests, { subtitle: 'Executable local evidence workflow', flush: true })}
        <div class="grid two">${panel('Deviation register', deviations, { subtitle: 'Quality events and review state', flush: true })}${panel('Change control', changes, { subtitle: 'Impact, risk and release state', flush: true })}</div>
        ${panel('Attributable audit trail', audit, { subtitle: 'Chronological local record of actions and reasons', flush: true })}
      </div>
    </div>`;
  }

  function computeSecurityScore() {
    const weights = { Implemented: 1, Partial: 0.5, Planned: 0 };
    const total = state.securityControls.reduce((sum, item) => sum + (weights[item.status] ?? 0), 0);
    return Math.round((total / state.securityControls.length) * 100);
  }

  function renderCybersecurity() {
    const score = lastSecurityScore ?? computeSecurityScore();
    const actions = `<button class="button primary" type="button" data-action="run-security-assessment">${icon('shield')} Run posture assessment</button><button class="button secondary" type="button" data-action="export-security-model">${icon('download')} Export security model</button>`;
    const topology = `<div class="table-scroll"><div class="security-topology" role="img" aria-label="OT security topology from enterprise zone through industrial DMZ, operations, cell control and field I/O. The zone register follows.">${state.zones.map((zone) => `<div class="security-zone"><small>LEVEL ${escapeHtml(zone.level)}</small><strong>${escapeHtml(zone.name)}</strong><span>${zone.assets} assets<br>${escapeHtml(zone.trust)}<br>${escapeHtml(zone.controls.join(', '))}</span></div>`).join('')}</div></div>`;
    const controls = `<div class="table-scroll"><table class="data-table" style="min-width:900px"><thead><tr><th>Control</th><th>Domain</th><th>Requirement</th><th>Status</th><th>Evidence</th><th></th></tr></thead><tbody>${state.securityControls.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(item.domain)}</td><td>${escapeHtml(item.control)}</td><td>${tag(item.status)}</td><td>${escapeHtml(item.evidence)}</td><td class="actions-cell">${item.status !== 'Implemented' ? `<button class="button small" type="button" data-action="advance-security-control" data-id="${escapeHtml(item.id)}">Advance</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`;
    const risks = `<div class="table-scroll"><table class="data-table"><thead><tr><th>Risk</th><th>Scenario</th><th>Likelihood</th><th>Consequence</th><th>Score</th><th>Treatment</th><th>Status</th></tr></thead><tbody>${state.risks.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(item.scenario)}</td><td>${item.likelihood}</td><td>${item.consequence}</td><td>${tag(item.score, item.score >= 12 ? 'danger' : item.score >= 8 ? 'warning' : 'good')}</td><td>${escapeHtml(item.treatment)}</td><td>${tag(item.status)}</td></tr>`).join('')}</tbody></table></div>`;
    const roles = `<div class="table-scroll"><table class="data-table" style="min-width:720px"><thead><tr><th>Role</th><th>Operate</th><th>Engineer</th><th>Recipes</th><th>Quality</th><th>Security</th></tr></thead><tbody>${state.users.map((item) => `<tr><td>${escapeHtml(item.role)}</td><td>${escapeHtml(item.operate)}</td><td>${escapeHtml(item.engineer)}</td><td>${escapeHtml(item.recipes)}</td><td>${escapeHtml(item.quality)}</td><td>${escapeHtml(item.security)}</td></tr>`).join('')}</tbody></table></div>`;
    return `<div class="page">
      ${pageHeader('OT cybersecurity', 'Model industrial zones and conduits, least-privilege roles, security controls, operational risks and recovery evidence.', actions)}
      <div class="grid main-aside">
        ${panel('Zones and conduits', topology, { subtitle: 'Reference segmentation from enterprise to field control' })}
        ${panel('Security posture', `<div style="display:grid;place-items:center;gap:18px;padding:12px"><div class="score-ring" style="--score:${score}" data-testid="security-score"><div><strong>${score}%</strong><span>reference posture</span></div></div><p style="max-width:260px;margin:0;text-align:center;font-size:.68rem;line-height:1.55">This score describes completion of the reference control register. It is not a certification or live vulnerability assessment.</p></div>`, { subtitle: 'Local control-register completion' })}
      </div>
      <div class="section-stack" style="margin-top:var(--page-gap)">
        ${panel('Security controls', controls, { subtitle: 'People, process and technology safeguards', flush: true })}
        <div class="grid two">${panel('OT risk register', risks, { subtitle: 'Likelihood, consequence and treatment', flush: true })}${panel('Role matrix', roles, { subtitle: 'Least-privilege reference permissions', flush: true })}</div>
        ${panel('Conduit register', `<div class="table-scroll"><table class="data-table"><thead><tr><th>Conduit</th><th>From</th><th>To</th><th>Services</th><th>Direction</th><th>Protection</th><th>Status</th></tr></thead><tbody>${state.conduits.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(item.from)}</td><td>${escapeHtml(item.to)}</td><td>${escapeHtml(item.services)}</td><td>${escapeHtml(item.direction)}</td><td>${escapeHtml(item.protectedBy)}</td><td>${tag(item.status)}</td></tr>`).join('')}</tbody></table></div>`, { subtitle: 'Approved inter-zone communication paths', flush: true })}
      </div>
    </div>`;
  }

  function renderDeployment() {
    const actions = `<button class="button primary" type="button" data-action="build-release-package">${icon('package')} Build release package</button><button class="button secondary" type="button" data-action="export-release-manifest">${icon('download')} Export manifest</button>`;
    const pipeline = `<div class="table-scroll"><div class="release-pipeline" aria-label="Release pipeline">${[
      ['01', 'Model validation', 'PASS'],
      ['02', 'Logic tests', 'PASS'],
      ['03', 'Rendered QA', 'PASS'],
      ['04', 'Security review', 'PASS'],
      ['05', 'Package manifest', 'READY'],
      ['06', 'Controlled deploy', 'READY']
    ].map(([index, title, status]) => `<div class="pipeline-step"><b>${index}</b><strong>${escapeHtml(title)}</strong><span>${escapeHtml(status)}</span></div>`).join('')}</div></div>`;
    const envTable = `<div class="table-scroll"><table class="data-table" style="min-width:820px"><thead><tr><th>Environment</th><th>Version</th><th>Configuration</th><th>Status</th><th>Drift</th><th>Deployed</th><th></th></tr></thead><tbody>${state.environments.map((item) => `<tr><td>${escapeHtml(item.name)}<br><small class="mono">${escapeHtml(item.id)}</small></td><td>${escapeHtml(item.version)}</td><td>${escapeHtml(item.config)}</td><td>${tag(item.status)}</td><td>${tag(`${item.drift} differences`, item.drift === 0 ? 'good' : 'warning')}</td><td>${escapeHtml(item.deployed)}</td><td class="actions-cell"><button class="button small secondary" type="button" data-action="compare-environment" data-id="${escapeHtml(item.id)}">Compare</button></td></tr>`).join('')}</tbody></table></div>`;
    const diffs = [
      ['tags.TT-101.alarmHigh', '74.0', '75.0', 'Approved change CC-260829-01'],
      ['recipes.RCP-PROD-002.state', 'Draft', 'Draft', 'No drift'],
      ['security.remoteAccess', 'Partial', 'Partial', 'Control SEC-004'],
      ['runtime.scanMs', '100', '100', 'No drift']
    ];
    const diffBody = `<div class="diff-list">${diffs.map(([key, source, target, note]) => `<div class="diff-row"><code>${escapeHtml(key)}</code><span>${escapeHtml(source)}</span><span>${escapeHtml(target)}</span>${tag(note === 'No drift' ? note : 'Reviewed', note === 'No drift' ? 'good' : 'warning')}</div>`).join('')}</div>`;
    const releases = `<div class="table-scroll"><table class="data-table"><thead><tr><th>Release</th><th>Version</th><th>Environment</th><th>Commit</th><th>Manifest</th><th>Status</th><th>Deployed</th><th>Rollback</th></tr></thead><tbody>${state.releases.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(item.version)}</td><td>${escapeHtml(item.environment)}</td><td class="mono">${escapeHtml(item.commit)}</td><td>${escapeHtml(item.manifest)}</td><td>${tag(item.status)}</td><td>${escapeHtml(item.deployed)}</td><td>${escapeHtml(item.rollback)}</td></tr>`).join('')}</tbody></table></div>`;
    return `<div class="page">
      ${pageHeader('Deployment centre', 'Compare environments, validate packages, generate portable manifests and retain explicit rollback references.', actions)}
      ${boundaryBanner()}
      <div class="grid metrics">
        ${metric('Current release', state.meta.release, 'Reference production environment', 'deploy', 'good')}
        ${metric('Configuration drift', '0', 'Reference production matches approved manifest', 'check', 'good')}
        ${metric('Rollback points', String(state.releases.filter((item) => item.status === 'Rollback').length), 'Previous verified package retained', 'reset', 'good')}
        ${metric('Package status', 'READY', 'Model, UI, data and documentation included', 'package', 'good')}
      </div>
      <div class="section-stack" style="margin-top:var(--page-gap)">
        ${panel('Release pipeline', pipeline, { subtitle: 'Deterministic gates from project model to controlled deployment' })}
        <div class="grid main-aside">${panel('Environment register', envTable, { subtitle: 'Version, configuration and drift status', flush: true })}${panel('Configuration comparison', diffBody, { subtitle: 'Selected high-impact values' })}</div>
        ${panel('Release history', releases, { subtitle: 'Manifest, commit and rollback lineage', flush: true })}
      </div>
    </div>`;
  }

  function renderMigration() {
    const totals = state.migrationScreens.reduce((acc, item) => {
      acc.buttons += Number(item.buttons) || 0;
      acc.bindings += Number(item.bindings) || 0;
      acc.scripts += Number(item.scripts) || 0;
      acc.navigation += Number(item.navigation) || 0;
      return acc;
    }, { buttons: 0, bindings: 0, scripts: 0, navigation: 0 });
    const actions = `<button class="button" type="button" data-action="open-migration-import">${icon('upload')} Import screen register</button><button class="button secondary" type="button" data-action="export-migration-register">${icon('download')} Export register</button>`;
    const table = `<div class="table-scroll"><table class="data-table" style="min-width:1050px"><thead><tr><th>Screen</th><th>Name</th><th>Source</th><th>Target</th><th>Buttons</th><th>Bindings</th><th>Scripts</th><th>Navigation</th><th>Status</th><th>Notes</th><th></th></tr></thead><tbody>${state.migrationScreens.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.source)}</td><td>${escapeHtml(item.target)}</td><td>${item.buttons}</td><td>${item.bindings}</td><td>${item.scripts}</td><td>${item.navigation}</td><td>${tag(item.status)}</td><td>${escapeHtml(item.notes)}</td><td class="actions-cell">${item.status !== 'Verified' ? `<button class="button small" type="button" data-action="advance-migration-screen" data-id="${escapeHtml(item.id)}">Advance</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`;
    const checklist = [
      ['Interactive elements inventoried', 'Buttons, inputs, dynamos and click targets'],
      ['Tag bindings reconciled', 'Current and historical references included'],
      ['Navigation graph verified', 'Routes, pop-ups and return paths tested'],
      ['Script dependencies classified', 'Required, replaceable or retired'],
      ['Element identity preserved', 'IDs, groups and association-sensitive coordinates'],
      ['Visual and functional parity checked', 'Rendered screen against source behaviour'],
      ['Evidence attached', 'Screenshots, test results and reviewer notes'],
      ['Rollback retained', 'Original assets remain available until release acceptance']
    ];
    const checklistBody = `<div class="work-queue">${checklist.map(([title, detail], index) => `<div class="queue-item"><span class="queue-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span></span>${tag(index < 5 ? 'Checked' : 'Required', index < 5 ? 'good' : 'warning')}</div>`).join('')}</div>`;
    return `<div class="page">
      ${pageHeader('Migration workbench', 'Inventory and reconcile legacy screens, tag bindings, scripts, navigation and functional evidence before controlled replacement.', actions)}
      <div class="migration-summary">
        <div><span>Screens</span><strong>${state.migrationScreens.length}</strong></div>
        <div><span>Buttons</span><strong>${totals.buttons}</strong></div>
        <div><span>Bindings</span><strong>${totals.bindings}</strong></div>
        <div><span>Script dependencies</span><strong>${totals.scripts}</strong></div>
      </div>
      <div class="section-stack" style="margin-top:var(--page-gap)">
        ${panel('Migration register', table, { subtitle: 'Screen-level source, target, dependency and verification state', flush: true })}
        <div class="grid two">${panel('Controlled migration checklist', checklistBody, { subtitle: 'Behaviour preservation and evidence requirements' })}${panel('Navigation coverage', `<div class="chart-wrap"><canvas id="migrationChart" width="700" height="250" role="img" aria-label="Navigation, buttons, bindings and scripts by migrated screen. Exact counts are in the migration register."></canvas></div><div class="chart-legend"><span><i class="chart-key"></i>Bindings</span><span><i class="chart-key temperature"></i>Buttons</span><span><i class="chart-key flow"></i>Navigation</span></div>`, { subtitle: 'Dependency density by screen' })}</div>
      </div>
    </div>`;
  }

  function docsContent(section) {
    const capabilityItems = [
      ['Operations and SCADA', 'Deterministic HMI, process mimic, role-labelled commands, sequence states, process values and events.', 'Executable browser module'],
      ['Control engineering', 'Structured Text editor plus ladder, FBD and SFC representations with validation and one-scan execution.', 'Executable reference module'],
      ['HMI engineering', 'Screen inventory, bindings, navigation, preview states and portable package export.', 'Executable reference module'],
      ['Tag and I/O engineering', 'Equipment hierarchy, tag database, scaling metadata, quality and protocol adapter definitions.', 'Executable reference module'],
      ['Integration gateway', 'ERP, MES, LIMS, historian and edge contracts with correlation, queue visibility, test and controlled replay.', 'Executable reference module'],
      ['Alarm lifecycle', 'Priority, state, acknowledgement, shelving, rationalisation and event history.', 'Executable reference module'],
      ['Historian and analytics', 'Time-series visualisation, quality summary, event sequence, replay context and CSV export.', 'Executable reference module'],
      ['OEE and reporting', 'Availability, performance, quality, downtime classification and report catalogue with transparent calculations.', 'Executable reference module'],
      ['Batch and MES', 'Master recipes, orders, batches, genealogy, release state and review workflow.', 'Executable reference module'],
      ['Materials and movement', 'Lot status, location, movement verification, line supply and vendor-neutral AMR or AGV mission orchestration.', 'Executable reference module'],
      ['Maintenance', 'Asset health, work orders, criticality and calibration register.', 'Executable reference module'],
      ['Validation and quality', 'Requirements, tests, traceability, deviations, change control and audit trail.', 'Executable reference module'],
      ['OT cybersecurity', 'Zones, conduits, control register, risk assessment and backup workflow.', 'Executable reference module'],
      ['Identity and records', 'Named role matrix, attributable audit trails, checksummed records and electronic review concepts.', 'Executable reference module'],
      ['Deployment', 'Environment comparison, release gates, manifest generation, export and rollback lineage.', 'Executable reference module'],
      ['Migration', 'Screen, binding, navigation and script inventory with controlled progression and CSV exchange.', 'Executable reference module'],
      ['Field connectivity', 'OPC UA, MQTT Sparkplug, Modbus and Profinet connector definitions for implementation by edge runtimes.', 'Adapter contract'],
      ['Safety functions', 'Emergency stops, guards, interlocks, safe motion and safety instrumented functions.', 'Outside browser boundary']
    ];
    const sections = {
      architecture: `<h2>System architecture</h2><p>The suite separates portable engineering intent from runtime integration. The browser application contains the reference project model, local deterministic simulator, engineering tools, manufacturing records and governance evidence. A production implementation adds qualified edge connectors, controller runtimes, databases and identity services behind reviewed interfaces.</p>
        <div class="architecture-stack">
          <div class="architecture-layer"><strong>Level 4</strong><span>ERP and enterprise logistics integrations through approved information-exchange contracts</span></div>
          <div class="architecture-layer"><strong>Level 3</strong><span>Batch and MES, materials, OEE, quality, historian, maintenance, reporting and manufacturing operations</span></div>
          <div class="architecture-layer"><strong>Level 2</strong><span>SCADA and HMI, supervisory sequences, alarms, trends and operator workflows</span></div>
          <div class="architecture-layer"><strong>Level 1</strong><span>PLC or DCS control logic, remote I/O, drives, instruments and protocol gateways</span></div>
          <div class="architecture-layer"><strong>Level 0</strong><span>Physical process, equipment, actuators and sensors</span></div>
          <div class="architecture-layer" style="border-left-color:var(--warning)"><strong>Safety</strong><span>Independent safety-related controls, emergency stops, guards and hazardous-energy isolation</span></div>
        </div>
        <h2>Portable project model</h2><p><code>model.json</code> is the suite's machine-readable source of truth for hierarchy, assets, tags, alarms, recipes, requirements, tests, protocol definitions and release metadata. Workspace export adds local execution state and audit records. Data can be inspected and versioned without the UI.</p>
        <h2>Runtime boundary</h2><p>Web browsers cannot and should not directly replace deterministic PLC or DCS runtimes. Production adapters must enforce authentication, authorisation, message validation, rate limits, protocol-specific safety constraints, network segmentation, time synchronisation, audit logging and tested fail-safe behaviour.</p>`,
      capabilities: `<h2>Capability matrix</h2><p>Each domain is explicitly classified to prevent a polished reference interface from being mistaken for a certified production runtime.</p><div class="capability-grid">${capabilityItems.map(([title, detail, maturity]) => `<div class="capability-item"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span><small>${escapeHtml(maturity.toUpperCase())}</small></div>`).join('')}</div>`,
      standards: `<h2>Standards alignment targets</h2><p>The suite uses public, high-level models and terminology as architecture targets. It does not reproduce restricted standards text and does not claim certification or compliance.</p>
        <div class="table-scroll"><table class="data-table" style="min-width:760px"><thead><tr><th>Reference</th><th>Suite use</th><th>Boundary</th></tr></thead><tbody>
          <tr><td>IEC 61131-3</td><td>Structured Text, ladder, function block and sequential chart engineering views</td><td>Reference editor and simulator, not a certified PLC toolchain</td></tr>
          <tr><td>ISA-88</td><td>Equipment, procedural and recipe concepts for batch control</td><td>High-level open implementation model</td></tr>
          <tr><td>ISA-95 / IEC 62264</td><td>Equipment hierarchy and manufacturing operations integration boundary</td><td>High-level information architecture</td></tr>
          <tr><td>ISA-18.2</td><td>Alarm states, rationalisation, acknowledgement and shelving concepts</td><td>Reference lifecycle implementation</td></tr>
          <tr><td>OPC UA</td><td>Secure information-model and adapter contract</td><td>No browser-direct plant connection</td></tr>
          <tr><td>MQTT Sparkplug</td><td>IIoT topic, payload and state-aware connector contract</td><td>Edge-runtime integration required</td></tr>
          <tr><td>ISA/IEC 62443</td><td>Zones, conduits, shared responsibility, lifecycle controls and risk treatment</td><td>Readiness model, not certification</td></tr>
          <tr><td>NIST SP 800-82</td><td>OT-specific security, reliability, safety and recovery considerations</td><td>Reference control register</td></tr>
          <tr><td>21 CFR Part 11 readiness</td><td>Attributable audit records, record export and electronic-review concepts</td><td>Not compliant out of the box; validation and procedural controls required</td></tr>
          <tr><td>GAMP 5 principles</td><td>Risk-based lifecycle, requirements, design, verification and change control</td><td>Reference validation workflow</td></tr>
        </tbody></table></div>
        <h2>Primary references</h2><p>Official public references are linked without copying paid standards content.</p><ul><li><a href="https://webstore.iec.ch/en/publication/68533" target="_blank" rel="noreferrer">IEC 61131-3:2025 overview</a></li><li><a href="https://www.isa.org/standards-and-publications/isa-standards/isa-88-standards" target="_blank" rel="noreferrer">ISA-88 series overview</a></li><li><a href="https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard" target="_blank" rel="noreferrer">ISA-95 series overview</a></li><li><a href="https://opcfoundation.org/about/opc-technologies/opc-ua/" target="_blank" rel="noreferrer">OPC UA architecture overview</a></li><li><a href="https://sparkplug.eclipse.org/specification/" target="_blank" rel="noreferrer">Eclipse Sparkplug specification</a></li><li><a href="https://csrc.nist.gov/pubs/sp/800/82/r3/final" target="_blank" rel="noreferrer">NIST SP 800-82 Revision 3</a></li></ul>`,
      deployment: `<h2>Deployment model</h2><p>The current hosted release is a static, offline-capable browser reference application. It stores demonstration state locally and exports portable JSON and CSV records. No external account, database, analytics service or live controller is required.</p>
        <h2>Production extension path</h2><ol><li>Fork or clone the public repository and preserve the Apache-2.0 licence.</li><li>Define site-specific assets, tags, alarm rationalisation, recipes, users, zones and requirements in a controlled branch.</li><li>Implement protocol adapters in a separate edge runtime with explicit command allow-lists and certificate-based trust.</li><li>Add a durable historian and manufacturing database with tested backup, restoration and record-retention controls.</li><li>Integrate enterprise identity, named accounts, least privilege and independent audit storage.</li><li>Complete risk assessment, design review, FAT, SAT, commissioning, validation and cybersecurity acceptance for the intended use.</li><li>Maintain independent safety systems and verify physical fail-safe behaviour.</li></ol>
        <h2>Portable package</h2><p>Use Deployment centre to export a release manifest and System settings to export the complete workspace. The package includes configuration, current records, audit evidence and a deterministic reset path.</p>`,
      safety: `<h2>Safety and regulatory boundary</h2><p><strong>This application is not a safety PLC, DCS, safety instrumented system, emergency-stop circuit, machine-guard controller, electrical design authority or validated electronic-records platform.</strong></p><p>Any deployment that can affect people, product, equipment or the environment requires competent engineering, hazard analysis, independent safety functions, qualified hardware, secure architecture, site procedures, physical testing, commissioning and ongoing lifecycle controls.</p>
        <h2>Browser command behaviour</h2><p>Every command in this hosted release changes only the local deterministic simulation. Commands are recorded so the operator and validation workflows can be exercised without touching field devices.</p>
        <h2>Regulated use</h2><p>Audit-trail, record-export and review surfaces are readiness features. An organisation must determine applicable predicate rules and validate the complete configured system, infrastructure, procedures and intended use before relying on electronic records or signatures.</p>`,
      contributing: `<h2>Open-source use and contribution</h2><p>The suite is released under Apache License 2.0 so individuals and organisations can use, modify and distribute it under that licence's terms. The application is intentionally vendor-neutral and does not include proprietary vendor code or confidential customer material.</p>
        <h2>Contribution priorities</h2><ul><li>Edge adapters for OPC UA, MQTT Sparkplug and Modbus with safe command contracts</li><li>Portable controller-code generation and vendor-neutral intermediate representations</li><li>Durable historian, event and MES storage</li><li>Versioned project collaboration and merge conflict handling</li><li>Automated test generation, simulation models and release evidence</li><li>Additional process, machine, utilities and building-automation reference projects</li><li>Localisation, accessibility and industrial usability improvements</li></ul>
        <h2>Contribution quality gate</h2><p>Changes should include a defined requirement, failing test, implementation, responsive rendered evidence, accessibility check, security review where relevant, documentation and a reversible release path.</p>`
    };
    return sections[section] || sections.architecture;
  }

  function renderDocumentation() {
    const nav = [
      ['architecture', 'Architecture'],
      ['capabilities', 'Capability matrix'],
      ['standards', 'Standards alignment'],
      ['deployment', 'Deployment guide'],
      ['safety', 'Safety boundary'],
      ['contributing', 'Open-source contribution']
    ];
    const actions = `<a class="button secondary" href="./README.md" download>${icon('download')} Download README</a><a class="button secondary" href="./LICENSE" download>${icon('download')} Download licence</a>`;
    return `<div class="page">
      ${pageHeader('Documentation', 'Architecture, capability classification, standards alignment, deployment guidance, safety boundaries and open-source contribution.', actions)}
      <div class="docs-layout">
        <nav class="docs-nav" aria-label="Documentation sections">${nav.map(([id, label]) => `<button type="button" data-doc-section="${id}" aria-current="${docsSection === id}">${escapeHtml(label)}</button>`).join('')}</nav>
        <article class="docs-article" id="documentationArticle">${docsContent(docsSection)}</article>
      </div>
    </div>`;
  }

  function renderSettings() {
    const theme = document.documentElement.dataset.theme || 'dark';
    const density = document.documentElement.dataset.density || 'comfortable';
    const storageSize = new Blob([JSON.stringify(state)]).size;
    const actions = `<button class="button secondary" type="button" data-action="export-workspace">${icon('download')} Export workspace</button><button class="button" type="button" data-action="open-workspace-import">${icon('upload')} Import workspace</button>`;
    const audit = `<div class="table-scroll"><table class="data-table" style="min-width:760px"><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Object</th><th>Reason</th><th>Source</th></tr></thead><tbody>${state.auditTrail.slice(0, 12).map((item) => `<tr><td>${escapeHtml(item.time)}</td><td>${escapeHtml(item.user)}</td><td>${escapeHtml(item.action)}</td><td>${escapeHtml(item.object)}</td><td>${escapeHtml(item.reason)}</td><td>${escapeHtml(item.source)}</td></tr>`).join('')}</tbody></table></div>`;
    return `<div class="page">
      ${pageHeader('System settings', 'Control local workspace persistence, appearance, import, export, offline behaviour and deterministic reset.', actions)}
      <div class="settings-grid">
        ${panel('Workspace', `<div class="setting-row"><div><strong>Local persistence</strong><span>Configuration and demonstration records remain in this browser.</span></div><button class="toggle" type="button" aria-label="Toggle local persistence" aria-pressed="true"></button></div><div class="setting-row"><div><strong>Workspace size</strong><span>${Math.round(storageSize / 1024)} KiB of JSON records.</span></div>${tag('Healthy')}</div><div class="setting-row"><div><strong>Schema version</strong><span>Portable workspace contract.</span></div><code>${escapeHtml(state.meta.schemaVersion)}</code></div><div class="setting-row"><div><strong>Offline application</strong><span>Service worker caches the static application when served over HTTPS.</span></div>${tag('Enabled')}</div>`, { subtitle: 'Portable local engineering state' })}
        ${panel('Appearance', `<div class="setting-row"><div><strong>Colour theme</strong><span>Current theme: ${escapeHtml(theme)}.</span></div><button class="button small" type="button" data-action="toggle-theme">Toggle</button></div><div class="setting-row"><div><strong>Information density</strong><span>Current density: ${escapeHtml(density)}.</span></div><button class="button small" type="button" data-action="toggle-density">Toggle</button></div><div class="setting-row"><div><strong>Reduced motion</strong><span>System preference is honoured automatically.</span></div>${tag(matchMedia('(prefers-reduced-motion: reduce)').matches ? 'Active' : 'System controlled')}</div><div class="setting-row"><div><strong>Responsive range</strong><span>Verified from 320 px through ultrawide layouts.</span></div>${tag('Enabled')}</div>`, { subtitle: 'Accessible display preferences' })}
        ${panel('Data management', `<div class="setting-row"><div><strong>Export complete workspace</strong><span>Download configuration, state, audit and evidence as JSON.</span></div><button class="button small" type="button" data-action="export-workspace">Export</button></div><div class="setting-row"><div><strong>Import workspace</strong><span>Validate schema before replacing local state.</span></div><button class="button small" type="button" data-action="open-workspace-import">Import</button></div><div class="setting-row"><div><strong>Reset demonstration workspace</strong><span>Restore the deterministic seeded reference project.</span></div><button class="button small danger" type="button" data-action="request-reset">Reset demonstration workspace</button></div>`, { subtitle: 'Reversible import, export and reset' })}
        ${panel('Release identity', `<dl class="property-grid"><dt>Project</dt><dd>${escapeHtml(state.meta.projectId)}</dd><dt>Release</dt><dd>${escapeHtml(state.meta.release)}</dd><dt>Licence</dt><dd>${escapeHtml(state.meta.licence)}</dd><dt>Timezone</dt><dd>${escapeHtml(state.meta.timezone)}</dd><dt>Units</dt><dd>${escapeHtml(state.meta.unitSystem)}</dd><dt>Updated</dt><dd>${escapeHtml(state.meta.generatedAt)}</dd></dl>`, { subtitle: 'Current portable package metadata' })}
      </div>
      <div style="margin-top:var(--page-gap)">${panel('Recent audit trail', audit, { subtitle: 'Local attributable actions and reasons', flush: true })}</div>
    </div>`;
  }

  function setSequence(mode, firstState) {
    const selected = mode === 'CIP' ? state.cipSequence : state.sequence;
    const other = mode === 'CIP' ? state.sequence : state.cipSequence;
    selected.forEach((phase, index) => { phase.status = index === 0 ? 'active' : 'pending'; });
    other.forEach((phase) => { phase.status = 'pending'; });
    state.process.mode = mode;
    state.process.state = firstState;
    state.process.displayState = prettyState(firstState);
    state.process.phase = selected[0].name;
    state.process.progress = 0;
    state.process.pausedFrom = null;
  }

  function startProduction() {
    setSequence('Production', 'CHARGE_WATER');
    state.process.activeBatch = `BATCH-LOCAL-${String(state.process.batchCount + 1).padStart(3, '0')}`;
    const pumpCommand = state.tags.find((item) => item.id === 'P-101.CMD');
    const pumpFeedback = state.tags.find((item) => item.id === 'P-101.RUN');
    if (pumpCommand) pumpCommand.value = true;
    if (pumpFeedback) pumpFeedback.value = true;
    addEvent('Control', 'Production sequence started', 'Sequence');
    addAudit('Started production sequence', state.process.activeBatch, 'Operator command', 'Operations');
    saveState();
    render();
    showToast('Production started', 'Reference sequence entered CHARGE WATER.', 'good');
  }

  function startCip() {
    setSequence('CIP', 'CIP_PRE_RINSE');
    addEvent('Control', 'CIP sequence started', 'Sequence');
    addAudit('Started CIP sequence', 'RCP-CIP-001', 'Operator command', 'Operations');
    saveState();
    render();
    showToast('CIP started', 'Reference sequence entered CIP PRE RINSE.', 'good');
  }

  function pauseProcess() {
    if (['IDLE', 'FAULT', 'PAUSED'].includes(state.process.state)) {
      showToast('Pause unavailable', 'Start a sequence before pausing.', 'warning');
      return;
    }
    state.process.pausedFrom = state.process.state;
    state.process.state = 'PAUSED';
    state.process.phase = 'Paused by operator';
    addEvent('Control', 'Sequence paused', 'Sequence');
    addAudit('Paused sequence', state.process.activeBatch || state.process.mode, 'Operator command', 'Operations');
    saveState();
    render();
    showToast('Sequence paused', 'The deterministic process state is held.', 'warning');
  }

  function stopProcess() {
    state.process.state = 'IDLE';
    state.process.displayState = 'IDLE';
    state.process.mode = 'None';
    state.process.phase = 'Stopped';
    state.process.progress = 0;
    state.process.flowLMin = 0;
    state.process.agitatorRpm = 0;
    state.process.pausedFrom = null;
    state.sequence.forEach((phase) => { phase.status = 'pending'; });
    state.cipSequence.forEach((phase) => { phase.status = 'pending'; });
    const pumpCommand = state.tags.find((item) => item.id === 'P-101.CMD');
    const pumpFeedback = state.tags.find((item) => item.id === 'P-101.RUN');
    if (pumpCommand) pumpCommand.value = false;
    if (pumpFeedback) pumpFeedback.value = false;
    addEvent('Control', 'Sequence stopped', 'Sequence');
    addAudit('Stopped sequence', state.process.activeBatch || 'Reference process', 'Operator command', 'Operations');
    saveState();
    render();
    showToast('Sequence stopped', 'The reference process returned to IDLE.', 'warning');
  }

  function injectFault() {
    const alarm = state.alarms.find((item) => item.id === 'ALM-COMMS-001');
    if (alarm) {
      alarm.state = 'Active unacknowledged';
      alarm.lastChange = nowIso();
    }
    if (state.process.state !== 'FAULT') state.process.pausedFrom = state.process.state;
    state.process.state = 'FAULT';
    state.process.phase = 'Communication fault response';
    state.process.flowLMin = 0;
    state.process.agitatorRpm = 0;
    state.alarmEvents.unshift({ time: timeString(), alarm: 'ALM-COMMS-001', transition: 'Active unacknowledged', user: 'Runtime', comment: 'Reference fault injected' });
    addEvent('Alarm', 'ALM-COMMS-001 became active unacknowledged', 'Alarm', 'Runtime');
    addAudit('Injected communications fault', 'ALM-COMMS-001', 'Engineering test', 'Operations');
    saveState();
    render();
    showToast('Communication fault active', 'Supervisory communication is simulated as unavailable.', 'danger');
  }

  function resetProcess() {
    const alarm = state.alarms.find((item) => item.id === 'ALM-COMMS-001');
    if (alarm) alarm.state = 'Normal';
    state.process.state = 'IDLE';
    state.process.mode = 'None';
    state.process.phase = 'Ready';
    state.process.progress = 0;
    state.process.flowLMin = 0;
    state.process.agitatorRpm = 0;
    state.process.pausedFrom = null;
    state.sequence.forEach((phase) => { phase.status = 'pending'; });
    state.cipSequence.forEach((phase) => { phase.status = 'pending'; });
    state.alarmEvents.unshift({ time: timeString(), alarm: 'ALM-COMMS-001', transition: 'Returned to normal', user: 'System engineer', comment: 'Reference fault reset' });
    addEvent('Control', 'Reference process reset to idle', 'Sequence');
    addAudit('Reset process', 'OIA-REF-001', 'Engineering recovery command', 'Operations');
    saveState();
    render();
    showToast('Process reset', 'Reference process and communication alarm returned to normal.', 'good');
  }

  function updateAlarm(id, transition) {
    const alarm = state.alarms.find((item) => item.id === id);
    if (!alarm) return;
    const map = {
      acknowledge: 'Active acknowledged',
      shelve: 'Shelved',
      unshelve: 'Active acknowledged',
      clear: 'Normal'
    };
    alarm.state = map[transition] || alarm.state;
    alarm.lastChange = nowIso();
    const transitionText = alarm.state === 'Normal' ? 'Returned to normal' : alarm.state;
    state.alarmEvents.unshift({ time: timeString(), alarm: id, transition: transitionText, user: 'System engineer', comment: `Alarm ${transition}` });
    addEvent('Alarm', `${id} ${transitionText.toLowerCase()}`, 'Alarm');
    addAudit(`${transition[0].toUpperCase()}${transition.slice(1)} alarm`, id, 'Operator lifecycle action', 'Alarm management');
    saveState();
    render();
    showToast(`Alarm ${transition}`, `${id} is now ${alarm.state}.`, alarm.state === 'Normal' ? 'good' : 'warning');
  }

  function validateControlProgram() {
    const code = state.controlProgram.code;
    const diagnostics = [];
    const required = [
      ['PROGRAM', /\bPROGRAM\b/],
      ['END_PROGRAM', /\bEND_PROGRAM\b/],
      ['IF', /\bIF\b/],
      ['END_IF', /\bEND_IF\b/]
    ];
    required.forEach(([label, pattern]) => {
      if (!pattern.test(code)) diagnostics.push({ level: 'Error', message: `Missing ${label} declaration.` });
    });
    const ifCount = (code.match(/\bIF\b/g) || []).length;
    const endIfCount = (code.match(/\bEND_IF\b/g) || []).length;
    if (ifCount !== endIfCount) diagnostics.push({ level: 'Error', message: `IF and END_IF count mismatch: ${ifCount} / ${endIfCount}.` });
    const assignmentLines = code.split('\n').filter((line) => line.includes(':='));
    assignmentLines.forEach((line, index) => {
      if (!line.trim().endsWith(';')) diagnostics.push({ level: 'Error', message: `Assignment ${index + 1} requires a semicolon.` });
    });
    if (!diagnostics.length) {
      diagnostics.push({ level: 'Pass', message: 'Validation passed' });
      state.controlProgram.lastValidation = 'Validated';
    } else {
      state.controlProgram.lastValidation = 'Validation failed';
    }
    state.controlProgram.diagnostics = diagnostics;
    addEvent('Control studio', state.controlProgram.lastValidation, 'Engineering');
    addAudit('Validated control program', state.controlProgram.name, 'Engineering verification', 'Control studio');
    saveState();
    render();
  }

  function runControlScan() {
    const code = state.controlProgram.code;
    if (!/\bPROGRAM\b/.test(code) || !/\bEND_PROGRAM\b/.test(code)) {
      state.controlProgram.diagnostics = [{ level: 'Error', message: 'Scan blocked until the program validates.' }];
      state.controlProgram.lastValidation = 'Validation failed';
      render();
      return;
    }
    state.controlProgram.scans += 1;
    const command = state.process.mode === 'Production' && state.process.tankLevelPct < 85 && state.process.state !== 'FAULT';
    const cmdTag = state.tags.find((item) => item.id === 'P-101.CMD');
    if (cmdTag) cmdTag.value = command;
    state.controlProgram.diagnostics = [{ level: 'Pass', message: 'Scan completed' }];
    addEvent('Control studio', `One scan completed, PumpCommand=${command}`, 'Engineering');
    addAudit('Ran one control scan', state.controlProgram.name, 'Engineering simulation', 'Control studio');
    saveState();
    render();
  }

  function updateHmiRows() {
    const rowsContainer = document.querySelector('#hmiScreenRows');
    if (!rowsContainer) return;
    const screens = filteredHmiScreens();
    rowsContainer.innerHTML = screens.length ? screens.map((screen) => `<button class="screen-row ${screen.id === activeScreenId ? 'selected' : ''}" type="button" data-screen-id="${escapeHtml(screen.id)}" aria-label="Open screen ${escapeHtml(screen.name)}"><strong>${escapeHtml(screen.name)} screen</strong><span>${escapeHtml(screen.type)} | ${escapeHtml(screen.status)} | ${screen.bindings} bindings</span></button>`).join('') : '<div class="empty-state"><div><strong>No matching screens</strong><span>Clear the filter to show the full library.</span></div></div>';
  }

  function releaseOrder(id) {
    const order = state.orders.find((item) => item.id === id);
    if (!order) return;
    order.status = 'Running';
    state.process.activeBatch = `BATCH-${id.replace('MO-', '')}-LIVE`;
    addEvent('MES', `Production order ${id} released`, 'Production');
    addAudit('Released production order', id, 'Scheduled production', 'Batch and MES');
    saveState();
    render();
    showToast('Order released', `${id} is Running against ${order.recipe}.`, 'good');
  }

  function completeOrder(id) {
    const order = state.orders.find((item) => item.id === id);
    if (!order) return;
    order.status = 'Complete';
    addEvent('MES', `Production order ${id} completed`, 'Production');
    addAudit('Completed production order', id, 'All planned batches complete', 'Batch and MES');
    saveState();
    render();
    showToast('Order completed', `${id} moved to Complete.`, 'good');
  }

  function executeTest(id, quiet = false) {
    const test = state.tests.find((item) => item.id === id);
    if (!test) return;
    test.status = 'Passed';
    test.evidence = `Automated local evidence ${timeString()}`;
    const requirement = state.requirements.find((item) => item.test === id);
    if (requirement) requirement.status = 'Verified';
    addAudit('Executed verification test', id, 'Automated reference verification', 'Validation and quality');
    addEvent('Validation', `${id} passed`, 'Quality');
    if (!quiet) {
      saveState();
      render();
      showToast('Verification passed', `${id} produced local evidence.`, 'good');
    }
  }

  function executeAllTests() {
    state.tests.forEach((test) => executeTest(test.id, true));
    saveState();
    render();
    showToast('Verification suite passed', `${state.tests.length} local reference tests produced evidence.`, 'good');
  }

  function completeWorkOrder(id) {
    const order = state.workOrders.find((item) => item.id === id);
    if (!order) return;
    order.status = 'Complete';
    addAudit('Completed work order', id, 'Reference close-out', 'Maintenance');
    addEvent('Maintenance', `${id} completed`, 'Asset');
    saveState();
    render();
    showToast('Work order completed', `${id} is closed.`, 'good');
  }

  function createWorkOrder() {
    const id = `WO-LOCAL-${String(state.workOrders.length + 1).padStart(3, '0')}`;
    state.workOrders.unshift({ id, asset: 'TK-101', type: 'Inspection', title: 'Reference operator inspection', priority: 'Normal', status: 'Open', due: 'Next shift', owner: 'Maintenance' });
    addAudit('Created work order', id, 'Reference inspection request', 'Maintenance');
    saveState();
    render();
    showToast('Work order created', `${id} was added to the local register.`, 'good');
  }

  function runSecurityAssessment() {
    lastSecurityScore = computeSecurityScore();
    addAudit('Ran OT security posture assessment', 'SECURITY-MODEL', 'Periodic reference review', 'OT cybersecurity');
    addEvent('Security', `Reference posture assessment completed at ${lastSecurityScore} percent`, 'Security');
    saveState();
    render();
    showToast('Posture assessment complete', `${lastSecurityScore} percent of reference control weight is implemented.`, lastSecurityScore >= 75 ? 'good' : 'warning');
  }

  function advanceSecurityControl(id) {
    const control = state.securityControls.find((item) => item.id === id);
    if (!control) return;
    control.status = control.status === 'Planned' ? 'Partial' : 'Implemented';
    lastSecurityScore = computeSecurityScore();
    addAudit('Advanced security control', id, 'Reference improvement action', 'OT cybersecurity');
    saveState();
    render();
    showToast('Control updated', `${id} is now ${control.status}.`, 'good');
  }

  function advanceMigrationScreen(id) {
    const item = state.migrationScreens.find((screen) => screen.id === id);
    if (!item) return;
    const stages = ['Not started', 'In progress', 'In review', 'Verified'];
    const current = stages.indexOf(item.status);
    item.status = stages[Math.min(stages.length - 1, current < 0 ? 1 : current + 1)];
    if (item.status === 'Verified') item.notes = 'Bindings, navigation and visual behaviour verified';
    addAudit('Advanced migration screen', id, `Status set to ${item.status}`, 'Migration workbench');
    saveState();
    render();
    showToast('Migration status updated', `${id} is now ${item.status}.`, item.status === 'Verified' ? 'good' : 'warning');
  }


  function recalculateOee() {
    const oee = state.oee;
    oee.totalCount += 1;
    oee.goodCount += 1;
    oee.qualityPct = Number((oee.goodCount / oee.totalCount * 100).toFixed(1));
    oee.availabilityPct = Number((oee.runMinutes / oee.plannedMinutes * 100).toFixed(1));
    oee.oeePct = Number((oee.availabilityPct * oee.performancePct * oee.qualityPct / 10000).toFixed(1));
    oee.lastCalculated = nowIso();
    addEvent('Performance', `OEE recalculated at ${oee.oeePct} percent`, 'Production');
    addAudit('Recalculated OEE', oee.period, 'Engineer requested deterministic calculation', 'OEE and reporting');
    saveState('OEE calculation saved');
    render();
    showToast('OEE recalculated', `Current effectiveness is ${oee.oeePct} percent.`, oee.oeePct >= oee.targetPct ? 'good' : 'warning');
  }

  function testInterface(id) {
    const item = state.interfaces.find((entry) => entry.id === id);
    if (!item) return;
    item.state = 'Healthy';
    item.lastMessage = timeString();
    addEvent('Integration', `${id} contract and endpoint test passed`, 'Interface');
    addAudit('Tested integration interface', id, 'Manual contract and endpoint check', 'Integration gateway');
    saveState('Interface test saved');
    render();
    showToast('Interface test passed', `${item.name} accepted the deterministic reference transaction.`, 'good');
  }

  function replayInterface(id) {
    const message = state.interfaceMessages.find((entry) => entry.id === id);
    if (!message) return;
    message.attempts += 1;
    message.status = 'Processed';
    message.received = timeString();
    const item = state.interfaces.find((entry) => entry.id === message.interface);
    if (item) {
      item.queued = Math.max(0, item.queued - 1);
      item.state = 'Healthy';
      item.lastMessage = timeString();
    }
    addEvent('Integration', `${id} replayed and processed`, 'Interface');
    addAudit('Replayed integration message', id, 'Controlled recovery after validation review', 'Integration gateway');
    saveState('Interface replay saved');
    render();
    showToast('Message replayed', `${id} was processed on attempt ${message.attempts}.`, 'good');
  }

  function advanceMovement(id) {
    const mission = state.mobileTasks.find((entry) => entry.id === id);
    if (!mission) return;
    if (mission.state === 'Ready' || mission.state === 'Queued') mission.state = 'Executing';
    mission.progress = Math.min(100, mission.progress + 25);
    if (mission.progress >= 100) {
      mission.state = 'Complete';
      const movement = state.materialMovements.find((entry) => entry.method === mission.vehicle && entry.status !== 'Complete');
      if (movement) movement.status = 'Complete';
    }
    addEvent('Materials', `${id} advanced to ${mission.progress} percent`, 'Material movement');
    addAudit('Advanced mobile mission', id, 'Deterministic movement simulation', 'Materials and movement');
    saveState('Material movement saved');
    render();
    showToast('Movement advanced', `${id} is ${mission.state.toLowerCase()} at ${mission.progress} percent.`, mission.state === 'Complete' ? 'good' : 'info');
  }

  function signRecord(id) {
    const record = state.electronicRecords.find((entry) => entry.id === id);
    if (!record) return;
    record.state = 'Reviewed';
    record.signatures += 1;
    const signature = {
      id: `SIG-LOCAL-${String(state.signatures.length + 1).padStart(3, '0')}`,
      record: id,
      user: 'System engineer',
      meaning: 'Reviewed',
      time: nowIso()
    };
    state.signatures.unshift(signature);
    addEvent('Records', `${id} reviewed and signed`, 'Electronic record');
    addAudit('Reviewed and signed record', id, 'Local demonstration review', 'Identity and records');
    saveState('Electronic record saved');
    render();
    showToast('Record reviewed and signed', `${id} now includes an attributable local demonstration signature.`, 'good');
  }

  function buildReleasePackage() {
    const manifest = createReleaseManifest();
    state.releases[0].manifest = manifest.id;
    state.releases[0].commit = 'browser-reference';
    addAudit('Built release package', manifest.id, 'Controlled local package build', 'Deployment centre');
    addEvent('Deployment', `${manifest.id} built`, 'Release');
    saveState('Release package built');
    downloadFile(`OIA-${manifest.version}-Release-Manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);
    render();
    showToast('Release package built', `${manifest.id} was validated and exported.`, 'good');
  }

  function createReleaseManifest() {
    return {
      id: `MAN-${state.meta.release}`,
      version: state.meta.release,
      project: state.meta.projectId,
      generatedAt: nowIso(),
      schemaVersion: state.meta.schemaVersion,
      licence: state.meta.licence,
      modules: state.modules.map((module) => module.id),
      counts: {
        assets: state.assets.length,
        tags: state.tags.length,
        alarms: state.alarms.length,
        recipes: state.recipes.length,
        requirements: state.requirements.length,
        tests: state.tests.length
      },
      gates: {
        model: 'pass',
        control: state.controlProgram.lastValidation === 'Validated' ? 'pass' : 'reference',
        traceability: state.requirements.every((item) => item.design && item.test) ? 'pass' : 'fail',
        safetyBoundary: 'declared',
        productionCertification: 'not-claimed'
      },
      rollback: state.releases[0].rollback
    };
  }

  function exportWorkspace() {
    addAudit('Exported workspace', state.meta.projectId, 'Portable backup', 'System settings');
    saveState('Workspace exported');
    downloadFile(`20260902-Open-Industrial-Automation-Workspace-Rev00.json`, `${JSON.stringify(state, null, 2)}\n`);
    showToast('Workspace exported', 'Configuration, state, audit and evidence were downloaded.', 'good');
  }

  function exportRows(filename, headers, rows) {
    downloadFile(filename, `${csv([headers, ...rows])}\n`, 'text/csv;charset=utf-8');
  }

  function exportByAction(action) {
    if (action === 'export-event-log') {
      exportRows('20260902-OIA-Event-Log-Rev00.csv', ['Time', 'Source', 'Category', 'Event', 'User'], state.events.map((item) => [item.time, item.source, item.category, item.event, item.user]));
      showToast('Event log exported', `${state.events.length} event records were downloaded.`, 'good');
      return;
    }
    if (action === 'export-control-program') {
      downloadFile('PRG-Mixing-Unit-v1.4.0.st', `${state.controlProgram.code}\n`, 'text/plain;charset=utf-8');
      showToast('Control program exported', 'Structured Text source was downloaded.', 'good');
      return;
    }
    if (action === 'export-hmi-package') {
      const payload = { project: state.meta.projectId, screens: state.hmiScreens, bindings: state.hmiBindings, exportedAt: nowIso() };
      downloadFile('20260902-OIA-HMI-Package-Rev00.json', `${JSON.stringify(payload, null, 2)}\n`);
      showToast('HMI package exported', 'Screens, bindings and navigation metadata were downloaded.', 'good');
      return;
    }
    if (action === 'export-tag-database') {
      exportRows('20260902-OIA-Tag-Database-Rev00.csv', ['Tag', 'Description', 'Asset', 'Type', 'Direction', 'Unit', 'Range', 'Value', 'Quality', 'ScanMs', 'Source', 'Address', 'Alarm'], state.tags.map((item) => [item.id, item.description, item.asset, item.type, item.direction, item.unit, item.range, item.value, item.quality, item.scanMs, item.source, item.address, item.alarm]));
      showToast('Tag database exported', `${state.tags.length} tag definitions were downloaded.`, 'good');
      return;
    }
    if (action === 'export-alarm-register') {
      exportRows('20260902-OIA-Alarm-Register-Rev00.csv', ['Alarm', 'Tag', 'Message', 'Priority', 'State', 'Limit', 'Delay', 'Consequence', 'Response', 'Owner', 'Lifecycle'], state.alarms.map((item) => [item.id, item.tag, item.message, item.priority, item.state, item.limit, item.delay, item.consequence, item.response, item.owner, item.lifecycle]));
      showToast('Alarm register exported', `${state.alarms.length} rationalised definitions were downloaded.`, 'good');
      return;
    }
    if (action === 'export-historian-csv') {
      exportRows('20260902-OIA-Historian-Window-Rev00.csv', ['Second', 'LevelPct', 'TemperatureC', 'FlowLMin', 'ConductivityMSCm'], state.trend.map((item) => [item.t, item.level, item.temperature, item.flow, item.conductivity]));
      showToast('Historian window exported', `${state.trend.length} samples per series were downloaded.`, 'good');
      return;
    }
    if (action === 'export-batch-record') {
      const payload = { project: state.meta.projectId, batches: state.batches, orders: state.orders, genealogy: state.genealogy, auditTrail: state.auditTrail.filter((item) => /Batch|order|recipe/i.test(`${item.action} ${item.object}`)) };
      downloadFile('20260902-OIA-Batch-Production-Records-Rev00.json', `${JSON.stringify(payload, null, 2)}\n`);
      showToast('Batch records exported', 'Batch, order, genealogy and related audit records were downloaded.', 'good');
      return;
    }
    if (action === 'export-oee-report') {
      const payload = { project: state.meta.projectId, oee: state.oee, downtimeReasons: state.downtimeReasons, reports: state.reports, formula: 'availability * performance * quality', generatedAt: nowIso() };
      downloadFile('20260902-OIA-OEE-And-Reporting-Rev00.json', `${JSON.stringify(payload, null, 2)}\n`);
      showToast('OEE report exported', 'Effectiveness source values, losses and report definitions were downloaded.', 'good');
      return;
    }
    if (action === 'export-interface-register') {
      const payload = { project: state.meta.projectId, interfaces: state.interfaces, messages: state.interfaceMessages, protocols: state.protocols, generatedAt: nowIso() };
      downloadFile('20260902-OIA-Integration-Gateway-Rev00.json', `${JSON.stringify(payload, null, 2)}\n`);
      showToast('Interface register exported', 'Contracts, health, queue and transaction records were downloaded.', 'good');
      return;
    }
    if (action === 'export-material-register') {
      const payload = { project: state.meta.projectId, materials: state.materials, movements: state.materialMovements, mobileTasks: state.mobileTasks, genealogy: state.genealogy, generatedAt: nowIso() };
      downloadFile('20260902-OIA-Materials-And-Movement-Rev00.json', `${JSON.stringify(payload, null, 2)}\n`);
      showToast('Material register exported', 'Lots, movements, missions and genealogy were downloaded.', 'good');
      return;
    }
    if (action === 'export-audit-package') {
      const payload = { project: state.meta.projectId, roles: state.users, electronicRecords: state.electronicRecords, signatures: state.signatures, auditTrail: state.auditTrail, generatedAt: nowIso(), complianceClaim: 'none' };
      downloadFile('20260902-OIA-Identity-And-Records-Rev00.json', `${JSON.stringify(payload, null, 2)}\n`);
      showToast('Audit package exported', 'Roles, electronic records, signatures and attributable audit events were downloaded.', 'good');
      return;
    }
    if (action === 'export-validation-package') {
      const payload = { project: state.meta.projectId, requirements: state.requirements, tests: state.tests, deviations: state.deviations, changes: state.changes, auditTrail: state.auditTrail, generatedAt: nowIso(), boundary: state.meta.safetyBoundary };
      downloadFile('20260902-OIA-Validation-Package-Rev00.json', `${JSON.stringify(payload, null, 2)}\n`);
      showToast('Validation package exported', 'Traceability, tests, deviations, changes and audit evidence were downloaded.', 'good');
      return;
    }
    if (action === 'export-security-model') {
      const payload = { project: state.meta.projectId, zones: state.zones, conduits: state.conduits, controls: state.securityControls, risks: state.risks, roles: state.users, generatedAt: nowIso(), certificationClaim: 'none' };
      downloadFile('20260902-OIA-OT-Security-Model-Rev00.json', `${JSON.stringify(payload, null, 2)}\n`);
      showToast('Security model exported', 'Zones, conduits, controls, risks and roles were downloaded.', 'good');
      return;
    }
    if (action === 'export-release-manifest') {
      const manifest = createReleaseManifest();
      downloadFile(`OIA-${manifest.version}-Release-Manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);
      showToast('Release manifest exported', `${manifest.id} was downloaded.`, 'good');
      return;
    }
    if (action === 'export-migration-register') {
      exportRows('20260902-OIA-Migration-Screen-Register-Rev00.csv', ['ID', 'Name', 'Source', 'Target', 'Buttons', 'Bindings', 'Scripts', 'Navigation', 'Status', 'Notes'], state.migrationScreens.map((item) => [item.id, item.name, item.source, item.target, item.buttons, item.bindings, item.scripts, item.navigation, item.status, item.notes]));
      showToast('Migration register exported', `${state.migrationScreens.length} screen records were downloaded.`, 'good');
    }
  }

  function simulateTagQuality() {
    const tagItem = state.tags.find((item) => item.id === 'TT-101.PV');
    if (!tagItem) return;
    tagItem.quality = tagItem.quality === 'Good' ? 'Bad' : 'Good';
    addEvent('I/O', `${tagItem.id} quality changed to ${tagItem.quality}`, 'Signal', 'Runtime');
    addAudit('Simulated tag quality', tagItem.id, 'Engineering test', 'Tags and I/O');
    saveState();
    render();
    showToast('Tag quality changed', `${tagItem.id} is now ${tagItem.quality}.`, tagItem.quality === 'Good' ? 'good' : 'danger');
  }

  function testConnection(id) {
    const connection = state.protocols.find((item) => item.id === id);
    if (!connection) return;
    connection.latencyMs = Math.max(3, connection.latencyMs + ((state.controlProgram.scans % 3) - 1));
    addEvent('Connectivity', `${id} reference contract test passed`, 'Protocol');
    addAudit('Tested protocol adapter definition', id, 'Engineering connectivity check', 'Tags and I/O');
    saveState();
    render();
    showToast('Connection contract passed', `${connection.name}: ${connection.latencyMs} ms reference latency.`, 'good');
  }

  function appendTrendSample() {
    const last = state.trend[state.trend.length - 1];
    const t = last.t + 1;
    state.trend.push({
      t,
      level: Number(Math.max(0, Math.min(100, last.level + Math.sin(t / 3) * 0.7)).toFixed(2)),
      temperature: Number(Math.max(0, Math.min(100, last.temperature + Math.cos(t / 5) * 0.3)).toFixed(2)),
      flow: Number(Math.max(0, 70 + Math.sin(t / 2) * 8).toFixed(2)),
      conductivity: Number(Math.max(0, last.conductivity + Math.sin(t / 7) * 0.02).toFixed(2))
    });
    state.trend = state.trend.slice(-120);
    saveState();
    render();
  }

  function compareEnvironment(id) {
    const environment = state.environments.find((item) => item.id === id);
    if (!environment) return;
    showToast('Environment compared', `${environment.name} has ${environment.drift} recorded differences from the approved reference.`, environment.drift === 0 ? 'good' : 'warning');
  }

  function setHmiPreview(mode) {
    if (mode === 'idle') {
      state.process.state = 'IDLE';
      state.process.mode = 'None';
      state.process.flowLMin = 0;
      state.process.agitatorRpm = 0;
    } else if (mode === 'running') {
      state.process.state = 'MIX';
      state.process.mode = 'Production';
      state.process.flowLMin = 0;
      state.process.agitatorRpm = 820;
      state.process.tankLevelPct = Math.max(state.process.tankLevelPct, 68.4);
    } else {
      injectFault();
      return;
    }
    saveState();
    render();
    showToast('Preview state changed', `HMI preview is showing ${mode}.`, 'good');
  }

  function resetWorkspace() {
    state = clone(seed);
    lastSecurityScore = null;
    activeScreenId = 'HMI-001';
    hmiFilter = '';
    tagFilter = '';
    tagQualityFilter = 'All';
    alarmFilter = 'All';
    controlView = 'ST';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    confirmDialog.close();
    render();
    showToast('Workspace reset', 'The deterministic seeded reference project was restored.', 'good');
  }

  async function importWorkspace(file) {
    try {
      const parsed = JSON.parse(await file.text());
      if (parsed?.meta?.schemaVersion !== seed.meta.schemaVersion || !Array.isArray(parsed.modules) || !Array.isArray(parsed.tags)) throw new Error('The workspace schema is not compatible with version 2.1.0.');
      state = parsed;
      addAudit('Imported workspace', state.meta.projectId, 'User-selected portable package', 'System settings');
      saveState('Workspace imported');
      render();
      showToast('Workspace imported', 'The validated portable workspace replaced local state.', 'good');
    } catch (error) {
      showToast('Import rejected', error.message || 'The file could not be validated.', 'danger');
    } finally {
      workspaceImport.value = '';
    }
  }

  function parseCsvLine(line) {
    const values = [];
    let current = '';
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      const next = line[index + 1];
      if (char === '"' && quoted && next === '"') {
        current += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === ',' && !quoted) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  }

  async function importMigration(file) {
    try {
      const lines = (await file.text()).split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) throw new Error('The CSV requires a header and at least one screen.');
      const headers = parseCsvLine(lines[0]).map((item) => item.toLowerCase());
      const required = ['id', 'name', 'source', 'target', 'buttons', 'bindings', 'scripts', 'navigation', 'status', 'notes'];
      if (!required.every((item) => headers.includes(item))) throw new Error(`Required headers: ${required.join(', ')}.`);
      state.migrationScreens = lines.slice(1).map((line) => {
        const values = parseCsvLine(line);
        const record = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
        return {
          id: record.id,
          name: record.name,
          source: record.source,
          target: record.target,
          buttons: Number(record.buttons) || 0,
          bindings: Number(record.bindings) || 0,
          scripts: Number(record.scripts) || 0,
          navigation: Number(record.navigation) || 0,
          status: record.status,
          notes: record.notes
        };
      });
      addAudit('Imported migration register', `${state.migrationScreens.length} screens`, 'User-selected CSV', 'Migration workbench');
      saveState('Migration register imported');
      render();
      showToast('Migration register imported', `${state.migrationScreens.length} screen records were validated.`, 'good');
    } catch (error) {
      showToast('Migration import rejected', error.message || 'The CSV could not be validated.', 'danger');
    } finally {
      migrationImport.value = '';
    }
  }

  function canvasSetup(canvas) {
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.max(220, Math.floor(rect.height));
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const context = canvas.getContext('2d');
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { context, width, height };
  }

  function cssColour(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function drawLineChart(canvasId, series) {
    const canvas = document.getElementById(canvasId);
    const setup = canvasSetup(canvas);
    if (!setup) return;
    const { context: ctx, width, height } = setup;
    const padding = { left: 46, right: 18, top: 18, bottom: 30 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const line = cssColour('--line');
    const muted = cssColour('--faint');
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = line;
    ctx.fillStyle = muted;
    ctx.lineWidth = 1;
    ctx.font = '10px Cascadia Code, monospace';
    ctx.textAlign = 'right';
    for (let index = 0; index <= 4; index += 1) {
      const y = padding.top + plotHeight * index / 4;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillText(String(100 - index * 25), padding.left - 8, y + 3);
    }
    ctx.textAlign = 'center';
    for (let index = 0; index <= 5; index += 1) {
      const x = padding.left + plotWidth * index / 5;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
      ctx.fillText(`${Math.round(index * 12)}s`, x, height - 10);
    }
    const data = state.trend.slice(-60);
    series.forEach((spec) => {
      const values = data.map((item) => Number(item[spec.key]));
      const min = spec.min ?? 0;
      const max = spec.max ?? 100;
      ctx.beginPath();
      values.forEach((value, index) => {
        const x = padding.left + (plotWidth * index / Math.max(1, values.length - 1));
        const normal = (value - min) / Math.max(0.001, max - min);
        const y = padding.top + plotHeight - Math.max(0, Math.min(1, normal)) * plotHeight;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = spec.colour;
      ctx.lineWidth = 2.4;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
    });
  }

  function drawOperationsChart() {
    drawLineChart('operationsChart', [
      { key: 'level', colour: cssColour('--accent'), min: 0, max: 100 },
      { key: 'temperature', colour: cssColour('--warning'), min: 0, max: 100 }
    ]);
  }

  function drawHistorianChart() {
    const specs = {
      level: { key: 'level', colour: cssColour('--accent'), min: 0, max: 100 },
      temperature: { key: 'temperature', colour: cssColour('--warning'), min: 0, max: 100 },
      flow: { key: 'flow', colour: cssColour('--info'), min: 0, max: 150 },
      conductivity: { key: 'conductivity', colour: cssColour('--good'), min: 0, max: 10 }
    };
    drawLineChart('historianChart', historianSeries.map((item) => specs[item]).filter(Boolean));
  }

  function drawMigrationChart() {
    const canvas = document.getElementById('migrationChart');
    const setup = canvasSetup(canvas);
    if (!setup) return;
    const { context: ctx, width, height } = setup;
    const items = state.migrationScreens;
    const padding = { left: 42, right: 14, top: 18, bottom: 42 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const max = Math.max(50, ...items.flatMap((item) => [item.bindings, item.buttons, item.navigation]));
    const colours = [cssColour('--accent'), cssColour('--warning'), cssColour('--info')];
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = cssColour('--line');
    ctx.fillStyle = cssColour('--faint');
    ctx.font = '10px Cascadia Code, monospace';
    ctx.textAlign = 'right';
    for (let index = 0; index <= 4; index += 1) {
      const y = padding.top + plotHeight * index / 4;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillText(String(Math.round(max - max * index / 4)), padding.left - 7, y + 3);
    }
    const groupWidth = plotWidth / Math.max(1, items.length);
    const barWidth = Math.min(22, groupWidth / 5);
    items.forEach((item, itemIndex) => {
      [item.bindings, item.buttons, item.navigation].forEach((value, seriesIndex) => {
        const x = padding.left + itemIndex * groupWidth + groupWidth / 2 + (seriesIndex - 1) * (barWidth + 3) - barWidth / 2;
        const barHeight = plotHeight * value / max;
        ctx.fillStyle = colours[seriesIndex];
        ctx.fillRect(x, padding.top + plotHeight - barHeight, barWidth, barHeight);
      });
      ctx.save();
      ctx.translate(padding.left + itemIndex * groupWidth + groupWidth / 2, height - 12);
      ctx.rotate(-0.35);
      ctx.fillStyle = cssColour('--faint');
      ctx.textAlign = 'right';
      ctx.fillText(item.id, 0, 0);
      ctx.restore();
    });
  }

  function afterRender(token) {
    if (token !== renderToken) return;
    if (activeModule === 'operations') drawOperationsChart();
    if (activeModule === 'historian') drawHistorianChart();
    if (activeModule === 'migration') drawMigrationChart();
  }

  function render() {
    renderToken += 1;
    const token = renderToken;
    renderNavigation();
    const module = state.modules.find((item) => item.id === activeModule) || state.modules[0];
    breadcrumb.innerHTML = `<span>${escapeHtml(state.meta.projectName)} / ${escapeHtml(module.group)}</span><strong>${escapeHtml(module.label)}</strong>`;
    const renderers = {
      overview: renderOverview,
      operations: renderOperations,
      'control-studio': renderControlStudio,
      'hmi-studio': renderHmiStudio,
      'tags-io': renderTagsIo,
      alarms: renderAlarmManagement,
      historian: renderHistorian,
      performance: renderPerformance,
      integration: renderIntegration,
      'batch-mes': renderBatchMes,
      materials: renderMaterials,
      maintenance: renderMaintenance,
      validation: renderValidation,
      cybersecurity: renderCybersecurity,
      identity: renderIdentity,
      deployment: renderDeployment,
      migration: renderMigration,
      documentation: renderDocumentation,
      settings: renderSettings
    };
    workspace.innerHTML = (renderers[activeModule] || renderOverview)();
    document.title = `${module.label} - Open Industrial Automation Suite`;
    const count = state.notifications.filter((item) => item.unread).length;
    const countElement = document.querySelector('#notificationCount');
    if (countElement) {
      countElement.textContent = String(count);
      countElement.hidden = count === 0;
    }
    requestAnimationFrame(() => afterRender(token));
  }

  function commandIndex() {
    const records = [
      ...state.modules.map((module) => ({ kind: 'Module', id: module.id, title: module.label, detail: module.description, module: module.id })),
      ...state.tags.map((item) => ({ kind: 'Tag', id: item.id, title: item.id, detail: item.description, module: 'tags-io' })),
      ...state.alarms.map((item) => ({ kind: 'Alarm', id: item.id, title: item.id, detail: item.message, module: 'alarms' })),
      ...state.recipes.map((item) => ({ kind: 'Recipe', id: item.id, title: item.name, detail: `${item.id} v${item.version}`, module: 'batch-mes' })),
      ...state.requirements.map((item) => ({ kind: 'Requirement', id: item.id, title: item.id, detail: item.statement, module: 'validation' })),
      ...state.assets.map((item) => ({ kind: 'Asset', id: item.id, title: item.name, detail: `${item.id} - ${item.type}`, module: 'maintenance' })),
      ...state.interfaces.map((item) => ({ kind: 'Interface', id: item.id, title: item.name, detail: `${item.source} to ${item.target} - ${item.transport}`, module: 'integration' })),
      ...state.materials.map((item) => ({ kind: 'Material', id: item.id, title: item.name, detail: `${item.location} - ${item.status}`, module: 'materials' })),
      ...state.electronicRecords.map((item) => ({ kind: 'Record', id: item.id, title: item.type, detail: `${item.object} - ${item.state}`, module: 'identity' }))
    ];
    return records;
  }

  function renderCommandResults(term = '') {
    const query = term.trim().toLowerCase();
    const results = commandIndex().filter((item) => `${item.kind} ${item.id} ${item.title} ${item.detail}`.toLowerCase().includes(query)).slice(0, 16);
    commandResults.innerHTML = results.length ? results.map((item, index) => `<button class="command-result ${index === 0 ? 'selected' : ''}" type="button" data-command-module="${escapeHtml(item.module)}"><span>${escapeHtml(item.kind.slice(0, 2).toUpperCase())}</span><span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.detail)}</small></span><code>${escapeHtml(item.kind)}</code></button>`).join('') : '<div class="empty-state"><div><strong>No matching record</strong><span>Search by module, tag, alarm, recipe, requirement or asset.</span></div></div>';
  }

  function openCommandPalette() {
    renderCommandResults('');
    commandDialog.showModal();
    commandInput.value = '';
    requestAnimationFrame(() => commandInput.focus());
  }

  function renderNotificationDrawer() {
    if (notificationDrawer) notificationDrawer.remove();
    notificationDrawer = document.createElement('section');
    notificationDrawer.className = 'notification-drawer';
    notificationDrawer.setAttribute('aria-label', 'Notifications');
    notificationDrawer.innerHTML = `<header><h2>Notifications</h2><button class="icon-button" type="button" data-action="close-notifications" aria-label="Close notifications">${icon('close')}</button></header>${state.notifications.length ? state.notifications.map((item) => `<div class="notification-row"><i class="status-dot ${item.type === 'warning' ? 'is-warning' : 'is-good'}"></i><div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.detail)}</span></div></div>`).join('') : '<div class="empty-state"><div><strong>No notifications</strong><span>Actionable system notices will appear here.</span></div></div>'}`;
    document.body.append(notificationDrawer);
    state.notifications.forEach((item) => { item.unread = false; });
    saveState();
    const countElement = document.querySelector('#notificationCount');
    if (countElement) countElement.hidden = true;
  }

  function closeNotifications() {
    if (notificationDrawer) {
      notificationDrawer.remove();
      notificationDrawer = null;
    }
  }

  function toggleTheme() {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem(THEME_KEY, next);
    render();
    showToast('Colour theme changed', `${next[0].toUpperCase()}${next.slice(1)} theme is active.`, 'good');
  }

  function toggleDensity() {
    const root = document.documentElement;
    const next = root.dataset.density === 'compact' ? 'comfortable' : 'compact';
    root.dataset.density = next;
    localStorage.setItem(DENSITY_KEY, next);
    render();
    showToast('Information density changed', `${next[0].toUpperCase()}${next.slice(1)} density is active.`, 'good');
  }

  function syncProcessTags() {
    const values = new Map([
      ['LT-101.PV', state.process.tankLevelPct],
      ['TT-101.PV', state.process.temperatureC],
      ['FT-101.PV', state.process.flowLMin],
      ['AIT-201.PV', state.process.conductivityMSCm],
      ['PT-101.PV', state.process.pressureKPa],
      ['AG-101.SPEED', state.process.agitatorRpm]
    ]);
    state.tags.forEach((item) => {
      if (values.has(item.id)) item.value = values.get(item.id);
    });
    const heartbeat = state.tags.find((item) => item.id === 'SYS.HEARTBEAT');
    if (heartbeat && state.process.state !== 'FAULT') heartbeat.value = Number(heartbeat.value || 0) + 1;
  }

  function updateProcessValues(phaseState) {
    const progress = state.process.progress / 100;
    const p = state.process;
    switch (phaseState) {
      case 'CHARGE_WATER':
        p.flowLMin = 82 + Math.sin(p.simulatedTimeS / 2) * 4;
        p.tankLevelPct = Math.min(68, p.tankLevelPct + 0.55);
        p.agitatorRpm = 0;
        break;
      case 'DOSE_CONCENTRATE':
        p.flowLMin = 24 + Math.sin(p.simulatedTimeS / 2) * 2;
        p.tankLevelPct = Math.min(80, p.tankLevelPct + 0.24);
        p.agitatorRpm = 260;
        break;
      case 'MIX':
        p.flowLMin = 0;
        p.agitatorRpm = 820;
        p.temperatureC = Math.min(31, p.temperatureC + 0.08);
        break;
      case 'HEAT':
        p.flowLMin = 0;
        p.agitatorRpm = 620;
        p.temperatureC = Math.min(68, p.temperatureC + 0.65);
        break;
      case 'HOLD':
        p.flowLMin = 0;
        p.agitatorRpm = 520;
        p.temperatureC = 68 + Math.sin(p.simulatedTimeS / 3) * 0.25;
        break;
      case 'TRANSFER':
        p.flowLMin = 72 + Math.sin(p.simulatedTimeS / 2) * 3;
        p.agitatorRpm = 240;
        p.tankLevelPct = Math.max(6, p.tankLevelPct - 0.95);
        break;
      case 'CIP_PRE_RINSE':
        p.flowLMin = 128;
        p.agitatorRpm = 300;
        p.conductivityMSCm = Math.max(0.8, p.conductivityMSCm - 0.04);
        break;
      case 'CIP_CAUSTIC':
        p.flowLMin = 142;
        p.agitatorRpm = 360;
        p.temperatureC = Math.min(72, p.temperatureC + 0.75);
        p.conductivityMSCm = Math.min(68, p.conductivityMSCm + 1.7);
        break;
      case 'CIP_INTERMEDIATE_RINSE':
        p.flowLMin = 136;
        p.agitatorRpm = 320;
        p.conductivityMSCm = Math.max(5, p.conductivityMSCm - 2.4);
        break;
      case 'CIP_FINAL_RINSE':
        p.flowLMin = 122;
        p.agitatorRpm = 260;
        p.conductivityMSCm = Math.max(0.7, p.conductivityMSCm - 0.48);
        break;
      default:
        p.flowLMin = 0;
        p.agitatorRpm = 0;
    }
    p.pressureKPa = 101.3 + (p.flowLMin / 150) * 6 + Math.sin(p.simulatedTimeS / 4) * 0.35;
    p.displayState = prettyState(p.state);
    const last = state.trend[state.trend.length - 1] || { t: 0 };
    state.trend.push({
      t: Number(last.t || 0) + 1,
      level: Number(p.tankLevelPct.toFixed(2)),
      temperature: Number(p.temperatureC.toFixed(2)),
      flow: Number(p.flowLMin.toFixed(2)),
      conductivity: Number(p.conductivityMSCm.toFixed(2))
    });
    state.trend = state.trend.slice(-120);
    syncProcessTags();
    void progress;
  }

  function advanceSequence() {
    const phases = activeSequence();
    const activeIndex = phases.findIndex((phase) => phase.status === 'active');
    if (activeIndex < 0) return;
    phases[activeIndex].status = 'complete';
    const next = phases[activeIndex + 1];
    if (next) {
      next.status = 'active';
      state.process.state = next.state;
      state.process.displayState = prettyState(next.state);
      state.process.phase = next.name;
      state.process.progress = 0;
      addEvent('Control', `${phases[activeIndex].name} completed; ${next.name} started`, 'Sequence', 'Runtime');
      return;
    }
    const completedMode = state.process.mode;
    if (completedMode === 'Production') {
      state.process.batchCount += 1;
      state.batches.unshift({
        id: state.process.activeBatch || `BATCH-LOCAL-${String(state.process.batchCount).padStart(3, '0')}`,
        order: state.orders.find((order) => order.status === 'Running')?.id || 'Local reference order',
        recipe: 'RCP-PROD-001 v3.2',
        unit: 'UNIT-MIX-01',
        started: 'Local session',
        ended: timeString(),
        status: 'Complete',
        yield: `${number(Math.max(0, state.process.tankLevelPct * 10), 0)} L`,
        lot: `FG-LOCAL-${String(state.process.batchCount).padStart(3, '0')}`,
        review: 'Pending review'
      });
      state.batches = state.batches.slice(0, 20);
    } else if (completedMode === 'CIP') {
      state.process.cipCount += 1;
    }
    state.process.state = 'IDLE';
    state.process.displayState = 'IDLE';
    state.process.phase = `${completedMode} complete`;
    state.process.mode = 'None';
    state.process.progress = 100;
    state.process.flowLMin = 0;
    state.process.agitatorRpm = 0;
    state.process.activeBatch = null;
    addEvent('Control', `${completedMode} sequence completed`, 'Sequence', 'Runtime');
    addAudit('Completed sequence', completedMode, 'Deterministic runtime progression', 'Control runtime');
    showToast(`${completedMode} complete`, 'The deterministic sequence returned to IDLE.', 'good');
  }

  function tickProcess() {
    const p = state.process;
    p.simulatedTimeS += 1;
    if (!['IDLE', 'FAULT', 'PAUSED'].includes(p.state)) {
      const phases = activeSequence();
      const phase = phases.find((item) => item.status === 'active');
      if (phase) {
        const step = 100 / Math.max(8, Number(phase.durationS || 20));
        p.progress = Math.min(100, p.progress + step);
        updateProcessValues(phase.state);
        if (p.progress >= 100) advanceSequence();
        saveState('Simulation state saved');
        if (['overview', 'operations', 'hmi-studio', 'historian', 'performance', 'tags-io', 'batch-mes'].includes(activeModule)) render();
      }
    } else if (p.state !== 'FAULT') {
      syncProcessTags();
    }
  }

  function updateClock() {
    const clock = document.querySelector('#statusClock');
    if (!clock) return;
    const formatter = new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Melbourne',
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    clock.textContent = `${formatter.format(new Date())} AET`;
  }

  function actionFromButton(button) {
    const action = button.dataset.action;
    const id = button.dataset.id;
    switch (action) {
      case 'start-production': startProduction(); break;
      case 'start-cip': startCip(); break;
      case 'pause-process': pauseProcess(); break;
      case 'stop-process': stopProcess(); break;
      case 'inject-fault': injectFault(); break;
      case 'reset-process': resetProcess(); break;
      case 'ack-alarm': updateAlarm(id, 'acknowledge'); break;
      case 'shelve-alarm': updateAlarm(id, 'shelve'); break;
      case 'unshelve-alarm': updateAlarm(id, 'unshelve'); break;
      case 'clear-alarm': updateAlarm(id, 'clear'); break;
      case 'validate-program': validateControlProgram(); break;
      case 'run-scan': runControlScan(); break;
      case 'hmi-preview-idle': setHmiPreview('idle'); break;
      case 'hmi-preview-running': setHmiPreview('running'); break;
      case 'hmi-preview-fault': setHmiPreview('fault'); break;
      case 'release-order': releaseOrder(id); break;
      case 'complete-order': completeOrder(id); break;
      case 'execute-test': executeTest(id); break;
      case 'execute-all-tests': executeAllTests(); break;
      case 'complete-work-order': completeWorkOrder(id); break;
      case 'create-work-order': createWorkOrder(); break;
      case 'run-security-assessment': runSecurityAssessment(); break;
      case 'advance-security-control': advanceSecurityControl(id); break;
      case 'build-release-package': buildReleasePackage(); break;
      case 'compare-environment': compareEnvironment(id); break;
      case 'advance-migration-screen': advanceMigrationScreen(id); break;
      case 'simulate-tag-quality': simulateTagQuality(); break;
      case 'test-connection': testConnection(id); break;
      case 'append-trend-sample': appendTrendSample(); break;
      case 'recalculate-oee': recalculateOee(); break;
      case 'test-interface': testInterface(id); break;
      case 'replay-interface': replayInterface(id); break;
      case 'advance-movement': advanceMovement(id); break;
      case 'sign-record': signRecord(id); break;
      case 'export-workspace': exportWorkspace(); break;
      case 'open-workspace-import': workspaceImport.click(); break;
      case 'open-migration-import': migrationImport.click(); break;
      case 'request-reset': confirmDialog.showModal(); break;
      case 'cancel-reset': confirmDialog.close(); break;
      case 'confirm-reset': resetWorkspace(); break;
      case 'toggle-theme': toggleTheme(); break;
      case 'toggle-density': toggleDensity(); break;
      case 'close-notifications': closeNotifications(); break;
      default:
        if (action?.startsWith('export-')) exportByAction(action);
    }
  }

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const moduleButton = target.closest('[data-module]');
    if (moduleButton) {
      event.preventDefault();
      navigate(moduleButton.dataset.module, { docTarget: moduleButton.dataset.docTarget });
      return;
    }
    const commandButton = target.closest('[data-command-module]');
    if (commandButton) {
      commandDialog.close();
      navigate(commandButton.dataset.commandModule);
      return;
    }
    const screenButton = target.closest('[data-screen-id]');
    if (screenButton) {
      activeScreenId = screenButton.dataset.screenId;
      render();
      return;
    }
    const documentButton = target.closest('[data-doc-section]');
    if (documentButton) {
      docsSection = documentButton.dataset.docSection;
      render();
      return;
    }
    const controlButton = target.closest('[data-control-view]');
    if (controlButton) {
      controlView = controlButton.dataset.controlView;
      render();
      return;
    }
    const trendButton = target.closest('[data-trend-series]');
    if (trendButton) {
      const series = trendButton.dataset.trendSeries;
      if (historianSeries.includes(series) && historianSeries.length > 1) historianSeries = historianSeries.filter((item) => item !== series);
      else if (!historianSeries.includes(series)) historianSeries = [...historianSeries, series].slice(-4);
      render();
      return;
    }
    const actionButton = target.closest('[data-action]');
    if (actionButton) actionFromButton(actionButton);
  });

  document.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
    if (target.id === 'commandInput') renderCommandResults(target.value);
    if (target.id === 'controlEditor') {
      state.controlProgram.code = target.value;
      const numbers = document.querySelector('#controlLineNumbers');
      if (numbers) numbers.innerHTML = lineNumbers(target.value);
      saveState('Control program changed locally');
    }
    if (target.id === 'hmiFilter') {
      hmiFilter = target.value;
      updateHmiRows();
    }
    if (target.id === 'tagFilter') {
      tagFilter = target.value;
      render();
      const input = document.querySelector('#tagFilter');
      if (input) {
        input.focus();
        input.setSelectionRange(tagFilter.length, tagFilter.length);
      }
    }
  });

  document.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    if (target.id === 'tagQualityFilter') {
      tagQualityFilter = target.value;
      render();
    }
    if (target.id === 'alarmFilter') {
      alarmFilter = target.value;
      render();
    }
  });

  navToggle.addEventListener('click', () => {
    if (moduleNav.dataset.open === 'true') closeNavigation();
    else openNavigation();
  });
  navScrim.addEventListener('click', closeNavigation);
  document.querySelector('#commandTrigger').addEventListener('click', openCommandPalette);
  document.querySelector('#themeToggle').addEventListener('click', toggleTheme);
  document.querySelector('#notificationButton').addEventListener('click', () => {
    if (notificationDrawer) closeNotifications();
    else renderNotificationDrawer();
  });

  commandDialog.addEventListener('click', (event) => {
    if (event.target === commandDialog) commandDialog.close();
  });
  commandInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const first = commandResults.querySelector('[data-command-module]');
      if (first) first.click();
    }
  });
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openCommandPalette();
    }
    if (event.key === 'Escape') closeNotifications();
  });

  workspaceImport.addEventListener('change', () => {
    const file = workspaceImport.files?.[0];
    if (file) void importWorkspace(file);
  });
  migrationImport.addEventListener('change', () => {
    const file = migrationImport.files?.[0];
    if (file) void importMigration(file);
  });

  window.addEventListener('hashchange', () => {
    const next = normaliseModule(location.hash.slice(1) || 'overview');
    if (next !== activeModule) {
      activeModule = next;
      render();
    }
  });
  window.addEventListener('resize', () => requestAnimationFrame(() => afterRender(renderToken)), { passive: true });

  const savedTheme = localStorage.getItem(THEME_KEY);
  const savedDensity = localStorage.getItem(DENSITY_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') document.documentElement.dataset.theme = savedTheme;
  if (savedDensity === 'compact' || savedDensity === 'comfortable') document.documentElement.dataset.density = savedDensity;

  render();
  updateClock();
  setInterval(updateClock, 1000);
  setInterval(tickProcess, 1000);

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
})();
