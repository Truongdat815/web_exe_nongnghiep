import { currency, statusLabel, quantityToKg, Badge } from './pageUtils';

export function AuctionPage({ state, setState, role, notify }) {
  const addBid = (auction) => {
    setState((prev) => ({
      ...prev,
      auctions: prev.auctions.map((item) =>
        item.id === auction.id
          ? {
              ...item,
              bids: [
                {
                  id: `BID-${Date.now().toString().slice(-4)}`,
                  bidder: role === 'distributor' ? 'Đại lý Vật tư Út Chanh' : 'HTX Chanh Bến Lức',
                  price: Math.max(auction.ceilingPrice - 900, 1),
                  perks: 'Giao nhanh, có hồ sơ QR và hỗ trợ kiểm định.',
                  status: 'Pending',
                },
                ...item.bids,
              ],
            }
          : item,
      ),
    }));
    notify('Đã gửi một bid demo vào chiến dịch.');
  };

  const settle = (auction) => {
    const fallbackBid = {
      id: `BID-${Date.now().toString().slice(-4)}`,
      bidder: role === 'distributor' ? 'Đại lý Vật tư Út Chanh' : 'HTX Chanh Bến Lức',
      price: Math.max(auction.ceilingPrice - 700, 1),
      perks: 'Bid tự tạo khi chiến dịch chưa có nhà thầu.',
      status: 'Pending',
    };
    const bidPool = auction.bids.length > 0 ? auction.bids : [fallbackBid];
    const bestBid = [...bidPool].sort((a, b) => a.price - b.price)[0];
    const quantityKg = quantityToKg(auction.quantity);
    const total = Math.round(bestBid.price * quantityKg);
    setState((prev) => ({
      ...prev,
      auctions: prev.auctions.map((item) => (item.id === auction.id ? { ...item, status: 'Settled', bids: bidPool } : item)),
      orders: [
        {
          id: `B2B-${Date.now().toString().slice(-5)}`,
          buyer: auction.creator,
          distributor: bestBid.bidder,
          product: auction.title,
          quantity: auction.quantity,
          total,
          platformFee: Math.round(total * 0.03),
          netAmount: Math.round(total * 0.97),
          status: 'Paid_Escrow',
          countdownHours: 48,
          createdAt: new Date().toISOString(),
        },
        ...prev.orders,
      ],
    }));
    notify(`Đã chấp nhận bid của ${bestBid.bidder} và tạo escrow B2B.`);
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Live Reverse Auction</p>
          <h1>Đấu giá ngược B2B/B2C</h1>
          <p>Nhà thầu hạ giá hoặc thêm dịch vụ, chủ chiến dịch chọn bid để tạo giao dịch đảm bảo.</p>
        </div>
      </div>
      {state.auctions.map((auction) => (
        <article key={auction.id} className="order-card">
          <div className="panel-header">
            <div>
              <h3>{auction.title}</h3>
              <p>{auction.creator} • {auction.quantity} • Giá trần {currency(auction.ceilingPrice)}/kg</p>
            </div>
            <Badge status={auction.status === 'Settled' ? 'success' : 'warning'}>{statusLabel(auction.status)}</Badge>
          </div>
          <div className="bid-list">
            {auction.bids.map((bid) => (
              <div key={bid.id}>
                <strong>{bid.bidder}</strong>
                <span>{currency(bid.price)}/kg</span>
                <small>{bid.perks}</small>
              </div>
            ))}
          </div>
          <div className="order-actions">
            <button onClick={() => addBid(auction)} disabled={auction.status === 'Settled'}>Gửi bid demo</button>
            <button onClick={() => settle(auction)} disabled={auction.status === 'Settled'}>Chấp nhận bid tốt nhất</button>
          </div>
        </article>
      ))}
    </section>
  );
}
