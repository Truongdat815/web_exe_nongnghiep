import { useState } from 'react';
import { auctionRequests } from '../data/mockData';

export default function AuctionPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [tab, setTab] = useState('buy');

  return (
    <div className="page-container animate-slide-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="page-title"><span className="icon">🔨</span> Đấu giá ngược (Reverse Auction)</h2>
          <p className="page-description">Nông dân đăng nhu cầu · Nhà phân phối cạnh tranh giá tốt nhất</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          ＋ Đăng yêu cầu mua
        </button>
      </div>

      {/* Explain */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { step: '1', icon: '📝', title: 'Nông dân đăng nhu cầu', desc: 'Mô tả sản phẩm cần mua, số lượng, ngân sách tối đa và địa điểm giao hàng' },
          { step: '2', icon: '🏭', title: 'Nhà cung cấp đặt giá', desc: 'Các nhà phân phối trong khu vực sẽ cạnh tranh bằng cách đưa ra giá thấp và ưu đãi tốt hơn' },
          { step: '3', icon: '✅', title: 'Chọn nhà cung cấp', desc: 'Bạn chọn nhà cung cấp tốt nhất. Hệ thống thu phí 2% từ gói thầu thành công.' },
        ].map(s => (
          <div key={s.step} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, background: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: 'white' }}>{s.step}</div>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{s.title}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-dimmed)', lineHeight: 1.5 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="tabs">
        <button className={`tab-btn ${tab === 'buy' ? 'active' : ''}`} onClick={() => setTab('buy')}>🛒 Mua vật tư</button>
        <button className={`tab-btn ${tab === 'sell' ? 'active' : ''}`} onClick={() => setTab('sell')}>🌾 Bán nông sản</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {auctionRequests.filter(a => tab === 'buy' ? a.buyerId === 'u001' || a.title.includes('mua') : a.title.includes('Thu mua')).map(req => (
          <div key={req.id} className="auction-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ flex: 1, paddingRight: 16 }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{req.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>{req.description}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="badge badge-blue">📍 {req.location}</span>
                  <span className="badge badge-yellow">⏰ Hạn: {new Date(req.deadline).toLocaleDateString('vi-VN')}</span>
                  <span className={`badge ${req.status === 'open' ? 'badge-green' : 'badge-gray'}`}>
                    {req.status === 'open' ? '● Đang nhận giá' : '● Đã đóng'}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--text-dimmed)', marginBottom: 2 }}>Ngân sách tối đa</div>
                <div className="auction-budget">{req.budget.toLocaleString('vi-VN')}₫</div>
              </div>
            </div>

            {/* Bids */}
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
                🏭 {req.bids.length} nhà cung cấp đã đặt giá:
              </div>
              {req.bids.map((bid, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < req.bids.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{bid.distributor}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>💡 {bid.note}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: i === 0 ? 'var(--color-accent)' : 'var(--color-primary-light)' }}>
                        {bid.price.toLocaleString('vi-VN')}₫
                      </div>
                      {i === 1 && <div style={{ fontSize: 10, color: 'var(--color-success)' }}>🏆 Giá tốt nhất</div>}
                    </div>
                    <button className="btn btn-primary btn-sm">✅ Chọn</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm">💬 Thương lượng</button>
              <button className="btn btn-secondary btn-sm">📋 Xem chi tiết</button>
              {req.status === 'open' && <button className="btn btn-danger btn-sm" style={{ marginLeft: 'auto' }}>🚫 Đóng thầu</button>}
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">📝 Đăng yêu cầu mua hàng</span>
              <button className="btn btn-secondary btn-icon" onClick={() => setShowCreate(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Tiêu đề</label>
              <input className="form-input" placeholder="Ví dụ: Cần mua 5 tấn phân NPK tại Đồng Tháp" />
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả chi tiết</label>
              <textarea className="form-input" rows={3} placeholder="Yêu cầu chất lượng, thời gian giao hàng, điều kiện thanh toán..."></textarea>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Ngân sách tối đa (₫)</label>
                <input className="form-input" type="number" placeholder="15000000" />
              </div>
              <div className="form-group">
                <label className="form-label">Địa điểm nhận</label>
                <input className="form-input" placeholder="Tỉnh/Huyện" />
              </div>
              <div className="form-group">
                <label className="form-label">Hạn nhận giá</label>
                <input className="form-input" type="date" />
              </div>
              <div className="form-group">
                <label className="form-label">Loại hàng</label>
                <select className="form-input" style={{ color: 'var(--text-primary)' }}>
                  <option>Phân bón</option>
                  <option>Thuốc BVTV</option>
                  <option>Thiết bị</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>🚀 Đăng thầu</button>
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
