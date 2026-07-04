import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  CloudRain,
  Cpu,
  Download,
  Droplets,
  FileClock,
  FileText,
  FlaskConical,
  Gauge,
  Leaf,
  LockKeyhole,
  MapPin,
  NotebookPen,
  PackageCheck,
  Receipt,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Sprout,
  TestTube2,
  TimerReset,
} from 'lucide-react';
import { addLedgerEntry, Badge, currency } from './pageUtils';

const TYPE_META = {
  IoT_Log: { label: 'IoT', icon: Cpu, tone: 'blue' },
  AI_Diagnosis: { label: 'AI', icon: Sparkles, tone: 'green' },
  Material_Invoice: { label: 'Vật tư', icon: Receipt, tone: 'amber' },
  Escrow_Event: { label: 'Escrow', icon: LockKeyhole, tone: 'purple' },
  Farm_Note: { label: 'Canh tác', icon: NotebookPen, tone: 'green' },
};

const FARM_AUDIT = {
  'farm-lime-01': {
    irrigationCount: 42,
    irrigationLiters: 12800,
    lastIrrigation: '25/06/2026 06:45',
    rainfall7d: 63,
    avgMoisture: 41,
    fertilizerEc: 1.18,
    fertilizerLimit: 1.8,
    pesticideResidue: 0.07,
    pesticideLimit: 0.3,
    sunlightHours: 5.8,
    compliance: 'Đạt VietGAP nội bộ',
    treatment: 'Nano đồng bạc 500ml, Trichoderma 1kg',
    note: 'Không ghi nhận thuốc BVTV vượt ngưỡng trong 30 ngày gần nhất.',
    history: [
      ['18/11/2025', 'Gieo trồng', 'Chanh không hạt, khu A - 1.5 ha'],
      ['05/06/2026', 'Bón phân', 'NPK hữu cơ 16-16-8, EC sau tưới 1.18 mS/cm'],
      ['21/06/2026', 'Mưa', 'Mưa 18mm, hệ thống bỏ qua lịch tưới tối'],
      ['25/06/2026', 'Tưới', 'Mở van 18 phút, tổng 42 lần tưới/vụ'],
    ],
  },
  'farm-pine-01': {
    irrigationCount: 31,
    irrigationLiters: 7200,
    lastIrrigation: '25/06/2026 05:50',
    rainfall7d: 91,
    avgMoisture: 57,
    fertilizerEc: 1.36,
    fertilizerLimit: 1.7,
    pesticideResidue: 0.11,
    pesticideLimit: 0.25,
    sunlightHours: 4.6,
    compliance: 'Đang theo dõi ẩm cao',
    treatment: 'Trichoderma cải tạo đất, thoát nước rãnh',
    note: 'Độ ẩm cao sau mưa, chưa có cảnh báo dư lượng thuốc.',
    history: [
      ['09/01/2026', 'Gieo trồng', 'Khóm ven kênh, khu B - 0.8 ha'],
      ['19/06/2026', 'Mưa', 'Mưa 26mm, cảm biến báo ẩm cao 82%'],
      ['23/06/2026', 'Canh tác', 'Mở rãnh thoát nước, tạm ngưng bón đạm'],
      ['25/06/2026', 'Tưới', 'Không mở van do đất còn đủ ẩm'],
    ],
  },
};

