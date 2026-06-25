import { marketPrices } from '../data/mockData';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';

const priceHistory = {
  'Lúa OM18': [
    { date: 'T1', price: 7800 }, { date: 'T2', price: 7950 }, { date: 'T3', price: 8100 },
    { date: 'T4', price: 7900 }, { date: 'T5', price: 8050 }, { date: 'T6', price: 8200 },
  ],
  'Sầu riêng Monthong': [
    { date: 'T1', price: 135000 }, { date: 'T2', price: 140000 }, { date: 'T3', price: 132000 },
    { date: 'T4', price: 128000 }, { date: 'T5', price: 130000 }, { date: 'T6', price: 125000 },
  ],
};

export default function MarketPricesPage() {
  return (
    <div className="page-container animate-slide-in">
      <div className="page-header">
        <h2 className="page-title"><span className="icon">📈</span> Giá thị trường nông sản</h2>
        <p className="page-description">Cập nhật theo thời gian thực · Toàn khu vực Đông Nam Á</p>
      </div>

      {/* Summary Cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { icon: '🌾', label: 'Lúa OM18', value: '8.200₫/kg', change: '+150₫', up: true },
          { icon: '🟡', label: 'Sầu riêng', value: '125.000₫/kg', change: '-5.000₫', up: false },
          { icon: '☕', label: 'Cà phê Robusta', value: '92.000₫/kg', change: '+2.000₫', up: true },
          { icon: '🫑', label: 'Hồ tiêu', value: '145.000₫/kg', change: '+3.000₫', up: true },
        ].map((p, i) => (
          <div key={i} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: p.up ? 'linear-gradient(90deg, var(--color-success), var(--color-primary-light))' : 'linear-gradient(90deg, #dc2626, var(--color-danger))' }}></div>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{p.icon}</div>
            <div style={{ fontSize: 11, color: 'var(--text-dimmed)', marginBottom: 2 }}>{p.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>{p.value}</div>
            <div style={{ fontSize: 13, color: p.up ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 700, marginTop: 4 }}>
              {p.up ? '▲' : '▼'} {p.change} hôm nay
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Rice price chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🌾 Biến động giá Lúa OM18 (6 tháng)</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={priceHistory['Lúa OM18']}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-dimmed)' }} />
              <YAxis domain={[7500, 8500]} tick={{ fontSize: 11, fill: 'var(--text-dimmed)' }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', r: 4 }} name="Giá (₫/kg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Durian price chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🟡 Biến động giá Sầu riêng (6 tháng)</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={priceHistory['Sầu riêng Monthong']}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-dimmed)' }} />
              <YAxis domain={[120000, 145000]} tick={{ fontSize: 11, fill: 'var(--text-dimmed)' }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} name="Giá (₫/kg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Price Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">📋 Bảng giá nông sản toàn quốc</div>
          <span style={{ fontSize: 11, color: 'var(--text-dimmed)' }}>Cập nhật: {new Date().toLocaleString('vi-VN')}</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Nông sản</th>
              <th>Giá hiện tại</th>
              <th>Thay đổi</th>
              <th>Xu hướng</th>
              <th>Khu vực</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {marketPrices.map((p, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.crop}</td>
                <td style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>
                  {p.price.toLocaleString('vi-VN')}₫/{p.unit}
                </td>
                <td className={`price-change ${p.trend}`}>
                  {p.trend === 'up' ? '▲' : p.trend === 'down' ? '▼' : '─'} {Math.abs(p.change).toLocaleString('vi-VN')}₫
                </td>
                <td>
                  <span className={`badge ${p.trend === 'up' ? 'badge-green' : p.trend === 'down' ? 'badge-red' : 'badge-gray'}`}>
                    {p.trend === 'up' ? '↑ Tăng' : p.trend === 'down' ? '↓ Giảm' : '→ Ổn định'}
                  </span>
                </td>
                <td style={{ color: 'var(--text-dimmed)' }}>📍 {p.region}</td>
                <td>
                  <button className="btn btn-secondary btn-sm">📈 Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
