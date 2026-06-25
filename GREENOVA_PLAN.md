# GREENOVA - Plan ý tưởng triển khai web nhẹ

## 1. Kết luận kỹ thuật nhanh

Có thể làm bằng Node.js theo hướng nhẹ: dùng Node để chạy toolchain build/dev, còn sản phẩm chính là web React/Vite deploy tĩnh lên Vercel. Không cần dựng server riêng ở MVP.

Stack đề xuất:

- Frontend: React + Vite ở repo gốc.
- UI: CSS hiện có + `lucide-react` + `recharts`.
- State: React state + `localStorage` cho demo thao tác.
- Auth/RBAC demo: login bằng tài khoản mẫu, role-based UI.
- Deploy: Vercel static build.
- Nâng cấp dữ liệu sau: Firebase Auth + Firestore + Storage + Cloud Functions nếu cần cron/escrow thật.
- AI demo: mock confidence/result trước; sau này nối Gemini hoặc API AI riêng.
- Blockchain demo: hash SHA-256/timeline giả lập trước; sau này mới nối smart contract/private ledger nếu project thật sự cần.

Lý do chọn hướng này: đúng yêu cầu "web nhẹ, có thể thao tác, host nhẹ", tránh backend phức tạp khi mục tiêu hiện tại là demo/sản phẩm mẫu.

## 2. Code mẫu đã đọc và cách tận dụng

Repo gốc hiện đã có app React/Vite với các màn hình:

- `src/App.jsx`: khung app có login/register, sidebar, topbar, page switching.
- `src/data/mockData.js`: mock users, farms, IoT sensor history, products, orders, social posts, AI diagnoses, farming ledger, auctions, notifications, market prices.
- `src/pages/AIDiagnosisPage.jsx`: có luồng nhập ảnh/IoT/text, loading phân tích, kết quả chẩn đoán, phác đồ, lịch sử.
- `src/pages/LedgerPage.jsx`: có nhật ký canh tác, trạng thái blockchain, QR passport preview.
- `src/pages/MarketplacePage.jsx`, `OrdersPage.jsx`, `AuctionPage.jsx`, `AdminPage.jsx`: phù hợp để mở rộng marketplace, escrow, đấu giá, admin.

Các thư mục mẫu từ Stitch/Google AI Studio chỉ dùng làm tài liệu tham khảo nghiệp vụ, không dùng làm nền giao diện chính và không cần copy nguyên component:

- `greenova`: tham khảo cách chia 5 role, notification center, role switcher.
- `agrisync-pro`: tham khảo luồng KYC, sourcing, campaign, escrow, pest alerts, pathology/SOS ticket, inventory, AI chat.
- `agrisystem-pro`: tham khảo nghiệp vụ checkout, tracking, dispute, logistics, finance, IoT hardware ops.
- `greenova-portal`: tham khảo các màn profile, audit, notification, engineer inbox, supply chain, dispute radar.

Lưu ý quan trọng: giao diện trong các folder mẫu không phải tiêu chuẩn cuối. Nhiều màn còn xấu, rối hoặc lỗi encoding tiếng Việt. Hướng triển khai là code mới sạch, UI mới nhất quán, chỉ mượn ý tưởng flow/data/action nào hợp lý.

## 3. Phạm vi MVP nên làm

MVP nên gồm đủ 5 role nhưng mỗi role chỉ giữ các workflow quan trọng nhất.

### Farmer - Nông dân

Mục tiêu: mobile-first, nút lớn, dễ thao tác.

Chức năng:

- Dashboard vườn: health score, IoT gauges, độ ẩm đất, nhiệt độ, độ mặn, trạng thái van tưới.
- Quản lý vườn: chọn vườn chanh không hạt/khóm ở Bến Lức, Long An.
- AI Hub: upload/chọn ảnh mock, phân tích confidence.
- Nếu confidence >= 75%: hiển thị kết quả, phác đồ, gợi ý sản phẩm trong bán kính 15km.
- Nếu confidence < 75%: tạo SOS ticket cho Expert.
- Marketplace vật tư: xem sản phẩm, thêm giỏ hàng, checkout escrow.
- Theo dõi đơn hàng: state machine Created -> Paid_Escrow -> Shipping -> Delivered_Locked -> Released/Disputed.
- Dispute: bấm khiếu nại trong 48h, đóng băng escrow.
- Nhật ký canh tác: thêm ghi chú, xem log IoT/AI/giao dịch, xem QR passport mock.

### Expert - Kỹ sư nông nghiệp

Mục tiêu: xử lý ca bệnh và kê đơn.

Chức năng:

