import { Award, BadgeCheck, Leaf, Mail, MapPin, Phone, ShieldCheck, Star, ThumbsUp, Edit, LogOut } from 'lucide-react';
import './ProfilePage.css';

export function ProfilePage({ state }) {
  const farmerName = state?.users?.[0]?.name || 'Nguyễn Văn A';
  
  return (
    <section className="shopee-profile-page">
      {/* 1. Shopee-style Shop Header */}
      <div className="shop-header-wrapper">
        <div className="shop-header-bg">
          <div className="bg-pattern"></div>
        </div>
        
        <div className="shop-header-content">
          <div className="shop-info-card">
            <div className="shop-avatar-box">
              <img 
                src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" 
                alt="Avatar" 
              />
              <div className="shop-mall-badge">
                <Star size={10} fill="white" /> Nông dân Vàng
              </div>
            </div>
            <div className="shop-details">
              <h2>{farmerName}</h2>
              <span className="shop-status"><span className="dot online"></span> Đang hoạt động</span>
              <div className="shop-action-buttons">
                <button className="btn-outline"><Edit size={14} /> Sửa hồ sơ</button>
              </div>
            </div>
          </div>

          <div className="shop-stats-card">
            <div className="stat-item">
              <ShieldCheck size={18} />
              <div className="stat-text">
                <label>Uy tín</label>
                <strong>98/100</strong>
              </div>
            </div>
            <div className="stat-item">
              <MapPin size={18} />
              <div className="stat-text">
                <label>Trang trại</label>
                <strong>3</strong>
              </div>
            </div>
            <div className="stat-item">
              <Star size={18} />
              <div className="stat-text">
                <label>Thiết bị IoT</label>
                <strong>12</strong>
              </div>
            </div>
            <div className="stat-item">
              <ThumbsUp size={18} />
              <div className="stat-text">
                <label>Đã cung ứng</label>
                <strong>4.5 tấn</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Shopee Layout */}
      <div className="shopee-profile-body">
        
        <aside className="shopee-sidebar">
          <div className="shopee-card">
            <div className="shopee-card-header">
              <h3>Thông tin liên hệ</h3>
            </div>
            <ul className="contact-list">
              <li>
                <Phone size={16} />
                <div>
                  <label>Số điện thoại</label>
                  <span>0901 234 567</span>
                </div>
              </li>
              <li>
                <Mail size={16} />
                <div>
                  <label>Email</label>
                  <span>nongdan.a@greenova.vn</span>
                </div>
              </li>
              <li>
                <MapPin size={16} />
                <div>
                  <label>Địa chỉ</label>
                  <span>Thủ Thừa, Long An</span>
                </div>
              </li>
            </ul>
          </div>
        </aside>

        <main className="shopee-main-content">
          <div className="shopee-card">
            <div className="shopee-card-header">
              <h3>Chứng nhận & Danh hiệu</h3>
            </div>
            <div className="shopee-badges-grid">
              
              <div className="shopee-badge-item">
                <div className="badge-icon vietgap"><BadgeCheck size={28} /></div>
                <div className="badge-info">
                  <strong>VietGAP</strong>
                  <span>Chứng nhận chuẩn</span>
                </div>
                <button className="badge-view-btn">Xem chi tiết</button>
              </div>

              <div className="shopee-badge-item">
                <div className="badge-icon organic"><Leaf size={28} /></div>
                <div className="badge-info">
                  <strong>Hữu cơ 100%</strong>
                  <span>Cam kết chất lượng</span>
                </div>
                <button className="badge-view-btn">Xem chi tiết</button>
              </div>

              <div className="shopee-badge-item">
                <div className="badge-icon trusted"><ThumbsUp size={28} /></div>
                <div className="badge-info">
                  <strong>Đối tác tin cậy</strong>
                  <span>&gt;50 đơn thành công</span>
                </div>
                <button className="badge-view-btn">Xem chi tiết</button>
              </div>

              <div className="shopee-badge-item">
                <div className="badge-icon award"><Award size={28} /></div>
                <div className="badge-info">
                  <strong>Nông dân số</strong>
                  <span>Tiên phong IoT & AI</span>
                </div>
                <button className="badge-view-btn">Xem chi tiết</button>
              </div>

            </div>
          </div>
        </main>

      </div>
    </section>
  );
}
