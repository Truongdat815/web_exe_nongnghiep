export function currency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export function statusLabel(status) {
  const map = {
    Created: 'Đã tạo',
    Paid_Escrow: 'Đã ký quỹ',
    Shipping: 'Đang giao',
    Delivered_Locked: 'Đã nhận, khóa 48h',
    Released: 'Đã giải ngân',
    Disputed: 'Tranh chấp',
    Open: 'Đang mở',
    Pending: 'Chờ xử lý',
    Approved: 'Đã duyệt',
    Rejected: 'Từ chối',
    Closed: 'Đã khóa',
    Settled: 'Đã tất toán',
    Resolved: 'Đã xử lý',
    Online: 'Hoạt động',
    Maintenance: 'Bảo trì',
    TURN_ON_VALVE: 'Mở van',
    FORCE_SHUTDOWN_VALVE: 'Đóng van khẩn cấp',
    IDLE: 'Chờ',
    Auto_Prescribed: 'AI tự kê đơn',
    Need_Expert: 'Cần chuyên gia',
    Medium: 'Trung bình',
    High: 'Cao',
    Level_2_Warning: 'Cảnh báo cấp 2',
  };
  return map[status] || status;
}

export function quantityToKg(quantity) {
  if (typeof quantity === 'number') return quantity;
  const normalized = String(quantity || '').toLowerCase().replace(',', '.');
  const value = Number.parseFloat(normalized);
  if (!Number.isFinite(value)) return 1;
  if (normalized.includes('tấn') || normalized.includes('tan')) return value * 1000;
  if (normalized.includes('kg')) return value;
  return value;
}

export function kitCost(kit, parts = []) {
  const partMap = new Map(parts.map((part) => [part.id, part]));
  return (kit?.components || []).reduce((sum, [partId, quantity]) => {
    const part = partMap.get(partId);
    return sum + (part?.unitCost || 0) * quantity;
  }, 0);
}

export function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function addLedgerEntry(state, entry) {
  const hashSeed = `${entry.title}-${entry.detail}-${Date.now()}`;
  const hash = `0x${btoa(unescape(encodeURIComponent(hashSeed))).slice(0, 12)}...${Math.random().toString(16).slice(2, 6)}`;
  return {
    ...state,
    ledgers: [
      {
        id: `LED-${Date.now()}`,
        farmId: entry.farmId || 'farm-lime-01',
        type: entry.type,
        title: entry.title,
        detail: entry.detail,
        hash,
        verified: true,
        createdAt: new Date().toISOString(),
      },
      ...state.ledgers,
    ],
  };
}

export function StatCard({ icon: Icon, label, value, note, tone = 'green' }) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <div className="stat-icon"><Icon size={20} /></div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        {note && <span>{note}</span>}
      </div>
    </article>
  );
}

export function Badge({ children, status = 'default' }) {
  return <span className={`status-badge ${status}`}>{children}</span>;
}

