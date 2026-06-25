import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadialBarChart, RadialBar,
} from 'recharts';
import { farms, sensorHistory, marketPrices, revenueData, aiDiagnoses, currentUser, notifications } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '13px' }}>
        <p style={{ color: 'var(--text-dimmed)', marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontWeight: 700 }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({ icon, label, value, change, changeType, iconBg }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="stat-card-icon" style={{ background: iconBg || 'rgba(22,163,74,0.15)' }}>
          {icon}
        </div>
        {change !== undefined && (
          <span className={`stat-card-change ${changeType}`}>
            {changeType === 'positive' ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <div>
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
      </div>
    </div>
  );
}

function HealthRing({ value, size = 80 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (value / 100) * circ;
  const color = value >= 80 ? 'var(--color-success)' : value >= 60 ? 'var(--color-accent)' : 'var(--color-danger)';

  return (
    <div className="health-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth={10} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
      </svg>
      <span className="ring-value" style={{ color, fontSize: size > 70 ? 18 : 13 }}>{value}%</span>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="page-container animate-slide-in">
      {/* Header */}
      <div className="page-header">
        <h2 className="page-title">
          <span className="icon">📊</span>
          Dashboard Nông trại
        </h2>
        <p className="page-description">
          Chào buổi sáng, <strong style={{ color: 'var(--color-primary-light)' }}>{currentUser.name}</strong>! Tất cả hệ thống đang hoạt động tốt.
        </p>
      </div>

      {/* Alerts */}
      <div className="alert-banner critical">
        <span className="alert-icon">🚨</span>
        <div>
          <strong>Cảnh báo dịch rầy nâu cấp độ 3 tại Long An!</strong>
          <p style={{ fontSize: '13px', marginTop: 2 }}>AI phát hiện nguy cơ bùng phát rầy nâu với mật độ &gt;8 con/nhánh. Kiểm tra vườn lúa của bạn ngay hôm nay.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <StatCard icon="🌿" label="Tổng diện tích canh tác" value="4.8 ha" change="0.3 ha" changeType="positive" iconBg="rgba(22,163,74,0.15)" />
        <StatCard icon="💰" label="Doanh thu tháng này" value="18.5M₫" change="12%" changeType="positive" iconBg="rgba(245,158,11,0.15)" />
        <StatCard icon="🤖" label="Sức khỏe cây trung bình" value="78%" change="3%" changeType="negative" iconBg="rgba(59,130,246,0.15)" />
        <StatCard icon="📦" label="Đơn hàng đang xử lý" value="3" iconBg="rgba(249,115,22,0.15)" />
      </div>

      {/* Main Grid */}
      <div className="grid-3" style={{ marginBottom: '24px', gridTemplateColumns: '2fr 1fr' }}>
        {/* Sensor Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <span className="icon">📡</span>
              Biểu đồ cảm biến IoT - Vườn Lúa Số 1
              <span className="live-dot" style={{ marginLeft: 6 }}></span>
            </div>
            <span className="badge badge-green">Real-time</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={sensorHistory} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="moistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-dimmed)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-dimmed)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="temperature" name="Nhiệt độ (°C)" stroke="#ef4444" fill="url(#tempGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="humidity" name="Độ ẩm KK (%)" stroke="#3b82f6" fill="url(#humGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="soilMoisture" name="Độ ẩm đất (%)" stroke="#22c55e" fill="url(#moistGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
            {[{ color: '#ef4444', label: 'Nhiệt độ' }, { color: '#3b82f6', label: 'Độ ẩm KK' }, { color: '#22c55e', label: 'Độ ẩm đất' }].map(l => (
              <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-dimmed)' }}>
                <span style={{ width: 12, height: 2, background: l.color, display: 'inline-block', borderRadius: 2 }}></span>
                {l.label}
              </span>
            ))}
          </div>
        </div>

        {/* Farm Health */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="icon">🌿</span> Sức khoẻ vườn</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {farms.map(farm => (
              <div key={farm.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <HealthRing value={farm.healthScore} size={56} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{farm.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-dimmed)' }}>{farm.cropType} · {farm.area} ha</div>
                  {farm.iotConnected && (
                    <div style={{ fontSize: 10, color: 'var(--color-success)', marginTop: 2 }}>● IoT kết nối</div>
                  )}
                </div>
                <span className={`badge ${farm.status === 'growing' ? 'badge-green' : 'badge-yellow'}`}>
                  {farm.status === 'growing' ? 'Tốt' : 'Cảnh báo'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid-2">
        {/* Market Prices */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="icon">📈</span> Giá thị trường hôm nay</div>
            <span style={{ fontSize: 11, color: 'var(--text-dimmed)' }}>Cập nhật 07:30</span>
          </div>
          {marketPrices.slice(0, 5).map((p, i) => (
            <div key={i} className="price-item">
              <div>
                <div className="price-crop">{p.crop}</div>
                <div className="price-region">{p.region}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="price-value">{p.price.toLocaleString('vi-VN')}₫/{p.unit}</div>
                <div className={`price-change ${p.trend}`}>
                  {p.trend === 'up' ? '▲' : p.trend === 'down' ? '▼' : '─'}{' '}
                  {Math.abs(p.change).toLocaleString('vi-VN')}₫
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent AI Diagnoses */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="icon">🤖</span> Chẩn đoán AI gần đây</div>
            <span className="badge badge-blue">AgriVision v2.3</span>
          </div>
          {aiDiagnoses.map(d => (
            <div key={d.id} className="diagnosis-card" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{d.disease}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-dimmed)', fontStyle: 'italic' }}>{d.scientificName}</div>
                </div>
                <span className={`diagnosis-severity ${d.severity}`}>
                  {d.severity === 'low' ? '🟢 Thấp' : d.severity === 'medium' ? '🟡 Vừa' : '🔴 Cao'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-dimmed)' }}>
                <span>🎯 Độ chính xác: <strong style={{ color: 'var(--color-info)' }}>{d.confidence}%</strong></span>
                <span>💚 Sức khỏe: <strong style={{ color: d.healthPercentage >= 80 ? 'var(--color-success)' : 'var(--color-accent)' }}>{d.healthPercentage}%</strong></span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
                📅 {new Date(d.date).toLocaleDateString('vi-VN')} · Vườn #{d.farmId.slice(-1)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
