import {
  Activity,
  AlertTriangle,
  Bot,
  Droplets,
  Leaf,
  NotebookTabs,
  QrCode,
  ShoppingCart,
  Store,
  Thermometer,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, statusLabel } from './pageUtils';

export function FarmerOverviewPage({ state, role, setState, notify }) {
  const farm = state.farms[0];
  const devices = state.devices || [];
  const primaryDevice = devices.find((device) => device.farmId === farm.id) || devices[0];
  const onlineDevices = devices.filter((device) => device.status === 'Online').length;
  const openSos = (state.sosTickets || []).filter((ticket) => ticket.status === 'Open').length;
  const activeOrders = (state.orders || []).filter((order) => order.status !== 'Released').length;
  const latestLedger = (state.ledgers || [])[0];

  const runQuickScan = () => {
    setState((prev) => ({
      ...prev,
      notifications: [
        {
          id: `NOTI-${Date.now()}`,
          type: 'IoT',
          title: 'Đã quét nhanh vườn',
          message: `${onlineDevices}/${devices.length} trạm online. Độ ẩm đất hiện tại ${primaryDevice?.telemetry.soilMoisture || 0}%.`,
          unread: true,
        },
        ...prev.notifications,
      ],
    }));
    notify('Đã quét nhanh IoT và tạo thông báo demo.');
  };

  const shortcuts = [
    { to: `/${role}/feed`, icon: Leaf, label: 'Bảng tin', note: 'Hỏi cộng đồng' },
    { to: `/${role}/ai`, icon: Bot, label: 'Chat AI', note: 'Chẩn đoán bệnh' },
    { to: `/${role}/market`, icon: ShoppingCart, label: 'Mua vật tư', note: 'Escrow vật tư' },
    { to: `/${role}/produce`, icon: Store, label: 'Bán nông sản', note: 'Đăng lô hàng' },
    { to: `/${role}/ledger`, icon: NotebookTabs, label: 'Nhật ký', note: 'QR từng vườn' },
  ];

  return (
    <section className="farmer-home page-grid">
      <header className="farmer-hero">
        <div>
          <p className="eyebrow">Nông dân</p>
          <h1>{farm.name}</h1>
          <p>{farm.crop} · {farm.area} ha · {farm.district}, Long An</p>
        </div>
        <button onClick={runQuickScan}>
          <Activity size={17} /> Quét vườn
        </button>
      </header>

      <div className="farmer-today-grid">
        <FarmerMetric icon={Leaf} label="Sức khỏe vườn" value={`${farm.healthScore}%`} note={farm.crop} />
        <FarmerMetric icon={Droplets} label="Độ ẩm đất" value={`${primaryDevice?.telemetry.soilMoisture || 0}%`} note={primaryDevice?.zone || 'Trạm chính'} />
        <FarmerMetric icon={Thermometer} label="Nhiệt độ" value={`${primaryDevice?.telemetry.ambientTemp || 0}°C`} note={`${onlineDevices}/${devices.length} trạm online`} />
        <FarmerMetric icon={AlertTriangle} label="Cần chú ý" value={openSos + activeOrders} note={`${openSos} SOS · ${activeOrders} đơn`} tone="amber" />
      </div>

      <div className="farmer-action-grid">
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} className="farmer-shortcut">
              <div><Icon size={20} /></div>
              <strong>{item.label}</strong>
              <span>{item.note}</span>
            </Link>
          );
        })}
      </div>

      <div className="farmer-dashboard-grid">
        <article className="farmer-panel">
          <div className="farmer-panel-head">
            <div>
              <span>IoT</span>
              <h2>Trạm theo mảnh đất</h2>
            </div>
            <Badge status="success">{onlineDevices} online</Badge>
          </div>
          <div className="farmer-device-list">
            {devices.map((device) => (
              <div key={device.id} className="farmer-device-row">
                <div>
                  <strong>{device.name}</strong>
                  <span>{device.zone}</span>
                </div>
                <div>
                  <b>{device.telemetry.soilMoisture}%</b>
                  <small>{statusLabel(device.status)}</small>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="farmer-panel">
          <div className="farmer-panel-head">
            <div>
              <span>Nhật ký</span>
              <h2>QR canh tác</h2>
            </div>
            <QrCode size={20} />
          </div>
          <div className="farmer-ledger-card">
            <QrCode size={92} />
            <div>
              <strong>GREENOVA-PASS-{farm.id.toUpperCase()}</strong>
              <p>{latestLedger?.title || 'Chưa có ledger'}</p>
              <Link to={`/${role}/ledger`}>Xem nhật ký</Link>
            </div>
          </div>
        </article>

        <article className="farmer-panel">
          <div className="farmer-panel-head">
            <div>
              <span>Cảnh báo</span>
              <h2>Dịch tễ vùng</h2>
            </div>
            <AlertTriangle size={20} />
          </div>
          {(state.pestAlerts || []).map((alert) => (
            <div key={alert.id} className="farmer-alert-row">
              <Badge status="warning">{statusLabel(alert.level)}</Badge>
              <strong>{alert.disease}</strong>
              <p>{alert.reason}</p>
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}

function FarmerMetric({ icon: Icon, label, value, note, tone = 'green' }) {
  return (
    <article className={`farmer-metric tone-${tone}`}>
      <div><Icon size={19} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}
