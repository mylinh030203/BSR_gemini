import re

with open('docs/design/prototype/assets/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update state
old_state = """    /* Overview Page State */
    overviewTab: 'all',"""

new_state = """    /* Theme & Overview State */
    theme: localStorage.getItem('bsr_theme') || 'light',
    overviewTab: 'all',
    activeOverviewInstrument: 'brent_physical',
    overviewChartRange: '1M',"""

code = code.replace(old_state, new_state, 1)

# 2. Replace Chart Engine with Clean, Minimalist & Beautiful Chart Engine
old_chart_engine_start = "  /* Mini Sparkline with Smooth Gradient & Glowing End Point */"
old_chart_engine_end = "  /* Navigation Structure per Plan */"

start_idx = code.find(old_chart_engine_start)
end_idx = code.find(old_chart_engine_end)

if start_idx != -1 and end_idx != -1:
    new_chart_engine = '''  /* Mini Sparkline with Smooth Gradient (Clean & Sleek) */
  function renderSparklineSvg(spark, isPos = true, height = 36) {
    if (!spark || !spark.length) return '';
    const W = 200, H = height;
    const pad = { t: 4, b: 4, l: 2, r: 4 };
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
            <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.16"/>
            <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <path d="${areaD}" fill="url(#${gradId})"/>
        <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="${lastPt.x.toFixed(1)}" cy="${lastPt.y.toFixed(1)}" r="3" fill="${strokeColor}"/>
      </svg>
    `;
  }

  /* Single Series Clean Chart for In-Place Panel (Simple, Elegant & Modern) */
  function renderCleanChartSvg({ series, name1 = 'Giá trị', unit1 = '', decimals1 = 2, range = '1M', color1 = '#007A87', height = 220, chartId = 'clean-chart' }) {
    const W = 880, H = height;
    const pad = { l: 60, r: 24, t: 18, b: 32 };
    const pointsCount = range === '1D' ? 12 : range === '1W' ? 18 : range === '1M' ? 30 : range === '3M' ? 60 : 90;
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
    const lastPt = pts[pts.length - 1];

    /* Horizontal gridlines (3 clean lines) */
    let gridLines = '', yLabels = '';
    for (let i = 0; i <= 2; i++) {
      const gy = pad.t + (i / 2) * (H - pad.t - pad.b);
      const v = maxVal - (i / 2) * (maxVal - minVal);
      gridLines += `<line x1="${pad.l}" y1="${gy.toFixed(1)}" x2="${(W - pad.r).toFixed(1)}" y2="${gy.toFixed(1)}" stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="3,3"/>`;
      yLabels += `<text x="${pad.l - 10}" y="${(gy + 4).toFixed(1)}" font-size="10.5" font-family="var(--font-mono)" fill="var(--text-muted)" text-anchor="end">${fmtNum(v, decimals1)}</text>`;
    }

    /* X Axis dates (5 clean points) */
    let xLabels = '';
    const dateIntervals = [0, Math.floor(pts.length * 0.25), Math.floor(pts.length * 0.5), Math.floor(pts.length * 0.75), pts.length - 1];
    dateIntervals.forEach(idx => {
      const p = pts[idx];
      if (!p) return;
      const dStr = p.date ? new Date(p.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : `T-${idx}`;
      xLabels += `<text x="${p.x.toFixed(1)}" y="${H - 10}" font-size="10" fill="var(--text-muted)" text-anchor="middle">${dStr}</text>`;
    });

    const activeIdx = state.hoverChartIndex != null ? Math.min(state.hoverChartIndex, pts.length - 1) : pts.length - 1;
    const curP = pts[activeIdx];

    return `
      <div class="clean-chart-container" style="position:relative">
        <svg class="chart-svg-main" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
          <defs>
            <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${color1}" stop-opacity="0.14"/>
              <stop offset="100%" stop-color="${color1}" stop-opacity="0.0"/>
            </linearGradient>
          </defs>

          ${gridLines}
          ${yLabels}
          ${xLabels}

          <path d="${areaD}" fill="url(#${gradId})"/>
          <path d="${pathD}" fill="none" stroke="${color1}" stroke-width="2.2" stroke-linecap="round"/>

          <!-- Latest point indicator -->
          <circle cx="${lastPt.x.toFixed(1)}" cy="${lastPt.y.toFixed(1)}" r="4" fill="${color1}" stroke="var(--bg-card)" stroke-width="2"/>
          <circle cx="${lastPt.x.toFixed(1)}" cy="${lastPt.y.toFixed(1)}" r="8" fill="${color1}" fill-opacity="0.2"/>

          <!-- Interactive Hover Hairline -->
          <line x1="${curP.x.toFixed(1)}" y1="${pad.t}" x2="${curP.x.toFixed(1)}" y2="${H - pad.b}" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/>
          <circle cx="${curP.x.toFixed(1)}" cy="${curP.y.toFixed(1)}" r="4.5" fill="${color1}" stroke="#FFFFFF" stroke-width="2"/>
        </svg>
      </div>
    `;
  }

  /* Multi-Axis Time Series Chart Generator (Simple, Beautiful & Clean) */
  function renderMultiAxisChart(instrumentsToDraw, mode = 'multiaxis', range = '1M') {
    const W = 880, H = 280;
    const pad = { l: 60, r: 60, t: 24, b: 36 };
    const inst1 = instrumentsToDraw[0];
    const inst2 = instrumentsToDraw[1];

    if (!inst1) return '<div class="empty-state">Vui lòng chọn ít nhất một chỉ số để vẽ biểu đồ</div>';

    const pointsCount = range === '1D' ? 12 : range === '1W' ? 18 : range === '1M' ? 30 : range === '3M' ? 60 : 90;
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
      yLabels += `<text x="${pad.l - 10}" y="${(gy + 4).toFixed(1)}" font-size="10.5" font-family="var(--font-mono)" fill="var(--accent-teal)" text-anchor="end" font-weight="600">${fmtNum(v1, inst1.decimals)}</text>`;
      if (inst2 && mode === 'multiaxis') {
        const v2 = max2 - (i / 2) * (max2 - min2);
        yLabels += `<text x="${(W - pad.r + 10).toFixed(1)}" y="${(gy + 4).toFixed(1)}" font-size="10.5" font-family="var(--font-mono)" fill="#D97706" text-anchor="start" font-weight="600">${fmtNum(v2, inst2.decimals)}</text>`;
      }
    }

    /* X Axis Dates */
    let xLabels = '';
    const dateIntervals = [0, Math.floor(pts1.length * 0.25), Math.floor(pts1.length * 0.5), Math.floor(pts1.length * 0.75), pts1.length - 1];
    dateIntervals.forEach(idx => {
      const p = pts1[idx];
      if (!p) return;
      const dStr = p.date ? new Date(p.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : `T-${idx}`;
      xLabels += `<text x="${p.x.toFixed(1)}" y="${H - 12}" font-size="10" fill="var(--text-muted)" text-anchor="middle">${dStr}</text>`;
    });

    const activeIdx = state.hoverChartIndex != null ? Math.min(state.hoverChartIndex, pts1.length - 1) : pts1.length - 1;
    const curP1 = pts1[activeIdx];
    const curP2 = pts2 ? pts2[activeIdx] : null;

    return `
      <!-- Clean Top HUD Data Bar -->
      <div class="clean-chart-hud">
        <div style="display:flex;align-items:center;gap:18px">
          <div style="display:flex;align-items:center;gap:6px">
            <span style="width:8px;height:8px;border-radius:50%;background:var(--accent-teal)"></span>
            <strong style="color:var(--text-main);font-size:12px">${esc(inst1.name)}:</strong>
            <span style="font-family:var(--font-mono);font-size:13.5px;font-weight:700;color:var(--accent-teal)">${fmtNum(curP1.value, inst1.decimals)}</span>
            <span style="font-size:11px;color:var(--text-muted)">${esc(inst1.unit)}</span>
          </div>

          ${inst2 ? `
            <div style="display:flex;align-items:center;gap:6px">
              <span style="width:8px;height:8px;border-radius:50%;background:#D97706"></span>
              <strong style="color:var(--text-main);font-size:12px">${esc(inst2.name)}:</strong>
              <span style="font-family:var(--font-mono);font-size:13.5px;font-weight:700;color:#D97706">${fmtNum(curP2.value, inst2.decimals)}</span>
              <span style="font-size:11px;color:var(--text-muted)">${esc(inst2.unit)}</span>
            </div>
          ` : ''}
        </div>

        <div style="font-size:11px;color:var(--text-muted)">
          Ngày: <strong style="color:var(--text-main)">${curP1.date ? new Date(curP1.date).toLocaleDateString('vi-VN') : '14/11/2026'}</strong>
        </div>
      </div>

      <svg class="chart-svg-main" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="multi-grad-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent-teal)" stop-opacity="0.14"/>
            <stop offset="100%" stop-color="var(--accent-teal)" stop-opacity="0.0"/>
          </linearGradient>
          <linearGradient id="multi-grad-2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#D97706" stop-opacity="0.12"/>
            <stop offset="100%" stop-color="#D97706" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        ${gridLines}
        ${yLabels}
        ${xLabels}

        <path d="${area1}" fill="url(#multi-grad-1)"/>
        <path d="${path1}" fill="none" stroke="var(--accent-teal)" stroke-width="2.2" stroke-linecap="round"/>

        ${pts2 ? `
          <path d="${area2}" fill="url(#multi-grad-2)"/>
          <path d="${path2}" fill="none" stroke="#D97706" stroke-width="2.0" stroke-dasharray="4,3" stroke-linecap="round"/>
        ` : ''}

        <!-- Hover Hairline -->
        <line x1="${curP1.x.toFixed(1)}" y1="${pad.t}" x2="${curP1.x.toFixed(1)}" y2="${H - pad.b}" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/>
        <circle cx="${curP1.x.toFixed(1)}" cy="${curP1.y.toFixed(1)}" r="4.5" fill="var(--accent-teal)" stroke="#FFFFFF" stroke-width="2"/>
        ${curP2 ? `
          <circle cx="${curP2.x.toFixed(1)}" cy="${curP2.y.toFixed(1)}" r="4.5" fill="#D97706" stroke="#FFFFFF" stroke-width="2"/>
        ` : ''}
      </svg>
    `;
  }
'''
    code = code[:start_idx] + new_chart_engine + code[end_idx:]

# 3. Replace renderOverviewPage with In-Place Chart Panel
old_overview_start = "  /* TRANG 1: TỔNG QUAN THỊ TRƯỜNG */\n  function renderOverviewPage() {"
old_overview_end = "  /* TRANG 2: DỮ LIỆU THỊ TRƯỜNG CHUYÊN SÂU */"

start_ov = code.find(old_overview_start)
end_ov = code.find(old_overview_end)

if start_ov != -1 and end_ov != -1:
    new_overview = '''  /* TRANG 1: TỔNG QUAN THỊ TRƯỜNG */
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
'''
    code = code[:start_ov] + new_overview + code[end_ov:]

# 4. Update Header Topbar with Theme Toggle Button
old_topbar_right = '''            <div class="topbar-right">
              <div class="role-switcher-wrap">'''

new_topbar_right = '''            <div class="topbar-right">
              <button class="theme-toggle-btn" data-action="toggle-theme" title="Chuyển đổi giao diện Sáng / Tối">
                ${state.theme === 'dark' ? '🌙 Chế độ Tối' : '☀️ Giao diện Sáng BSR'}
              </button>
              <div class="role-switcher-wrap">'''

code = code.replace(old_topbar_right, new_topbar_right, 1)

# 5. Add Click Handlers in document.addEventListener('click')
old_click_marker = "      case 'set-overview-tab':"
new_click_actions = """      case 'select-overview-instrument': {
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

      case 'set-overview-tab':"""

code = code.replace(old_click_marker, new_click_actions, 1)

# 6. Replace hardcoded color:#FFFFFF with color:var(--text-main) across headings and card text
code = re.sub(r'color:#FFFFFF', 'color:var(--text-main)', code)
code = re.sub(r'color: #FFFFFF', 'color:var(--text-main)', code)

# But restore color:#FFFFFF inside toast or button or brand mark where white text is specifically required
code = code.replace('class="btn btn-primary" style="color:var(--text-main)"', 'class="btn btn-primary"')
code = code.replace('toast.innerHTML = `${ico(\'check\', 16)} <span>${esc(message)}</span>`;', 'toast.innerHTML = `${ico(\'check\', 16)} <span>${esc(message)}</span>`;')

# 7. Apply theme on startup
code = code.replace('render();\n})();', 'document.documentElement.setAttribute("data-theme", state.theme);\n  render();\n})();')

with open('docs/design/prototype/assets/app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully updated app.js!")

