import { useState } from 'react';
import { farmingLedger, farms } from '../data/mockData';

const ledgerTypeConfig = {
  planting: { icon: '🌱', color: '#22c55e', label: 'Xuống giống' },
  fertilizing: { icon: '🌿', color: '#16a34a', label: 'Bón phân' },
  pesticide: { icon: '💊', color: '#f59e0b', label: 'Phun thuốc' },
  iot_record: { icon: '📡', color: '#3b82f6', label: 'Ghi tự động IoT' },
  harvest: { icon: '🌾', color: '#f97316', label: 'Thu hoạch' },
};

export default function LedgerPage() {
  const [selectedFarm, setSelectedFarm] = useState(farms[0].id);
  const [showAddModal, setShowAddModal] = useState(false);

  const ledger = farmingLedger.filter(l => l.farmId === selectedFarm);

  return (
    <div className="page-container animate-slide-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="page-title"><span className="icon">📋</span> Nhật ký canh tác số</h2>
          <p className="page-description">Lịch sử minh bạch · Tích hợp Blockchain · Cơ sở cấp tem QR</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => setShowAddModal(true)}>＋ Thêm ghi chú</button>
          <button className="btn btn-primary">🏷️ Cấp tem QR 1.000₫/tem</button>
        </div>
      </div>

      {/* Blockchain Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { icon: '⛓️', label: 'Blockchain Hash', value: '5 bản ghi', color: 'rgba(59,130,246,0.1)', text: 'var(--color-info)' },
          { icon: '✅', label: 'Xác minh VietGAP', value: 'Đang xử lý', color: 'rgba(245,158,11,0.1)', text: 'var(--color-accent)' },
          { icon: '📊', label: 'Tỷ lệ hoàn thiện', value: '78%', color: 'rgba(22,163,74,0.1)', text: 'var(--color-success)' },
          { icon: '🏆', label: 'Điểm tín nhiệm lô', value: 'A+', color: 'rgba(139,92,246,0.1)', text: '#a78bfa' },
        ].map((s, i) => (
          <div key={i} style={{ background: s.color, border: `1px solid ${s.text}33`, borderRadius: 'var(--radius-md)', padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.text }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-dimmed)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 }}>
        {/* Farm Selector */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-dimmed)', textTransform: 'uppercase', marginBottom: 8 }}>Chọn vườn</div>
          {farms.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFarm(f.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px',
                background: selectedFarm === f.id ? 'rgba(22,163,74,0.12)' : 'transparent',
                border: `1px solid ${selectedFarm === f.id ? 'var(--color-primary)' : 'transparent'}`,
                borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'inherit',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 4, transition: 'all 0.2s'
              }}
            >
              🌿 {f.name}
              <div style={{ fontSize: 11, color: 'var(--text-dimmed)', fontWeight: 400, marginTop: 2 }}>{f.cropType}</div>
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div>
          {/* Data Sources Legend */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { src: 'iot_auto', icon: '📡', label: 'Tự động IoT', color: 'var(--color-info)' },
              { src: 'transaction', icon: '🛒', label: 'Giao dịch TMĐT', color: 'var(--color-success)' },
              { src: 'user_input', icon: '✍️', label: 'Người dùng nhập', color: 'var(--color-accent)' },
            ].map(s => (
              <div key={s.src} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: s.color, background: `${s.color}15`, border: `1px solid ${s.color}33`, borderRadius: 'var(--radius-full)', padding: '3px 10px' }}>
                {s.icon} {s.label}
              </div>
            ))}
          </div>

          <div className="timeline">
            {ledger.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <div className="empty-state-title">Chưa có ghi chép</div>
                <div className="empty-state-desc">Bắt đầu ghi nhật ký canh tác để xây dựng hồ sơ minh bạch</div>
              </div>
            ) : (
              ledger.map(entry => {
                const typeInfo = ledgerTypeConfig[entry.type] || { icon: '📝', color: '#6b7280', label: entry.type };
                const sourceInfo = {
                  iot_auto: { icon: '📡', label: 'IoT tự động', color: 'var(--color-info)' },
                  transaction: { icon: '🛒', label: 'Giao dịch', color: 'var(--color-success)' },
                  user_input: { icon: '✍️', label: 'Nhập tay', color: 'var(--color-accent)' },
                }[entry.source] || { icon: '📝', label: entry.source };

                return (
                  <div key={entry.id} className="timeline-item">
                    <div className="timeline-dot" style={{ background: `${typeInfo.color}22`, borderColor: typeInfo.color }}>
                      {typeInfo.icon}
                    </div>
                    <div className="timeline-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div>
                          <div className="timeline-date">📅 {new Date(entry.date).toLocaleDateString('vi-VN')}</div>
                          <div className="timeline-action">{entry.action}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <span style={{ fontSize: 11, background: `${sourceInfo.color}15`, color: sourceInfo.color, border: `1px solid ${sourceInfo.color}33`, borderRadius: 'var(--radius-full)', padding: '2px 8px' }}>
                            {sourceInfo.icon} {sourceInfo.label}
                          </span>
                          {entry.verified && <span className="badge badge-green" style={{ fontSize: 10 }}>✓ Xác minh</span>}
                        </div>
                      </div>
                      <div className="timeline-details">{entry.details}</div>
                      {entry.gps && (
                        <div style={{ fontSize: 11, color: 'var(--text-dimmed)', marginTop: 6 }}>
                          📍 GPS: {entry.gps.lat}, {entry.gps.lng}
                        </div>
                      )}
                      {entry.blockchainHash && (
                        <div className="timeline-hash">
                          ⛓️ Blockchain: <code style={{ color: 'var(--color-info)' }}>{entry.blockchainHash}</code>
                          <span style={{ marginLeft: 4, color: 'var(--color-success)' }}>· Bất biến ✓</span>
                        </div>
                      )}
                      {entry.purchaseRef && (
                        <div style={{ fontSize: 11, color: 'var(--text-dimmed)', marginTop: 4 }}>
                          🛒 Mua từ sàn: #{entry.purchaseRef}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* QR Certificate Preview */}
          <div style={{ marginTop: 24, background: 'linear-gradient(135deg, rgba(22,163,74,0.08), rgba(59,130,246,0.08))', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>🏷️ Hộ chiếu Nông sản</div>
                <div style={{ fontSize: 13, color: 'var(--text-dimmed)', marginTop: 2 }}>Xuất QR truy xuất nguồn gốc cho lô hàng</div>
              </div>
              <button className="btn btn-primary">📤 Xuất hộ chiếu 1.000₫/tem</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, fontSize: 13 }}>
              {[
                { label: 'Nông dân', value: 'Nguyễn Văn An', icon: '👤' },
                { label: 'Vùng trồng', value: 'Long An, ĐBSCL', icon: '📍' },
                { label: 'Cây trồng', value: 'Lúa OM18', icon: '🌾' },
                { label: 'Chứng nhận', value: 'VietGAP (đang xét)', icon: '✅' },
                { label: 'Bản ghi', value: `${ledger.length} hoạt động`, icon: '📊' },
                { label: 'Blockchain', value: 'Đã đóng gói', icon: '⛓️' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-dimmed)' }}>{item.icon} {item.label}</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">➕ Thêm ghi chú nhật ký</span>
              <button className="btn btn-secondary btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Hoạt động</label>
              <select className="form-input" style={{ color: 'var(--text-primary)' }}>
                {Object.entries(ledgerTypeConfig).map(([key, val]) => (
                  <option key={key} value={key}>{val.icon} {val.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Chi tiết</label>
              <textarea className="form-input" rows={3} placeholder="Mô tả chi tiết hoạt động..."></textarea>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm">📷 Chụp ảnh GPS</button>
              <span style={{ fontSize: 11, color: 'var(--text-dimmed)', display: 'flex', alignItems: 'center' }}>
                Ảnh sẽ được gắn metadata GPS + thời gian thực
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn-primary">💾 Lưu & ký lên Blockchain</button>
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
