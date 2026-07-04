import { useMemo, useState, useRef, useEffect } from 'react';
import {
  BadgeCheck,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Leaf,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Star,
  Store,
  Tractor,
  X,
  History,
  Grid as GridIcon,
  List as ListIcon,
  MapPin,
  MessageSquare,
  ThumbsUp,
  ArrowLeft
} from 'lucide-react';
import { currency, addLedgerEntry, Badge } from './pageUtils';

const CATEGORY_TABS = [
  { id: 'all', label: 'Tất cả', icon: Boxes },
  { id: 'fertilizer', label: 'Phân bón', icon: Sprout },
  { id: 'tools', label: 'Nông cụ', icon: Tractor },
  { id: 'pesticide', label: 'Thuốc trừ sâu', icon: ShieldCheck },
];

const MOCK_REVIEWS = [
  { id: 1, user: 'Trần Văn A', rating: 5, date: '12/06/2026', comment: 'Giao hàng nhanh, xài rất tốt cho vườn chanh.', likes: 12 },
  { id: 2, user: 'Lê Thị B', rating: 4, date: '10/06/2026', comment: 'Đóng gói kỹ, sẽ ủng hộ tiếp.', likes: 5 },
  { id: 3, user: 'Nguyễn Văn C', rating: 5, date: '01/06/2026', comment: 'Giá rẻ hơn mua đại lý ngoài, chất lượng đảm bảo.', likes: 2 },
];

const MARKET_CATALOG = [
  {
    id: 'prd-npk-9999',
    name: 'NPK hữu cơ sinh học 16-16-8',
    category: 'fertilizer',
    categoryLabel: 'Phân bón',
    seller: 'Đại lý Vật tư Út Chanh',
    distanceKm: 4.8,
    price: 600000,
    unit: 'bao 50kg',
    stock: 42,
    rating: 4.8,
    sold: 1260,
    badge: 'Gợi ý cho chanh',
    color: '#16a34a',
    image: 'https://loremflickr.com/720/520/fertilizer,bag,agriculture?lock=1101',
    description: 'Cân bằng dinh dưỡng cho chanh không hạt, khóm và cây ăn trái sau thu hoạch.',
    uses: ['Bón gốc', 'Phục hồi cây', 'Tăng đọt khỏe'],
    shopInfo: { name: 'Đại lý Vật tư Út Chanh', totalProducts: 145, responseRate: '98%', joined: '2 năm trước' },
    variants: [
      { id: 'v1', name: 'Bao 50kg', price: 600000, stock: 42 },
      { id: 'v2', name: 'Bao 25kg', price: 320000, stock: 15 },
    ],
    reviews: MOCK_REVIEWS,
  },
  {
    id: 'prd-tricho',
    name: 'Trichoderma cải tạo đất',
    category: 'fertilizer',
    categoryLabel: 'Phân bón',
    seller: 'Nông nghiệp Xanh Long An',
    distanceKm: 11.2,
    price: 220000,
    unit: 'gói 1kg',
    stock: 18,
    rating: 4.6,
    sold: 885,
    badge: 'Vi sinh đất',
    color: '#65a30d',
    image: 'https://loremflickr.com/720/520/organic,fertilizer,soil?lock=1102',
    description: 'Hỗ trợ hệ rễ, giảm nấm đất và phục hồi vườn sau ngập úng.',
    uses: ['Cải tạo đất', 'Hỗ trợ rễ', 'Sau mưa kéo dài'],
    shopInfo: { name: 'Nông nghiệp Xanh Long An', totalProducts: 89, responseRate: '95%', joined: '1 năm trước' },
    variants: [
      { id: 'v1', name: 'Gói 1kg', price: 220000, stock: 18 },
      { id: 'v2', name: 'Thùng 10kg', price: 1950000, stock: 5 },
    ],
    reviews: MOCK_REVIEWS,
  },
  {
    id: 'tool-sprayer-16l',
    name: 'Bình phun điện 16L pin lithium',
    category: 'tools',
    categoryLabel: 'Nông cụ',
    seller: 'Cửa hàng Nông cụ Phú An',
    distanceKm: 6.1,
    price: 690000,
    unit: 'bộ',
    stock: 9,
    rating: 4.7,
    sold: 412,
    badge: 'Bảo hành 6 tháng',
    color: '#0f766e',
    image: 'https://www.greenhousepolytunnels.com.au/cdn/shop/files/pixelcut-export_25.png?v=1762613472&width=1090',
    description: 'Phù hợp phun vi sinh, phân bón lá và thuốc BVTV cho vườn nhỏ.',
    uses: ['Phun đều', 'Tiết kiệm công', 'Pin sạc'],
    shopInfo: { name: 'Cửa hàng Nông cụ Phú An', totalProducts: 310, responseRate: '99%', joined: '3 năm trước' },
    variants: [
      { id: 'v1', name: '16 Lít', price: 690000, stock: 9 },
      { id: 'v2', name: '20 Lít', price: 790000, stock: 4 },
    ],
    reviews: MOCK_REVIEWS,
  },
  {
    id: 'tool-pruner',
    name: 'Kéo cắt cành thép SK5',
    category: 'tools',
    categoryLabel: 'Nông cụ',
    seller: 'Đại lý Vật tư Út Chanh',
    distanceKm: 4.8,
    price: 125000,
    unit: 'cái',
    stock: 24,
    rating: 4.4,
    sold: 770,
    badge: 'Bán chạy',
    color: '#0d9488',
    image: 'https://loremflickr.com/720/520/pruning,shears,garden?lock=1103',
    description: 'Dùng tỉa lá bệnh, cành tăm và tạo tán cho cây có múi.',
    uses: ['Tỉa lá bệnh', 'Tạo tán', 'Cắt cành nhỏ'],
    shopInfo: { name: 'Đại lý Vật tư Út Chanh', totalProducts: 145, responseRate: '98%', joined: '2 năm trước' },
    variants: [
      { id: 'v1', name: 'Size M', price: 125000, stock: 24 },
      { id: 'v2', name: 'Size L', price: 155000, stock: 12 },
    ],
    reviews: MOCK_REVIEWS,
  },
  {
    id: 'prd-copper',
    name: 'Nano đồng bạc phòng nấm lá',
    category: 'pesticide',
    categoryLabel: 'Thuốc trừ sâu',
    seller: 'Đại lý Vật tư Út Chanh',
    distanceKm: 4.8,
    price: 185000,
    unit: 'chai 500ml',
    stock: 26,
    rating: 4.7,
    sold: 1042,
    badge: 'Sinh học',
    color: '#dc2626',
    image: 'https://yatanstore.com/cdn/shop/files/nano-copper.jpg?v=1759242718&width=1445',
    description: 'Hỗ trợ phòng nấm lá, thán thư và đốm lá khi dùng đúng liều khuyến cáo.',
    uses: ['Nấm lá', 'Sau mưa', 'Cây có múi'],
    shopInfo: { name: 'Đại lý Vật tư Út Chanh', totalProducts: 145, responseRate: '98%', joined: '2 năm trước' },
    variants: [
      { id: 'v1', name: 'Chai 500ml', price: 185000, stock: 26 },
      { id: 'v2', name: 'Can 5L', price: 1650000, stock: 8 },
    ],
    reviews: MOCK_REVIEWS,
  },
];

