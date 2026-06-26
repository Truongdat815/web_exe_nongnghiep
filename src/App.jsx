import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bell,
  Bot,
  Building2,
  ChevronRight,
  CheckCircle2,
  Leaf,
  LockKeyhole,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCcw,
  Search,
  Sprout,
  Store,
  X,
} from 'lucide-react';
import { defaultFeedPosts, initialGreenovaState, roles } from './data/greenovaData';
import { getFirstPageForRole, roleApps } from './roles/roleRegistry';
import { roleTheme } from './roles/roleTheme';

const STORAGE_KEY = 'greenova-mvp-state-v1';

function normalizeFeedPost(post) {
  return {
    ...post,
    tags: Array.isArray(post.tags) ? post.tags : [],
    comments: Array.isArray(post.comments) ? post.comments : [],
    likes: Number.isFinite(post.likes) ? post.likes : 0,
  };
}

function mergeRecord(defaultItem = {}, savedItem = {}) {
  const result = { ...defaultItem, ...savedItem };
  Object.keys(defaultItem).forEach((key) => {
    if (
      defaultItem[key] &&
      savedItem?.[key] &&
      typeof defaultItem[key] === 'object' &&
      typeof savedItem[key] === 'object' &&
      !Array.isArray(defaultItem[key]) &&
      !Array.isArray(savedItem[key])
    ) {
      result[key] = mergeRecord(defaultItem[key], savedItem[key]);
    }
  });
  return result;
}

function mergeCollection(defaultItems = [], savedItems = []) {
  const savedMap = new Map((savedItems || []).map((item) => [item.id, item]));
  const merged = defaultItems.map((item) => mergeRecord(item, savedMap.get(item.id) || {}));
  const defaultIds = new Set(defaultItems.map((item) => item.id));
  const customItems = (savedItems || []).filter((item) => !defaultIds.has(item.id));
  return [...merged, ...customItems];
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialGreenovaState;
    const saved = JSON.parse(raw);
    const savedPosts = (saved.feedPosts || []).map(normalizeFeedPost);
    const savedPostIds = new Set(savedPosts.map((post) => post.id));
    const missingDefaultPosts = defaultFeedPosts.filter((post) => !savedPostIds.has(post.id)).map(normalizeFeedPost);
    return {
      ...initialGreenovaState,
      ...saved,
      farms: mergeCollection(initialGreenovaState.farms, saved.farms),
      devices: mergeCollection(initialGreenovaState.devices, saved.devices),
      products: mergeCollection(initialGreenovaState.products, saved.products),
      hardwareParts: mergeCollection(initialGreenovaState.hardwareParts, saved.hardwareParts),
      iotKits: mergeCollection(initialGreenovaState.iotKits, saved.iotKits),
      feedPosts: [...missingDefaultPosts, ...savedPosts],
    };
  } catch {
    return initialGreenovaState;
  }
}

