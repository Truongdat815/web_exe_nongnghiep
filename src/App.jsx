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
import { LandingPage } from './pages/landing/LandingPage';

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
        <div className="brand-mark small" style={{ background: 'transparent', padding: 0 }}>
          <img src="/fav-white.ico" alt="Logo" style={{ width: 34, height: 34 }} />
        </div>
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

  if (!role) return <LandingPage onLogin={handleRoleLogin} />;

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
