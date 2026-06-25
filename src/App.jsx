import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bell,
  Bot,
  Building2,
  Camera,
  ChevronRight,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  Gavel,
  Heart,
  Image as ImageIcon,
  Leaf,
  LockKeyhole,
  LogOut,
  MapPin,
  Menu,
  MoreHorizontal,
  Package,
  QrCode,
  MessageCircle,
  RefreshCcw,
  Search,
  Send,
  Share2,
  Smile,
  ShieldCheck,
  ShoppingCart,
  Sprout,
  Store,
  Thermometer,
  UserCheck,
  X,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { defaultFeedPosts, initialGreenovaState, roles } from './data/greenovaData';

const STORAGE_KEY = 'greenova-mvp-state-v1';

const roleTheme = {
  farmer: { icon: Sprout, color: '#15803d', label: 'Nông dân' },
  expert: { icon: Bot, color: '#0f766e', label: 'Chuyên gia' },
  distributor: { icon: Store, color: '#2563eb', label: 'Đại lý' },
  buyer: { icon: Building2, color: '#b45309', label: 'Doanh nghiệp' },
  admin: { icon: ShieldCheck, color: '#7c3aed', label: 'Admin' },
};

const navigationByRole = {
  farmer: [
    { id: 'overview', label: 'Tổng quan', icon: Activity },
    { id: 'feed', label: 'Bảng tin', icon: MessageCircle },
    { id: 'ai', label: 'AI chẩn đoán', icon: Bot },
    { id: 'market', label: 'Sàn vật tư', icon: ShoppingCart },
    { id: 'orders', label: 'Escrow đơn hàng', icon: LockKeyhole },
    { id: 'ledger', label: 'QR nhật ký', icon: QrCode },
  ],
  expert: [
    { id: 'feed', label: 'Bảng tin', icon: MessageCircle },
    { id: 'expert', label: 'SOS bệnh cây', icon: ClipboardList },
    { id: 'overview', label: 'Dữ liệu vùng', icon: Activity },
    { id: 'ledger', label: 'Nhật ký tham chiếu', icon: FileCheck2 },
  ],
  distributor: [
    { id: 'distributor', label: 'Kho & đơn', icon: Package },
    { id: 'auction', label: 'Đấu giá', icon: Gavel },
    { id: 'orders', label: 'Escrow', icon: LockKeyhole },
    { id: 'overview', label: 'Cảnh báo vùng', icon: AlertTriangle },
  ],
  buyer: [
    { id: 'buyer', label: 'Thu mua', icon: Search },
    { id: 'ledger', label: 'QR passport', icon: QrCode },
    { id: 'auction', label: 'Campaign', icon: Gavel },
    { id: 'overview', label: 'Bản đồ nguồn hàng', icon: MapPin },
  ],
  admin: [
    { id: 'admin', label: 'Điều phối', icon: ShieldCheck },
    { id: 'orders', label: 'Tranh chấp', icon: LockKeyhole },
    { id: 'expert', label: 'SOS tickets', icon: ClipboardList },
    { id: 'overview', label: 'Toàn hệ thống', icon: Activity },
  ],
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialGreenovaState;
    const saved = JSON.parse(raw);
    const savedPosts = saved.feedPosts || [];
    const savedPostIds = new Set(savedPosts.map((post) => post.id));
    const missingDefaultPosts = defaultFeedPosts.filter((post) => !savedPostIds.has(post.id));
    return {
      ...initialGreenovaState,
      ...saved,
      feedPosts: [...missingDefaultPosts, ...savedPosts],
    };
  } catch {
    return initialGreenovaState;
  }
}

function currency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

function statusLabel(status) {
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
  };
  return map[status] || status;
}

