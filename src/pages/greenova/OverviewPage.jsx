import {
  Activity,
  AlertTriangle,
  Leaf,
  LockKeyhole,
  Package,
  Thermometer,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { currency, statusLabel, kitCost, clampNumber, addLedgerEntry, StatCard, Badge } from './pageUtils';

export function OverviewPage({ state, setState, role }) {
  const farm = state.farms[0];
  const farmById = new Map(state.farms.map((item) => [item.id, item]));
  const devices = state.devices.map((item) => ({
    ...item,
    farm: farmById.get(item.farmId) || farm,
  }));
  const primaryDevice = devices.find((item) => item.id === farm.deviceId) || devices[0];
  const onlineDevices = devices.filter((item) => item.status === 'Online').length;
  const avgMoisture = Math.round(devices.reduce((sum, item) => sum + item.telemetry.soilMoisture, 0) / Math.max(devices.length, 1));
  const avgTemp = (devices.reduce((sum, item) => sum + item.telemetry.ambientTemp, 0) / Math.max(devices.length, 1)).toFixed(1);
  const kitById = new Map((state.iotKits || []).map((kit) => [kit.id, kit]));
  const kitSummaries = (state.iotKits || []).map((kit) => {
    const cost = kitCost(kit, state.hardwareParts || []);
    return { ...kit, cost, margin: kit.salePrice - cost };
  });
  const openDisputes = state.orders.filter((item) => item.status === 'Disputed').length;
  const openSos = state.sosTickets.filter((item) => item.status === 'Open').length;

  const runTelemetry = () => {
    setState((prev) => {
      const nextDevices = prev.devices.map((item) => {
        const soilMoisture = clampNumber(item.telemetry.soilMoisture + (item.status === 'Maintenance' ? 0 : item.id.endsWith('01') ? -2 : 1), 20, 92);
        const ambientHumidity = clampNumber(item.telemetry.ambientHumidity + (item.id.endsWith('03') ? 2 : -1), 55, 96);
        const rainfall = clampNumber((item.telemetry.rainfall || 0) + (item.id.endsWith('02') ? 4 : 1), 0, 80);
        const lowMoisture = soilMoisture < item.thresholds.moistureLowerBound;
        const safeSalt = item.telemetry.saltIntrusion < item.thresholds.saltIntrusionMarker;
        return {
          ...item,
          telemetry: {
            ...item.telemetry,
            soilMoisture,
            ambientHumidity,
            rainfall,
            timestamp: new Date().toISOString(),
          },
          valveStatus: item.status === 'Maintenance' ? 'Bảo trì' : lowMoisture && safeSalt ? 'Mở van' : lowMoisture ? 'Khóa khẩn cấp' : 'Chờ',
        };
      });
      const onlineCount = nextDevices.filter((item) => item.status === 'Online').length;
      const nextAvgMoisture = Math.round(nextDevices.reduce((sum, item) => sum + item.telemetry.soilMoisture, 0) / Math.max(nextDevices.length, 1));
      return {
        ...addLedgerEntry(
          { ...prev, devices: nextDevices },
          {
            type: 'IoT_Log',
            farmId: farm.id,
            title: 'Quét ngưỡng IoT toàn vườn',
            detail: `${onlineCount}/${nextDevices.length} trạm đang online, độ ẩm trung bình ${nextAvgMoisture}%, relay đã cập nhật theo từng phân khu.`,
          },
        ),
        notifications: [
          {
            id: `NOTI-${Date.now()}`,
            type: 'IoT',
            title: 'Đã chạy mô phỏng telemetry toàn vườn',
            message: `Độ ẩm trung bình ${nextAvgMoisture}%, ${onlineCount} trạm online, dữ liệu đã ghi ledger.`,
            unread: true,
          },
          ...prev.notifications,
        ],
      };
    });
  };

  const toggleValve = (deviceId) => {
    setState((prev) => {
      const target = prev.devices.find((item) => item.id === deviceId);
      if (!target || target.status === 'Maintenance') return prev;
      const nextValve = target.valveStatus === 'Mở van' ? 'Chờ' : 'Mở van';
      const nextDevices = prev.devices.map((item) => (item.id === deviceId ? { ...item, valveStatus: nextValve } : item));
      return addLedgerEntry(
        { ...prev, devices: nextDevices },
        {
          type: 'IoT_Log',
          farmId: target.farmId,
          title: `Điều khiển relay ${target.name}`,
          detail: `Nông dân chuyển trạng thái van sang "${nextValve}" tại ${target.zone}.`,
        },
      );
    });
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Pilot Bến Lức, Long An</p>
          <h1>{role === 'farmer' ? farm.name : 'Trung tâm vận hành GREENOVA'}</h1>
          <p>IoT, AI, marketplace, escrow và ledger đang chạy ở chế độ mô phỏng tương tác.</p>
        </div>
        <button className="primary-button" onClick={runTelemetry}>
          <Activity size={17} /> Quét IoT
        </button>
      </div>

      <div className="stats-grid">
        <StatCard icon={Leaf} label="Sức khỏe vườn" value={`${farm.healthScore}%`} note={farm.crop} />
        <StatCard icon={Thermometer} label="Nhiệt độ TB" value={`${avgTemp}°C`} note={`${onlineDevices}/${devices.length} trạm online`} tone="blue" />
        <StatCard icon={AlertTriangle} label="SOS mở" value={openSos} note="Cần chuyên gia xử lý" tone="amber" />
        <StatCard icon={LockKeyhole} label="Tranh chấp" value={openDisputes} note="Escrow cần admin" tone="red" />
      </div>

      <div className="section-subhead">
        <div>
          <h2>Trạm IoT theo phân khu</h2>
          <p>Mỗi khu có ngưỡng tưới, cảm biến đất, môi trường, nguồn điện và relay riêng để giả lập vận hành ngoài ruộng.</p>
        </div>
        <strong>{avgMoisture}% độ ẩm đất TB</strong>
      </div>

      <div className="iot-device-grid">
        {devices.map((item) => {
          const kit = kitById.get(item.kitId);
          const cost = kit ? kitCost(kit, state.hardwareParts || []) : 0;
          return (
            <article key={item.id} className="iot-device-card">
              <div className="iot-device-head">
                <div>
                  <span>{item.type}</span>
                  <h3>{item.name}</h3>
                  <p>{item.zone}</p>
                </div>
                <Badge status={item.status === 'Online' ? 'success' : 'warning'}>{statusLabel(item.status)}</Badge>
              </div>
              <div className="device-meta">
                <span>{item.farm.crop}</span>
                <span>{item.coverage}</span>
                <span>{item.network}</span>
                <span>{item.power}</span>
              </div>
              <div className="telemetry-chip-grid">
                <div><span>Ẩm đất</span><strong>{item.telemetry.soilMoisture}%</strong></div>
                <div><span>Nhiệt đất</span><strong>{item.telemetry.soilTemp}°C</strong></div>
                <div><span>pH</span><strong>{item.telemetry.soilPh}</strong></div>
                <div><span>Độ mặn</span><strong>{item.telemetry.saltIntrusion}‰</strong></div>
                <div><span>Không khí</span><strong>{item.telemetry.ambientTemp}°C</strong></div>
                <div><span>Ẩm KK</span><strong>{item.telemetry.ambientHumidity}%</strong></div>
                <div><span>Mưa 24h</span><strong>{item.telemetry.rainfall}mm</strong></div>
                <div><span>NPK</span><strong>{item.telemetry.npk.n}/{item.telemetry.npk.p}/{item.telemetry.npk.k}</strong></div>
              </div>
              <div className="device-status-row">
                <span>Pin {item.battery}%</span>
                <span>Sóng {item.signal} dBm</span>
                <span>Van: {statusLabel(item.valveStatus)}</span>
              </div>
              <div className="threshold-row">
                Ngưỡng: ẩm &lt; {item.thresholds.moistureLowerBound}% · mặn &lt; {item.thresholds.saltIntrusionMarker}‰ · nóng &gt; {item.thresholds.temperatureUpperBound}°C
              </div>
              {kit && (
                <div className="device-cost-row">
                  <span>{kit.name}</span>
                  <strong>{currency(cost)} giá vốn</strong>
                </div>
              )}
              <button className="secondary-button full" onClick={() => toggleValve(item.id)} disabled={item.status === 'Maintenance'}>
                <Activity size={16} /> Đảo relay van
              </button>
            </article>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <article className="panel large">
          <div className="panel-header">
            <div>
              <h3>Telemetry 7 ngày</h3>
              <p>Độ ẩm đất giảm dưới ngưỡng 40%, độ ẩm không khí đang thuận lợi cho nấm lá.</p>
            </div>
            <Badge status="warning">Cảnh báo Cấp 2</Badge>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={state.telemetryHistory}>
                <defs>
                  <linearGradient id="moisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#dce7dc" />
                <XAxis dataKey="day" stroke="#6b806c" fontSize={12} />
                <YAxis stroke="#6b806c" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="moisture" name="Độ ẩm đất" stroke="#16a34a" fill="url(#moisture)" strokeWidth={3} />
                <Area type="monotone" dataKey="humidity" name="Ẩm không khí" stroke="#0f766e" fill="#0f766e18" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h3>{role === 'farmer' ? 'Điều khiển ESP32' : 'Dữ liệu trạm đo'}</h3>
            <Badge status={primaryDevice.status === 'Online' ? 'success' : 'warning'}>{statusLabel(primaryDevice.status)}</Badge>
          </div>
          <div className="sensor-list">
            <div><span>Trạm chính</span><strong>{primaryDevice.name}</strong></div>
            <div><span>Độ ẩm đất</span><strong>{primaryDevice.telemetry.soilMoisture}%</strong></div>
            <div><span>Độ mặn</span><strong>{primaryDevice.telemetry.saltIntrusion}‰</strong></div>
            <div><span>NPK</span><strong>{primaryDevice.telemetry.npk.n}/{primaryDevice.telemetry.npk.p}/{primaryDevice.telemetry.npk.k}</strong></div>
            {role === 'farmer' && <div><span>Relay</span><strong>{statusLabel(primaryDevice.valveStatus)}</strong></div>}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h3>Cảnh báo dịch tễ</h3>
            <AlertTriangle size={18} />
          </div>
          {state.pestAlerts.map((alert) => (
            <div key={alert.id} className="alert-card">
              <Badge status="warning">{statusLabel(alert.level)}</Badge>
              <strong>{alert.disease}</strong>
              <p>{alert.reason}</p>
              <small>{alert.crop} • {alert.district}</small>
            </div>
          ))}
        </article>
      </div>

      <div className="section-subhead">
        <div>
          <h2>Giá vốn phần cứng IoT</h2>
          <p>Mock bảng giá linh kiện lẻ và kit triển khai để giải thích chi phí, biên gộp và lựa chọn cấu hình.</p>
        </div>
      </div>

      <div className="bom-grid">
        {kitSummaries.map((kit) => (
          <article key={kit.id} className="bom-card">
            <div>
              <span>Kit đề xuất</span>
              <h3>{kit.name}</h3>
            </div>
            <div className="bom-line"><span>Giá vốn linh kiện</span><strong>{currency(kit.cost)}</strong></div>
            <div className="bom-line"><span>Giá bán demo</span><strong>{currency(kit.salePrice)}</strong></div>
            <div className="bom-line accent"><span>Biên gộp dự kiến</span><strong>{currency(kit.margin)}</strong></div>
          </article>
        ))}
      </div>

      <article className="panel">
        <div className="panel-header">
          <div>
            <h3>Bảng giá linh kiện lẻ</h3>
            <p>Dữ liệu lấy từ bảng bổ sung: vi điều khiển, truyền thông, cảm biến đất, môi trường, relay, nguồn và vỏ hộp.</p>
          </div>
          <Package size={19} />
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nhóm</th>
                <th>Linh kiện</th>
                <th>Mục đích</th>
                <th>Giá vốn</th>
              </tr>
            </thead>
            <tbody>
              {(state.hardwareParts || []).map((part) => (
                <tr key={part.id}>
                  <td>{part.group}</td>
                  <td>{part.name}</td>
                  <td>{part.purpose}</td>
                  <td>{currency(part.unitCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