- SOS queue: danh sách ticket từ Farmer, có ưu tiên khẩn cấp.
- Ticket detail: ảnh, triệu chứng, 30 ngày IoT history mock, AI confidence.
- Kê đơn: nhập chẩn đoán, bước xử lý, chọn sản phẩm khuyến nghị.
- Trust score: tăng nhẹ khi xử lý ticket.
- Knowledge base: bản đơn giản gồm danh sách bài viết/tips.

### Distributor - Đại lý vật tư

Mục tiêu: bán vật tư và tham gia đấu giá.

Chức năng:

- Inventory: CRUD mock sản phẩm, tồn kho, cảnh báo hết hạn/sắp cạn.
- Order monitor: đơn đang khóa escrow, chuẩn bị hàng, chuyển trạng thái shipping.
- Reverse auction portal: xem gói thầu, gửi bid thấp hơn giá trần.
- Pest heatmap: xem vùng cảnh báo dịch để gợi ý marketing địa phương.

### Buyer - Doanh nghiệp thu mua

Mục tiêu: kiểm tra nguồn gốc và tạo campaign thu mua.

Chức năng:

- Sourcing search: danh sách farm/lô hàng đã xác thực.
- Blockchain audit: xem hash timeline, IoT logs, AI logs, material invoice.
- QR passport viewer: màn hình quét/xem hộ chiếu nông sản mock.
- Campaign manager: tạo chiến dịch thu mua sỉ, xem bid, chọn nhà vườn.

### Admin - Ban quản trị

Mục tiêu: điều phối rủi ro và vận hành.

Chức năng:

- Control center: metrics người dùng, giao dịch, cảnh báo dịch, escrow.
- KYC pipeline: duyệt/từ chối hồ sơ Distributor/Buyer/Expert.
- Escrow arbitration: xem dispute, quyết định release/refund mock.
- Pest alert system: danh sách vùng cảnh báo, mô phỏng phát cảnh báo.
- Audit logs: log thao tác mock để demo tính minh bạch.

## 4. Luồng nghiệp vụ cần mô phỏng đầy đủ

### 4.1. Escrow 48 giờ

State tối thiểu:

```text
Created -> Paid_Escrow -> Shipping -> Delivered_Locked -> Released
                                      -> Disputed
```

Hành vi demo:

- Checkout tạo order `Paid_Escrow`, tính `platformFee = 3%`, `netAmount = total - fee`.
- Distributor bấm "Giao hàng" chuyển `Shipping`.
- Farmer/Admin bấm "Đã nhận" chuyển `Delivered_Locked`, tạo deadline 48h mock.
- Button "Giả lập hết 48h" chuyển `Released`, cộng tiền mock cho distributor/admin.
- Button "Khiếu nại" chuyển `Disputed`, tạo dispute ticket cho Admin.

### 4.2. Reverse auction

State tối thiểu:

```text
Open -> Closed -> Settled
```

Hành vi demo:

- Farmer/Buyer tạo campaign: loại giao dịch, số lượng, giá trần, vị trí, deadline.
- Distributor/Farmer khác gửi bid.
- Chủ campaign chấp nhận bid.
- Hệ thống tạo escrow transaction tương ứng.
- Với Wholesale_B2B tính phí môi giới 1%.

### 4.3. IoT telemetry automation

Hành vi demo:

- Farm có device ESP32 mock.
- Telemetry gồm: moisture, salt intrusion, temp, humidity, NPK.
- Nếu moisture < threshold và salt an toàn: trạng thái `TURN_ON_VALVE`.
- Nếu moisture thấp nhưng salt vượt ngưỡng: trạng thái `FORCE_SHUTDOWN_VALVE`.
- Tạo notification tương ứng.

### 4.4. AI diagnostics

Hành vi demo:

- Farmer chọn ảnh mẫu hoặc kéo thả file.
- App tạo kết quả mock có confidence.
- >= 75%: ghi diagnosis vào ledger, gợi ý sản phẩm từ marketplace.
- < 75%: tạo SOS ticket cho expert, đính kèm IoT history mock.

### 4.5. Blockchain ledger và QR passport

Hành vi demo:

- Mỗi event quan trọng tạo một ledger item:
  - IoT_Log
  - AI_Diagnosis
  - Material_Invoice
  - Farming_Note
  - Escrow_Event
- Hash có thể tạo bằng Web Crypto API trong browser.
- QR passport là card/detail route mock, chưa cần QR thật ở bản đầu. Nếu muốn QR thật sau có thể thêm thư viện nhỏ.

## 5. Data model frontend cần chuẩn hóa

Không cần MongoDB/Supabase thật ở MVP, nhưng mock data nên đặt gần schema thật để sau này chuyển Firebase dễ hơn.

Các collection/state chính:

