import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';
import { roles } from '../../data/greenovaData';
import { roleTheme } from '../../roles/roleTheme';

import { FloatingParticles } from './FloatingParticles';
import { HomeSection } from './HomeSection';
import { AboutSection } from './AboutSection';
import { IoTSection } from './IoTSection';
import { BenefitsSection } from './BenefitsSection';
import { WorkflowSection } from './WorkflowSection';

export function LandingPage({ onLogin }) {
  const [authMode, setAuthMode] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const landingPage = location.pathname === '/' ? 'home' : location.pathname.substring(1);
  const openAuth = (mode) => setAuthMode(mode);

  const landingTabs = [
    { id: 'home', label: 'Trang chủ', path: '/' },
    { id: 'about', label: 'Giới thiệu', path: '/about' },
    { id: 'iot', label: 'IoT', path: '/iot' },
    { id: 'benefits', label: 'Lợi ích', path: '/benefits' },
    { id: 'workflow', label: 'Quy trình', path: '/workflow' },
  ];

  const goLandingPage = (page) => {
    navigate(page === 'home' ? '/' : `/${page}`);
  };

  return (
    <main className={`landing-page landing-view-${landingPage}`}>
      <FloatingParticles />
      <header className="landing-header">
        <button className="landing-brand" onClick={() => navigate('/')} style={{ padding: 0, border: 'none', background: 'transparent' }}>
          <img src="/color-wordmark.svg" alt="Greenova" />
        </button>

        <nav className="landing-nav">
          {landingTabs.map((tab) => (
            <button key={tab.id} className={landingPage === tab.id ? 'active' : ''} onClick={() => navigate(tab.path)}>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="landing-auth">
          <button className="ghost-button" onClick={() => openAuth('login')}>Đăng nhập</button>
          <button className="solid-button" onClick={() => openAuth('register')}>Đăng ký</button>
        </div>
      </header>

      <div className="landing-route-dots" aria-label="Điều hướng landing">
        {landingTabs.map((tab) => (
          <button
            key={tab.id}
            className={landingPage === tab.id ? 'active' : ''}
            onClick={() => navigate(tab.path)}
            aria-label={tab.label}
          >
            <span />
          </button>
        ))}
      </div>

      <section className="landing-stage">
        <Routes>
          <Route path="/" element={<HomeSection openAuth={openAuth} goLandingPage={goLandingPage} />} />
          <Route path="/about" element={<AboutSection />} />
          <Route path="/iot" element={<IoTSection />} />
          <Route path="/benefits" element={<BenefitsSection />} />
          <Route path="/workflow" element={<WorkflowSection />} />
          <Route path="*" element={<HomeSection openAuth={openAuth} goLandingPage={goLandingPage} />} />
        </Routes>
      </section>

      {authMode && (
        <div className="auth-overlay" onClick={() => setAuthMode(null)}>
          <section className="auth-dialog" onClick={(event) => event.stopPropagation()}>
            <button className="auth-close" onClick={() => setAuthMode(null)}><X size={18} /></button>
            <p className="eyebrow">{authMode === 'login' ? 'Đăng nhập demo' : 'Đăng ký demo'}</p>
            <h2>{authMode === 'login' ? 'Chọn vai trò để vào hệ thống' : 'Tạo tài khoản mẫu theo vai trò'}</h2>
            <p>
              Bản MVP dùng mock data để bạn trải nghiệm nhanh các dashboard nông dân, kỹ sư, đại lý, buyer và admin.
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
