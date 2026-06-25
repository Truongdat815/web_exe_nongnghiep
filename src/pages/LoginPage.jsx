import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLE_CONFIG } from '../data/mockData';
import logoImg from '../assets/logo.png';

export default function LoginPage({ onGoRegister }) {
  const { login, loginAsRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Giả lập delay 600ms
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleQuickLogin = async (role) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    loginAsRole(role);
    setLoading(false);
  };

  const roles = ['farmer', 'distributor', 'buyer', 'admin'];

  return (
    <div className="auth-layout">
      {/* Left panel - branding */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <img src={logoImg} alt="Happy Field" />
            </div>
            <div>
              <div className="auth-logo-title">Happy Field</div>
              <div className="auth-logo-sub">Nông Sản Tươi Sạch</div>
            </div>
          </div>

          <div className="auth-brand-headline">
            Hệ sinh thái nông nghiệp số<br />
            <span className="auth-brand-highlight">thông minh nhất</span><br />
            Đông Nam Á
          </div>

          <div className="auth-brand-stats">
            {[
              { icon: '👨‍🌾', value: '50.000+', label: 'Nông dân' },
              { icon: '🏭', value: '2.000+', label: 'Nhà phân phối' },
              { icon: '🌾', value: '120.000+', label: 'Ha canh tác' },
            ].map((s, i) => (
              <div key={i} className="auth-stat">
                <div className="auth-stat-icon">{s.icon}</div>
                <div className="auth-stat-value">{s.value}</div>
                <div className="auth-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="auth-brand-features">
            {['🤖 AI chẩn đoán bệnh cây', '📡 Cảm biến IoT realtime', '⛓️ Truy xuất blockchain', '🛒 Sàn TMĐT B2B2C'].map((f, i) => (
              <div key={i} className="auth-feature-tag">{f}</div>
            ))}
          </div>
        </div>

        {/* Decorative circles */}
        <div className="auth-deco-circle auth-deco-1"></div>
        <div className="auth-deco-circle auth-deco-2"></div>
      </div>

      {/* Right panel - form */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Chào mừng trở lại 👋</h1>
            <p className="auth-form-subtitle">Đăng nhập để quản lý nông trại của bạn</p>
          </div>

          {/* Quick Login Buttons */}
          <div className="auth-quick-login">
            <div className="auth-quick-label">
              <span className="auth-quick-line"></span>
              <span>Đăng nhập nhanh theo vai trò</span>
              <span className="auth-quick-line"></span>
            </div>
            <div className="auth-role-grid">
              {roles.map(role => {
                const cfg = ROLE_CONFIG[role];
                return (
                  <button
                    key={role}
                    className="auth-role-btn"
                    style={{ '--role-color': cfg.color, '--role-gradient': cfg.gradient }}
                    onClick={() => handleQuickLogin(role)}
                    disabled={loading}
                    title={cfg.description}
                  >
                    <span className="auth-role-btn-icon">{cfg.icon}</span>
                    <div className="auth-role-btn-text">
                      <div className="auth-role-btn-label">{cfg.label}</div>
                      <div className="auth-role-btn-desc">Demo</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="auth-or-divider">
            <span className="auth-or-line"></span>
            <span className="auth-or-text">Hoặc đăng nhập bằng tài khoản</span>
            <span className="auth-or-line"></span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">📧 Email</label>
              <div className="auth-input-wrap">
                <input
                  type="email"
                  className="form-input auth-input"
                  placeholder="email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="form-label" style={{ margin: 0 }}>🔒 Mật khẩu</label>
                <button type="button" style={{ fontSize: 12, color: 'var(--color-primary-light)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Quên mật khẩu?
                </button>
              </div>
              <div className="auth-input-wrap">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-input auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-input-toggle"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="auth-loading">
                  <span className="auth-spinner"></span>
                  Đang xác thực...
                </span>
              ) : (
                '🚀 Đăng nhập'
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="auth-demo-hint">
            <div className="auth-demo-hint-title">💡 Tài khoản demo:</div>
            <div className="auth-demo-hint-grid">
              <span>nongdan@demo.vn / 123456</span>
              <span>phanphoi@demo.vn / 123456</span>
              <span>doanhnghiep@demo.vn / 123456</span>
              <span>admin@demo.vn / admin123</span>
            </div>
          </div>

          <div className="auth-footer">
            Chưa có tài khoản?{' '}
            <button
              className="auth-link"
              onClick={onGoRegister}
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
