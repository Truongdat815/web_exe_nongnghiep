import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  Leaf,
  Search,
  Send,
  ShieldCheck,
  Stethoscope,
  Timer,
} from 'lucide-react';
import { addLedgerEntry, Badge, statusLabel } from './pageUtils';

const DEFAULT_DIAGNOSIS = 'Nghi nấm rễ do ẩm kéo dài';
const DEFAULT_TREATMENT = 'Khoanh vùng cây bệnh, giảm tưới, dùng Trichoderma và kiểm tra rễ sau 72h.';

export function ExpertPage({ state, setState, notify }) {
  const tickets = state.sosTickets || [];
  const [selectedTicketId, setSelectedTicketId] = useState(() => tickets[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [treatmentText, setTreatmentText] = useState(DEFAULT_TREATMENT);
  const [diagnosisText, setDiagnosisText] = useState(DEFAULT_DIAGNOSIS);

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId) || tickets[0] || null;

  useEffect(() => {
    if (!selectedTicket) return;
    if (selectedTicket.status === 'Resolved') {
      setDiagnosisText(selectedTicket.expertDiagnosis || '');
      setTreatmentText(selectedTicket.treatment || '');
      return;
    }
    setDiagnosisText(DEFAULT_DIAGNOSIS);
    setTreatmentText(DEFAULT_TREATMENT);
  }, [selectedTicket?.id, selectedTicket?.status, selectedTicket?.expertDiagnosis, selectedTicket?.treatment]);

  const filteredTickets = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchStatus = statusFilter === 'Tất cả' || ticket.status === statusFilter;
      const matchKeyword = !keyword || `${ticket.id} ${ticket.farmer} ${ticket.crop} ${ticket.issue}`.toLowerCase().includes(keyword);
      return matchStatus && matchKeyword;
    });
  }, [searchTerm, statusFilter, tickets]);

  const stats = useMemo(() => {
    const open = tickets.filter((ticket) => ticket.status === 'Open').length;
    const resolved = tickets.filter((ticket) => ticket.status === 'Resolved').length;
    const lowConfidence = tickets.filter((ticket) => Number(ticket.confidence) < 75).length;
    const highPriority = tickets.filter((ticket) => ticket.priority === 'High').length;
    return { open, resolved, lowConfidence, highPriority };
  }, [tickets]);

  const resolveTicket = (ticket) => {
    setState((prev) => {
      let next = {
        ...prev,
        sosTickets: prev.sosTickets.map((item) =>
          item.id === ticket.id
            ? { ...item, status: 'Resolved', expertDiagnosis: diagnosisText, treatment: treatmentText }
            : item,
        ),
      };
      next = addLedgerEntry(next, {
        type: 'Expert_Prescription',
        farmId: ticket.farmId,
        title: `Chuyên gia kê đơn cho ${ticket.id}`,
        detail: treatmentText,
      });
      return next;
    });
    notify(`Đã kê đơn xử lý cho ca bệnh ${ticket.id}.`);
  };

  return (
    <section className="sos-admin page-grid">
      <header className="sos-header">
        <div>
          <p className="eyebrow">Admin SOS</p>
          <h1>Yêu cầu chuyên gia</h1>
          <p>Theo dõi ca bệnh AI confidence thấp, kiểm tra IoT history và phác đồ xử lý.</p>
        </div>
        <div className="sos-policy">
          <ShieldCheck size={18} />
          <span>Quy trình</span>
          <strong>AI → SOS → Ledger</strong>
        </div>
      </header>

      <div className="sos-stat-grid">
        <SosStat icon={ClipboardList} label="Ca đang mở" value={stats.open} note="cần xử lý" />
        <SosStat icon={CheckCircle2} label="Đã kê đơn" value={stats.resolved} note="đã ghi ledger" tone="green" />
        <SosStat icon={Bot} label="AI confidence thấp" value={stats.lowConfidence} note="< 75%" tone="amber" />
        <SosStat icon={AlertTriangle} label="Ưu tiên cao" value={stats.highPriority} note="cần xem trước" tone="red" />
      </div>

      <div className="sos-workbench">
        <aside className="sos-queue">
          <div className="sos-queue-toolbar">
            <div className="sos-search">
              <Search size={16} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm SOS, nông dân, cây trồng..."
              />
            </div>
            <div className="sos-filter-row">
              {['Tất cả', 'Open', 'Resolved'].map((status) => (
                <button
                  key={status}
                  className={statusFilter === status ? 'active' : ''}
                  onClick={() => setStatusFilter(status)}
                >
                  {status === 'Tất cả' ? status : statusLabel(status)}
                </button>
              ))}
            </div>
          </div>

          <div className="sos-ticket-list">
            {filteredTickets.map((ticket) => (
              <button
                key={ticket.id}
                className={`sos-ticket-item ${selectedTicket?.id === ticket.id ? 'active' : ''}`}
                onClick={() => setSelectedTicketId(ticket.id)}
              >
                <div>
                  <strong>{ticket.id}</strong>
                  <Badge status={ticket.status === 'Open' ? 'warning' : 'success'}>
                    {ticket.status === 'Open' ? 'Cần xử lý' : 'Đã kê đơn'}
                  </Badge>
                </div>
                <span><Leaf size={13} /> {ticket.crop}</span>
                <p>{ticket.issue}</p>
                <small>{ticket.farmer}</small>
              </button>
            ))}
            {filteredTickets.length === 0 && (
              <div className="sos-empty">
                <CheckCircle2 size={26} />
                <strong>Không có ca phù hợp</strong>
                <p>Thử đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
              </div>
            )}
          </div>
        </aside>

        <main className="sos-detail">
          {selectedTicket ? (
            <>
              <div className="sos-detail-head">
                <div>
                  <span>{selectedTicket.id}</span>
                  <h2>{selectedTicket.crop} · {selectedTicket.issue}</h2>
                  <p>Nông hộ: <strong>{selectedTicket.farmer}</strong></p>
                </div>
                <Badge status={selectedTicket.status === 'Open' ? 'warning' : 'success'}>
                  {statusLabel(selectedTicket.status)}
                </Badge>
              </div>

              <div className="sos-intel-grid">
                <article className="sos-intel-card">
                  <div className="sos-intel-title">
                    <Bot size={18} />
                    <div>
                      <span>AI sơ bộ</span>
                      <strong>{selectedTicket.confidence}% confidence</strong>
                    </div>
                  </div>
                  <div className="confidence-bar">
                    <i style={{ width: `${selectedTicket.confidence}%` }} />
                  </div>
                  <p>{selectedTicket.confidence < 75 ? 'Confidence dưới ngưỡng tự kê đơn, cần chuyên gia xác nhận.' : 'AI đủ tự tin nhưng vẫn cần kiểm tra phác đồ.'}</p>
                </article>

                <article className="sos-intel-card">
                  <div className="sos-intel-title">
                    <Activity size={18} />
                    <div>
                      <span>IoT history</span>
                      <strong>30 ngày gần nhất</strong>
                    </div>
                  </div>
                  <p>{selectedTicket.iotSummary}</p>
                  <div className="sos-mini-tags">
                    <span>Độ ẩm cao</span>
                    <span>Mưa nhiều</span>
                    <span>Rủi ro nấm</span>
                  </div>
                </article>

                <article className="sos-intel-card">
                  <div className="sos-intel-title">
                    <Timer size={18} />
                    <div>
                      <span>SLA xử lý</span>
                      <strong>{selectedTicket.priority === 'High' ? 'Ưu tiên cao' : 'Thông thường'}</strong>
                    </div>
                  </div>
                  <p>Khuyến nghị phản hồi trong 2 giờ để nông dân kịp khoanh vùng và giảm lây lan.</p>
                </article>
              </div>

              <article className="sos-prescription-panel">
                <div className="sos-panel-title">
                  <FileCheck2 size={19} />
                  <div>
                    <span>Hồ sơ chuyên môn</span>
                    <h3>Kê đơn xử lý</h3>
                  </div>
                </div>

                {selectedTicket.status === 'Open' ? (
                  <div className="sos-form">
                    <label>
                      Chẩn đoán chuyên môn
                      <input value={diagnosisText} onChange={(event) => setDiagnosisText(event.target.value)} />
                    </label>
                    <label>
                      Hướng dẫn xử lý
                      <textarea rows={4} value={treatmentText} onChange={(event) => setTreatmentText(event.target.value)} />
                    </label>
                    <div className="sos-form-actions">
                      <button onClick={() => resolveTicket(selectedTicket)}>
                        <Send size={16} /> Gửi phác đồ và ghi ledger
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="sos-resolved">
                    <div>
                      <span>Chẩn đoán</span>
                      <strong>{selectedTicket.expertDiagnosis}</strong>
                    </div>
                    <div>
                      <span>Phác đồ</span>
                      <p>{selectedTicket.treatment}</p>
                    </div>
                    <small><CheckCircle2 size={15} /> Đã ghi vào ledger canh tác</small>
                  </div>
                )}
              </article>
            </>
          ) : (
            <div className="sos-empty detail">
              <Stethoscope size={36} />
              <strong>Chưa có ca bệnh</strong>
              <p>Khi AI tạo SOS ticket, ca bệnh sẽ xuất hiện tại đây.</p>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}

function SosStat({ icon: Icon, label, value, note, tone = 'default' }) {
  return (
    <article className={`sos-stat tone-${tone}`}>
      <div><Icon size={19} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}
