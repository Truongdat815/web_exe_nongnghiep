import { useAuth } from '../context/AuthContext';
import { notifications, ROLE_CONFIG } from '../data/mockData';
import logoImg from '../assets/logo.png';

// Nav theo sitemap - mỗi role thấy mục phù hợp
const navItems = [
  {
    section: 'Tổng quan',
    items: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard', roles: ['farmer', 'distributor', 'buyer', 'admin'] },
    ],
  },
  {
    section: 'Nông nghiệp',
    items: [
      { id: 'farms', icon: '🌿', label: 'Vườn của tôi', roles: ['farmer'] },
      { id: 'ledger', icon: '📋', label: 'Nhật ký canh tác', roles: ['farmer', 'buyer'] },
      { id: 'ai-diagnosis', icon: '🤖', label: 'Chẩn đoán AI', roles: ['farmer'] },
    ],
  },
  {
    section: 'Thương mại',
    items: [
      { id: 'marketplace', icon: '🛒', label: 'Sàn TMĐT', roles: ['farmer', 'distributor', 'buyer', 'admin'] },
      { id: 'auction', icon: '🔨', label: 'Đấu giá ngược', roles: ['farmer', 'distributor', 'buyer'] },
      { id: 'orders', icon: '📦', label: 'Đơn hàng', roles: ['farmer', 'distributor', 'buyer'] },
    ],
  },
  {
    section: 'Cộng đồng',
    items: [
      { id: 'social', icon: '💬', label: 'Mạng xã hội', roles: ['farmer', 'distributor', 'buyer', 'admin'] },
      { id: 'market-prices', icon: '📈', label: 'Giá thị trường', roles: ['farmer', 'distributor', 'buyer', 'admin'] },
    ],
  },
  {
    section: 'Quản trị',
    items: [
      { id: 'admin', icon: '🗺️', label: 'Admin Dashboard', roles: ['admin'] },
    ],
  },
];

const unreadCount = notifications.filter(n => !n.read).length;

export default function Sidebar({ activePage, onNavigate }) {
  const { user, logout } = useAuth();
  const role = user?.role || 'farmer';
  const roleConfig = ROLE_CONFIG[role] || {};

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <img src={logoImg} alt="Happy Field logo" />
        </div>
        <div className="sidebar-logo-text">
          <h1>Happy Field</h1>
          <span>Nông Sản Tươi Sạch</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(section => {
          const visibleItems = section.items.filter(item => item.roles.includes(role));
          if (visibleItems.length === 0) return null;
          return (
            <div key={section.section}>
              <div className="sidebar-section-label">{section.section}</div>
              {visibleItems.map(item => (
                <button
                  key={item.id}
                  className={`sidebar-nav-item ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.id === 'social' && unreadCount > 0 && (
                    <span className="sidebar-nav-badge">{unreadCount}</span>
                  )}
                </button>
              ))}
            </div>
          );
        })}
      </nav>

      {/* User Info */}
      <div>
        {/* Role badge */}
        <div style={{
          margin: '0 12px 8px',
          background: `${roleConfig.color}12`,
          border: `1px solid ${roleConfig.color}33`,
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ fontSize: 18 }}>{roleConfig.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: roleConfig.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {roleConfig.shortLabel}
            </div>
            {user?.company && (
              <div style={{ fontSize: 11, color: 'var(--text-dimmed)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.company}
              </div>
            )}
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-accent)' }}>
            ⭐{user?.trustScore}
          </span>
        </div>

        {/* User row */}
        <div className="sidebar-user">
          <div className="user-avatar" style={{ background: roleConfig.gradient }}>
            {(user?.name || 'U').charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-info-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Người dùng'}
            </div>
            <div className="user-info-role" style={{ color: roleConfig.color }}>
              {user?.location || ''}
            </div>
          </div>
        </div>

        {/* Logout */}
        <div style={{ padding: '0 0 12px' }}>
          <button className="logout-btn" onClick={logout}>
            <span>🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
