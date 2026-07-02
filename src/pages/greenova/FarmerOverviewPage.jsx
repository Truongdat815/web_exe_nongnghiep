import { useState } from 'react';
import {
  Activity,
  Battery,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CloudRain,
  Droplets,
  Power,
  Router,
  Sun,
  TestTube2,
  Thermometer,
  TimerReset,
  Wifi,
} from 'lucide-react';
import { Badge, statusLabel } from './pageUtils';

const metricTone = {
  good: 'green',
  warn: 'amber',
  danger: 'red',
  info: 'blue',
};

const defaultValvePlan = {
  openAt: '06:00',
  closeAt: '06:25',
  duration: 25,
};

export function FarmerOverviewPage({ state, setState, notify }) {
  const farm = state.farms[0];
  const devices = state.devices || [];
  const [devicePage, setDevicePage] = useState(0);
  const [valvePlans, setValvePlans] = useState(() => Object.fromEntries(
    devices.map((device) => [device.id, defaultValvePlan]),
  ));

  const selectedDevice = devices[devicePage] || devices[0];
  const selectedPlan = valvePlans[selectedDevice?.id] || defaultValvePlan;
  const onlineDevices = devices.filter((device) => device.status === 'Online').length;

  const runQuickScan = () => {
    const moisture = selectedDevice?.telemetry.soilMoisture || 0;
    const temp = selectedDevice?.telemetry.ambientTemp || 0;
    setState((prev) => ({
      ...prev,
      notifications: [
        {
          id: `NOTI-${Date.now()}`,
          type: 'IoT',
          title: 'Đã quét nhanh trạm IoT',
          message: `${selectedDevice?.name || 'Trạm'}: độ ẩm ${moisture}%, nhiệt độ ${temp}°C.`,
          unread: true,
        },
        ...prev.notifications,
      ],
    }));
    notify('Đã quét nhanh trạm IoT đang xem.');
  };

  const goDevice = (direction) => {
    setDevicePage((current) => {
      if (!devices.length) return 0;
      return (current + direction + devices.length) % devices.length;
    });
  };

  const updateValveStatus = (deviceId, nextStatus) => {
    setState((prev) => ({
      ...prev,
      devices: prev.devices.map((device) => (
        device.id === deviceId ? { ...device, valveStatus: nextStatus } : device
      )),
    }));
    notify(nextStatus === 'Mở van' ? 'Đã mở van tưới demo.' : 'Đã đóng van tưới demo.');
  };

  const updateValvePlan = (deviceId, key, value) => {
    setValvePlans((prev) => ({
      ...prev,
      [deviceId]: {
        ...(prev[deviceId] || defaultValvePlan),
        [key]: value,
      },
    }));
  };

  const saveValveSchedule = (device) => {
    const plan = valvePlans[device.id] || defaultValvePlan;
    notify(`Đã đặt lịch ${device.name}: mở ${plan.openAt}, đóng ${plan.closeAt}, chạy ${plan.duration} phút.`);
  };

  return (
    <section className="farmer-home farmer-iot-overview farmer-iot-one-screen page-grid">
      <header className="farmer-hero farmer-hero-compact">
        <div>
          <p className="eyebrow">Giám sát IoT theo mảnh đất</p>
          <h1>{farm.name}</h1>
          <p>{farm.crop} · {farm.area} ha · {devices.length} trạm cảm biến · {onlineDevices} online</p>
        </div>
        <button onClick={runQuickScan}>
          <Activity size={17} /> Quét trạm
        </button>
      </header>

      <article className="farmer-panel farmer-land-monitor farmer-land-monitor-single">
        <div className="farmer-panel-head farmer-monitor-head">
          <div>
            <span>Trạm {devicePage + 1}/{devices.length}</span>
            <h2>Chỉ số đất, thời tiết, cây trồng và van tưới</h2>
          </div>
          <div className="farmer-device-pager">
            <button type="button" onClick={() => goDevice(-1)} aria-label="Trạm trước">
              <ChevronLeft size={18} />
            </button>
            <Badge status="success">{onlineDevices}/{devices.length} online</Badge>
            <button type="button" onClick={() => goDevice(1)} aria-label="Trạm tiếp theo">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {selectedDevice && (
          <DevicePlotCard
            device={selectedDevice}
            valvePlan={selectedPlan}
            onValveStatus={updateValveStatus}
            onValvePlan={updateValvePlan}
            onSaveSchedule={saveValveSchedule}
          />
        )}

        <div className="farmer-page-dots" aria-label="Phân trang trạm IoT">
          {devices.map((device, index) => (
            <button
              key={device.id}
              type="button"
              className={index === devicePage ? 'active' : ''}
              onClick={() => setDevicePage(index)}
              aria-label={`Xem trạm ${index + 1}`}
            />
          ))}
        </div>
      </article>
    </section>
  );
}

