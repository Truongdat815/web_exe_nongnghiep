import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  BarChart3,
  Boxes,
  CalendarClock,
  Camera,
  CheckCircle2,
  Edit3,
  ImagePlus,
  MapPin,
  Package,
  Plus,
  QrCode,
  ReceiptText,
  Save,
  ShoppingBag,
  Sparkles,
  Store,
  Trash2,
  UserRound,
  WalletCards,
} from 'lucide-react';
import { Badge, currency } from './pageUtils';

const DEFAULT_CATEGORIES = ['Phân bón', 'Thuốc trừ sâu', 'Nông cụ', 'Hạt giống', 'Vi sinh đất'];

const DEFAULT_PRODUCTS = [
  {
    id: 'prd-npk-9999',
    name: 'NPK hữu cơ sinh học 16-16-8',
    category: 'Phân bón',
    price: 600000,
    stock: 42,
    unit: 'bao 50kg',
    expiry: '2027-03-12',
    manufacturer: 'BioAgri Việt Nam',
    exclusive: true,
    weight: '50kg',
    detail: 'Phân hữu cơ cân bằng dinh dưỡng cho chanh, khóm và cây ăn trái.',
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=900&q=80',
    sold: 1260,
  },
  {
    id: 'prd-copper',
    name: 'Nano đồng bạc phòng nấm lá',
    category: 'Thuốc trừ sâu',
    price: 185000,
    stock: 26,
    unit: 'chai 500ml',
    expiry: '2026-09-20',
    manufacturer: 'GreenCare Lab',
    exclusive: false,
    weight: '500ml',
    detail: 'Chế phẩm sinh học hỗ trợ phòng nấm lá, thán thư và đốm lá.',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=900&q=80',
    sold: 1042,
  },
  {
    id: 'tool-sprayer-16l',
    name: 'Bình phun điện 16L pin lithium',
    category: 'Nông cụ',
    price: 690000,
    stock: 9,
    unit: 'bộ',
    expiry: 'Không áp dụng',
    manufacturer: 'Phú An Tools',
    exclusive: false,
    weight: '4.2kg',
    detail: 'Bình phun điện dùng cho vi sinh, phân bón lá và thuốc BVTV.',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=80',
    sold: 412,
  },
];

const DEFAULT_REQUESTS = [
  { id: 'REQ-001', farmer: 'Ngô Hoàng Trường Đạt', productId: 'prd-npk-9999', quantity: 2, pickupTime: 'Hôm nay · 16:30', status: 'pending' },
  { id: 'REQ-002', farmer: 'Mai Thị Lan', productId: 'prd-copper', quantity: 3, pickupTime: 'Ngày mai · 08:00', status: 'pending' },
  { id: 'REQ-003', farmer: 'Phạm Văn Tín', productId: 'tool-sprayer-16l', quantity: 1, pickupTime: '05/07 · 10:15', status: 'ready' },
];

const DEFAULT_HISTORY = [
  { id: 'BILL-8841', customer: 'Ngô Hoàng Trường Đạt', product: 'Trichoderma cải tạo đất', quantity: 2, total: 440000, method: 'QR chuyển khoản', date: '25/06/2026' },
  { id: 'BILL-8838', customer: 'Mai Thị Lan', product: 'Nano đồng bạc phòng nấm lá', quantity: 2, total: 370000, method: 'Đặt trước', date: '24/06/2026' },
];

