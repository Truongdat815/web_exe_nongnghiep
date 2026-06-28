import { Droplets, TestTube2, CloudFog, Power } from 'lucide-react';
import { motion } from 'framer-motion';

export function IoTSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" } }
  };

  return (
    <motion.div 
      className="landing-panel landing-iot-page"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div variants={item} className="section-heading">
        <p className="eyebrow">IoT Remote Telemetry</p>
        <h2>Giám sát ruộng vườn theo từng phân khu</h2>
        <p>
          Trạm ESP32 gửi độ ẩm đất, độ mặn, nhiệt độ, độ ẩm không khí, lượng mưa và NPK.
          Khi đất khô nhưng nước không nhiễm mặn, hệ thống mô phỏng mở van tưới tự động.
        </p>
      </motion.div>
      <motion.div variants={item} className="iot-command-center">
        <div className="iot-map-card">
          <div className="radar-sweep" />
          <span className="scan-ring one" />
          <span className="scan-ring two" />
          <span className="field-node node-a">A</span>
          <span className="field-node node-b">B</span>
          <span className="field-node node-c">C</span>
          <strong>Vườn chanh không hạt Thạnh Phú</strong>
        </div>
        <div className="iot-strip">
          {[
            ['Độ ẩm đất', '38%', 'Dưới ngưỡng 40%', Droplets, '#38bdf8', 'warning'],
            ['Độ mặn', '0.5‰', 'An toàn để tưới', TestTube2, '#4ade80', 'safe'],
            ['Không khí', '88%', 'Nguy cơ nấm lá', CloudFog, '#cbd5e1', 'danger'],
            ['Van tưới', 'ON', 'Tự động bật', Power, '#facc15', 'active'],
          ].map(([label, value, note, Icon, color, status]) => (
            <motion.div 
              variants={item} 
              whileHover={{ scale: 1.05, y: -5 }}
              key={label} 
              className="iot-sensor-card premium-card dark-mode"
            >
              <div className="sensor-icon-wrapper" style={{ color }}>
                <Icon size={26} strokeWidth={2.5} />
              </div>
              <div className="sensor-data">
                <span>{label}</span>
                <strong>{value}</strong>
                <small className={`status-badge ${status}`}>{note}</small>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
