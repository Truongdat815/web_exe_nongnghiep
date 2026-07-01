import {
  Gavel,
  Sprout
} from 'lucide-react';
import { Badge } from './pageUtils';

export function BuyerPage({ state, setState, notify }) {
  const createCampaign = () => {
    setState((prev) => ({
      ...prev,
      auctions: [
        {
          id: `AUC-${Date.now().toString().slice(-5)}`,
          creator: 'Long An Fresh Export',
          type: 'Wholesale_B2B',
          title: 'Thu mua 5 tấn khóm sạch có nhật ký IoT',
          quantity: '5 tấn',
          ceilingPrice: 9500,
          location: 'Bến Lức, Long An',
          deadline: '2026-07-12',
          status: 'Open',
          bids: [],
        },
        ...prev.auctions,
      ],
    }));
    notify('Đã tạo chiến dịch thu mua khóm sạch.');
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Corporate Sourcing</p>
          <h1>Nguồn hàng đã xác thực ledger</h1>
          <p>Buyer xem farm, mã QR và tạo chiến dịch thu mua sỉ.</p>
        </div>
        <button className="primary-button" onClick={createCampaign}><Gavel size={16} /> Tạo chiến dịch khóm</button>
      </div>
      <div className="product-grid">
        {state.farms.map((farm) => (
          <article key={farm.id} className="product-card-new">
            <div className="product-visual"><Sprout size={34} /></div>
            <Badge status="success">Verified Ledger</Badge>
            <h3>{farm.name}</h3>
            <p>{farm.crop} • {farm.area} ha • {farm.district}</p>
            <div className="product-meta">
              <strong>{farm.healthScore}% health</strong>
              <span>{state.ledgers.filter((entry) => entry.farmId === farm.id).length} ledger blocks</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
