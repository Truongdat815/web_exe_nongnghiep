import { useMemo, useState } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Droplets,
  FlaskConical,
  Leaf,
  MessageSquareText,
  Phone,
  Send,
  ShieldCheck,
  Sprout,
  TestTube2,
  Thermometer,
  Video,
} from 'lucide-react';
import { Badge } from './pageUtils';

const DEFAULT_BOOKINGS = [
  {
    id: 'BK-2607-01',
    farmer: 'Ngô Hoàng Trường Đạt',
    phone: '0908 221 456',
    farmId: 'farm-lime-01',
    issue: 'Lá chanh đốm vàng sau mưa, nghi nấm lá',
    time: 'Hôm nay · 14:00',
    mode: 'Video call',
    status: 'pending',
    priority: 'Cao',
    notes: 'Muốn kỹ sư xem NPK, độ ẩm và gợi ý thuốc sinh học.',
  },
  {
    id: 'BK-2607-02',
    farmer: 'Mai Thị Lan',
    phone: '0912 887 120',
    farmId: 'farm-pine-01',
    issue: 'Khóm vàng mép lá gần mương',
    time: 'Ngày mai · 08:30',
    mode: 'Chat + ảnh vườn',
    status: 'accepted',
    priority: 'Trung bình',
    notes: 'Đã gửi 3 ảnh và lịch sử mưa 7 ngày.',
  },
  {
    id: 'BK-2607-03',
    farmer: 'Phạm Văn Tín',
    phone: '0981 778 090',
    farmId: 'farm-lime-01',
    issue: 'Kiểm tra dư lượng thuốc trước khi bán chanh',
    time: '05/07 · 09:15',
    mode: 'Tại vườn',
    status: 'done',
    priority: 'Thường',
    notes: 'Cần biên bản tư vấn để gửi buyer.',
  },
];

function statusText(status) {
  if (status === 'pending') return 'Chờ nhận';
  if (status === 'accepted') return 'Đã nhận';
  if (status === 'rejected') return 'Từ chối';
  return 'Đã tư vấn';
}

function statusBadge(status) {
  if (status === 'pending') return 'warning';
  if (status === 'accepted') return 'info';
  if (status === 'rejected') return 'danger';
  return 'success';
}

