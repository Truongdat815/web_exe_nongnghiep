import {
  Activity,
  Bot,
  ChevronRight,
  Cpu,
  Droplets,
  Landmark,
  QrCode,
  ShieldCheck,
  Sprout,
  Store,
  Target,
  ThermometerSun,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';

const heroStats = [
  { label: 'Vườn thí điểm', value: '128', Icon: Target },
  { label: 'Cảnh báo xử lý', value: '24/7', Icon: Activity },
  { label: 'Giao dịch an toàn', value: 'Escrow', Icon: ShieldCheck },
];

const telemetryRows = [
  { label: 'Độ ẩm đất', value: '38%', note: 'Khu A cần tưới', Icon: Droplets },
  { label: 'Nhiệt độ', value: '27.4°C', note: 'Ổn định', Icon: ThermometerSun },
  { label: 'Relay van tưới', value: 'ON', note: 'Tự động', Icon: Zap },
];

const productCards = [
  {
    title: 'Nông dân',
    text: 'Theo dõi từng mảnh đất, hỏi AI, đăng bài cộng đồng, mua vật tư và bán nông sản.',
    Icon: Sprout,
  },
  {
    title: 'Kỹ sư nông nghiệp',
    text: 'Nhận ca SOS, xem lịch sử IoT, bình luận biện pháp xử lý và gợi ý thuốc.',
    Icon: Bot,
  },
  {
    title: 'Đại lý & doanh nghiệp',
    text: 'Quản lý đơn hàng, escrow, vật tư, thu mua nông sản và kiểm tra QR nhật ký.',
    Icon: Store,
  },
];

const pipelineCards = [
  { title: 'IoT theo khu vực', text: 'ESP32 gửi độ ẩm, nhiệt độ, độ mặn và NPK theo từng vùng trồng.', Icon: Cpu },
  { title: 'AI chẩn đoán', text: 'Ảnh lá bệnh được phân tích, nếu thiếu tự tin sẽ chuyển kỹ sư xử lý.', Icon: Bot },
  { title: 'QR minh bạch', text: 'Nhật ký canh tác, hóa đơn vật tư và dữ liệu IoT được khóa thành QR.', Icon: QrCode },
  { title: 'Thanh toán bảo chứng', text: 'Escrow giữ tiền giao dịch để giảm rủi ro hàng giả và tranh chấp.', Icon: Landmark },
];

export function HomeSection({ openAuth, goLandingPage }) {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
  };

  return (
    <motion.div
      className="landing-panel landing-home-page"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <section className="landing-home-v2">
        <div className="landing-hero-copy">
          <motion.div variants={item} className="landing-trust-pill">
            <span>Bến Lức Pilot</span>
            <strong>IoT + AI + Escrow cho chuỗi nông nghiệp</strong>
          </motion.div>

          <motion.h1 variants={item}>Nền tảng vận hành nông nghiệp số cho vườn, chuyên gia và giao dịch.</motion.h1>

          <motion.p variants={item}>
            GREENOVA giúp nông dân theo dõi vườn theo thời gian thực, hỏi kỹ sư khi cây có vấn đề, mua vật tư an toàn và bán nông sản bằng dữ liệu có thể kiểm chứng.
          </motion.p>

          <motion.div variants={item} className="landing-cta">
            <button className="solid-button large" onClick={() => openAuth('register')}>
              Bắt đầu demo
              <ChevronRight size={17} />
            </button>
            <button className="outline-link button-link" onClick={() => goLandingPage('iot')}>
              Xem hệ thống IoT
            </button>
          </motion.div>

          <motion.div variants={item} className="hero-metrics-premium">
            {heroStats.map(({ label, value, Icon }) => (
              <div className="metric-item" key={label}>
                <div className="metric-icon">
                  <Icon size={20} />
                </div>
                <div className="metric-text">
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div variants={item} className="landing-hero-card premium-hero-widget">
          <div className="hero-photo-stack">
            <div className="hero-photo main">
              <span>Vườn chanh Bến Lức</span>
            </div>
            <div className="hero-photo lime">
              <span>Ảnh cây trồng</span>
            </div>
            <div className="hero-photo farmer">
              <span>Vùng khóm</span>
            </div>
          </div>

          <div className="glass-widget-main">
            <div className="widget-header">
              <div className="widget-title">
                <Cpu size={18} />
                <span>Trạm ESP32 trung tâm</span>
              </div>
              <div className="status-indicator">
                <span className="pulse-dot" />
                Online
              </div>
            </div>

            <div className="widget-body">
              <div className="sensor-ring-container">
                <svg viewBox="0 0 100 100" className="sensor-svg-ring">
                  <circle cx="50" cy="50" r="45" className="bg-ring" />
                  <circle cx="50" cy="50" r="45" className="progress-ring" strokeDasharray="283" strokeDashoffset="74" />
                </svg>
                <div className="sensor-ring-value">
                  <strong>86<span>%</span></strong>
                  <small>Sức khỏe vườn</small>
                </div>
              </div>

              <div className="sensor-stats">
                {telemetryRows.map(({ label, value, note, Icon }) => (
                  <div className="stat-row" key={label}>
                    <div className="stat-icon">
                      <Icon size={14} />
                    </div>
                    <div className="stat-info">
                      <span>{label}</span>
                      <strong>{value}</strong>
                      <small>{note}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="landing-proof-strip" aria-label="Năng lực nền tảng">
        <span>Mock MVP sẵn cho Vercel + Firebase</span>
        <span>5 role vận hành</span>
        <span>Dữ liệu IoT theo khu vực</span>
        <span>Thanh toán escrow</span>
      </section>

      <section className="landing-product-grid">
        {productCards.map(({ title, text, Icon }) => (
          <article key={title} className="landing-product-card">
            <Icon size={22} />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="landing-pipeline-section">
        <div className="landing-mini-heading">
          <span>Luồng vận hành</span>
          <h2>Từ dữ liệu ngoài vườn đến giao dịch có bảo chứng.</h2>
        </div>
        <div className="landing-pipeline-grid">
          {pipelineCards.map(({ title, text, Icon }) => (
            <article key={title} className="landing-pipeline-card">
              <Icon size={22} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
