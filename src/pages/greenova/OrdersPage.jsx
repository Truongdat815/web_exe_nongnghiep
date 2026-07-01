import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileWarning,
  HandCoins,
  LockKeyhole,
  PackageCheck,
  Scale,
  Search,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { addLedgerEntry, Badge, currency, statusLabel } from './pageUtils';
import { roleTheme } from '../../roles/roleTheme';

const FLOW = ['Paid_Escrow', 'Shipping', 'Delivered_Locked', 'Released'];
const STATUS_FILTERS = ['Tất cả', 'Paid_Escrow', 'Shipping', 'Delivered_Locked', 'Released', 'Disputed'];

const statusMeta = {
  Created: { icon: Clock3, tone: 'muted', label: 'Đã tạo' },
  Paid_Escrow: { icon: LockKeyhole, tone: 'blue', label: 'Đã ký quỹ' },
  Shipping: { icon: Truck, tone: 'amber', label: 'Đang giao' },
  Delivered_Locked: { icon: PackageCheck, tone: 'green', label: 'Khóa 48h' },
  Released: { icon: CheckCircle2, tone: 'green', label: 'Đã giải ngân' },
  Disputed: { icon: AlertTriangle, tone: 'red', label: 'Tranh chấp' },
};

export function OrdersPage({ state, setState, role, notify }) {
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const orders = state.orders || [];

  const filteredOrders = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      const matchStatus = statusFilter === 'Tất cả' || order.status === statusFilter;
      const matchKeyword = !keyword || `${order.id} ${order.product} ${order.buyer} ${order.distributor}`.toLowerCase().includes(keyword);
      return matchStatus && matchKeyword;
    });
  }, [orders, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const escrowValue = orders
      .filter((order) => order.status !== 'Released')
      .reduce((sum, order) => sum + (order.total || 0), 0);
    const disputed = orders.filter((order) => order.status === 'Disputed').length;
    const locked = orders.filter((order) => order.status === 'Delivered_Locked').length;
    const released = orders.filter((order) => order.status === 'Released').length;
    return { escrowValue, disputed, locked, released };
  }, [orders]);

  const updateOrder = (id, status) => {
    setState((prev) => {
      const order = prev.orders.find((item) => item.id === id);
      let next = {
        ...prev,
        orders: prev.orders.map((item) => (item.id === id ? { ...item, status } : item)),
      };
      next = addLedgerEntry(next, {
        type: 'Escrow_Event',
        title: `Đơn ${id} chuyển trạng thái ${statusLabel(status)}`,
        detail: `${order?.product || 'Đơn hàng'} được cập nhật bởi vai trò ${roleTheme[role]?.label || role}.`,
      });
      return next;
    });
    notify(`Đã chuyển đơn ${id} sang trạng thái ${statusLabel(status)}.`);
  };

  return (
    <section className="escrow-admin page-grid">
      <header className="escrow-header">
        <div>
          <p className="eyebrow">Admin Escrow</p>
          <h1>Tranh chấp & ký quỹ</h1>
          <p>Theo dõi vòng đời đơn hàng escrow, khóa 48h, giải ngân và xử lý khiếu nại.</p>
        </div>
        <div className="escrow-policy">
          <ShieldCheck size={18} />
          <span>Quy tắc</span>
          <strong>48h buyer-lock</strong>
        </div>
      </header>

      <div className="escrow-stat-grid">
        <EscrowStat icon={HandCoins} label="Đang giữ escrow" value={currency(stats.escrowValue)} note={`${orders.length} đơn theo dõi`} />
        <EscrowStat icon={FileWarning} label="Tranh chấp" value={stats.disputed} note="cần admin kiểm tra" tone="red" />
        <EscrowStat icon={LockKeyhole} label="Khóa 48h" value={stats.locked} note="chờ tự giải ngân" tone="green" />
        <EscrowStat icon={CheckCircle2} label="Đã giải ngân" value={stats.released} note="hoàn tất ledger" tone="blue" />
      </div>

      <article className="escrow-panel">
        <div className="escrow-toolbar">
          <div className="escrow-search">
            <Search size={17} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm mã đơn, sản phẩm, nông dân, đại lý..."
            />
          </div>
          <div className="escrow-filter-row">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                className={statusFilter === status ? 'active' : ''}
                onClick={() => setStatusFilter(status)}
              >
                {status === 'Tất cả' ? status : statusLabel(status)}
              </button>
            ))}
          </div>
        </div>

        <div className="escrow-order-list">
          {filteredOrders.map((order) => (
            <OrderReviewCard key={order.id} order={order} onUpdate={updateOrder} />
          ))}
          {filteredOrders.length === 0 && (
            <div className="escrow-empty">
              <Scale size={28} />
              <strong>Không có đơn phù hợp</strong>
              <p>Thử đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm.</p>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

function EscrowStat({ icon: Icon, label, value, note, tone = 'default' }) {
  return (
    <article className={`escrow-stat tone-${tone}`}>
      <div><Icon size={19} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}

function OrderReviewCard({ order, onUpdate }) {
  const meta = statusMeta[order.status] || statusMeta.Created;
  const StatusIcon = meta.icon;
  const activeIndex = order.status === 'Disputed' ? -1 : Math.max(0, FLOW.indexOf(order.status));
  const feeRate = order.total ? Math.round(((order.platformFee || 0) / order.total) * 100) : 0;

  return (
    <article className="escrow-order-card">
      <div className="escrow-order-main">
        <div className="escrow-order-title">
          <div className={`escrow-status-icon tone-${meta.tone}`}>
            <StatusIcon size={19} />
          </div>
          <div>
            <span>#{order.id}</span>
            <h2>{order.product}</h2>
            <p>{order.buyer} → {order.distributor}</p>
          </div>
        </div>

        <div className="escrow-money-grid">
          <div><span>Tổng đơn</span><strong>{currency(order.total)}</strong></div>
          <div><span>Phí sàn {feeRate}%</span><strong>{currency(order.platformFee)}</strong></div>
          <div><span>Đại lý nhận</span><strong>{currency(order.netAmount)}</strong></div>
        </div>

        <div className="escrow-flow">
          {FLOW.map((status, index) => (
            <div
              key={status}
              className={index <= activeIndex ? 'done' : ''}
              aria-label={statusLabel(status)}
            >
              <i />
              <span>{statusMeta[status].label}</span>
            </div>
          ))}
          {order.status === 'Disputed' && (
            <div className="dispute-marker">
              <AlertTriangle size={15} /> Đang tranh chấp
            </div>
          )}
        </div>
      </div>

      <aside className="escrow-review-panel">
        <div className="escrow-review-head">
          <Badge status={order.status === 'Disputed' ? 'danger' : order.status === 'Released' ? 'success' : 'warning'}>
            {statusLabel(order.status)}
          </Badge>
          <small>{order.countdownHours || 48}h lock</small>
        </div>

        <div className="escrow-evidence">
          <span>Bằng chứng mô phỏng</span>
          <p>QR hóa đơn, trạng thái giao hàng và ledger escrow đã được ghi nhận.</p>
        </div>

        <div className="escrow-actions">
          <button onClick={() => onUpdate(order.id, 'Shipping')}><Truck size={15} /> Giao hàng</button>
          <button onClick={() => onUpdate(order.id, 'Delivered_Locked')}><LockKeyhole size={15} /> Khóa 48h</button>
          <button onClick={() => onUpdate(order.id, 'Released')}><CheckCircle2 size={15} /> Giải ngân</button>
          <button className="danger" onClick={() => onUpdate(order.id, 'Disputed')}><AlertTriangle size={15} /> Khiếu nại</button>
        </div>
      </aside>
    </article>
  );
}
