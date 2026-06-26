import { currency, statusLabel, addLedgerEntry, Badge } from './pageUtils';
import { roleTheme } from '../../roles/roleTheme';

export function OrdersPage({ state, setState, role, notify }) {
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
        detail: `${order?.product || 'Đơn hàng'} được cập nhật bởi vai trò ${roleTheme[role].label}.`,
      });
      return next;
    });
    notify(`Đã chuyển đơn ${id} sang trạng thái ${statusLabel(status)}.`);
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">48-hour escrow lifecycle</p>
          <h1>Luồng ký quỹ và tranh chấp</h1>
          <p>State machine: Created → Paid_Escrow → Shipping → Delivered_Locked → Released hoặc Disputed.</p>
        </div>
      </div>
      <div className="cards-column">
        {state.orders.map((order) => (
          <article key={order.id} className="order-card">
            <div>
              <div className="panel-header">
                <div>
                  <h3>#{order.id} • {order.product}</h3>
                  <p>{order.buyer} → {order.distributor}</p>
                </div>
                <Badge status={order.status === 'Disputed' ? 'danger' : order.status === 'Released' ? 'success' : 'warning'}>
                  {statusLabel(order.status)}
                </Badge>
              </div>
              <div className="order-money">
                <span>Tổng: <strong>{currency(order.total)}</strong></span>
                <span>Phí sàn 3%: <strong>{currency(order.platformFee)}</strong></span>
                <span>Đại lý nhận: <strong>{currency(order.netAmount)}</strong></span>
              </div>
            </div>
            <div className="order-actions">
              <button onClick={() => updateOrder(order.id, 'Shipping')}>Đại lý giao hàng</button>
              <button onClick={() => updateOrder(order.id, 'Delivered_Locked')}>Xác nhận đã nhận</button>
              <button onClick={() => updateOrder(order.id, 'Released')}>Giả lập hết 48h</button>
              <button className="danger" onClick={() => updateOrder(order.id, 'Disputed')}>Khiếu nại</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
