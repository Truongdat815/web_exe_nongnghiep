import { Activity, BrainCircuit, Store, ShieldCheck, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

export function WorkflowSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const steps = [
    { num: '01', title: 'IoT Cảnh báo', text: 'Cảm biến phát hiện bất thường môi trường.', Icon: Activity, color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)' },
    { num: '02', title: 'AI Chẩn đoán', text: 'Chụp ảnh gửi AI phân tích bệnh tự động.', Icon: BrainCircuit, color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.15)' },
    { num: '03', title: 'Sàn vật tư', text: 'AI gợi ý đại lý thuốc gần nhất.', Icon: Store, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' },
    { num: '04', title: 'Escrow 48h', text: 'Thanh toán được bảo vệ bởi Hợp đồng thông minh.', Icon: ShieldCheck, color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)' },
    { num: '05', title: 'QR Passport', text: 'Mọi dữ liệu được lưu trên Blockchain.', Icon: QrCode, color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)' },
  ];

  return (
    <motion.div 
      className="landing-panel workflow-sequence-section"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="section-heading text-center" style={{ marginBottom: '50px' }}>
        <motion.p variants={item} className="eyebrow">Quy trình tự động hóa</motion.p>
        <motion.h2 variants={item}>Từ Phát hiện đến Giao dịch</motion.h2>
        <motion.p variants={item}>Luồng xử lý khép kín, minh bạch và hoàn toàn tự động.</motion.p>
      </div>

      <div className="workflow-sequence-grid">
        {steps.map((step) => (
          <motion.div key={step.num} variants={item} className="workflow-seq-card">
            <div className="seq-number">{step.num}</div>
            <div className="seq-icon" style={{ background: step.bg, color: step.color }}>
              <step.Icon size={26} strokeWidth={2.5} />
            </div>
            <div className="seq-content">
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