function getCategoryIcon(category) {
  if (category === 'fertilizer') return Sprout;
  if (category === 'tools') return Tractor;
  return ShieldCheck;
}

function ProductVisual({ product, Icon, className = '' }) {
  return (
    <div className={`market-product-photo ${className}`} style={{ '--product-color': product.color }}>
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      )}
      <div className="market-photo-fallback">
        <Icon size={34} />
      </div>
      <Badge>{product.badge}</Badge>
    </div>
  );
}

export function MarketplacePage({ state, setState, notify }) {
  const [catalog, setCatalog] = useState(MARKET_CATALOG);
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  
  // E-commerce specific states
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  
  // Search features
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchHistory, setSearchHistory] = useState(['NPK 16-16-8', 'Bình xịt điện', 'Thuốc trừ sâu sinh học', 'Kéo cắt cành']);
  const searchInputRef = useRef(null);

  const filteredCatalog = useMemo(() => {
    const text = query.trim().toLowerCase();
    return catalog.filter((product) => {
      const matchCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchQuery = !text || [product.name, product.categoryLabel, product.seller, product.description, ...product.uses]
        .join(' ')
        .toLowerCase()
        .includes(text);
      return matchCategory && matchQuery;
    });
  }, [activeCategory, catalog, query]);

  const cartLines = cart
    .map((line) => {
      const product = catalog.find((item) => item.id === line.productId);
      return product ? { ...line, product, lineTotal: line.quantity * line.price } : null;
    })
    .filter(Boolean);

  const cartTotal = cartLines.reduce((sum, line) => sum + line.lineTotal, 0);
  const escrowFee = Math.round(cartTotal * 0.03);

  const handleSearchFocus = () => setShowSearchDropdown(true);
  
  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const executeSearch = (searchTerm) => {
    setQuery(searchTerm);
    setShowSearchDropdown(false);
    if (searchTerm && !searchHistory.includes(searchTerm)) {
      setSearchHistory(prev => [searchTerm, ...prev].slice(0, 5));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch(query);
    }
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  const addToCart = (product, variant = null, quantity = 1, silent = false) => {
    const activeVariant = variant || (product.variants ? product.variants[0] : null);
    const stock = activeVariant ? activeVariant.stock : product.stock;
    const price = activeVariant ? activeVariant.price : product.price;
    const itemKey = activeVariant ? `${product.id}-${activeVariant.id}` : product.id;
    const itemName = activeVariant ? `${product.name} - ${activeVariant.name}` : product.name;

    if (stock <= 0) {
      notify(`${itemName} đã hết hàng.`);
      return;
    }

    setCart((prev) => {
      const current = prev.find((item) => item.itemKey === itemKey);
      if (current) {
        if (current.quantity + quantity > stock) {
          if (!silent) notify(`Không thể thêm quá tồn kho ${stock}.`);
          return prev;
        }
        return prev.map((item) => item.itemKey === itemKey ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { itemKey, productId: product.id, variantId: activeVariant?.id, price, name: itemName, quantity }];
    });
    
    if (!silent) {
      notify(`Đã thêm ${itemName} vào giỏ vật tư.`);
      setCartOpen(true);
    }
  };

  const changeQuantity = (itemKey, delta) => {
    setCart((prev) => prev
      .map((line) => {
        if (line.itemKey !== itemKey) return line;
        const product = catalog.find((item) => item.id === line.productId);
        const variant = product?.variants?.find(v => v.id === line.variantId);
        const maxStock = variant ? variant.stock : (product?.stock || 0);
        const nextQuantity = Math.max(0, Math.min(maxStock, line.quantity + delta));
        return { ...line, quantity: nextQuantity };
      })
      .filter((line) => line.quantity > 0));
  };

  const checkoutCart = () => {
    if (cartLines.length === 0) {
      notify('Bạn chọn vật tư vào giỏ trước nha.');
      return;
    }
    setCart([]);
    setCartOpen(false);
    notify(`Đã tạo đơn escrow ${currency(cartTotal)} cho giỏ vật tư.`);
  };

  if (selectedProduct) {
    const Icon = getCategoryIcon(selectedProduct.category);
    return (
      <section className="farmer-supply-market detail-view">
        <header className="supply-detail-header">
          <button className="back-btn" onClick={closeProductDetail}>
            <ArrowLeft size={20} />
          </button>
          <h2>Chi tiết sản phẩm</h2>
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            <ShoppingCart size={20} />
            {cartLines.length > 0 && <span className="cart-badge">{cartLines.length}</span>}
          </button>
        </header>

        <main className="supply-detail-main">
          {/* Product Visual */}
          <ProductVisual product={selectedProduct} Icon={Icon} className="detail-visual-box" />

          {/* Product Info */}
          <div className="detail-info-box">
            <div className="detail-price-row">
              <span className="price">{currency(selectedVariant ? selectedVariant.price : selectedProduct.price)}</span>
            </div>
            <h1 className="detail-title">{selectedProduct.name}</h1>
            <div className="detail-stats">
              <span className="rating"><Star size={14} fill="currentColor" /> {selectedProduct.rating}</span>
              <span className="sold">Đã bán {selectedProduct.sold}</span>
            </div>
          </div>

          {/* Variants */}
          {selectedProduct.variants && selectedProduct.variants.length > 0 && (
            <div className="detail-section">
              <h3 className="section-title">Phân loại hàng</h3>
              <div className="variants-list">
                {selectedProduct.variants.map(v => (
                  <button 
                    key={v.id} 
                    className={`variant-btn ${selectedVariant?.id === v.id ? 'active' : ''}`}
                    onClick={() => setSelectedVariant(v)}
                    disabled={v.stock <= 0}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
              <p className="stock-info">Kho: {selectedVariant ? selectedVariant.stock : selectedProduct.stock}</p>
            </div>
          )}

          {/* Shop Info */}
          <div className="detail-shop-card">
            <div className="shop-avatar">
              <Store size={24} />
            </div>
            <div className="shop-info">
              <strong>{selectedProduct.shopInfo.name}</strong>
              <div className="shop-stats-mini">
                <span><MapPin size={12} /> {selectedProduct.distanceKm}km</span>
                <span>• {selectedProduct.shopInfo.totalProducts} Sản phẩm</span>
              </div>
            </div>
            <button className="view-shop-btn">Xem Shop</button>
          </div>

          {/* Description */}
          <div className="detail-section">
            <h3 className="section-title">Mô tả sản phẩm</h3>
            <p className="description-text">{selectedProduct.description}</p>
            <div className="supply-use-row" style={{ marginTop: '12px' }}>
              {selectedProduct.uses.map((use) => <span key={use}>{use}</span>)}
            </div>
          </div>

          {/* Reviews */}
          <div className="detail-section">
            <div className="reviews-header">
              <h3 className="section-title">Đánh giá sản phẩm ({selectedProduct.reviews.length})</h3>
              <span className="rating-summary"><Star size={14} fill="var(--amber-600)" color="var(--amber-600)" /> {selectedProduct.rating}/5</span>
            </div>
            <div className="reviews-list">
              {selectedProduct.reviews.map(review => (
                <div key={review.id} className="review-item">
                  <div className="review-user-avatar">{review.user.charAt(0)}</div>
                  <div className="review-content">
                    <div className="review-meta">
                      <strong>{review.user}</strong>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <div className="review-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} fill={i < review.rating ? "var(--amber-600)" : "transparent"} color={i < review.rating ? "var(--amber-600)" : "var(--slate-200)"} />
                      ))}
                    </div>
                    <p className="review-text">{review.comment}</p>
                    <button className="like-btn"><ThumbsUp size={12} /> Hữu ích ({review.likes})</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <div className="detail-bottom-bar">
          <button className="chat-btn"><MessageSquare size={20} /><span>Chat</span></button>
          <button className="add-cart-btn" onClick={() => addToCart(selectedProduct, selectedVariant)}>Thêm vào giỏ</button>
          <button className="buy-now-btn" onClick={() => { addToCart(selectedProduct, selectedVariant, 1, true); setCartOpen(true); }}>Mua ngay</button>
        </div>

        {cartOpen && <button className="supply-cart-backdrop" aria-label="Đóng giỏ hàng" onClick={() => setCartOpen(false)} />}
        <aside className={`supply-cart ${cartOpen ? 'open' : ''}`}>
          <div className="supply-cart-head">
            <div>
              <p className="eyebrow">Giỏ vật tư</p>
              <h2>Thanh toán escrow</h2>
            </div>
            <button className="supply-cart-close" onClick={() => setCartOpen(false)} aria-label="Đóng giỏ hàng">
              <X size={17} />
            </button>
          </div>

          {cartLines.length === 0 ? (
            <div className="supply-cart-empty">
              <ShoppingCart size={34} />
              <strong>Giỏ hàng trống</strong>
            </div>
          ) : (
            <div className="supply-cart-list">
              {cartLines.map((line) => (
                <div key={line.itemKey} className="supply-cart-item">
                  <div>
                    <strong>{line.name}</strong>
                    <span>{currency(line.price)}</span>
                  </div>
                  <div className="supply-qty">
                    <button onClick={() => changeQuantity(line.itemKey, -1)}><ChevronLeft size={15} /></button>
                    <span>{line.quantity}</span>
                    <button onClick={() => changeQuantity(line.itemKey, 1)}><ChevronRight size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="supply-total-box">
            <div className="grand"><span>Tổng thanh toán</span><strong>{currency(cartTotal)}</strong></div>
          </div>
          <button className="supply-checkout" onClick={checkoutCart} disabled={cartLines.length === 0}>
            Tạo đơn ký quỹ
          </button>
        </aside>
      </section>
    );
  }

  // --- Main Catalog View ---
  return (
    <section className="farmer-supply-market shopee-style">
      {/* Search Header */}
      <div className="shopee-header">
        <div className="shopee-search-container" ref={searchInputRef}>
          <div className="shopee-search-bar">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={handleSearchFocus}
              onKeyDown={handleKeyDown}
              placeholder="Tìm NPK, bình phun, thuốc nấm..."
            />
            {query && (
              <button className="clear-btn" onClick={() => { setQuery(''); searchInputRef.current.querySelector('input').focus(); }}>
                <X size={16} />
              </button>
            )}
            <button className="shopee-search-btn" onClick={() => executeSearch(query)}>Tìm kiếm</button>
          </div>
          
          {/* Search Dropdown / History */}
          {showSearchDropdown && (
            <div className="search-dropdown">
              <div className="dropdown-header">
                <History size={14} /> Lịch sử tìm kiếm
              </div>
              <ul className="history-list">
                {searchHistory.map((term, index) => (
                  <li key={index} onMouseDown={() => executeSearch(term)}>
                    {term}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button className="shopee-cart-icon" onClick={() => setCartOpen(true)}>
          <ShoppingCart size={24} />
          {cartLines.length > 0 && <span className="cart-badge">{cartLines.length}</span>}
        </button>
      </div>

      <div className="supply-layout">
        <main className="supply-main">
          {/* Daily Discover Horizontal Carousel */}
          {!query && (
            <div className="carousel-section">
              <div className="carousel-header">
                <h2><Sparkles size={18} color="var(--amber-600)" /> Gợi ý hôm nay</h2>
                <a href="#">Xem tất cả &gt;</a>
              </div>
              <div className="product-carousel">
                {catalog.slice(0, 4).map(product => {
                  const Icon = getCategoryIcon(product.category);
                  return (
                    <article key={product.id} className="carousel-card" onClick={() => openProductDetail(product)}>
                      <ProductVisual product={product} Icon={Icon} className="carousel-visual" />
                      <div className="carousel-body">
                        <h3>{product.name}</h3>
                        <div className="price-row">
                          <strong>{currency(product.price)}</strong>
                          <span className="sold">Đã bán {product.sold > 1000 ? `${(product.sold/1000).toFixed(1)}k` : product.sold}</span>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          )}

          <div className="shopee-toolbar">
            <div className="supply-tabs">
              {CATEGORY_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={activeCategory === tab.id ? 'active' : ''}
                    onClick={() => setActiveCategory(tab.id)}
                  >
                    <Icon size={16} /> {tab.label}
                  </button>
                );
              })}
            </div>
            <div className="view-toggles desktop-only">
              <button className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                <GridIcon size={18} />
              </button>
              <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                <ListIcon size={18} />
              </button>
            </div>
          </div>

          <div className={`supply-product-${viewMode} shopee-grid`}>
            {filteredCatalog.length === 0 ? (
              <div className="empty-state">
                <Search size={40} />
                <p>Không tìm thấy sản phẩm nào</p>
              </div>
            ) : (
              filteredCatalog.map((product) => {
                const Icon = getCategoryIcon(product.category);
                return (
                  <article key={product.id} className={`shopee-product-card ${viewMode}`} onClick={() => openProductDetail(product)}>
                    <ProductVisual product={product} Icon={Icon} className="shopee-product-visual" />
                    <div className="shopee-product-body">
                      <h3>{product.name}</h3>
                      <div className="shopee-tags">
                        <span className="tag-outline">{product.categoryLabel}</span>
                        {product.uses.slice(0, 1).map((use) => <span key={use} className="tag-fill">{use}</span>)}
                      </div>
                      <div className="shopee-price-row">
                        <strong>{currency(product.price)}</strong>
                      </div>
                      <div className="shopee-meta-row">
                        <span className="rating"><Star size={11} fill="var(--amber-600)" color="var(--amber-600)" /> {product.rating}</span>
                        <span className="sold">Đã bán {product.sold > 1000 ? `${(product.sold/1000).toFixed(1)}k` : product.sold}</span>
                        <span className="location">{product.distanceKm}km</span>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </main>

        {cartOpen && <button className="supply-cart-backdrop" aria-label="Đóng giỏ hàng" onClick={() => setCartOpen(false)} />}
        <aside className={`supply-cart ${cartOpen ? 'open' : ''}`}>
          <div className="supply-cart-head">
            <div>
              <p className="eyebrow">Giỏ vật tư</p>
              <h2>Thanh toán escrow</h2>
            </div>
            <button className="supply-cart-close" onClick={() => setCartOpen(false)} aria-label="Đóng giỏ hàng">
              <X size={17} />
            </button>
          </div>

          {cartLines.length === 0 ? (
            <div className="supply-cart-empty">
              <ShoppingCart size={34} />
              <strong>Giỏ hàng trống</strong>
            </div>
          ) : (
            <div className="supply-cart-list">
              {cartLines.map((line) => (
                <div key={line.itemKey} className="supply-cart-item">
                  <div>
                    <strong>{line.name}</strong>
                    <span>{currency(line.price)}</span>
                  </div>
                  <div className="supply-qty">
                    <button onClick={() => changeQuantity(line.itemKey, -1)}><ChevronLeft size={15} /></button>
                    <span>{line.quantity}</span>
                    <button onClick={() => changeQuantity(line.itemKey, 1)}><ChevronRight size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="supply-total-box">
            <div className="grand"><span>Tổng thanh toán</span><strong>{currency(cartTotal)}</strong></div>
          </div>

          <button className="supply-checkout" onClick={checkoutCart} disabled={cartLines.length === 0}>
            Tạo đơn ký quỹ
          </button>
        </aside>
      </div>
    </section>
  );
}
