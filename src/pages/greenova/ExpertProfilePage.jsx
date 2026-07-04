import { useState } from 'react';
import {
  Award,
  BadgeCheck,
  Camera,
  GraduationCap,
  ImagePlus,
  Leaf,
  ShieldCheck,
  Star,
  Upload,
  UserCheck,
} from 'lucide-react';

const DEFAULT_CERTS = [
  { id: 'CERT-01', title: 'Kỹ sư Nông học', issuer: 'ĐH Nông Lâm TP.HCM', year: '2018' },
  { id: 'CERT-02', title: 'Chứng nhận BVTV', issuer: 'Chi cục BVTV Long An', year: '2024' },
  { id: 'CERT-03', title: 'Tập huấn VietGAP', issuer: 'Sở NN&PTNT Long An', year: '2025' },
];

const REVIEWS = [
  { id: 1, farmer: 'Ngô Hoàng Trường Đạt', rating: 5, text: 'Kỹ sư tư vấn rất dễ hiểu, chỉ rõ cách giảm ẩm và dùng thuốc sinh học đúng liều.' },
  { id: 2, farmer: 'Mai Thị Lan', rating: 5, text: 'Xem dữ liệu IoT kỹ, không kê thuốc bừa. Vườn khóm ổn lại sau vài ngày thoát nước.' },
  { id: 3, farmer: 'Phạm Văn Tín', rating: 4, text: 'Biên bản tư vấn rõ ràng, dùng được để gửi buyer kiểm tra lô hàng.' },
];

export function ExpertProfilePage({ notify }) {
  const [avatar, setAvatar] = useState('https://api.dicebear.com/9.x/initials/svg?seed=Nguyen%20Minh%20Khoa&backgroundColor=bbf7d0');
  const [certs, setCerts] = useState(DEFAULT_CERTS);

  const handleAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const addMockCert = () => {
    setCerts((items) => [
      { id: `CERT-${Date.now()}`, title: 'Bằng cấp đã tải lên', issuer: 'GREENOVA demo verify', year: '2026' },
      ...items,
    ]);
    notify?.('Đã thêm bằng cấp demo vào hồ sơ kỹ sư.');
  };

  return (
    <section className="expert-profile-page expert-workspace">
      <header className="expert-profile-hero">
        <div className="expert-profile-avatar">
          <img src={avatar} alt="Avatar kỹ sư" />
          <label>
            <Camera size={16} />
            <input type="file" accept="image/*" onChange={handleAvatar} />
          </label>
        </div>
        <div>
          <p className="eyebrow">Hồ sơ kỹ sư nông nghiệp</p>
          <h1>KS. Nguyễn Minh Khoa</h1>
          <p>Chuyên gia cây có múi và quản lý dịch hại vùng Bến Lức. Ưu tiên tư vấn dựa trên dữ liệu IoT, ảnh thực địa và phác đồ sinh học an toàn.</p>
          <div className="expert-profile-tags">
            <span><BadgeCheck size={14} /> Đã KYC</span>
            <span><ShieldCheck size={14} /> Trust 96/100</span>
            <span><Star size={14} /> 4.9 từ nông dân</span>
          </div>
        </div>
      </header>

      <div className="expert-profile-grid">
        <section className="expert-profile-card">
          <h2><UserCheck size={18} /> Tiểu sử</h2>
          <p>8 năm kinh nghiệm theo dõi bệnh cây có múi, khóm và hệ thống tưới cảm biến tại Long An. Đã xử lý hơn 320 ca bệnh từ ảnh AI và dữ liệu ESP32.</p>
          <div className="expert-trust-meter">
            <i style={{ width: '96%' }} />
          </div>
          <strong>Độ tin cậy 96/100</strong>
        </section>

        <section className="expert-profile-card">
          <div className="expert-card-head">
            <h2><GraduationCap size={18} /> Bằng cấp</h2>
            <button onClick={addMockCert}><Upload size={15} /> Tải lên</button>
          </div>
          <div className="expert-cert-list">
            {certs.map((cert) => (
              <article key={cert.id}>
                <Award size={18} />
                <div>
                  <strong>{cert.title}</strong>
                  <span>{cert.issuer} · {cert.year}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="expert-profile-card">
          <h2><Leaf size={18} /> Huy hiệu</h2>
          <div className="expert-badge-grid">
            <span>Chuyên gia cây có múi</span>
            <span>Phản hồi nhanh</span>
            <span>Kê đơn an toàn</span>
            <span>IoT verified</span>
          </div>
        </section>

        <section className="expert-profile-card">
          <h2><ImagePlus size={18} /> Bộ ảnh chuyên môn</h2>
          <div className="expert-photo-grid">
            <img src="https://loremflickr.com/640/420/agronomist,farm?lock=1201" alt="Kỹ sư kiểm tra vườn" />
            <img src="https://loremflickr.com/640/420/citrus,leaf,disease?lock=1202" alt="Kiểm tra lá cây" />
            <img src="https://loremflickr.com/640/420/soil,test,agriculture?lock=1203" alt="Đo mẫu đất" />
          </div>
        </section>

        <section className="expert-profile-card wide">
          <h2><Star size={18} /> Đánh giá từ nông dân</h2>
          <div className="expert-review-list">
            {REVIEWS.map((review) => (
              <article key={review.id}>
                <div>
                  <strong>{review.farmer}</strong>
                  <span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                </div>
                <p>{review.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