function daysToExpiry(expiry) {
  if (!expiry || expiry === 'Không áp dụng') return null;
  const diff = new Date(expiry).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function emptyDraft(category = DEFAULT_CATEGORIES[0]) {
  return {
    name: '',
    category,
    price: 0,
    stock: 0,
    unit: '',
    expiry: '',
    manufacturer: '',
    exclusive: false,
    weight: '',
    detail: '',
    image: '',
  };
}

export function useDistributorDemoState(notify) {
  const [shopAvatar, setShopAvatar] = useState('https://api.dicebear.com/9.x/initials/svg?seed=Ut%20Chanh&backgroundColor=bbf7d0');
  const [shopCover, setShopCover] = useState('/agri_store.png');
  const [profile, setProfile] = useState({
    owner: 'Nguyễn Văn Út',
    shopName: 'Đại lý Vật tư Nông nghiệp Út Chanh',
    phone: '0908 221 884',
    address: 'Chợ Bến Lức, Long An · Cách vùng Thạnh Phú 4.8km',
    bio: 'Chuyên phân bón, thuốc sinh học và nông cụ cho vườn chanh không hạt, khóm tại Bến Lức.',
  });
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [newCategory, setNewCategory] = useState('');
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [requests, setRequests] = useState(DEFAULT_REQUESTS);
  const [history, setHistory] = useState(DEFAULT_HISTORY);
  const [editingId, setEditingId] = useState(null);
  const [draftProduct, setDraftProduct] = useState(emptyDraft());
  const [billLines, setBillLines] = useState([{ id: `line-${Date.now()}`, productId: DEFAULT_PRODUCTS[0].id, quantity: 1 }]);
  const [billCustomer, setBillCustomer] = useState('Khách lẻ tại cửa hàng');
  const [billQr, setBillQr] = useState(null);

  const visibleProducts = activeCategory === 'Tất cả'
    ? products
    : products.filter((product) => product.category === activeCategory);

  const stats = useMemo(() => {
    const revenue = history.reduce((sum, item) => sum + item.total, 0);
    const stockUnits = products.reduce((sum, item) => sum + item.stock, 0);
    const nearExpiryProducts = products.filter((item) => {
      const days = daysToExpiry(item.expiry);
      return days !== null && days <= 120;
    });
    const bestSeller = [...products].sort((a, b) => b.sold - a.sold)[0];
    const topCustomer = history.reduce((map, item) => {
      map[item.customer] = (map[item.customer] || 0) + item.total;
      return map;
    }, {});
    const topCustomerName = Object.entries(topCustomer).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Chưa có';
    return { revenue, stockUnits, nearExpiryProducts, bestSeller, topCustomerName };
  }, [history, products]);

  const billItems = billLines
    .map((line) => {
      const product = products.find((item) => item.id === line.productId);
      return product ? { ...line, product, lineTotal: product.price * line.quantity } : null;
    })
    .filter(Boolean);
  const billTotal = billItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const billQrUrl = billQr
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(`GREENOVA-BILL|${billQr.id}|${billQr.customer}|${billQr.total}|${billQr.items.map((item) => `${item.name}x${item.quantity}`).join(',')}`)}`
    : '';

  const handleImage = (setter) => (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result);
    reader.readAsDataURL(file);
  };

  const addCategory = () => {
    const name = newCategory.trim();
    if (!name || categories.includes(name)) return;
    setCategories((items) => [...items, name]);
    setNewCategory('');
    notify?.('Đã thêm danh mục mới cho cửa hàng.');
  };

  const saveProduct = () => {
    if (!draftProduct.name.trim()) {
      notify?.('Vui lòng nhập tên sản phẩm.');
      return;
    }
    if (editingId) {
      setProducts((items) => items.map((item) => (item.id === editingId ? { ...item, ...draftProduct } : item)));
      notify?.('Đã cập nhật sản phẩm.');
    } else {
      setProducts((items) => [{ ...draftProduct, id: `prd-${Date.now()}`, sold: 0 }, ...items]);
      notify?.('Đã thêm sản phẩm mới vào kho.');
    }
    setEditingId(null);
    setDraftProduct(emptyDraft(categories[0]));
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setDraftProduct({ ...product });
  };

  const updateStock = (id, delta) => {
    setProducts((items) => items.map((item) => (
      item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item
    )));
  };

  const fulfillRequest = (requestId) => {
    const request = requests.find((item) => item.id === requestId);
    const product = products.find((item) => item.id === request?.productId);
    if (!request || !product || product.stock < request.quantity) {
      notify?.('Không đủ tồn kho để xác nhận yêu cầu này.');
      return;
    }
    setProducts((items) => items.map((item) => (
      item.id === request.productId ? { ...item, stock: item.stock - request.quantity, sold: item.sold + request.quantity } : item
    )));
    setRequests((items) => items.map((item) => (item.id === requestId ? { ...item, status: 'ready' } : item)));
    setHistory((items) => [{
      id: `ORD-${Date.now().toString().slice(-4)}`,
      customer: request.farmer,
      product: product.name,
      quantity: request.quantity,
      total: product.price * request.quantity,
      method: 'Đặt trước lấy tại cửa hàng',
      date: new Date().toLocaleDateString('vi-VN'),
    }, ...items]);
    notify?.('Đã xác nhận đơn đặt trước và trừ inventory.');
  };

  const rejectRequest = (requestId) => {
    setRequests((items) => items.map((item) => (item.id === requestId ? { ...item, status: 'rejected' } : item)));
    notify?.('Đã từ chối yêu cầu mua hàng.');
  };

  const addBillLine = () => {
    setBillLines((items) => [...items, { id: `line-${Date.now()}`, productId: products[0]?.id || '', quantity: 1 }]);
  };

  const updateBillLine = (lineId, patch) => {
    setBillLines((items) => items.map((item) => (
      item.id === lineId ? { ...item, ...patch, quantity: Math.max(1, Number(patch.quantity ?? item.quantity)) } : item
    )));
  };

  const removeBillLine = (lineId) => {
    setBillLines((items) => (items.length === 1 ? items : items.filter((item) => item.id !== lineId)));
  };

  const createBill = () => {
    if (!billItems.length) return;
    const quantityByProduct = billItems.reduce((map, item) => {
      map[item.product.id] = (map[item.product.id] || 0) + item.quantity;
      return map;
    }, {});
    const invalidItem = billItems.find((item) => item.product.stock < quantityByProduct[item.product.id]);
    if (invalidItem) {
      notify?.(`${invalidItem.product.name} không đủ tồn kho để tạo bill.`);
      return;
    }
    setBillQr({
      id: `BILL-${Date.now().toString().slice(-4)}`,
      customer: billCustomer || 'Khách lẻ tại cửa hàng',
      product: billItems.map((item) => item.product.name).join(', '),
      quantity: billItems.reduce((sum, item) => sum + item.quantity, 0),
      items: billItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.lineTotal,
      })),
      total: billTotal,
      date: new Date().toLocaleDateString('vi-VN'),
    });
    notify?.('Đã tạo bill và QR thanh toán.');
  };

  const confirmBillPaid = () => {
    if (!billQr) return;
    const quantityByProduct = billQr.items.reduce((map, item) => {
      map[item.productId] = (map[item.productId] || 0) + item.quantity;
      return map;
    }, {});
    setProducts((items) => items.map((item) => {
      const soldQuantity = quantityByProduct[item.id] || 0;
      return soldQuantity ? { ...item, stock: item.stock - soldQuantity, sold: item.sold + soldQuantity } : item;
    }));
    setHistory((items) => [{ ...billQr, method: 'QR tại quầy' }, ...items]);
    setBillQr(null);
    setBillLines([{ id: `line-${Date.now()}`, productId: products[0]?.id || '', quantity: 1 }]);
    notify?.('Đã xác nhận thanh toán, hệ thống tự trừ inventory.');
  };

  return {
    shopAvatar,
    shopCover,
    profile,
    setProfile,
    categories,
    activeCategory,
    newCategory,
    setActiveCategory,
    setNewCategory,
    products,
    visibleProducts,
    requests,
    history,
    editingId,
    draftProduct,
    setDraftProduct,
    billLines,
    billItems,
    billCustomer,
    setBillCustomer,
    billQr,
    billQrUrl,
    billTotal,
    stats,
    setEditingId,
    handleShopAvatar: handleImage(setShopAvatar),
    handleShopCover: handleImage(setShopCover),
    addCategory,
    saveProduct,
    editProduct,
    updateStock,
    fulfillRequest,
    rejectRequest,
    addBillLine,
    updateBillLine,
    removeBillLine,
    createBill,
    confirmBillPaid,
    resetDraft: () => {
      setEditingId(null);
      setDraftProduct(emptyDraft(categories[0]));
    },
    deleteProduct: (id) => setProducts((items) => items.filter((item) => item.id !== id)),
  };
}

export function DistributorDashboardPage({ dealer }) {
  return (
    <section className="dealer-console">
      <DealerHero dealer={dealer} compact />
      <div className="dealer-stat-grid">
        <DealerStat icon={WalletCards} label="Doanh thu" value={currency(dealer.stats.revenue)} note="từ đơn mock" />
        <DealerStat icon={Boxes} label="Tồn kho" value={dealer.stats.stockUnits} note="đơn vị còn bán" />
        <DealerStat icon={CalendarClock} label="Gần hết hạn" value={dealer.stats.nearExpiryProducts.length} note="cần ưu tiên xử lý" tone="amber" />
        <DealerStat icon={Sparkles} label="Bán chạy" value={dealer.stats.bestSeller?.name || '-'} note="theo số lượng bán" />
      </div>

      <div className="dealer-dashboard-grid">
        <section className="dealer-panel">
          <div className="dealer-panel-head">
            <h2><BarChart3 size={18} /> Tổng quan bán hàng</h2>
          </div>
          <div className="dealer-mini-grid">
            <article><span>Khách mua nhiều</span><strong>{dealer.stats.topCustomerName}</strong></article>
            <article><span>Đơn chờ xử lý</span><strong>{dealer.requests.filter((item) => item.status === 'pending').length}</strong></article>
            <article><span>Sản phẩm đang bán</span><strong>{dealer.products.length}</strong></article>
            <article><span>Danh mục</span><strong>{dealer.categories.length}</strong></article>
          </div>
        </section>

        <section className="dealer-panel">
          <div className="dealer-panel-head">
            <h2><CalendarClock size={18} /> Hàng cần chú ý</h2>
          </div>
          <div className="dealer-action-list">
            {dealer.stats.nearExpiryProducts.map((product) => (
              <article key={product.id}>
                <strong>{product.name}</strong>
                <span>Còn {daysToExpiry(product.expiry)} ngày · tồn {product.stock}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export function DistributorStorePage({ dealer }) {
  return (
    <section className="dealer-console">
      <section className="dealer-panel">
        <div className="dealer-panel-head">
          <div>
            <p className="eyebrow">Danh mục cửa hàng</p>
            <h2>Phân loại sản phẩm</h2>
          </div>
          <div className="dealer-add-inline">
            <input value={dealer.newCategory} onChange={(event) => dealer.setNewCategory(event.target.value)} placeholder="Thêm danh mục..." />
            <button onClick={dealer.addCategory}><Plus size={15} /></button>
          </div>
        </div>
        <div className="dealer-category-row">
          {['Tất cả', ...dealer.categories].map((category) => (
            <button key={category} className={dealer.activeCategory === category ? 'active' : ''} onClick={() => dealer.setActiveCategory(category)}>
              {category}
            </button>
          ))}
        </div>
      </section>

      <div className="dealer-layout store-only">
        <main className="dealer-main">
          <section className="dealer-product-grid">
            {dealer.visibleProducts.map((product) => (
              <DealerProductCard key={product.id} product={product} dealer={dealer} />
            ))}
          </section>
        </main>

        <aside className="dealer-side">
          <ProductForm dealer={dealer} />
        </aside>
      </div>
    </section>
  );
}

export function DistributorOrdersPage({ dealer }) {
  return (
    <section className="dealer-console">
      <div className="dealer-dashboard-grid">
        <section className="dealer-panel">
          <div className="dealer-panel-head">
            <h2><ShoppingBag size={18} /> Đơn nông dân đặt trước</h2>
          </div>
          <div className="dealer-request-list">
            {dealer.requests.map((request) => {
              const product = dealer.products.find((item) => item.id === request.productId);
              return (
                <article key={request.id}>
                  <div>
                    <strong>{request.farmer}</strong>
                    <Badge status={request.status === 'pending' ? 'warning' : request.status === 'ready' ? 'success' : 'danger'}>
                      {request.status === 'pending' ? 'Chờ xử lý' : request.status === 'ready' ? 'Chờ lấy' : 'Từ chối'}
                    </Badge>
                  </div>
                  <p>{request.quantity} x {product?.name}</p>
                  <span>{request.pickupTime}</span>
                  <div>
                    <button onClick={() => dealer.fulfillRequest(request.id)}><CheckCircle2 size={14} /> Xác nhận</button>
                    <button onClick={() => dealer.rejectRequest(request.id)}>Từ chối</button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="dealer-panel">
          <div className="dealer-panel-head">
            <h2><ReceiptText size={18} /> Bán tại quầy</h2>
          </div>
          <div className="dealer-bill-form">
            <input value={dealer.billCustomer} onChange={(e) => dealer.setBillCustomer(e.target.value)} placeholder="Tên khách hàng" />
            <div className="dealer-bill-lines">
              {dealer.billLines.map((line) => {
                const product = dealer.products.find((item) => item.id === line.productId);
                return (
                  <div className="dealer-bill-line" key={line.id}>
                    <select value={line.productId} onChange={(e) => dealer.updateBillLine(line.id, { productId: e.target.value })}>
                      {dealer.products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                    <input type="number" min="1" value={line.quantity} onChange={(e) => dealer.updateBillLine(line.id, { quantity: Number(e.target.value) })} />
                    <span>{product ? currency(product.price * line.quantity) : currency(0)}</span>
                    <button type="button" onClick={() => dealer.removeBillLine(line.id)} aria-label="Xóa dòng hàng"><Trash2 size={15} /></button>
                  </div>
                );
              })}
            </div>
            <button type="button" className="dealer-secondary" onClick={dealer.addBillLine}><Plus size={15} /> Thêm sản phẩm</button>
            <strong>{currency(dealer.billTotal)}</strong>
            <button onClick={dealer.createBill}><QrCode size={16} /> Tạo QR thanh toán</button>
          </div>
          {dealer.billQr && (
            <div className="dealer-qr-box">
              <img src={dealer.billQrUrl} alt="QR thanh toán bill" />
              <strong>{dealer.billQr.id}</strong>
              <div className="dealer-qr-items">
                {dealer.billQr.items.map((item) => (
                  <span key={item.productId}>{item.quantity} x {item.name}</span>
                ))}
              </div>
              <span>{currency(dealer.billQr.total)}</span>
              <button onClick={dealer.confirmBillPaid}><BadgeCheck size={15} /> Đã thanh toán</button>
            </div>
          )}
        </section>
      </div>

      <section className="dealer-panel">
        <div className="dealer-panel-head">
          <h2><Package size={18} /> Lịch sử mua hàng</h2>
        </div>
        <div className="dealer-history-list">
          {dealer.history.map((item) => (
            <article key={item.id}>
              <div>
                <strong>{item.customer}</strong>
                <span>{item.date}</span>
              </div>
              <p>{item.quantity ? `${item.quantity} x ` : ''}{item.product} · {item.method}</p>
              <b>{currency(item.total)}</b>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export function DistributorProfilePage({ dealer }) {
  return (
    <section className="dealer-console">
      <DealerHero dealer={dealer} />
      <div className="dealer-profile-grid">
        <section className="dealer-panel dealer-profile-card">
          <div className="dealer-panel-head">
            <h2><UserRound size={18} /> Thông tin cá nhân</h2>
          </div>
          <label>Chủ đại lý<input value={dealer.profile.owner} onChange={(e) => dealer.setProfile({ ...dealer.profile, owner: e.target.value })} /></label>
          <label>Tên cửa hàng<input value={dealer.profile.shopName} onChange={(e) => dealer.setProfile({ ...dealer.profile, shopName: e.target.value })} /></label>
          <label>Số điện thoại<input value={dealer.profile.phone} onChange={(e) => dealer.setProfile({ ...dealer.profile, phone: e.target.value })} /></label>
          <label>Địa chỉ<input value={dealer.profile.address} onChange={(e) => dealer.setProfile({ ...dealer.profile, address: e.target.value })} /></label>
          <label>Giới thiệu<textarea value={dealer.profile.bio} onChange={(e) => dealer.setProfile({ ...dealer.profile, bio: e.target.value })} /></label>
        </section>

        <section className="dealer-panel dealer-profile-card">
          <div className="dealer-panel-head">
            <h2><MapPin size={18} /> Hồ sơ hiển thị với nông dân</h2>
          </div>
          <div className="dealer-public-preview">
            <img src={dealer.shopCover} alt="Ảnh bìa cửa hàng" />
            <div>
              <img src={dealer.shopAvatar} alt="Avatar đại lý" />
              <strong>{dealer.profile.shopName}</strong>
              <span>{dealer.profile.address}</span>
              <p>{dealer.profile.bio}</p>
              <Badge status="success">Đã xác minh cửa hàng</Badge>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export function DistributorPage({ dealer }) {
  return <DistributorDashboardPage dealer={dealer} />;
}

function DealerHero({ dealer, compact = false }) {
  return (
    <header className={`dealer-hero ${compact ? 'compact' : ''}`}>
      <img className="dealer-cover" src={dealer.shopCover} alt="Ảnh cửa hàng" />
      <div className="dealer-hero-overlay" />
      <label className="dealer-cover-upload">
        <ImagePlus size={16} /> Đổi ảnh cửa hàng
        <input type="file" accept="image/*" onChange={dealer.handleShopCover} />
      </label>
      <div className="dealer-shop-card">
        <div className="dealer-avatar">
          <img src={dealer.shopAvatar} alt="Avatar đại lý" />
          <label><Camera size={15} /><input type="file" accept="image/*" onChange={dealer.handleShopAvatar} /></label>
        </div>
        <div>
          <p className="eyebrow">Đại lý vật tư</p>
          <h1>{dealer.profile.shopName}</h1>
          <input value={dealer.profile.address} onChange={(event) => dealer.setProfile({ ...dealer.profile, address: event.target.value })} />
        </div>
      </div>
    </header>
  );
}

function ProductForm({ dealer }) {
  return (
    <section className="dealer-panel">
      <div className="dealer-panel-head">
        <div>
          <p className="eyebrow">Sản phẩm & kho</p>
          <h2>{dealer.editingId ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}</h2>
        </div>
        {dealer.editingId && <button className="dealer-secondary" onClick={dealer.resetDraft}>Hủy sửa</button>}
      </div>
      <div className="dealer-product-form">
        <input value={dealer.draftProduct.name} onChange={(e) => dealer.setDraftProduct({ ...dealer.draftProduct, name: e.target.value })} placeholder="Tên sản phẩm" />
        <select value={dealer.draftProduct.category} onChange={(e) => dealer.setDraftProduct({ ...dealer.draftProduct, category: e.target.value })}>
          {dealer.categories.map((category) => <option key={category}>{category}</option>)}
        </select>
        <input type="number" value={dealer.draftProduct.price} onChange={(e) => dealer.setDraftProduct({ ...dealer.draftProduct, price: Number(e.target.value) })} placeholder="Giá bán" />
        <input type="number" value={dealer.draftProduct.stock} onChange={(e) => dealer.setDraftProduct({ ...dealer.draftProduct, stock: Number(e.target.value) })} placeholder="Tồn kho" />
        <input value={dealer.draftProduct.unit} onChange={(e) => dealer.setDraftProduct({ ...dealer.draftProduct, unit: e.target.value })} placeholder="Đơn vị, ví dụ bao 50kg" />
        <input value={dealer.draftProduct.weight} onChange={(e) => dealer.setDraftProduct({ ...dealer.draftProduct, weight: e.target.value })} placeholder="Cân nặng/dung tích" />
        <input type="date" value={dealer.draftProduct.expiry} onChange={(e) => dealer.setDraftProduct({ ...dealer.draftProduct, expiry: e.target.value })} />
        <input value={dealer.draftProduct.manufacturer} onChange={(e) => dealer.setDraftProduct({ ...dealer.draftProduct, manufacturer: e.target.value })} placeholder="Hãng sản xuất" />
        <input className="wide" value={dealer.draftProduct.image} onChange={(e) => dealer.setDraftProduct({ ...dealer.draftProduct, image: e.target.value })} placeholder="Link ảnh sản phẩm" />
        <label className="dealer-check"><input type="checkbox" checked={dealer.draftProduct.exclusive} onChange={(e) => dealer.setDraftProduct({ ...dealer.draftProduct, exclusive: e.target.checked })} /> Hàng độc quyền</label>
        <textarea className="wide" value={dealer.draftProduct.detail} onChange={(e) => dealer.setDraftProduct({ ...dealer.draftProduct, detail: e.target.value })} placeholder="Thông tin chi tiết, cách dùng, lưu ý an toàn..." />
        <button className="dealer-primary wide" onClick={dealer.saveProduct}><Save size={16} /> Lưu sản phẩm</button>
      </div>
    </section>
  );
}

function DealerProductCard({ product, dealer }) {
  const expiryDays = daysToExpiry(product.expiry);
  return (
    <article className="dealer-product-card">
      <img src={product.image || '/agri_store.png'} alt={product.name} />
      <div>
        <Badge status={expiryDays !== null && expiryDays < 120 ? 'warning' : 'success'}>
          {expiryDays === null ? 'Không date' : `${expiryDays} ngày`}
        </Badge>
        {product.exclusive && <Badge status="info">Độc quyền</Badge>}
      </div>
      <h3>{product.name}</h3>
      <p>{product.detail}</p>
      <div className="dealer-product-meta">
        <span>{product.category}</span>
        <span>{product.manufacturer}</span>
        <span>{product.weight}</span>
      </div>
      <div className="dealer-product-bottom">
        <strong>{currency(product.price)}</strong>
        <span>Tồn {product.stock} {product.unit}</span>
      </div>
      <div className="dealer-card-actions">
        <button onClick={() => dealer.editProduct(product)}><Edit3 size={15} /> Sửa</button>
        <button onClick={() => dealer.updateStock(product.id, 10)}><Plus size={15} /> Nhập 10</button>
        <button onClick={() => dealer.deleteProduct(product.id)}><Trash2 size={15} /></button>
      </div>
    </article>
  );
}

function DealerStat({ icon: Icon, label, value, note, tone = 'green' }) {
  return (
    <article className={`dealer-stat ${tone}`}>
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}
