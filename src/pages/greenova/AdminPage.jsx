import {
  AlertTriangle,
  Bell,
  UserCheck,
} from 'lucide-react';
import { statusLabel, Badge } from './pageUtils';

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
          title: 'Admin đã phát cảnh báo dịch tễ',
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
          <h1>Điều phối KYC, escrow và cảnh báo vùng</h1>
          <p>Admin có quyền duyệt hồ sơ, phát cảnh báo và can thiệp tranh chấp.</p>
        </div>
      </div>
      <div className="dashboard-grid">
        <article className="panel large">
          <div className="panel-header"><h3>KYC pipeline</h3><UserCheck size={18} /></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Hồ sơ</th><th>Vai trò</th><th>Risk</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
              <tbody>
                {state.kycRequests.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.role}</td>
                    <td>{item.riskScore}</td>
                    <td><Badge status={item.status === 'Approved' ? 'success' : item.status === 'Rejected' ? 'danger' : 'warning'}>{statusLabel(item.status)}</Badge></td>
                    <td>
                      <button className="small-button" onClick={() => updateKyc(item.id, 'Approved')}>Duyệt</button>
                      <button className="small-button danger" onClick={() => updateKyc(item.id, 'Rejected')}>Từ chối</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
        <article className="panel">
          <div className="panel-header"><h3>Cảnh báo dịch</h3><AlertTriangle size={18} /></div>
          {state.pestAlerts.map((alert) => (
            <div key={alert.id} className="alert-card">
              <Badge status={alert.pushed ? 'success' : 'warning'}>{alert.pushed ? 'Đã gửi' : statusLabel(alert.level)}</Badge>
              <strong>{alert.disease}</strong>
              <p>{alert.reason}</p>
              <button className="primary-button full" onClick={() => pushAlert(alert.id)} disabled={alert.pushed}>
                <Bell size={16} /> Phát cảnh báo
              </button>
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}
