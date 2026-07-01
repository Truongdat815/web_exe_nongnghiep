import { useMemo, useState } from 'react';
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
} from 'lucide-react';
import { currency, addLedgerEntry, Badge } from './pageUtils';

const CATEGORY_TABS = [
  { id: 'all', label: 'Tất cả', icon: Boxes },
  { id: 'fertilizer', label: 'Phân bón', icon: Sprout },
  { id: 'tools', label: 'Nông cụ', icon: Tractor },
  { id: 'pesticide', label: 'Thuốc trừ sâu', icon: ShieldCheck },
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
    sold: 126,
    badge: 'Gợi ý cho chanh',
    color: '#16a34a',
    description: 'Cân bằng dinh dưỡng cho chanh không hạt, khóm và cây ăn trái sau thu hoạch.',
    uses: ['Bón gốc', 'Phục hồi cây', 'Tăng đọt khỏe'],
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
    sold: 88,
    badge: 'Vi sinh đất',
    color: '#65a30d',
    description: 'Hỗ trợ hệ rễ, giảm nấm đất và phục hồi vườn sau ngập úng.',
    uses: ['Cải tạo đất', 'Hỗ trợ rễ', 'Sau mưa kéo dài'],
  },
  {
    id: 'prd-humic',
    name: 'Humic rong biển phục hồi rễ',
    category: 'fertilizer',
    categoryLabel: 'Phân bón',
    seller: 'HTX Vật tư Bến Lức',
    distanceKm: 7.4,
    price: 145000,
    unit: 'chai 1L',
    stock: 31,
    rating: 4.5,
    sold: 63,
    badge: 'Chống sốc cây',
    color: '#15803d',
    description: 'Dùng sau mưa, sau mặn nhẹ hoặc sau khi cây suy rễ.',
    uses: ['Phục hồi rễ', 'Giảm sốc mặn', 'Tăng hấp thu'],
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
    sold: 41,
    badge: 'Bảo hành 6 tháng',
    color: '#0f766e',
    description: 'Phù hợp phun vi sinh, phân bón lá và thuốc BVTV cho vườn nhỏ.',
    uses: ['Phun đều', 'Tiết kiệm công', 'Pin sạc'],
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
    sold: 77,
    badge: 'Bán chạy',
    color: '#0d9488',
    description: 'Dùng tỉa lá bệnh, cành tăm và tạo tán cho cây có múi.',
    uses: ['Tỉa lá bệnh', 'Tạo tán', 'Cắt cành nhỏ'],
  },
  {
    id: 'tool-drip-kit',
    name: 'Bộ tưới nhỏ giọt 100 gốc',
    category: 'tools',
    categoryLabel: 'Nông cụ',
    seller: 'IoT Farm Supply Long An',
    distanceKm: 12.6,
    price: 880000,
    unit: 'combo',
    stock: 7,
    rating: 4.8,
    sold: 29,
    badge: 'Hợp ESP32',
    color: '#0284c7',
    description: 'Ống, béc nhỏ giọt và phụ kiện đấu nối cho vườn chanh/khóm.',
    uses: ['Tưới tiết kiệm', 'Dễ gắn relay', 'Giảm nấm lá'],
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
    sold: 104,
    badge: 'Sinh học',
    color: '#dc2626',
    description: 'Hỗ trợ phòng nấm lá, thán thư và đốm lá khi dùng đúng liều khuyến cáo.',
    uses: ['Nấm lá', 'Sau mưa', 'Cây có múi'],
  },
  {
    id: 'pest-neem',
    name: 'Dầu Neem sinh học xua côn trùng',
    category: 'pesticide',
    categoryLabel: 'Thuốc trừ sâu',
    seller: 'Nông nghiệp Xanh Long An',
    distanceKm: 11.2,
    price: 165000,
    unit: 'chai 500ml',
    stock: 20,
    rating: 4.5,
    sold: 58,
    badge: 'Ít tồn dư',
    color: '#b45309',
    description: 'Dùng trong quản lý rầy mềm, bọ trĩ và côn trùng chích hút ở mật số thấp.',
    uses: ['Bọ trĩ', 'Rầy mềm', 'Đọt non'],
  },
  {
    id: 'pest-sticky-trap',
    name: 'Bẫy dính vàng treo vườn',
    category: 'pesticide',
    categoryLabel: 'Thuốc trừ sâu',
    seller: 'HTX Vật tư Bến Lức',
    distanceKm: 7.4,
    price: 45000,
    unit: 'xấp 20 tấm',
    stock: 55,
    rating: 4.3,
    sold: 140,
    badge: 'Theo dõi sâu hại',
    color: '#ca8a04',
    description: 'Giúp theo dõi mật số côn trùng trước khi quyết định phun thuốc.',
    uses: ['Giám sát vườn', 'Bọ phấn', 'Ruồi vàng'],
  },
];

