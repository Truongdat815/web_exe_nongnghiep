import {
  QrCode,
} from 'lucide-react';
import { Badge } from './pageUtils';

export function LedgerPage({ state }) {
  const farm = state.farms[0];
  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Immutable Ledger & QR Passport</p>
          <h1>Hộ chiếu nông sản {farm.crop}</h1>
          <p>Timeline hash mô phỏng, dùng để buyer kiểm tra lịch sử IoT, AI và hóa đơn vật tư.</p>
        </div>
      </div>
      <div className="split-grid">
        <article className="qr-passport">
          <QrCode size={86} />
          <h3>GREENOVA-PASS-{farm.id.toUpperCase()}</h3>
          <p>{farm.name}</p>
          <div>
            <span>Vùng trồng</span><strong>{farm.district}, Long An</strong>
            <span>Diện tích</span><strong>{farm.area} ha</strong>
            <span>Trạng thái</span><strong>Verified</strong>
          </div>
        </article>
        <article className="panel">
          <div className="panel-header"><h3>Hash timeline</h3><Badge status="success">{state.ledgers.length} blocks</Badge></div>
          <div className="timeline">
            {state.ledgers.map((entry) => (
              <div key={entry.id} className="timeline-item-new">
                <span><Badge>{entry.type}</Badge></span>
                <div>
                  <strong>{entry.title}</strong>
                  <p>{entry.detail}</p>
                  <code>{entry.hash}</code>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
