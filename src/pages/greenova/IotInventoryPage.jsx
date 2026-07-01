import { useMemo, useState } from 'react';
import {
  Boxes,
  Cpu,
  Edit,
  Image as ImageIcon,
  Layers3,
  Package,
  Plus,
  Search,
  Trash2,
  Wrench,
  X,
} from 'lucide-react';
import { currency, kitCost } from './pageUtils';

const stockForPart = (part, index) => {
  const seed = [...part.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 8 + ((seed + index * 7) % 54);
};

export function IotInventoryPage({ state, setState, notify }) {
  const [activeTab, setActiveTab] = useState('parts');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroup, setActiveGroup] = useState('Tất cả');
  const [partModal, setPartModal] = useState({ isOpen: false, data: null });
  const [kitModal, setKitModal] = useState({ isOpen: false, data: null });

  const parts = state.hardwareParts || [];
  const kits = state.iotKits || [];

  const groups = useMemo(() => ['Tất cả', ...new Set(parts.map((part) => part.group))], [parts]);

  const filteredParts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return parts.filter((part) => {
      const matchGroup = activeGroup === 'Tất cả' || part.group === activeGroup;
      const matchKeyword = !keyword || `${part.name} ${part.group} ${part.purpose}`.toLowerCase().includes(keyword);
      return matchGroup && matchKeyword;
    });
  }, [activeGroup, parts, searchTerm]);

  const inventoryStats = useMemo(() => {
    const totalCost = parts.reduce((sum, part) => sum + part.unitCost, 0);
    const avgCost = parts.length ? Math.round(totalCost / parts.length) : 0;
    const stockUnits = parts.reduce((sum, part, index) => sum + stockForPart(part, index), 0);
    const kitValue = kits.reduce((sum, kit) => sum + kit.salePrice, 0);
    return { avgCost, stockUnits, kitValue };
  }, [kits, parts]);

  const handleSavePart = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const id = partModal.data?.id || `part-${Date.now()}`;
    const newPart = {
      id,
      group: formData.get('group'),
      name: formData.get('name'),
      purpose: formData.get('purpose'),
      unitCost: Number.parseInt(formData.get('unitCost'), 10),
      image: partModal.data?.image || null,
    };

    setState((prev) => {
      const exists = prev.hardwareParts.find((part) => part.id === id);
      return {
        ...prev,
        hardwareParts: exists
          ? prev.hardwareParts.map((part) => (part.id === id ? newPart : part))
          : [...prev.hardwareParts, newPart],
      };
    });
    notify(partModal.data ? 'Đã cập nhật linh kiện' : 'Đã thêm linh kiện mới');
    setPartModal({ isOpen: false, data: null });
  };

  const handleDeletePart = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa linh kiện này?')) {
      setState((prev) => ({
        ...prev,
        hardwareParts: prev.hardwareParts.filter((part) => part.id !== id),
      }));
      notify('Đã xóa linh kiện');
    }
  };

  const handleSaveKit = (event, selectedParts) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const id = kitModal.data?.id || `kit-${Date.now()}`;
    const newKit = {
      id,
      name: formData.get('name'),
      salePrice: Number.parseInt(formData.get('salePrice'), 10),
      components: selectedParts,
      image: kitModal.data?.image || null,
    };

    setState((prev) => {
      const exists = (prev.iotKits || []).find((kit) => kit.id === id);
      return {
        ...prev,
        iotKits: exists
          ? prev.iotKits.map((kit) => (kit.id === id ? newKit : kit))
          : [...(prev.iotKits || []), newKit],
      };
    });
    notify(kitModal.data ? 'Đã cập nhật Combo IoT' : 'Đã thêm Combo IoT mới');
    setKitModal({ isOpen: false, data: null });
  };

  const handleDeleteKit = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa combo này?')) {
      setState((prev) => ({
        ...prev,
        iotKits: (prev.iotKits || []).filter((kit) => kit.id !== id),
      }));
      notify('Đã xóa combo');
    }
  };

  const handleImageChange = (event, isPart) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 500) {
      window.alert('Vui lòng chọn ảnh nhỏ hơn 500KB để demo không bị nặng.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (isPart) {
        setPartModal((prev) => ({ ...prev, data: { ...prev.data, image: reader.result } }));
      } else {
        setKitModal((prev) => ({ ...prev, data: { ...prev.data, image: reader.result } }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="iot-inventory page-grid">
      <header className="inventory-header">
        <div>
          <p className="eyebrow">Admin Inventory</p>
          <h1>Kho IoT</h1>
          <p>Quản lý linh kiện, giá vốn và các combo triển khai ESP32 cho nông dân.</p>
        </div>
        <div className="inventory-tabs" role="tablist" aria-label="Kho IoT">
          <button className={activeTab === 'parts' ? 'active' : ''} onClick={() => setActiveTab('parts')}>
            <Cpu size={16} /> Linh kiện
          </button>
          <button className={activeTab === 'kits' ? 'active' : ''} onClick={() => setActiveTab('kits')}>
            <Package size={16} /> Combo
          </button>
        </div>
      </header>

      <div className="inventory-stat-grid">
        <InventoryStat icon={Boxes} label="Linh kiện" value={parts.length} note={`${groups.length - 1} nhóm`} />
        <InventoryStat icon={Wrench} label="Tồn kho mô phỏng" value={inventoryStats.stockUnits} note="đơn vị khả dụng" />
        <InventoryStat icon={Layers3} label="Combo IoT" value={kits.length} note={currency(inventoryStats.kitValue)} />
        <InventoryStat icon={Cpu} label="Giá vốn TB" value={currency(inventoryStats.avgCost)} note="mỗi linh kiện" />
      </div>

      {activeTab === 'parts' && (
        <article className="inventory-panel">
          <div className="inventory-toolbar">
            <div className="inventory-search">
              <Search size={17} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm linh kiện, nhóm, mục đích..."
              />
            </div>
            <button className="inventory-primary" onClick={() => setPartModal({ isOpen: true, data: null })}>
              <Plus size={16} /> Thêm linh kiện
            </button>
          </div>

          <div className="inventory-groups">
            {groups.map((group) => (
              <button key={group} className={activeGroup === group ? 'active' : ''} onClick={() => setActiveGroup(group)}>
                {group}
              </button>
            ))}
          </div>

          <div className="inventory-table-wrap">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Linh kiện</th>
                  <th>Nhóm</th>
                  <th>Mục đích</th>
                  <th>Giá vốn</th>
                  <th>Tồn</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredParts.map((part, index) => (
                  <tr key={part.id}>
                    <td>
                      <div className="inventory-part-cell">
                        <PartThumb part={part} />
                        <div>
                          <strong>{part.name}</strong>
                          <small>{part.id}</small>
                        </div>
                      </div>
                    </td>
                    <td><span className="inventory-chip">{part.group}</span></td>
                    <td>{part.purpose}</td>
                    <td><strong>{currency(part.unitCost)}</strong></td>
                    <td>
                      <span className={stockForPart(part, index) < 16 ? 'stock-pill low' : 'stock-pill'}>
                        {stockForPart(part, index)}
                      </span>
                    </td>
                    <td>
                      <div className="inventory-actions">
                        <button onClick={() => setPartModal({ isOpen: true, data: part })} aria-label="Sửa linh kiện">
                          <Edit size={16} />
                        </button>
                        <button className="danger" onClick={() => handleDeletePart(part.id)} aria-label="Xóa linh kiện">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      )}

      {activeTab === 'kits' && (
        <article className="inventory-panel">
          <div className="inventory-toolbar">
            <div>
              <h2>Combo IoT</h2>
              <p>Cấu hình BOM, giá vốn và biên gộp dự kiến cho từng gói triển khai.</p>
            </div>
            <button className="inventory-primary" onClick={() => setKitModal({ isOpen: true, data: { components: [] } })}>
              <Plus size={16} /> Thêm combo
            </button>
          </div>

          <div className="inventory-kit-grid">
            {kits.map((kit) => {
              const cost = kitCost(kit, parts);
              const margin = kit.salePrice - cost;
              const marginRate = kit.salePrice ? Math.round((margin / kit.salePrice) * 100) : 0;
              return (
                <article key={kit.id} className="inventory-kit-card">
                  <div className="kit-card-top">
                    <div className="kit-icon"><Package size={20} /></div>
                    <div className="inventory-actions">
                      <button onClick={() => setKitModal({ isOpen: true, data: kit })} aria-label="Sửa combo">
                        <Edit size={16} />
                      </button>
                      <button className="danger" onClick={() => handleDeleteKit(kit.id)} aria-label="Xóa combo">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <span>{kit.components.length} linh kiện</span>
                  <h3>{kit.name}</h3>
                  <div className="kit-lines">
                    <div><span>Giá vốn</span><strong>{currency(cost)}</strong></div>
                    <div><span>Giá bán</span><strong>{currency(kit.salePrice)}</strong></div>
                    <div className="accent"><span>Biên gộp</span><strong>{currency(margin)} · {marginRate}%</strong></div>
                  </div>
                  <div className="kit-components">
                    {kit.components.slice(0, 5).map(([partId, quantity]) => {
                      const part = parts.find((item) => item.id === partId);
                      return part ? <small key={partId}>{quantity}x {part.name}</small> : null;
                    })}
                    {kit.components.length > 5 && <small>+{kit.components.length - 5} linh kiện khác</small>}
                  </div>
                </article>
              );
            })}
          </div>
        </article>
      )}

      {partModal.isOpen && (
        <PartModal
          data={partModal.data}
          onClose={() => setPartModal({ isOpen: false, data: null })}
          onSave={handleSavePart}
          onImageChange={(event) => handleImageChange(event, true)}
        />
      )}

      {kitModal.isOpen && (
        <KitModal
          data={kitModal.data}
          hardwareParts={parts}
          onClose={() => setKitModal({ isOpen: false, data: null })}
          onSave={handleSaveKit}
          onImageChange={(event) => handleImageChange(event, false)}
        />
      )}
    </section>
  );
}

function InventoryStat({ icon: Icon, label, value, note }) {
  return (
    <article className="inventory-stat">
      <div><Icon size={19} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}

function PartThumb({ part }) {
  if (part.image) {
    return <img className="part-thumb" src={part.image} alt={part.name} />;
  }
  return (
    <div className="part-thumb empty">
      <ImageIcon size={17} />
    </div>
  );
}

function PartModal({ data, onClose, onSave, onImageChange }) {
  return (
    <div className="modal-overlay">
      <div className="inventory-modal">
        <div className="inventory-modal-header">
          <div>
            <span>Linh kiện</span>
            <h2>{data ? 'Sửa linh kiện' : 'Thêm linh kiện mới'}</h2>
          </div>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={onSave} className="inventory-form">
          <ImagePicker data={data} onImageChange={onImageChange} />
          <label>
            Tên linh kiện
            <input name="name" type="text" defaultValue={data?.name} required placeholder="VD: Cảm biến SHT30 ngoài trời" />
          </label>
          <label>
            Nhóm
            <input name="group" type="text" defaultValue={data?.group} required placeholder="VD: Môi trường" />
          </label>
          <label>
            Mục đích sử dụng
            <input name="purpose" type="text" defaultValue={data?.purpose} required placeholder="VD: Đo nhiệt độ/độ ẩm không khí" />
          </label>
          <label>
            Giá vốn (VNĐ)
            <input name="unitCost" type="number" min="0" step="1000" defaultValue={data?.unitCost} required placeholder="130000" />
          </label>
          <div className="inventory-form-actions">
            <button type="button" className="inventory-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="inventory-primary">Lưu linh kiện</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function KitModal({ data, hardwareParts, onClose, onSave, onImageChange }) {
  const [selectedParts, setSelectedParts] = useState(data?.components || []);
  const [selectedPartId, setSelectedPartId] = useState('');

  const addPartToKit = () => {
    if (!selectedPartId) return;
    const existingIndex = selectedParts.findIndex((part) => part[0] === selectedPartId);
    if (existingIndex >= 0) {
      const nextParts = selectedParts.map((part, index) => (
        index === existingIndex ? [part[0], part[1] + 1] : part
      ));
      setSelectedParts(nextParts);
    } else {
      setSelectedParts([...selectedParts, [selectedPartId, 1]]);
    }
    setSelectedPartId('');
  };

  const updatePartQuantity = (index, delta) => {
    const nextParts = [...selectedParts];
    const nextQuantity = nextParts[index][1] + delta;
    if (nextQuantity <= 0) {
      nextParts.splice(index, 1);
    } else {
      nextParts[index] = [nextParts[index][0], nextQuantity];
    }
    setSelectedParts(nextParts);
  };

  const currentCost = selectedParts.reduce((sum, [partId, quantity]) => {
    const part = hardwareParts.find((item) => item.id === partId);
    return sum + (part ? part.unitCost * quantity : 0);
  }, 0);

  return (
    <div className="modal-overlay">
      <div className="inventory-modal wide">
        <div className="inventory-modal-header">
          <div>
            <span>Combo IoT</span>
            <h2>{data?.id ? 'Sửa combo' : 'Thêm combo mới'}</h2>
          </div>
          <button type="button" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={(event) => onSave(event, selectedParts)} className="inventory-form">
          <div className="inventory-form-grid">
            <label>
              Tên combo
              <input name="name" type="text" defaultValue={data?.name} required placeholder="VD: Kit trạm chính công nghiệp" />
            </label>
            <label>
              Giá bán cấu hình (VNĐ)
              <input name="salePrice" type="number" min="0" step="1000" defaultValue={data?.salePrice} required placeholder="1890000" />
            </label>
          </div>

          <ImagePicker data={data} onImageChange={onImageChange} wide />

          <div className="bom-builder">
            <div className="bom-builder-head">
              <div>
                <span>BOM</span>
                <strong>Tổng giá vốn: {currency(currentCost)}</strong>
              </div>
              <div className="bom-add-row">
                <select value={selectedPartId} onChange={(event) => setSelectedPartId(event.target.value)}>
                  <option value="">Chọn linh kiện</option>
                  {hardwareParts.map((part) => (
                    <option key={part.id} value={part.id}>{part.name} ({currency(part.unitCost)})</option>
                  ))}
                </select>
                <button type="button" className="inventory-secondary" onClick={addPartToKit}>Thêm</button>
              </div>
            </div>

            <div className="bom-selected-list">
              {selectedParts.length === 0 ? (
                <p>Chưa có linh kiện nào trong combo.</p>
              ) : (
                selectedParts.map(([partId, quantity], index) => {
                  const part = hardwareParts.find((item) => item.id === partId);
                  if (!part) return null;
                  return (
                    <div key={partId} className="bom-selected-item">
                      <div>
                        <strong>{part.name}</strong>
                        <small>{currency(part.unitCost)} / cái</small>
                      </div>
                      <div className="qty-stepper">
                        <button type="button" onClick={() => updatePartQuantity(index, -1)}>-</button>
                        <strong>{quantity}</strong>
                        <button type="button" onClick={() => updatePartQuantity(index, 1)}>+</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="inventory-form-actions">
            <button type="button" className="inventory-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="inventory-primary" disabled={selectedParts.length === 0}>Lưu combo</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ImagePicker({ data, onImageChange, wide = false }) {
  return (
    <label className={wide ? 'image-picker wide' : 'image-picker'}>
      <span>Hình ảnh mô phỏng</span>
      <div>
        {data?.image ? (
          <img src={data.image} alt="Preview" />
        ) : (
          <i><ImageIcon size={22} /></i>
        )}
        <input type="file" accept="image/*" onChange={onImageChange} />
      </div>
    </label>
  );
}
