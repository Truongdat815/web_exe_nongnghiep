
export const defaultIntelStream = [
  {
    id: "EVT-100",
    type: "CRITICAL_ALERT",
    source: "AI Diagnostic Engine",
    location: "Vùng trồng Bến Lức",
    title: "Phát hiện nguy cơ lây nhiễm chéo Nấm Lá",
    description: "AI phát hiện chùm ca bệnh có triệu chứng nấm lá gia tăng (8 ca trong 24h) với độ ẩm liên tục >85%. Cần rà soát toàn bộ vùng canh tác chanh không hạt.",
    severity: "high",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    metrics: { cases: 8, confidence: 94 }
  },
  {
    id: "EVT-101",
    type: "IOT_TELEMETRY",
    source: "Trạm Sensor ESP32-A1",
    location: "Nông trại Thạnh Phú",
    title: "Cảnh báo Xâm nhập Mặn",
    description: "Độ mặn nước kênh đo được 1.2‰, vượt ngưỡng an toàn (0.8‰). Hệ thống đã tự động khóa van hút nước từ kênh ngoài.",
    severity: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    metrics: { salinity: 1.2, valve: "LOCKED" }
  },
  {
    id: "EVT-102",
    type: "MARKET_INSIGHT",
    source: "Data Aggregator",
    location: "Thị trường nội địa",
    title: "Giá thu mua Chanh không hạt tăng",
    description: "Giá thu mua đạt 18.000đ/kg do nhu cầu xuất khẩu tăng. Lô hàng đạt chuẩn VietGAP có thể đàm phán giá trần 20.000đ/kg.",
    severity: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    metrics: { price: "18.000đ", trend: "+2.5%" }
  },
  {
    id: "EVT-103",
    type: "SYSTEM_LOG",
    source: "Smart Contract (Escrow)",
    location: "Sổ cái Ledger",
    title: "Giao dịch vật tư hoàn tất",
    description: "Khối Blockchain #0x9a8f... ghi nhận thanh toán tự động cho lô NPK từ đại lý Út Chanh sau 48h xác minh.",
    severity: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    metrics: { amount: "1.2M", tx: "VERIFIED" }
  },
  {
    id: "EVT-104",
    type: "IOT_TELEMETRY",
    source: "Hệ thống Tưới tự động",
    location: "Lô Khóm C12",
    title: "Tưới tiêu thông minh kích hoạt",
    description: "Độ ẩm đất giảm xuống 38%. Van tưới tự động mở 15 phút. Không ghi nhận mưa trong bán kính 10km.",
    severity: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    metrics: { soilMoisture: "38%", duration: "15m" }
  },
  {
    id: "EVT-105",
    type: "WEATHER_WARNING",
    source: "Trạm Khí tượng ĐB SCL",
    location: "Toàn vùng Long An",
    title: "Dự báo mưa lớn cực đoan",
    description: "Mưa rào nặng hạt vào chiều tối nay. Cảnh báo nguy cơ ngập úng rễ cục bộ ở các vườn trũng.",
    severity: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    metrics: { rainfall: "45mm", wind: "12km/h" }
  }
];