function formatDate(value) {
  return new Date(value).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function shortHash(value = '') {
  if (value.length <= 18) return value;
  return `${value.slice(0, 10)}...${value.slice(-6)}`;
}

function encodeQrPayload(payload) {
  return encodeURIComponent(JSON.stringify(payload));
}

function buildDerivedBlocks(state, farm) {
  const devices = state.devices.filter((item) => item.farmId === farm.id);
  const diagnoses = state.diagnoses
    .filter((item) => item.farmId === farm.id)
    .map((item) => ({
      id: `DER-${item.id}`,
      farmId: farm.id,
      type: 'AI_Diagnosis',
      title: `AI chẩn đoán: ${item.disease}`,
      detail: `${item.prescription} Độ tin cậy ${item.confidence}%.`,
      hash: `0xAI${item.id.replace(/\D/g, '').padEnd(8, '0')}...${item.confidence}OK`,
      verified: item.confidence >= 75,
      createdAt: item.createdAt,
    }));

  const orderBlocks = state.orders
    .filter((item) => item.product || item.items)
    .slice(0, 4)
    .map((item) => ({
      id: `DER-${item.id}`,
      farmId: farm.id,
      type: 'Escrow_Event',
      title: `Escrow vật tư: ${item.product}`,
      detail: `Đã khóa ${currency(item.total)} trong ${item.countdownHours || 48}h. Trạng thái: ${item.status}.`,
      hash: `0xESC${item.id.replace(/\D/g, '').padEnd(8, '0')}...${Math.round(item.total / 1000)}`,
      verified: true,
      createdAt: item.createdAt,
    }));

  const iotBlocks = devices.map((device) => ({
    id: `DER-${device.id}`,
    farmId: farm.id,
    type: 'IoT_Log',
    title: `${device.name} gửi telemetry mới nhất`,
    detail: `Độ ẩm ${device.telemetry.soilMoisture}%, pH ${device.telemetry.soilPh}, độ mặn ${device.telemetry.saltIntrusion}‰, NPK ${device.telemetry.npk.n}/${device.telemetry.npk.p}/${device.telemetry.npk.k}.`,
    hash: `0xIOT${device.mac.replace(/[^A-Z0-9]/g, '').slice(-8)}...${device.telemetry.soilMoisture}`,
    verified: device.status === 'Online',
    createdAt: device.telemetry.timestamp,
  }));

  return [...iotBlocks, ...diagnoses, ...orderBlocks];
}

function StatusPill({ ok, children }) {
  return <span className={`ledger-safety-pill ${ok ? 'ok' : 'warn'}`}>{children}</span>;
}

function MetricCard({ icon: Icon, label, value, note, tone = 'green' }) {
  return (
    <article className={`ledger-metric-card ${tone}`}>
      <div className="ledger-metric-icon"><Icon size={18} /></div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <p>{note}</p>
      </div>
    </article>
  );
}

export function LedgerPage({ state, setState, notify }) {
  const [selectedFarmId, setSelectedFarmId] = useState(state.farms[0]?.id);
  const [activeType, setActiveType] = useState('all');
  const [showAllEntries, setShowAllEntries] = useState(false);
  const selectedFarm = state.farms.find((farm) => farm.id === selectedFarmId) || state.farms[0];

  const farmDevices = useMemo(
    () => state.devices.filter((device) => device.farmId === selectedFarm?.id),
    [selectedFarm?.id, state.devices],
  );
  const primaryDevice = farmDevices[0];
  const audit = FARM_AUDIT[selectedFarm?.id] || FARM_AUDIT['farm-lime-01'];

  const blocks = useMemo(() => {
    if (!selectedFarm) return [];
    const baseBlocks = state.ledgers.filter((entry) => entry.farmId === selectedFarm.id);
    const derivedBlocks = buildDerivedBlocks(state, selectedFarm);
    const byId = new Map();
    [...baseBlocks, ...derivedBlocks].forEach((entry) => {
      if (!byId.has(entry.id)) byId.set(entry.id, entry);
    });
    return Array.from(byId.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [selectedFarm, state]);

  if (!selectedFarm) {
    return (
      <section className="farmer-ledger-page">
        <div className="ledger-empty">
          <FileText size={32} />
          <strong>Chưa có mảnh đất để tạo nhật ký QR</strong>
          <p>Hãy thêm farm trước khi phát hành QR passport.</p>
        </div>
      </section>
    );
  }

  const filteredBlocks = activeType === 'all' ? blocks : blocks.filter((entry) => entry.type === activeType);
  const visibleBlocks = showAllEntries ? filteredBlocks : filteredBlocks.slice(0, 4);
  const verifiedCount = blocks.filter((entry) => entry.verified).length;
  const integrityScore = blocks.length ? Math.round((verifiedCount / blocks.length) * 100) : 0;
  const passportId = `GREENOVA-PASS-${selectedFarm.id.toUpperCase()}`;
  const avgMoisture = primaryDevice?.telemetry.soilMoisture ?? audit.avgMoisture;
  const rainNow = primaryDevice?.telemetry.rainfall ?? 0;
  const npk = primaryDevice?.telemetry.npk || { n: 0, p: 0, k: 0 };
  const fertilizerOk = audit.fertilizerEc <= audit.fertilizerLimit;
  const pesticideOk = audit.pesticideResidue <= audit.pesticideLimit;
  const qrPayload = {
    passportId,
    farm: selectedFarm.name,
    crop: selectedFarm.crop,
    district: selectedFarm.district,
    plantedAt: selectedFarm.seedingDate,
    devices: farmDevices.map((device) => device.mac),
    irrigationCount: audit.irrigationCount,
    moisture: avgMoisture,
    npk,
    fertilizerEc: audit.fertilizerEc,
    pesticideResidue: audit.pesticideResidue,
    integrityScore,
  };
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeQrPayload(qrPayload)}`;

  const addFarmNote = () => {
    setState((prev) => addLedgerEntry(prev, {
      type: 'Farm_Note',
      farmId: selectedFarm.id,
      title: `Ghi chép canh tác: ${selectedFarm.crop}`,
      detail: `Nông dân đã kiểm tra ${selectedFarm.zone}, cập nhật ẩm đất ${avgMoisture}% và nhật ký tưới lúc ${new Date().toLocaleTimeString('vi-VN')}.`,
    }));
    notify?.('Đã thêm ghi chép canh tác vào QR nhật ký.');
  };

  return (
    <section className="farmer-ledger-page">
      <header className="ledger-hero ledger-qr-hero">
        <div>
          <p className="eyebrow">Nhật ký QR canh tác</p>
          <h1>{selectedFarm.name}</h1>
          <p>
            Ghi nhận tự động từ IoT: tưới nước, mưa, độ ẩm, NPK, phân bón,
            thuốc BVTV và lịch sử gieo trồng để buyer quét QR kiểm tra.
          </p>
        </div>
        <div className="ledger-hero-proof">
          <ShieldCheck size={22} />
          <strong>{integrityScore}% hợp lệ</strong>
          <span>{verifiedCount}/{blocks.length || 1} block đã xác thực</span>
        </div>
      </header>

      <div className="ledger-farm-tabs">
        {state.farms.map((farm) => (
          <button
            key={farm.id}
            className={selectedFarm.id === farm.id ? 'active' : ''}
            onClick={() => setSelectedFarmId(farm.id)}
          >
            <Leaf size={17} />
            <span>{farm.name}</span>
            <ChevronRight size={15} />
          </button>
        ))}
      </div>

      <div className="ledger-layout ledger-qr-layout">
        <aside className="ledger-passport-card ledger-qr-passport-card">
          <div className="ledger-passport-top">
            <BadgeCheck size={20} />
            <span>QR passport thật</span>
          </div>

          <div className="ledger-real-qr">
            <img src={qrUrl} alt={`Mã QR truy xuất ${selectedFarm.name}`} />
          </div>

          <code>{passportId}</code>
          <h2>{selectedFarm.crop}</h2>
          <p>{selectedFarm.area} ha · {selectedFarm.district}, Long An</p>

          <div className="ledger-passport-grid compact">
            <div><CalendarDays size={16} /><span>Trồng lúc</span><strong>{new Date(selectedFarm.seedingDate).toLocaleDateString('vi-VN')}</strong></div>
            <div><MapPin size={16} /><span>Tọa độ</span><strong>{selectedFarm.coordinates}</strong></div>
            <div><PackageCheck size={16} /><span>Dự kiến thu</span><strong>{selectedFarm.expectedYieldKg.toLocaleString('vi-VN')} kg</strong></div>
            <div><Cpu size={16} /><span>Thiết bị</span><strong>{farmDevices.length} trạm</strong></div>
          </div>

          <div className="ledger-action-row">
            <button onClick={() => notify?.(`QR ${passportId} đã sẵn sàng để quét.`)}><ScanLine size={16} /> Quét thử</button>
            <button onClick={() => notify?.('Bản PDF passport sẽ xuất ở phase backend.') }><Download size={16} /> Xuất PDF</button>
          </div>
        </aside>

        <main className="ledger-main ledger-qr-main">
          <div className="ledger-summary-grid ledger-iot-summary-grid">
            <MetricCard icon={TimerReset} label="Tổng lần tưới" value={`${audit.irrigationCount} lần`} note={`${audit.irrigationLiters.toLocaleString('vi-VN')} lít · cuối ${audit.lastIrrigation}`} />
            <MetricCard icon={CloudRain} label="Mưa 7 ngày" value={`${audit.rainfall7d}mm`} note={rainNow > 0 ? `Hiện tại ${rainNow}mm` : 'Không mưa'} tone={rainNow > 15 ? 'amber' : 'blue'} />
            <MetricCard icon={Droplets} label="Độ ẩm đất" value={`${avgMoisture}%`} note={avgMoisture < 40 ? 'Cần tưới thêm' : 'Trong vùng theo dõi'} tone={avgMoisture < 40 ? 'amber' : 'green'} />
            <MetricCard icon={Sprout} label="Sức khỏe cây" value={`${selectedFarm.healthScore}%`} note={audit.compliance} />
            <MetricCard icon={TestTube2} label="Dinh dưỡng NPK" value={`${npk.n}/${npk.p}/${npk.k}`} note="Đạm / Lân / Kali tầng rễ" />
            <MetricCard icon={Gauge} label="Phân bón EC" value={`${audit.fertilizerEc} mS/cm`} note={`Ngưỡng ${audit.fertilizerLimit} mS/cm`} tone={fertilizerOk ? 'green' : 'red'} />
            <MetricCard icon={FlaskConical} label="Dư lượng thuốc" value={`${audit.pesticideResidue} ppm`} note={`Giới hạn ${audit.pesticideLimit} ppm`} tone={pesticideOk ? 'green' : 'red'} />
            <MetricCard icon={ShieldCheck} label="An toàn" value={fertilizerOk && pesticideOk ? 'Đạt' : 'Cần kiểm'} note={audit.note} tone={fertilizerOk && pesticideOk ? 'green' : 'amber'} />
          </div>

          <section className="ledger-safety-panel">
            <div>
              <p className="eyebrow">Kiểm soát vượt ngưỡng</p>
              <h2>Phân bón, thuốc BVTV và nước tưới</h2>
            </div>
            <div className="ledger-safety-list">
              <StatusPill ok={fertilizerOk}>EC phân bón an toàn</StatusPill>
              <StatusPill ok={pesticideOk}>Thuốc BVTV không vượt mức</StatusPill>
              <StatusPill ok={(primaryDevice?.telemetry.saltIntrusion || 0) < (primaryDevice?.thresholds.saltIntrusionMarker || 1)}>Độ mặn nước tưới đạt</StatusPill>
            </div>
          </section>

          <section className="ledger-device-strip">
            {farmDevices.map((device) => (
              <article key={device.id}>
                <div>
                  <Cpu size={17} />
                  <strong>{device.name}</strong>
                  <Badge status={device.status === 'Online' ? 'success' : 'warning'}>{device.status}</Badge>
                </div>
                <p>{device.zone}</p>
                <div className="ledger-device-metrics">
                  <span>Ẩm <b>{device.telemetry.soilMoisture}%</b></span>
                  <span>Nhiệt <b>{device.telemetry.ambientTemp}°C</b></span>
                  <span>Mưa <b>{device.telemetry.rainfall}mm</b></span>
                  <span>Van <b>{device.valveStatus}</b></span>
                </div>
              </article>
            ))}
          </section>

          <section className="ledger-cultivation-card">
            <div className="ledger-toolbar">
              <div>
                <h2>Lịch sử canh tác rút gọn</h2>
                <p>Những mốc chính buyer cần xem khi quét QR.</p>
              </div>
              <button onClick={addFarmNote}><NotebookPen size={17} /> Thêm ghi chép</button>
            </div>
            <div className="ledger-mini-history">
              {audit.history.map(([date, title, detail]) => (
                <article key={`${date}-${title}`}>
                  <span>{date}</span>
                  <strong>{title}</strong>
                  <p>{detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="ledger-cultivation-card">
            <div className="ledger-toolbar">
              <div>
                <h2>Nhật ký xác thực</h2>
                <p>Dữ liệu IoT, AI, vật tư và escrow đã được ghi vào mã QR.</p>
              </div>
              {filteredBlocks.length > 4 && (
                <button type="button" onClick={() => setShowAllEntries((value) => !value)}>
                  <FileClock size={17} /> {showAllEntries ? 'Thu gọn' : `Xem thêm ${filteredBlocks.length - 4}`}
                </button>
              )}
            </div>

            <div className="ledger-filter-row">
              {[
                ['all', 'Tất cả'],
                ['IoT_Log', 'IoT'],
                ['AI_Diagnosis', 'AI'],
                ['Material_Invoice', 'Vật tư'],
                ['Escrow_Event', 'Escrow'],
                ['Farm_Note', 'Ghi chép'],
              ].map(([id, label]) => (
                <button key={id} className={activeType === id ? 'active' : ''} onClick={() => setActiveType(id)}>
                  {label}
                </button>
              ))}
            </div>

            <div className="ledger-timeline">
              {filteredBlocks.length === 0 ? (
                <div className="ledger-empty">
                  <FileText size={32} />
                  <strong>Chưa có nhật ký phù hợp</strong>
                  <p>Đổi bộ lọc hoặc thêm ghi chép canh tác mới.</p>
                </div>
              ) : (
                visibleBlocks.map((entry) => {
                  const meta = TYPE_META[entry.type] || TYPE_META.Farm_Note;
                  const Icon = meta.icon;
                  return (
                    <article key={entry.id} className={`ledger-block ${meta.tone}`}>
                      <div className="ledger-block-icon"><Icon size={18} /></div>
                      <div className="ledger-block-content">
                        <div className="ledger-block-head">
                          <Badge status={entry.verified ? 'success' : 'warning'}>{meta.label}</Badge>
                          <span>{formatDate(entry.createdAt)}</span>
                        </div>
                        <h3>{entry.title}</h3>
                        <p>{entry.detail}</p>
                        <div className="ledger-hash-row">
                          <code>{shortHash(entry.hash)}</code>
                          <span>{entry.verified ? 'Đã xác thực' : 'Cần kiểm tra'}</span>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}