function addLedgerEntry(state, entry) {
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

function LoginScreen({ onLogin }) {
  const [authMode, setAuthMode] = useState(null);
  const openAuth = (mode) => setAuthMode(mode);

  return (
    <main className="landing-page">
      <header className="landing-header">
        <a className="landing-brand" href="#home">
          <div className="brand-mark small"><Leaf size={22} /></div>
          <div>
            <strong>GREENOVA</strong>
            <span>Nông nghiệp số Long An</span>
          </div>
        </a>
        <nav className="landing-nav">
          <a href="#about">Giới thiệu</a>
          <a href="#iot">IoT</a>
          <a href="#benefits">Lợi ích</a>
          <a href="#workflow">Quy trình</a>
        </nav>
        <div className="landing-auth">
          <button className="ghost-button" onClick={() => openAuth('login')}>Đăng nhập</button>
          <button className="solid-button" onClick={() => openAuth('register')}>Đăng ký</button>
        </div>
      </header>

      <section id="home" className="landing-hero">
        <div className="landing-hero-copy">
          <p className="eyebrow">GREENOVA Agricultural Digital Ecosystem</p>
          <h1>Nền tảng số cho nông dân, kỹ sư và chuỗi cung ứng nông nghiệp</h1>
          <p>
            GREENOVA kết nối IoT ESP32, AI chẩn đoán bệnh cây, sàn vật tư escrow,
            đấu giá ngược và QR nhật ký canh tác cho vùng thí điểm Bến Lức, Long An.
          </p>
          <div className="landing-cta">
            <button className="solid-button large" onClick={() => openAuth('register')}>Bắt đầu dùng thử</button>
            <a className="outline-link" href="#iot">Xem IoT hoạt động</a>
          </div>
          <div className="hero-metrics">
            <span><strong>5</strong> vai trò</span>
            <span><strong>48h</strong> escrow</span>
            <span><strong>15km</strong> vật tư nội vùng</span>
          </div>
        </div>

        <div className="landing-hero-card">
          <div className="hero-photo-stack">
            <div className="hero-photo main">
              <span>Vùng trồng Bến Lức</span>
            </div>
            <div className="hero-photo lime">
              <span>Chanh không hạt</span>
            </div>
            <div className="hero-photo farmer">
              <span>Canh tác số</span>
            </div>
          </div>
          <div className="device-card">
            <div className="device-topline">
              <span className="online-dot" />
              ESP32-BL-7A:21 đang online
            </div>
            <div className="device-gauge">
              <strong>38%</strong>
              <span>Độ ẩm đất</span>
            </div>
            <div className="device-readings">
              <div><span>Nhiệt độ</span><strong>27.4°C</strong></div>
              <div><span>Độ mặn</span><strong>0.5‰</strong></div>
              <div><span>Relay</span><strong>ON</strong></div>
            </div>
          </div>
          <div className="floating-card ai">
            <Bot size={18} />
            <span>AI phát hiện đốm lá, confidence 84%</span>
          </div>
          <div className="floating-card escrow">
            <LockKeyhole size={18} />
            <span>Escrow #NPK-9999 đang khóa 48h</span>
          </div>
        </div>
      </section>

      <section className="produce-showcase">
        <div className="produce-heading">
          <p className="eyebrow">Pilot Crops</p>
          <h2>Nông sản chủ lực trong demo</h2>
        </div>
        <div className="produce-grid">
          {[
            ['lime', 'Chanh không hạt', 'Theo dõi độ ẩm, nấm lá và QR passport cho lô hàng.'],
            ['pineapple', 'Khóm Bến Lức', 'Cảnh báo úng rễ, vàng lá và campaign thu mua sỉ.'],
            ['market', 'Vật tư chính hãng', 'Gợi ý phân bón, thuốc sinh học từ đại lý trong 15km.'],
          ].map(([tone, title, text]) => (
            <article key={title} className={`produce-card ${tone}`}>
              <div />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="landing-section">
        <div className="section-heading">
          <p className="eyebrow">Website này làm gì?</p>
          <h2>Một cổng thao tác chung cho hệ sinh thái nông nghiệp</h2>
          <p>
            Mỗi vai trò có dashboard riêng nhưng cùng chia sẻ dữ liệu minh bạch:
            nông dân quản lý vườn, kỹ sư xử lý ca bệnh, đại lý bán vật tư, buyer kiểm tra nguồn gốc,
            admin điều phối rủi ro.
          </p>
        </div>
        <div className="landing-feature-grid">
          {[
            ['Nông dân', Sprout, 'Theo dõi vườn, hỏi kỹ sư, mua vật tư bằng escrow.'],
            ['Kỹ sư', Bot, 'Nhận SOS, xem IoT history và kê đơn xử lý.'],
            ['Đại lý', Store, 'Quản lý kho, nhận đơn, tham gia đấu giá ngược.'],
            ['Buyer', Building2, 'Quét QR passport và tạo chiến dịch thu mua.'],
          ].map(([title, Icon, text]) => (
            <article key={title} className="landing-feature-card">
              <Icon size={24} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="iot" className="landing-section landing-band">
        <div className="section-heading">
          <p className="eyebrow">IoT Remote Telemetry</p>
          <h2>Giám sát ruộng vườn theo dữ liệu thật</h2>
          <p>
            Trạm ESP32 gửi độ ẩm đất, độ mặn, nhiệt độ, độ ẩm không khí và NPK.
            Khi đất khô nhưng nước không nhiễm mặn, hệ thống mô phỏng mở van tưới tự động.
          </p>
        </div>
        <div className="iot-strip">
          {[
            ['Độ ẩm đất', '38%', 'Dưới ngưỡng 40%'],
            ['Độ mặn', '0.5‰', 'An toàn để tưới'],
            ['Không khí', '88%', 'Nguy cơ nấm lá'],
            ['Van tưới', 'ON', 'Tự động bật'],
          ].map(([label, value, note]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{note}</small>
            </div>
          ))}
        </div>
      </section>

      <section id="benefits" className="landing-section">
        <div className="section-heading">
          <p className="eyebrow">Lợi ích chính</p>
          <h2>Nhẹ cho demo, nhưng đủ luồng nghiệp vụ quan trọng</h2>
        </div>
        <div className="benefit-grid">
          {[
            ['Giảm rủi ro hàng giả', 'Escrow 48h giúp nông dân có thời gian khiếu nại trước khi tiền giải ngân.'],
            ['Phản ứng bệnh cây nhanh', 'AI tự kê đơn khi confidence cao, chuyển kỹ sư khi confidence thấp.'],
            ['Minh bạch nguồn gốc', 'Nhật ký IoT, AI và hóa đơn vật tư được gom thành QR passport.'],
            ['Tối ưu mua bán địa phương', 'Vật tư và đấu giá ưu tiên bán kính gần để giảm chi phí logistics.'],
            ['Có cộng đồng hỏi đáp', 'Bảng tin kiểu Facebook cho nông dân và kỹ sư trao đổi hằng ngày.'],
            ['Dễ host nhẹ', 'React/Vite deploy tĩnh lên Vercel, có thể nâng cấp Firebase sau.'],
          ].map(([title, text]) => (
            <article key={title} className="benefit-card">
              <CheckCircle2 size={20} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className="landing-section workflow-section">
        <div className="section-heading">
          <p className="eyebrow">Quy trình mẫu</p>
          <h2>Từ phát hiện vấn đề đến giao dịch minh bạch</h2>
        </div>
        <div className="workflow-steps">
          {[
            ['1', 'IoT cảnh báo', 'ESP32 phát hiện độ ẩm thấp hoặc nguy cơ dịch tễ.'],
            ['2', 'AI chẩn đoán', 'Nông dân gửi ảnh lá, AI trả confidence và hướng xử lý.'],
            ['3', 'Mua vật tư', 'Sàn gợi ý sản phẩm từ đại lý gần vườn.'],
            ['4', 'Escrow 48h', 'Tiền khóa an toàn, có thể khiếu nại nếu hàng lỗi.'],
            ['5', 'QR passport', 'Ledger gom dữ liệu chăm sóc để buyer kiểm tra.'],
          ].map(([num, title, text]) => (
            <article key={num}>
              <strong>{num}</strong>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <strong>GREENOVA</strong>
        <span>MVP demo cho Agricultural Digital Ecosystem Marketplace.</span>
        <button className="solid-button" onClick={() => openAuth('login')}>Vào hệ thống</button>
      </footer>

      {authMode && (
        <div className="auth-overlay" onClick={() => setAuthMode(null)}>
          <section className="auth-dialog" onClick={(event) => event.stopPropagation()}>
            <button className="auth-close" onClick={() => setAuthMode(null)}><X size={18} /></button>
            <p className="eyebrow">{authMode === 'login' ? 'Đăng nhập demo' : 'Đăng ký demo'}</p>
            <h2>{authMode === 'login' ? 'Chọn vai trò để vào hệ thống' : 'Tạo tài khoản mẫu theo vai trò'}</h2>
            <p>
              Bản MVP chưa dùng backend thật, nên bạn chọn role để trải nghiệm dashboard tương ứng.
            </p>
            <div className="role-grid">
              {roles.map((role) => {
                const meta = roleTheme[role.id];
                const Icon = meta.icon;
                return (
                  <button key={role.id} className="role-card" onClick={() => onLogin(role.id)}>
                    <span className="role-icon" style={{ color: meta.color }}>
                      <Icon size={22} />
                    </span>
                    <span>
                      <strong>{role.name}</strong>
                      <small>{role.accountName}</small>
                      <em>{role.description}</em>
                    </span>
                    <ChevronRight size={18} />
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function StatCard({ icon: Icon, label, value, note, tone = 'green' }) {
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

function Badge({ children, status = 'default' }) {
  return <span className={`status-badge ${status}`}>{children}</span>;
}

function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div className="toast">
      <CheckCircle2 size={18} />
      <span>{toast}</span>
      <button onClick={onClose}><X size={14} /></button>
    </div>
  );
}

function Shell({ role, activePage, setActivePage, onLogout, onReset, children, state, notify }) {
  const nav = navigationByRole[role];
  const account = roles.find((item) => item.id === role);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = state.notifications.filter((item) => item.unread).length;
  const RoleIcon = roleTheme[role].icon;

  useEffect(() => {
    if (!nav.find((item) => item.id === activePage)) {
      setActivePage(nav[0].id);
    }
  }, [activePage, nav, setActivePage]);

  const navContent = (
    <>
      <div className="sidebar-brand">
        <div className="brand-mark small"><Leaf size={22} /></div>
        <div>
          <strong>GREENOVA</strong>
          <span>Agricultural Digital Ecosystem</span>
        </div>
      </div>

      <div className="account-card">
        <RoleIcon size={18} style={{ color: roleTheme[role].color }} />
        <div>
          <strong>{account.accountName}</strong>
          <span>{roleTheme[role].label} • {account.location}</span>
        </div>
      </div>

      <nav className="side-nav">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={activePage === item.id ? 'active' : ''}
              onClick={() => {
                setActivePage(item.id);
                setMobileOpen(false);
              }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button onClick={onReset}><RefreshCcw size={16} /> Reset demo</button>
        <button onClick={onLogout}><LogOut size={16} /> Đăng xuất</button>
      </div>
    </>
  );

  return (
    <div className="app-shell">
      <aside className="app-sidebar desktop-only">{navContent}</aside>
      {mobileOpen && (
        <div className="mobile-drawer">
          <button className="drawer-close" onClick={() => setMobileOpen(false)}><X size={18} /></button>
          {navContent}
        </div>
      )}

      <main className="workspace">
        <header className="topbar">
          <button className="icon-button mobile-only" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <div>
            <p className="eyebrow">{roleTheme[role].label}</p>
            <h2>{nav.find((item) => item.id === activePage)?.label || 'Dashboard'}</h2>
          </div>
          <div className="topbar-actions">
            <div className="search-pill">
              <Search size={16} />
              <button onClick={() => notify('Tìm kiếm demo: nhập liệu thật sẽ nối Firebase/Firestore ở phase sau.')}>
                Tìm farm, đơn, mã QR...
              </button>
            </div>
            <button className="icon-button" onClick={() => setNotifOpen((value) => !value)}>
              <Bell size={18} />
              {unread > 0 && <i>{unread}</i>}
            </button>
          </div>
          {notifOpen && (
            <div className="notification-popover">
              <strong>Thông báo hệ thống</strong>
              {state.notifications.map((item) => (
                <div key={item.id} className={item.unread ? 'unread' : ''}>
                  <span>{item.type}</span>
                  <p>{item.title}</p>
                  <small>{item.message}</small>
                </div>
              ))}
            </div>
          )}
        </header>
        {children}
      </main>
    </div>
  );
}

function OverviewPage({ state, setState, role }) {
  const farm = state.farms[0];
  const device = state.devices.find((item) => item.id === farm.deviceId);
  const openDisputes = state.orders.filter((item) => item.status === 'Disputed').length;
  const openSos = state.sosTickets.filter((item) => item.status === 'Open').length;

  const runTelemetry = () => {
    setState((prev) => {
      const nextDevices = prev.devices.map((item) => {
        if (item.id !== device.id) return item;
        const lowMoisture = item.telemetry.soilMoisture < item.thresholds.moistureLowerBound;
        const safeSalt = item.telemetry.saltIntrusion < item.thresholds.saltIntrusionMarker;
        return {
          ...item,
          valveStatus: lowMoisture && safeSalt ? 'TURN_ON_VALVE' : lowMoisture ? 'FORCE_SHUTDOWN_VALVE' : 'IDLE',
        };
      });
      return {
        ...addLedgerEntry(
          { ...prev, devices: nextDevices },
          {
            type: 'IoT_Log',
            farmId: farm.id,
            title: 'Quét ngưỡng IoT thủ công',
            detail: `Độ ẩm ${device.telemetry.soilMoisture}%, độ mặn ${device.telemetry.saltIntrusion}‰, trạng thái relay đã cập nhật.`,
          },
        ),
        notifications: [
          {
            id: `NOTI-${Date.now()}`,
            type: 'IoT',
            title: 'Đã chạy mô phỏng telemetry',
            message: 'Hệ thống vừa kiểm tra ngưỡng tưới và ghi vào ledger.',
            unread: true,
          },
          ...prev.notifications,
        ],
      };
    });
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Pilot Bến Lức, Long An</p>
          <h1>{role === 'farmer' ? farm.name : 'Trung tâm vận hành GREENOVA'}</h1>
          <p>IoT, AI, marketplace, escrow và ledger đang chạy ở chế độ mô phỏng tương tác.</p>
        </div>
        <button className="primary-button" onClick={runTelemetry}>
          <Activity size={17} /> Quét IoT
        </button>
      </div>

      <div className="stats-grid">
        <StatCard icon={Leaf} label="Sức khỏe vườn" value={`${farm.healthScore}%`} note={farm.crop} />
        <StatCard icon={Thermometer} label="Nhiệt độ" value={`${device.telemetry.ambientTemp}°C`} note="SHT30 ngoài ruộng" tone="blue" />
        <StatCard icon={AlertTriangle} label="SOS mở" value={openSos} note="Cần chuyên gia xử lý" tone="amber" />
        <StatCard icon={LockKeyhole} label="Tranh chấp" value={openDisputes} note="Escrow cần admin" tone="red" />
      </div>

      <div className="dashboard-grid">
        <article className="panel large">
          <div className="panel-header">
            <div>
              <h3>Telemetry 7 ngày</h3>
              <p>Độ ẩm đất giảm dưới ngưỡng 40%, độ ẩm không khí đang thuận lợi cho nấm lá.</p>
            </div>
            <Badge status="warning">Level 2 Warning</Badge>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={state.telemetryHistory}>
                <defs>
                  <linearGradient id="moisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#dce7dc" />
                <XAxis dataKey="day" stroke="#6b806c" fontSize={12} />
                <YAxis stroke="#6b806c" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="moisture" name="Độ ẩm đất" stroke="#16a34a" fill="url(#moisture)" strokeWidth={3} />
                <Area type="monotone" dataKey="humidity" name="Ẩm không khí" stroke="#0f766e" fill="#0f766e18" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h3>Điều khiển ESP32</h3>
            <Badge status={device.status === 'Online' ? 'success' : 'warning'}>{device.status}</Badge>
          </div>
          <div className="sensor-list">
            <div><span>Độ ẩm đất</span><strong>{device.telemetry.soilMoisture}%</strong></div>
            <div><span>Độ mặn</span><strong>{device.telemetry.saltIntrusion}‰</strong></div>
            <div><span>NPK</span><strong>{device.telemetry.npk.n}/{device.telemetry.npk.p}/{device.telemetry.npk.k}</strong></div>
            <div><span>Relay</span><strong>{device.valveStatus}</strong></div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h3>Cảnh báo dịch tễ</h3>
            <AlertTriangle size={18} />
          </div>
          {state.pestAlerts.map((alert) => (
            <div key={alert.id} className="alert-card">
              <Badge status="warning">{alert.level}</Badge>
              <strong>{alert.disease}</strong>
              <p>{alert.reason}</p>
              <small>{alert.crop} • {alert.district}</small>
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}

function AIDiagnosisPage({ state, setState }) {
  const [mode, setMode] = useState('auto');
  const [result, setResult] = useState(null);
  const farm = state.farms[0];

  const analyze = (confidenceMode = mode) => {
    const highConfidence = confidenceMode === 'auto';
    const diagnosis = {
      id: `AI-${Date.now()}`,
      farmId: farm.id,
      crop: farm.crop,
      disease: highConfidence ? 'Đốm lá do nấm Cercospora' : 'Triệu chứng bất thường cần chuyên gia xác minh',
      confidence: highConfidence ? 84 : 63,
      severity: highConfidence ? 'Medium' : 'High',
      prescription: highConfidence
        ? 'Tỉa lá bệnh, giảm tưới chiều muộn, phun Nano Đồng bạc và bổ sung Trichoderma.'
        : 'Tạo SOS ticket kèm 30 ngày IoT history để chuyên gia xử lý thủ công.',
      status: highConfidence ? 'Auto_Prescribed' : 'Need_Expert',
      createdAt: new Date().toISOString(),
    };
    setResult(diagnosis);
    setState((prev) => {
      let next = { ...prev, diagnoses: [diagnosis, ...prev.diagnoses] };
      next = addLedgerEntry(next, {
        type: 'AI_Diagnosis',
        farmId: farm.id,
        title: `AI chẩn đoán: ${diagnosis.disease}`,
        detail: `Confidence ${diagnosis.confidence}%. ${diagnosis.prescription}`,
      });
      if (!highConfidence) {
        next.sosTickets = [
          {
            id: `SOS-${Date.now().toString().slice(-4)}`,
            farmId: farm.id,
            farmer: 'Ngô Hoàng Trường Đạt',
            crop: farm.crop,
            issue: diagnosis.disease,
            confidence: diagnosis.confidence,
            priority: 'High',
            status: 'Open',
            iotSummary: 'Đính kèm lịch sử IoT 30 ngày: độ ẩm cao, nhiệt độ ổn định 25-28°C.',
            expertDiagnosis: '',
            treatment: '',
          },
          ...prev.sosTickets,
        ];
      }
      return next;
    });
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">AI Hub Diagnostics</p>
          <h1>Chẩn đoán bệnh cây từ ảnh và IoT</h1>
          <p>MVP mô phỏng đủ 2 nhánh: tự kê đơn khi confidence cao, tạo SOS khi confidence thấp.</p>
        </div>
      </div>

      <div className="split-grid">
        <article className="panel">
          <div className="panel-header">
            <h3>Ảnh lá chanh/khóm</h3>
            <Bot size={20} />
          </div>
          <div className="upload-box">
            <Leaf size={40} />
            <strong>Thả ảnh bệnh cây vào đây</strong>
            <p>Demo chưa upload thật, nút bên dưới sẽ mô phỏng kết quả AI.</p>
          </div>
          <div className="segmented">
            <button className={mode === 'auto' ? 'active' : ''} onClick={() => setMode('auto')}>Confidence cao</button>
            <button className={mode === 'sos' ? 'active' : ''} onClick={() => setMode('sos')}>Confidence thấp</button>
          </div>
          <button className="primary-button full" onClick={() => analyze()}>
            <Bot size={17} /> Phân tích ngay
          </button>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h3>Kết quả</h3>
            {result && <Badge status={result.confidence >= 75 ? 'success' : 'warning'}>{result.confidence}%</Badge>}
          </div>
          {!result ? (
            <div className="empty-state">Chưa có phân tích mới.</div>
          ) : (
            <div className="result-card">
              <strong>{result.disease}</strong>
              <p>{result.prescription}</p>
              {result.confidence >= 75 ? (
                <div className="recommend-box">
                  <h4>Sản phẩm gợi ý trong bán kính 15km</h4>
                  {state.products.slice(0, 2).map((item) => (
                    <div key={item.id}>
                      <span>{item.name}</span>
                      <strong>{currency(item.price)}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert-card">
                  <Badge status="warning">SOS đã tạo</Badge>
                  <p>Ticket đã chuyển sang dashboard chuyên gia kèm lịch sử IoT.</p>
                </div>
              )}
            </div>
          )}
        </article>
      </div>

      <article className="panel">
        <div className="panel-header">
          <h3>Lịch sử chẩn đoán</h3>
          <Badge>{state.diagnoses.length} bản ghi</Badge>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Mã</th><th>Cây trồng</th><th>Bệnh</th><th>Confidence</th><th>Trạng thái</th></tr></thead>
            <tbody>
              {state.diagnoses.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.crop}</td>
                  <td>{item.disease}</td>
                  <td>{item.confidence}%</td>
                  <td><Badge status={item.confidence >= 75 ? 'success' : 'warning'}>{item.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

function FeedPage({ state, setState, role, notify }) {
  const account = roles.find((item) => item.id === role);
  const [content, setContent] = useState('');
  const [tagText, setTagText] = useState(role === 'expert' ? 'Cảnh báo dịch, Bến Lức' : 'Chanh không hạt, Hỏi đáp');
  const [commentDrafts, setCommentDrafts] = useState({});
  const [feedFilter, setFeedFilter] = useState('all');

  const visiblePosts = (state.feedPosts || []).filter((post) => {
    if (feedFilter === 'all') return true;
    if (feedFilter === 'question') return post.type === 'question';
    if (feedFilter === 'alert') return post.type === 'alert' || post.type === 'guide';
    return post.tags.some((tag) => tag.toLowerCase().includes(feedFilter.toLowerCase()));
  });

  const createPost = () => {
    const cleanContent = content.trim();
    if (!cleanContent) {
      notify('Bạn nhập nội dung bài viết trước đã nha.');
      return;
    }
    const tags = tagText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 4);

    setState((prev) => ({
      ...prev,
      feedPosts: [
        {
          id: `POST-${Date.now()}`,
          authorRole: role,
          authorName: account.accountName,
          authorTitle: role === 'expert' ? 'Kỹ sư nông nghiệp' : 'Nông dân',
          location: account.location,
          content: cleanContent,
          tags,
          type: role === 'expert' ? 'alert' : 'question',
          mediaTitle: tags[0] || 'Bài đăng GREENOVA',
          mediaTone: role === 'expert' ? 'guide' : 'field',
          likes: 0,
          comments: [],
          createdAt: new Date().toISOString(),
        },
        ...(prev.feedPosts || []),
      ],
    }));
    setContent('');
    notify('Đã đăng bài lên Bảng tin.');
  };

  const likePost = (postId) => {
    setState((prev) => ({
      ...prev,
      feedPosts: prev.feedPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    }));
    notify('Đã đánh dấu bài viết là hữu ích.');
  };

  const addComment = (postId) => {
    const cleanContent = (commentDrafts[postId] || '').trim();
    if (!cleanContent) {
      notify('Bạn nhập bình luận trước đã nha.');
      return;
    }
    setState((prev) => ({
      ...prev,
      feedPosts: prev.feedPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: `CMT-${Date.now()}`,
                  authorName: account.accountName,
                  authorRole: role,
                  content: cleanContent,
                },
              ],
            }
          : post,
      ),
    }));
    setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
    notify('Đã thêm bình luận.');
  };

  const seedComposer = (kind) => {
    const presets = {
      photo: {
        content: 'Mình vừa chụp ảnh vườn sáng nay. Lá ở hàng gần mương có vài đốm lạ, nhờ mọi người xem giúp.',
        tags: 'Ảnh vườn, Chanh không hạt, Bến Lức',
      },
      symptom: {
        content: 'Triệu chứng: lá vàng nhẹ từ mép vào, xuất hiện sau mưa lớn 2 ngày. Độ ẩm không khí đang trên 85%.',
        tags: 'Triệu chứng, Nấm lá, IoT',
      },
      mood: {
        content: 'Hôm nay hệ thống IoT báo van tưới tự bật đúng lúc đất xuống 38%. Demo này thấy khá sát nhu cầu thực tế.',
        tags: 'Cảm nhận, IoT tưới tự động',
      },
    };
    setContent(presets[kind].content);
    setTagText(presets[kind].tags);
    notify('Đã điền nội dung mẫu vào ô đăng bài.');
  };

  const sharePost = async (post) => {
    const text = `${post.authorName}: ${post.content}`;
    try {
      await navigator.clipboard.writeText(text);
      notify('Đã copy nội dung bài viết để chia sẻ.');
    } catch {
      notify('Đã tạo hành động chia sẻ demo.');
    }
  };

  const openPostMenu = (post) => {
    notify(`Menu bài viết: đã lưu "${post.mediaTitle || post.tags[0]}" vào danh sách theo dõi demo.`);
  };

  return (
    <section className="facebook-feed">
      <aside className="fb-left-rail">
        <div className="fb-profile-mini">
          <div className="fb-avatar big">{account.accountName.charAt(0)}</div>
          <div>
            <strong>{account.accountName}</strong>
            <span>{role === 'expert' ? 'Kỹ sư nông nghiệp' : 'Nông dân'} tại {account.location}</span>
          </div>
        </div>
        {[
          ['Cộng đồng Bến Lức', Sprout],
          ['Ca bệnh đang theo dõi', ClipboardList],
          ['Cảnh báo dịch tễ', AlertTriangle],
          ['Kho bài viết kỹ thuật', FileCheck2],
          ['Nhật ký đã chia sẻ', QrCode],
        ].map(([label, Icon]) => (
          <button
            key={label}
            className="fb-left-link"
            onClick={() => {
              if (label.includes('Ca bệnh')) setFeedFilter('question');
              else if (label.includes('Cảnh báo')) setFeedFilter('alert');
              else if (label.includes('Nhật ký')) setFeedFilter('QR');
              else setFeedFilter('all');
              notify(`Đã lọc Bảng tin theo: ${label}.`);
            }}
          >
            <Icon size={20} /> {label}
          </button>
        ))}
      </aside>

      <main className="fb-center-feed">
        <div className="fb-stories">
          {[
            ['Vườn chanh', 'Độ ẩm thấp, van đã bật'],
            ['Khóm ven kênh', 'Cần kiểm tra lá vàng'],
            ['Kỹ sư Khoa', 'Mẹo phòng nấm lá'],
          ].map(([title, desc]) => (
            <article key={title} className="fb-story-card">
              <div className="fb-story-avatar">{title.charAt(0)}</div>
              <strong>{title}</strong>
              <span>{desc}</span>
            </article>
          ))}
        </div>

        <article className="fb-composer">
          <div className="fb-composer-top">
            <div className="fb-avatar">{account.accountName.charAt(0)}</div>
            <button className="fb-input-pill" onClick={() => document.getElementById('feed-post-box')?.focus()}>
              {role === 'expert' ? 'Chia sẻ cảnh báo hoặc hướng dẫn kỹ thuật...' : 'Bạn đang nghĩ gì về vườn hôm nay?'}
            </button>
          </div>
          <textarea
            id="feed-post-box"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={
              role === 'expert'
                ? 'Ví dụ: Bà con trồng chanh ở Bến Lức nên kiểm tra mặt dưới lá sau mưa...'
                : 'Ví dụ: Lá chanh có đốm vàng sau 3 ngày mưa, mình nên xử lý sao?'
            }
            rows={3}
          />
          <input
            className="fb-tag-input"
            value={tagText}
            onChange={(event) => setTagText(event.target.value)}
            placeholder="Tag, cách nhau bằng dấu phẩy"
          />
          <div className="fb-composer-actions">
            <button onClick={() => seedComposer('photo')}><Camera size={19} /> Ảnh vườn</button>
            <button onClick={() => seedComposer('symptom')}><ImageIcon size={19} /> Triệu chứng</button>
            <button onClick={() => seedComposer('mood')}><Smile size={19} /> Cảm nhận</button>
            <button className="fb-post-button" onClick={createPost}><Send size={16} /> Đăng</button>
          </div>
        </article>

        <div className="fb-post-list">
          {visiblePosts.map((post) => {
            const PostIcon = post.authorRole === 'expert' ? Bot : Sprout;
            return (
              <article key={post.id} className="fb-post-card">
                <header className="fb-post-header">
                  <div className={`fb-avatar ${post.authorRole}`}>
                    <PostIcon size={18} />
                  </div>
                  <div>
                    <strong>{post.authorName}</strong>
                    <span>{post.authorTitle} · {post.location}</span>
                    <small>{new Date(post.createdAt).toLocaleString('vi-VN')} · Công khai</small>
                  </div>
                  <button className="fb-icon-plain" onClick={() => openPostMenu(post)}><MoreHorizontal size={20} /></button>
                </header>

                <p className="fb-post-content">{post.content}</p>
                <div className="fb-tags">
                  {post.tags.map((tag) => <span key={tag}>#{tag}</span>)}
                </div>

                <div className={`fb-post-media ${post.authorRole} ${post.mediaTone || ''}`}>
                  <div>
                    <span>{post.type === 'alert' ? 'Cảnh báo kỹ thuật' : post.type === 'guide' ? 'Hướng dẫn kỹ thuật' : 'Ảnh vườn mô phỏng'}</span>
                    <strong>{post.mediaTitle || post.tags[0] || 'GREENOVA Field'}</strong>
                  </div>
                </div>

                <div className="fb-social-counts">
                  <span><Heart size={14} /> {post.likes} người thấy hữu ích</span>
                  <span>{post.comments.length} bình luận</span>
                </div>

                <div className="fb-post-actions">
                  <button onClick={() => likePost(post.id)}><Heart size={18} /> Hữu ích</button>
                  <button onClick={() => document.getElementById(`comment-${post.id}`)?.focus()}><MessageCircle size={18} /> Bình luận</button>
                  <button onClick={() => sharePost(post)}><Share2 size={18} /> Chia sẻ</button>
                </div>

                <div className="fb-comment-list">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="fb-comment-item">
                      <div className={`fb-comment-avatar ${comment.authorRole}`}>
                        {comment.authorName.charAt(0)}
                      </div>
                      <p>
                        <strong>{comment.authorName}</strong>
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="fb-comment-box">
                  <div className="fb-comment-avatar">{account.accountName.charAt(0)}</div>
                  <input
                    id={`comment-${post.id}`}
                    value={commentDrafts[post.id] || ''}
                    onChange={(event) =>
                      setCommentDrafts((prev) => ({ ...prev, [post.id]: event.target.value }))
                    }
                    placeholder="Viết bình luận..."
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') addComment(post.id);
                    }}
                  />
                  <button onClick={() => addComment(post.id)}>
                    <Send size={15} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      <aside className="fb-right-rail">
        <article className="fb-side-card">
          <div className="fb-side-title">
            <strong>Chủ đề nổi bật</strong>
            <MessageCircle size={18} />
          </div>
          {['Chanh không hạt', 'Nấm lá', 'IoT tưới tự động', 'Escrow vật tư', 'Khóm Bến Lức'].map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setFeedFilter(topic);
                notify(`Đã lọc bài theo chủ đề #${topic}.`);
              }}
            >
              #{topic}
            </button>
          ))}
        </article>
        <article className="fb-side-card">
          <div className="fb-side-title">
            <strong>Kỹ sư đang online</strong>
            <span className="online-dot" />
          </div>
          {['KS. Nguyễn Minh Khoa', 'ThS. Lê Thu Hà', 'Trạm BVTV Long An'].map((name) => (
            <button
              key={name}
              className="fb-contact"
              onClick={() => notify(`Đã mở chat demo với ${name}.`)}
            >
              <div className="fb-contact-avatar">{name.charAt(0)}</div>
              <span>{name}</span>
            </button>
          ))}
        </article>
        <article className="fb-side-card">
          <div className="fb-side-title"><strong>Gợi ý đăng bài</strong></div>
          <p className="feed-rule">
            Ghi rõ cây trồng, vị trí, triệu chứng, thời điểm phát hiện và chỉ số IoT nếu có.
          </p>
        </article>
      </aside>
    </section>
  );
}

function MarketplacePage({ state, setState, notify }) {
  const checkout = (product) => {
    setState((prev) => {
      const total = product.price * 2;
      const order = {
        id: `ORD-${Date.now().toString().slice(-5)}`,
        buyer: 'Ngô Hoàng Trường Đạt',
        distributor: product.seller,
        product: product.name,
        quantity: 2,
        total,
        platformFee: Math.round(total * 0.03),
        netAmount: Math.round(total * 0.97),
        status: 'Paid_Escrow',
        countdownHours: 48,
        createdAt: new Date().toISOString(),
      };
      return addLedgerEntry(
        { ...prev, orders: [order, ...prev.orders] },
        {
          type: 'Escrow_Event',
          title: `Checkout escrow ${order.id}`,
          detail: `Khóa ${currency(total)} cho đơn ${product.name}.`,
        },
      );
    });
    notify(`Đã tạo đơn escrow cho ${product.name}.`);
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Sàn vật tư nội vùng</p>
          <h1>Vật tư chính hãng trong bán kính 15km</h1>
          <p>Checkout sẽ khóa tiền vào escrow tổng của admin và ghi ledger.</p>
        </div>
      </div>

      <div className="product-grid">
        {state.products.map((product) => (
          <article key={product.id} className="product-card-new">
            <div className="product-visual"><Package size={34} /></div>
            <Badge>{product.category}</Badge>
            <h3>{product.name}</h3>
            <p>{product.seller} • {product.distanceKm}km</p>
            <div className="product-meta">
              <strong>{currency(product.price)}</strong>
              <span>{product.stock} {product.unit}</span>
            </div>
            <button className="primary-button full" onClick={() => checkout(product)}>
              <ShoppingCart size={16} /> Mua 2 đơn vị bằng escrow
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function OrdersPage({ state, setState, role, notify }) {
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

function LedgerPage({ state }) {
  const farm = state.farms[0];
  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Immutable Ledger & QR Passport</p>
          <h1>Hộ chiếu nông sản {farm.crop}</h1>
          <p>Timeline hash mô phỏng, dùng để buyer kiểm tra lịch sử IoT, AI và hóa đơn vật tư.</p>
        </div>
      </div>
      <div className="split-grid">
        <article className="qr-passport">
          <QrCode size={86} />
          <h3>GREENOVA-PASS-{farm.id.toUpperCase()}</h3>
          <p>{farm.name}</p>
          <div>
            <span>Vùng trồng</span><strong>{farm.district}, Long An</strong>
            <span>Diện tích</span><strong>{farm.area} ha</strong>
            <span>Trạng thái</span><strong>Verified</strong>
          </div>
        </article>
        <article className="panel">
          <div className="panel-header"><h3>Hash timeline</h3><Badge status="success">{state.ledgers.length} blocks</Badge></div>
          <div className="timeline">
            {state.ledgers.map((entry) => (
              <div key={entry.id} className="timeline-item-new">
                <span><Badge>{entry.type}</Badge></span>
                <div>
                  <strong>{entry.title}</strong>
                  <p>{entry.detail}</p>
                  <code>{entry.hash}</code>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function ExpertPage({ state, setState, notify }) {
  const resolveTicket = (ticket) => {
    setState((prev) => {
      const treatment = 'Khoanh vùng cây bệnh, giảm tưới, dùng Trichoderma và kiểm tra rễ sau 72h.';
      let next = {
        ...prev,
        sosTickets: prev.sosTickets.map((item) =>
          item.id === ticket.id
            ? { ...item, status: 'Resolved', expertDiagnosis: 'Nghi nấm rễ do ẩm kéo dài', treatment }
            : item,
        ),
      };
      next = addLedgerEntry(next, {
        type: 'Expert_Prescription',
        farmId: ticket.farmId,
        title: `Chuyên gia kê đơn cho ${ticket.id}`,
        detail: treatment,
      });
      return next;
    });
    notify(`Đã kê đơn xử lý cho ticket ${ticket.id}.`);
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Expert SOS Inbox</p>
          <h1>Hàng đợi ca bệnh cần xử lý</h1>
          <p>Ca có confidence thấp được đóng gói cùng lịch sử IoT và chuyển về chuyên gia.</p>
        </div>
      </div>
      <div className="cards-column">
        {state.sosTickets.map((ticket) => (
          <article key={ticket.id} className="order-card">
            <div className="panel-header">
              <div>
                <h3>{ticket.id} • {ticket.crop}</h3>
                <p>{ticket.issue}</p>
              </div>
              <Badge status={ticket.status === 'Open' ? 'warning' : 'success'}>{statusLabel(ticket.status)}</Badge>
            </div>
            <div className="ticket-detail">
              <span>Farmer: <strong>{ticket.farmer}</strong></span>
              <span>AI confidence: <strong>{ticket.confidence}%</strong></span>
              <span>IoT: <strong>{ticket.iotSummary}</strong></span>
            </div>
            {ticket.treatment && <div className="recommend-box"><h4>Đơn đã kê</h4><p>{ticket.treatment}</p></div>}
            <button className="primary-button" disabled={ticket.status !== 'Open'} onClick={() => resolveTicket(ticket)}>
              <FileCheck2 size={16} /> Kê đơn xử lý
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function DistributorPage({ state, setState, notify }) {
  const restock = (id) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((item) => (item.id === id ? { ...item, stock: item.stock + 10 } : item)),
    }));
    notify('Đã nhập thêm 10 đơn vị vào tồn kho.');
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Distributor Console</p>
          <h1>Kho vật tư và đơn nội vùng</h1>
          <p>Quản lý tồn kho, cảnh báo sắp cạn và đơn hàng đang khóa escrow.</p>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Sản phẩm</th><th>Danh mục</th><th>Tồn</th><th>Giá</th><th>Thao tác</th></tr></thead>
          <tbody>
            {state.products.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td><Badge status={item.stock < 25 ? 'warning' : 'success'}>{item.stock} {item.unit}</Badge></td>
                <td>{currency(item.price)}</td>
                <td><button className="small-button" onClick={() => restock(item.id)}>Nhập thêm 10</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AuctionPage({ state, setState, role, notify }) {
  const addBid = (auction) => {
    setState((prev) => ({
      ...prev,
      auctions: prev.auctions.map((item) =>
        item.id === auction.id
          ? {
              ...item,
              bids: [
                {
                  id: `BID-${Date.now().toString().slice(-4)}`,
                  bidder: role === 'distributor' ? 'Đại lý Vật tư Út Chanh' : 'HTX Chanh Bến Lức',
                  price: Math.max(auction.ceilingPrice - 900, 1),
                  perks: 'Giao nhanh, có hồ sơ QR và hỗ trợ kiểm định.',
                  status: 'Pending',
                },
                ...item.bids,
              ],
            }
          : item,
      ),
    }));
    notify('Đã gửi một bid demo vào campaign.');
  };

  const settle = (auction) => {
    const fallbackBid = {
      id: `BID-${Date.now().toString().slice(-4)}`,
      bidder: role === 'distributor' ? 'Đại lý Vật tư Út Chanh' : 'HTX Chanh Bến Lức',
      price: Math.max(auction.ceilingPrice - 700, 1),
      perks: 'Bid tự tạo khi campaign chưa có nhà thầu.',
      status: 'Pending',
    };
    const bidPool = auction.bids.length > 0 ? auction.bids : [fallbackBid];
    const bestBid = [...bidPool].sort((a, b) => a.price - b.price)[0];
    setState((prev) => ({
      ...prev,
      auctions: prev.auctions.map((item) => (item.id === auction.id ? { ...item, status: 'Settled', bids: bidPool } : item)),
      orders: [
        {
          id: `B2B-${Date.now().toString().slice(-5)}`,
          buyer: auction.creator,
          distributor: bestBid.bidder,
          product: auction.title,
          quantity: 1,
          total: bestBid.price * 1000,
          platformFee: Math.round(bestBid.price * 1000 * 0.01),
          netAmount: Math.round(bestBid.price * 1000 * 0.99),
          status: 'Paid_Escrow',
          countdownHours: 48,
          createdAt: new Date().toISOString(),
        },
        ...prev.orders,
      ],
    }));
    notify(`Đã chấp nhận bid của ${bestBid.bidder} và tạo escrow B2B.`);
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Live Reverse Auction</p>
          <h1>Đấu giá ngược B2B/B2C</h1>
          <p>Nhà thầu hạ giá hoặc thêm dịch vụ, chủ campaign chọn bid để tạo escrow.</p>
        </div>
      </div>
      {state.auctions.map((auction) => (
        <article key={auction.id} className="order-card">
          <div className="panel-header">
            <div>
              <h3>{auction.title}</h3>
              <p>{auction.creator} • {auction.quantity} • Giá trần {currency(auction.ceilingPrice)}/kg</p>
            </div>
            <Badge status={auction.status === 'Settled' ? 'success' : 'warning'}>{statusLabel(auction.status)}</Badge>
          </div>
          <div className="bid-list">
            {auction.bids.map((bid) => (
              <div key={bid.id}>
                <strong>{bid.bidder}</strong>
                <span>{currency(bid.price)}/kg</span>
                <small>{bid.perks}</small>
              </div>
            ))}
          </div>
          <div className="order-actions">
            <button onClick={() => addBid(auction)}>Gửi bid demo</button>
            <button onClick={() => settle(auction)} disabled={auction.status === 'Settled'}>Chấp nhận bid tốt nhất</button>
          </div>
        </article>
      ))}
    </section>
  );
}

function BuyerPage({ state, setState, notify }) {
  const createCampaign = () => {
    setState((prev) => ({
      ...prev,
      auctions: [
        {
          id: `AUC-${Date.now().toString().slice(-5)}`,
          creator: 'Long An Fresh Export',
          type: 'Wholesale_B2B',
          title: 'Thu mua 5 tấn khóm sạch có nhật ký IoT',
          quantity: '5 tấn',
          ceilingPrice: 9500,
          location: 'Bến Lức, Long An',
          deadline: '2026-07-12',
          status: 'Open',
          bids: [],
        },
        ...prev.auctions,
      ],
    }));
    notify('Đã tạo campaign thu mua khóm sạch.');
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Corporate Sourcing</p>
          <h1>Nguồn hàng đã xác thực ledger</h1>
          <p>Buyer xem farm, QR passport và tạo campaign thu mua sỉ.</p>
        </div>
        <button className="primary-button" onClick={createCampaign}><Gavel size={16} /> Tạo campaign khóm</button>
      </div>
      <div className="product-grid">
        {state.farms.map((farm) => (
          <article key={farm.id} className="product-card-new">
            <div className="product-visual"><Sprout size={34} /></div>
            <Badge status="success">Verified Ledger</Badge>
            <h3>{farm.name}</h3>
            <p>{farm.crop} • {farm.area} ha • {farm.district}</p>
            <div className="product-meta">
              <strong>{farm.healthScore}% health</strong>
              <span>{state.ledgers.filter((entry) => entry.farmId === farm.id).length} ledger blocks</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminPage({ state, setState, notify }) {
  const updateKyc = (id, status) => {
    setState((prev) => ({
      ...prev,
      kycRequests: prev.kycRequests.map((item) => (item.id === id ? { ...item, status } : item)),
    }));
    notify(`Đã cập nhật KYC sang trạng thái ${statusLabel(status)}.`);
  };

  const pushAlert = (id) => {
    setState((prev) => ({
      ...prev,
      pestAlerts: prev.pestAlerts.map((item) => (item.id === id ? { ...item, pushed: true } : item)),
      notifications: [
        {
          id: `NOTI-${Date.now()}`,
          type: 'PestAlert',
          title: 'Admin đã phát cảnh báo dịch tễ',
          message: 'Cảnh báo nguy cơ nấm lá đã được gửi tới nông dân trồng chanh không hạt.',
          unread: true,
        },
        ...prev.notifications,
      ],
    }));
    notify('Đã phát cảnh báo dịch tễ tới người dùng liên quan.');
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Admin Orchestrator</p>
          <h1>Điều phối KYC, escrow và cảnh báo vùng</h1>
          <p>Admin có quyền duyệt hồ sơ, phát cảnh báo và can thiệp tranh chấp.</p>
        </div>
      </div>
      <div className="dashboard-grid">
        <article className="panel large">
          <div className="panel-header"><h3>KYC pipeline</h3><UserCheck size={18} /></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Hồ sơ</th><th>Vai trò</th><th>Risk</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
              <tbody>
                {state.kycRequests.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.role}</td>
                    <td>{item.riskScore}</td>
                    <td><Badge status={item.status === 'Approved' ? 'success' : item.status === 'Rejected' ? 'danger' : 'warning'}>{statusLabel(item.status)}</Badge></td>
                    <td>
                      <button className="small-button" onClick={() => updateKyc(item.id, 'Approved')}>Duyệt</button>
                      <button className="small-button danger" onClick={() => updateKyc(item.id, 'Rejected')}>Từ chối</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
        <article className="panel">
          <div className="panel-header"><h3>Cảnh báo dịch</h3><AlertTriangle size={18} /></div>
          {state.pestAlerts.map((alert) => (
            <div key={alert.id} className="alert-card">
              <Badge status={alert.pushed ? 'success' : 'warning'}>{alert.pushed ? 'Đã gửi' : alert.level}</Badge>
              <strong>{alert.disease}</strong>
              <p>{alert.reason}</p>
              <button className="primary-button full" onClick={() => pushAlert(alert.id)} disabled={alert.pushed}>
                <Bell size={16} /> Phát cảnh báo
              </button>
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}

export default function App() {
  const [state, setState] = useState(loadState);
  const [role, setRole] = useState(null);
  const [activePage, setActivePage] = useState('overview');
  const [toast, setToast] = useState('');
  const toastTimerRef = useRef(null);

  const notify = useCallback((message) => {
    setToast(message);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(''), 2600);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const page = useMemo(() => {
    const props = { state, setState, role, notify };
    switch (activePage) {
      case 'overview':
        return <OverviewPage {...props} />;
      case 'feed':
        return <FeedPage {...props} />;
      case 'ai':
        return <AIDiagnosisPage {...props} />;
      case 'market':
        return <MarketplacePage {...props} />;
      case 'orders':
        return <OrdersPage {...props} />;
      case 'ledger':
        return <LedgerPage {...props} />;
      case 'expert':
        return <ExpertPage {...props} />;
      case 'distributor':
        return <DistributorPage {...props} />;
      case 'auction':
        return <AuctionPage {...props} />;
      case 'buyer':
        return <BuyerPage {...props} />;
      case 'admin':
        return <AdminPage {...props} />;
      default:
        return <OverviewPage {...props} />;
    }
  }, [activePage, notify, role, state]);

  if (!role) return <LoginScreen onLogin={setRole} />;

  return (
    <>
      <Shell
        role={role}
        activePage={activePage}
        setActivePage={setActivePage}
        state={state}
        notify={notify}
        onLogout={() => setRole(null)}
        onReset={() => {
          setState(initialGreenovaState);
          notify('Đã reset toàn bộ dữ liệu demo.');
        }}
      >
        {page}
      </Shell>
      <Toast toast={toast} onClose={() => setToast('')} />
    </>
  );
}
