import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { revenueData, diseaseHeatmap, users } from '../data/mockData';
import { ShieldAlert, TrendingUp, Users, DollarSign, Activity, AlertTriangle, ShieldCheck, MapPin, Store, Server, QrCode } from 'lucide-react';

const PIE_COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444'];

export default function AdminPage() {
  return (
    <div className="page-container animate-slide-in">
      <div className="page-header">
        <h2 className="page-title"><ShieldAlert size={28} style={{ color: 'var(--color-danger)' }} /> Admin Dashboard</h2>
        <p className="page-description">Quản trị toàn hệ thống • Bản đồ nhiệt dịch bệnh • Báo cáo doanh thu</p>
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { icon: <Users size={24} />, label: 'Người dùng hoạt động', value: '12.847', change: '+320 tuần này', color: '#3b82f6' },
          { icon: <DollarSign size={24} />, label: 'Doanh thu tháng 6', value: '135M₫', change: '+20.5%', color: '#16a34a' },
          { icon: <TrendingUp size={24} />, label: 'Giao dịch thành công', value: '4.290', change: '+15%', color: '#f59e0b' },
          { icon: <AlertTriangle size={24} />, label: 'Tranh chấp cần xử lý', value: '7', change: '-3 so với tuần trước', color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.color }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ padding: 12, borderRadius: 12, background: \\15\, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-dimmed)', fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}</div>
              </div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: s.color, fontWeight: 600, background: \\10\, padding: '4px 10px', borderRadius: 999 }}>
              <TrendingUp size={14} /> {s.change}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Revenue Chart */}
        <div className="glass-card">
          <div className="card-header" style={{ padding: 24, paddingBottom: 0, border: 'none' }}>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Activity size={20} style={{ color: 'var(--color-success)' }} /> Doanh thu theo nguồn (triệu ₫)</div>
            <span className="badge badge-green">6 tháng đầu 2026</span>
          </div>
          <div style={{ padding: '0 24px 24px 24px' }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--slate-500)' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--slate-500)' }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, fontSize: 13, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="marketplace" name="Sàn TMĐT" fill="#16a34a" stackId="a" radius={[0,0,0,0]} barSize={32} />
                <Bar dataKey="saas" name="SaaS" fill="#3b82f6" stackId="a" />
                <Bar dataKey="traceability" name="Truy xuất QR" fill="#f59e0b" stackId="a" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="card-title" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><DollarSign size={20} style={{ color: '#3b82f6' }} /> Phân bổ doanh thu T6</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={[
                { name: 'Sàn TMĐT', value: 89 },
                { name: 'SaaS Premium', value: 28 },
                { name: 'Tem QR', value: 18 },
              ]} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                {[0, 1, 2].map(i => <Cell key={i} fill={PIE_COLORS[i]} stroke="transparent" />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, fontSize: 13, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            {[
              { icon: <Store size={14} />, label: 'Sàn TMĐT (chiết khấu 3-7%)', value: '89M₫', color: PIE_COLORS[0] },
              { icon: <Server size={14} />, label: 'Gói SaaS Premium', value: '28M₫', color: PIE_COLORS[1] },
              { icon: <QrCode size={14} />, label: 'Tem QR truy xuất', value: '18M₫', color: PIE_COLORS[2] },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--slate-600)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 6, background: \\15\, color: r.color }}>
                    {r.icon}
                  </div>
                  {r.label}
                </span>
                <strong style={{ color: 'var(--slate-800)' }}>{r.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disease Heatmap */}
      <div className="glass-card" style={{ marginBottom: 24, padding: 24 }}>
        <div className="card-header" style={{ padding: 0, border: 'none', marginBottom: 20 }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={20} style={{ color: 'var(--color-danger)' }} /> Bản đồ nhiệt dịch bệnh (ĐBSCL)</div>
          <span className="badge badge-red">5 điểm nóng</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {diseaseHeatmap.map((d, i) => {
            const isCritical = d.severity >= 8;
            const isWarning = d.severity >= 6 && d.severity < 8;
            const isCaution = d.severity >= 4 && d.severity < 6;
            
            const color = isCritical ? '239,68,68' : isWarning ? '249,115,22' : isCaution ? '245,158,11' : '34,197,94';
            const badgeColor = isCritical ? 'red' : isWarning ? 'orange' : isCaution ? 'yellow' : 'green';

            return (
              <div key={i} style={{
                background: \gba(\, 0.05)\,
                border: \1px solid rgba(\, 0.2)\,
                borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                transition: 'transform 0.2s', cursor: 'pointer'
              }} className="hover-scale">
                <div style={{ 
                  width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: \gba(\, 0.1)\, color: \gb(\)\, marginBottom: 12
                }}>
                  <AlertTriangle size={28} />
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: \gb(\)\, lineHeight: 1, marginBottom: 8 }}>
                  {d.severity}/10
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-800)' }}>{d.region}</div>
                <div style={{ fontSize: 13, color: 'var(--slate-600)', marginTop: 4, marginBottom: 8, flex: 1 }}>{d.disease}</div>
                <span className={\adge badge-\\} style={{ fontSize: 11 }}>{d.cases} ca báo cáo</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Users & KYC */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="card-title" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><ShieldCheck size={20} style={{ color: 'var(--color-success)' }} /> Quản lý người dùng & KYC</div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', minWidth: 500 }}>
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
                    <td style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{u.name}</td>
                    <td>
                      <span className={\adge \\} style={{ fontSize: 11 }}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div className="progress-bar" style={{ height: 6, borderRadius: 999, background: 'var(--slate-100)' }}>
                            <div className="progress-fill" style={{ width: \\%\, background: 'var(--color-success)', borderRadius: 999 }}></div>
                          </div>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-success)', minWidth: 24 }}>{u.trustScore}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-green" style={{ fontSize: 11 }}>Đã xác minh</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <div className="card-title" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><Activity size={20} style={{ color: '#3b82f6' }} /> Hoạt động gần đây</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: <TrendingUp size={16} />, action: 'Giao dịch thành công', detail: 'Nguyễn Văn An mua NPK 20-20-15', time: '2 phút trước', color: 'var(--color-success)', bg: 'rgba(22, 163, 74, 0.1)' },
              { icon: <AlertTriangle size={16} />, action: 'Tranh chấp mới', detail: 'Trần Thị Bích: "Hàng không đúng chất lượng"', time: '15 phút trước', color: 'var(--color-danger)', bg: 'rgba(239, 68, 68, 0.1)' },
              { icon: <ShieldCheck size={16} />, action: 'Đăng ký KYC mới', detail: 'Công ty TNHH Nông Dược Phương Nam', time: '1 giờ trước', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
              { icon: <AlertTriangle size={16} />, action: 'Cảnh báo dịch bệnh', detail: 'AI phát hiện rầy nâu Long An', time: '2 giờ trước', color: 'var(--color-warning)', bg: 'rgba(249, 115, 22, 0.1)' },
              { icon: <QrCode size={16} />, action: 'QR tem phát hành', detail: 'Lô hàng sầu riêng 3 tấn ở Đồng Tháp', time: '3 giờ trước', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, background: a.bg, color: a.color, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-800)' }}>{a.action}</div>
                  <div style={{ fontSize: 13, color: 'var(--slate-500)' }}>{a.detail}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--slate-400)', flexShrink: 0, fontWeight: 500 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