function getCategoryIcon(category) {
  if (category === 'fertilizer') return Sprout;
  if (category === 'tools') return Tractor;
  return ShieldCheck;
}

export function MarketplacePage({ state, setState, notify }) {
  const [catalog, setCatalog] = useState(MARKET_CATALOG);
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);

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
      return product ? { ...line, product, lineTotal: line.quantity * product.price } : null;
    })
    .filter(Boolean);

  const cartTotal = cartLines.reduce((sum, line) => sum + line.lineTotal, 0);
  const escrowFee = Math.round(cartTotal * 0.03);

  const addToCart = (product) => {
    if (product.stock <= 0) {
      notify(`${product.name} đã hết hàng.`);
      return;
    }
    setCart((prev) => {
      const current = prev.find((item) => item.productId === product.id);
      if (current) {
        if (current.quantity >= product.stock) {
          notify(`Không thể thêm quá tồn kho ${product.stock} ${product.unit}.`);
          return prev;
        }
        return prev.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId: product.id, quantity: 1 }];
    });
    notify(`Đã thêm ${product.name} vào giỏ vật tư.`);
  };

  const changeQuantity = (productId, delta) => {
    setCart((prev) => prev
      .map((line) => {
        if (line.productId !== productId) return line;
        const product = catalog.find((item) => item.id === productId);
        const nextQuantity = Math.max(0, Math.min((product?.stock || 0), line.quantity + delta));
        return { ...line, quantity: nextQuantity };
      })
      .filter((line) => line.quantity > 0));
  };

  const checkoutCart = () => {
    if (cartLines.length === 0) {
      notify('Bạn chọn vật tư vào giỏ trước nha.');
      return;
    }

    setCatalog((prev) => prev.map((product) => {
      const line = cartLines.find((item) => item.product.id === product.id);
      return line ? { ...product, stock: Math.max(0, product.stock - line.quantity) } : product;
    }));

    setState((prev) => {
      const order = {
        id: `ORD-${Date.now().toString().slice(-5)}`,
        buyer: 'Ngô Hoàng Trường Đạt',
        distributor: cartLines.length === 1 ? cartLines[0].product.seller : 'Nhiều đại lý nội vùng',
        product: cartLines.length === 1 ? cartLines[0].product.name : `${cartLines.length} mặt hàng vật tư`,
        quantity: cartLines.reduce((sum, line) => sum + line.quantity, 0),
        total: cartTotal,
        platformFee: escrowFee,
        netAmount: cartTotal - escrowFee,
        status: 'Paid_Escrow',
        countdownHours: 48,
        createdAt: new Date().toISOString(),
        items: cartLines.map((line) => ({
          productId: line.product.id,
          name: line.product.name,
          quantity: line.quantity,
          unit: line.product.unit,
          price: line.product.price,
        })),
      };

      return addLedgerEntry(
        {
          ...prev,
          products: prev.products.map((product) => {
            const line = cartLines.find((item) => item.product.id === product.id);
            return line ? { ...product, stock: Math.max(0, product.stock - line.quantity) } : product;
          }),
          orders: [order, ...prev.orders],
        },
        {
          type: 'Escrow_Event',
          title: `Checkout escrow ${order.id}`,
          detail: `Khóa ${currency(cartTotal)} cho giỏ vật tư gồm ${cartLines.map((line) => `${line.quantity} ${line.product.unit} ${line.product.name}`).join(', ')}.`,
        },
      );
    });

    setCart([]);
    notify(`Đã tạo đơn escrow ${currency(cartTotal)} cho giỏ vật tư.`);
  };

  return (
    <section className="farmer-supply-market">
      <header className="supply-hero">
        <div>
          <p className="eyebrow">Sàn vật tư nông nghiệp</p>
          <h1>Mua phân bón, nông cụ và thuốc trừ sâu chính hãng</h1>
          <p>Chọn vật tư nội vùng, thanh toán escrow và theo dõi giao hàng ngay trong GREENOVA.</p>
        </div>
        <div className="supply-hero-card">
          <Sparkles size={20} />
          <strong>Gợi ý hôm nay</strong>
          <span>Vườn đang ẩm cao sau mưa, ưu tiên Trichoderma, Nano đồng bạc và bẫy dính để theo dõi sâu hại.</span>
        </div>
      </header>

      <div className="supply-stat-row">
        <div><Store size={18} /><span>Đại lý nội vùng</span><strong>6</strong></div>
        <div><BadgeCheck size={18} /><span>Sản phẩm xác thực</span><strong>{catalog.length}</strong></div>
        <div><PackageCheck size={18} /><span>Giao trong ngày</span><strong>15km</strong></div>
        <div><ShoppingCart size={18} /><span>Trong giỏ</span><strong>{cartLines.length}</strong></div>
      </div>

      <div className="supply-layout">
        <main className="supply-main">
          <div className="supply-toolbar">
            <div className="supply-search">
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm NPK, bình phun, thuốc nấm, bẫy dính..."
              />
            </div>
            <button onClick={() => notify('Bộ lọc nâng cao sẽ nối dữ liệu đại lý ở phase sau.')}>
              <SlidersHorizontal size={17} /> Bộ lọc
            </button>
          </div>

          <div className="supply-tabs">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={activeCategory === tab.id ? 'active' : ''}
                  onClick={() => setActiveCategory(tab.id)}
                >
                  <Icon size={17} /> {tab.label}
                </button>
              );
            })}
          </div>

          <div className="supply-product-grid">
            {filteredCatalog.map((product) => {
              const Icon = getCategoryIcon(product.category);
              return (
                <article key={product.id} className="supply-product-card">
                  <div className="supply-product-visual" style={{ '--product-color': product.color }}>
                    <Icon size={34} />
                    <span>{product.categoryLabel}</span>
                  </div>
                  <div className="supply-product-body">
                    <div className="supply-card-top">
                      <Badge>{product.badge}</Badge>
                      <span><Star size={13} /> {product.rating}</span>
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="supply-use-row">
                      {product.uses.map((use) => <span key={use}>{use}</span>)}
                    </div>
                    <div className="supply-seller">
                      <Store size={15} />
                      <span>{product.seller} · {product.distanceKm}km · đã bán {product.sold}</span>
                    </div>
                    <div className="supply-buy-row">
                      <div>
                        <strong>{currency(product.price)}</strong>
                        <span>Còn {product.stock} {product.unit}</span>
                      </div>
                      <button disabled={product.stock <= 0} onClick={() => addToCart(product)}>
                        <ShoppingCart size={16} /> Thêm
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </main>

        <aside className="supply-cart">
          <div className="supply-cart-head">
            <div>
              <p className="eyebrow">Giỏ vật tư</p>
              <h2>Thanh toán escrow</h2>
            </div>
            <ShoppingCart size={22} />
          </div>

          {cartLines.length === 0 ? (
            <div className="supply-cart-empty">
              <Leaf size={34} />
              <strong>Chưa có vật tư</strong>
              <p>Thêm phân bón, nông cụ hoặc thuốc trừ sâu để tạo đơn ký quỹ.</p>
            </div>
          ) : (
            <div className="supply-cart-list">
              {cartLines.map((line) => (
                <div key={line.product.id} className="supply-cart-item">
                  <div>
                    <strong>{line.product.name}</strong>
                    <span>{currency(line.product.price)} / {line.product.unit}</span>
                  </div>
                  <div className="supply-qty">
                    <button onClick={() => changeQuantity(line.product.id, -1)}><ChevronLeft size={15} /></button>
                    <span>{line.quantity}</span>
                    <button onClick={() => changeQuantity(line.product.id, 1)}><ChevronRight size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="supply-total-box">
            <div><span>Tạm tính</span><strong>{currency(cartTotal)}</strong></div>
            <div><span>Phí nền tảng 3%</span><strong>{currency(escrowFee)}</strong></div>
            <div className="grand"><span>Tổng ký quỹ</span><strong>{currency(cartTotal)}</strong></div>
          </div>

          <button className="supply-checkout" onClick={checkoutCart} disabled={cartLines.length === 0}>
            <ShieldCheck size={17} /> Tạo đơn escrow
          </button>
          <p className="supply-note">Tiền được khóa 48h, chỉ giải ngân cho đại lý sau khi nông dân xác nhận nhận hàng.</p>
        </aside>
      </div>
    </section>
  );
}
