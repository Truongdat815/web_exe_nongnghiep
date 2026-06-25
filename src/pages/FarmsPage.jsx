import { useState } from 'react';
import { farms, sensorHistory } from '../data/mockData';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function HealthRing({ value, size = 80 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (value / 100) * circ;
  const color = value >= 80 ? 'var(--color-success)' : value >= 60 ? 'var(--color-accent)' : 'var(--color-danger)';
  return (
    <div className="health-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth={10} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${filled} ${circ - filled}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <span className="ring-value" style={{ color }}>{value}%</span>
    </div>
  );
}

const cropEmoji = { 'Lúa': '🌾', 'Sầu riêng': '🟡', 'Rau xanh tổng hợp': '🥬' };

function SensorCard({ icon, label, value, unit, status }) {
  const statusColor = status === 'ok' ? 'var(--color-success)' : status === 'warn' ? 'var(--color-accent)' : 'var(--color-danger)';
  return (
    <div className="sensor-widget iot-pulse">
      <div className="sensor-icon">{icon}</div>
      <div className="sensor-value">{value}<span className="sensor-unit"> {unit}</span></div>
      <div className="sensor-label">{label}</div>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor, margin: '6px auto 0', boxShadow: `0 0 6px ${statusColor}` }}></div>
    </div>
  );
}