function DevicePlotCard({ device, valvePlan, onValveStatus, onValvePlan, onSaveSchedule }) {
  const telemetry = device.telemetry;
  const needsWater = telemetry.soilMoisture < device.thresholds.moistureLowerBound;
  const saltRisk = telemetry.saltIntrusion >= device.thresholds.saltIntrusionMarker;
  const hotRisk = telemetry.ambientTemp >= device.thresholds.temperatureUpperBound;
  const rainLabel = telemetry.rainfall > 15 ? 'Có mưa' : telemetry.rainfall > 0 ? 'Mưa nhẹ' : 'Không mưa';

  return (
    <article className="farmer-plot-card farmer-plot-featured">
      <div className="farmer-plot-head">
        <div>
          <strong>{device.name}</strong>
          <span>{device.zone}</span>
        </div>
        <Badge status={device.status === 'Online' ? 'success' : 'warning'}>{statusLabel(device.status)}</Badge>
      </div>

      <div className="farmer-plot-meta">
        <span><Router size={14} /> {device.network}</span>
        <span><Battery size={14} /> Pin {device.battery}%</span>
        <span><Wifi size={14} /> Sóng {device.signal} dBm</span>
      </div>

      <div className="farmer-sensor-grid">
        <SensorChip icon={Droplets} label="Độ ẩm đất" value={`${telemetry.soilMoisture}%`} note={needsWater ? 'Cần tưới' : 'Đủ ẩm'} tone={needsWater ? 'warn' : 'good'} />
        <SensorChip icon={Thermometer} label="Nhiệt đất" value={`${telemetry.soilTemp}°C`} note="Tầng rễ" />
        <SensorChip icon={Sun} label="Nắng/nhiệt" value={`${telemetry.ambientTemp}°C`} note={hotRisk ? 'Nắng gắt' : 'Ổn định'} tone={hotRisk ? 'warn' : 'good'} />
        <SensorChip icon={CloudRain} label={rainLabel} value={`${telemetry.rainfall}mm`} note={`${telemetry.ambientHumidity}% ẩm KK`} tone={telemetry.rainfall > 15 ? 'warn' : 'info'} />
        <SensorChip icon={TestTube2} label="pH đất" value={telemetry.soilPh} note="Chuẩn rễ" />
        <SensorChip icon={Droplets} label="Độ mặn" value={`${telemetry.saltIntrusion}‰`} note={saltRisk ? 'Nguy cơ' : 'An toàn'} tone={saltRisk ? 'danger' : 'good'} />
      </div>

      <div className="farmer-npk-strip">
        <span>N</span><b>{telemetry.npk.n}</b>
        <span>P</span><b>{telemetry.npk.p}</b>
        <span>K</span><b>{telemetry.npk.k}</b>
        <em>Dinh dưỡng tầng rễ</em>
      </div>

      <div className="farmer-valve-control">
        <div className="farmer-valve-status">
          <Power size={16} />
          <span>Van tưới</span>
          <strong>{device.valveStatus}</strong>
        </div>
        <div className="farmer-valve-buttons">
          <button type="button" className="open" onClick={() => onValveStatus(device.id, 'Mở van')}>Mở</button>
          <button type="button" className="close" onClick={() => onValveStatus(device.id, 'Đóng van')}>Đóng</button>
        </div>
        <label>
          <Clock3 size={14} />
          <span>Mở lúc</span>
          <input type="time" value={valvePlan.openAt} onChange={(event) => onValvePlan(device.id, 'openAt', event.target.value)} />
        </label>
        <label>
          <Clock3 size={14} />
          <span>Đóng lúc</span>
          <input type="time" value={valvePlan.closeAt} onChange={(event) => onValvePlan(device.id, 'closeAt', event.target.value)} />
        </label>
        <label>
          <TimerReset size={14} />
          <span>Thời lượng</span>
          <input
            type="number"
            min="5"
            max="180"
            value={valvePlan.duration}
            onChange={(event) => onValvePlan(device.id, 'duration', Number(event.target.value))}
          />
          <small>phút</small>
        </label>
        <button type="button" className="save" onClick={() => onSaveSchedule(device)}>Lưu lịch</button>
      </div>

      <div className="farmer-plot-foot">
        <span>Phạm vi: <b>{device.coverage}</b></span>
        <span>Cập nhật: {new Date(telemetry.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </article>
  );
}

function SensorChip({ icon: Icon, label, value, note, tone = 'good' }) {
  const cssTone = metricTone[tone] || metricTone.good;
  return (
    <div className={`farmer-sensor-chip tone-${cssTone}`}>
      <Icon size={15} />
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </div>
  );
}