- `users`
- `farmProfiles`
- `iotDevices`
- `iotTelemetry`
- `crops`
- `products`
- `inventories`
- `orders`
- `escrowTransactions`
- `reverseAuctions`
- `bids`
- `aiDiagnoses`
- `sosIssues`
- `prescriptions`
- `blockchainCropLedgers`
- `kycRequests`
- `pestAlerts`
- `auditLogs`
- `notifications`

Nên gom vào `src/data/greenovaMockData.js` hoặc tách theo domain nếu file quá dài:

- `src/data/users.js`
- `src/data/farms.js`
- `src/data/commerce.js`
- `src/data/ai.js`
- `src/data/ledger.js`

Vì project hiện còn nhỏ, ưu tiên một file mock data trước để giảm phức tạp.

## 6. Kiến trúc frontend đề xuất

Giữ app gốc React/Vite, không kéo nguyên các sub-project vào chạy song song, không bê nguyên UI từ Stitch/AI Studio. Tạo code mới trong `src/` theo style GREENOVA riêng: sạch, nhẹ, responsive, thao tác được.

Cấu trúc nên hướng tới:

```text
src/
  App.jsx
  context/
    AuthContext.jsx
    GreenovaDataContext.jsx
  components/
    Sidebar.jsx
    Topbar.jsx
    StatCard.jsx
    StatusBadge.jsx
    DataTable.jsx
    Modal.jsx
  pages/
    Dashboard.jsx
    FarmsPage.jsx
    AIDiagnosisPage.jsx
    MarketplacePage.jsx
    OrdersPage.jsx
    AuctionPage.jsx
    LedgerPage.jsx
    ExpertPage.jsx
    DistributorPage.jsx
    BuyerPage.jsx
    AdminPage.jsx
  data/
    mockData.js
  utils/
    money.js
    date.js
    escrow.js
    hash.js
```

Không tạo quá nhiều abstraction lúc đầu. Chỉ thêm helper khi dùng lặp lại rõ ràng như format tiền, format ngày, tính phí escrow, tạo hash.

## 7. UI/UX direction

Tone:

- Xanh lá, trắng, slate nhạt, điểm nhấn vàng/cam cho cảnh báo.
- Tránh quá tối hoặc quá "enterprise lạnh"; GREENOVA nên thân thiện, sạch, tin cậy.
- Farmer mobile-first: card rõ, chữ lớn, nút lớn.
- Dashboard web: bảng dày hơn, chart nhỏ, pipeline trạng thái rõ.

Layout:

- Desktop: sidebar trái + topbar + content.
- Mobile: bottom navigation hoặc drawer đơn giản.
- Role switch demo đặt rõ để thầy/cô hoặc reviewer test nhanh.
- Mỗi màn có loading/empty/error state tối thiểu.

Ưu tiên dùng icon từ `lucide-react`, không dùng emoji làm icon chính vì hiện có lỗi encoding.

## 8. Firebase/Vercel roadmap

MVP không bắt buộc Firebase. Nếu cần host và có dữ liệu thật nhẹ:

### Giai đoạn 1 - Static demo

- Vercel deploy React/Vite.
- Dữ liệu mock/localStorage.
- Không có tài khoản thật.

### Giai đoạn 2 - Firebase nhẹ

- Firebase Auth: email/password hoặc Google login.
- Firestore: users, farms, products, orders, auctions, ledgers.
- Storage: ảnh chẩn đoán AI, giấy tờ KYC.
- Security Rules theo role.

### Giai đoạn 3 - Serverless logic

- Cloud Functions:
  - `checkAndReleaseEscrow`
  - `processIotTelemetry`
  - `createLedgerHash`
  - `createSosTicket`
- Scheduler cho escrow 48h.
- Gemini/AI API proxy nếu cần giấu API key.

Không nên đưa API key AI trực tiếp vào frontend nếu dùng AI thật.

## 9. Kế hoạch triển khai theo bước

### Bước 1 - Dọn nền và thống nhất hướng

- Giữ app gốc làm sản phẩm chính.
- Không xóa các folder mẫu.
- Chọn lại tên brand `GREENOVA`.
- Sửa encoding/text tiếng Việt trong app gốc nếu cần.
- Chuẩn hóa role: Farmer, Expert, Distributor, Buyer, Admin.

### Bước 2 - Chuẩn hóa dữ liệu mock

- Chuyển dữ liệu sang bối cảnh Bến Lức, Long An.
- Crop chính: Chanh không hạt, Khóm.
- Thêm mock farmer `Ngô Hoàng Trường Đạt`.
- Thêm distributor `Đại lý Vật tư Nông nghiệp Út Chanh`.
- Thêm order `#NPK-9999`, trạng thái `Delivered_Locked`, tổng 1.200.000 VND.
- Thêm telemetry: moisture 38%, salt 0.5‰.

