import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { notifications, ROLE_CONFIG } from '../data/mockData';
import logoImg from '../assets/logo.png';

const unreadCount = notifications.filter(n => !n.read).length;

const pageLabels = {
  dashboard: 'Dashboard',
  farms: 'Vườn của tôi',
  ledger: 'Nhật ký canh tác',
  'ai-diagnosis': 'Chẩn đoán AI',
  marketplace: 'Sàn TMĐT',
  auction: 'Đấu giá ngược',
  orders: 'Đơn hàng',
  social: 'Mạng xã hội Nông nghiệp',
  'market-prices': 'Giá thị trường',
  admin: 'Admin Dashboard',
};

export default function Topbar({ activePage }) {
  const { user, logout } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const roleConfig = ROLE_CONFIG[user?.role] || {};

  return (
    <header className="topbar">
      {/* Logo mini on topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 4 }}>
        <img src={logoImg} alt="Happy Field" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
        <span style={{ fontWeight: 900, fontSize: 14, color: 'var(--color-primary)', letterSpacing: '-0.3px' }}>Happy Field</span>
      </div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--text-dimmed)', fontSize: '13px' }}>/</span>
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {pageLabels[activePage] || activePage}
        </span>
      </div>

      {/* Search */}
      <div className="topbar-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Tìm sản phẩm, bệnh cây, nông sản..."
        />
      </div>

      <div className="topbar-actions">
        {/* IoT Status (only farmer) */}
        {user?.role === 'farmer' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: 'var(--color-success)'
          }}>
            <span className="live-dot"></span>
            IoT Live
          </div>
        )}

        {/* Wallet (farmer/distributor/buyer) */}
        {user?.walletBalance > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)',
            borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: 'var(--color-accent)'
          }}>
            💰 {(user.walletBalance / 1000000).toFixed(1)}M₫
          </div>
        )}

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            className="topbar-btn"
            onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false); }}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: 'var(--color-danger)', color: 'white', fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '999px', minWidth: 16, textAlign: 'center' }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div style={{
              position: 'absolute', top: '44px', right: 0,
              width: '360px', background: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 300,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>🔔 Thông báo</span>
                <span style={{ fontSize: '11px', color: 'var(--color-primary-light)', cursor: 'pointer' }}>Đánh dấu tất cả đã đọc</span>
              </div>
              <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
                    {!n.read && <div className="notification-dot"></div>}
                    {n.read && <div style={{ width: '8px', flexShrink: 0 }}></div>}
                    <div>
                      <div className="notification-title">{n.title}</div>
                      <div className="notification-msg">{n.message}</div>
                      <div className="notification-time">{new Date(n.timestamp).toLocaleString('vi-VN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User avatar + dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            className="user-avatar"
            style={{ width: 36, height: 36, fontSize: 14, cursor: 'pointer', background: roleConfig.gradient }}
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotif(false); }}
          >
            {(user?.name || 'U').charAt(0)}
          </div>

          {showUserMenu && (
            <div style={{
              position: 'absolute', top: '44px', right: 0,
              width: '240px', background: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 300,
              overflow: 'hidden',
            }}>
              {/* User info */}
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="user-avatar" style={{ width: 40, height: 40, fontSize: 16, background: roleConfig.gradient }}>
                    {(user?.name || 'U').charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name}</div>
                    <div style={{ fontSize: 11, color: roleConfig.color, fontWeight: 600 }}>
                      {roleConfig.icon} {roleConfig.label}
                    </div>
                  </div>
                </div>
                {user?.email && (
                  <div style={{ fontSize: 11, color: 'var(--text-dimmed)', marginTop: 8 }}>📧 {user.email}</div>
                )}
                {user?.phone && (
                  <div style={{ fontSize: 11, color: 'var(--text-dimmed)', marginTop: 2 }}>📱 {user.phone}</div>
                )}
                <div style={{ fontSize: 11, color: 'var(--text-dimmed)', marginTop: 2 }}>⭐ Tín nhiệm: <strong style={{ color: 'var(--color-accent)' }}>{user?.trustScore}/100</strong></div>
              </div>

              {/* Menu items */}
              {[
                { icon: '👤', label: 'Hồ sơ cá nhân' },
                { icon: '⚙️', label: 'Cài đặt tài khoản' },
                { icon: '🔒', label: 'Đổi mật khẩu' },
              ].map((item, i) => (
                <button key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                  width: '100%', background: 'none', border: 'none', textAlign: 'left',
                  fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit',
                  borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}

              {/* Logout */}
              <button
                onClick={() => { setShowUserMenu(false); logout(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                  width: '100%', background: 'none', border: 'none', textAlign: 'left',
                  fontSize: 13, color: '#fca5a5', cursor: 'pointer', fontFamily: 'inherit',
                  fontWeight: 700, transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <span>🚪</span> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
