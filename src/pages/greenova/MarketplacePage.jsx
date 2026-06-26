import {
  Package,
  ShoppingCart,
} from 'lucide-react';
import { currency, addLedgerEntry, Badge } from './pageUtils';

export function MarketplacePage({ state, setState, notify }) {
  const checkout = (product) => {
    if (product.stock < 2) {
      notify(`${product.name} không đủ tồn kho để tạo đơn 2 đơn vị.`);
      return;
    }
    setState((prev) => {
      const total = product.price * 2;
      const order = {
        id: `ORD-${Date.now().toString().slice(-5)}`,
        buyer: 'Ngô Hoàng Trường Đạt',
        distributor: product.seller,
        product: product.name,
        quantity: 2,
        total,
        platformFee: Math.round(total * 0.03),
        netAmount: Math.round(total * 0.97),
        status: 'Paid_Escrow',
        countdownHours: 48,
        createdAt: new Date().toISOString(),
      };
      return addLedgerEntry(
        {
          ...prev,
          products: prev.products.map((item) =>
            item.id === product.id ? { ...item, stock: Math.max(item.stock - 2, 0) } : item,
          ),
          orders: [order, ...prev.orders],
        },
        {
          type: 'Escrow_Event',
          title: `Checkout escrow ${order.id}`,
          detail: `Khóa ${currency(total)} cho đơn ${product.name}.`,
        },
      );
    });
    notify(`Đã tạo đơn escrow cho ${product.name}.`);
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Sàn vật tư nội vùng</p>
          <h1>Vật tư chính hãng trong bán kính 15km</h1>
          <p>Checkout sẽ khóa tiền vào escrow tổng của admin và ghi ledger.</p>
        </div>
      </div>

      <div className="product-grid">
        {state.products.map((product) => (
          <article key={product.id} className="product-card-new">
            <div className="product-visual"><Package size={34} /></div>
            <Badge>{product.category}</Badge>
            <h3>{product.name}</h3>
            <p>{product.seller} • {product.distanceKm}km</p>
            <div className="product-meta">
              <strong>{currency(product.price)}</strong>
              <span>{product.stock} {product.unit}</span>
            </div>
            <button className="primary-button full" disabled={product.stock < 2} onClick={() => checkout(product)}>
              <ShoppingCart size={16} /> {product.stock < 2 ? 'Không đủ tồn kho' : 'Mua 2 đơn vị bằng escrow'}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
