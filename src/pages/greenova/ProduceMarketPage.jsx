import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  Building2,
  Leaf,
  Plus,
  Search,
  ShieldCheck,
  Store,
  Truck,
} from 'lucide-react';
import { addLedgerEntry, currency, Badge } from './pageUtils';

const fallbackListings = [
  {
    id: 'PROD-LIME-01',
    farmId: 'farm-lime-01',
    crop: 'Chanh không hạt',
    grade: 'VietGAP',
    quantityKg: 1200,
    pricePerKg: 17000,
    harvestDate: '2026-07-08',
    status: 'Đang bán',
    buyer: 'Long An Fresh Export',
  },
  {
    id: 'PROD-PINE-01',
    farmId: 'farm-pine-01',
    crop: 'Khóm Bến Lức',
    grade: 'Loại 1',
    quantityKg: 850,
    pricePerKg: 11500,
    harvestDate: '2026-07-12',
    status: 'Đang đàm phán',
    buyer: 'Mekong Fruit Buyer',
  },
];

export function ProduceMarketPage({ state, setState, notify }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const listings = state.produceListings?.length ? state.produceListings : fallbackListings;

  const filteredListings = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return listings.filter((item) => !keyword || `${item.crop} ${item.grade} ${item.buyer}`.toLowerCase().includes(keyword));
  }, [listings, searchTerm]);

  const totalValue = listings.reduce((sum, item) => sum + item.quantityKg * item.pricePerKg, 0);

  const createListing = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const listing = {
      id: `PROD-${Date.now().toString().slice(-5)}`,
      farmId: formData.get('farmId'),
      crop: formData.get('crop'),
      grade: formData.get('grade'),
      quantityKg: Number.parseInt(formData.get('quantityKg'), 10),
      pricePerKg: Number.parseInt(formData.get('pricePerKg'), 10),
      harvestDate: formData.get('harvestDate'),
      status: 'Đang bán',
      buyer: 'Chờ doanh nghiệp đặt mua',
    };
    setState((prev) => ({
      ...prev,
      produceListings: [listing, ...(prev.produceListings || fallbackListings)],
    }));
    setFormOpen(false);
    notify('Đã đăng lô nông sản lên sàn thu mua.');
  };

  const acceptBuyer = (listing) => {
    const total = listing.quantityKg * listing.pricePerKg;
    setState((prev) => addLedgerEntry(
      {
        ...prev,
        produceListings: (prev.produceListings || fallbackListings).map((item) =>
          item.id === listing.id ? { ...item, status: 'Đã chốt cọc', buyer: item.buyer || 'Long An Fresh Export' } : item,
        ),
        orders: [
          {
            id: `AGRI-${Date.now().toString().slice(-5)}`,
            buyer: listing.buyer || 'Long An Fresh Export',
            distributor: 'Ngô Hoàng Trường Đạt',
            product: `${listing.crop} ${listing.grade}`,
            quantity: `${listing.quantityKg}kg`,
            total,
            platformFee: Math.round(total * 0.02),
            netAmount: Math.round(total * 0.98),
            status: 'Paid_Escrow',
            countdownHours: 48,
            createdAt: new Date().toISOString(),
          },
          ...prev.orders,
        ],
      },
      {
        type: 'Escrow_Event',
        title: `Doanh nghiệp đặt cọc ${listing.crop}`,
        detail: `Khóa escrow ${currency(total)} cho lô ${listing.quantityKg}kg ${listing.crop}.`,
      },
    ));
    notify('Đã tạo escrow thu mua nông sản.');
  };

  return (
    <section className="produce-market page-grid">
      <header className="produce-header">
        <div>
          <p className="eyebrow">Sàn thu mua</p>
          <h1>Bán nông sản</h1>
          <p>Nông dân đăng lô hàng, doanh nghiệp thu mua đặt cọc và thanh toán qua escrow.</p>
        </div>
        <button onClick={() => setFormOpen((value) => !value)}>
          <Plus size={17} /> Đăng lô hàng
        </button>
      </header>

      <div className="produce-stat-grid">
        <ProduceStat icon={Store} label="Lô đang bán" value={listings.length} note="trên sàn thu mua" />
        <ProduceStat icon={Leaf} label="Sản lượng" value={`${listings.reduce((sum, item) => sum + item.quantityKg, 0)}kg`} note="sẵn sàng giao" />
        <ProduceStat icon={ShieldCheck} label="Giá trị dự kiến" value={currency(totalValue)} note="thanh toán escrow" />
      </div>

      {formOpen && (
        <form className="produce-form" onSubmit={createListing}>
          <select name="farmId" required>
            {(state.farms || []).map((farm) => (
              <option key={farm.id} value={farm.id}>{farm.name}</option>
            ))}
          </select>
          <input name="crop" required placeholder="Tên nông sản, VD: Chanh không hạt" />
          <input name="grade" required placeholder="Chuẩn/loại, VD: VietGAP" />
          <input name="quantityKg" type="number" min="1" required placeholder="Sản lượng kg" />
          <input name="pricePerKg" type="number" min="1000" required placeholder="Giá/kg" />
          <input name="harvestDate" type="date" required />
          <button type="submit">Đăng bán</button>
        </form>
      )}

      <article className="produce-panel">
        <div className="produce-toolbar">
          <div className="produce-search">
            <Search size={17} />
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Tìm nông sản, chuẩn, buyer..." />
          </div>
          <Badge status="success">QR ledger ready</Badge>
        </div>

        <div className="produce-grid">
          {filteredListings.map((listing) => {
            const total = listing.quantityKg * listing.pricePerKg;
            return (
              <article key={listing.id} className="produce-card-new">
                <div className="produce-card-top">
                  <div><Leaf size={20} /></div>
                  <Badge status={listing.status === 'Đã chốt cọc' ? 'success' : 'warning'}>{listing.status}</Badge>
                </div>
                <span>{listing.id}</span>
                <h2>{listing.crop}</h2>
                <p>{listing.grade} · Thu hoạch {listing.harvestDate}</p>
                <div className="produce-price-grid">
                  <div><span>Sản lượng</span><strong>{listing.quantityKg}kg</strong></div>
                  <div><span>Giá/kg</span><strong>{currency(listing.pricePerKg)}</strong></div>
                  <div><span>Tổng</span><strong>{currency(total)}</strong></div>
                </div>
                <div className="produce-buyer">
                  <Building2 size={16} />
                  <span>{listing.buyer}</span>
                </div>
                <div className="produce-card-actions">
                  <button onClick={() => acceptBuyer(listing)} disabled={listing.status === 'Đã chốt cọc'}>
                    <BadgeCheck size={16} /> Chốt escrow
                  </button>
                  <button type="button">
                    <Truck size={16} /> Lịch giao
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </article>
    </section>
  );
}

function ProduceStat({ icon: Icon, label, value, note }) {
  return (
    <article className="produce-stat">
      <div><Icon size={19} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}
