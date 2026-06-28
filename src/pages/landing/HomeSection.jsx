import { Bot, ChevronRight, LockKeyhole, ShieldCheck, Activity, Target, Cpu, Droplets, ThermometerSun, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function HomeSection({ openAuth, goLandingPage }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="landing-hero landing-panel"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="landing-hero-copy">
        <motion.p variants={item} className="eyebrow">GREENOVA Agricultural Digital Ecosystem</motion.p>
        <motion.h1 variants={item}>Nền tảng số cho nông dân, kỹ sư và chuỗi cung ứng nông nghiệp</motion.h1>
        <motion.p variants={item}>
          Một hệ sinh thái nhẹ nhưng có đủ demo: IoT ESP32, AI chẩn đoán, bảng tin cộng đồng,
          sàn vật tư escrow, đấu giá ngược và QR nhật ký canh tác cho Bến Lức, Long An.
        </motion.p>
        <motion.div variants={item} className="landing-cta">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="solid-button large" onClick={() => openAuth('register')}>Bắt đầu dùng thử</motion.button>
          <motion.button whileHover={{ x: 5 }} className="outline-link button-link" onClick={() => goLandingPage('iot')}>Xem IoT hoạt động <ChevronRight size={16} /></motion.button>
        </motion.div>
        <motion.div variants={item} className="hero-metrics-premium">
          <div className="metric-item">
            <div className="metric-icon"><Target size={22} /></div>
            <div className="metric-text">
              <strong>10K+</strong>
              <span>Hecta theo dõi</span>
            </div>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <div className="metric-icon"><Activity size={22} /></div>
            <div className="metric-text">
              <strong>24/7</strong>
              <span>AI Chẩn đoán</span>
            </div>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <div className="metric-icon"><ShieldCheck size={22} /></div>
            <div className="metric-text">
              <strong>100%</strong>
              <span>Giao dịch Escrow</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className="landing-hero-card premium-hero-widget">
        <div className="hero-photo-stack">
          <motion.div whileHover={{ scale: 1.05, rotate: -2 }} className="hero-photo main"><span>Khu Sinh Thái Bến Lức</span></motion.div>
          <motion.div whileHover={{ scale: 1.05, rotate: 2 }} className="hero-photo lime"><span>Vườn Chanh Không Hạt</span></motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="hero-photo farmer"><span>Canh Tác Số</span></motion.div>
        </div>
        
        <motion.div 
          className="glass-widget-main"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", bounce: 0.3 }}
        >
          <div className="widget-header">
            <div className="widget-title">
              <Cpu size={18} className="text-emerald-400" />
              <span>Trạm ESP32 Trung Tâm</span>
            </div>
            <div className="status-indicator">
              <span className="pulse-dot"></span> Đang đồng bộ
            </div>
          </div>
          
          <div className="widget-body">
            <div className="sensor-ring-container">
              <svg viewBox="0 0 100 100" className="sensor-svg-ring">
                <circle cx="50" cy="50" r="45" className="bg-ring" />
                <circle cx="50" cy="50" r="45" className="progress-ring" strokeDasharray="283" strokeDashoffset="70" />
              </svg>
              <div className="sensor-ring-value">
                <strong>75<span>%</span></strong>
                <small>Độ ẩm chuẩn</small>
              </div>
            </div>
            
            <div className="sensor-stats">
              <div className="stat-row">
                <div className="stat-icon"><ThermometerSun size={14} /></div>
                <div className="stat-info"><span>Nhiệt độ</span><strong>26.5°C</strong></div>
              </div>
              <div className="stat-row">
                <div className="stat-icon"><Droplets size={14} /></div>
                <div className="stat-info"><span>Độ mặn</span><strong className="safe">0.2‰ (An toàn)</strong></div>
              </div>
              <div className="stat-row">
                <div className="stat-icon"><Zap size={14} /></div>
                <div className="stat-info"><span>Bơm tưới</span><strong className="active">Tự động BẬT</strong></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="glass-floating-alert top-alert"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, type: "spring" }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="alert-icon ai"><Bot size={18} /></div>
          <div className="alert-content">
            <strong>AI Chẩn Đoán</strong>
            <span>Phát hiện nấm lá. Cần phun xịt.</span>
          </div>
        </motion.div>

        <motion.div 
          className="glass-floating-alert bottom-alert"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, type: "spring" }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="alert-icon sc"><CheckCircle2 size={18} /></div>
          <div className="alert-content">
            <strong>Smart Contract</strong>
            <span>Đã xác thực lô phân bón #VN-884</span>
          </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}

