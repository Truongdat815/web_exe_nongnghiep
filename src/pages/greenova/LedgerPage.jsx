import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Download,
  FileClock,
  FileText,
  Leaf,
  LockKeyhole,
  MapPin,
  NotebookPen,
  PackageCheck,
  QrCode,
  Receipt,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { addLedgerEntry, Badge, currency } from './pageUtils';

const TYPE_META = {
  IoT_Log: { label: 'IoT', icon: Cpu, tone: 'blue' },
  AI_Diagnosis: { label: 'AI', icon: Sparkles, tone: 'green' },
  Material_Invoice: { label: 'Vật tư', icon: Receipt, tone: 'amber' },
  Escrow_Event: { label: 'Escrow', icon: LockKeyhole, tone: 'purple' },
  Farm_Note: { label: 'Ghi chép', icon: NotebookPen, tone: 'green' },
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

function buildDerivedBlocks(state, farm) {
  const device = state.devices.find((item) => item.farmId === farm.id);
  const diagnoses = state.diagnoses
    .filter((item) => item.farmId === farm.id)
    .map((item) => ({
      id: `DER-${item.id}`,
      farmId: farm.id,
      type: 'AI_Diagnosis',
      title: `AI chẩn đoán: ${item.disease}`,
      detail: `${item.prescription} Confidence ${item.confidence}%.`,
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

  const iotBlock = device ? [{
    id: `DER-${device.id}`,
    farmId: farm.id,
    type: 'IoT_Log',
    title: `${device.name} gửi telemetry mới nhất`,
    detail: `Độ ẩm ${device.telemetry.soilMoisture}%, pH ${device.telemetry.soilPh}, độ mặn ${device.telemetry.saltIntrusion}‰, NPK ${device.telemetry.npk.n}/${device.telemetry.npk.p}/${device.telemetry.npk.k}.`,
    hash: `0xIOT${device.mac.replace(/[^A-Z0-9]/g, '').slice(-8)}...${device.telemetry.soilMoisture}`,
    verified: device.status === 'Online',
    createdAt: device.telemetry.timestamp,
  }] : [];

  return [...iotBlock, ...diagnoses, ...orderBlocks];
}

export function LedgerPage({ state, setState, notify }) {
  const [selectedFarmId, setSelectedFarmId] = useState(state.farms[0]?.id);
  const [activeType, setActiveType] = useState('all');
  const selectedFarm = state.farms.find((farm) => farm.id === selectedFarmId) || state.farms[0];
  const selectedDevice = state.devices.find((device) => device.farmId === selectedFarm.id);

  const blocks = useMemo(() => {
    const baseBlocks = state.ledgers.filter((entry) => entry.farmId === selectedFarm.id);
    const derivedBlocks = buildDerivedBlocks(state, selectedFarm);
    const merged = [...baseBlocks, ...derivedBlocks];
    const byId = new Map();
    merged.forEach((entry) => {
      if (!byId.has(entry.id)) byId.set(entry.id, entry);
    });
    return Array.from(byId.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [selectedFarm, state]);

  const filteredBlocks = activeType === 'all' ? blocks : blocks.filter((entry) => entry.type === activeType);
  const verifiedCount = blocks.filter((entry) => entry.verified).length;
  const integrityScore = blocks.length ? Math.round((verifiedCount / blocks.length) * 100) : 0;
  const passportId = `GREENOVA-PASS-${selectedFarm.id.toUpperCase()}`;

  const addFarmNote = () => {
    setState((prev) => addLedgerEntry(prev, {
      type: 'Farm_Note',
      farmId: selectedFarm.id,
      title: `Ghi chép canh tác: ${selectedFarm.crop}`,
      detail: `Nông dân đã kiểm tra ${selectedFarm.zone}, tỉa lá bệnh nhẹ và cập nhật nhật ký lúc ${new Date().toLocaleTimeString('vi-VN')}.`,
    }));
    notify?.('Đã thêm ghi chép canh tác vào QR nhật ký.');
  };

  return (
    <section className="farmer-ledger-page">
      <header className="ledger-hero">
        <div>
          <p className="eyebrow">Nhật ký QR từng mảnh đất</p>
          <h1>Hộ chiếu nông sản chống chỉnh sửa dữ liệu</h1>
          <p>Mỗi lần IoT gửi số liệu, AI chẩn đoán hoặc mua vật tư escrow đều được ghi thành block hash để buyer kiểm tra trước khi thu mua.</p>
        </div>
        <div className="ledger-hero-proof">
          <ShieldCheck size={22} />
          <strong>{integrityScore}% verified</strong>
          <span>{verifiedCount}/{blocks.length || 1} block đã xác thực cho {selectedFarm.crop}</span>
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

      <div className="ledger-layout">
        <aside className="ledger-passport-card">
          <div className="ledger-passport-top">
            <BadgeCheck size={22} />
            <span>GREENOVA Blockchain Passport</span>
          </div>
          <div className="ledger-qr">
            <QrCode size={156} strokeWidth={1.45} />
            <i />
          </div>
          <code>{passportId}</code>
          <h2>{selectedFarm.name}</h2>
          <p>{selectedFarm.crop} · {selectedFarm.area} ha · {selectedFarm.district}, Long An</p>

          <div className="ledger-passport-grid">
            <div><MapPin size={16} /><span>Vùng trồng</span><strong>{selectedFarm.coordinates}</strong></div>
            <div><CalendarDays size={16} /><span>Gieo trồng</span><strong>{new Date(selectedFarm.seedingDate).toLocaleDateString('vi-VN')}</strong></div>
            <div><PackageCheck size={16} /><span>Dự kiến thu</span><strong>{selectedFarm.expectedYieldKg.toLocaleString('vi-VN')} kg</strong></div>
            <div><ScanLine size={16} /><span>Trạng thái</span><strong>Verified</strong></div>
          </div>

          <div className="ledger-action-row">
            <button onClick={() => notify?.(`Đã mở QR passport ${passportId} ở chế độ demo.`)}><ScanLine size={16} /> Quét thử</button>
            <button onClick={() => notify?.('File PDF passport sẽ được xuất ở phase backend.') }><Download size={16} /> Xuất PDF</button>
          </div>
        </aside>

        <main className="ledger-main">
          <div className="ledger-summary-grid">
            <div>
              <Cpu size={18} />
              <span>Thiết bị</span>
              <strong>{selectedDevice?.name || 'Chưa gắn'}</strong>
            </div>
            <div>
              <FileClock size={18} />
              <span>Blocks</span>
              <strong>{blocks.length}</strong>
            </div>
            <div>
              <CheckCircle2 size={18} />
              <span>Xác thực</span>
              <strong>{verifiedCount}</strong>
            </div>
            <div>
              <FileText size={18} />
              <span>QR passport</span>
              <strong>Đã sẵn sàng</strong>
            </div>
          </div>

          <div className="ledger-toolbar">
            <div>
              <h2>Chuỗi nhật ký canh tác</h2>
              <p>Lọc theo nguồn dữ liệu để xem lịch sử chăm sóc và bằng chứng giao dịch.</p>
            </div>
            <button onClick={addFarmNote}><NotebookPen size={17} /> Thêm ghi chép hôm nay</button>
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
                <strong>Chưa có block phù hợp</strong>
                <p>Đổi bộ lọc hoặc thêm ghi chép canh tác mới.</p>
              </div>
            ) : (
              filteredBlocks.map((entry) => {
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
                        <span>{entry.verified ? 'Hash hợp lệ' : 'Cần xác minh'}</span>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </main>
      </div>
    </section>
  );
}
