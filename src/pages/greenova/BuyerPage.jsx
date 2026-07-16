import { useMemo, useState } from 'react';
import { Gavel, MapPin, Search, ShieldCheck, Sprout } from 'lucide-react';
import { Badge, StatCard } from './pageUtils';

const CROP_FILTERS = ['Tất cả', 'Chanh không hạt', 'Khóm'];

export function BuyerPage({ state, setState, notify }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cropFilter, setCropFilter] = useState('Tất cả');

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

  const farms = state.farms;

  const filteredFarms = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return farms.filter((farm) => {
      const matchCrop = cropFilter === 'Tất cả' || farm.crop === cropFilter;
      const matchKeyword = !keyword || `${farm.name} ${farm.crop} ${farm.district}`.toLowerCase().includes(keyword);
      return matchCrop && matchKeyword;
    });
  }, [farms, searchTerm, cropFilter]);

  const avgHealth = farms.length ? Math.round(farms.reduce((sum, farm) => sum + farm.healthScore, 0) / farms.length) : 0;
  const districtCount = new Set(farms.map((farm) => farm.district)).size;
  const openCampaigns = state.auctions.filter((auction) => auction.status === 'Open').length;

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

      <div className="stats-grid">
        <StatCard icon={ShieldCheck} label="Farm đã xác thực" value={farms.length} note="Có nhật ký ledger" />
        <StatCard icon={Sprout} label="Sức khỏe trung bình" value={`${avgHealth}%`} note="Theo dữ liệu IoT" tone="blue" />
        <StatCard icon={MapPin} label="Địa bàn phủ sóng" value={districtCount} note="Huyện đang theo dõi" />
        <StatCard icon={Gavel} label="Chiến dịch đang mở" value={openCampaigns} note="Đấu giá thu mua" tone="amber" />
      </div>

      <div className="escrow-search">
        <Search size={17} />
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Tìm farm theo tên, cây trồng, huyện..."
        />
      </div>
      <div className="escrow-filter-row">
        {CROP_FILTERS.map((crop) => (
          <button key={crop} className={cropFilter === crop ? 'active' : ''} onClick={() => setCropFilter(crop)}>
            {crop}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filteredFarms.map((farm) => (
          <article key={farm.id} className="product-card-new">
            <div
              className="product-visual"
              style={farm.image ? { backgroundImage: `url(${farm.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
            >
              {!farm.image && <Sprout size={34} />}
            </div>
            <Badge status="success">Đã xác thực ledger</Badge>
            <h3>{farm.name}</h3>
            <p>{farm.crop} • {farm.area} ha • {farm.district}</p>
            <div className="product-meta">
              <strong>{farm.healthScore}% sức khỏe</strong>
              <span>{state.ledgers.filter((entry) => entry.farmId === farm.id).length} block ledger</span>
            </div>
          </article>
        ))}
        {filteredFarms.length === 0 && (
          <div className="escrow-empty">
            <Search size={28} />
            <strong>Không tìm thấy farm phù hợp</strong>
            <p>Thử đổi từ khóa hoặc bộ lọc cây trồng.</p>
          </div>
        )}
      </div>
    </section>
  );
}
