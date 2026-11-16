/* Synthetic demo data for the BSR Market Intelligence design prototype.
 * 100% Vietnamese oil & gas domain terminology adhering to Final UI/UX Mockup Plan.
 */
(function () {
  'use strict';
  const DAY = 86400000;
  const end = new Date('2026-11-14T09:42:00+07:00');

  function series(base, drift, vol, seed, n) {
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
  }

  const instruments = [
    /* Dải 1: Nhóm Ưu tiên BSR & Physical (Hàng đầu, viền nhấn, Mật / Nội bộ) */
    {
      id: 'brent_physical',
      name: 'Dầu thô Brent Physical (Dated)',
      short: 'Brent Physical',
      group: 'Physical & BSR',
      subgroup: 'Dầu thô',
      ticker: 'BRD',
      value: 77.90,
      unit: 'USD/bbl',
      priceType: 'Physical',
      source: 'Platts',
      sourceId: 'SRC-PLATTS',
      marketTime: '13/11/2026 · 18:30 ICT',
      ingestionTime: '14/11/2026 · 07:05 ICT',
      dataStatus: 'EOD',
      quality: 'Hợp lệ',
      classification: 'Restricted',
      decimals: 2,
      change: 0.80,
      pct: 1.04,
      isPriority: true,
      spark: series(77.9, 0.018, 1.5, 11, 40),
      series: series(77.9, 0.018, 1.6, 11, 365),
      description: 'Giá dầu thô Brent Physical giao ngay (Dated Brent) do Platts công bố. Dữ liệu thương mại mật phục vụ định giá mua dầu thô của BSR.'
    },
    {
      id: 'ron95_physical',
      name: 'Xăng RON95 Physical (FOB Singapore)',
      short: 'Xăng RON95 Physical',
      group: 'Physical & BSR',
      subgroup: 'Sản phẩm lọc dầu',
      ticker: 'RON95-PHYS',
      value: 92.10,
      unit: 'USD/bbl',
      priceType: 'Physical',
      source: 'Platts',
      sourceId: 'SRC-PLATTS',
      marketTime: '13/11/2026 · 18:30 ICT',
      ingestionTime: '14/11/2026 · 07:05 ICT',
      dataStatus: 'EOD',
      quality: 'Hợp lệ',
      classification: 'Restricted',
      decimals: 2,
      change: -0.45,
      pct: -0.49,
      isPriority: true,
      spark: series(92.1, -0.01, 1.9, 15, 40),
      series: series(92.1, -0.01, 2.0, 15, 365),
      description: 'Giá chào chốt phiên xăng RON95 FOB Singapore từ Platts. Căn cứ tính toán Crack Spread thành phẩm xăng của Nhà máy Lọc dầu Dung Quất.'
    },
    {
      id: 'diesel_physical',
      name: 'Dầu Diesel 10ppm Physical (FOB Singapore)',
      short: 'Diesel 10ppm Physical',
      group: 'Physical & BSR',
      subgroup: 'Sản phẩm lọc dầu',
      ticker: 'DO-PHYS',
      value: 96.40,
      unit: 'USD/bbl',
      priceType: 'Physical',
      source: 'Platts',
      sourceId: 'SRC-PLATTS',
      marketTime: '13/11/2026 · 18:30 ICT',
      ingestionTime: '14/11/2026 · 07:05 ICT',
      dataStatus: 'EOD',
      quality: 'Hợp lệ',
      classification: 'Restricted',
      decimals: 2,
      change: 0.30,
      pct: 0.31,
      isPriority: true,
      spark: series(96.4, 0.01, 1.7, 19, 40),
      series: series(96.4, 0.01, 1.8, 19, 365),
      description: 'Giá dầu Diesel 10ppm FOB Singapore do Platts đánh giá. Cơ sở xác định biên lợi nhuận dòng nhiên liệu chưng cất trung bình.'
    },
    {
      id: 'crack_gasoline_physical',
      name: 'Crack Spread Xăng RON95 - Brent Physical',
      short: 'Crack RON95 - Brent Phys',
      group: 'Physical & BSR',
      subgroup: 'Crack Spread',
      ticker: 'CS-RON95-PHYS',
      value: 14.20,
      unit: 'USD/bbl',
      priceType: 'Tính toán',
      source: 'Công thức BSR (CS-PHYS-1)',
      sourceId: 'SRC-BSR-AN',
      marketTime: '13/11/2026 · 18:30 ICT',
      ingestionTime: '14/11/2026 · 07:06 ICT',
      dataStatus: 'EOD',
      quality: 'Hợp lệ',
      classification: 'Restricted',
      decimals: 2,
      change: 0.35,
      pct: 2.53,
      isPriority: true,
      spark: series(14.20, 0.025, 0.75, 41, 40),
      series: series(14.20, 0.025, 0.85, 41, 365),
      formula: {
        id: 'CS-PHYS-1',
        name: 'Crack Spread RON95 Physical vs Dated Brent',
        version: 'v2.1',
        inputs: ['Xăng RON95 Physical (FOB Singapore)', 'Dầu thô Brent Physical (Dated)'],
        rule: 'RON95 Physical (USD/bbl) − Brent Dated Physical (USD/bbl). Công thức chuẩn BSR, không pha trộn Futures.'
      },
      description: 'Chênh lệch giá giữa Xăng RON95 giao ngay và Dầu thô Brent Physical theo công thức chuẩn BSR.'
    },
    {
      id: 'crack_diesel_physical',
      name: 'Crack Spread Diesel - Brent Physical',
      short: 'Crack Diesel - Brent Phys',
      group: 'Physical & BSR',
      subgroup: 'Crack Spread',
      ticker: 'CS-DO-PHYS',
      value: 18.50,
      unit: 'USD/bbl',
      priceType: 'Tính toán',
      source: 'Công thức BSR (CS-PHYS-2)',
      sourceId: 'SRC-BSR-AN',
      marketTime: '13/11/2026 · 18:30 ICT',
      ingestionTime: '14/11/2026 · 07:06 ICT',
      dataStatus: 'EOD',
      quality: 'Hợp lệ',
      classification: 'Restricted',
      decimals: 2,
      change: -0.50,
      pct: -2.63,
      isPriority: true,
      spark: series(18.50, -0.01, 0.8, 45, 40),
      series: series(18.50, -0.01, 0.9, 45, 365),
      formula: {
        id: 'CS-PHYS-2',
        name: 'Crack Spread Diesel Physical vs Dated Brent',
        version: 'v2.0',
        inputs: ['Dầu Diesel 10ppm Physical', 'Dầu thô Brent Physical (Dated)'],
        rule: 'Diesel 10ppm Physical (USD/bbl) − Brent Dated Physical (USD/bbl).'
      },
      description: 'Chênh lệch giá giữa Diesel 10ppm giao ngay và Dầu thô Brent Physical theo công thức nội bộ BSR.'
    },
    {
      id: 'dungquat_crude_inventory',
      name: 'Tồn kho Dầu thô Nhà máy Dung Quất',
      short: 'Tồn kho Dầu thô Dung Quất',
      group: 'Physical & BSR',
      subgroup: 'Vận hành & Tồn kho',
      ticker: 'BSR-CRUDE-INV',
      value: 285000,
      unit: 'tấn',
      priceType: 'Nội bộ',
      source: 'Nội bộ BSR',
      sourceId: 'SRC-BSR-IN',
      marketTime: '14/11/2026 · 06:00 ICT',
      ingestionTime: '14/11/2026 · 06:45 ICT',
      dataStatus: 'Nhập tay',
      quality: 'Hợp lệ',
      classification: 'Confidential',
      decimals: 0,
      change: -12500,
      pct: -4.20,
      isPriority: true,
      spark: series(285000, -0.015, 8500, 29, 40).map(p => ({ ...p, value: Math.round(p.value) })),
      series: series(285000, -0.015, 9500, 29, 365).map(p => ({ ...p, value: Math.round(p.value) })),
      description: 'Mức tồn kho dầu thô thực tế tại bể chứa NMLD Dung Quất, chiếm khoảng 78% sức chứa an toàn.'
    },
    {
      id: 'dungquat_cdu_rate',
      name: 'Công suất Vận hành Phân xưởng CDU Dung Quất',
      short: 'Công suất Vận hành CDU',
      group: 'Physical & BSR',
      subgroup: 'Vận hành & Tồn kho',
      ticker: 'BSR-CDU-CAP',
      value: 105.0,
      unit: '% thiết kế',
      priceType: 'Nội bộ',
      source: 'Nội bộ BSR',
      sourceId: 'SRC-BSR-IN',
      marketTime: '14/11/2026 · 06:00 ICT',
      ingestionTime: '14/11/2026 · 06:45 ICT',
      dataStatus: 'Nhập tay',
      quality: 'Hợp lệ',
      classification: 'Confidential',
      decimals: 1,
      change: 1.5,
      pct: 1.45,
      isPriority: true,
      spark: series(105.0, 0.008, 1.2, 33, 40),
      series: series(105.0, 0.008, 1.4, 33, 365),
      description: 'Tỷ lệ tải vận hành của phân xưởng chưng cất khí quyển dầu thô (CDU) Nhà máy Lọc dầu Dung Quất.'
    },

    /* Dải 2: Nhóm Tham chiếu Thị trường (Futures & Vĩ mô) */
    {
      id: 'brent_futures',
      name: 'Dầu thô Brent Futures',
      short: 'Brent Futures',
      group: 'Tham chiếu thị trường',
      subgroup: 'Dầu thô',
      ticker: 'BRN',
      value: 78.42,
      unit: 'USD/bbl',
      priceType: 'Futures',
      source: 'ICE',
      sourceId: 'SRC-ICE',
      marketTime: '14/11/2026 · 08:30 ICT',
      ingestionTime: '14/11/2026 · 08:32 ICT',
      dataStatus: 'Real-time',
      quality: 'Hợp lệ',
      classification: 'Internal',
      decimals: 2,
      change: 1.07,
      pct: 1.38,
      isPriority: false,
      spark: series(78.42, 0.02, 1.6, 3, 40),
      series: series(78.42, 0.02, 1.8, 3, 365),
      description: 'Hợp đồng tương lai dầu thô Brent kỳ hạn tháng gần nhất giao dịch trên sàn ICE Luân Đôn.'
    },
    {
      id: 'wti_futures',
      name: 'Dầu thô WTI Futures',
      short: 'WTI Futures',
      group: 'Tham chiếu thị trường',
      subgroup: 'Dầu thô',
      ticker: 'CL',
      value: 74.18,
      unit: 'USD/bbl',
      priceType: 'Futures',
      source: 'CME',
      sourceId: 'SRC-CME',
      marketTime: '14/11/2026 · 08:28 ICT',
      ingestionTime: '14/11/2026 · 08:30 ICT',
      dataStatus: 'Real-time',
      quality: 'Hợp lệ',
      classification: 'Internal',
      decimals: 2,
      change: 0.52,
      pct: 0.71,
      isPriority: false,
      spark: series(74.18, 0.015, 1.3, 7, 40),
      series: series(74.18, 0.015, 1.4, 7, 365),
      description: 'Hợp đồng tương lai dầu ngọt nhẹ WTI kỳ hạn tháng gần nhất giao dịch trên sàn NYMEX/CME.'
    },
    {
      id: 'crack_321',
      name: 'Crack Spread 3-2-1 Phức hợp',
      short: 'Crack Spread 3-2-1',
      group: 'Tham chiếu thị trường',
      subgroup: 'Crack Spread',
      ticker: 'CS-321',
      value: 19.40,
      unit: 'USD/bbl',
      priceType: 'Tính toán',
      source: 'BSR Analytical',
      sourceId: 'SRC-BSR-AN',
      marketTime: '13/11/2026 · 18:30 ICT',
      ingestionTime: '14/11/2026 · 07:06 ICT',
      dataStatus: 'EOD',
      quality: 'Hợp lệ',
      classification: 'Internal',
      decimals: 2,
      change: 0.41,
      pct: 2.16,
      isPriority: false,
      spark: series(19.4, 0.02, 0.8, 47, 40),
      series: series(19.4, 0.02, 0.9, 47, 365),
      formula: {
        id: 'CS-321-1.3',
        name: 'Chỉ số Crack Spread tổng hợp 3-2-1',
        version: 'v1.3',
        inputs: ['RON95', 'Diesel 10ppm', 'Brent Futures'],
        rule: '(2 × Giá Xăng + 1 × Giá Diesel − 3 × Giá Brent) / 3'
      },
      description: 'Chỉ số đo lường biên lợi nhuận lọc dầu tổng hợp quy chuẩn quốc tế 3 thùng dầu thô ra 2 thùng xăng và 1 thùng diesel.'
    },
    {
      id: 'usd_vnd',
      name: 'Tỷ giá USD/VND Trung tâm',
      short: 'USD/VND',
      group: 'Tham chiếu thị trường',
      subgroup: 'Tỷ giá',
      ticker: 'USDVND',
      value: 25480,
      unit: 'VND',
      priceType: 'Chỉ số',
      source: 'NHNN Việt Nam (SBV)',
      sourceId: 'SRC-SBV',
      marketTime: '14/11/2026 · 09:00 ICT',
      ingestionTime: '14/11/2026 · 09:02 ICT',
      dataStatus: 'Delayed',
      quality: 'Hợp lệ',
      classification: 'Public',
      decimals: 0,
      change: 35,
      pct: 0.14,
      isPriority: false,
      spark: series(25480, 0.004, 90, 31, 40).map(p => ({ ...p, value: Math.round(p.value) })),
      series: series(25480, 0.004, 90, 31, 365).map(p => ({ ...p, value: Math.round(p.value) })),
      description: 'Tỷ giá trung tâm USD/VND do Ngân hàng Nhà nước Việt Nam công bố hàng ngày.'
    },
    {
      id: 'dxy',
      name: 'Chỉ số US Dollar Index (DXY)',
      short: 'Chỉ số DXY',
      group: 'Tham chiếu thị trường',
      subgroup: 'Tỷ giá',
      ticker: 'DXY',
      value: 104.12,
      unit: 'Điểm',
      priceType: 'Chỉ số',
      source: 'ICE',
      sourceId: 'SRC-ICE',
      marketTime: '14/11/2026 · 08:20 ICT',
      ingestionTime: '14/11/2026 · 08:22 ICT',
      dataStatus: 'Delayed',
      quality: 'Hợp lệ',
      classification: 'Internal',
      decimals: 2,
      change: -0.18,
      pct: -0.17,
      isPriority: false,
      spark: series(104.12, -0.002, 0.5, 35, 40),
      series: series(104.12, -0.002, 0.55, 35, 365),
      description: 'Chỉ số sức mạnh đồng Đô la Mỹ so với rổ 6 đồng tiền chủ chốt thế giới.'
    },
    {
      id: 'jet_physical',
      name: 'Nhiên liệu bay Jet A-1 Physical (FOB Singapore)',
      short: 'Jet A-1 Physical',
      group: 'Tham chiếu thị trường',
      subgroup: 'Sản phẩm lọc dầu',
      ticker: 'JET',
      value: 99.20,
      unit: 'USD/bbl',
      priceType: 'Physical',
      source: 'Platts',
      sourceId: 'SRC-PLATTS',
      marketTime: '13/11/2026 · 18:30 ICT',
      ingestionTime: '14/11/2026 · 07:05 ICT',
      dataStatus: 'EOD',
      quality: 'Hợp lệ',
      classification: 'Internal',
      decimals: 2,
      change: 0.55,
      pct: 0.56,
      isPriority: false,
      spark: series(99.2, 0.012, 1.9, 23, 40),
      series: series(99.2, 0.012, 2.0, 23, 365),
      description: 'Giá nhiên liệu hàng không Jet A-1 tại trung tâm giao dịch Singapore.'
    }
  ];

  const events = [
    {
      date: '2026-10-06',
      title: 'OPEC+ thống nhất giữ nguyên thỏa thuận cắt giảm sản lượng',
      type: 'Chính sách',
      instruments: ['brent_futures', 'wti_futures', 'brent_physical'],
      source: 'Reuters',
      impact: 'Giá Brent tăng 1.8 USD/thùng sau phiên họp'
    },
    {
      date: '2026-10-19',
      title: 'Gián đoạn vận tải biển eo biển Biển Đỏ lan rộng, cước tàu tăng',
      type: 'Logistics',
      instruments: ['brent_futures', 'diesel_physical'],
      source: 'Platts',
      impact: 'Phụ phí bảo hiểm tàu dầu VLCC tăng 18%'
    },
    {
      date: '2026-11-03',
      title: 'Nhà máy Dung Quất triển khai bảo dưỡng định kỳ phân xưởng CDU',
      type: 'Lọc dầu BSR',
      instruments: ['crack_gasoline_physical', 'dungquat_cdu_rate', 'dungquat_crude_inventory'],
      source: 'Nội bộ BSR',
      impact: 'Giảm tải tạm thời xuống 95% trước khi nâng lên 105%'
    },
    {
      date: '2026-11-11',
      title: 'Báo cáo EIA: Tồn kho dầu thô thương mại Mỹ giảm mạnh 3.2 triệu thùng',
      type: 'Tồn kho',
      instruments: ['wti_futures', 'brent_futures'],
      source: 'EIA',
      impact: 'Giá WTI bật tăng vượt mốc 74 USD/thùng'
    }
  ];

  /* 1.2 Bản tin Tổng hợp Ngày (Trang 1 Tầng 2) */
  const morningDigest = {
    title: 'Bản tin Tổng hợp Sáng từ Nguồn Nhập (Platts / Reuters Morning Digest)',
    badge: 'Nguồn: Platts/Reuters nhập sáng',
    time: '14/11/2026 · 07:30 ICT',
    author: 'Đội Market Intelligence BSR',
    executiveSummary: 'Giá dầu thô Brent Physical chốt phiên ở mức 77.90 USD/thùng (+1.04%), trong khi Brent Futures sáng nay duy trì trên 78 USD/thùng trước tín hiệu kiên định duy trì cắt giảm sản lượng tự nguyện của khối OPEC+. Điểm sáng lớn nhất đối với hiệu quả kinh doanh của BSR là Crack Spread Xăng RON95 Physical nới rộng biên độ lên 14.20 USD/thùng (+2.53%) nhờ lực cầu pha chế ổn định tại khu vực Châu Á.',
    keyPrices: [
      { label: 'Brent Physical (Dated)', value: '77.90 USD/thùng', change: '+1.04%', note: 'Platts chốt phiên 13/11' },
      { label: 'WTI Futures (NYMEX)', value: '74.18 USD/thùng', change: '+0.71%', note: 'Giao dịch sáng nay' },
      { label: 'RON95 Physical (FOB Sing)', value: '92.10 USD/thùng', change: '-0.49%', note: 'Platts EOD' },
      { label: 'Crack RON95 - Brent Physical', value: '14.20 USD/thùng', change: '+2.53%', note: 'Công thức BSR CS-PHYS-1' }
    ],
    driversAnalysis: 'Rủi ro địa chính trị tại Trung Đông và chi phí bảo hiểm hàng hải qua Biển Đỏ tiếp tục giữ mặt bằng cước tàu ở mức cao, tạo lực đỡ cho giá sản phẩm lọc dầu khu vực phía Đông kênh đào Suez. Tại Dung Quất, tồn kho dầu thô ghi nhận 285.000 tấn, đảm bảo công suất vận hành phân xưởng CDU ở mức 105%.',
    citations: [
      { id: 'C1', label: 'Platts Oilgram Report tr.2', text: 'Dated Brent cargoes firm on prompt Southeast Asian buying interest.' },
      { id: 'C2', label: 'Reuters Energy Morning tr.4', text: 'OPEC+ delegates signal rollover of 2.2mbpd voluntary cuts through December.' }
    ]
  };

  const livePulse = {
    title: 'Cập nhật Diễn biến Real-time trong ngày (AI Live Pulse)',
    badge: 'AI Tổng hợp Real-time',
    time: '14/11/2026 · 09:30 ICT',
    updates: [
      {
        time: '09:15 ICT',
        content: 'Chênh lệch Brent - WTI giãn ra 4.24 USD/thùng lúc 09:15 ICT; mở rộng cửa sổ nhập khẩu các lô dầu ngọt nhẹ West Texas về nhà máy lọc dầu khu vực Đông Nam Á.'
      },
      {
        time: '08:45 ICT',
        content: 'Hợp đồng tương lai dầu thô Brent sàn ICE kiểm tra lại vùng kháng cự kỹ thuật 78.50 USD/thùng, lực mua xuất hiện chủ yếu từ các quỹ phòng hộ hàng hóa.'
      },
      {
        time: '08:10 ICT',
        content: 'Crack Spread Diesel 10ppm tại Singapore phục hồi nhẹ 0.35 USD/thùng trong phiên sáng sau khi có tin một nhà máy lọc dầu tại Hàn Quốc giảm sản lượng do sự cố điện.'
      }
    ]
  };

  /* 1.3 Top 10 Tin tức Thị trường Mới nhất (Trang 1 Tầng 3) */
  const top10News = [
    {
      id: 'N-2415',
      time: '08:45 ICT',
      originType: 'realtime',
      originBadge: 'Cập nhật trong ngày',
      title: 'Giá dầu Brent phục hồi trên ngưỡng 78 USD/thùng do lo ngại rủi ro vận tải eo biển Hormuz',
      topics: ['Địa chính trị', 'Dầu thô', 'OPEC+'],
      source: 'Reuters',
      classification: 'Internal',
      summary: 'Giá dầu thô Brent tương lai tăng nhẹ trong phiên giao dịch sáng tại Châu Á khi các hãng vận tải ghi nhận chi phí bảo hiểm rủi ro chiến tranh tăng thêm 15% đối với các tàu qua eo biển Hormuz.',
      duplicateCount: 1,
      duplicateBadge: null
    },
    {
      id: 'N-2414',
      time: '08:15 ICT',
      originType: 'realtime',
      originBadge: 'Cập nhật trong ngày',
      title: 'Crack Spread Xăng RON95 tại Singapore nới rộng biên độ nhờ lực cầu pha chế khu vực Đông Nam Á',
      topics: ['Lọc dầu', 'Xăng RON95', 'Thị trường Á'],
      source: 'Platts',
      classification: 'Internal',
      summary: 'Biên lợi nhuận lọc dầu sản phẩm xăng RON95 tại Singapore tiếp tục vượt mốc 14 USD/thùng so với dầu thô Dated Brent, hỗ trợ đáng kể hiệu quả kinh doanh của các nhà máy lọc dầu khu vực như BSR.',
      duplicateCount: 2,
      duplicateBadge: 'Tin gộp (2 nguồn)'
    },
    {
      id: 'N-2413',
      time: '07:45 ICT',
      originType: 'morning',
      originBadge: 'Tin nhập sáng - Platts',
      title: 'Bản tin Sáng Platts: Chốt phiên giao dịch physical Singapore, phụ phí vận tải đường biển tăng nhẹ',
      topics: ['Platts', 'Lọc dầu', 'Physical'],
      source: 'Platts',
      classification: 'Restricted',
      summary: 'Đánh giá physical của Platts ghi nhận mức chốt giá Dated Brent ở 77.90 USD/thùng, RON95 FOB Singapore ở 92.10 USD/thùng và Diesel 10ppm ở 96.40 USD/thùng. Nguồn dữ liệu thương mại mật.',
      duplicateCount: 1,
      duplicateBadge: null
    },
    {
      id: 'N-2412',
      time: '07:30 ICT',
      originType: 'morning',
      originBadge: 'Tin nhập sáng - Reuters',
      title: 'OPEC+ phát tín hiệu duy trì lộ trình cắt giảm sản lượng tự nguyện đến hết quý 4/2026',
      topics: ['OPEC+', 'Cung cầu', 'Dầu thô'],
      source: 'Reuters',
      classification: 'Internal',
      summary: 'Đại biểu các nước thành viên chủ chốt cho biết liên minh không có kế hoạch xả thêm nguồn cung ra thị trường trước kỳ họp cấp bộ trưởng tháng 12, giữ nguồn cung dầu ngọt ở trạng thái thắt chặt.',
      duplicateCount: 3,
      duplicateBadge: 'Tin gộp (3 nguồn)'
    },
    {
      id: 'N-2411',
      time: '07:15 ICT',
      originType: 'morning',
      originBadge: 'Tin nhập sáng - Reuters',
      title: 'Tồn kho dầu thô thương mại Mỹ giảm mạnh hơn dự kiến 3,2 triệu thùng theo báo cáo EIA',
      topics: ['Tồn kho', 'Vĩ mô', 'Mỹ'],
      source: 'EIA / Reuters',
      classification: 'Public',
      summary: 'Dữ liệu tuần của Cơ quan Thông tin Năng lượng Mỹ (EIA) cho thấy tồn kho dầu thô tại trung tâm Cushing giảm phiên thứ ba liên tiếp, tạo đà phục hồi cho giá WTI lên 74.18 USD/thùng.',
      duplicateCount: 1,
      duplicateBadge: null
    },
    {
      id: 'N-2410',
      time: '06:50 ICT',
      originType: 'realtime',
      originBadge: 'Cập nhật trong ngày',
      title: 'Cước vận tải tàu dầu VLCC tuyến Trung Đông - Dung Quất tăng 4% trong tuần qua',
      topics: ['Vận tải', 'Logistics', 'Chi phí'],
      source: 'Argus',
      classification: 'Internal',
      summary: 'Giá cước thuê tàu chở dầu thô cỡ lớn (VLCC) từ Vịnh Ba Tư về các cảng lọc dầu Việt Nam tăng lên mức WS 62 điểm, BSR chủ động lên kế hoạch tiếp nhận an toàn các lô dầu nhập khẩu.',
      duplicateCount: 1,
      duplicateBadge: null
    },
    {
      id: 'N-2409',
      time: '06:30 ICT',
      originType: 'morning',
      originBadge: 'Tin nhập sáng - Platts',
      title: 'Biên lợi nhuận lọc dầu Diesel 10ppm tại Châu Á duy trì ổn định quanh mức 18,5 USD/thùng',
      topics: ['Lọc dầu', 'Diesel', 'Biên lợi nhuận'],
      source: 'Platts',
      classification: 'Internal',
      summary: 'Mặc dù nhu cầu công nghiệp tại Đông Á có dấu hiệu đi ngang, nguồn cung bổ sung hạn chế từ các nhà máy Trung Quốc giúp crack spread dầu diesel giữ vững mặt bằng trên 18 USD/thùng.',
      duplicateCount: 2,
      duplicateBadge: 'Tin gộp (2 nguồn)'
    },
    {
      id: 'N-2408',
      time: '06:00 ICT',
      originType: 'morning',
      originBadge: 'Tin nhập sáng - BSR Nội bộ',
      title: 'Nhà máy Lọc dầu Dung Quất hoàn thành kế hoạch bảo dưỡng phân xưởng CDU, chạy tải 105%',
      topics: ['Vận hành BSR', 'Dung Quất', 'Lọc dầu'],
      source: 'BSR Nội bộ',
      classification: 'Confidential',
      summary: 'Ban Quản trị Vận hành BSR xác nhận phân xưởng chưng cất dầu thô CDU đã vận hành an toàn trở lại ở mức 105% công suất thiết kế, lượng tồn kho dầu thô đệm đạt 285.000 tấn sẵn sàng cho kế hoạch quý 4.',
      duplicateCount: 1,
      duplicateBadge: null
    },
    {
      id: 'N-2407',
      time: '05:30 ICT',
      originType: 'morning',
      originBadge: 'Tin nhập sáng - Argus',
      title: 'Thị trường nhập khẩu dầu thô Châu Á: Các nhà máy lọc dầu tăng mua dầu ngọt Tây Phi',
      topics: ['Dầu thô', 'Châu Á', 'Thương mại'],
      source: 'Argus',
      classification: 'Internal',
      summary: 'Biên độ chênh lệch cước biển thu hẹp thúc đẩy các nhà máy lọc dầu khu vực tăng cường mua các lô dầu thô ngọt nhẹ có hàm lượng lưu huỳnh thấp từ Nigeria và Angola thay thế một phần dầu chua.',
      duplicateCount: 1,
      duplicateBadge: null
    },
    {
      id: 'N-2406',
      time: '05:00 ICT',
      originType: 'morning',
      originBadge: 'Tin nhập sáng - Bloomberg',
      title: 'Đồng USD điều chỉnh nhẹ sau phát biểu của Chủ tịch Fed, hỗ trợ tâm lý giá hàng hóa năng lượng',
      topics: ['Vĩ mô', 'Tỷ giá', 'Lãi suất'],
      source: 'Bloomberg',
      classification: 'Internal',
      summary: 'Chỉ số DXY lùi về 104.12 điểm sau khi thị trường hạ kỳ vọng tăng lãi suất, tỷ giá USD/VND trung tâm do NHNN công bố đạt 25.480 VND, giữ áp lực chi phí nhập khẩu nguyên liệu ở ngưỡng kiểm soát.',
      duplicateCount: 1,
      duplicateBadge: null
    }
  ];

  /* 4. Đánh giá Dự báo & Khuyến nghị Chuyên sâu (Trang 4) */
  const forecastAccuracy = {
    kpis: {
      overallAccuracy: 86.4,
      mape: 3.8,
      mae: 2.15,
      bestSource: 'Platts Analytics (91.2%)'
    },
    comparisonSeries: [
      {
        label: 'Giá Thực tế (Actual)',
        color: '#1B365D',
        data: series(77.90, 0.015, 1.4, 2, 30)
      },
      {
        label: 'Baseline Platts Analytics',
        color: '#007A87',
        data: series(78.50, 0.012, 1.1, 5, 30)
      },
      {
        label: 'Baseline BSR Internal Model',
        color: '#D97706',
        data: series(76.80, 0.018, 1.2, 9, 30)
      },
      {
        label: 'Baseline EIA STEO',
        color: '#7C3AED',
        data: series(79.60, 0.009, 0.9, 14, 30)
      }
    ],
    breakdownTable: [
      {
        id: 'FC-101',
        source: 'Platts Analytics',
        published: '12/10/2026',
        period: 'Tháng 11/2026',
        instrument: 'Brent Physical (Dated)',
        forecastVal: 78.50,
        actualVal: 77.90,
        diff: 0.60,
        mape: 0.77,
        accuracy: 99.23,
        docRef: 'Báo cáo Platts Global Crude Outlook Q4.pdf'
      },
      {
        id: 'FC-102',
        source: 'BSR Baseline Nội bộ',
        published: '15/10/2026',
        period: 'Tháng 11/2026',
        instrument: 'Crack Spread RON95 Physical',
        forecastVal: 13.80,
        actualVal: 14.20,
        diff: -0.40,
        mape: 2.90,
        accuracy: 97.10,
        docRef: 'Kế hoạch Điều hành Sản xuất BSR T11.xlsx'
      },
      {
        id: 'FC-103',
        source: 'EIA (STEO)',
        published: '08/10/2026',
        period: 'Q4/2026',
        instrument: 'Brent Crude Futures',
        forecastVal: 81.20,
        actualVal: 78.42,
        diff: 2.78,
        mape: 3.54,
        accuracy: 96.46,
        docRef: 'Short-Term Energy Outlook EIA Oct.pdf'
      },
      {
        id: 'FC-104',
        source: 'McKinsey Energy Insights',
        published: '01/10/2026',
        period: 'Tháng 11/2026',
        instrument: 'Diesel 10ppm Physical',
        forecastVal: 92.50,
        actualVal: 96.40,
        diff: -3.90,
        mape: 4.05,
        accuracy: 95.95,
        docRef: 'McKinsey Global Refining Margin Outlook.pdf'
      },
      {
        id: 'FC-105',
        source: 'Argus Media',
        published: '20/10/2026',
        period: 'Tháng 11/2026',
        instrument: 'Brent Physical (Dated)',
        forecastVal: 75.00,
        actualVal: 77.90,
        diff: -2.90,
        mape: 3.72,
        accuracy: 96.28,
        docRef: 'Argus Crude Report Week 42.pdf'
      }
    ]
  };

  /* 4.4 Khuyến nghị Hành động Chuyên sâu từ AI */
  const aiRecommendations = [
    {
      id: 'REC-01',
      category: 'Mua dầu thô',
      title: 'Tối ưu hóa thời điểm chốt giá mua dầu thô WTI/Brent nhập khẩu kỳ giao tháng 12/2026',
      confidence: 'Cao (88%)',
      created: '14/11/2026 · 08:00 ICT',
      version: 'v1.2',
      context: 'Giá dầu thô Brent Physical đang tích lũy quanh ngưỡng 77.90 USD/thùng, trong khi OPEC+ duy trì chính sách sản lượng thắt chặt. Chênh lệch Brent - WTI duy trì ở mức 4.24 USD/thùng.',
      rationale: 'Lập luận định lượng: Biên độ Brent - WTI ở mức $4.24/bbl tạo lợi thế lớn cho phương án mua dầu thô ngọt nhẹ WTI Texas giao tàu về Việt Nam với chi phí logistics khoảng $3.80/bbl, tiết kiệm ròng khoảng $0.44/bbl so với mua Dated Brent cùng kỳ hạn.',
      assumptions: 'Giả định: Không có biến động đột biến về giá cước tàu VLCC trên tuyến Châu Mỹ - Châu Á và tỷ giá USD/VND biến động trong biên độ ±0.3%.',
      citations: ['Platts Dated Brent 13/11', 'EIA Short-Term Outlook', 'Mô hình Mua Dầu thô BSR v2'],
      badgeClass: 'badge-accent'
    },
    {
      id: 'REC-02',
      category: 'Kinh doanh sản phẩm',
      title: 'Tăng tải tối đa phân xưởng RFCC khi Crack Spread Xăng RON95 Physical duy trì trên $14/bbl',
      confidence: 'Cao (92%)',
      created: '14/11/2026 · 08:15 ICT',
      version: 'v2.0',
      context: 'Crack Spread Xăng RON95 Physical tại Singapore đạt 14.20 USD/thùng (tăng 2.53% so với phiên trước), là mức cao nhất trong 4 tuần qua nhờ lực cầu tiêu thụ phục hồi tại các thị trường khu vực.',
      rationale: 'Lập luận định lượng: Với công thức BSR CS-PHYS-1, mỗi mức tăng 1.0 USD/thùng của Crack RON95 đem lại thêm khoảng 8.5 tỷ VND doanh thu biên lợi nhuận/ngày khi phân xưởng RFCC chạy tải 105%.',
      assumptions: 'Giả định: Phân xưởng xúc tác RFCC vận hành ổn định không phát sinh dừng máy ngoài kế hoạch, nguồn nguyên liệu cấp liên tục.',
      citations: ['Platts Singapore Mogas', 'Công thức BSR CS-PHYS-1', 'Báo cáo Vận hành Dung Quất'],
      badgeClass: 'badge-primary'
    },
    {
      id: 'REC-03',
      category: 'Vận hành & Tồn kho',
      title: 'Cảnh báo rủi ro biến động cước tàu tuyến Vùng Vịnh - Dung Quất: Đề xuất nâng tồn kho an toàn lên 85%',
      confidence: 'Trung bình (76%)',
      created: '14/11/2026 · 08:30 ICT',
      version: 'v1.0',
      context: 'Tình hình an ninh hàng hải tại khu vực Biển Đỏ kéo dài làm tăng phí bảo hiểm rủi ro thêm 15-20%, các hãng tàu có xu hướng kéo dài lịch trình thêm 5-7 ngày.',
      rationale: 'Lập luận định lượng: Tồn kho hiện tại của Dung Quất là 285.000 tấn (78% sức chứa bể chứa). Việc tăng dự trữ thêm 25.000 tấn lên mức 85% sẽ bảo đảm an toàn sản xuất liên tục 18 ngày trong kịch bản tàu nhập khẩu chậm chuyến.',
      assumptions: 'Giả định: Sức chứa bể chứa dầu thô còn đủ dung tích tiếp nhận an toàn không gây nghẽn dòng sản phẩm.',
      citations: ['Nhật ký Bể chứa BSR 14/11', 'Argus Tanker Freight Daily', 'Báo cáo Rủi ro Chuỗi cung ứng BSR'],
      badgeClass: 'badge-warning'
    }
  ];

  /* 3. Báo cáo & Bản tin Video (Trang 3) */
  const videoBriefing = {
    id: 'VID-2026-46',
    title: 'Bản tin Thị trường Năng lượng & Vận hành BSR - Tuần 46/2026',
    published: '14/11/2026 · 08:30 ICT',
    duration: '08:45',
    presenter: 'Đỗ Hoàng Nam (Chuyên gia Phân tích MI BSR)',
    chapters: [
      { time: '00:00', title: 'Điểm tin Giá Dầu thô Thế giới & Động thái OPEC+', desc: 'Tổng kết diễn biến giá Brent, WTI và chính sách sản lượng quý 4.' },
      { time: '02:30', title: 'Phân tích Crack Spread Xăng RON95 & Dầu Diesel Physical', desc: 'Đánh giá biên lợi nhuận physical Singapore theo công thức BSR.' },
      { time: '05:15', title: 'Tình hình Tiếp nhận Dầu thô & Tồn kho Nhà máy Dung Quất', desc: 'Báo cáo công suất CDU 105% và mức tồn kho an toàn 285k tấn.' },
      { time: '07:10', title: 'Dự báo Tuần tới & Khuyến nghị Điều hành BSR', desc: 'Định hướng chốt hợp đồng dầu thô và tối ưu hóa cơ cấu sản phẩm.' }
    ]
  };

  const reports = [
    {
      id: 'R-2026-042',
      type: 'Báo cáo Đột xuất',
      cycle: 'adhoc',
      title: 'Báo cáo Đột xuất: Đánh giá Tác động Biến động Giá Physical & Crack Spread đến Hiệu quả Kinh doanh BSR',
      cutOff: '14/11/2026 · 09:15 ICT',
      created: '14/11/2026 · 09:30 ICT',
      author: 'Lê Minh Anh (Văn phòng Điều hành)',
      version: 'v1.2',
      classification: 'Restricted',
      status: 'Đã phát hành',
      sources: ['Platts EOD 13/11', 'ICE Brent Futures', 'Công thức BSR CS-PHYS-1', 'BSR Tank Inventory'],
      summary: 'Phân tích nhanh cho Hội đồng Quản trị về tác động của giá Dated Brent ở $77.90 và Crack RON95 đạt $14.20/bbl đối với dòng tiền quý 4.'
    },
    {
      id: 'R-2026-041',
      type: 'Báo cáo Ngày',
      cycle: 'daily',
      title: 'Bản tin Thị trường Dầu khí Hàng ngày — Phiên 14/11/2026',
      cutOff: '14/11/2026 · 07:00 ICT',
      created: '14/11/2026 · 07:45 ICT',
      author: 'Nguyễn Thu Hà (Đội MI)',
      version: 'v1.0',
      classification: 'Internal',
      status: 'Đã phát hành',
      sources: ['Platts', 'Reuters', 'ICE', 'CME'],
      summary: 'Tổng hợp chốt phiên thị trường quốc tế, diễn biến futures và các tin tức trọng điểm sáng.'
    },
    {
      id: 'R-2026-040',
      type: 'Báo cáo Tuần',
      cycle: 'weekly',
      title: 'Báo cáo Phân tích Thị trường Năng lượng Tuần 45/2026',
      cutOff: '11/11/2026 · 17:00 ICT',
      created: '12/11/2026 · 10:00 ICT',
      author: 'Nguyễn Thu Hà (Đội MI)',
      version: 'v1.1',
      classification: 'Internal',
      status: 'Lưu trữ',
      sources: ['Platts Analytics', 'EIA', 'Argus'],
      summary: 'Đánh giá cung cầu toàn cầu, xu hướng dự trữ dầu thô và dự báo biên lợi nhuận lọc dầu tuần 46.'
    },
    {
      id: 'R-2026-039',
      type: 'Báo cáo Tháng',
      cycle: 'monthly',
      title: 'Báo cáo Chiến lược Thị trường & Cung cấp Dầu thô Tháng 10/2026',
      cutOff: '31/10/2026 · 18:00 ICT',
      created: '02/11/2026 · 14:30 ICT',
      author: 'Ban Kinh doanh & MI',
      version: 'v2.0',
      classification: 'Confidential',
      status: 'Lưu trữ',
      sources: ['Platts', 'BSR Accounting', 'SBV'],
      summary: 'Đánh giá toàn diện kết quả nhập khẩu dầu thô, thực hiện chi phí và phân tích sai số dự báo tháng 10.'
    }
  ];

  /* 6. Đánh giá Chất lượng & Độ chính xác Nguồn tin (Trang 6) */
  const sourceScorecard = {
    kpis: {
      bestRoi: 'Platts (Điểm: 9.4/10)',
      bestUnique: 'Reuters (42.5%)',
      fastest: 'Bloomberg (Sớm hơn 18 phút)',
      costSaving: '~35.000 USD/năm'
    },
    sourcesTable: [
      {
        name: 'Platts (S&P Global)',
        category: 'Thương mại chuyên ngành',
        accuracy: 94.2,
        uniqueRate: 38.0,
        speedVsAvg: '+12 phút',
        dupRate: 8.5,
        costPerYear: '$48.000',
        roiRating: 'Tối ưu (Cốt lõi)',
        status: 'Hoạt động',
        connectionType: 'API + File EOD'
      },
      {
        name: 'Reuters Energy',
        category: 'Tin tức & Dữ liệu',
        accuracy: 91.5,
        uniqueRate: 42.5,
        speedVsAvg: '+15 phút',
        dupRate: 14.2,
        costPerYear: '$36.000',
        roiRating: 'Rất tốt',
        status: 'Hoạt động',
        connectionType: 'API Real-time'
      },
      {
        name: 'Bloomberg Terminal',
        category: 'Tin tức tài chính vĩ mô',
        accuracy: 89.8,
        uniqueRate: 29.0,
        speedVsAvg: '+18 phút (Nhanh nhất)',
        dupRate: 26.4,
        costPerYear: '$52.000',
        roiRating: 'Cần tối ưu chi phí',
        status: 'Hoạt động',
        connectionType: 'API Terminal'
      },
      {
        name: 'Argus Media',
        category: 'Thương mại & Cước vận tải',
        accuracy: 88.6,
        uniqueRate: 34.2,
        speedVsAvg: '+5 phút',
        dupRate: 18.0,
        costPerYear: '$22.000',
        roiRating: 'Hiệu quả cao',
        status: 'Hoạt động',
        connectionType: 'Upload báo cáo'
      },
      {
        name: 'EIA / IEA Public Reports',
        category: 'Thống kê công khai',
        accuracy: 86.4,
        uniqueRate: 22.0,
        speedVsAvg: '-25 phút (Chậm hơn)',
        dupRate: 32.0,
        costPerYear: 'Miễn phí ($0)',
        roiRating: 'Tham chiếu nền',
        status: 'Hoạt động',
        connectionType: 'Tự động cào dữ liệu'
      }
    ],
    trendChart: [
      {
        label: 'Platts (Độ chính xác %)',
        color: '#007A87',
        data: [
          { date: new Date('2026-06-01'), value: 92.0 },
          { date: new Date('2026-07-01'), value: 92.5 },
          { date: new Date('2026-08-01'), value: 93.1 },
          { date: new Date('2026-09-01'), value: 93.8 },
          { date: new Date('2026-10-01'), value: 94.0 },
          { date: new Date('2026-11-01'), value: 94.2 }
        ]
      },
      {
        label: 'Reuters (Độ chính xác %)',
        color: '#1B365D',
        data: [
          { date: new Date('2026-06-01'), value: 89.5 },
          { date: new Date('2026-07-01'), value: 90.2 },
          { date: new Date('2026-08-01'), value: 90.8 },
          { date: new Date('2026-09-01'), value: 91.0 },
          { date: new Date('2026-10-01'), value: 91.2 },
          { date: new Date('2026-11-01'), value: 91.5 }
        ]
      },
      {
        label: 'Argus (Độ chính xác %)',
        color: '#D97706',
        data: [
          { date: new Date('2026-06-01'), value: 86.0 },
          { date: new Date('2026-07-01'), value: 87.1 },
          { date: new Date('2026-08-01'), value: 87.5 },
          { date: new Date('2026-09-01'), value: 88.0 },
          { date: new Date('2026-10-01'), value: 88.2 },
          { date: new Date('2026-11-01'), value: 88.6 }
        ]
      }
    ],
    userVerificationLog: [
      {
        id: 'VER-001',
        time: '13/11/2026 · 17:00 ICT',
        actor: 'Nguyễn Thu Hà (Đội MI)',
        source: 'Platts Dated Brent EOD',
        claimedValue: 'Brent Physical 77.90 USD/thùng',
        actualEvent: 'Phiên chốt chính thức khớp đúng số liệu',
        verificationResult: 'Đúng thực tế',
        accuracyImpact: '+0.2 điểm'
      },
      {
        id: 'VER-002',
        time: '12/11/2026 · 16:30 ICT',
        actor: 'Nguyễn Thu Hà (Đội MI)',
        source: 'Reuters Flash News',
        claimedValue: 'OPEC+ tăng sản lượng 180.000 thùng/ngày',
        actualEvent: 'OPEC+ ra thông cáo bác bỏ tin đồn, giữ nguyên sản lượng',
        verificationResult: 'Sai lệch',
        accuracyImpact: '-0.5 điểm'
      },
      {
        id: 'VER-003',
        time: '10/11/2026 · 14:15 ICT',
        actor: 'Trần Quốc Bảo (Nội bộ)',
        source: 'Argus Freight Weekly',
        claimedValue: 'Cước tàu VLCC vùng Vịnh tăng lên WS 65',
        actualEvent: 'Thực tế chốt hợp đồng BSR ở mức WS 62',
        verificationResult: 'Đã đính chính',
        accuracyImpact: '0.0 điểm'
      }
    ]
  };

  /* 7. Quản trị Hệ thống (Trang 7) */
  const adminData = {
    sourcesConfig: [
      { id: 'SRC-PLATTS', name: 'Platts S&P Global Commodity Insights', type: 'API + File EOD', freq: 'Hàng ngày (18:30 ICT)', cost: '$48.000/năm', status: 'Hoạt động', lastSync: '14/11/2026 · 07:05 ICT', errorCount: 0 },
      { id: 'SRC-REUTERS', name: 'Reuters Energy News & Data Feed', type: 'API Real-time', freq: 'Liên tục (Mỗi 5 phút)', cost: '$36.000/năm', status: 'Hoạt động', lastSync: '14/11/2026 · 09:35 ICT', errorCount: 0 },
      { id: 'SRC-BLOOMBERG', name: 'Bloomberg Terminal B-PIPE', type: 'API Terminal', freq: 'Liên tục', cost: '$52.000/năm', status: 'Cảnh báo chậm', lastSync: '14/11/2026 · 09:20 ICT', errorCount: 2 },
      { id: 'SRC-ARGUS', name: 'Argus Media Direct Feed', type: 'Upload báo cáo', freq: 'Hàng tuần', cost: '$22.000/năm', status: 'Hoạt động', lastSync: '13/11/2026 · 15:00 ICT', errorCount: 0 },
      { id: 'SRC-SBV', name: 'Ngân hàng Nhà nước Việt Nam (SBV)', type: 'API Công khai', freq: 'Hàng ngày (09:00 ICT)', cost: 'Miễn phí ($0)', status: 'Hoạt động', lastSync: '14/11/2026 · 09:02 ICT', errorCount: 0 },
      { id: 'SRC-BSR-ERP', name: 'Hệ thống ERP & Quản lý Kho BSR', type: 'Kết nối Nội bộ (ODBC)', freq: 'Mỗi 30 phút', cost: 'Hạ tầng BSR', status: 'Hoạt động', lastSync: '14/11/2026 · 09:30 ICT', errorCount: 0 }
    ],
    formulas: [
      { id: 'CS-PHYS-1', name: 'Crack Spread Xăng RON95 - Brent Physical', version: 'v2.1', inputs: ['RON95 Physical FOB Sing', 'Brent Dated Physical'], formula: 'RON95 Physical − Brent Dated Physical', unit: 'USD/bbl', status: 'Đang áp dụng' },
      { id: 'CS-PHYS-2', name: 'Crack Spread Diesel 10ppm - Brent Physical', version: 'v2.0', inputs: ['Diesel 10ppm Physical', 'Brent Dated Physical'], formula: 'Diesel 10ppm Physical − Brent Dated Physical', unit: 'USD/bbl', status: 'Đang áp dụng' },
      { id: 'CS-321-BSR', name: 'Crack Spread 3-2-1 Phức hợp Dung Quất', version: 'v1.4', inputs: ['RON95 FOB Sing', 'Diesel 10ppm FOB Sing', 'Brent Futures'], formula: '(2 × RON95 + 1 × Diesel − 3 × Brent) / 3', unit: 'USD/bbl', status: 'Đang áp dụng' },
      { id: 'CS-STRICT-1.0', name: 'Strict Product Crack (Không pha trộn Futures/Physical)', version: 'v1.0', inputs: ['RON95 Physical', 'Brent Physical'], formula: 'RON95 − Brent (Cùng hệ quy chiếu)', unit: 'USD/bbl', status: 'Lưu trữ' }
    ],
    usersTotal: 1550,
    rolesSummary: [
      { role: 'Lãnh đạo', count: 24, maxClass: 'Mật (Restricted)', canPhysical: true, canExport: true, canAdmin: false, desc: 'Hội đồng Quản trị, Ban Tổng Giám đốc, Trưởng Ban chuyên môn' },
      { role: 'Đội Market Intelligence', count: 18, maxClass: 'Mật (Restricted)', canPhysical: true, canExport: true, canAdmin: true, desc: 'Chuyên viên phân tích thị trường, nhập liệu, vận hành hệ thống' },
      { role: 'Nhân viên nội bộ', count: 1508, maxClass: 'Nội bộ (Internal)', canPhysical: false, canExport: false, canAdmin: false, desc: 'Cán bộ công nhân viên các phòng ban nghiệp vụ BSR (Ẩn giá Physical Mật)' }
    ],
    auditLogs: [
      { time: '14/11/2026 · 09:42 ICT', actor: 'Lê Minh Anh', role: 'Lãnh đạo', action: 'Truy vấn AI Trợ lý', object: 'Yêu cầu phân tích Crack Spread RON95 Physical', result: 'Thành công', classification: 'Restricted' },
      { time: '14/11/2026 · 09:20 ICT', actor: 'Lê Minh Anh', role: 'Lãnh đạo', action: 'Tạo báo cáo đột xuất', object: 'BC-2026-042 v1.2', result: 'Thành công', classification: 'Restricted' },
      { time: '14/11/2026 · 09:05 ICT', actor: 'Nguyễn Thu Hà', role: 'Đội MI', action: 'Xem giá Physical Mật', object: 'Brent Physical Dated & RON95 Physical', result: 'Được phép', classification: 'Restricted' },
      { time: '14/11/2026 · 08:58 ICT', actor: 'Nguyễn Thu Hà', role: 'Đội MI', action: 'Nhập bản tin sáng', object: 'Bản tin Platts/Reuters sáng 14/11', result: 'Thành công', classification: 'Internal' },
      { time: '14/11/2026 · 08:31 ICT', actor: 'Trần Quốc Bảo', role: 'Nhân viên nội bộ', action: 'Yêu cầu xem giá Physical Mật', object: 'brent_physical', result: 'Từ chối (Thiếu quyền)', classification: 'Restricted' },
      { time: '14/11/2026 · 08:02 ICT', actor: 'Hệ thống AI Auker', role: 'Hệ thống', action: 'Xử lý tin tức tự động', object: 'Tin tức N-2411 (EIA Inventory)', result: 'Thành công', classification: 'Public' }
    ],
    aiObservability: {
      avgLatency: '1.8s',
      avgCost: '$0.014',
      toolCallsRate: '94.2%',
      fallbackRate: '1.2%',
      tasksBreakdown: [
        { task: 'Trợ lý AI Chat chuyên sâu', count: 342, avgLatency: '2.1s', avgCost: '$0.018', errorRate: '0.8%' },
        { task: 'Tóm tắt tin tức thị trường', count: 1250, avgLatency: '1.1s', avgCost: '$0.006', errorRate: '0.2%' },
        { task: 'Tạo báo cáo đột xuất', count: 68, avgLatency: '3.4s', avgCost: '$0.038', errorRate: '1.5%' },
        { task: 'Sinh khuyến nghị thị trường', count: 45, avgLatency: '2.8s', avgCost: '$0.024', errorRate: '0.5%' }
      ]
    }
  };

  /* AI Assistant Demo Threads */
  const aiConversations = [
    {
      id: 'TH-01',
      title: 'Tạo báo cáo nhanh biến động Physical & Crack hôm nay',
      updated: '14/11/2026 · 09:42 ICT',
      status: 'Hoàn tất',
      classification: 'Restricted',
      messages: [
        {
          role: 'user',
          text: 'Tạo báo cáo nhanh biến động Physical & Crack hôm nay cho Ban Lãnh đạo.',
          time: '09:40 ICT'
        },
        {
          role: 'assistant',
          steps: [
            { text: 'Kiểm tra quyền RBAC: Xác thực vai trò Lãnh đạo -> Cho phép nạp dữ liệu Physical Mật.', state: 'done' },
            { text: 'Đọc nguồn dữ liệu: Nạp số liệu Platts Dated Brent ($77.90) và BSR Crude Inventory (285k tấn).', state: 'done' },
            { text: 'Gọi dịch vụ tính toán: Chạy công thức BSR CS-PHYS-1 -> Crack Spread Xăng RON95 = $14.20/bbl.', state: 'done' },
            { text: 'Tổng hợp kết quả & Dự thảo báo cáo đột xuất gửi Board of Directors.', state: 'done' }
          ],
          text: 'Báo cáo nhanh biến động thị trường ngày 14/11/2026 đã sẵn sàng:\n\n• **Dầu thô Brent Physical (Dated):** Đạt 77.90 USD/thùng (+1.04%), phục hồi nhờ tín hiệu OPEC+ giữ nguyên chính sách nguồn cung.\n• **Crack Spread Xăng RON95 - Brent Physical:** Nới rộng lên 14.20 USD/thùng (+2.53%), là biên lợi nhuận cao nhất trong 4 tuần qua.\n• **Tồn kho Nhà máy Dung Quất:** Ghi nhận 285.000 tấn dầu thô (78% sức chứa), CDU vận hành an toàn ở mức 105% công suất thiết kế.\n\nBản dự thảo báo cáo chuẩn BSR đã được tạo sẵn ở khung bên phải (Cột 3) để Quý Lãnh đạo xem trước hoặc xuất file PDF.',
          time: '09:42 ICT',
          artifactRef: 'BC-2026-042'
        }
      ]
    },
    {
      id: 'TH-02',
      title: 'Đánh giá tác động giá Brent tăng lên biên lợi nhuận lọc dầu BSR',
      updated: '13/11/2026 · 15:30 ICT',
      status: 'Lưu trữ',
      classification: 'Internal',
      messages: [
        {
          role: 'user',
          text: 'Đánh giá tác động giá Brent tăng lên biên lợi nhuận lọc dầu của BSR trong ngắn hạn.',
          time: '15:28 ICT'
        },
        {
          role: 'assistant',
          steps: [
            { text: 'Kiểm tra quyền RBAC: Xác thực quyền Internal/Restricted.', state: 'done' },
            { text: 'Phân tích hệ số co giãn giữa giá dầu thô đầu vào và giá thành phẩm Singapore.', state: 'done' },
            { text: 'Tổng hợp khuyến nghị điều hành.', state: 'done' }
          ],
          text: 'Khi giá Brent tăng do yếu tố địa chính trị, biên lợi nhuận lọc dầu của BSR phụ thuộc vào độ trễ chuyển giá thành phẩm:\n\n1. Nếu giá thành phẩm (RON95, DO) tăng tương ứng, crack spread giữ vững quanh $14 - $18/bbl, lợi nhuận lọc dầu tăng nhờ định giá hàng tồn kho.\n2. Khuyến nghị theo dõi chặt chẽ chênh lệch Brent-WTI ($4.24/bbl) để tối ưu hóa nguồn dầu ngọt nhẹ nhập khẩu.',
          time: '15:30 ICT'
        }
      ]
    }
  ];

  window.DEMO = {
    meta: {
      asOf: '14/11/2026 · 09:42 ICT',
      freshness: 'Độ mới: Real-time & EOD',
      disclaimer: 'Dữ liệu mô phỏng chính thức cho giao diện BSR Market Intelligence Platform.'
    },
    uploadLimits: {
      maxBytes: 15 * 1024 * 1024,
      extensions: ['.csv', '.xlsx', '.pdf', '.doc', '.docx'],
      label: 'Excel (.xlsx, .csv), PDF, Word (.doc, .docx)'
    },
    roles: {
      leadership: {
        id: 'leadership',
        roleKey: 'leadership',
        label: 'Lãnh đạo [Full Physical]',
        name: 'Lê Minh Anh',
        initials: 'MA',
        maxClassification: 'Restricted',
        viewRestricted: true,
        export: true,
        admin: false,
        department: 'Văn phòng Điều hành BSR',
        badge: 'Toàn quyền Physical Mật'
      },
      mi: {
        id: 'mi',
        roleKey: 'mi',
        label: 'Đội MI [Nhập liệu & Admin]',
        name: 'Nguyễn Thu Hà',
        initials: 'TH',
        maxClassification: 'Restricted',
        viewRestricted: true,
        export: true,
        admin: true,
        department: 'Ban Phân tích Thị trường & Chiến lược',
        badge: 'Toàn quyền Nhập liệu & Quản trị'
      },
      internal: {
        id: 'internal',
        roleKey: 'internal',
        label: 'Nhân viên nội bộ [Ẩn Physical]',
        name: 'Trần Quốc Bảo',
        initials: 'QB',
        maxClassification: 'Internal',
        viewRestricted: false,
        export: false,
        admin: false,
        department: 'Phòng Kinh doanh & Thương mại',
        badge: 'Chỉ xem dữ liệu Futures (Ẩn Mật)'
      }
    },
    instruments,
    events,
    morningDigest,
    livePulse,
    top10News,
    forecastAccuracy,
    aiRecommendations,
    videoBriefing,
    reports,
    sourceScorecard,
    adminData,
    aiConversations
  };
})();
