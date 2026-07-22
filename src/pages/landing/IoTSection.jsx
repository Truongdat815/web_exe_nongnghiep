import { CloudFog, Cpu, Droplets, Power, Radio, TestTube2 } from 'lucide-react';
import { motion } from 'framer-motion';

const telemetryCards = [
  ['Độ ẩm đất', '38%', 'Dưới ngưỡng 40%', Droplets, '#0284c7', 'warning'],
  ['Độ mặn', '0.5‰', 'An toàn để tưới', TestTube2, '#16a34a', 'safe'],
  ['Không khí', '88%', 'Nguy cơ nấm lá', CloudFog, '#475569', 'danger'],
  ['Van tưới', 'ON', 'Tự động bật', Power, '#d97706', 'active'],
];

const deviceCatalog = [
  {
    name: 'Kit trạm chính công nghiệp',
    price: '1.890.000đ',
    icon: Cpu,
    meta: 'ESP32 + 4G A7670C + LoRa',
    detail: 'Đo NPK/độ ẩm/nhiệt đất, SHT30, mưa và điều khiển van trục chính.',
    tags: ['IP65', 'Solar 5W', 'RS485'],
  },
  {
    name: 'Kit node phụ giá rẻ',
    price: '450.000đ',
    icon: Radio,
    meta: 'ESP8266 + LoRa SX1278',
    detail: 'Node phụ cho từng luống, đo độ ẩm đất, DHT11 và đóng ngắt van Phi 21.',
    tags: ['Pin 18650', 'Relay', 'WiFi'],
  },
  {
    name: 'Kit ESP32-C3 solar mini',
    price: '520.000đ',
    icon: Cpu,
    meta: 'ESP32-C3 + ESP-NOW',
    detail: 'Node tiết kiệm năng lượng cho cây mới trồng, có mưa, SHT30 và pin mặt trời mini.',
    tags: ['Solar mini', 'SHT30', 'ESP-NOW'],
  },
];

const componentGroups = [
  ['Vi điều khiển', 'ESP32, ESP32-C3, ESP8266 NodeMCU'],
  ['Truyền thông', '4G LTE A7670C, LoRa SX1278 433MHz'],
  ['Cảm biến đất', 'NPK RS485, độ ẩm, nhiệt độ đất'],
  ['Môi trường', 'SHT30 ngoài trời, DHT11, cảm biến mưa'],
  ['Chấp hành', 'Relay cách ly quang, van điện từ Phi 21/27/34'],
  ['Nguồn/vỏ', 'Hộp IP65, solar 5W, pin 18650, TP4056'],
];

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
          {telemetryCards.map(([label, value, note, Icon, color, status]) => (
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

      <motion.section variants={item} className="iot-device-catalog">
        <div className="iot-device-heading">
          <div>
            <p className="eyebrow">Thiết bị IoT GREENOVA</p>
            <h3>Danh mục phần cứng công ty triển khai cho từng quy mô vườn.</h3>
          </div>
          <span>3 kit demo · 6 nhóm linh kiện</span>
        </div>

        <div className="iot-kit-grid">
          {deviceCatalog.map(({ name, price, icon: Icon, meta, detail, tags }) => (
            <article key={name} className="iot-kit-card">
              <div className="iot-kit-top">
                <Icon size={20} />
                <span>{price}</span>
              </div>
              <h4>{name}</h4>
              <strong>{meta}</strong>
              <p>{detail}</p>
              <div className="iot-kit-tags">
                {tags.map((tag) => <small key={tag}>{tag}</small>)}
              </div>
            </article>
          ))}
        </div>

        <div className="iot-component-list">
          {componentGroups.map(([group, items]) => (
            <article key={group}>
              <span>{group}</span>
              <p>{items}</p>
            </article>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
