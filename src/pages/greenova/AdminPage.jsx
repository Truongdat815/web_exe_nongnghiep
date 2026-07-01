import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  CircleDollarSign,
  MapPin,
  Radar,
  Server,
  ShieldAlert,
  Store,
  TrendingUp,
  UserCheck,
  Users,
  WalletCards,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { diseaseHeatmap, revenueData } from '../../data/mockData';
import { Badge, statusLabel } from './pageUtils';

const PIE_COLORS = ['#15803d', '#0f766e', '#d97706'];

export function AdminPage({ state, setState, notify }) {
  const pendingKyc = state.kycRequests.filter((item) => item.status === 'Pending').length;
  const approvedKyc = state.kycRequests.filter((item) => item.status === 'Approved').length;
  const openDisputes = state.orders.filter((item) => item.status === 'Disputed').length;
  const openSos = state.sosTickets.filter((item) => item.status === 'Open').length;
  const activeAlerts = state.pestAlerts.filter((item) => !item.pushed).length;
  const unreadNotifications = state.notifications.filter((item) => item.unread).length;
  const escrowValue = state.orders.reduce((sum, order) => sum + (order.total || 0), 0);

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
          title: 'Admin đã phát cảnh báo dịch tễ',
          message: 'Cảnh báo nguy cơ nấm lá đã được gửi tới nông dân trồng chanh không hạt.',
          unread: true,
        },
        ...prev.notifications,
      ],
    }));
    notify('Đã phát cảnh báo dịch tễ tới người dùng liên quan.');
  };

  const kpis = [
    {
      icon: Users,
      label: 'Tài khoản đã duyệt',
      value: approvedKyc,
      note: `${pendingKyc} hồ sơ chờ duyệt`,
      tone: 'blue',
    },
    {
      icon: WalletCards,
      label: 'Escrow đang quản lý',
      value: `${Math.round(escrowValue / 1_000_000)}M`,
      note: `${state.orders.length} giao dịch`,
      tone: 'green',
    },
    {
      icon: ShieldAlert,
      label: 'Tranh chấp mở',
      value: openDisputes,
      note: 'Cần kiểm tra chứng từ',
      tone: 'red',
    },
    {
      icon: Radar,
      label: 'Tín hiệu rủi ro',
      value: activeAlerts + openSos,
      note: `${activeAlerts} cảnh báo, ${openSos} SOS`,
      tone: 'amber',
    },
  ];

  const revenueMix = [
    { name: 'Sàn vật tư', value: 89 },
    { name: 'Gói SaaS', value: 28 },
    { name: 'QR passport', value: 18 },
  ];

  return (
    <section className="admin-command page-grid">
      <header className="admin-command-hero">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Điều phối hệ thống</h1>
          <p>KYC, escrow, cảnh báo dịch tễ và vận hành vùng Bến Lức.</p>
        </div>
        <div className="admin-hero-status">
          <span><CheckCircle2 size={16} /> Online</span>
          <strong>{unreadNotifications}</strong>
          <small>thông báo mới</small>
        </div>
      </header>

      <div className="admin-kpi-grid">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className={`admin-kpi-card tone-${item.tone}`}>
              <div className="admin-kpi-icon"><Icon size={20} /></div>
              <div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.note}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="admin-analytics-grid">
        <article className="admin-panel revenue-panel">
          <div className="admin-panel-header">
            <div>
              <span>Tài chính</span>
              <h3>Doanh thu theo nguồn</h3>
            </div>
            <Badge status="success">6 tháng 2026</Badge>
          </div>
          <div className="admin-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 12, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(21, 128, 61, 0.06)' }}
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    color: '#0f172a',
                    boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)',
                  }}
                />
                <Bar dataKey="marketplace" name="Sàn vật tư" stackId="a" fill="#15803d" radius={[0, 0, 0, 0]} />
                <Bar dataKey="saas" name="SaaS" stackId="a" fill="#0f766e" />
                <Bar dataKey="traceability" name="QR passport" stackId="a" fill="#d97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span>Cơ cấu</span>
              <h3>Nguồn thu</h3>
            </div>
            <CircleDollarSign size={20} />
          </div>
          <div className="admin-pie-wrap">
            <ResponsiveContainer width="100%" height={172}>
              <PieChart>
                <Pie data={revenueMix} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value">
                  {revenueMix.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index]} stroke="transparent" />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    color: '#0f172a',
                    boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="admin-mix-list">
              {revenueMix.map((item, index) => (
                <div key={item.name}>
                  <span style={{ background: PIE_COLORS[index] }} />
                  <p>{item.name}</p>
                  <strong>{item.value}M</strong>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>

      <div className="admin-work-grid">
        <article className="admin-panel kyc-panel">
          <div className="admin-panel-header">
            <div>
              <span>Kiểm duyệt</span>
              <h3>KYC người dùng</h3>
            </div>
            <UserCheck size={20} />
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Hồ sơ</th>
                  <th>Vai trò</th>
                  <th>Risk</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {state.kycRequests.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                      <small>ID: {item.id}</small>
                    </td>
                    <td><span className="admin-role-chip">{item.role}</span></td>
                    <td>
                      <div className="admin-risk-meter">
                        <i style={{ width: `${item.riskScore}%` }} />
                        <span>{item.riskScore}</span>
                      </div>
                    </td>
                    <td>
                      <Badge status={item.status === 'Approved' ? 'success' : item.status === 'Rejected' ? 'danger' : 'warning'}>
                        {statusLabel(item.status)}
                      </Badge>
                    </td>
                    <td>
                      <div className="admin-action-row">
                        <button onClick={() => updateKyc(item.id, 'Approved')}>Duyệt</button>
                        <button className="danger" onClick={() => updateKyc(item.id, 'Rejected')}>Từ chối</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel alert-panel">
          <div className="admin-panel-header">
            <div>
              <span>Dịch tễ</span>
              <h3>Cảnh báo vùng</h3>
            </div>
            <Bell size={20} />
          </div>
          <div className="admin-alert-list">
            {state.pestAlerts.map((alert) => (
              <div key={alert.id} className={alert.pushed ? 'admin-alert-card pushed' : 'admin-alert-card'}>
                <div className="admin-alert-top">
                  <Badge status={alert.pushed ? 'success' : 'warning'}>
                    {alert.pushed ? 'Đã gửi' : statusLabel(alert.level)}
                  </Badge>
                  {!alert.pushed && <AlertTriangle size={17} />}
                </div>
                <strong>{alert.disease}</strong>
                <p>{alert.reason}</p>
                <button onClick={() => pushAlert(alert.id)} disabled={alert.pushed}>
                  <Bell size={15} /> Phát cảnh báo
                </button>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="admin-panel heatmap-panel">
        <div className="admin-panel-header">
          <div>
            <span>Giám sát</span>
            <h3>Bản đồ nhiệt ĐBSCL</h3>
          </div>
          <MapPin size={20} />
        </div>
        <div className="admin-heatmap-grid">
          {diseaseHeatmap.map((item) => {
            const level = item.severity >= 8 ? 'critical' : item.severity >= 6 ? 'warning' : item.severity >= 4 ? 'watch' : 'stable';
            return (
              <div key={item.region} className={`admin-heatmap-card ${level}`}>
                <div>
                  <span>{item.region}</span>
                  <strong>{item.severity}/10</strong>
                </div>
                <p>{item.disease}</p>
                <small>{item.cases} ca báo cáo</small>
              </div>
            );
          })}
        </div>
      </article>

      <div className="admin-ops-strip">
        <span><Server size={16} /> API demo ổn định</span>
        <span><Store size={16} /> Marketplace active</span>
        <span><TrendingUp size={16} /> SLA 99.8%</span>
      </div>
    </section>
  );
}
