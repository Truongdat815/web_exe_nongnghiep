import { Activity, Bot, Building2, Cpu, QrCode, ShieldCheck, Sprout, Store } from 'lucide-react';
import { motion } from 'framer-motion';

const roleCards = [
  ['Nông dân', Sprout, 'Theo dõi vườn, hỏi kỹ sư, mua vật tư bằng escrow.'],
  ['Kỹ sư', Bot, 'Nhận SOS, xem IoT history và kê đơn xử lý.'],
  ['Đại lý', Store, 'Quản lý kho, nhận đơn, tham gia đấu giá ngược.'],
  ['Buyer', Building2, 'Quét QR passport và tạo chiến dịch thu mua.'],
];

const cropCards = [
  ['lime', 'Chanh không hạt', 'Theo dõi độ ẩm, nấm lá và QR passport cho lô hàng.'],
  ['pineapple', 'Khóm Bến Lức', 'Cảnh báo úng rễ, vàng lá và chiến dịch thu mua sỉ.'],
  ['market', 'Vật tư chính hãng', 'Gợi ý phân bón, thuốc sinh học từ đại lý.'],
];

const operationSteps = [
  ['IoT đồng bộ', '24/7', 'Cảm biến gửi độ ẩm, nhiệt độ, mặn và NPK theo từng phân khu.', Cpu],
  ['AI + SOS', '< 3 phút', 'Ca bất thường được gom vào hàng chờ để kỹ sư xử lý.', Bot],
  ['Escrow', '48h', 'Giao dịch vật tư và thu mua có trạng thái bảo chứng rõ ràng.', ShieldCheck],
  ['QR Passport', '1 mã', 'Nhật ký canh tác và dữ liệu lô hàng được đóng gói để truy xuất.', QrCode],
];

const systemStats = [
  ['5', 'role vận hành'],
  ['128', 'vườn pilot'],
  ['86%', 'sức khỏe vườn'],
];

export function AboutSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring" } }
  };

  const itemRight = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { type: "spring" } }
  };

  return (
    <motion.div 
      className="landing-panel landing-info-page about-split-layout"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="about-left-col">
        <motion.div variants={item} className="section-heading">
          <p className="eyebrow">Website này làm gì?</p>
          <h2>Một cổng thao tác chung cho hệ sinh thái nông nghiệp</h2>
          <p>
            Mỗi vai trò có dashboard riêng nhưng cùng chia sẻ dữ liệu minh bạch:
            nông dân quản lý vườn, kỹ sư xử lý ca bệnh, đại lý bán vật tư, buyer kiểm tra nguồn gốc,
            admin điều phối rủi ro.
          </p>
        </motion.div>
        <div className="landing-feature-grid">
          {roleCards.map(([title, Icon, text]) => (
            <motion.article 
              variants={item}
              whileHover={{ scale: 1.05, y: -5 }}
              key={title} 
              className="landing-feature-card premium-card"
            >
              <Icon size={24} className="feature-icon" />
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="about-right-col">
        <div className="produce-showcase paged">
          <motion.div variants={itemRight} className="produce-heading">
            <p className="eyebrow">Pilot Crops</p>
            <h2>Nông sản chủ lực</h2>
          </motion.div>
          <div className="produce-grid premium-grid">
            {cropCards.map(([tone, title, text]) => (
              <motion.article 
                variants={itemRight}
                whileHover={{ scale: 1.02, y: -4 }}
                key={title} 
                className={`produce-card premium-image-card ${tone}`}
              >
                <div className="produce-card-bg" />
                <div className="produce-card-content">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <motion.section variants={itemRight} className="about-system-panel">
          <div className="about-system-head">
            <div>
              <p className="eyebrow">Bản đồ vận hành</p>
              <h3>Dữ liệu chạy xuyên suốt từ vườn đến giao dịch.</h3>
            </div>
            <span className="about-system-live">
              <Activity size={14} />
              Live pilot
            </span>
          </div>

          <div className="about-system-stats">
            {systemStats.map(([value, label]) => (
              <span key={label}>
                <strong>{value}</strong>
                <small>{label}</small>
              </span>
            ))}
          </div>

          <div className="about-operation-grid" aria-label="Luồng vận hành Greenova">
            {operationSteps.map(([label, value, text, Icon]) => (
              <article key={label} className="about-operation-item">
                <Icon size={18} />
                <div>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