export default function FarmsPage() {
  const [selectedFarm, setSelectedFarm] = useState(farms[0]);
  const [tab, setTab] = useState('overview');

  const sensors = selectedFarm.sensors;

  const getSensorStatus = (key, val) => {
    const ranges = { temperature: [20, 32], humidity: [50, 90], soilMoisture: [40, 80], ph: [5.5, 7.0] };
    if (!val) return 'ok';
    const [min, max] = ranges[key] || [0, 100];
    if (val < min || val > max) return 'danger';
    if (val < min * 1.1 || val > max * 0.9) return 'warn';
    return 'ok';
  };

  return (
    <div className="page-container animate-slide-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="page-title"><span className="icon">🌿</span> Vườn của tôi</h2>
          <p className="page-description">Quản lý {farms.length} vườn canh tác · Tổng 4.8 ha</p>
        </div>
        <button className="btn btn-primary">＋ Thêm vườn mới</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
        {/* Farm List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {farms.map(farm => (
            <div
              key={farm.id}
              className={`farm-card`}
              style={{ cursor: 'pointer', border: selectedFarm.id === farm.id ? '1px solid var(--color-primary)' : '' }}
              onClick={() => setSelectedFarm(farm)}
            >
              <div className="farm-card-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="farm-card-name">{farm.name}</div>
                    <div className="farm-card-crop">
                      {cropEmoji[farm.cropType] || '🌱'} {farm.cropType}
                    </div>
                  </div>
                  <span className={`badge ${farm.status === 'growing' ? 'badge-green' : 'badge-yellow'}`}>
                    {farm.status === 'growing' ? '● Tốt' : '⚠ Cảnh báo'}
                  </span>
                </div>
              </div>
              <div className="farm-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <div>
                    <span style={{ color: 'var(--text-dimmed)' }}>Diện tích: </span>
                    <strong style={{ color: 'var(--text-primary)' }}>{farm.area} ha</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <HealthRing value={farm.healthScore} size={44} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {farm.iotConnected
                    ? <span className="badge badge-green">📡 IoT On</span>
                    : <span className="badge badge-gray">📡 IoT Off</span>
                  }
                  <span className="badge badge-blue">📍 {farm.location.province}</span>
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-secondary" style={{ marginTop: 4 }}>
            📡 Kết nối thiết bị IoT mới
          </button>
        </div>

        {/* Farm Detail */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>
                  {cropEmoji[selectedFarm.cropType]} {selectedFarm.name}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-dimmed)', marginTop: 4 }}>
                  {selectedFarm.cropType} · {selectedFarm.area} ha · {selectedFarm.soilType}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm">✏️ Chỉnh sửa</button>
                <button className="btn btn-primary btn-sm">📋 Nhật ký</button>
              </div>
            </div>

            <div className="tabs">
              {['overview', 'iot', 'care'].map(t => (
                <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                  {t === 'overview' ? '📊 Tổng quan' : t === 'iot' ? '📡 Cảm biến IoT' : '🌿 Kế hoạch'}
                </button>
              ))}
            </div>

            {tab === 'overview' && (
              <div>
                <div className="grid-4">
                  <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>📅</div>
                    <div style={{ fontSize: 12, color: 'var(--text-dimmed)' }}>Ngày xuống giống</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                      {new Date(selectedFarm.plantDate).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>🌾</div>
                    <div style={{ fontSize: 12, color: 'var(--text-dimmed)' }}>Dự kiến thu hoạch</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                      {new Date(selectedFarm.harvestDate).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>🗺️</div>
                    <div style={{ fontSize: 12, color: 'var(--text-dimmed)' }}>Tọa độ GPS</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                      {selectedFarm.location.lat.toFixed(3)}, {selectedFarm.location.lng.toFixed(3)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>💚</div>
                    <div style={{ fontSize: 12, color: 'var(--text-dimmed)' }}>Sức khỏe cây</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: selectedFarm.healthScore >= 80 ? 'var(--color-success)' : 'var(--color-accent)', marginTop: 2 }}>
                      {selectedFarm.healthScore}%
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dimmed)', marginBottom: 8 }}>Tiến độ sinh trưởng</div>
                  <div className="progress-bar">
                    <div className="progress-fill green" style={{ width: `${Math.min(100, Math.round((new Date() - new Date(selectedFarm.plantDate)) / (new Date(selectedFarm.harvestDate) - new Date(selectedFarm.plantDate)) * 100))}%` }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-dimmed)', marginTop: 4 }}>
                    <span>Xuống giống {new Date(selectedFarm.plantDate).toLocaleDateString('vi-VN')}</span>
                    <span>Thu hoạch {new Date(selectedFarm.harvestDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            )}

            {tab === 'iot' && (
              <div>
                {selectedFarm.iotConnected && sensors ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <span className="live-dot"></span>
                      <span style={{ fontSize: 12, color: 'var(--color-success)' }}>Cập nhật lúc {new Date(sensors.lastUpdated).toLocaleTimeString('vi-VN')}</span>
                    </div>
                    <div className="grid-4" style={{ marginBottom: 20 }}>
                      <SensorCard icon="🌡️" label="Nhiệt độ" value={sensors.temperature} unit="°C" status={getSensorStatus('temperature', sensors.temperature)} />
                      <SensorCard icon="💧" label="Độ ẩm KK" value={sensors.humidity} unit="%" status={getSensorStatus('humidity', sensors.humidity)} />
                      <SensorCard icon="🌍" label="Độ ẩm đất" value={sensors.soilMoisture} unit="%" status={getSensorStatus('soilMoisture', sensors.soilMoisture)} />
                      <SensorCard icon="⚗️" label="pH đất" value={sensors.ph} unit="pH" status={getSensorStatus('ph', sensors.ph)} />
                    </div>
                    <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                      📈 Biểu đồ 7 ngày gần nhất
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart data={sensorHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-dimmed)' }} />
                        <YAxis tick={{ fontSize: 10, fill: 'var(--text-dimmed)' }} />
                        <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 12 }} />
                        <Line type="monotone" dataKey="soilMoisture" stroke="#22c55e" strokeWidth={2} dot={false} name="Độ ẩm đất" />
                        <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} dot={false} name="Nhiệt độ" />
                      </LineChart>
                    </ResponsiveContainer>

                    <div style={{ marginTop: 16, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                        ⚙️ Tự động hóa (Smart Automation)
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 13 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>🚿 Tưới tự động khi độ ẩm đất &lt; 40%</span>
                        <span className="badge badge-green">Đang bật</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>🌡️ Cảnh báo nhiệt độ &gt; 35°C</span>
                        <span className="badge badge-green">Đang bật</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">📡</div>
                    <div className="empty-state-title">Chưa kết nối IoT</div>
                    <div className="empty-state-desc">Vườn này chưa có thiết bị cảm biến. Mua bộ ESP32 AgroKit để theo dõi dữ liệu thời gian thực.</div>
                    <button className="btn btn-primary" style={{ marginTop: 16 }}>🛒 Mua thiết bị IoT</button>
                  </div>
                )}
              </div>
            )}

            {tab === 'care' && (
              <div>
                <div className="alert-banner info" style={{ marginBottom: 16 }}>
                  <span className="alert-icon">🤖</span>
                  <div>
                    <strong>AI khuyến nghị:</strong> Với nhiệt độ hiện tại 27.4°C và độ ẩm 78%, nguy cơ bệnh đạo ôn ở mức thấp. Tiếp tục theo dõi trong 3 ngày tới.
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { icon: '💊', task: 'Phun thuốc phòng ngừa đạo ôn', due: '10/06/2026', status: 'upcoming' },
                    { icon: '🌿', task: 'Bón phân NPK đợt 3', due: '15/06/2026', status: 'upcoming' },
                    { icon: '🔍', task: 'Kiểm tra sâu bệnh định kỳ', due: '08/06/2026', status: 'today' },
                    { icon: '💧', task: 'Điều chỉnh hệ thống tưới', due: '05/06/2026', status: 'done' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: item.status === 'done' ? 'var(--text-dimmed)' : 'var(--text-primary)', textDecoration: item.status === 'done' ? 'line-through' : 'none' }}>{item.task}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-dimmed)' }}>📅 {item.due}</div>
                      </div>
                      <span className={`badge ${item.status === 'done' ? 'badge-gray' : item.status === 'today' ? 'badge-yellow' : 'badge-blue'}`}>
                        {item.status === 'done' ? '✓ Xong' : item.status === 'today' ? '⚡ Hôm nay' : '🗓 Sắp tới'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
