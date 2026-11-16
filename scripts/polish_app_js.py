import re

with open('docs/design/prototype/assets/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. Update renderSparklineSvg to be ultra-clean and modern
old_spark_func_start = "  /* Mini Sparkline with Smooth Gradient & Beacon Dot (High-Tech & Sleek) */"
old_spark_func_end = "  /* Single Series In-Place Chart (TradingView / Apple Stocks Grade) */"

start_idx = app_js.find(old_spark_func_start)
end_idx = app_js.find(old_spark_func_end)

if start_idx != -1 and end_idx != -1:
    new_spark_func = '''  /* Mini Sparkline with Smooth Gradient & Sleek Beacon Dot (Apple Stocks / Stripe Grade) */
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
'''
    app_js = app_js[:start_idx] + new_spark_func + app_js[end_idx:]

# 2. Modernize AI Workspace Chat Input in renderAssistantWorkspace()
old_chat_input_pattern = r'<div style="display:flex;gap:10px">\s*<textarea class="form-control-textarea" id="chat-input-textarea"[^>]*>.*?</textarea>\s*<button class="btn btn-accent"[^>]*>.*?</button>\s*</div>'

new_chat_input_markup = """<div class="ai-chat-input-box" style="border:1.5px solid var(--border-strong);border-radius:12px;background:var(--bg-card);padding:14px;box-shadow:var(--shadow-card)">
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
            </div>"""

app_js = re.sub(old_chat_input_pattern, new_chat_input_markup, app_js, flags=re.DOTALL)

# 3. Add Enter keydown event listener for chat-input-textarea
old_keydown_marker = "  document.addEventListener('click', (e) => {"
new_keydown_handler = """  document.addEventListener('keydown', (e) => {
    if (e.target && e.target.id === 'chat-input-textarea') {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const sendBtn = document.querySelector('[data-action="submit-chat-message"]');
        if (sendBtn) sendBtn.click();
      }
    }
  });

  document.addEventListener('click', (e) => {"""

if 'chat-input-textarea' not in app_js[:app_js.find(old_keydown_marker)]:
    app_js = app_js.replace(old_keydown_marker, new_keydown_handler, 1)

with open('docs/design/prototype/assets/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print("Polished app.js successfully!")
