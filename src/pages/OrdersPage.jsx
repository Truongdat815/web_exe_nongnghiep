import { useState } from 'react';
import { orders, products } from '../data/mockData';

const statusConfig = {
  delivered: { label: 'Đã giao', badge: 'badge-green', icon: '✅' },
  in_transit: { label: 'Đang giao', badge: 'badge-blue', icon: '🚚' },
  processing: { label: 'Đang xử lý', badge: 'badge-yellow', icon: '⏳' },
  cancelled: { label: 'Đã hủy', badge: 'badge-red', icon: '❌' },
};

const paymentConfig = {
  wallet: { label: 'Ví điện tử', icon: '💰' },
  bank_transfer: { label: 'Chuyển khoản', icon: '🏦' },
  cod: { label: 'Giao hàng thu tiền (COD)', icon: '💵' },
};

export default function OrdersPage() {
  const [tab, setTab] = useState('all');

  const filtered = tab === 'all' ? orders : orders.filter(o => o.status === tab);

  return (
    <div className="page-container animate-slide-in">
      <div className="page-header">
        <h2 className="page-title"><span className="icon">📦</span> Quản lý đơn hàng</h2>
        <p className="page-description">Theo dõi đơn mua vật tư · Hệ thống Escrow bảo vệ giao dịch</p>
      </div>

      {/* Escrow Banner */}
      <div className="alert-banner success" style={{ marginBottom: 20 }}>
        <span className="alert-icon">🔒</span>
        <div>
          <strong>Hệ thống Escrow đang hoạt động:</strong> Tiền thanh toán được giữ an toàn bởi NôngNghiệpSố và chỉ chuyển cho người bán sau khi bạn xác nhận nhận hàng đúng chất lượng.
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { key: 'all', label: '🌐 Tất cả' },
          { key: 'processing', label: '⏳ Đang xử lý' },
          { key: 'in_transit', label: '🚚 Đang giao' },
          { key: 'delivered', label: '✅ Đã giao' },
        ].map(t => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map(order => {
          const status = statusConfig[order.status] || {};
          const payment = paymentConfig[order.paymentMethod] || {};
          const discountedPrice = order.product.discount
            ? Math.round(order.product.price * (1 - order.product.discount / 100))
            : order.product.price;

          return (
            <div key={order.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-dimmed)', marginBottom: 2 }}>
                    Mã đơn: <code style={{ color: 'var(--color-info)' }}>#{order.id}</code>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-dimmed)' }}>
                    📅 {new Date(order.date).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <span className={`badge ${status.badge}`}>{status.icon} {status.label}</span>
              </div>

              <div style={{ display: 'flex', gap: 16, padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
                <div style={{ width: 60, height: 60, background: 'var(--bg-hover)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>
                  {order.product.category === 'Phân bón' ? '🌿' : order.product.category === 'Thuốc BVTV' ? '💊' : '📦'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{order.product.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-dimmed)' }}>
                    🏭 {order.product.seller.name} · SL: {order.quantity} {order.product.unit}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-dimmed)', marginTop: 2 }}>
                    {payment.icon} {payment.label}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--color-primary-light)' }}>
                    {order.totalAmount.toLocaleString('vi-VN')}₫
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-dimmed)', marginTop: 2 }}>
                    {discountedPrice.toLocaleString('vi-VN')}₫ × {order.quantity}
                  </div>
                </div>
              </div>

              {/* Escrow Status */}
              <div style={{ padding: '10px 14px', background: order.escrowReleased ? 'rgba(16,185,129,0.08)' : 'rgba(59,130,246,0.08)', border: `1px solid ${order.escrowReleased ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)'}`, borderRadius: 'var(--radius-md)', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                <span style={{ color: order.escrowReleased ? 'var(--color-success)' : 'var(--color-info)' }}>
                  {order.escrowReleased ? '✅ Escrow đã giải phóng tiền cho người bán' : '🔒 Tiền đang được Escrow giữ an toàn'}
                </span>
                {!order.escrowReleased && order.status === 'in_transit' && (
                  <span style={{ fontSize: 11, color: 'var(--text-dimmed)' }}>Chờ bạn xác nhận</span>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                {order.status === 'in_transit' && (
                  <button className="btn btn-primary btn-sm">✅ Xác nhận đã nhận hàng</button>
                )}
                {order.status === 'processing' && (
                  <button className="btn btn-danger btn-sm">❌ Hủy đơn</button>
                )}
                <button className="btn btn-secondary btn-sm">💬 Liên hệ người bán</button>
                <button className="btn btn-secondary btn-sm">🔄 Mua lại</button>
                {order.status === 'delivered' && (
                  <button className="btn btn-secondary btn-sm">⭐ Đánh giá</button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="empty-state card">
            <div className="empty-state-icon">📦</div>
            <div className="empty-state-title">Không có đơn hàng</div>
            <div className="empty-state-desc">Hãy mua sắm vật tư nông nghiệp từ sàn TMĐT</div>
            <button className="btn btn-primary" style={{ marginTop: 16 }}>🛒 Mua sắm ngay</button>
          </div>
        )}
      </div>
    </div>
  );
}
