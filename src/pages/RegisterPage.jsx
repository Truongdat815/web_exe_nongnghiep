import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLE_CONFIG } from '../data/mockData';
import logoImg from '../assets/logo.png';

const PROVINCES = [
  'An Giang', 'Bạc Liêu', 'Bến Tre', 'Bình Dương', 'Bình Phước', 'Bình Thuận',
  'Cà Mau', 'Cần Thơ', 'Đắk Lắk', 'Đắk Nông', 'Đồng Nai', 'Đồng Tháp',
  'Gia Lai', 'Hà Nội', 'Hậu Giang', 'Hồ Chí Minh', 'Kiên Giang', 'Kon Tum',
  'Lâm Đồng', 'Long An', 'Ninh Thuận', 'Sóc Trăng', 'Tây Ninh', 'Tiền Giang',
  'Trà Vinh', 'Vĩnh Long',
];

const CROP_OPTIONS = ['Lúa', 'Sầu riêng', 'Cà phê', 'Hồ tiêu', 'Chuối', 'Thanh long', 'Mít', 'Xoài', 'Nhãn', 'Bắp', 'Rau xanh', 'Cây khác'];

const PRODUCT_TYPES = ['Phân bón', 'Thuốc BVTV', 'Nông cụ/Máy móc', 'Hạt giống', 'Thiết bị tưới tiêu', 'IoT/Công nghệ'];

const CROP_BUYER = ['Lúa gạo', 'Trái cây', 'Cà phê', 'Hạt tiêu', 'Thủy sản', 'Rau củ', 'Nông sản đông lạnh'];

const roles = ['farmer', 'distributor', 'buyer', 'admin'];

