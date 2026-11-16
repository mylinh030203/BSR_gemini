import re

# 1. Update data.js with realistic financial series generator
with open('docs/design/prototype/assets/data.js', 'r', encoding='utf-8') as f:
    data_js = f.read()

old_series_func = """  function series(base, drift, vol, seed, n) {
    const out = [];
    let value = base;
    for (let i = n - 1; i >= 0; i--) {
      const t = (n - i) / n;
      const noise = Math.sin((i + seed) * 1.31) * vol + Math.cos((i + seed * 2.1) * 0.43) * vol * 0.55;
      value = base * (1 - drift * t) + noise + Math.sin(i * 0.11 + seed) * base * 0.012;
      out.push({ date: new Date(end.getTime() - i * DAY), value: Math.round(value * 100) / 100 });
    }
    out[out.length - 1].value = base;
    return out;
  }"""

new_series_func = """  function series(base, drift, vol, seed, n) {
    const out = [];
    let s = (Math.abs(seed) * 16807 + 1013904223) % 2147483647;
    function rnd() {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    }

    const values = new Array(n);
    values[n - 1] = base;
    let cur = base;
    for (let i = n - 2; i >= 0; i--) {
      const progress = i / n;
      // Macro trend wave (1-2 smooth natural market swings across the period)
      const macro = Math.sin(progress * Math.PI * 1.6 + seed * 0.7) * (vol * 1.4);
      // Realistic random-walk price step with drift
      const step = (rnd() - 0.485) * (vol * 0.42) - (drift * base * 0.0025);
      cur -= step;
      values[i] = cur + macro * 0.12;
    }

    const offset = base - values[n - 1];
    for (let i = 0; i < n; i++) {
      const v = Math.round((values[i] + offset * (i / (n - 1 || 1))) * 100) / 100;
      out.push({ date: new Date(end.getTime() - (n - 1 - i) * DAY), value: v });
    }
    return out;
  }"""

if old_series_func in data_js:
    data_js = data_js.replace(old_series_func, new_series_func, 1)
    with open('docs/design/prototype/assets/data.js', 'w', encoding='utf-8') as f:
        f.write(data_js)
    print("Updated data.js series function successfully!")
else:
    print("Could not find exact old series function in data.js, checking regex...")