function LoginScreen({ onLogin }) {
  const [authMode, setAuthMode] = useState(null);
  const [landingPage, setLandingPage] = useState('home');
  const openAuth = (mode) => setAuthMode(mode);
  const landingTabs = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'about', label: 'Giới thiệu' },
    { id: 'iot', label: 'IoT' },
    { id: 'benefits', label: 'Lợi ích' },
    { id: 'workflow', label: 'Quy trình' },
  ];

  const goLandingPage = (page) => {
    setLandingPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className={`landing-page landing-view-${landingPage}`}>
      <header className="landing-header">
        <button className="landing-brand" onClick={() => goLandingPage('home')}>
          <div className="brand-mark small"><Leaf size={22} /></div>
          <div>
            <strong>GREENOVA</strong>
            <span>Nông nghiệp số Long An</span>
          </div>
        </button>
        <nav className="landing-nav">
          {landingTabs.map((tab) => (
            <button key={tab.id} className={landingPage === tab.id ? 'active' : ''} onClick={() => goLandingPage(tab.id)}>
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="landing-auth">
          <button className="ghost-button" onClick={() => openAuth('login')}>Đăng nhập</button>
          <button className="solid-button" onClick={() => openAuth('register')}>Đăng ký</button>
        </div>
      </header>

      <section key={landingPage} className="landing-stage">
        {landingPage === 'home' && (
          <div className="landing-hero landing-panel">
            <div className="landing-hero-copy">
              <p className="eyebrow">GREENOVA Agricultural Digital Ecosystem</p>
              <h1>Nền tảng số cho nông dân, kỹ sư và chuỗi cung ứng nông nghiệp</h1>
              <p>
                Một hệ sinh thái nhẹ nhưng có đủ demo: IoT ESP32, AI chẩn đoán, bảng tin cộng đồng,
                sàn vật tư escrow, đấu giá ngược và QR nhật ký canh tác cho Bến Lức, Long An.
              </p>
              <div className="landing-cta">
                <button className="solid-button large" onClick={() => openAuth('register')}>Bắt đầu dùng thử</button>
                <button className="outline-link button-link" onClick={() => goLandingPage('iot')}>Xem IoT hoạt động <ChevronRight size={16} /></button>
              </div>
              <div className="hero-metrics">
                <span><strong>5</strong> vai trò</span>
                <span><strong>3</strong> trạm IoT mẫu</span>
                <span><strong>48h</strong> escrow</span>
              </div>
            </div>

            <div className="landing-hero-card">
              <div className="hero-photo-stack">
                <div className="hero-photo main"><span>Vùng trồng Bến Lức</span></div>
                <div className="hero-photo lime"><span>Chanh không hạt</span></div>
                <div className="hero-photo farmer"><span>Canh tác số</span></div>
              </div>
              <div className="device-card">
                <div className="device-topline">
                  <span className="online-dot" />
                  ESP32-BL-7A:21 đang hoạt động
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
          </div>
        )}

        {landingPage === 'about' && (
          <div className="landing-panel landing-info-page">
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
            <div className="produce-showcase paged">
              <div className="produce-heading">
                <p className="eyebrow">Pilot Crops</p>
                <h2>Nông sản chủ lực</h2>
              </div>
              <div className="produce-grid">
                {[
                  ['lime', 'Chanh không hạt', 'Theo dõi độ ẩm, nấm lá và QR passport cho lô hàng.'],
                  ['pineapple', 'Khóm Bến Lức', 'Cảnh báo úng rễ, vàng lá và chiến dịch thu mua sỉ.'],
                  ['market', 'Vật tư chính hãng', 'Gợi ý phân bón, thuốc sinh học từ đại lý trong 15km.'],
                ].map(([tone, title, text]) => (
                  <article key={title} className={`produce-card ${tone}`}>
                    <div />
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {landingPage === 'iot' && (
          <div className="landing-panel landing-iot-page">
            <div className="section-heading">
              <p className="eyebrow">IoT Remote Telemetry</p>
              <h2>Giám sát ruộng vườn theo từng phân khu</h2>
              <p>
                Trạm ESP32 gửi độ ẩm đất, độ mặn, nhiệt độ, độ ẩm không khí, lượng mưa và NPK.
                Khi đất khô nhưng nước không nhiễm mặn, hệ thống mô phỏng mở van tưới tự động.
              </p>
            </div>
            <div className="iot-command-center">
              <div className="iot-map-card">
                <span className="scan-ring one" />
                <span className="scan-ring two" />
                <span className="field-node node-a">A</span>
                <span className="field-node node-b">B</span>
                <span className="field-node node-c">C</span>
                <strong>Vườn chanh không hạt Thạnh Phú</strong>
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
            </div>
          </div>
        )}

        {landingPage === 'benefits' && (
          <div className="landing-panel landing-benefits-page">
            <div className="section-heading">
              <p className="eyebrow">Lợi ích chính</p>
              <h2>Nhẹ để demo, đủ sâu để kể đúng nghiệp vụ</h2>
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
          </div>
        )}

        {landingPage === 'workflow' && (
          <div className="landing-panel landing-workflow-page">
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
          </div>
        )}
      </section>

      <div className="landing-pager" aria-label="Chuyển trang landing">
        {landingTabs.map((tab) => (
          <button key={tab.id} className={landingPage === tab.id ? 'active' : ''} onClick={() => goLandingPage(tab.id)}>
            <span />
            {tab.label}
          </button>
        ))}
      </div>

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

function Shell({ role, activePage, setActivePage, navItems = [], onLogout, onReset, children, state, notify }) {
  const nav = navItems;
  const account = roles.find((item) => item.id === role);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const unread = state.notifications.filter((item) => item.unread).length;
  const RoleIcon = roleTheme[role].icon;

  useEffect(() => {
    if (!nav.find((item) => item.id === activePage)) {
      setActivePage(nav[0].id);
    }
  }, [activePage, nav, setActivePage]);

  const navContent = (isDrawer = false) => (
    <>
      <div className="sidebar-brand">
        <div className="brand-mark small"><Leaf size={22} /></div>
        <div className="sidebar-brand-text">
          <strong>GREENOVA</strong>
          <span>Agricultural Digital Ecosystem</span>
        </div>
      </div>

      <div className="account-card">
        <RoleIcon size={18} style={{ color: roleTheme[role].color }} />
        <div className="account-copy">
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
              title={item.label}
              onClick={() => {
                setActivePage(item.id);
                setMobileOpen(false);
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {!isDrawer && (
          <button onClick={() => setSidebarCollapsed((value) => !value)}>
            {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            <span>{sidebarCollapsed ? 'Mở menu' : 'Thu gọn'}</span>
          </button>
        )}
        <button onClick={onReset}><RefreshCcw size={16} /> <span>Reset demo</span></button>
        <button onClick={onLogout}><LogOut size={16} /> <span>Đăng xuất</span></button>
      </div>
    </>
  );

  return (
    <div className={`app-shell theme-${role} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="app-sidebar desktop-only">{navContent(false)}</aside>
      {mobileOpen && (
        <>
          <button className="drawer-backdrop" aria-label="Đóng menu" onClick={() => setMobileOpen(false)} />
          <div className="mobile-drawer">
            <button className="drawer-close" onClick={() => setMobileOpen(false)}><X size={18} /></button>
            {navContent(true)}
          </div>
        </>
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

  const handleRoleLogin = (roleId) => {
    setRole(roleId);
    setActivePage(getFirstPageForRole(roleId));
  };

  if (!role) return <LoginScreen onLogin={handleRoleLogin} />;

  const ActiveRoleApp = roleApps[role]?.component;
  const shellProps = {
    role,
    activePage,
    setActivePage,
    state,
    setState,
    notify,
    onLogout: () => setRole(null),
    onReset: () => {
      setState(initialGreenovaState);
      notify('Đã reset toàn bộ dữ liệu demo.');
    },
  };

  return (
    <>
      <ActiveRoleApp Shell={Shell} shellProps={shellProps} />
      <Toast toast={toast} onClose={() => setToast('')} />
    </>
  );
}
