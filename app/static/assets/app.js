/* ==========================================================================
   BSR Market Intelligence Platform — Final Official UI/UX Prototype Application
   Dark Mode Theme & High-Tech Financial Charting Engine
   7 Functional Pages + Dedicated AI Workspace + Non-disruptive Slide-over Drawer
   ========================================================================== */

(function () {
  'use strict';
  const D = window.DEMO;

  /* State Management */
  const state = {
    role: 'leadership',
    route: 'overview',
    lastRoute: 'overview',
    sidebarCollapsed: false,
    dateFilter: '14/11/2026',
    
    /* Theme & Overview State */
    theme: localStorage.getItem('bsr_theme') || 'light',
    overviewTab: 'all',
    activeOverviewInstrument: 'brent_physical',
    overviewChartRange: '1M',
    
    /* Market Data Page State */
    selectedInstruments: ['brent_physical', 'crack_gasoline_physical'],
    activeChartInstrument: 'brent_physical',
    chartMode: 'multiaxis', // 'multiaxis' | 'normalized'
    chartRange: '1M',       // '1D' | '1W' | '1M' | '3M' | '1Y'
    chartFreq: 'daily',     // 'intraday' | 'daily' | 'weekly'
    hoverChartIndex: null,  // Interactive crosshair point index
    
    /* Reports & Video Briefing State */
    reportsTab: 'all',
    videoPlaying: false,
    videoCurrentTime: 0,
    videoSpeed: '1.0x',
    activeChapter: 0,
    
    /* Forecast & AI Recommendations State */
    forecastFilterInstrument: 'all',
    forecastFilterSource: 'all',
    forecastFilterHorizon: '1M',
    recCategoryFilter: 'all',
    
    /* Data & News Ingestion State (Split View) */
    ingestionTab: 'quick_text', // 'quick_text' | 'upload_file' | 'quick_price'
    ingestionNewsFilter: 'all',
    
    /* Source Scorecard State */
    sourcePeriodFilter: '6M',
    sourceMarketFilter: 'all',
    
    /* Administration State */
    adminTab: 'sources', // 'sources' | 'formulas' | 'users' | 'audit' | 'ai_observability'
    
    /* Dedicated AI Workspace State */
    aiActiveThreadId: 'TH-01',
    aiDraftPrompt: '',
    aiDraftSecurity: 'Restricted',
    
    /* Drawer & Modal Overlays */
    drawerOpen: false,
    drawerType: null, // 'physical_entry' | 'quick_news' | 'excel_upload' | 'news_detail' | 'report_preview' | 'event_detail'
    drawerData: null,
    modalOpen: false,
    modalType: null,
    modalData: null,
    
    /* Embedded Copilot Widget State */
    copilotDraft: '',
    copilotResponses: [
      {
        prompt: 'Tạo báo cáo nhanh biến động Physical & Crack hôm nay',
        response: 'Đã tổng hợp số liệu 14/11:\n• Brent Physical $77.90/thùng (+1.04%)\n• Crack RON95 đạt đỉnh 4 tuần ở $14.20/thùng (+2.53%)\n• Tồn kho Dung Quất an toàn 285.000 tấn. Nhấn "Mở rộng ↗" để xem dự thảo báo cáo đầy đủ.'
      }
    ]
  };

  /* Helper functions */
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const esc = (v) =>
    String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));

  const fmtNum = (v, decimals = 2) =>
    v == null ? '—' : Number(v).toLocaleString('vi-VN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

  const fmtSigned = (v, decimals = 2) =>
    v == null ? '—' : `${v > 0 ? '+' : ''}${fmtNum(v, decimals)}`;

  const fmtPct = (v) =>
    v == null ? '—' : `${v > 0 ? '+' : ''}${fmtNum(v, 2)}%`;

  const getRole = () => D.roles[state.role] || D.roles.leadership;

  const canSeeRestricted = () => getRole().viewRestricted;

  /* SVG Icons Set */
  const ICONS = {
    overview: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>',
    marketData: '<path d="M3 19h18M5 16V8M10 16V5M15 16v-6M20 16V9"/>',
    reports: '<path d="M6 3h9l4 4v14H6zM15 3v5h4M9 13h7M9 17h7"/>',
    forecast: '<path d="M3 17l5-6 4 3 6-8M16 6h4v4"/>',
    ingestion: '<path d="M12 16V4M7 9l5-5 5 5M5 21h14"/>',
    sources: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
    assistant: '<path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8zM19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9z"/>',
    admin: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>',
    bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    chevron: '<path d="M9 18l6-6-6-6"/>',
    chevronLeft: '<path d="M15 18l-6-6 6-6"/>',
    close: '<path d="M5 5l14 14M19 5L5 19"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    expand: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
    play: '<polygon points="5 3 19 12 5 21 5 3"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    check: '<path d="M4 12l5 5L20 6"/>',
    sparkle: '<path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    arrowBack: '<path d="M19 12H5M12 19l-7-7 7-7"/>'
  };

  function ico(name, size = 16) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.overview}</svg>`;
  }

  function showToast(message) {
    const stack = $('#toast-stack');
    if (!stack) return;
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `${ico('check', 16)} <span>${esc(message)}</span>`;
    stack.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 4000);
  }

  /* ==========================================================================
     BEAUTIFUL SMOOTH BEZIER CHART ENGINE (CURVES + GRADIENTS + GLOW)
     ========================================================================== */
  function getSmoothPath(points) {
    if (!points || !points.length) return '';
    if (points.length === 1) return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }

  /* Mini Sparkline with Smooth Gradient & Sleek Beacon Dot (Apple Stocks / Stripe Grade) */
  function renderSparklineSvg(spark, isPos = true, height = 42) {
    if (!spark || !spark.length) return '';
    const W = 240, H = height;
    const pad = { t: 6, b: 6, l: 4, r: 6 };
    const values = spark.map(p => p.value);
    const min = Math.min(...values), max = Math.max(...values);
    const span = max - min || 1;
    const pts = spark.map((pt, i) => ({
      x: pad.l + (i / (spark.length - 1)) * (W - pad.l - pad.r),
      y: pad.t + (1 - (pt.value - min) / span) * (H - pad.t - pad.b)
    }));

    const pathD = getSmoothPath(pts);
    const areaD = `${pathD} L ${pts[pts.length - 1].x.toFixed(1)} ${H} L ${pts[0].x.toFixed(1)} ${H} Z`;
    const strokeColor = isPos ? 'var(--pos-green)' : 'var(--neg-red)';
    const gradId = `spark-grad-${Math.random().toString(36).substr(2, 6)}`;
    const lastPt = pts[pts.length - 1];

    return `
      <svg class="sparkline-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.18"/>
            <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <path d="${areaD}" fill="url(#${gradId})"/>
        <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="${lastPt.x.toFixed(1)}" cy="${lastPt.y.toFixed(1)}" r="3.5" fill="${strokeColor}" stroke="var(--bg-card)" stroke-width="2"/>
      </svg>
    `;
  }
  /* Single Series In-Place Chart (TradingView / Apple Stocks Grade) */
  function renderCleanChartSvg({ series, name1 = 'Giá trị', unit1 = '', decimals1 = 2, range = '1M', color1 = '#007A87', height = 260, chartId = 'clean-chart' }) {
    const W = 900, H = height;
    const pad = { l: 65, r: 35, t: 25, b: 35 };
    const pointsCount = range === '1D' ? 14 : range === '1W' ? 20 : range === '1M' ? 30 : range === '3M' ? 60 : 90;
    const rawData = (series || []).slice(-pointsCount);
    if (!rawData.length) return '<div class="empty-state">Không có dữ liệu cho khoảng thời gian này</div>';

    const values = rawData.map(d => d.value);
    const minVal = Math.min(...values) * 0.99;
    const maxVal = Math.max(...values) * 1.01;
    const span = maxVal - minVal || 1;

    const pts = rawData.map((pt, i) => ({
      x: pad.l + (i / (rawData.length - 1)) * (W - pad.l - pad.r),
      y: pad.t + (1 - (pt.value - minVal) / span) * (H - pad.t - pad.b),
      date: pt.date,
      value: pt.value
    }));

    const pathD = getSmoothPath(pts);
    const areaD = `${pathD} L ${pts[pts.length - 1].x.toFixed(1)} ${H - pad.b} L ${pts[0].x.toFixed(1)} ${H - pad.b} Z`;
    const gradId = `clean-chart-grad-${chartId}`;
    const glowId = `clean-chart-glow-${chartId}`;
    const lastPt = pts[pts.length - 1];

    /* Horizontal gridlines (3 clean dashed lines) */
    let gridLines = '', yLabels = '';
    for (let i = 0; i <= 2; i++) {
      const gy = pad.t + (i / 2) * (H - pad.t - pad.b);
      const v = maxVal - (i / 2) * (maxVal - minVal);
      gridLines += `<line x1="${pad.l}" y1="${gy.toFixed(1)}" x2="${(W - pad.r).toFixed(1)}" y2="${gy.toFixed(1)}" stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="3,3"/>`;
      yLabels += `<text x="${pad.l - 12}" y="${(gy + 4).toFixed(1)}" font-size="11" font-family="var(--font-mono)" fill="var(--text-muted)" text-anchor="end" font-weight="600">${fmtNum(v, decimals1)}</text>`;
    }

    /* X Axis dates (5 clean points) */
    let xLabels = '';
    const dateIntervals = [0, Math.floor(pts.length * 0.25), Math.floor(pts.length * 0.5), Math.floor(pts.length * 0.75), pts.length - 1];
    dateIntervals.forEach(idx => {
      const p = pts[idx];
      if (!p) return;
      const dStr = p.date ? new Date(p.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : `T-${idx}`;
      xLabels += `<text x="${p.x.toFixed(1)}" y="${H - 12}" font-size="10.5" fill="var(--text-muted)" text-anchor="middle" font-weight="500">${dStr}</text>`;
      xLabels += `<line x1="${p.x.toFixed(1)}" y1="${H - pad.b}" x2="${p.x.toFixed(1)}" y2="${H - pad.b + 4}" stroke="var(--chart-grid)" stroke-width="1"/>`;
    });

    const activeIdx = state.hoverChartIndex != null ? Math.min(state.hoverChartIndex, pts.length - 1) : pts.length - 1;
    const curP = pts[activeIdx];
    const tooltipX = Math.max(pad.l + 65, Math.min(curP.x, W - pad.r - 65));

    return `
      <div class="clean-chart-container" style="position:relative">
        <svg class="chart-svg-main" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
          <defs>
            <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${color1}" stop-opacity="0.22"/>
              <stop offset="60%" stop-color="${color1}" stop-opacity="0.05"/>
              <stop offset="100%" stop-color="${color1}" stop-opacity="0.0"/>
            </linearGradient>
            <filter id="${glowId}" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="${color1}" flood-opacity="0.25"/>
            </filter>
          </defs>

          ${gridLines}
          ${yLabels}
          ${xLabels}

          <!-- Area under curve -->
          <path d="${areaD}" fill="url(#${gradId})"/>
          <!-- Smooth Line -->
          <path d="${pathD}" fill="none" stroke="${color1}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" filter="url(#${glowId})"/>

          <!-- Beacon dot at latest point -->
          <circle cx="${lastPt.x.toFixed(1)}" cy="${lastPt.y.toFixed(1)}" r="8" fill="${color1}" fill-opacity="0.25"/>
          <circle cx="${lastPt.x.toFixed(1)}" cy="${lastPt.y.toFixed(1)}" r="4.5" fill="#FFFFFF" stroke="${color1}" stroke-width="2.5"/>

          <!-- Interactive Hover Hairline -->
          <line x1="${curP.x.toFixed(1)}" y1="${pad.t}" x2="${curP.x.toFixed(1)}" y2="${H - pad.b}" stroke="var(--text-muted)" stroke-width="1.2" stroke-dasharray="3,3" opacity="0.6"/>
          <circle cx="${curP.x.toFixed(1)}" cy="${curP.y.toFixed(1)}" r="5.5" fill="${color1}" stroke="#FFFFFF" stroke-width="2"/>

          <!-- Floating Tooltip Badge -->
          <g transform="translate(${tooltipX.toFixed(1)}, ${(Math.max(curP.y - 42, pad.t + 10)).toFixed(1)})">
            <rect x="-70" y="-14" width="140" height="28" rx="6" fill="var(--chart-tooltip-bg)" stroke="var(--border-card)" stroke-width="1"/>
            <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="700" fill="var(--chart-tooltip-text)">
              ${fmtNum(curP.value, decimals1)} ${esc(unit1)} (${curP.date ? new Date(curP.date).toLocaleDateString('vi-VN', {day:'2-digit', month:'2-digit'}) : 'Hôm nay'})
            </text>
          </g>
        </svg>
      </div>
    `;
  }

  /* Multi-Axis Time Series Chart Generator (Dual Y-Axis, Clean & High-Tech) */
  function renderMultiAxisChart(instrumentsToDraw, mode = 'multiaxis', range = '1M') {
    const W = 900, H = 280;
    const pad = { l: 65, r: 65, t: 25, b: 35 };
    const inst1 = instrumentsToDraw[0];
    const inst2 = instrumentsToDraw[1];

    if (!inst1) return '<div class="empty-state">Vui lòng chọn ít nhất một chỉ số để vẽ biểu đồ</div>';

    const pointsCount = range === '1D' ? 14 : range === '1W' ? 20 : range === '1M' ? 30 : range === '3M' ? 60 : 90;
    const rawData1 = (inst1.series || []).slice(-pointsCount);
    const rawData2 = inst2 ? (inst2.series || []).slice(-pointsCount) : null;

    const values1 = rawData1.map(d => d.value);
    const min1 = Math.min(...values1) * 0.99;
    const max1 = Math.max(...values1) * 1.01;

    const values2 = rawData2 ? rawData2.map(d => d.value) : [];
    const min2 = rawData2 ? Math.min(...values2) * 0.99 : 0;
    const max2 = rawData2 ? Math.max(...values2) * 1.01 : 100;

    const pts1 = rawData1.map((pt, i) => ({
      x: pad.l + (i / (rawData1.length - 1)) * (W - pad.l - pad.r),
      y: pad.t + (1 - (pt.value - min1) / (max1 - min1 || 1)) * (H - pad.t - pad.b),
      date: pt.date,
      value: pt.value
    }));

    const pts2 = rawData2 ? rawData2.map((pt, i) => ({
      x: pad.l + (i / (rawData2.length - 1)) * (W - pad.l - pad.r),
      y: pad.t + (1 - (pt.value - min2) / (max2 - min2 || 1)) * (H - pad.t - pad.b),
      date: pt.date,
      value: pt.value
    })) : null;

    const path1 = getSmoothPath(pts1);
    const area1 = `${path1} L ${pts1[pts1.length - 1].x.toFixed(1)} ${H - pad.b} L ${pts1[0].x.toFixed(1)} ${H - pad.b} Z`;

    const path2 = pts2 ? getSmoothPath(pts2) : '';
    const area2 = pts2 ? `${path2} L ${pts2[pts2.length - 1].x.toFixed(1)} ${H - pad.b} L ${pts2[0].x.toFixed(1)} ${H - pad.b} Z` : '';

    /* Grid lines & Y Axis Labels (3 horizontal lines) */
    let gridLines = '', yLabels = '';
    for (let i = 0; i <= 2; i++) {
      const gy = pad.t + (i / 2) * (H - pad.t - pad.b);
      const v1 = max1 - (i / 2) * (max1 - min1);
      gridLines += `<line x1="${pad.l}" y1="${gy.toFixed(1)}" x2="${(W - pad.r).toFixed(1)}" y2="${gy.toFixed(1)}" stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="3,3"/>`;
      yLabels += `<text x="${pad.l - 12}" y="${(gy + 4).toFixed(1)}" font-size="11" font-family="var(--font-mono)" fill="var(--accent-teal)" text-anchor="end" font-weight="700">${fmtNum(v1, inst1.decimals)}</text>`;
      if (inst2 && mode === 'multiaxis') {
        const v2 = max2 - (i / 2) * (max2 - min2);
        yLabels += `<text x="${(W - pad.r + 12).toFixed(1)}" y="${(gy + 4).toFixed(1)}" font-size="11" font-family="var(--font-mono)" fill="var(--accent-gold)" text-anchor="start" font-weight="700">${fmtNum(v2, inst2.decimals)}</text>`;
      }
    }

    /* X Axis Dates */
    let xLabels = '';
    const dateIntervals = [0, Math.floor(pts1.length * 0.25), Math.floor(pts1.length * 0.5), Math.floor(pts1.length * 0.75), pts1.length - 1];
    dateIntervals.forEach(idx => {
      const p = pts1[idx];
      if (!p) return;
      const dStr = p.date ? new Date(p.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : `T-${idx}`;
      xLabels += `<text x="${p.x.toFixed(1)}" y="${H - 12}" font-size="10.5" fill="var(--text-muted)" text-anchor="middle" font-weight="500">${dStr}</text>`;
      xLabels += `<line x1="${p.x.toFixed(1)}" y1="${H - pad.b}" x2="${p.x.toFixed(1)}" y2="${H - pad.b + 4}" stroke="var(--chart-grid)" stroke-width="1"/>`;
    });

    const activeIdx = state.hoverChartIndex != null ? Math.min(state.hoverChartIndex, pts1.length - 1) : pts1.length - 1;
    const curP1 = pts1[activeIdx];
    const curP2 = pts2 ? pts2[activeIdx] : null;

    return `
      <!-- Top HUD Data Bar -->
      <div class="clean-chart-hud">
        <div style="display:flex;align-items:center;gap:20px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="width:10px;height:10px;border-radius:50%;background:var(--accent-teal);box-shadow:0 0 6px var(--accent-teal)"></span>
            <strong style="color:var(--text-main);font-size:12.5px">${esc(inst1.name)}:</strong>
            <span style="font-family:var(--font-mono);font-size:14px;font-weight:800;color:var(--accent-teal)">${fmtNum(curP1.value, inst1.decimals)}</span>
            <span style="font-size:11px;color:var(--text-muted)">${esc(inst1.unit)}</span>
          </div>

          ${inst2 ? `
            <div style="display:flex;align-items:center;gap:8px">
              <span style="width:10px;height:10px;border-radius:50%;background:var(--accent-gold);box-shadow:0 0 6px var(--accent-gold)"></span>
              <strong style="color:var(--text-main);font-size:12.5px">${esc(inst2.name)}:</strong>
              <span style="font-family:var(--font-mono);font-size:14px;font-weight:800;color:var(--accent-gold)">${fmtNum(curP2.value, inst2.decimals)}</span>
              <span style="font-size:11px;color:var(--text-muted)">${esc(inst2.unit)}</span>
            </div>
          ` : ''}
        </div>

        <div style="font-size:11.5px;color:var(--text-muted)">
          📅 Ngày dữ liệu: <strong style="color:var(--text-main)">${curP1.date ? new Date(curP1.date).toLocaleDateString('vi-VN') : '14/11/2026'}</strong>
        </div>
      </div>

      <svg class="chart-svg-main" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="multi-grad-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent-teal)" stop-opacity="0.20"/>
            <stop offset="60%" stop-color="var(--accent-teal)" stop-opacity="0.04"/>
            <stop offset="100%" stop-color="var(--accent-teal)" stop-opacity="0.0"/>
          </linearGradient>
          <linearGradient id="multi-grad-2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent-gold)" stop-opacity="0.16"/>
            <stop offset="60%" stop-color="var(--accent-gold)" stop-opacity="0.03"/>
            <stop offset="100%" stop-color="var(--accent-gold)" stop-opacity="0.0"/>
          </linearGradient>
          <filter id="multi-glow-1" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="var(--accent-teal)" flood-opacity="0.25"/>
          </filter>
        </defs>

        ${gridLines}
        ${yLabels}
        ${xLabels}

        <path d="${area1}" fill="url(#multi-grad-1)"/>
        <path d="${path1}" fill="none" stroke="var(--accent-teal)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" filter="url(#multi-glow-1)"/>

        ${pts2 ? `
          <path d="${area2}" fill="url(#multi-grad-2)"/>
          <path d="${path2}" fill="none" stroke="var(--accent-gold)" stroke-width="2.2" stroke-dasharray="5,3" stroke-linecap="round" stroke-linejoin="round"/>
        ` : ''}

        <!-- Hover Hairline Indicator -->
        <line x1="${curP1.x.toFixed(1)}" y1="${pad.t}" x2="${curP1.x.toFixed(1)}" y2="${H - pad.b}" stroke="var(--text-muted)" stroke-width="1.2" stroke-dasharray="3,3" opacity="0.6"/>
        <circle cx="${curP1.x.toFixed(1)}" cy="${curP1.y.toFixed(1)}" r="5.5" fill="var(--accent-teal)" stroke="#FFFFFF" stroke-width="2"/>
        ${curP2 ? `
          <circle cx="${curP2.x.toFixed(1)}" cy="${curP2.y.toFixed(1)}" r="5" fill="var(--accent-gold)" stroke="#FFFFFF" stroke-width="2"/>
        ` : ''}
      </svg>
    `;
  }
  /* Navigation Structure per Plan */
  function getNavigation() {
    const groups = [
      {
        title: 'NGHIỆP VỤ THỊ TRƯỜNG',
        items: [
          { id: 'overview', label: '1. Tổng quan thị trường', icon: 'overview' },
          { id: 'market-data', label: '2. Dữ liệu thị trường', icon: 'marketData' },
          { id: 'reports', label: '3. Báo cáo & Bản tin Video', icon: 'reports' },
          { id: 'forecast', label: '4. Đánh giá Dự báo & Khuyến nghị', icon: 'forecast' },
          { id: 'ingestion', label: '5. Nhập liệu & Tin tức', icon: 'ingestion' },
          { id: 'sources', label: '6. Đánh giá Nguồn tin', icon: 'sources' }
        ]
      },
      {
        title: 'TRỢ LÝ CHUYÊN SÂU',
        items: [
          { id: 'assistant', label: 'Trợ lý Thị trường BSR', icon: 'assistant', isAI: true }
        ]
      }
    ];

    if (getRole().admin) {
      groups.push({
        title: 'QUẢN TRỊ HỆ THỐNG',
        items: [
          { id: 'admin', label: '7. Quản trị hệ thống', icon: 'admin' }
        ]
      });
    }
    return groups;
  }

  /* ==========================================================================
     PAGE RENDERERS
     ========================================================================== */

  /* TRANG 1: TỔNG QUAN THỊ TRƯỜNG */
  function renderOverviewPage() {
    const canRestricted = canSeeRestricted();
    
    let list = D.instruments;
    if (state.overviewTab === 'priority') list = list.filter(i => i.isPriority);
    else if (state.overviewTab === 'crude') list = list.filter(i => i.subgroup === 'Dầu thô');
    else if (state.overviewTab === 'products') list = list.filter(i => i.subgroup === 'Sản phẩm lọc dầu');
    else if (state.overviewTab === 'crack') list = list.filter(i => i.subgroup === 'Crack Spread');
    else if (state.overviewTab === 'ops') list = list.filter(i => i.subgroup === 'Vận hành & Tồn kho');
    else if (state.overviewTab === 'fx') list = list.filter(i => i.subgroup === 'Tỷ giá');

    const priorityItems = list.filter(i => i.isPriority);
    const referenceItems = list.filter(i => !i.isPriority);

    const morning = D.morningDigest;
    const pulse = D.livePulse;

    // Active instrument for In-Place Chart
    const activeInstId = state.activeOverviewInstrument || 'brent_physical';
    const activeInst = D.instruments.find(i => i.id === activeInstId) || D.instruments[0];
    const canViewActive = activeInst.classification !== 'Restricted' || canRestricted;

    return `
      <!-- TẦNG 1: BẢNG CHỈ SỐ THỊ TRƯỜNG ƯU TIÊN & KHUNG BIỂU ĐỒ XEM NHANH TẠI CHỖ -->
      <section style="margin-bottom: 24px;">
        <div class="overview-tab-bar">
          <div class="filter-tabs-pill">
            <button class="pill-btn ${state.overviewTab === 'all' ? 'active' : ''}" data-action="set-overview-tab" data-tab="all">Tất cả chỉ số</button>
            <button class="pill-btn ${state.overviewTab === 'priority' ? 'active' : ''}" data-action="set-overview-tab" data-tab="priority">⭐ Ưu tiên BSR & Physical</button>
            <button class="pill-btn ${state.overviewTab === 'crude' ? 'active' : ''}" data-action="set-overview-tab" data-tab="crude">Dầu thô</button>
            <button class="pill-btn ${state.overviewTab === 'products' ? 'active' : ''}" data-action="set-overview-tab" data-tab="products">Sản phẩm lọc dầu</button>
            <button class="pill-btn ${state.overviewTab === 'crack' ? 'active' : ''}" data-action="set-overview-tab" data-tab="crack">Crack Spread</button>
            <button class="pill-btn ${state.overviewTab === 'ops' ? 'active' : ''}" data-action="set-overview-tab" data-tab="ops">Vận hành & Tồn kho</button>
            <button class="pill-btn ${state.overviewTab === 'fx' ? 'active' : ''}" data-action="set-overview-tab" data-tab="fx">Tỷ giá</button>
          </div>
          <button class="btn btn-primary" data-action="open-drawer" data-drawer-type="physical_entry">
            ${ico('plus')} + Nhập nhanh dữ liệu BSR / Physical
          </button>
        </div>

        <!-- DẢI 1: NHÓM ƯU TIÊN BSR (Thẻ lớn, viền nhấn) -->
        <div class="section-subhead">
          <span>DẢI 1 — NHÓM CHỈ SỐ CỐT LÕI BSR & GIÁ PHYSICAL (ƯU TIÊN HÀNG ĐẦU)</span>
        </div>
        <div class="snapshot-grid-priority">
          ${priorityItems.map(item => {
            const isLocked = item.classification === 'Restricted' && !canRestricted;
            if (isLocked) {
              return `
                <div class="metric-card-locked">
                  <div class="locked-icon-wrap">${ico('lock', 18)}</div>
                  <div class="locked-title">${esc(item.name)}</div>
                  <div class="locked-desc">Yêu cầu quyền truy cập dữ liệu Mật (Restricted)</div>
                  <span class="badge badge-restricted" style="margin-top:8px">Đã ẩn số liệu</span>
                </div>
              `;
            }
            const isActive = item.id === activeInstId;
            return `
              <div class="card card-priority ${isActive ? 'active-instrument' : ''}" data-action="select-overview-instrument" data-inst-id="${item.id}" style="cursor:pointer" title="Bấm để xem biểu đồ chi tiết tại chỗ bên dưới">
                <div class="metric-card-top">
                  <div>
                    <div class="metric-card-name">${esc(item.name)}</div>
                    <div class="metric-card-meta">${esc(item.source)} · ${esc(item.dataStatus)} · ${esc(item.marketTime)}</div>
                  </div>
                  ${item.classification === 'Restricted' ? `<span class="badge badge-restricted">${ico('lock', 10)} Mật 🔒</span>` : ''}
                  ${item.priceType === 'Nội bộ' ? `<span class="badge badge-manual">BSR Nội bộ</span>` : ''}
                  ${item.priceType === 'Tính toán' ? `<span class="badge badge-ai-summary">Công thức BSR</span>` : ''}
                </div>
                <div class="metric-card-value-row">
                  <div>
                    <span class="metric-card-value">${fmtNum(item.value, item.decimals)}</span>
                    <span class="metric-card-unit">${esc(item.unit)}</span>
                  </div>
                  <div class="metric-card-change ${item.change >= 0 ? 'pos' : 'neg'}">
                    ${fmtSigned(item.change, item.decimals)} (${fmtPct(item.pct)})
                  </div>
                </div>
                ${renderSparklineSvg(item.spark, item.change >= 0, 36)}
              </div>
            `;
          }).join('')}
        </div>

        <!-- DẢI 2: NHÓM THAM CHIẾU THỊ TRƯỜNG -->
        ${referenceItems.length ? `
          <div class="section-subhead" style="margin-top: 14px;">
            <span>DẢI 2 — NHÓM THAM CHIẾU THỊ TRƯỜNG & VĨ MÔ (FUTURES & TỶ GIÁ)</span>
          </div>
          <div class="snapshot-grid-reference">
            ${referenceItems.map(item => {
              const isActive = item.id === activeInstId;
              return `
                <div class="card ${isActive ? 'active-instrument' : ''}" data-action="select-overview-instrument" data-inst-id="${item.id}" style="cursor:pointer" title="Bấm để xem biểu đồ chi tiết tại chỗ bên dưới">
                  <div class="metric-card-top">
                    <div>
                      <div class="metric-card-name" style="font-size:12.5px">${esc(item.name)}</div>
                      <div class="metric-card-meta">${esc(item.source)} · ${esc(item.dataStatus)}</div>
                    </div>
                    <span class="badge badge-source">${esc(item.priceType)}</span>
                  </div>
                  <div class="metric-card-value-row">
                    <div>
                      <span class="metric-card-value" style="font-size:20px">${fmtNum(item.value, item.decimals)}</span>
                      <span class="metric-card-unit">${esc(item.unit)}</span>
                    </div>
                    <div class="metric-card-change ${item.change >= 0 ? 'pos' : 'neg'}">
                      ${fmtSigned(item.change, item.decimals)} (${fmtPct(item.pct)})
                    </div>
                  </div>
                  ${renderSparklineSvg(item.spark, item.change >= 0, 32)}
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        <!-- KHUNG BIỂU ĐỒ XEM NHANH TẠI CHỖ (IN-PLACE EXPANDABLE CHART) -->
        <div class="inplace-chart-panel" id="inplace-chart-panel">
          <div class="inplace-chart-header">
            <div class="inplace-chart-title-wrap">
              <span style="font-size:18px">📈</span>
              <div>
                <div class="inplace-chart-title">${esc(activeInst.name)} — Biểu đồ Xu hướng Tại chỗ</div>
                <div style="font-size:11.5px;color:var(--text-muted);display:flex;align-items:center;gap:8px;margin-top:2px">
                  <span>Nguồn: <strong>${esc(activeInst.source)}</strong></span>
                  <span>·</span>
                  <span>Cập nhật: ${esc(activeInst.marketTime)}</span>
                  <span>·</span>
                  <span class="badge ${activeInst.classification === 'Restricted' ? 'badge-restricted' : 'badge-source'}">${esc(activeInst.priceType)}</span>
                </div>
              </div>
            </div>

            <div class="chart-controls-group">
              <div class="chart-range-pills">
                ${['1D', '1W', '1M', '3M', '1Y'].map(r => `
                  <button class="chart-range-btn ${state.overviewChartRange === r ? 'active' : ''}" data-action="set-overview-range" data-range="${r}">${r}</button>
                `).join('')}
              </div>
              <button class="btn btn-outline btn-sm" data-action="nav-market-detail" data-inst-id="${activeInst.id}" style="color:var(--accent-teal);border-color:var(--accent-teal)">
                Xem chi tiết & So sánh đa trục (Market Data) ↗
              </button>
            </div>
          </div>

          ${canViewActive ? `
            ${renderCleanChartSvg({
              series: activeInst.series,
              name1: activeInst.name,
              unit1: activeInst.unit,
              decimals1: activeInst.decimals,
              range: state.overviewChartRange,
              color1: '#007A87',
              height: 220,
              chartId: 'inplace-overview-chart'
            })}
            <div class="inplace-summary-row">
              <div class="inplace-stat-card">
                <span class="inplace-stat-label">Giá hiện tại</span>
                <span class="inplace-stat-val" style="color:var(--accent-teal)">${fmtNum(activeInst.value, activeInst.decimals)} ${esc(activeInst.unit)}</span>
              </div>
              <div class="inplace-stat-card">
                <span class="inplace-stat-label">Giá cao nhất kỳ (${state.overviewChartRange})</span>
                <span class="inplace-stat-val">${fmtNum(Math.max(...(activeInst.series || []).slice(-30).map(d => d.value)), activeInst.decimals)} ${esc(activeInst.unit)}</span>
              </div>
              <div class="inplace-stat-card">
                <span class="inplace-stat-label">Giá thấp nhất kỳ (${state.overviewChartRange})</span>
                <span class="inplace-stat-val">${fmtNum(Math.min(...(activeInst.series || []).slice(-30).map(d => d.value)), activeInst.decimals)} ${esc(activeInst.unit)}</span>
              </div>
              <div class="inplace-stat-card">
                <span class="inplace-stat-label">Biến động so với phiên trước</span>
                <span class="inplace-stat-val ${activeInst.change >= 0 ? 'pos' : 'neg'}" style="color:${activeInst.change >= 0 ? 'var(--pos-green)' : 'var(--neg-red)'}">
                  ${fmtSigned(activeInst.change, activeInst.decimals)} (${fmtPct(activeInst.pct)})
                </span>
              </div>
            </div>
          ` : `
            <div class="metric-card-locked" style="min-height:200px">
              <div class="locked-icon-wrap">${ico('lock', 22)}</div>
              <div class="locked-title">${esc(activeInst.name)}</div>
              <div class="locked-desc">Biểu đồ chỉ số này thuộc phân loại Mật (Restricted). Chuyển sang vai trò Lãnh đạo hoặc Đội MI để xem dữ liệu.</div>
            </div>
          `}
        </div>
      </section>

      <!-- TẦNG 2: BẢN TIN TỔNG HỢP NGÀY & COMPONENT AI CHAT NHÚNG -->
      <section style="margin-bottom: 28px;">
        <div class="grid-12">
          <!-- Cột trái 7 cột -->
          <div class="col-7">
            <div class="digest-box">
              <div class="digest-header">
                <div>
                  <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                    <span class="badge badge-source">Nguồn: Platts/Reuters nhập sáng</span>
                    <span style="font-size:11px;color:var(--text-muted)">${esc(morning.time)} · Đội MI BSR</span>
                  </div>
                  <h2 class="digest-title">${esc(morning.title)}</h2>
                </div>
                <select class="form-control-select" style="width:160px;font-size:11.5px">
                  <option selected>Phiên 14/11 Sáng</option>
                  <option>Phiên 13/11 Chiều</option>
                  <option>Phiên 13/11 Sáng</option>
                </select>
              </div>

              <div class="digest-body">
                <p>
                  ${esc(morning.executiveSummary)}
                </p>
                <div style="margin: 12px 0; padding: 10px 14px; background: var(--bg-card-subtle); border-radius: 6px; border-left: 3px solid var(--accent-teal);">
                  <strong style="color:var(--text-main); font-size:12px;">Nhận định chuyên viên MI:</strong>
                  <span style="font-size:12px; color:var(--text-sub); display:block; margin-top:2px;">${esc(morning.analystNote)}</span>
                </div>
              </div>

              <!-- Cập nhật Intraday Real-time Pulse -->
              <div class="pulse-box">
                <div class="pulse-head">
                  <div class="pulse-live-indicator">
                    <span class="pulse-dot"></span>
                    <span>AI LIVE PULSE — CẬP NHẬT TRONG NGÀY</span>
                  </div>
                  <span style="font-size:10.5px;color:var(--text-muted)">Cập nhật lúc ${esc(pulse.lastUpdated)}</span>
                </div>
                <div style="font-size:12px;color:var(--text-sub);line-height:1.45;margin-bottom:8px">
                  ${esc(pulse.headline)}
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between;font-size:11px">
                  <span class="badge badge-ai-summary">${esc(pulse.sourceBadge)}</span>
                  <span style="color:var(--text-muted)">Tác động dự kiến: <strong style="color:var(--pos-green)">${esc(pulse.impact)}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Cột phải 5 cột: Embedded Copilot Widget -->
          <div class="col-5">
            <div class="copilot-card">
              <div class="copilot-head">
                <div class="copilot-brand">
                  <div class="copilot-icon">${ico('sparkle', 14)}</div>
                  <span>Trợ lý BSR Copilot</span>
                </div>
                <button class="btn btn-outline btn-sm" data-action="nav-page" data-page="assistant" style="font-size:11px">
                  Mở rộng sang Không gian AI Chat ↗
                </button>
              </div>

              <div class="copilot-chat-feed">
                ${state.copilotResponses.map(r => `
                  <div class="copilot-msg-user">${esc(r.prompt)}</div>
                  <div class="copilot-msg-ai">
                    <div style="display:flex;align-items:center;gap:4px;margin-bottom:4px;font-size:10px;color:var(--text-muted)">
                      ${ico('sparkle', 10)} <span>Auker AI BSR</span>
                    </div>
                    <div style="white-space:pre-line">${esc(r.response)}</div>
                  </div>
                `).join('')}
              </div>

              <div class="copilot-chips-wrap">
                <button class="copilot-chip" data-action="send-copilot-prompt" data-prompt="Tạo báo cáo nhanh biến động Physical & Crack hôm nay">
                  📊 Báo cáo biến động Physical & Crack hôm nay
                </button>
                <button class="copilot-chip" data-action="send-copilot-prompt" data-prompt="Đánh giá chênh lệch giá Brent Dated vs WTI Futures">
                  ⚡ Đối chiếu Dated Brent vs WTI
                </button>
                <button class="copilot-chip" data-action="send-copilot-prompt" data-prompt="Khuyến nghị điều chỉnh công suất CDU theo Crack Spreads">
                  🎯 Khuyến nghị công suất CDU
                </button>
              </div>

              <form class="copilot-input-bar" id="copilot-form" data-action="submit-copilot">
                <input type="text" placeholder="Hỏi AI về giá, tồn kho, crack spread..." id="copilot-input">
                <button type="submit" class="btn btn-primary btn-sm" style="padding:4px 8px">Gửi</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- TẦNG 3: TOP 10 TIN TỨC THỊ TRƯỜNG MỚI NHẤT -->
      <section>
        <div class="news-feed-card">
          <div class="news-feed-head">
            <div>
              <h2 style="font-size:15px;font-weight:700;color:var(--text-main)">Top 10 Tin tức Thị trường Mới nhất (Hợp nhất theo Thời gian)</h2>
              <div style="font-size:11.5px;color:var(--text-muted)">Hợp nhất tin nhập sáng từ Platts/Reuters và tin nóng phát sinh trong ngày</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <div class="filter-tabs-pill">
                <button class="pill-btn active">Tất cả (10)</button>
                <button class="pill-btn">Tin nhập sáng</button>
                <button class="pill-btn">Mới phát sinh</button>
              </div>
              <button class="btn btn-outline btn-sm" data-action="open-drawer" data-drawer-type="quick_news">
                ${ico('plus')} + Thêm tin nhanh
              </button>
            </div>
          </div>

          <div>
            ${D.top10News.map(item => `
              <div class="news-item-row" data-action="open-news-detail" data-news-id="${item.id}" style="cursor:pointer">
                <div style="width:110px;flex-shrink:0">
                  <div style="font-size:11.5px;font-weight:700;font-family:var(--font-mono);color:var(--text-main)">${esc(item.time)}</div>
                  <span class="badge ${item.originType === 'morning' ? 'badge-source' : 'badge-ai-summary'}" style="margin-top:4px;font-size:9.5px">
                    ${esc(item.originBadge)}
                  </span>
                </div>
                <div class="news-item-main">
                  <div class="news-item-title">${esc(item.title)}</div>
                  <div class="news-item-snippet">${esc(item.summary)}</div>
                  <div class="news-item-tags">
                    ${item.duplicateBadge ? `<span class="badge badge-manual">${esc(item.duplicateBadge)}</span>` : ''}
                    ${item.topics.map(t => `<span class="badge badge-source" style="font-size:9.5px">${esc(t)}</span>`).join('')}
                    <span style="margin-left:auto;font-size:11px;color:var(--text-muted);font-weight:600">${esc(item.source)}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
  /* TRANG 2: DỮ LIỆU THỊ TRƯỜNG CHUYÊN SÂU */
  function renderMarketDataPage() {
    const canRestricted = canSeeRestricted();
    const instList = D.instruments;
    const activeInst = D.instruments.find(i => i.id === state.activeChartInstrument) || D.instruments[0];
    const compareInst = D.instruments.find(i => i.id === state.selectedInstruments.find(id => id !== state.activeChartInstrument));

    return `
      <!-- 2.1 THANH BỘ LỌC & LƯỚI THẺ SPARKLINE -->
      <section style="margin-bottom:20px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:12px">
          <div>
            <h1 style="font-size:18px;font-weight:800;color:var(--text-main)">2. Dữ liệu Thị trường Chuyên sâu</h1>
            <div style="font-size:11.5px;color:var(--text-muted)">Biểu đồ chuỗi thời gian đa trục độ phân giải cao, ghim sự kiện và phân tích tương quan</div>
          </div>
          <div style="display:flex;gap:10px">
            ${getRole().admin ? `
              <button class="btn btn-primary" data-action="open-drawer" data-drawer-type="physical_entry">
                + Nhập giá Physical / Dữ liệu BSR
              </button>
            ` : ''}
            <button class="btn btn-secondary" data-action="show-crack-formula-popover">
              Xem công thức Crack Spread
            </button>
            <button class="btn btn-secondary" data-action="export-market-data">
              ${ico('download')} Xuất dữ liệu (Excel/CSV)
            </button>
          </div>
        </div>

        <div class="section-subhead">
          <span>NHÓM PHYSICAL & NỘI BỘ BSR (CHỌN ĐỂ ĐỐI CHIẾU TRÊN BIỂU ĐỒ)</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:12px;margin-bottom:20px">
          ${instList.filter(i => i.isPriority).map(item => {
            const isLocked = item.classification === 'Restricted' && !canRestricted;
            const isChecked = state.selectedInstruments.includes(item.id);
            if (isLocked) {
              return `
                <div class="metric-card-locked" style="min-height:90px;padding:12px">
                  <div style="display:flex;align-items:center;gap:6px">
                    ${ico('lock', 14)} <strong style="font-size:12px;color:var(--badge-restricted-text)">${esc(item.name)}</strong>
                  </div>
                  <span class="badge badge-restricted" style="margin-top:6px;font-size:9.5px">Khóa (Yêu cầu quyền Mật)</span>
                </div>
              `;
            }
            return `
              <div class="card card-priority" style="padding:12px;cursor:pointer;border-color:${isChecked ? '#00E5FF' : 'var(--border-card)'}" data-action="toggle-instrument-pick" data-inst-id="${item.id}">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-weight:700;font-size:12px;color:var(--text-main)">
                    <input type="checkbox" ${isChecked ? 'checked' : ''} style="accent-color:#00E5FF">
                    ${esc(item.short)}
                  </label>
                  <span class="badge badge-restricted" style="font-size:9.5px">Mật 🔒</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:6px">
                  <span style="font-size:17px;font-weight:800;font-family:var(--font-mono)">${fmtNum(item.value, item.decimals)} <span style="font-size:10px;font-weight:400;color:var(--text-muted)">${esc(item.unit)}</span></span>
                  <span class="metric-card-change ${item.change >= 0 ? 'pos' : 'neg'}" style="font-size:11px">${fmtSigned(item.change, item.decimals)}</span>
                </div>
                ${renderSparklineSvg(item.spark, item.change >= 0, 30)}
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- 2.2 BIỂU ĐỒ CHUỖI THỜI GIAN ĐA TRỤC (HIGH-TECH MULTI-AXIS CHART) -->
      <section class="chart-multiaxis-box">
        <div class="chart-ctrl-row">
          <div>
            <h2 style="font-size:15px;font-weight:800;color:var(--text-main)">
              Biểu đồ Phân tích Đa trục: <span style="color:#00E5FF">${esc(activeInst.name)}</span> ${compareInst ? ` vs <span style="color:#F59E0B">${esc(compareInst.name)}</span>` : ''}
            </h2>
            <div style="font-size:11px;color:var(--text-muted)">
              Trục Trái: ${esc(activeInst.unit)} | ${compareInst ? `Trục Phải: ${esc(compareInst.unit)}` : 'Chưa chọn chỉ số thứ 2'}
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="filter-tabs-pill">
              <button class="pill-btn ${state.chartMode === 'multiaxis' ? 'active' : ''}" data-action="set-chart-mode" data-mode="multiaxis">Đa trục tung</button>
              <button class="pill-btn ${state.chartMode === 'normalized' ? 'active' : ''}" data-action="set-chart-mode" data-mode="normalized">Chuẩn hóa %</button>
            </div>
            <div class="filter-tabs-pill">
              <button class="pill-btn ${state.chartRange === '1W' ? 'active' : ''}" data-action="set-chart-range" data-range="1W">1W</button>
              <button class="pill-btn ${state.chartRange === '1M' ? 'active' : ''}" data-action="set-chart-range" data-range="1M">1M</button>
              <button class="pill-btn ${state.chartRange === '3M' ? 'active' : ''}" data-action="set-chart-range" data-range="3M">3M</button>
              <button class="pill-btn ${state.chartRange === '1Y' ? 'active' : ''}" data-action="set-chart-range" data-range="1Y">1Y</button>
            </div>
          </div>
        </div>

        ${renderMultiAxisChart([activeInst, compareInst].filter(Boolean), state.chartMode, state.chartRange)}
      </section>

      <!-- 2.3 BẢNG DỮ LIỆU LỊCH SỬ -->
      <section class="card" style="padding:0;overflow:hidden">
        <div style="padding:14px 20px;border-bottom:1px solid var(--border-card);display:flex;align-items:center;justify-content:space-between">
          <strong style="font-size:14px;color:var(--text-main)">Bảng Số liệu Lịch sử & Nguồn gốc (Provenance Ledger)</strong>
          <span style="font-size:11px;color:var(--text-muted)">Cập nhật lần cuối: 14/11/2026 · 09:30 ICT</span>
        </div>
        <table class="data-table-bsr">
          <thead>
            <tr>
              <th>Chỉ số thị trường</th>
              <th>Thời điểm thị trường</th>
              <th>Thời điểm nạp</th>
              <th>Giá trị</th>
              <th>Đơn vị</th>
              <th>Loại giá</th>
              <th>Nguồn dữ liệu</th>
              <th>Chất lượng</th>
              <th>Phân loại</th>
            </tr>
          </thead>
          <tbody>
            ${instList.map(item => {
              const isLocked = item.classification === 'Restricted' && !canRestricted;
              return `
                <tr>
                  <td><strong>${esc(item.name)}</strong></td>
                  <td>${esc(item.marketTime)}</td>
                  <td>${esc(item.ingestionTime)}</td>
                  <td>
                    ${isLocked ? `<span class="badge badge-restricted">Mật 🔒</span>` : `<strong style="font-family:var(--font-mono);font-size:13.5px">${fmtNum(item.value, item.decimals)}</strong>`}
                  </td>
                  <td>${esc(item.unit)}</td>
                  <td><span class="badge badge-source">${esc(item.priceType)}</span></td>
                  <td>${esc(item.source)}</td>
                  <td><span class="badge badge-success">${esc(item.quality)}</span></td>
                  <td>
                    ${item.classification === 'Restricted' ? `<span class="badge badge-restricted">Restricted</span>` : `<span class="badge badge-manual">Internal</span>`}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </section>
    `;
  }

  /* TRANG 3: BÁO CÁO & BẢN TIN VIDEO */
  function renderReportsPage() {
    const video = D.videoBriefing;
    let list = D.reports;
    if (state.reportsTab === 'daily') list = list.filter(r => r.cycle === 'daily');
    else if (state.reportsTab === 'weekly') list = list.filter(r => r.cycle === 'weekly');
    else if (state.reportsTab === 'monthly') list = list.filter(r => r.cycle === 'monthly');
    else if (state.reportsTab === 'adhoc') list = list.filter(r => r.cycle === 'adhoc');

    return `
      <div style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <h1 style="font-size:18px;font-weight:800;color:var(--text-main)">3. Báo cáo & Bản tin Video</h1>
          <div style="font-size:11.5px;color:var(--text-muted)">Phát sóng điều hành lãnh đạo và kho lưu trữ báo cáo định kỳ / đột xuất</div>
        </div>
        <div style="display:flex;gap:10px">
          ${getRole().admin ? `
            <button class="btn btn-secondary" data-action="open-modal" data-modal-type="upload_video">
              + Tải lên Video mới
            </button>
          ` : ''}
          <button class="btn btn-primary" data-action="open-modal" data-modal-type="create_report">
            + Tạo báo cáo mới
          </button>
        </div>
      </div>

      <section class="video-briefing-wrap">
        <div>
          <div class="video-player-mockup">
            <div style="display:flex;align-items:center;justify-content:space-between">
              <span class="badge badge-source" style="background:rgba(0,229,255,0.15);color:#00E5FF;border-color:transparent">
                BSR MARKET INTELLIGENCE · TUẦN 46
              </span>
              <span style="font-size:11px;color:#94A3B8">${esc(video.published)}</span>
            </div>
            
            <div class="video-center-play" data-action="toggle-video-play">
              ${ico('play', 26)}
            </div>

            <div class="video-controls-bottom">
              <button style="color:#00E5FF" data-action="toggle-video-play">${ico('play', 14)}</button>
              <span>02:30 / ${esc(video.duration)}</span>
              <div class="video-progress-bar">
                <div class="video-progress-fill"></div>
              </div>
              <button class="btn btn-sm btn-secondary" style="color:#fff;background:rgba(255,255,255,0.08);padding:2px 8px;font-size:10px">
                ${state.videoSpeed}
              </button>
            </div>
          </div>
          <div style="margin-top:10px">
            <h2 style="font-size:14.5px;font-weight:700;color:var(--text-main)">${esc(video.title)}</h2>
            <div style="font-size:11.5px;color:var(--text-muted)">Người trình bày: ${esc(video.presenter)}</div>
          </div>
        </div>

        <div>
          <div style="font-size:12px;font-weight:700;color:var(--primary-navy);text-transform:uppercase;margin-bottom:8px">
            Mốc Nội dung Chính (Chapters):
          </div>
          <div class="chapters-list">
            ${video.chapters.map((ch, idx) => `
              <div class="chapter-item ${state.activeChapter === idx ? 'active' : ''}" data-action="seek-video-chapter" data-chapter-idx="${idx}">
                <div style="display:flex;align-items:center;margin-bottom:2px">
                  <span class="chapter-time">${esc(ch.time)}</span>
                  <strong style="font-size:12.5px;color:var(--text-main)">${esc(ch.title)}</strong>
                </div>
                <div style="font-size:11.5px;color:var(--text-muted)">${esc(ch.desc)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="card" style="padding:0;overflow:hidden">
        <div style="padding:16px 20px;border-bottom:1px solid var(--border-card);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
          <div class="filter-tabs-pill">
            <button class="pill-btn ${state.reportsTab === 'all' ? 'active' : ''}" data-action="set-reports-tab" data-tab="all">Tất cả</button>
            <button class="pill-btn ${state.reportsTab === 'daily' ? 'active' : ''}" data-action="set-reports-tab" data-tab="daily">Báo cáo Ngày</button>
            <button class="pill-btn ${state.reportsTab === 'weekly' ? 'active' : ''}" data-action="set-reports-tab" data-tab="weekly">Báo cáo Tuần</button>
            <button class="pill-btn ${state.reportsTab === 'monthly' ? 'active' : ''}" data-action="set-reports-tab" data-tab="monthly">Báo cáo Tháng</button>
            <button class="pill-btn ${state.reportsTab === 'adhoc' ? 'active' : ''}" data-action="set-reports-tab" data-tab="adhoc">Báo cáo Đột xuất</button>
          </div>
          <span style="font-size:11.5px;color:var(--text-muted)">Phiên bản báo cáo bất biến (Immutable Versioning)</span>
        </div>

        <table class="data-table-bsr">
          <thead>
            <tr>
              <th>Mã & Tên báo cáo</th>
              <th>Loại báo cáo</th>
              <th>Thời điểm chốt số liệu</th>
              <th>Người tạo</th>
              <th>Phiên bản</th>
              <th>Phân loại</th>
              <th>Trạng thái</th>
              <th style="text-align:right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(r => `
              <tr>
                <td>
                  <strong>${esc(r.title)}</strong>
                  <div style="font-size:10.5px;color:var(--text-muted)">${esc(r.id)} · Nguồn: ${esc(r.sources.join(', '))}</div>
                </td>
                <td><span class="badge badge-source">${esc(r.type)}</span></td>
                <td>${esc(r.cutOff)}</td>
                <td>${esc(r.author)}</td>
                <td><strong style="color:var(--primary-navy)">${esc(r.version)}</strong></td>
                <td>
                  ${r.classification === 'Restricted' ? `<span class="badge badge-restricted">Restricted 🔒</span>` : `<span class="badge badge-manual">Internal</span>`}
                </td>
                <td><span class="badge badge-success">${esc(r.status)}</span></td>
                <td style="text-align:right">
                  <button class="btn btn-sm btn-secondary" data-action="open-report-preview" data-report-id="${r.id}">
                    Xem trước
                  </button>
                  <button class="btn btn-sm btn-primary" data-action="download-report-pdf" data-report-id="${r.id}" style="margin-left:6px">
                    Tải PDF
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>
    `;
  }

  /* TRANG 4: ĐÁNH GIÁ DỰ BÁO & KHUYẾN NGHỊ */
  function renderForecastPage() {
    const acc = D.forecastAccuracy;
    let recs = D.aiRecommendations;
    if (state.recCategoryFilter === 'crude_buy') recs = recs.filter(r => r.category === 'Mua dầu thô');
    else if (state.recCategoryFilter === 'product_sale') recs = recs.filter(r => r.category === 'Kinh doanh sản phẩm');
    else if (state.recCategoryFilter === 'refinery_ops') recs = recs.filter(r => r.category === 'Vận hành & Tồn kho');

    return `
      <div style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <h1 style="font-size:18px;font-weight:800;color:var(--text-main)">4. Đánh giá Dự báo & Khuyến nghị Chuyên sâu</h1>
          <div style="font-size:11.5px;color:var(--text-muted)">Đo lường độ chính xác baseline từ các nguồn thương mại và đưa ra khuyến nghị hành động từ AI</div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-accent" data-action="trigger-new-ai-recommendation">
            ${ico('sparkle')} Yêu cầu AI phân tích mới
          </button>
          ${getRole().admin ? `
            <button class="btn btn-primary" data-action="open-modal" data-modal-type="add_baseline">
              + Nhập dữ liệu baseline
            </button>
          ` : ''}
        </div>
      </div>

      <!-- KPIS -->
      <section class="kpi-accuracy-grid">
        <div class="kpi-accuracy-card">
          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Tỷ lệ chính xác tổng thể</div>
          <div class="kpi-num" style="color:#00E5FF">${acc.kpis.overallAccuracy}%</div>
          <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Độ bám sát thực tế kỳ này</div>
        </div>
        <div class="kpi-accuracy-card">
          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Sai số phần trăm TB (MAPE)</div>
          <div class="kpi-num" style="color:#10B981">${acc.kpis.mape}%</div>
          <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Ngưỡng mục tiêu: &lt; 5.0%</div>
        </div>
        <div class="kpi-accuracy-card">
          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Sai số tuyệt đối TB (MAE)</div>
          <div class="kpi-num" style="color:#F59E0B">${acc.kpis.mae} <span style="font-size:12px">USD/thùng</span></div>
          <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Đo lường rổ chỉ số BSR</div>
        </div>
        <div class="kpi-accuracy-card">
          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Nguồn chính xác nhất kỳ</div>
          <div class="kpi-num" style="font-size:20px;color:#C084FC;margin-top:8px">${acc.kpis.bestSource}</div>
          <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Đạt độ tin cậy cao nhất</div>
        </div>
      </section>

      <!-- Biểu đồ đối chiếu -->
      <section class="chart-multiaxis-box">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <div>
            <h2 style="font-size:14.5px;font-weight:800;color:var(--text-main)">Biểu đồ Đối chiếu: Giá Thực tế vs Baseline các Tổ chức (Brent Dated)</h2>
            <div style="font-size:11px;color:var(--text-muted)">So sánh đường Thực tế (Cyan neon) với đường Baseline của Platts, McKinsey, EIA, BSR Model</div>
          </div>
          <div style="display:flex;gap:12px;font-size:11px">
            <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:3px;background:#00E5FF"></span> Thực tế</span>
            <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:3px;background:#F59E0B"></span> Baseline</span>
          </div>
        </div>
        ${renderMultiAxisChart([D.instruments[0], D.instruments[1]], 'multiaxis', '1M')}
      </section>

      <!-- Bảng đối soát sai số -->
      <section class="card" style="padding:0;overflow:hidden;margin-bottom:28px">
        <div style="padding:14px 20px;border-bottom:1px solid var(--border-card);display:flex;justify-content:space-between;align-items:center">
          <strong style="font-size:14px;color:var(--text-main)">Bảng Chi tiết Đối soát Sai số Dự báo Baseline từng Kỳ</strong>
          <span style="font-size:11px;color:var(--text-muted)">Version History preserved</span>
        </div>
        <table class="data-table-bsr">
          <thead>
            <tr>
              <th>Nguồn dự báo</th>
              <th>Ngày công bố</th>
              <th>Kỳ dự báo</th>
              <th>Chỉ số</th>
              <th>Giá dự báo</th>
              <th>Giá thực tế</th>
              <th>Chênh lệch</th>
              <th>Sai số MAPE</th>
              <th>Độ chính xác</th>
              <th>Tài liệu gốc</th>
            </tr>
          </thead>
          <tbody>
            ${acc.breakdownTable.map(row => `
              <tr>
                <td><strong>${esc(row.source)}</strong></td>
                <td>${esc(row.published)}</td>
                <td>${esc(row.period)}</td>
                <td>${esc(row.instrument)}</td>
                <td><strong style="font-family:var(--font-mono)">${fmtNum(row.forecastVal, 2)}</strong></td>
                <td><strong style="font-family:var(--font-mono);color:#00E5FF">${fmtNum(row.actualVal, 2)}</strong></td>
                <td style="color:${row.diff > 0 ? 'var(--pos-green)' : 'var(--neg-red)'}">${fmtSigned(row.diff, 2)}</td>
                <td>${fmtNum(row.mape, 2)}%</td>
                <td><span class="badge badge-success">${fmtNum(row.accuracy, 2)}%</span></td>
                <td>
                  <button class="btn btn-sm btn-secondary" data-action="open-doc-ref" data-doc="${esc(row.docRef)}">
                    📑 ${esc(row.docRef)}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>

      <!-- Khuyến nghị AI -->
      <section>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px">
          <div>
            <h2 style="font-size:16px;font-weight:800;color:var(--text-main)">
              Khuyến nghị Hành động Chuyên sâu từ AI (AI Market Recommendations)
            </h2>
            <div style="font-size:11.5px;color:var(--text-muted)">
              Hỗ trợ quyết định mua dầu thô, cơ cấu sản phẩm lọc dầu và tối ưu hóa tồn kho Dung Quất
            </div>
          </div>
          <div class="filter-tabs-pill">
            <button class="pill-btn ${state.recCategoryFilter === 'all' ? 'active' : ''}" data-action="set-rec-filter" data-filter="all">Tất cả</button>
            <button class="pill-btn ${state.recCategoryFilter === 'crude_buy' ? 'active' : ''}" data-action="set-rec-filter" data-filter="crude_buy">Mua dầu thô</button>
            <button class="pill-btn ${state.recCategoryFilter === 'product_sale' ? 'active' : ''}" data-action="set-rec-filter" data-filter="product_sale">Kinh doanh sản phẩm</button>
            <button class="pill-btn ${state.recCategoryFilter === 'refinery_ops' ? 'active' : ''}" data-action="set-rec-filter" data-filter="refinery_ops">Vận hành & Tồn kho</button>
          </div>
        </div>

        <div>
          ${recs.map(rec => `
            <div class="recommendation-card ${rec.badgeClass}">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
                <div>
                  <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                    <span class="badge badge-source">${esc(rec.category)}</span>
                    <span class="badge badge-success">Độ tin cậy: ${esc(rec.confidence)}</span>
                    <span style="font-size:11px;color:var(--text-muted)">Tạo: ${esc(rec.created)} (${esc(rec.version)})</span>
                  </div>
                  <h3 style="font-size:15px;font-weight:800;color:var(--text-main)">${esc(rec.title)}</h3>
                </div>
                <div style="display:flex;gap:8px">
                  <button class="btn btn-sm btn-secondary" data-action="rec-feedback" data-rec-id="${rec.id}">
                    Đánh giá hữu ích
                  </button>
                  <button class="btn btn-sm btn-primary" data-action="rec-to-report" data-rec-id="${rec.id}">
                    Đưa vào Báo cáo
                  </button>
                </div>
              </div>

              <div class="rec-section-block">
                <div class="rec-section-title">1. Bối cảnh & Diễn biến thị trường:</div>
                <div style="color:var(--text-sub)">${esc(rec.context)}</div>
              </div>

              <div class="rec-section-block">
                <div class="rec-section-title">2. Lập luận định lượng & Tác động số liệu:</div>
                <div style="color:var(--text-main);font-weight:600">${esc(rec.rationale)}</div>
              </div>

              <div class="rec-section-block">
                <div class="rec-section-title">3. Giả định & Yếu tố không chắc chắn:</div>
                <div style="color:var(--text-muted)">${esc(rec.assumptions)}</div>
              </div>

              <div class="rec-section-block" style="border-top:1px dashed var(--border-card);padding-top:8px;display:flex;align-items:center;flex-wrap:wrap">
                <span class="rec-section-title" style="margin-right:8px;margin-bottom:0">Nguồn trích dẫn:</span>
                ${rec.citations.map(c => `<span class="citation-chip">📑 ${esc(c)}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  /* TRANG 5: NHẬP LIỆU (SPLIT-VIEW) */
  function renderIngestionPage() {
    return `
      <div style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <h1 style="font-size:18px;font-weight:800;color:var(--text-main)">5. Nhập liệu & Luồng Tin tức Thị trường</h1>
          <div style="font-size:11.5px;color:var(--text-muted)">Giao diện chia đôi màn hình: Vừa nhập dữ liệu/file vừa đối chiếu luồng tin tức mà không mất góc nhìn</div>
        </div>
        <span class="badge badge-source">Quyền thao tác: Đội Market Intelligence</span>
      </div>

      <div class="split-view-container">
        <!-- CỘT TRÁI 45% -->
        <div class="card" style="padding:20px">
          <div class="filter-tabs-pill" style="margin-bottom:18px">
            <button class="pill-btn ${state.ingestionTab === 'quick_text' ? 'active' : ''}" data-action="set-ingest-tab" data-tab="quick_text">
              Nhập nhanh Tin / URL
            </button>
            <button class="pill-btn ${state.ingestionTab === 'upload_file' ? 'active' : ''}" data-action="set-ingest-tab" data-tab="upload_file">
              Tải lên Tài liệu
            </button>
            <button class="pill-btn ${state.ingestionTab === 'quick_price' ? 'active' : ''}" data-action="set-ingest-tab" data-tab="quick_price">
              Nhập Bảng giá & Vận hành
            </button>
          </div>

          ${state.ingestionTab === 'quick_text' ? `
            <div>
              <div class="form-field-group">
                <label class="form-field-label">Tiêu đề bản tin:</label>
                <input type="text" class="form-control-input" id="ingest-news-title" value="Bản tin giao dịch dầu thô Dated Brent phiên 14/11">
              </div>

              <div class="form-field-group">
                <label class="form-field-label">Nguồn tin tức:</label>
                <select class="form-control-select" id="ingest-news-source">
                  <option selected>Platts (S&P Global)</option>
                  <option>Reuters Energy</option>
                  <option>Bloomberg Terminal</option>
                  <option>Argus Media</option>
                  <option>Nội bộ BSR</option>
                </select>
              </div>

              <div class="form-field-group">
                <label class="form-field-label">Nội dung trích đoạn:</label>
                <textarea class="form-control-textarea" id="ingest-news-body" rows="5">Platts assessments: Dated Brent was assessed at $77.90/bbl, up $0.80 on the day. Asian sweet crude demand remains resilient with refinery runs supported by gasoline blend margins.</textarea>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div class="form-field-group">
                  <label class="form-field-label">Phân loại bảo mật:</label>
                  <select class="form-control-select" id="ingest-news-sec">
                    <option value="Internal" selected>Nội bộ (Internal)</option>
                    <option value="Restricted">Mật (Restricted - Physical)</option>
                  </select>
                </div>
                <div class="form-field-group">
                  <label class="form-field-label">Chủ đề chính:</label>
                  <select class="form-control-select" id="ingest-news-topic">
                    <option selected>Dầu thô</option>
                    <option>Sản phẩm lọc dầu</option>
                    <option>OPEC+</option>
                    <option>Vận tải & Logistics</option>
                  </select>
                </div>
              </div>

              <button class="btn btn-primary" style="width:100%;margin-top:10px" data-action="submit-quick-news">
                ${ico('sparkle')} Lưu & Tự động chạy AI Tóm tắt
              </button>
            </div>
          ` : ''}

          ${state.ingestionTab === 'upload_file' ? `
            <div>
              <div class="upload-dropzone" data-action="trigger-file-select">
                <div style="font-size:28px;margin-bottom:8px">📂</div>
                <strong style="font-size:13px;color:var(--text-main)">Kéo thả file vào đây hoặc bấm để chọn</strong>
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px">Hỗ trợ PDF, Excel (.xlsx, .csv), Word (.docx) — Tối đa 15MB</div>
              </div>

              <div style="margin-top:16px">
                <div style="font-size:12px;font-weight:700;color:var(--primary-navy);margin-bottom:8px">Tài liệu đã nạp gần đây:</div>
                <div style="display:flex;flex-direction:column;gap:8px">
                  <div style="padding:10px;background:#0E182F;border-radius:6px;display:flex;align-items:center;justify-content:space-between">
                    <div>
                      <strong style="font-size:12px">Platts_Oilgram_Report_20261114.pdf</strong>
                      <div style="font-size:10.5px;color:var(--text-muted)">2.4 MB · AI đã trích xuất 8 thực thể giá</div>
                    </div>
                    <span class="badge badge-success">Đã xử lý</span>
                  </div>
                  <div style="padding:10px;background:#0E182F;border-radius:6px;display:flex;align-items:center;justify-content:space-between">
                    <div>
                      <strong style="font-size:12px">Ton_kho_Dau_tho_DungQuat_T11.xlsx</strong>
                      <div style="font-size:10.5px;color:var(--text-muted)">1.1 MB · Đã cập nhật mức tồn kho 285.000 tấn</div>
                    </div>
                    <span class="badge badge-success">Đã xử lý</span>
                  </div>
                </div>
              </div>
            </div>
          ` : ''}

          ${state.ingestionTab === 'quick_price' ? `
            <div>
              <div class="form-field-group">
                <label class="form-field-label">Giá Dầu thô Dated Brent Physical (USD/thùng):</label>
                <input type="number" step="0.01" class="form-control-input" value="77.90">
              </div>
              <div class="form-field-group">
                <label class="form-field-label">Giá Xăng RON95 FOB Singapore (USD/thùng):</label>
                <input type="number" step="0.01" class="form-control-input" value="92.10">
              </div>
              <div class="form-field-group">
                <label class="form-field-label">Tồn kho Dầu thô Nhà máy Dung Quất (tấn):</label>
                <input type="number" class="form-control-input" value="285000">
              </div>
              <div class="form-field-group">
                <label class="form-field-label">Tải công suất vận hành CDU (%):</label>
                <input type="number" step="0.1" class="form-control-input" value="105.0">
              </div>
              <button class="btn btn-accent" style="width:100%;margin-top:10px" data-action="submit-quick-prices">
                Lưu vào CSDL thị trường & Tính lại Crack Spread
              </button>
            </div>
          ` : ''}
        </div>

        <!-- CỘT PHẢI 55% -->
        <div class="card" style="padding:0;overflow:hidden">
          <div style="padding:14px 20px;border-bottom:1px solid var(--border-card);display:flex;justify-content:space-between;align-items:center">
            <div>
              <strong style="font-size:14px;color:var(--text-main)">Luồng Tin tức Đầy đủ & Kiểm duyệt MI (Review Queue)</strong>
              <div style="font-size:11px;color:var(--text-muted)">Phân tách rõ [Nguồn gốc], [AI Tóm tắt], [AI Nhận định]</div>
            </div>
            <span class="badge badge-ai-summary">Tự động gắn thẻ AI</span>
          </div>

          <div style="padding:14px 20px;display:flex;flex-direction:column;gap:14px">
            ${D.top10News.slice(0, 5).map(n => `
              <div style="border:1px solid var(--border-card);border-radius:8px;padding:14px;background:#0E182F">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
                  <div style="display:flex;align-items:center;gap:6px">
                    <span class="badge badge-source">${esc(n.source)}</span>
                    <span style="font-size:11px;color:var(--text-muted)">${esc(n.time)}</span>
                  </div>
                  <div style="display:flex;gap:6px">
                    <button class="btn btn-sm btn-secondary" style="padding:2px 8px;font-size:10.5px" data-action="rate-news-quality" data-rate="like">👍 Chuẩn</button>
                    <button class="btn btn-sm btn-secondary" style="padding:2px 8px;font-size:10.5px" data-action="rate-news-quality" data-rate="flag">🚩 Gắn cờ</button>
                  </div>
                </div>

                <h4 style="font-size:13.5px;font-weight:700;color:var(--text-main);margin-bottom:6px">${esc(n.title)}</h4>

                <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;margin:8px 0">
                  <div style="background:rgba(59,130,246,0.12);padding:6px 10px;border-radius:4px;border-left:3px solid #3B82F6">
                    <strong style="color:#60A5FA">[Nguồn gốc]:</strong> Trích nguyên văn từ bản tin ${esc(n.source)}.
                  </div>
                  <div style="background:rgba(168,85,247,0.12);padding:6px 10px;border-radius:4px;border-left:3px solid #A855F7">
                    <strong style="color:#C084FC">[AI Tóm tắt]:</strong> ${esc(n.summary)}
                  </div>
                  <div style="background:rgba(245,158,11,0.12);padding:6px 10px;border-radius:4px;border-left:3px solid #F59E0B">
                    <strong style="color:#FBBF24">[AI Nhận định]:</strong> Tác động tích cực đến hiệu quả biên lọc dầu BSR trong ngắn hạn.
                  </div>
                </div>

                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
                  <span style="font-size:11px;color:var(--text-muted)">Trạng thái: Đã kiểm duyệt</span>
                  <button class="btn btn-sm btn-primary" data-action="publish-news" data-news-id="${n.id}">
                    Duyệt xuất bản
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /* TRANG 6: ĐÁNH GIÁ NGUỒN TIN */
  function renderSourcesPage() {
    const score = D.sourceScorecard;

    return `
      <div style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <h1 style="font-size:18px;font-weight:800;color:var(--text-main)">6. Đánh giá Chất lượng & Độ chính xác Nguồn tin</h1>
          <div style="font-size:11.5px;color:var(--text-muted)">Đo lường độ chính xác, tỷ lệ tin độc quyền, tốc độ đưa tin và hiệu quả đầu tư (ROI) nguồn tin</div>
        </div>
        <div class="filter-tabs-pill">
          <button class="pill-btn ${state.sourcePeriodFilter === '1M' ? 'active' : ''}" data-action="set-source-period" data-period="1M">1 Tháng</button>
          <button class="pill-btn ${state.sourcePeriodFilter === '1Q' ? 'active' : ''}" data-action="set-source-period" data-period="1Q">1 Quý</button>
          <button class="pill-btn ${state.sourcePeriodFilter === '6M' ? 'active' : ''}" data-action="set-source-period" data-period="6M">6 Tháng</button>
          <button class="pill-btn ${state.sourcePeriodFilter === '1Y' ? 'active' : ''}" data-action="set-source-period" data-period="1Y">1 Năm</button>
        </div>
      </div>

      <section class="kpi-accuracy-grid">
        <div class="kpi-accuracy-card">
          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Nguồn ROI cao nhất</div>
          <div class="kpi-num" style="font-size:20px;color:#00E5FF;margin-top:6px">${score.kpis.bestRoi}</div>
          <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Nguồn cốt lõi định giá physical</div>
        </div>
        <div class="kpi-accuracy-card">
          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Tin độc quyền cao nhất</div>
          <div class="kpi-num" style="color:#00F5D4">${score.kpis.bestUnique}</div>
          <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Reuters Energy Feed</div>
        </div>
        <div class="kpi-accuracy-card">
          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Tốc độ đưa tin nhanh nhất</div>
          <div class="kpi-num" style="font-size:20px;color:#10B981;margin-top:6px">${score.kpis.fastest}</div>
          <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Bloomberg Terminal</div>
        </div>
        <div class="kpi-accuracy-card">
          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Tiết kiệm tiềm năng</div>
          <div class="kpi-num" style="color:#F59E0B">${score.kpis.costSaving}</div>
          <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Hủy các gói tin bị trùng lặp</div>
        </div>
      </section>

      <section class="card" style="padding:0;overflow:hidden;margin-bottom:24px">
        <div style="padding:14px 20px;border-bottom:1px solid var(--border-card);display:flex;justify-content:space-between;align-items:center">
          <strong style="font-size:14px;color:var(--text-main)">Bảng Xếp hạng & Đánh giá Hiệu quả Nguồn tin (Source Scorecard)</strong>
          <span style="font-size:11px;color:var(--text-muted)">Đánh giá khả năng thay thế nguồn đắt tiền bằng nguồn tối ưu hơn</span>
        </div>
        <table class="data-table-bsr">
          <thead>
            <tr>
              <th>Nguồn tin</th>
              <th>Phân nhóm</th>
              <th>Độ chính xác (%)</th>
              <th>Tỷ lệ tin độc quyền (%)</th>
              <th>Tốc độ đưa tin</th>
              <th>Tỷ lệ trùng lặp (%)</th>
              <th>Chi phí / năm</th>
              <th>Đánh giá ROI</th>
            </tr>
          </thead>
          <tbody>
            ${score.sourcesTable.map(s => `
              <tr>
                <td><strong>${esc(s.name)}</strong></td>
                <td>${esc(s.category)}</td>
                <td><span class="badge badge-success">${s.accuracy}%</span></td>
                <td><strong style="color:#00E5FF">${s.uniqueRate}%</strong></td>
                <td>${esc(s.speedVsAvg)}</td>
                <td style="color:${s.dupRate > 20 ? 'var(--neg-red)' : 'var(--text-sub)'}">${s.dupRate}%</td>
                <td><span style="font-family:var(--font-mono)">${esc(s.costPerYear)}</span></td>
                <td>
                  <span class="badge ${s.roiRating.includes('Tối ưu') ? 'badge-primary' : s.roiRating.includes('Cần') ? 'badge-restricted' : 'badge-source'}">
                    ${esc(s.roiRating)}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>

      <section class="chart-multiaxis-box">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <div>
            <h2 style="font-size:14.5px;font-weight:800;color:var(--text-main)">Biểu đồ Xu hướng Độ chính xác qua các Tháng: Platts vs Argus vs Reuters</h2>
            <div style="font-size:11px;color:var(--text-muted)">Theo dõi diễn biến điểm Accuracy và mức độ cải thiện thông tin độc quyền</div>
          </div>
          <div style="display:flex;gap:12px;font-size:11px">
            <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:3px;background:#00E5FF"></span> Platts</span>
            <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:3px;background:#3B82F6"></span> Reuters</span>
            <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:3px;background:#F59E0B"></span> Argus</span>
          </div>
        </div>
        ${renderMultiAxisChart([D.instruments[0], D.instruments[1]], 'multiaxis', '1M')}
      </section>

      <section class="card" style="padding:0;overflow:hidden">
        <div style="padding:14px 20px;border-bottom:1px solid var(--border-card);display:flex;justify-content:space-between;align-items:center">
          <strong style="font-size:14px;color:var(--text-main)">Nhật ký Kiểm chứng Dữ liệu User Nhập (Verification Log)</strong>
          <span style="font-size:11px;color:var(--text-muted)">Bấm "Verify" để cập nhật kết quả và cộng dồn điểm Accuracy của nguồn tin</span>
        </div>
        <table class="data-table-bsr">
          <thead>
            <tr>
              <th>Mã & Thời gian</th>
              <th>Người nhập</th>
              <th>Nguồn trích</th>
              <th>Nội dung thông tin / Số liệu</th>
              <th>Diễn biến thực tế</th>
              <th>Kết quả đối soát</th>
              <th>Tác động điểm</th>
              <th style="text-align:right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            ${score.userVerificationLog.map(v => `
              <tr>
                <td><strong>${esc(v.id)}</strong><div style="font-size:10px;color:var(--text-muted)">${esc(v.time)}</div></td>
                <td>${esc(v.actor)}</td>
                <td><span class="badge badge-source">${esc(v.source)}</span></td>
                <td>${esc(v.claimedValue)}</td>
                <td>${esc(v.actualEvent)}</td>
                <td>
                  <span class="badge ${v.verificationResult === 'Đúng thực tế' ? 'badge-success' : v.verificationResult === 'Sai lệch' ? 'badge-restricted' : 'badge-manual'}">
                    ${esc(v.verificationResult)}
                  </span>
                </td>
                <td style="font-weight:700;color:${v.accuracyImpact.includes('+') ? 'var(--pos-green)' : 'var(--neg-red)'}">${esc(v.accuracyImpact)}</td>
                <td style="text-align:right">
                  <button class="btn btn-sm btn-secondary" data-action="verify-log-entry" data-ver-id="${v.id}">
                    Đánh dấu kiểm chứng
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>
    `;
  }

  /* TRANG 7: QUẢN TRỊ HỆ THỐNG */
  function renderAdminPage() {
    const admin = D.adminData;

    return `
      <div style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <h1 style="font-size:18px;font-weight:800;color:var(--text-main)">7. Quản trị Hệ thống (System Administration)</h1>
          <div style="font-size:11.5px;color:var(--text-muted)">Vận hành nguồn dữ liệu, công thức Crack Spread, phân quyền người dùng và giám sát AI Auker</div>
        </div>
        <span class="badge badge-restricted">Quyền: Quản trị viên (Admin / MI)</span>
      </div>

      <div class="filter-tabs-pill" style="margin-bottom:20px">
        <button class="pill-btn ${state.adminTab === 'sources' ? 'active' : ''}" data-action="set-admin-tab" data-tab="sources">
          7.1 Quản lý Nguồn dữ liệu & Chi phí
        </button>
        <button class="pill-btn ${state.adminTab === 'formulas' ? 'active' : ''}" data-action="set-admin-tab" data-tab="formulas">
          7.2 Cấu hình Công thức Crack Spread
        </button>
        <button class="pill-btn ${state.adminTab === 'users' ? 'active' : ''}" data-action="set-admin-tab" data-tab="users">
          7.3 Quản lý Người dùng & Phân quyền (~1.550 users)
        </button>
        <button class="pill-btn ${state.adminTab === 'audit' ? 'active' : ''}" data-action="set-admin-tab" data-tab="audit">
          7.4 Nhật ký Kiểm toán (Audit Log)
        </button>
        <button class="pill-btn ${state.adminTab === 'ai_observability' ? 'active' : ''}" data-action="set-admin-tab" data-tab="ai_observability">
          7.5 Giám sát Điều phối AI Auker
        </button>
      </div>

      ${state.adminTab === 'sources' ? `
        <div class="card" style="padding:0;overflow:hidden">
          <div style="padding:16px 20px;border-bottom:1px solid var(--border-card);display:flex;justify-content:space-between;align-items:center">
            <strong style="font-size:14px;color:var(--text-main)">Danh sách Nguồn Dữ liệu Thương mại & Kết nối Nội bộ</strong>
            <button class="btn btn-sm btn-primary" data-action="sync-all-sources">Đồng bộ tất cả ngay (Sync All)</button>
          </div>
          <table class="data-table-bsr">
            <thead>
              <tr>
                <th>Mã nguồn</th>
                <th>Tên tổ chức cung cấp</th>
                <th>Loại kết nối</th>
                <th>Tần suất nạp</th>
                <th>Chi phí gói cước</th>
                <th>Lần nạp cuối</th>
                <th>Trạng thái</th>
                <th style="text-align:right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              ${admin.sourcesConfig.map(s => `
                <tr>
                  <td><strong>${esc(s.id)}</strong></td>
                  <td>${esc(s.name)}</td>
                  <td><span class="badge badge-source">${esc(s.type)}</span></td>
                  <td>${esc(s.freq)}</td>
                  <td><span style="font-family:var(--font-mono)">${esc(s.cost)}</span></td>
                  <td>${esc(s.lastSync)}</td>
                  <td><span class="badge ${s.status === 'Hoạt động' ? 'badge-success' : 'badge-restricted'}">${esc(s.status)}</span></td>
                  <td style="text-align:right">
                    <button class="btn btn-sm btn-secondary" data-action="sync-source-now" data-source-id="${s.id}">
                      Đồng bộ ngay
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      ${state.adminTab === 'formulas' ? `
        <div class="card" style="padding:0;overflow:hidden">
          <div style="padding:16px 20px;border-bottom:1px solid var(--border-card);display:flex;justify-content:space-between;align-items:center">
            <div>
              <strong style="font-size:14px;color:var(--text-main)">Danh mục Công thức Tính Crack Spread Chuẩn BSR</strong>
              <div style="font-size:11px;color:var(--text-muted)">Không ghi đè công thức lịch sử để bảo đảm tính tái lập của các báo cáo cũ</div>
            </div>
            <button class="btn btn-sm btn-primary" data-action="create-new-formula">+ Tạo phiên bản công thức mới</button>
          </div>
          <table class="data-table-bsr">
            <thead>
              <tr>
                <th>Mã công thức</th>
                <th>Tên công thức</th>
                <th>Phiên bản</th>
                <th>Biến đầu vào</th>
                <th>Quy tắc công thức</th>
                <th>Đơn vị</th>
                <th>Trạng thái</th>
                <th style="text-align:right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              ${admin.formulas.map(f => `
                <tr>
                  <td><strong>${esc(f.id)}</strong></td>
                  <td>${esc(f.name)}</td>
                  <td><span class="badge badge-source">${esc(f.version)}</span></td>
                  <td>${esc(f.inputs.join(', '))}</td>
                  <td style="font-family:var(--font-mono);font-size:11.5px;color:#00E5FF">${esc(f.formula)}</td>
                  <td>${esc(f.unit)}</td>
                  <td><span class="badge ${f.status === 'Đang áp dụng' ? 'badge-success' : 'badge-manual'}">${esc(f.status)}</span></td>
                  <td style="text-align:right">
                    <button class="btn btn-sm btn-secondary" data-action="clone-formula" data-formula-id="${f.id}">
                      Nhân bản & Sửa
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      ${state.adminTab === 'users' ? `
        <div>
          <div class="kpi-accuracy-grid" style="margin-bottom:20px">
            <div class="kpi-accuracy-card">
              <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Tổng số người dùng BSR</div>
              <div class="kpi-num" style="color:#00E5FF">1.550</div>
              <div style="font-size:11px;color:var(--text-sub);margin-top:2px">BSR Active Directory</div>
            </div>
            <div class="kpi-accuracy-card">
              <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Lãnh đạo [Full Physical]</div>
              <div class="kpi-num" style="color:#00F5D4">24</div>
              <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Toàn quyền Physical Mật</div>
            </div>
            <div class="kpi-accuracy-card">
              <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Đội Market Intelligence</div>
              <div class="kpi-num" style="color:#C084FC">18</div>
              <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Nhập liệu & Quản trị</div>
            </div>
            <div class="kpi-accuracy-card">
              <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Nhân viên nội bộ</div>
              <div class="kpi-num" style="color:#94A3B8">1.508</div>
              <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Ẩn giá Physical Mật</div>
            </div>
          </div>

          <div class="card" style="padding:0;overflow:hidden">
            <div style="padding:14px 20px;border-bottom:1px solid var(--border-card);display:flex;justify-content:space-between;align-items:center">
              <strong style="font-size:14px;color:var(--text-main)">Ma trận Phân quyền Vai trò & Kiểm soát Dữ liệu Mật</strong>
              <span class="badge badge-restricted">RBAC Row-level Security</span>
            </div>
            <table class="data-table-bsr">
              <thead>
                <tr>
                  <th>Nhóm vai trò</th>
                  <th>Số lượng users</th>
                  <th>Mức bảo mật cao nhất</th>
                  <th>Quyền xem Physical Mật</th>
                  <th>Quyền Xuất PDF</th>
                  <th>Quyền Quản trị Admin</th>
                  <th>Mô tả phạm vi</th>
                </tr>
              </thead>
              <tbody>
                ${admin.rolesSummary.map(r => `
                  <tr>
                    <td><strong>${esc(r.role)}</strong></td>
                    <td>${r.count} users</td>
                    <td><span class="badge ${r.maxClass.includes('Restricted') ? 'badge-restricted' : 'badge-manual'}">${esc(r.maxClass)}</span></td>
                    <td>${r.canPhysical ? '✅ Có quyền' : '❌ Ẩn tuyệt đối'}</td>
                    <td>${r.canExport ? '✅ Được phép' : '❌ Chặn xuất'}</td>
                    <td>${r.canAdmin ? '✅ Admin' : '❌ Không'}</td>
                    <td style="font-size:11.5px;color:var(--text-sub)">${esc(r.desc)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      ${state.adminTab === 'audit' ? `
        <div class="card" style="padding:0;overflow:hidden">
          <div style="padding:16px 20px;border-bottom:1px solid var(--border-card);display:flex;justify-content:space-between;align-items:center">
            <div>
              <strong style="font-size:14px;color:var(--text-main)">Nhật ký Kiểm toán Hoạt động Hệ thống (Audit Log Viewer)</strong>
              <div style="font-size:11px;color:var(--text-muted)">Lưu vết không thể tẩy xóa mọi hành vi truy cập dữ liệu mật và xuất báo cáo</div>
            </div>
            <button class="btn btn-sm btn-secondary" data-action="export-audit-log">
              ${ico('download')} Xuất Audit Log (CSV/PDF)
            </button>
          </div>
          <table class="data-table-bsr">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Người thực hiện</th>
                <th>Vai trò</th>
                <th>Hành động</th>
                <th>Đối tượng tác động</th>
                <th>Phân loại</th>
                <th>Kết quả</th>
              </tr>
            </thead>
            <tbody>
              ${admin.auditLogs.map(a => `
                <tr>
                  <td>${esc(a.time)}</td>
                  <td><strong>${esc(a.actor)}</strong></td>
                  <td>${esc(a.role)}</td>
                  <td><span class="badge badge-source">${esc(a.action)}</span></td>
                  <td>${esc(a.object)}</td>
                  <td><span class="badge ${a.classification === 'Restricted' ? 'badge-restricted' : 'badge-manual'}">${esc(a.classification)}</span></td>
                  <td><span class="badge ${a.result.includes('Thành công') || a.result.includes('Được phép') ? 'badge-success' : 'badge-restricted'}">${esc(a.result)}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      ${state.adminTab === 'ai_observability' ? `
        <div>
          <div class="kpi-accuracy-grid" style="margin-bottom:20px">
            <div class="kpi-accuracy-card">
              <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Độ trễ phản hồi TB</div>
              <div class="kpi-num" style="color:#00E5FF">${admin.aiObservability.avgLatency}</div>
              <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Thời gian sinh phân tích</div>
            </div>
            <div class="kpi-accuracy-card">
              <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Chi phí Token bình quân</div>
              <div class="kpi-num" style="color:#F59E0B">${admin.aiObservability.avgCost}</div>
              <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Trên mỗi lượt truy vấn</div>
            </div>
            <div class="kpi-accuracy-card">
              <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Tỷ lệ gọi Tool Calls</div>
              <div class="kpi-num" style="color:#10B981">${admin.aiObservability.toolCallsRate}</div>
              <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Deterministic BSR algorithms</div>
            </div>
            <div class="kpi-accuracy-card">
              <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Tỷ lệ Fallback / Lỗi</div>
              <div class="kpi-num" style="color:#C084FC">${admin.aiObservability.fallbackRate}</div>
              <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Dự phòng mô hình an toàn</div>
            </div>
          </div>

          <div class="card" style="padding:0;overflow:hidden">
            <div style="padding:14px 20px;border-bottom:1px solid var(--border-card);display:flex;justify-content:space-between;align-items:center">
              <strong style="font-size:14px;color:var(--text-main)">Hiệu năng Điều phối AI theo Từng Tác vụ (Task Breakdown)</strong>
              <span class="badge badge-ai-summary">Auker Orchestration Layer</span>
            </div>
            <table class="data-table-bsr">
              <thead>
                <tr>
                  <th>Tác vụ AI</th>
                  <th>Tổng lượt chạy</th>
                  <th>Độ trễ trung bình</th>
                  <th>Chi phí trung bình</th>
                  <th>Tỷ lệ lỗi</th>
                </tr>
              </thead>
              <tbody>
                ${admin.aiObservability.tasksBreakdown.map(t => `
                  <tr>
                    <td><strong>${esc(t.task)}</strong></td>
                    <td>${t.count} lượt</td>
                    <td>${esc(t.avgLatency)}</td>
                    <td>${esc(t.avgCost)}</td>
                    <td><span class="badge badge-success">${esc(t.errorRate)}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}
    `;
  }

  /* KHÔNG GIAN TRỢ LÝ AI CHUYÊN BIỆT (3 CỘT) */
  function renderAssistantWorkspace() {
    const thread = D.aiConversations.find(c => c.id === state.aiActiveThreadId) || D.aiConversations[0];

    return `
      <div style="margin-bottom:14px;display:flex;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:12px">
          <button class="btn btn-sm btn-secondary" data-action="nav-back-previous">
            ${ico('arrowBack')} Quay lại màn hình trước
          </button>
          <div>
            <h1 style="font-size:16.5px;font-weight:800;color:var(--text-main)">
              Không gian Trợ lý AI Thị trường & Report Studio (3 Cột Chuyên biệt)
            </h1>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="badge badge-restricted">${ico('lock', 10)} Quyền: ${esc(getRole().label)}</span>
          <span class="badge badge-ai-summary">Auker AI 2.0</span>
        </div>
      </div>

      <div class="ai-workspace-3col">
        <!-- CỘT 1 (240px) -->
        <div class="ai-history-panel">
          <div style="padding:14px;border-bottom:1px solid var(--border-card)">
            <button class="btn btn-primary" style="width:100%;font-size:12px" data-action="new-ai-thread">
              ${ico('plus')} + Cuộc trò chuyện mới
            </button>
          </div>
          <div style="padding:12px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:8px">
            <div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Lịch sử hội thoại:</div>
            ${D.aiConversations.map(c => `
              <div class="chapter-item ${c.id === state.aiActiveThreadId ? 'active' : ''}" data-action="select-ai-thread" data-thread-id="${c.id}" style="padding:8px 10px">
                <strong style="font-size:11.5px;color:var(--text-main);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                  ${esc(c.title)}
                </strong>
                <span style="font-size:10px;color:var(--text-muted)">${esc(c.updated)}</span>
              </div>
            `).join('')}

            <div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-top:10px">Kho báo cáo đột xuất:</div>
            <div class="chapter-item" style="padding:8px 10px">
              <strong style="font-size:11.5px;color:var(--primary-navy)">BC-Đột xuất-2026-042</strong>
              <div style="font-size:10px;color:var(--text-muted)">Tác động giá Dated Brent Q4</div>
            </div>
            <div class="chapter-item" style="padding:8px 10px">
              <strong style="font-size:11.5px;color:var(--primary-navy)">BC-Đột xuất-2026-041</strong>
              <div style="font-size:10px;color:var(--text-muted)">Crack Spread RON95 tuần 46</div>
            </div>
          </div>
        </div>

        <!-- CỘT 2 (LINH HOẠT) -->
        <div class="ai-chat-stream-panel">
          <div style="padding:14px 18px;border-bottom:1px solid var(--border-card);display:flex;justify-content:space-between;align-items:center">
            <div>
              <strong style="font-size:13.5px;color:var(--text-main)">${esc(thread.title)}</strong>
              <div style="font-size:10.5px;color:var(--text-muted)">Phiên bảo mật: ${esc(thread.classification)}</div>
            </div>
            <span class="badge badge-success">Sẵn sàng phản hồi</span>
          </div>

          <div style="padding:18px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:16px" id="chat-messages-container">
            ${thread.messages.map(m => {
              if (m.role === 'user') {
                return `
                  <div style="align-self:flex-end;max-width:85%;background:linear-gradient(135deg, #0284C7, #0369A1);color:#fff;padding:12px 16px;border-radius:12px 12px 2px 12px;font-size:13px;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
                    ${esc(m.text)}
                    <div style="font-size:10px;color:rgba(255,255,255,0.7);text-align:right;margin-top:4px">${esc(m.time)}</div>
                  </div>
                `;
              } else {
                return `
                  <div style="align-self:flex-start;max-width:92%;background:#0E182F;border:1px solid var(--border-card);padding:16px;border-radius:12px 12px 12px 2px;box-shadow:var(--shadow-sm)">
                    <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
                      <span class="badge badge-ai-summary">${ico('sparkle', 12)} Auker Reasoning Trace</span>
                      <span style="font-size:10.5px;color:var(--text-muted)">Deterministic Execution</span>
                    </div>

                    ${m.steps ? `
                      <div style="margin-bottom:12px">
                        ${m.steps.map(s => `
                          <div class="ai-reasoning-step done">
                            ${ico('check', 12)}
                            <span>${esc(s.text)}</span>
                          </div>
                        `).join('')}
                      </div>
                    ` : ''}

                    <div style="font-size:13px;line-height:1.6;white-space:pre-line;color:var(--text-main)">
                      ${esc(m.text)}
                    </div>
                  </div>
                `;
              }
            }).join('')}
          </div>

          <div style="padding:14px 18px;border-top:1px solid var(--border-card);background:#0E182F">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <span style="font-size:11px;font-weight:600;color:var(--text-muted)">Mức bảo mật câu hỏi / file:</span>
              <select class="form-control-select" style="width:170px;padding:3px 8px;font-size:11px" id="chat-security-select">
                <option value="Restricted" selected>Mật (Restricted - Physical)</option>
                <option value="Internal">Nội bộ (Internal)</option>
              </select>
              <button class="btn btn-sm btn-secondary" style="font-size:11px" data-action="attach-chat-files">
                📎 Đính kèm file (Excel/PDF)
              </button>
            </div>
            <div class="ai-chat-input-box" style="border:1.5px solid var(--border-strong);border-radius:12px;background:var(--bg-card);padding:14px;box-shadow:var(--shadow-card)">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="font-size:11px;font-weight:700;color:var(--text-muted)">MỨC BẢO MẬT:</span>
                  <select class="form-control-select" style="font-size:11.5px;padding:4px 10px;width:auto">
                    <option value="Restricted" selected>Mật (Restricted - Physical) 🔒</option>
                    <option value="Internal">Nội bộ (Internal)</option>
                  </select>
                </div>
                <button class="btn btn-sm btn-secondary" style="font-size:11.5px" data-action="attach-chat-files">
                  📎 Đính kèm file (Excel/PDF)
                </button>
              </div>

              <textarea class="form-control-textarea" id="chat-input-textarea" rows="2" placeholder="Gõ yêu cầu phân tích dữ liệu thị trường hoặc tạo báo cáo đột xuất (Nhấn Enter để gửi)..." style="width:100%;border:none;background:transparent;outline:none;font-size:13.5px;resize:none;min-height:50px;color:var(--text-main);padding:0"></textarea>

              <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid var(--border-card)">
                <span style="font-size:11px;color:var(--text-muted)">
                  💡 Nhấn <strong style="color:var(--text-main)">Enter</strong> để gửi, <strong style="color:var(--text-main)">Shift+Enter</strong> để xuống dòng
                </span>
                <button class="btn btn-primary" data-action="submit-chat-message" id="btn-submit-chat" style="padding:8px 20px;font-size:12.5px;font-weight:700;border-radius:8px">
                  <span>Gửi câu hỏi</span> ${ico('sparkle', 14)}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- CỘT 3 (380px) -->
        <div class="ai-preview-panel">
          <div style="padding:14px 16px;border-bottom:1px solid var(--border-card);display:flex;justify-content:space-between;align-items:center">
            <strong style="font-size:13px;color:var(--text-main)">Khung Xem trước Báo cáo (Live Artifact)</strong>
            <span class="badge badge-restricted">Mật - Restricted</span>
          </div>

          <div class="artifact-preview-doc">
            <div class="doc-header-block">
              <div>
                <strong style="font-size:13.5px;color:var(--primary-navy)">CÔNG TY CỔ PHẦN LỌC HÓA DẦU BÌNH SƠN</strong>
                <div style="font-size:10px;color:var(--text-muted)">Ban Phân tích Thị trường & Chiến lược</div>
              </div>
              <span class="badge badge-source">BC-2026-042</span>
            </div>

            <h3 style="font-size:14px;font-weight:800;color:var(--text-main);margin-bottom:10px;text-align:center">
              BÁO CÁO ĐỘT XUẤT: BIẾN ĐỘNG GIÁ DẦU PHYSICAL & CRACK SPREAD
            </h3>
            <div style="font-size:10.5px;color:var(--text-muted);text-align:center;margin-bottom:14px">
              Thời điểm chốt số liệu: 14/11/2026 · 09:15 ICT | Phân loại: Mật (Restricted)
            </div>

            <p style="margin-bottom:10px">
              <strong>1. Tóm tắt điều hành:</strong> Giá dầu thô Brent Physical chốt phiên ở 77.90 USD/thùng
              <span class="citation-chip" style="font-size:10px">[Nguồn 1: Platts EOD]</span>.
              Đồng thời, Crack Spread Xăng RON95 Physical nới rộng lên 14.20 USD/thùng
              <span class="citation-chip" style="font-size:10px">[BSR Formula CS-PHYS-1]</span>.
            </p>

            <p style="margin-bottom:10px">
              <strong>2. Tình hình vận hành Dung Quất:</strong> Mức tồn kho dầu thô ghi nhận 285.000 tấn
              <span class="citation-chip" style="font-size:10px">[Excel Sheet BSR-INV]</span>,
              công suất phân xưởng CDU duy trì 105%, đảm bảo biên lợi nhuận kinh doanh tối ưu trong quý 4.
            </p>

            <div style="background:#131E36;border:1px solid var(--border-card);padding:10px;border-radius:4px;margin-top:14px">
              <strong style="color:var(--primary-navy)">Khuyến nghị Điều hành:</strong> Đề xuất lãnh đạo phê duyệt kế hoạch chốt giá lô dầu ngọt nhẹ kỳ giao tháng 12/2026.
            </div>
          </div>

          <div style="padding:12px 16px;border-top:1px solid var(--border-card);background:#0E182F;display:flex;gap:8px">
            <button class="btn btn-sm btn-primary" style="flex:1" data-action="save-to-report-library">
              Lưu vào Thư viện (Trang 3)
            </button>
            <button class="btn btn-sm btn-secondary" data-action="export-artifact-pdf">
              ${ico('download')} Xuất PDF
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /* NON-DISRUPTIVE SLIDE-OVER DRAWER (440px) */
  function renderSlideOverDrawer() {
    if (!state.drawerOpen) return '';

    let title = 'Nhập liệu nhanh';
    let body = '';

    if (state.drawerType === 'physical_entry') {
      title = '+ Nhập nhanh Dữ liệu BSR & Giá Physical';
      body = `
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:14px">
          Nhập trực tiếp số liệu physical và vận hành nhà máy mà không mất góc nhìn bảng giá bên trái.
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Giá Dầu thô Brent Physical Dated (USD/thùng):</label>
          <input type="number" step="0.01" class="form-control-input" id="drawer-brent-phys" value="77.90">
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Giá Xăng RON95 Physical FOB Sing (USD/thùng):</label>
          <input type="number" step="0.01" class="form-control-input" id="drawer-ron95-phys" value="92.10">
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Giá Dầu Diesel 10ppm Physical (USD/thùng):</label>
          <input type="number" step="0.01" class="form-control-input" id="drawer-do-phys" value="96.40">
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Tồn kho Dầu thô Nhà máy Dung Quất (tấn):</label>
          <input type="number" class="form-control-input" id="drawer-inv" value="285000">
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Tải công suất vận hành CDU (%):</label>
          <input type="number" step="0.1" class="form-control-input" id="drawer-cdu" value="105.0">
        </div>
        <div style="padding:10px;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.35);border-radius:6px;font-size:11.5px;color:#FBBF24;margin-top:10px">
          ⚠️ Số liệu sau khi nhập sẽ tự động tính toán lại Crack Spread và ghi log kiểm toán (Audit Trail).
        </div>
      `;
    } else if (state.drawerType === 'quick_news') {
      title = '+ Thêm tin nhanh từ Platts / Bloomberg';
      body = `
        <div class="form-field-group">
          <label class="form-field-label">Tiêu đề tin tức:</label>
          <input type="text" class="form-control-input" value="Bản tin nhanh: Cước tàu tuyến Trung Đông tăng nhẹ">
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Nguồn tin:</label>
          <select class="form-control-select">
            <option>Platts</option>
            <option>Reuters</option>
            <option>Bloomberg</option>
            <option>Argus</option>
          </select>
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Nội dung tóm lược:</label>
          <textarea class="form-control-textarea" rows="4">Phụ phí bảo hiểm tàu dầu qua khu vực Vùng Vịnh tăng nhẹ trong phiên giao dịch sáng nay.</textarea>
        </div>
      `;
    } else if (state.drawerType === 'excel_upload') {
      title = 'Tải nhanh file Excel / Báo cáo Nghiên cứu';
      body = `
        <div class="upload-dropzone">
          <div style="font-size:24px;margin-bottom:6px">📊</div>
          <strong style="color:var(--text-main)">Kéo thả file Excel (.xlsx, .csv) vào đây</strong>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">Hệ thống sẽ tự động đối soát cột chỉ số và phân loại bảo mật</div>
        </div>
      `;
    } else if (state.drawerType === 'news_detail' && state.drawerData) {
      const n = state.drawerData;
      title = 'Chi tiết Bản tin Thị trường';
      body = `
        <div style="margin-bottom:12px">
          <span class="badge badge-source">${esc(n.source)}</span>
          <span style="font-size:11px;color:var(--text-muted);margin-left:6px">${esc(n.time)}</span>
        </div>
        <h3 style="font-size:15px;font-weight:800;color:var(--text-main);margin-bottom:12px">${esc(n.title)}</h3>
        
        <div style="font-size:12.5px;line-height:1.6;margin-bottom:14px;color:var(--text-sub)">
          ${esc(n.summary)}
        </div>

        <div style="background:#0A0F1D;border:1px solid var(--border-card);padding:12px;border-radius:6px;font-size:12px">
          <strong style="color:var(--primary-navy)">Độ phủ nguồn tin:</strong> Tin tức được ghi nhận đồng thời từ Reuters và Platts. Đã loại trừ trùng lặp nội dung.
        </div>
      `;
    }

    return `
      <div class="drawer-backdrop active" data-action="close-drawer"></div>
      <aside class="slide-over-drawer active">
        <div class="drawer-header">
          <div class="drawer-title">${esc(title)}</div>
          <button class="topbar-icon-btn" data-action="close-drawer">${ico('close')}</button>
        </div>
        <div class="drawer-content">
          ${body}
        </div>
        <div class="drawer-footer">
          <button class="btn btn-secondary" data-action="close-drawer">Hủy</button>
          <button class="btn btn-primary" data-action="save-drawer-data">Lưu dữ liệu & Cập nhật</button>
        </div>
      </aside>
    `;
  }

  /* MODAL POPUPS */
  function renderModalPopup() {
    if (!state.modalOpen) return '';

    let content = '';
    if (state.modalType === 'crack_formula') {
      content = `
        <div style="padding:20px;border-bottom:1px solid var(--border-card);display:flex;justify-content:space-between;align-items:center">
          <strong style="font-size:15px;color:var(--text-main)">Công thức Chuẩn Tính Crack Spread của BSR</strong>
          <button class="topbar-icon-btn" data-action="close-modal">${ico('close')}</button>
        </div>
        <div style="padding:20px;font-size:13px;line-height:1.6;color:var(--text-sub)">
          <p><strong style="color:var(--primary-navy)">1. Crack Spread Xăng RON95 Physical (CS-PHYS-1 v2.1):</strong></p>
          <div style="background:#0E182F;padding:10px;border-radius:6px;font-family:var(--font-mono);margin:6px 0 14px;color:#00E5FF">
            CS_RON95 = Giá Xăng RON95 FOB Singapore (USD/bbl) − Giá Dated Brent Physical (USD/bbl)
          </div>

          <p><strong style="color:var(--primary-navy)">2. Crack Spread Dầu Diesel 10ppm Physical (CS-PHYS-2 v2.0):</strong></p>
          <div style="background:#0E182F;padding:10px;border-radius:6px;font-family:var(--font-mono);margin:6px 0 14px;color:#00E5FF">
            CS_Diesel = Giá Diesel 10ppm FOB Singapore (USD/bbl) − Giá Dated Brent Physical (USD/bbl)
          </div>

          <p><strong style="color:var(--primary-navy)">3. Crack Spread 3-2-1 Phức hợp Dung Quất (CS-321-BSR v1.4):</strong></p>
          <div style="background:#0E182F;padding:10px;border-radius:6px;font-family:var(--font-mono);margin:6px 0;color:#00E5FF">
            CS_321 = (2 × Giá RON95 + 1 × Giá Diesel 10ppm − 3 × Giá Brent) / 3
          </div>
        </div>
        <div style="padding:14px 20px;border-top:1px solid var(--border-card);display:flex;justify-content:flex-end">
          <button class="btn btn-primary" data-action="close-modal">Đã hiểu</button>
        </div>
      `;
    }

    return `
      <div class="modal-overlay">
        <div class="modal-box">
          ${content}
        </div>
      </div>
    `;
  }

  /* MAIN APPLICATION RENDER */
  function render() {
    const role = getRole();
    const navGroups = getNavigation();

    let pageHtml = '';
    switch (state.route) {
      case 'overview': pageHtml = renderOverviewPage(); break;
      case 'market-data': pageHtml = renderMarketDataPage(); break;
      case 'reports': pageHtml = renderReportsPage(); break;
      case 'forecast': pageHtml = renderForecastPage(); break;
      case 'ingestion': pageHtml = renderIngestionPage(); break;
      case 'sources': pageHtml = renderSourcesPage(); break;
      case 'assistant': pageHtml = renderAssistantWorkspace(); break;
      case 'admin':
        pageHtml = role.admin ? renderAdminPage() : `
          <div class="card" style="text-align:center;padding:40px;margin-top:40px">
            <div style="font-size:32px;margin-bottom:10px">🔒</div>
            <h2 style="font-size:16px;color:var(--text-main)">Từ chối truy cập</h2>
            <p style="font-size:12.5px;color:var(--text-muted);margin:8px 0 16px">Vai trò hiện tại (${esc(role.label)}) không có quyền quản trị hệ thống.</p>
            <button class="btn btn-primary" data-action="nav-page" data-page="overview">Quay lại Tổng quan</button>
          </div>
        `;
        break;
      default:
        pageHtml = renderOverviewPage();
    }

    const appHtml = `
      <a class="skip-link" href="#main-content">Bỏ qua đến nội dung chính</a>
      <div class="app">
        <!-- SIDEBAR DARK -->
        <aside class="sidebar ${state.sidebarCollapsed ? 'collapsed' : ''}" id="app-sidebar">
          <div class="sidebar-head">
            <div class="brand-lockup">
              <div class="brand-mark">BSR</div>
              <div class="brand-text">
                <div class="brand-title">BSR Market Intel</div>
                <div class="brand-sub">Terminal · AI Auker</div>
              </div>
            </div>
            <button class="sidebar-toggle" data-action="toggle-sidebar" title="Thu gọn / Mở rộng thanh bên">
              ${ico(state.sidebarCollapsed ? 'chevron' : 'chevronLeft', 14)}
            </button>
          </div>

          <nav class="sidebar-nav">
            ${navGroups.map(g => `
              <div>
                <div class="nav-section-label">${esc(g.title)}</div>
                <div style="display:flex;flex-direction:column;gap:3px">
                  ${g.items.map(item => `
                    <a href="#${item.id}" class="nav-item ${state.route === item.id ? 'active' : ''}" data-action="nav-page" data-page="${item.id}" title="${esc(item.label)}">
                      ${ico(item.icon, 16)}
                      <span>${esc(item.label)}</span>
                      ${item.isAI ? `<span class="nav-badge-ai">AI</span>` : ''}
                    </a>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </nav>

          <div class="sidebar-foot">
            <div class="user-badge-sidebar">
              <div class="user-avatar">${esc(role.initials)}</div>
              <div class="user-info-sidebar">
                <div class="user-name-sidebar">${esc(role.name)}</div>
                <div class="user-role-sidebar">${esc(role.department)}</div>
              </div>
            </div>
          </div>
        </aside>

        <!-- MAIN WRAPPER -->
        <div class="main-wrapper ${state.sidebarCollapsed ? 'sidebar-collapsed' : ''}">
          <!-- TOPBAR DARK -->
          <header class="header-topbar">
            <div class="topbar-left">
              <span class="page-title-badge">
                ${state.route === 'overview' ? 'Tổng quan Thị trường' :
                  state.route === 'market-data' ? 'Dữ liệu Thị trường Chuyên sâu' :
                  state.route === 'reports' ? 'Báo cáo & Bản tin Video' :
                  state.route === 'forecast' ? 'Đánh giá Dự báo & Khuyến nghị' :
                  state.route === 'ingestion' ? 'Nhập liệu & Tin tức' :
                  state.route === 'sources' ? 'Đánh giá Nguồn tin' :
                  state.route === 'assistant' ? 'Trợ lý Thị trường BSR' : 'Quản trị Hệ thống'}
              </span>
              
              <div class="date-filter-chip">
                ${ico('calendar', 13)}
                <span>${esc(state.dateFilter)}</span>
              </div>
            </div>

            <div class="topbar-right">
              <button class="theme-toggle-btn" data-action="toggle-theme" title="Chuyển đổi giao diện Sáng / Tối">
                ${state.theme === 'dark' ? '🌙 Chế độ Tối' : '☀️ Giao diện Sáng BSR'}
              </button>
              <div class="role-switcher-wrap">
                <span class="role-switcher-label">Vai trò:</span>
                <select class="role-switcher-select" id="role-switcher-select">
                  <option value="leadership" ${state.role === 'leadership' ? 'selected' : ''}>Lãnh đạo [Full Physical]</option>
                  <option value="mi" ${state.role === 'mi' ? 'selected' : ''}>Đội MI [Nhập liệu & Admin]</option>
                  <option value="internal" ${state.role === 'internal' ? 'selected' : ''}>Nhân viên nội bộ [Ẩn Physical]</option>
                </select>
              </div>

              <button class="topbar-icon-btn" title="Tìm kiếm">${ico('search', 16)}</button>
              <button class="topbar-icon-btn" title="Thông báo">
                ${ico('bell', 16)}
                <span class="notif-badge"></span>
              </button>
            </div>
          </header>

          <!-- MARKET TAPE BAR -->
          <div class="market-tape-bar">
            ${D.instruments.slice(0, 7).map(item => {
              const isLocked = item.classification === 'Restricted' && !canSeeRestricted();
              if (isLocked) return '';
              return `
                <div class="tape-item" data-action="nav-market-detail" data-inst-id="${item.id}">
                  <span class="tape-label">${esc(item.short)}:</span>
                  <span class="tape-val">${fmtNum(item.value, item.decimals)} ${esc(item.unit)}</span>
                  <span class="tape-chg ${item.change >= 0 ? 'pos' : 'neg'}">(${fmtPct(item.pct)})</span>
                </div>
              `;
            }).join('')}
            ${!canSeeRestricted() ? `<span class="badge badge-restricted" style="font-size:10px">${ico('lock', 10)} Dữ liệu giá Physical Mật đã được ẩn theo quyền vai trò</span>` : ''}
          </div>

          <main id="main-content" class="page-container">
            ${pageHtml}
          </main>
        </div>
      </div>

      <!-- NON-DISRUPTIVE SLIDE-OVER DRAWER -->
      ${renderSlideOverDrawer()}

      <!-- MODALS -->
      ${renderModalPopup()}

      <!-- TOAST CONTAINER -->
      <div id="toast-stack" class="toast-stack"></div>
    `;

    $('#app').innerHTML = appHtml;
    attachEventListeners();
  }

  /* EVENT LISTENERS & ROUTING */
  function attachEventListeners() {
    const roleSelect = $('#role-switcher-select');
    if (roleSelect) {
      roleSelect.addEventListener('change', (e) => {
        state.role = e.target.value;
        showToast(`Đã chuyển vai trò: ${getRole().label}`);
        render();
      });
    }

    const copilotInput = $('#copilot-text-input');
    if (copilotInput) {
      copilotInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleCopilotSubmit();
        }
      });
    }

    /* Interactive Chart Mousemove for Crosshair HUD */
    const chartSvg = $('#main-interactive-chart-svg');
    if (chartSvg) {
      chartSvg.addEventListener('mousemove', (e) => {
        const rect = chartSvg.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const padL = 65, padR = 65;
        const chartW = rect.width;
        const ratio = Math.max(0, Math.min(1, (mouseX - (padL / 900) * chartW) / (((900 - padL - padR) / 900) * chartW)));
        const ptsCount = state.chartRange === '1D' ? 14 : state.chartRange === '1W' ? 20 : state.chartRange === '1M' ? 30 : 90;
        const hoveredIdx = Math.round(ratio * (ptsCount - 1));
        if (hoveredIdx !== state.hoverChartIndex) {
          state.hoverChartIndex = hoveredIdx;
          render();
        }
      });
    }
  }

  function handleCopilotSubmit() {
    const input = $('#copilot-text-input');
    if (!input || !input.value.trim()) return;
    const q = input.value.trim();
    state.copilotResponses.unshift({
      prompt: q,
      response: `Phân tích AI cho câu hỏi "${q}":\nBiên độ Crack Spread RON95 đạt 14.20 USD/thùng (+2.53%) kết hợp tồn kho Dung Quất 285.000 tấn bảo đảm hiệu quả vận hành vượt kế hoạch. Khuyến nghị Quý Lãnh đạo xem chi tiết ở Không gian AI Chat.`
    });
    input.value = '';
    render();
  }

  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.getAttribute('data-action');

    switch (action) {
      case 'toggle-sidebar':
        state.sidebarCollapsed = !state.sidebarCollapsed;
        render();
        break;

      case 'nav-page': {
        const page = target.getAttribute('data-page');
        if (page) {
          state.lastRoute = state.route;
          state.route = page;
          window.location.hash = page;
          render();
        }
        break;
      }

      case 'nav-market-detail': {
        const instId = target.getAttribute('data-inst-id');
        state.lastRoute = state.route;
        state.route = 'market-data';
        state.activeChartInstrument = instId;
        if (!state.selectedInstruments.includes(instId)) {
          state.selectedInstruments = [instId, state.selectedInstruments[0]].filter(Boolean);
        }
        window.location.hash = 'market-data';
        render();
        break;
      }

      case 'select-overview-instrument': {
        const instId = target.getAttribute('data-inst-id');
        if (instId) {
          state.activeOverviewInstrument = instId;
          render();
          const panel = document.getElementById('inplace-chart-panel');
          if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        break;
      }

      case 'set-overview-range': {
        const r = target.getAttribute('data-range');
        if (r) {
          state.overviewChartRange = r;
          render();
        }
        break;
      }

      case 'toggle-theme': {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('bsr_theme', state.theme);
        document.documentElement.setAttribute('data-theme', state.theme);
        render();
        break;
      }

      case 'set-overview-tab':
        state.overviewTab = target.getAttribute('data-tab');
        render();
        break;

      case 'open-drawer': {
        const type = target.getAttribute('data-drawer-type');
        state.drawerOpen = true;
        state.drawerType = type;
        render();
        break;
      }

      case 'close-drawer':
        state.drawerOpen = false;
        state.drawerType = null;
        state.drawerData = null;
        render();
        break;

      case 'save-drawer-data':
        state.drawerOpen = false;
        showToast('Đã lưu dữ liệu thành công vào cơ sở dữ liệu thị trường!');
        render();
        break;

      case 'nav-dedicated-ai':
        state.lastRoute = state.route;
        state.route = 'assistant';
        window.location.hash = 'assistant';
        render();
        break;

      case 'nav-back-previous':
        state.route = state.lastRoute || 'overview';
        window.location.hash = state.route;
        render();
      break;

      case 'trigger-copilot-prompt': {
        const prompt = target.getAttribute('data-prompt');
        state.copilotResponses.unshift({
          prompt: prompt,
          response: `Phân tích AI cho "${prompt}":\nĐã nạp số liệu chốt phiên Platts 13/11 và tồn kho Dung Quất. Các chỉ số đều nằm trong biên độ an toàn, biên lợi nhuận lọc dầu tăng trưởng tốt.`
        });
        render();
        break;
      }

      case 'submit-copilot':
        handleCopilotSubmit();
        break;

      case 'open-news-detail': {
        const newsId = target.getAttribute('data-news-id');
        const found = D.top10News.find(n => n.id === newsId);
        if (found) {
          state.drawerOpen = true;
          state.drawerType = 'news_detail';
          state.drawerData = found;
          render();
        }
        break;
      }

      case 'set-chart-mode':
        state.chartMode = target.getAttribute('data-mode');
        render();
        break;

      case 'set-chart-range':
        state.chartRange = target.getAttribute('data-range');
        render();
        break;

      case 'toggle-instrument-pick': {
        const instId = target.getAttribute('data-inst-id');
        if (state.selectedInstruments.includes(instId)) {
          if (state.selectedInstruments.length > 1) {
            state.selectedInstruments = state.selectedInstruments.filter(id => id !== instId);
          }
        } else {
          state.selectedInstruments.push(instId);
        }
        state.activeChartInstrument = instId;
        render();
        break;
      }

      case 'show-crack-formula-popover':
        state.modalOpen = true;
        state.modalType = 'crack_formula';
        render();
        break;

      case 'close-modal':
        state.modalOpen = false;
        state.modalType = null;
        render();
        break;

      case 'set-reports-tab':
        state.reportsTab = target.getAttribute('data-tab');
        render();
        break;

      case 'open-report-preview': {
        const rId = target.getAttribute('data-report-id');
        showToast(`Đang mở bản xem trước báo cáo ${rId}`);
        state.lastRoute = state.route;
        state.route = 'assistant';
        window.location.hash = 'assistant';
        render();
        break;
      }

      case 'download-report-pdf':
      case 'export-market-data':
      case 'export-audit-log':
      case 'export-artifact-pdf':
        showToast('Đang tạo và tải xuống tài liệu chuẩn mẫu BSR (PDF/Excel)...');
        break;

      case 'set-rec-filter':
        state.recCategoryFilter = target.getAttribute('data-filter');
        render();
        break;

      case 'trigger-new-ai-recommendation':
        showToast('AI Auker đang tính toán và cập nhật khuyến nghị dựa trên dữ liệu mới nhất...');
        break;

      case 'set-ingest-tab':
        state.ingestionTab = target.getAttribute('data-tab');
        render();
        break;

      case 'submit-quick-news':
      case 'submit-quick-prices':
      case 'publish-news':
        showToast('Đã lưu dữ liệu thành công!');
        break;

      case 'set-source-period':
        state.sourcePeriodFilter = target.getAttribute('data-period');
        render();
        break;

      case 'verify-log-entry':
        showToast('Đã ghi nhận kiểm chứng thực tế và cộng dồn điểm Accuracy của nguồn tin!');
        break;

      case 'set-admin-tab':
        state.adminTab = target.getAttribute('data-tab');
        render();
        break;

      case 'sync-all-sources':
      case 'sync-source-now':
        showToast('Đã bắt đầu tiến trình đồng bộ dữ liệu với nguồn tin...');
        break;

      case 'seek-video-chapter': {
        const idx = Number(target.getAttribute('data-chapter-idx'));
        state.activeChapter = idx;
        showToast(`Tua nhanh đến đoạn: ${D.videoBriefing.chapters[idx].title}`);
        render();
        break;
      }

      case 'select-ai-thread': {
        state.aiActiveThreadId = target.getAttribute('data-thread-id');
        render();
        break;
      }

      case 'submit-chat-message': {
        const ta = $('#chat-input-textarea');
        if (!ta || !ta.value.trim()) return;
        const msg = ta.value.trim();
        const th = D.aiConversations.find(c => c.id === state.aiActiveThreadId) || D.aiConversations[0];
        th.messages.push({
          role: 'user',
          text: msg,
          time: '09:43 ICT'
        });
        th.messages.push({
          role: 'assistant',
          steps: [
            { text: `Kiểm tra quyền RBAC (${getRole().label}) -> Hợp lệ.`, state: 'done' },
            { text: 'Trích xuất số liệu từ CSDL BSR và thị trường quốc tế.', state: 'done' },
            { text: 'Chạy mô hình phân tích định lượng.', state: 'done' }
          ],
          text: `Auker đã tiếp nhận yêu cầu "${msg}". Dữ liệu thị trường hiện tại xác nhận tính khả thi của phương án. Bản tóm tắt đã được phản ánh sang khung xem trước bên phải.`,
          time: '09:44 ICT'
        });
        ta.value = '';
        render();
        break;
      }
    }
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash !== state.route) {
      state.lastRoute = state.route;
      state.route = hash;
      render();
    }
  });

  const initialHash = window.location.hash.replace('#', '');
  if (initialHash) {
    state.route = initialHash;
  }
  document.documentElement.setAttribute("data-theme", state.theme);
  render();
})();