# 2. Append comprehensive CSS rules to styles.css for all missing classes
css_addition = """
/* ==========================================================================
   PAGE 3: VIDEO BRIEFING LAYOUT (EXECUTIVE BROADCAST & CHAPTERS)
   ========================================================================== */
.video-briefing-wrap {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 28px;
  box-shadow: var(--shadow-card);
}

.video-player-mockup {
  position: relative;
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, #070E1E 0%, #112240 100%);
  border-radius: var(--radius-md);
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.video-center-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(0, 122, 135, 0.88);
  backdrop-filter: blur(4px);
  color: #FFFFFF;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(0, 122, 135, 0.5);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.video-center-play:hover {
  transform: translate(-50%, -50%) scale(1.1);
  background: var(--accent-teal);
}

.video-controls-bottom {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  padding: 8px 14px;
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 11.5px;
  font-family: var(--font-mono);
}

.video-progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
}

.video-progress-fill {
  width: 35%;
  height: 100%;
  background: var(--accent-teal);
  border-radius: 2px;
}

.chapters-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 380px;
  overflow-y: auto;
}

.chapter-item {
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  cursor: pointer;
  transition: all 0.15s ease;
}
.chapter-item:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent-teal);
  transform: translateX(3px);
}
.chapter-item.active {
  background: var(--accent-teal-light);
  border-color: var(--accent-teal);
  border-left: 3px solid var(--accent-teal);
}

.chapter-time {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 11.5px;
  color: var(--accent-teal);
}

/* ==========================================================================
   PAGE 4 & 6: 4-COLUMN KPI ACCURACY GRID & CARDS
   ========================================================================== */
.kpi-accuracy-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.kpi-accuracy-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-card);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.kpi-accuracy-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--border-strong);
}

.kpi-num {
  font-size: 26px;
  font-weight: 800;
  font-family: var(--font-mono);
  margin: 6px 0;
  letter-spacing: -0.5px;
}

/* ==========================================================================
   PAGE 5: SPLIT-VIEW QUICK INGESTION WORKSPACE & FORMS
   ========================================================================== */
.split-view-container {
  display: grid;
  grid-template-columns: 46fr 54fr;
  gap: 20px;
  margin-bottom: 28px;
  align-items: start;
}

.form-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.form-field-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-main);
  display: block;
}

.form-control-input, .form-control-select {
  width: 100%;
  padding: 9px 13px;
  border-radius: 8px;
  border: 1px solid var(--border-card);
  background: var(--bg-card-subtle);
  color: var(--text-main);
  font-size: 12.5px;
  outline: none;
  transition: border-color 0.15s;
}
.form-control-input:focus, .form-control-select:focus {
  border-color: var(--accent-teal);
  background: var(--bg-card);
}

.form-control-textarea {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--border-card);
  background: var(--bg-card-subtle);
  color: var(--text-main);
  font-size: 13px;
  line-height: 1.5;
  resize: vertical;
  min-height: 110px;
  outline: none;
  transition: border-color 0.15s;
}
.form-control-textarea:focus {
  border-color: var(--accent-teal);
  background: var(--bg-card);
}

.upload-dropzone {
  border: 2px dashed var(--border-strong);
  border-radius: var(--radius-md);
  padding: 36px 20px;
  text-align: center;
  background: var(--bg-card-subtle);
  cursor: pointer;
  transition: all 0.15s;
}
.upload-dropzone:hover {
  border-color: var(--accent-teal);
  background: var(--accent-teal-light);
}

/* ==========================================================================
   PAGE AI ASSISTANT: 3-COLUMN ENTERPRISE WORKSPACE & CHAT STUDIO
   ========================================================================== */
.ai-workspace-3col {
  display: grid;
  grid-template-columns: 240px 1fr 380px;
  gap: 16px;
  height: calc(100vh - var(--header-h) - 48px);
  min-height: 560px;
}

.ai-history-panel, .ai-chat-stream-panel, .ai-preview-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.ai-reasoning-step {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: var(--bg-card-subtle);
  border-radius: 6px;
  font-size: 11px;
  margin-bottom: 4px;
  color: var(--text-sub);
}
.ai-reasoning-step.done {
  border-left: 2px solid var(--pos-green);
}

.artifact-preview-doc {
  padding: 24px;
  background: var(--bg-card);
  color: var(--text-main);
  height: 100%;
  overflow-y: auto;
  font-size: 13px;
  line-height: 1.6;
}

.doc-header-block {
  border-bottom: 2px solid var(--border-card);
  padding-bottom: 14px;
  margin-bottom: 18px;
}

.citation-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--badge-source-text);
  background: var(--badge-source-bg);
  border: 1px solid var(--badge-source-border);
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
}

/* ==========================================================================
   BUTTON & COMPONENT UTILITIES
   ========================================================================== */
.btn-secondary {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-card);
  color: var(--text-main);
}
.btn-secondary:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent-teal);
  color: var(--accent-teal);
}

.btn-accent {
  background: linear-gradient(135deg, var(--accent-teal) 0%, #00BFA5 100%);
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 122, 135, 0.3);
}
.btn-accent:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.chart-multiaxis-box {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  padding: 22px 24px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-card);
}

.recommendation-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  padding: 22px 24px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-card);
  border-left: 4px solid var(--accent-teal);
}

.rec-section-block {
  margin-bottom: 14px;
}

.rec-section-title {
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-box {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 560px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: fadeIn 0.2s ease;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}
"""

with open('docs/design/prototype/assets/styles.css', 'r', encoding='utf-8') as f:
    styles_css = f.read()

# Avoid duplicate appending
if '.video-briefing-wrap' not in styles_css:
    styles_css += css_addition
    with open('docs/design/prototype/assets/styles.css', 'w', encoding='utf-8') as f:
        f.write(styles_css)
    print("Appended missing classes to styles.css successfully!")
else:
    print("styles.css already contains .video-briefing-wrap")
