import { useState } from 'react';
import { products } from '../data/mockData';

const categoryEmoji = {
  'Phân bón': '🌿',
  'Thuốc BVTV': '💊',
  'Thiết bị IoT': '📡',
};

const categories = ['Tất cả', 'Phân bón', 'Thuốc BVTV', 'Thiết bị IoT'];

function ProductCard({ product, onSelect }) {
  const discountedPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  return (
    <div className="product-card" onClick={() => onSelect(product)}>
      <div className="product-image">
        <span style={{ fontSize: 64 }}>{categoryEmoji[product.category] || '📦'}</span>
        {product.discount > 0 && (
          <span className="product-discount-badge">-{product.discount}%</span>
        )}
      </div>
      <div className="product-body">
        <div style={{ marginBottom: 4 }}>
          <span className={`badge ${product.category === 'Phân bón' ? 'badge-green' : product.category === 'Thuốc BVTV' ? 'badge-yellow' : 'badge-blue'}`} style={{ fontSize: 10 }}>
            {product.category}
          </span>
        </div>
        <div className="product-name">{product.name}</div>
        <div className="product-seller">🏭 {product.seller.name}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
          {product.tags.slice(0, 3).map(t => (
            <span key={t} className="tag" style={{ fontSize: 10 }}>#{t}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span className="product-price">{discountedPrice.toLocaleString('vi-VN')}₫</span>
          {product.discount > 0 && (
            <span className="product-original-price">{product.price.toLocaleString('vi-VN')}₫</span>
          )}
          <span style={{ fontSize: 11, color: 'var(--text-dimmed)' }}>/{product.unit}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <div className="product-rating">
            {'★'.repeat(Math.round(product.rating))} <span style={{ color: 'var(--text-dimmed)', marginLeft: 2 }}>({product.reviews})</span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-dimmed)' }}>Đã bán {product.sold}</span>
        </div>
        <button
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 10, justifyContent: 'center' }}
          onClick={e => { e.stopPropagation(); }}
        >
          🛒 Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}

function ProductModal({ product, onClose }) {
  const [qty, setQty] = useState(1);
  const discountedPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{product.name}</span>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>✕</button>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ width: 160, height: 160, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, flexShrink: 0 }}>
            {categoryEmoji[product.category] || '📦'}
          </div>
          <div style={{ flex: 1 }}>
            <span className={`badge ${product.category === 'Phân bón' ? 'badge-green' : 'badge-yellow'}`} style={{ marginBottom: 8, display: 'inline-block' }}>
              {product.category}
            </span>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
              {product.description}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {product.tags.map(t => <span key={t} className="tag">#{t}</span>)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--color-primary-light)' }}>
                {discountedPrice.toLocaleString('vi-VN')}₫
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-dimmed)' }}>/{product.unit}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid var(--border-primary)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-dimmed)' }}>Số lượng:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span style={{ fontWeight: 700, fontSize: 16, minWidth: 30, textAlign: 'center' }}>{qty}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-dimmed)' }}>
            Tổng: <strong style={{ color: 'var(--color-primary-light)', fontSize: 16 }}>{(discountedPrice * qty).toLocaleString('vi-VN')}₫</strong>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--text-dimmed)', marginBottom: 4 }}>🔒 Thanh toán Escrow</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>Tiền được giữ an toàn đến khi bạn xác nhận nhận hàng</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--text-dimmed)', marginBottom: 4 }}>🚚 Giao hàng</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>COD · Chuyển khoản · Ví điện tử. Giao 2-3 ngày</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>🛒 Đặt hàng ngay</button>
          <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>💬 Hỏi người bán</button>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [category, setCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered = products
    .filter(p => (category === 'Tất cả' || p.category === category))
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.includes(search.toLowerCase())));

  return (
    <div className="page-container animate-slide-in">
      <div className="page-header">
        <h2 className="page-title"><span className="icon">🛒</span> Sàn Thương mại Nông nghiệp</h2>
        <p className="page-description">Mua phân bón, thuốc BVTV, thiết bị IoT · {products.length} sản phẩm · Bảo đảm Escrow</p>
      </div>

      {/* AI Recommendation Banner */}
      <div className="alert-banner info" style={{ marginBottom: 20 }}>
        <span className="alert-icon">🤖</span>
        <div>
          <strong>AI gợi ý cho bạn:</strong> Dựa trên tình trạng vườn và nguy cơ rầy nâu tại khu vực, bạn nên mua <strong style={{ color: 'var(--color-accent)' }}>Thuốc Abamectin 3.6EC</strong> và <strong style={{ color: 'var(--color-accent)' }}>Phân NPK 20-20-15</strong> trong 3 ngày tới.
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="form-input"
          placeholder="🔍 Tìm sản phẩm hoặc 'Giải pháp bệnh X'..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, maxWidth: 400 }}
        />
        <div className="tabs" style={{ margin: 0 }}>
          {categories.map(c => (
            <button key={c} className={`tab-btn ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
              {c === 'Tất cả' ? '🌐' : categoryEmoji[c]} {c}
            </button>
          ))}
        </div>
        <select
          className="form-input"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{ width: 'auto', minWidth: 160, color: 'var(--text-primary)', background: 'var(--bg-input)' }}
        >
          <option value="popular">Bán chạy nhất</option>
          <option value="price_asc">Giá thấp đến cao</option>
          <option value="price_desc">Giá cao đến thấp</option>
          <option value="rating">Đánh giá cao nhất</option>
        </select>
      </div>

      {/* Products */}
      <div className="grid-auto">
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} onSelect={setSelectedProduct} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">Không tìm thấy sản phẩm</div>
          <div className="empty-state-desc">Thử tìm kiếm với từ khóa khác</div>
        </div>
      )}

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
