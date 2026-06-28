import { ShieldCheck, Cpu, QrCode, TrendingUp, Users, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

export function BenefitsSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const benefits = [
    ['Bảo vệ thanh toán (Escrow)', 'Hợp đồng thông minh tạm giữ tiền 48h, giảm thiểu rủi ro mua vật tư giả mạo.', ShieldCheck, '#34d399', 'rgba(52, 211, 153, 0.15)'],
    ['AI Chẩn đoán', 'Tự động nhận diện bệnh cây qua ảnh. Chuyển chuyên gia khi độ tin cậy thấp.', Cpu, '#60a5fa', 'rgba(96, 165, 250, 0.15)'],
    ['Truy xuất (QR)', 'Dữ liệu IoT, nhật ký bón phân được số hóa thành mã QR chuẩn xuất khẩu.', QrCode, '#c084fc', 'rgba(192, 132, 252, 0.15)'],
    ['Tối ưu Logistics', 'Gợi ý đại lý ưu tiên theo bán kính giúp giảm thiểu chi phí vận chuyển.', TrendingUp, '#fbbf24', 'rgba(251, 191, 36, 0.15)'],
    ['Cộng đồng số', 'Không gian hỏi đáp trực tuyến 24/7 kết nối nông dân và kỹ sư nông nghiệp.', Users, '#fb7185', 'rgba(251, 113, 133, 0.15)'],
    ['Cloud-Native', 'Sẵn sàng mở rộng xử lý hàng triệu luồng dữ liệu IoT mà không bị gián đoạn.', Cloud, '#22d3ee', 'rgba(34, 211, 238, 0.15)'],
  ];

  return (
    <motion.div 
      className="landing-panel benefits-simple-animated"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="section-heading text-center" style={{ marginBottom: '40px' }}>
        <motion.p variants={item} className="eyebrow">Giải pháp toàn diện</motion.p>
        <motion.h2 variants={item}>Hệ sinh thái Nông nghiệp số</motion.h2>
        <motion.p variants={item}>Giải quyết triệt để các bài toán thực tiễn trong chuỗi cung ứng từ nông trại đến bàn ăn.</motion.p>
      </div>

      <div className="benefits-simple-grid">
        {benefits.map(([title, text, Icon, iconColor, bgCol]) => (
          <motion.article 
            key={title} 
            variants={item}
            whileHover={{ y: -8, scale: 1.02 }}
            className="benefit-simple-card"
          >
            <div className="benefit-simple-icon" style={{ background: bgCol, color: iconColor }}>
              <Icon size={24} strokeWidth={2} />
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}

