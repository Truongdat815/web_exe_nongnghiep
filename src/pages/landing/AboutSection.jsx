import { Bot, Building2, Sprout, Store } from 'lucide-react';
import { motion } from 'framer-motion';

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
          {[
            ['Nông dân', Sprout, 'Theo dõi vườn, hỏi kỹ sư, mua vật tư bằng escrow.'],
            ['Kỹ sư', Bot, 'Nhận SOS, xem IoT history và kê đơn xử lý.'],
            ['Đại lý', Store, 'Quản lý kho, nhận đơn, tham gia đấu giá ngược.'],
            ['Buyer', Building2, 'Quét QR passport và tạo chiến dịch thu mua.'],
          ].map(([title, Icon, text]) => (
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
            {[
              ['lime', 'Chanh không hạt', 'Theo dõi độ ẩm, nấm lá và QR passport cho lô hàng.'],
              ['pineapple', 'Khóm Bến Lức', 'Cảnh báo úng rễ, vàng lá và chiến dịch thu mua sỉ.'],
              ['market', 'Vật tư chính hãng', 'Gợi ý phân bón, thuốc sinh học từ đại lý.'],
            ].map(([tone, title, text]) => (
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
      </div>
    </motion.div>
  );
}
