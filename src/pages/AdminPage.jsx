import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { revenueData, diseaseHeatmap, users } from '../data/mockData';

const PIE_COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444'];

export default function AdminPage() {
  return (
    <div className="page-container animate-slide-in">
      <div className="page-header">
        <h2 className="page-title"><span className="icon">🗺️</span> Admin Dashboard</h2>
        <p className="page-description">Quản trị toàn hệ thống · Bản đồ nhiệt dịch bệnh · Báo cáo doanh thu</p>
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { icon: '👥', label: 'Người dùng hoạt động', value: '12.847', change: '+320 tuần này', up: true, color: '#3b82f6' },
          { icon: '💰', label: 'Doanh thu tháng 6', value: '135M₫', change: '+20.5%', up: true, color: '#16a34a' },
          { icon: '🛒', label: 'Giao dịch thành công', value: '4.290', change: '+15%', up: true, color: '#f59e0b' },
          { icon: '🚨', label: 'Tranh chấp cần xử lý', value: '7', change: '-3 so với tuần trước', up: true, color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: s.color }}></div>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-dimmed)', marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: s.color, fontWeight: 600, marginTop: 4 }}>{s.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Revenue Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">💰 Doanh thu theo nguồn (triệu ₫)</div>
            <span className="badge badge-green">6 tháng đầu 2026</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-dimmed)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-dimmed)' }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="marketplace" name="Sàn TMĐT" fill="#16a34a" stackId="a" radius={[0,0,0,0]} />
              <Bar dataKey="saas" name="SaaS" fill="#3b82f6" stackId="a" />
              <Bar dataKey="traceability" name="Truy xuất QR" fill="#f59e0b" stackId="a" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Breakdown */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>📊 Phân bổ doanh thu T6</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={[
                { name: 'Sàn TMĐT', value: 89 },
                { name: 'SaaS Premium', value: 28 },
                { name: 'Tem QR', value: 18 },
              ]} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${Math.round(percent * 100)}%`} labelLine={false}>
                {[0, 1, 2].map(i => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {[
              { label: 'Sàn TMĐT (chiết khấu 3-7%)', value: '89M₫', color: PIE_COLORS[0] },
              { label: 'Gói SaaS Premium', value: '28M₫', color: PIE_COLORS[1] },
              { label: 'Tem QR truy xuất', value: '18M₫', color: PIE_COLORS[2] },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: r.color, display: 'inline-block' }}></span>
                  {r.label}
                </span>
                <strong style={{ color: r.color }}>{r.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disease Heatmap */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">🗺️ Bản đồ nhiệt dịch bệnh (ĐBSCL)</div>
          <span className="badge badge-red">5 điểm nóng</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {diseaseHeatmap.map((d, i) => (
            <div key={i} style={{
              background: `rgba(${d.severity >= 8 ? '239,68,68' : d.severity >= 6 ? '249,115,22' : d.severity >= 4 ? '245,158,11' : '22,163,74'},${0.1 + d.severity * 0.05})`,
              border: `1px solid rgba(${d.severity >= 8 ? '239,68,68' : d.severity >= 6 ? '249,115,22' : d.severity >= 4 ? '245,158,11' : '22,163,74'},0.3)`,
              borderRadius: 'var(--radius-md)', padding: 14, textAlign: 'center'
            }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: d.severity >= 8 ? 'var(--color-danger)' : d.severity >= 6 ? 'var(--color-warning)' : d.severity >= 4 ? 'var(--color-accent)' : 'var(--color-success)' }}>
                {d.severity}/10
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{d.region}</div>
              <div style={{ fontSize: 11, color: 'var(--text-dimmed)', marginTop: 2 }}>{d.disease}</div>
              <div style={{ fontSize: 10, color: 'var(--text-dimmed)' }}>{d.cases} ca</div>
            </div>
          ))}
        </div>
      </div>

      {/* Users & KYC */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>👤 Quản lý người dùng & KYC</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Vai trò</th>
                <th>Trust Score</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</td>
                  <td>
                    <span className={`badge ${u.role === 'farmer' ? 'badge-green' : u.role === 'distributor' ? 'badge-blue' : u.role === 'expert' ? 'badge-yellow' : 'badge-orange'}`} style={{ fontSize: 10 }}>
                      {u.role === 'farmer' ? '🌾' : u.role === 'distributor' ? '🏭' : u.role === 'expert' ? '🎓' : '⚙️'} {u.role}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div className="progress-bar" style={{ height: 4 }}>
                          <div className="progress-fill green" style={{ width: `${u.trustScore}%` }}></div>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent)' }}>{u.trustScore}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-green" style={{ fontSize: 10 }}>✅ KYC xong</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>⚡ Hoạt động gần đây</div>
          {[
            { icon: '🛒', action: 'Giao dịch thành công', detail: 'Nguyễn Văn An mua NPK 20-20-15 · 2 bao', time: '2 phút trước', color: 'var(--color-success)' },
            { icon: '🚨', action: 'Tranh chấp mới', detail: 'Trần Thị Bích: "Hàng không đúng chất lượng"', time: '15 phút trước', color: 'var(--color-danger)' },
            { icon: '✅', action: 'Đăng ký KYC mới', detail: 'Công ty TNHH Nông Dược Phương Nam', time: '1 giờ trước', color: 'var(--color-info)' },
            { icon: '📡', action: 'Cảnh báo dịch bệnh', detail: 'AI phát hiện bùng phát rầy nâu Long An', time: '2 giờ trước', color: 'var(--color-warning)' },
            { icon: '🏷️', action: 'QR tem phát hành', detail: 'Lô hàng sầu riêng 3 tấn · Đồng Tháp', time: '3 giờ trước', color: 'var(--color-accent)' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ width: 36, height: 36, background: `${a.color}15`, border: `1px solid ${a.color}33`, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{a.action}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dimmed)' }}>{a.detail}</div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-dimmed)', flexShrink: 0 }}>{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
