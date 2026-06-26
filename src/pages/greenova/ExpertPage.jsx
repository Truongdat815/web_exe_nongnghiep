import {
  FileCheck2,
} from 'lucide-react';
import { statusLabel, addLedgerEntry, Badge } from './pageUtils';

export function ExpertPage({ state, setState, notify }) {
  const resolveTicket = (ticket) => {
    setState((prev) => {
      const treatment = 'Khoanh vùng cây bệnh, giảm tưới, dùng Trichoderma và kiểm tra rễ sau 72h.';
      let next = {
        ...prev,
        sosTickets: prev.sosTickets.map((item) =>
          item.id === ticket.id
            ? { ...item, status: 'Resolved', expertDiagnosis: 'Nghi nấm rễ do ẩm kéo dài', treatment }
            : item,
        ),
      };
      next = addLedgerEntry(next, {
        type: 'Expert_Prescription',
        farmId: ticket.farmId,
        title: `Chuyên gia kê đơn cho ${ticket.id}`,
        detail: treatment,
      });
      return next;
    });
    notify(`Đã kê đơn xử lý cho ticket ${ticket.id}.`);
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Expert SOS Inbox</p>
          <h1>Hàng đợi ca bệnh cần xử lý</h1>
          <p>Ca có confidence thấp được đóng gói cùng lịch sử IoT và chuyển về chuyên gia.</p>
        </div>
      </div>
      <div className="cards-column">
        {state.sosTickets.map((ticket) => (
          <article key={ticket.id} className="order-card">
            <div className="panel-header">
              <div>
                <h3>{ticket.id} • {ticket.crop}</h3>
                <p>{ticket.issue}</p>
              </div>
              <Badge status={ticket.status === 'Open' ? 'warning' : 'success'}>{statusLabel(ticket.status)}</Badge>
            </div>
            <div className="ticket-detail">
              <span>Farmer: <strong>{ticket.farmer}</strong></span>
              <span>AI confidence: <strong>{ticket.confidence}%</strong></span>
              <span>IoT: <strong>{ticket.iotSummary}</strong></span>
            </div>
            {ticket.treatment && <div className="recommend-box"><h4>Đơn đã kê</h4><p>{ticket.treatment}</p></div>}
            <button className="primary-button" disabled={ticket.status !== 'Open'} onClick={() => resolveTicket(ticket)}>
              <FileCheck2 size={16} /> Kê đơn xử lý
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
