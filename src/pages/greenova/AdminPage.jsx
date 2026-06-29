import {
  AlertTriangle,
  Bell,
  UserCheck,
  ShieldAlert,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ShieldCheck,
  MapPin,
  Store,
  Server,
  QrCode
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { statusLabel, Badge } from './pageUtils';
import { revenueData, diseaseHeatmap } from '../../data/mockData';

const PIE_COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444'];

export function AdminPage({ state, setState, notify }) {
  const updateKyc = (id, status) => {
    setState((prev) => ({
      ...prev,
      kycRequests: prev.kycRequests.map((item) => (item.id === id ? { ...item, status } : item)),
    }));
    notify(`Đã cập nhật KYC sang trạng thái ${statusLabel(status)}.`);
  };

  const pushAlert = (id) => {
    setState((prev) => ({
      ...prev,
      pestAlerts: prev.pestAlerts.map((item) => (item.id === id ? { ...item, pushed: true } : item)),
      notifications: [
        {
          id: `NOTI-${Date.now()}`,
          type: 'PestAlert',
          title: 'Admin đã phát cảnh báo dịch tễ.',
          message: 'Cảnh báo nguy cơ nấm lá đã được gửi tới nông dân trồng chanh không hạt.',
          unread: true,
        },
        ...prev.notifications,
      ],
    }));
    notify('Đã phát cảnh báo dịch tễ tới người dùng liên quan.');
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Admin Orchestrator</p>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShieldAlert size={36} className="text-red-500" />
            Điều phối toàn hệ thống
          </h1>
          <p>Quản trị người dùng, doanh thu nền tảng, xét duyệt hồ sơ KYC, và phát lệnh cảnh báo dịch bệnh.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="stats-grid">
        {[
          { icon: <Users size={24} />, label: 'Người dùng active', value: '12.847', change: '+320 tuần này', color: '#3b82f6' },
          { icon: <DollarSign size={24} />, label: 'Doanh thu tháng 6', value: '135M₫', change: '+20.5%', color: '#16a34a' },
          { icon: <TrendingUp size={24} />, label: 'Giao dịch Escrow', value: '4.290', change: '+15%', color: '#f59e0b' },
          { icon: <AlertTriangle size={24} />, label: 'Tranh chấp cần xử lý', value: '7', change: '-3 so với tuần trước', color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} className="panel" style={{ padding: 24, position: 'relative', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.color }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ padding: 12, borderRadius: 12, background: `${s.color}15`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--slate-500)', fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--slate-800)', lineHeight: 1, marginTop: 4 }}>{s.value}</div>
              </div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: s.color, fontWeight: 600, background: `${s.color}10`, padding: '4px 10px', borderRadius: 999 }}>
              <TrendingUp size={14} /> {s.change}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Revenue Chart */}
        <div className="panel">
          <div className="panel-header" style={{ paddingBottom: 0, border: 'none' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Activity size={18} className="text-green-600" /> Doanh thu theo nguồn (triệu ₫)</h3>
            <span className="badge badge-green">6 tháng đầu 2026</span>
          </div>
          <div style={{ padding: '0 20px 20px 20px', marginTop: 24 }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--slate-500)' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--slate-500)' }} axisLine={false} tickLine={false} dx={-10} />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, fontSize: 13, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="marketplace" name="Sàn TMĐT" fill="#16a34a" stackId="a" radius={[0,0,0,0]} barSize={32} />
                <Bar dataKey="saas" name="SaaS" fill="#3b82f6" stackId="a" />
                <Bar dataKey="traceability" name="Truy xuất QR" fill="#f59e0b" stackId="a" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="panel">
          <div className="panel-header" style={{ border: 'none' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><DollarSign size={18} className="text-blue-500" /> Phân bổ doanh thu</h3>
          </div>
          <div style={{ padding: '0 20px 20px 20px' }}>
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={[
                  { name: 'Sàn TMĐT', value: 89 },
                  { name: 'SaaS Premium', value: 28 },
                  { name: 'Tem QR', value: 18 },
                ]} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={5} dataKey="value">
                  {[0, 1, 2].map(i => <Cell key={i} fill={PIE_COLORS[i]} stroke="transparent" />)}
                </Pie>
                <RechartsTooltip contentStyle={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, fontSize: 13, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} />
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 6, background: `${r.color}15`, color: r.color }}>
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
      </div>

      <div className="dashboard-grid" style={{ marginTop: 24 }}>
        <article className="panel large">
          <div className="panel-header"><h3><UserCheck size={18} className="text-green-600" style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} /> Quản lý KYC & Hồ sơ</h3></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Hồ sơ đăng ký</th><th>Vai trò</th><th>Risk Score</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
              <tbody>
                {state.kycRequests.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{item.name}</td>
                    <td>
                      <span className={`badge ${item.role === 'farmer' ? 'badge-green' : item.role === 'distributor' ? 'badge-blue' : item.role === 'expert' ? 'badge-yellow' : 'badge-orange'}`}>
                        {item.role}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ flex: 1, minWidth: 60 }}>
                          <div className="progress-bar" style={{ height: 6, borderRadius: 999, background: 'var(--slate-100)' }}>
                            <div className="progress-fill" style={{ width: `${item.riskScore}%`, background: item.riskScore > 50 ? 'var(--color-danger)' : 'var(--color-success)', borderRadius: 999 }}></div>
                          </div>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: item.riskScore > 50 ? 'var(--color-danger)' : 'var(--color-success)', minWidth: 24 }}>{item.riskScore}</span>
                      </div>
                    </td>
                    <td><Badge status={item.status === 'Approved' ? 'success' : item.status === 'Rejected' ? 'danger' : 'warning'}>{statusLabel(item.status)}</Badge></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="small-button" onClick={() => updateKyc(item.id, 'Approved')}>Duyệt</button>
                        <button className="small-button danger" onClick={() => updateKyc(item.id, 'Rejected')}>Từ chối</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
        
        <article className="panel">
          <div className="panel-header"><h3><Bell size={18} className="text-red-500" style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} /> Cảnh báo dịch tễ</h3></div>
          <div style={{ padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {state.pestAlerts.map((alert) => (
              <div key={alert.id} className="alert-card" style={{ background: alert.pushed ? 'var(--slate-50)' : 'rgba(239, 68, 68, 0.05)', border: `1px solid ${alert.pushed ? 'var(--line)' : 'rgba(239, 68, 68, 0.2)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Badge status={alert.pushed ? 'success' : 'warning'}>{alert.pushed ? 'Đã gửi' : statusLabel(alert.level)}</Badge>
                  {!alert.pushed && <AlertTriangle size={16} className="text-red-500" />}
                </div>
                <strong style={{ fontSize: 15, display: 'block', marginBottom: 6 }}>{alert.disease}</strong>
                <p style={{ color: 'var(--slate-600)', fontSize: 13, marginBottom: 12 }}>{alert.reason}</p>
                <button className="primary-button full" onClick={() => pushAlert(alert.id)} disabled={alert.pushed} style={{ background: alert.pushed ? 'var(--slate-200)' : 'var(--color-primary)' }}>
                  <Bell size={16} /> Phát cảnh báo khẩn
                </button>
              </div>
            ))}
          </div>
        </article>
      </div>
      
      {/* Disease Heatmap */}
      <div className="panel" style={{ marginTop: 24, padding: 24 }}>
        <div className="panel-header" style={{ padding: 0, border: 'none', marginBottom: 20 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={18} className="text-red-500" /> Bản đồ nhiệt khu vực ĐBSCL</h3>
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
                background: `rgba(${color}, 0.05)`,
                border: `1px solid rgba(${color}, 0.2)`,
                borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                transition: 'transform 0.2s', cursor: 'pointer'
              }} className="hover-scale">
                <div style={{ 
                  width: 50, height: 50, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `rgba(${color}, 0.1)`, color: `rgb(${color})`, marginBottom: 12
                }}>
                  <AlertTriangle size={24} />
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: `rgb(${color})`, lineHeight: 1, marginBottom: 8 }}>
                  {d.severity}/10
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-800)' }}>{d.region}</div>
                <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 4, marginBottom: 12, flex: 1 }}>{d.disease}</div>
                <span className={`badge badge-${badgeColor}`} style={{ fontSize: 11 }}>{d.cases} ca báo cáo</span>
              </div>
            );
          })}
        </div>
      </div>
      
    </section>
  );
}
