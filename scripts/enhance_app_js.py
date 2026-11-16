import re

with open('docs/design/prototype/assets/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the charting section
old_chart_start = "  /* Mini Sparkline with Smooth Gradient (Clean & Sleek) */"
old_chart_end = "  /* Navigation Structure per Plan */"

start_idx = code.find(old_chart_start)
end_idx = code.find(old_chart_end)

if start_idx != -1 and end_idx != -1:
    new_chart_code = '''  /* Mini Sparkline with Smooth Gradient & Beacon Dot (High-Tech & Sleek) */
  function renderSparklineSvg(spark, isPos = true, height = 40) {
    if (!spark || !spark.length) return '';
    const W = 220, H = height;
    const pad = { t: 5, b: 6, l: 3, r: 6 };
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
            <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <path d="${areaD}" fill="url(#${gradId})"/>
        <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="2.0" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="${lastPt.x.toFixed(1)}" cy="${lastPt.y.toFixed(1)}" r="6" fill="${strokeColor}" fill-opacity="0.25"/>
        <circle cx="${lastPt.x.toFixed(1)}" cy="${lastPt.y.toFixed(1)}" r="3" fill="#FFFFFF" stroke="${strokeColor}" stroke-width="1.8"/>
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
'''
    code = code[:start_idx] + new_chart_code + code[end_idx:]

with open('docs/design/prototype/assets/app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Enhanced app.js chart engine successfully!")

