import { currency, Badge } from './pageUtils';

export function DistributorPage({ state, setState, notify }) {
  const restock = (id) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((item) => (item.id === id ? { ...item, stock: item.stock + 10 } : item)),
    }));
    notify('Đã nhập thêm 10 đơn vị vào tồn kho.');
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Distributor Console</p>
          <h1>Kho vật tư và đơn nội vùng</h1>
          <p>Quản lý tồn kho, cảnh báo sắp cạn và đơn hàng đang khóa escrow.</p>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Sản phẩm</th><th>Danh mục</th><th>Tồn</th><th>Giá</th><th>Thao tác</th></tr></thead>
          <tbody>
            {state.products.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td><Badge status={item.stock < 25 ? 'warning' : 'success'}>{item.stock} {item.unit}</Badge></td>
                <td>{currency(item.price)}</td>
                <td><button className="small-button" onClick={() => restock(item.id)}>Nhập thêm 10</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
