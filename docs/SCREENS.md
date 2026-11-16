# Screen Map — BSR Market Intelligence Platform (Official Architecture)

Canonical prototype entry: `docs/design/prototype/index.html` (hash routes) and live app `app/static/index.html`.

## 7 Trang Chức năng Chính thức & Không gian Trợ lý AI

| STT | Trang / Route | Mục đích & Trọng tâm | Thành phần chính | Kiểm soát quyền (RBAC) & Trạng thái |
|---|---|---|---|---|
| 1 | **Tổng quan thị trường** `#overview` | Tầng 1: Snapshot ưu tiên BSR & Physical; Tầng 2: Bản tin sáng Platts/Reuters & Copilot nhúng; Tầng 3: Top 10 tin tức timeline | Dải 1 (Ưu tiên BSR & Physical), Dải 2 (Tham chiếu Futures/FX), Morning Digest, AI Live Pulse, Copilot Card nhúng, Top 10 tin gộp | Strict RBAC: Ẩn/khóa giá Physical Mật đối với vai trò Nội bộ; Drawer nhập nhanh 440px không mất view |
| 2 | **Dữ liệu thị trường** `#market-data` | Phân tích chuỗi thời gian đa trục, ghim sự kiện, bảng đối soát dữ liệu và popover công thức Crack Spread | Sparkline grid nhóm Physical & BSR hàng đầu, Biểu đồ đa trục tung USD/bbl & Tỷ giá/Tồn kho, Bảng lịch sử dữ liệu | Tick chọn đa chỉ số, Inline entry / Drawer cho đội MI, Popover công thức chuẩn CS-PHYS-1/2 |
| 3 | **Báo cáo & Bản tin Video** `#reports` | Bản tin video điều hành lãnh đạo phát sóng định kỳ và thư viện báo cáo bất biến | Video Player 16:9 mockup kèm Chapters / Key Takeaways tua nhanh, Thư viện báo cáo theo tab chu kỳ | Tải file PDF có kiểm tra quyền, xem trước báo cáo có trích dẫn nguồn, upload video mới |
| 4 | **Đánh giá Dự báo & Khuyến nghị** `#forecast` | Đo lường độ chính xác baseline từ các nguồn thương mại và đưa ra khuyến nghị hành động chuyên sâu từ AI | 4 KPI đo lường (Độ chính xác, MAPE, MAE, Best Source), Biểu đồ Actual vs Baseline, Bảng sai số, Thẻ khuyến nghị AI 5 phần | Lọc khuyến nghị theo nghiệp vụ (Mua dầu thô, Kinh doanh SP, Tồn kho), đánh giá hữu ích, chuyển thành báo cáo |
| 5 | **Nhập liệu & Tin tức** `#ingestion` | Split-view: Vừa nhập tin tức/file/bảng giá bên trái (45%), vừa theo dõi và kiểm duyệt tin bên phải (55%) | Tab Nhập tin/URL, Tab Tải file PDF/Excel, Tab Nhập giá & vận hành; Luồng tin 3 nhãn [Nguồn gốc], [AI Tóm tắt], [AI Nhận định] | Dành riêng cho Đội Market Intelligence; công cụ Like/Flag/Duyệt xuất bản |
| 6 | **Đánh giá Nguồn tin** `#sources` | Bảng xếp hạng ROI & Accuracy nguồn tin, biểu đồ xu hướng chất lượng và nhật ký kiểm chứng | KPI Nguồn ROI cao nhất, Bảng so sánh 5 nguồn (Platts, Reuters, Bloomberg, Argus, EIA), Biểu đồ trend, Verification Log | Nút "Verify" cập nhật kết quả thực tế và tự động cộng dồn điểm Accuracy của nguồn tin |
| 7 | **Quản trị hệ thống** `#admin` | Quản trị toàn diện: Nguồn dữ liệu & chi phí, Công thức Crack Spread, Phân quyền 1.550 users, Audit Log, Giám sát AI Auker | 5 Tabs: (7.1) Nguồn dữ liệu & Chi phí, (7.2) Cấu hình Công thức Crack Spread, (7.3) Quản lý Users (~1.550), (7.4) Audit Log, (7.5) Auker Observability | Chỉ hiển thị và cấp quyền cho vai trò Admin / Đội MI; các vai trò khác bị từ chối truy cập |
| AI | **Trợ lý Thị trường BSR** `#assistant` | Không gian AI Chat & Report Studio chuyên sâu 3 cột | Cột 1 (240px): Lịch sử hội thoại & Kho báo cáo; Cột 2: Luồng chat chi tiết từng bước suy luận Auker; Cột 3 (380px): Live Artifact & Citation Preview | Đính kèm nhiều file (Excel/PDF), chọn mức bảo mật (Nội bộ / Mật), nút "Quay lại màn hình trước", xuất PDF |

## Khung Bố cục & Hệ quy chuẩn

- **Header cố định 56px:** Tiêu đề trang, Bộ lọc ngày toàn cục (`14/11/2026`), Role Switcher nhanh 3 vai trò (`Lãnh đạo [Full Physical]` <-> `Đội MI [Nhập liệu & Admin]` <-> `Nhân viên nội bộ [Ẩn Physical]`).
- **Sidebar trái 240px (thu gọn về 64px):** 3 nhóm: Nghiệp vụ (6 trang), Trợ lý chuyên sâu (AI), Quản trị hệ thống (Admin).
- **Cơ chế Nhập liệu Không Mất View:** Slide-over Drawer rộng 440px từ cạnh phải, giữ nguyên 65% màn hình bên trái.
- **Hệ màu chuẩn:** Primary Petroleum Navy `#1B365D`, Accent Teal `#007A87`, Nền `#F8FAFC`, Thẻ `#FFFFFF` viền `#E2E8F0`.