export default function RegisterPage({ onGoLogin }) {
  const { register } = useAuth();
  const [step, setStep] = useState(1); // 1: chọn role, 2: điền thông tin, 3: hoàn thành
  const [selectedRole, setSelectedRole] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    province: '', company: '', farmArea: '', cropTypes: [], productTypes: [], buyerCrops: [],
    taxCode: '', website: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const updateForm = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const toggleArray = (key, val) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
    }));
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không hợp lệ';
    if (!form.phone.trim() || form.phone.length < 9) e.phone = 'Số điện thoại không hợp lệ';
    if (!form.password || form.password.length < 6) e.password = 'Mật khẩu ít nhất 6 ký tự';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Mật khẩu xác nhận không khớp';
    if (!form.province) e.province = 'Vui lòng chọn tỉnh/thành';
    if ((selectedRole === 'distributor' || selectedRole === 'buyer') && !form.company.trim()) {
      e.company = 'Vui lòng nhập tên công ty/doanh nghiệp';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = register({ ...form, role: selectedRole });
    setLoading(false);
    if (result.success) {
      setStep(3);
    } else {
      setErrors({ email: result.error });
    }
  };

  return (
    <div className="auth-layout">
      {/* Left branding */}
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
            Tham gia cùng<br />
            <span className="auth-brand-highlight">50.000+ nông dân</span><br />
            đang làm giàu từ số hóa
          </div>

          {/* Steps indicator */}
          <div className="reg-steps">
            {[
              { n: 1, label: 'Chọn vai trò' },
              { n: 2, label: 'Thông tin cá nhân' },
              { n: 3, label: 'Hoàn tất' },
            ].map(s => (
              <div key={s.n} className={`reg-step ${step >= s.n ? 'active' : ''} ${step > s.n ? 'done' : ''}`}>
                <div className="reg-step-dot">
                  {step > s.n ? '✓' : s.n}
                </div>
                <div className="reg-step-label">{s.label}</div>
                {s.n < 3 && <div className="reg-step-line"></div>}
              </div>
            ))}
          </div>

          <div className="auth-brand-features">
            {['✅ Miễn phí đăng ký', '🔒 Bảo mật tuyệt đối', '📱 Hỗ trợ 24/7', '🤖 AI tích hợp sẵn'].map((f, i) => (
              <div key={i} className="auth-feature-tag">{f}</div>
            ))}
          </div>
        </div>
        <div className="auth-deco-circle auth-deco-1"></div>
        <div className="auth-deco-circle auth-deco-2"></div>
      </div>

      {/* Right - form */}
      <div className="auth-form-panel">
        <div className="auth-form-container" style={{ maxWidth: 540 }}>

          {/* STEP 1: Role selection */}
          {step === 1 && (
            <div className="animate-slide-in">
              <div className="auth-form-header">
                <h1 className="auth-form-title">Bạn là ai trong hệ thống? 🤔</h1>
                <p className="auth-form-subtitle">Chọn vai trò phù hợp để có trải nghiệm tốt nhất</p>
              </div>

              <div className="role-select-grid">
                {roles.map(role => {
                  const cfg = ROLE_CONFIG[role];
                  const selected = selectedRole === role;
                  return (
                    <button
                      key={role}
                      className={`role-select-card ${selected ? 'selected' : ''}`}
                      style={{ '--role-color': cfg.color, '--role-gradient': cfg.gradient }}
                      onClick={() => setSelectedRole(role)}
                    >
                      <div className="role-card-icon">{cfg.icon}</div>
                      <div className="role-card-title">{cfg.label}</div>
                      <div className="role-card-desc">{cfg.description}</div>
                      <div className="role-card-features">
                        {cfg.features.slice(0, 3).map((f, i) => (
                          <span key={i} className="role-card-feature">✓ {f}</span>
                        ))}
                      </div>
                      {selected && <div className="role-card-check">✓</div>}
                    </button>
                  );
                })}
              </div>

              <button
                className="btn btn-primary btn-lg auth-submit-btn"
                onClick={() => setStep(2)}
                disabled={!selectedRole}
                style={{ marginTop: 20 }}
              >
                Tiếp theo →
              </button>
              <div className="auth-footer" style={{ marginTop: 16 }}>
                Đã có tài khoản?{' '}
                <button className="auth-link" onClick={onGoLogin}>Đăng nhập</button>
              </div>
            </div>
          )}

          {/* STEP 2: Fill info */}
          {step === 2 && (
            <div className="animate-slide-in">
              <div className="auth-form-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setStep(1)}
                    style={{ padding: '4px 10px', fontSize: 12 }}
                  >
                    ← Quay lại
                  </button>
                  <span
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: 13, fontWeight: 700,
                      color: ROLE_CONFIG[selectedRole]?.color,
                      background: `${ROLE_CONFIG[selectedRole]?.color}15`,
                      padding: '4px 12px', borderRadius: 'var(--radius-full)',
                      border: `1px solid ${ROLE_CONFIG[selectedRole]?.color}33`,
                    }}
                  >
                    {ROLE_CONFIG[selectedRole]?.icon} {ROLE_CONFIG[selectedRole]?.label}
                  </span>
                </div>
                <h1 className="auth-form-title">Thông tin đăng ký</h1>
                <p className="auth-form-subtitle">Điền đầy đủ để bắt đầu sử dụng nền tảng</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                {/* Name */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">
                    {selectedRole === 'distributor' || selectedRole === 'buyer' ? '👤 Người đại diện' : '👤 Họ và tên *'}
                  </label>
                  <input className={`form-input ${errors.name ? 'input-error' : ''}`} placeholder="Nguyễn Văn A" value={form.name} onChange={e => updateForm('name', e.target.value)} />
                  {errors.name && <div className="field-error">{errors.name}</div>}
                </div>

                {/* Company (distributor & buyer) */}
                {(selectedRole === 'distributor' || selectedRole === 'buyer') && (
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">
                      {selectedRole === 'buyer' ? '🏢 Tên doanh nghiệp *' : '🏭 Tên công ty/cửa hàng *'}
                    </label>
                    <input className={`form-input ${errors.company ? 'input-error' : ''}`} placeholder={selectedRole === 'buyer' ? 'Công ty TNHH Agri Export' : 'Công ty Phân bón ABC'} value={form.company} onChange={e => updateForm('company', e.target.value)} />
                    {errors.company && <div className="field-error">{errors.company}</div>}
                  </div>
                )}

                {/* Email */}
                <div className="form-group">
                  <label className="form-label">📧 Email *</label>
                  <input type="email" className={`form-input ${errors.email ? 'input-error' : ''}`} placeholder="email@example.com" value={form.email} onChange={e => updateForm('email', e.target.value)} />
                  {errors.email && <div className="field-error">{errors.email}</div>}
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="form-label">📱 Số điện thoại *</label>
                  <input type="tel" className={`form-input ${errors.phone ? 'input-error' : ''}`} placeholder="09xx xxx xxx" value={form.phone} onChange={e => updateForm('phone', e.target.value)} />
                  {errors.phone && <div className="field-error">{errors.phone}</div>}
                </div>

                {/* Province */}
                <div className="form-group">
                  <label className="form-label">📍 Tỉnh/Thành phố *</label>
                  <select className={`form-input ${errors.province ? 'input-error' : ''}`} value={form.province} onChange={e => updateForm('province', e.target.value)} style={{ color: form.province ? 'var(--text-primary)' : 'var(--text-dimmed)' }}>
                    <option value="">-- Chọn tỉnh thành --</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.province && <div className="field-error">{errors.province}</div>}
                </div>

                {/* Farmer-specific: farm area */}
                {selectedRole === 'farmer' && (
                  <div className="form-group">
                    <label className="form-label">🌿 Diện tích canh tác (ha)</label>
                    <input type="number" min="0" step="0.1" className="form-input" placeholder="2.5" value={form.farmArea} onChange={e => updateForm('farmArea', e.target.value)} />
                  </div>
                )}

                {/* Distributor: tax code */}
                {(selectedRole === 'distributor' || selectedRole === 'buyer') && (
                  <div className="form-group">
                    <label className="form-label">🏛️ Mã số thuế</label>
                    <input className="form-input" placeholder="0123456789" value={form.taxCode} onChange={e => updateForm('taxCode', e.target.value)} />
                  </div>
                )}

                {/* Password */}
                <div className="form-group">
                  <label className="form-label">🔒 Mật khẩu *</label>
                  <input type="password" className={`form-input ${errors.password ? 'input-error' : ''}`} placeholder="Ít nhất 6 ký tự" value={form.password} onChange={e => updateForm('password', e.target.value)} />
                  {errors.password && <div className="field-error">{errors.password}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">🔒 Xác nhận mật khẩu *</label>
                  <input type="password" className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`} placeholder="Nhập lại mật khẩu" value={form.confirmPassword} onChange={e => updateForm('confirmPassword', e.target.value)} />
                  {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
                </div>
              </div>

              {/* Farmer: crop types */}
              {selectedRole === 'farmer' && (
                <div className="form-group">
                  <label className="form-label">🌾 Loại cây đang canh tác</label>
                  <div className="checkbox-grid">
                    {CROP_OPTIONS.map(c => (
                      <label key={c} className={`checkbox-item ${form.cropTypes.includes(c) ? 'checked' : ''}`}>
                        <input type="checkbox" checked={form.cropTypes.includes(c)} onChange={() => toggleArray('cropTypes', c)} style={{ display: 'none' }} />
                        {form.cropTypes.includes(c) ? '✅' : '⬜'} {c}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Distributor: product types */}
              {selectedRole === 'distributor' && (
                <div className="form-group">
                  <label className="form-label">📦 Loại sản phẩm kinh doanh</label>
                  <div className="checkbox-grid">
                    {PRODUCT_TYPES.map(p => (
                      <label key={p} className={`checkbox-item ${form.productTypes.includes(p) ? 'checked' : ''}`}>
                        <input type="checkbox" checked={form.productTypes.includes(p)} onChange={() => toggleArray('productTypes', p)} style={{ display: 'none' }} />
                        {form.productTypes.includes(p) ? '✅' : '⬜'} {p}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Buyer: crop types to buy */}
              {selectedRole === 'buyer' && (
                <div className="form-group">
                  <label className="form-label">🛒 Nông sản thu mua chính</label>
                  <div className="checkbox-grid">
                    {CROP_BUYER.map(c => (
                      <label key={c} className={`checkbox-item ${form.buyerCrops.includes(c) ? 'checked' : ''}`}>
                        <input type="checkbox" checked={form.buyerCrops.includes(c)} onChange={() => toggleArray('buyerCrops', c)} style={{ display: 'none' }} />
                        {form.buyerCrops.includes(c) ? '✅' : '⬜'} {c}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <input type="checkbox" required style={{ marginTop: 2, accentColor: 'var(--color-primary)' }} />
                  <span>Tôi đồng ý với <span style={{ color: 'var(--color-primary-light)' }}>Điều khoản sử dụng</span> và <span style={{ color: 'var(--color-primary-light)' }}>Chính sách bảo mật</span> của NôngNghiệpSố.</span>
                </label>
              </div>

              {Object.keys(errors).length > 0 && (
                <div className="auth-error">⚠️ Vui lòng kiểm tra lại thông tin đã nhập</div>
              )}

              <button
                className="btn btn-primary btn-lg auth-submit-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className="auth-loading">
                    <span className="auth-spinner"></span>
                    Đang tạo tài khoản...
                  </span>
                ) : (
                  '✅ Hoàn tất đăng ký'
                )}
              </button>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && (
            <div className="animate-slide-in" style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>
                Đăng ký thành công!
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-dimmed)', lineHeight: 1.7, marginBottom: 24 }}>
                Chào mừng bạn đến với NôngNghiệpSố!<br />
                Tài khoản <strong style={{ color: ROLE_CONFIG[selectedRole]?.color }}>{ROLE_CONFIG[selectedRole]?.label}</strong> đã được kích hoạt.
              </p>

              <div style={{ background: `${ROLE_CONFIG[selectedRole]?.color}10`, border: `1px solid ${ROLE_CONFIG[selectedRole]?.color}30`, borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 24 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{ROLE_CONFIG[selectedRole]?.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                  Tính năng của bạn:
                </div>
                {ROLE_CONFIG[selectedRole]?.features.map((f, i) => (
                  <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>✓ {f}</div>
                ))}
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-dimmed)', marginBottom: 20 }}>
                Bạn đã được tự động đăng nhập vào hệ thống.
              </p>
              <div style={{ fontSize: 11, color: 'var(--text-dimmed)', animation: 'blink 1s infinite' }}>
                Đang chuyển vào ứng dụng...
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