export function ExpertBookingsPage({ state, notify }) {
  const [bookings, setBookings] = useState(DEFAULT_BOOKINGS);
  const [selectedId, setSelectedId] = useState(DEFAULT_BOOKINGS[0].id);
  const [reply, setReply] = useState('Theo dữ liệu IoT, đất đang ẩm cao. Nên kiểm tra mặt dưới lá, tỉa lá bệnh và ưu tiên Trichoderma/Nano đồng bạc liều nhẹ.');
  const [rejectReason, setRejectReason] = useState('Lịch này trùng ca tư vấn khác, bà con vui lòng chọn khung giờ sau 16:00 hoặc gửi ảnh triệu chứng trước để kỹ sư xem nhanh.');

  const selected = bookings.find((item) => item.id === selectedId) || bookings[0];
  const farm = state.farms.find((item) => item.id === selected.farmId) || state.farms[0];
  const devices = state.devices.filter((item) => item.farmId === selected.farmId);
  const primaryDevice = devices[0];
  const telemetry = primaryDevice?.telemetry;

  const bookingStats = useMemo(() => ({
    pending: bookings.filter((item) => item.status === 'pending').length,
    accepted: bookings.filter((item) => item.status === 'accepted').length,
    done: bookings.filter((item) => item.status === 'done').length,
  }), [bookings]);

  const updateStatus = (status, extra = {}) => {
    setBookings((items) => items.map((item) => (item.id === selected.id ? { ...item, status, ...extra } : item)));
    notify?.(status === 'done' ? 'Đã hoàn tất buổi tư vấn và lưu biên bản.' : 'Đã cập nhật lịch tư vấn.');
  };

  const rejectBooking = () => {
    const reason = rejectReason.trim();
    if (!reason) {
      notify?.('Vui lòng ghi lý do từ chối để gửi cho nông dân.');
      return;
    }
    updateStatus('rejected', { rejectReason: reason });
    notify?.(`Đã từ chối lịch và gửi lý do cho ${selected.farmer}.`);
  };

  return (
    <section className="expert-bookings-page expert-workspace">
      <header className="expert-page-hero">
        <div>
          <p className="eyebrow">Lịch tư vấn online</p>
          <h1>Nông dân đặt lịch, kỹ sư xem dữ liệu vườn trước khi tư vấn</h1>
          <p>Expert có thể kiểm tra mảnh đất, telemetry IoT, NPK, độ ẩm, mưa và ghi khuyến nghị mua vật tư phù hợp.</p>
        </div>
        <div className="expert-hero-stats">
          <span><Clock3 size={16} /> Chờ nhận <b>{bookingStats.pending}</b></span>
          <span><Video size={16} /> Đã nhận <b>{bookingStats.accepted}</b></span>
          <span><CheckCircle2 size={16} /> Xong <b>{bookingStats.done}</b></span>
        </div>
      </header>

      <div className="expert-booking-layout">
        <aside className="expert-booking-list">
          {bookings.map((booking) => (
            <button
              key={booking.id}
              className={booking.id === selected.id ? 'active' : ''}
              onClick={() => setSelectedId(booking.id)}
            >
              <div>
                <strong>{booking.farmer}</strong>
                <Badge status={statusBadge(booking.status)}>{statusText(booking.status)}</Badge>
              </div>
              <p>{booking.issue}</p>
              <span><CalendarClock size={13} /> {booking.time}</span>
            </button>
          ))}
        </aside>

        <main className="expert-booking-detail">
          <section className="expert-consult-card">
            <div className="expert-consult-head">
              <div>
                <p className="eyebrow">{selected.id}</p>
                <h2>{selected.issue}</h2>
                <span>{selected.farmer} · {selected.mode}</span>
              </div>
              <Badge status={selected.priority === 'Cao' ? 'warning' : 'success'}>{selected.priority}</Badge>
            </div>
            <div className="expert-contact-row">
              <span><Phone size={15} /> {selected.phone}</span>
              <span><MessageSquareText size={15} /> {selected.notes}</span>
            </div>
            <div className="expert-action-row">
              <button onClick={() => updateStatus('accepted')}><Video size={16} /> Đồng ý</button>
              <button className="danger" onClick={rejectBooking}><MessageSquareText size={16} /> Từ chối</button>
              <button onClick={() => updateStatus('done')}><CheckCircle2 size={16} /> Hoàn tất</button>
            </div>
            <label className="expert-reject-box">
              Lý do từ chối gửi cho nông dân
              <textarea rows={3} value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} />
            </label>
            {selected.status === 'rejected' && (
              <div className="expert-rejected-note">
                <strong>Đã gửi lý do từ chối</strong>
                <p>{selected.rejectReason}</p>
              </div>
            )}
          </section>

          <section className="expert-farm-review">
            <div>
              <p className="eyebrow">Mảnh đất cần xem</p>
              <h2>{farm.name}</h2>
              <span>{farm.crop} · {farm.area} ha · {farm.zone}</span>
            </div>
            <div className="expert-sensor-grid">
              <Sensor icon={Droplets} label="Độ ẩm đất" value={`${telemetry?.soilMoisture ?? 0}%`} note={telemetry?.soilMoisture < 40 ? 'Cần tưới' : 'Đủ ẩm'} />
              <Sensor icon={Thermometer} label="Nhiệt độ" value={`${telemetry?.ambientTemp ?? 0}°C`} note={`${telemetry?.ambientHumidity ?? 0}% ẩm KK`} />
              <Sensor icon={TestTube2} label="NPK" value={`${telemetry?.npk.n ?? 0}/${telemetry?.npk.p ?? 0}/${telemetry?.npk.k ?? 0}`} note="Đạm/Lân/Kali" />
              <Sensor icon={FlaskConical} label="pH/Độ mặn" value={`${telemetry?.soilPh ?? 0} · ${telemetry?.saltIntrusion ?? 0}‰`} note="Nước tưới" />
            </div>
          </section>

          <section className="expert-prescribe-box">
            <div>
              <p className="eyebrow">Biên bản tư vấn</p>
              <h2>Khuyến nghị xử lý và vật tư</h2>
            </div>
            <textarea value={reply} onChange={(event) => setReply(event.target.value)} rows={5} />
            <div className="expert-product-suggestions">
              <span><ShieldCheck size={14} /> Nano đồng bạc</span>
              <span><Sprout size={14} /> Trichoderma</span>
              <span><Leaf size={14} /> Phân hữu cơ vi sinh</span>
            </div>
            <button onClick={() => notify?.('Đã gửi khuyến nghị cho nông dân và gợi ý vật tư từ đại lý.')}>
              <Send size={16} /> Gửi khuyến nghị
            </button>
          </section>
        </main>
      </div>
    </section>
  );
}

function Sensor({ icon: Icon, label, value, note }) {
  return (
    <article>
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}
