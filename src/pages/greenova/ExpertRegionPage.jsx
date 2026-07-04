import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CloudRain,
  Droplets,
  Leaf,
  MapPin,
  Radar,
  ShieldAlert,
  Thermometer,
  Wind,
} from 'lucide-react';
import { Badge } from './pageUtils';

const REGIONAL_POINTS = [
  { id: 'P1', x: 22, y: 34, label: 'Thạnh Phú', disease: 'Đốm lá chanh', spread: 31, rain: 12, moisture: 88, level: 'warn' },
  { id: 'P2', x: 48, y: 52, label: 'Lương Bình', disease: 'Úng rễ khóm', spread: 42, rain: 26, moisture: 82, level: 'danger' },
  { id: 'P3', x: 72, y: 28, label: 'Nhựt Chánh', disease: 'Bọ trĩ đọt non', spread: 18, rain: 8, moisture: 76, level: 'safe' },
  { id: 'P4', x: 64, y: 72, label: 'Mỹ Yên', disease: 'Nấm lá nhẹ', spread: 24, rain: 15, moisture: 85, level: 'warn' },
];

const MAP_TILES = [
  [6517, 3851], [6518, 3851], [6519, 3851],
  [6517, 3852], [6518, 3852], [6519, 3852],
  [6517, 3853], [6518, 3853], [6519, 3853],
];

export function ExpertRegionPage({ state, notify }) {
  const [selectedPointId, setSelectedPointId] = useState(REGIONAL_POINTS[0].id);
  const selectedPoint = REGIONAL_POINTS.find((point) => point.id === selectedPointId) || REGIONAL_POINTS[0];

  const summary = useMemo(() => {
    const avgMoisture = Math.round(REGIONAL_POINTS.reduce((sum, point) => sum + point.moisture, 0) / REGIONAL_POINTS.length);
    const avgRain = Math.round(REGIONAL_POINTS.reduce((sum, point) => sum + point.rain, 0) / REGIONAL_POINTS.length);
    const hotSpots = REGIONAL_POINTS.filter((point) => point.level !== 'safe').length;
    const avgSpread = Math.round(REGIONAL_POINTS.reduce((sum, point) => sum + point.spread, 0) / REGIONAL_POINTS.length);
    return { avgMoisture, avgRain, hotSpots, avgSpread };
  }, []);

  return (
    <section className="expert-region-page expert-workspace">
      <header className="expert-page-hero">
        <div>
          <p className="eyebrow">Dữ liệu vùng Bến Lức</p>
          <h1>Bản đồ dự báo dịch hại, mưa và độ ẩm theo khu vực</h1>
          <p>Kỹ sư theo dõi 2D heatmap để biết vùng nào đang ẩm cao, có mưa, bệnh gì đang nổi và tỷ lệ lây lan dự kiến.</p>
        </div>
        <div className="expert-hero-stats">
          <span><CloudRain size={16} /> Mưa TB <b>{summary.avgRain}mm</b></span>
          <span><Droplets size={16} /> Ẩm TB <b>{summary.avgMoisture}%</b></span>
          <span><ShieldAlert size={16} /> Điểm nóng <b>{summary.hotSpots}</b></span>
        </div>
      </header>

      <div className="expert-region-layout">
        <main className="expert-map-card">
          <div className="expert-map-head">
            <div>
              <p className="eyebrow">Bản đồ thật · OpenStreetMap tile</p>
              <h2>Vùng quản lý Long An · Bến Lức</h2>
            </div>
            <Badge status="warning">Lây lan TB {summary.avgSpread}%</Badge>
          </div>

          <div className="expert-2d-map">
            <div className="expert-real-tile-map" aria-label="Bản đồ thật khu vực Bến Lức, Long An">
              {MAP_TILES.map(([x, y]) => (
                <img
                  key={`${x}-${y}`}
                  src={`https://tile.openstreetmap.org/13/${x}/${y}.png`}
                  alt=""
                  loading="lazy"
                />
              ))}
            </div>
            <div className="real-map-overlay" />
            <div className="map-rain-zone zone-a">Mưa nhẹ</div>
            <div className="map-rain-zone zone-b">Ẩm cao</div>
            {REGIONAL_POINTS.map((point) => (
              <button
                key={point.id}
                className={`map-hotspot ${point.level} ${selectedPoint.id === point.id ? 'active' : ''}`}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                onClick={() => setSelectedPointId(point.id)}
                title={`${point.label}: ${point.disease}`}
              >
                <span>{point.id.replace('P', '')}</span>
              </button>
            ))}
            <a
              className="real-map-link"
              href="https://www.openstreetmap.org/#map=13/10.6531/106.4728"
              target="_blank"
              rel="noreferrer"
            >
              Mở bản đồ lớn
            </a>
          </div>

          <div className="expert-map-legend">
            <span><i className="safe" /> Ổn định</span>
            <span><i className="warn" /> Theo dõi</span>
            <span><i className="danger" /> Nguy cơ cao</span>
          </div>
        </main>

        <aside className="expert-region-side">
          <section className="region-detail-card">
            <div>
              <MapPin size={18} />
              <h2>{selectedPoint.label}</h2>
            </div>
            <p>{selectedPoint.disease}</p>
            <div className="region-risk-meter">
              <i style={{ width: `${selectedPoint.spread}%` }} />
            </div>
            <strong>{selectedPoint.spread}% nguy cơ lây lan</strong>
          </section>

          <section className="region-weather-grid">
            <article><CloudRain size={18} /><span>Mưa</span><strong>{selectedPoint.rain}mm</strong></article>
            <article><Droplets size={18} /><span>Độ ẩm</span><strong>{selectedPoint.moisture}%</strong></article>
            <article><Thermometer size={18} /><span>Nhiệt</span><strong>27.6°C</strong></article>
            <article><Wind size={18} /><span>Gió</span><strong>12km/h</strong></article>
          </section>

          <section className="region-alert-list">
            <h3><Radar size={17} /> Cảnh báo chủ động</h3>
            {state.pestAlerts.map((alert) => (
              <article key={alert.id}>
                <AlertTriangle size={16} />
                <div>
                  <strong>{alert.disease}</strong>
                  <p>{alert.reason}</p>
                </div>
              </article>
            ))}
            <button onClick={() => notify?.('Đã gửi cảnh báo vùng cho nông dân cùng loại cây.')}>
              <Leaf size={15} /> Gửi cảnh báo vùng
            </button>
          </section>
        </aside>
      </div>
    </section>
  );
}