### Bước 3 - Làm shell UI đẹp

- Sidebar role-aware.
- Topbar có notification.
- Role switcher demo.
- Responsive desktop/mobile.
- Màu xanh lá thân thiện, card gọn, bảng dễ đọc.

### Bước 4 - Hoàn thiện Farmer journey

- Dashboard IoT.
- AI diagnosis flow.
- Marketplace/cart/checkout.
- Order tracking escrow.
- Ledger/QR passport.

### Bước 5 - Hoàn thiện Expert/Distributor/Buyer/Admin

- Expert xử lý SOS ticket.
- Distributor quản lý kho và bid.
- Buyer xem passport và tạo campaign.
- Admin duyệt KYC, xử lý dispute, phát cảnh báo dịch.

### Bước 6 - Local persistence

- Tạo `GreenovaDataContext`.
- Các thao tác create/update lưu vào state và `localStorage`.
- Có nút reset demo data.

### Bước 7 - Verify và deploy

- Chạy build.
- Kiểm tra responsive.
- Deploy Vercel.
- Nếu cần Firebase thì thêm ở phase sau.

## 10. Thứ tự ưu tiên MoSCoW

Must Have:

- Login demo 5 role.
- Dashboard Farmer có IoT.
- AI diagnosis mock có nhánh >=75% và <75%.
- Marketplace + checkout escrow.
- Order tracking + dispute.
- Ledger + QR passport mock.
- Admin KYC/dispute.

Should Have:

- Reverse auction thao tác được.
- Expert kê đơn và cập nhật trust score.
- Distributor inventory CRUD mock.
- Buyer sourcing/passport viewer.
- Notification center.

Could Have:

- Pest heatmap đẹp hơn.
- QR thật.
- Export PDF passport.
- Firebase Auth/Firestore.
- Gemini AI thật.

Won't Have ở MVP:

- Backend Express riêng.
- Blockchain thật.
- Thanh toán thật.
- MQTT thật với ESP32.
- Smart contract thật.
- AI training/model thật.

## 11. Rủi ro và cách xử lý

- Rủi ro over-scope: blueprint nói 50-60 trang, nhưng MVP nhẹ chỉ nên 10-12 màn chính có thao tác.
- Rủi ro demo "giả quá": cần state thay đổi thật trong UI, không chỉ màn hình tĩnh.
- Rủi ro bảo mật nếu nối AI/Firebase: API key và quyền Firestore phải làm đúng, không hardcode secret.
- Rủi ro text lỗi: các folder mẫu có lỗi encoding, nên viết lại content tiếng Việt.
- Rủi ro Firebase rules: khi làm thật phải chặn truy cập theo role, không chỉ ẩn UI.

## 12. File/thư mục nên tham khảo khi code

- `src/App.jsx`: có thể giữ hoặc viết lại shell app chính.
- `src/data/mockData.js`: dùng làm nguồn dữ liệu ban đầu, nhưng nên chuẩn hóa lại theo GREENOVA.
- `src/pages/AIDiagnosisPage.jsx`: tham khảo workflow AI hiện có, có thể viết lại UI.
- `src/pages/LedgerPage.jsx`: tham khảo workflow ledger/QR hiện có, có thể viết lại UI.
- `agrisync-pro/src/App.tsx`: chỉ tham khảo state handlers cho KYC, campaign, escrow, pathology, inventory.
- `agrisync-pro/src/components/EscrowView.tsx`: chỉ tham khảo nghiệp vụ escrow.
- `agrisync-pro/src/components/PathologyView.tsx`: chỉ tham khảo expert SOS workflow.
- `agrisystem-pro/src/components/FarmerPortal.tsx`: chỉ tham khảo checkout/tracking/dispute.
- `agrisystem-pro/src/components/IoTAndHardware.tsx`: chỉ tham khảo IoT config/logs.
- `greenova/src/App.tsx`: chỉ tham khảo cách phân vai và notification center.
- `greenova/src/components/FarmerView.tsx`, `ExpertView.tsx`, `DistributorView.tsx`, `BuyerView.tsx`, `OperationsView.tsx`: chỉ tham khảo chức năng cần có, không copy style.

## 13. Definition of Done cho bản demo đầu

- Chạy được bằng `npm run dev`.
- Build được bằng `npm run build`.
- Người dùng chọn/đăng nhập 5 role.
- Mỗi role có ít nhất 2-3 hành động thay đổi state thật.
- Farmer hoàn thành được flow: AI diagnose -> mua vật tư -> escrow -> ledger.
- Admin thấy được dispute/KYC/cảnh báo.
- Giao diện responsive cơ bản.
- Không cần server riêng.
- Không tự động commit/push.
