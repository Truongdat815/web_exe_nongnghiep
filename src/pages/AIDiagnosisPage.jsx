import { useState } from 'react';
import { aiDiagnoses, farms } from '../data/mockData';

const cropOptions = ['Lúa', 'Sầu riêng', 'Cà phê', 'Hồ tiêu', 'Chuối', 'Thanh long', 'Bắp'];

function DiagnosisResult({ diagnosis }) {
  return (
    <div className="diagnosis-card animate-slide-in" style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-dimmed)', marginBottom: 4 }}>🤖 AgriVision v2.3 · Phân tích xong</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 4 }}>{diagnosis.disease}</div>
          <div style={{ fontSize: 13, color: 'var(--text-dimmed)', fontStyle: 'italic' }}>{diagnosis.scientificName}</div>
        </div>
        <span className={`diagnosis-severity ${diagnosis.severity}`}>
          {diagnosis.severity === 'low' ? '🟢 Nhẹ' : diagnosis.severity === 'medium' ? '🟡 Trung bình' : '🔴 Nghiêm trọng'}
        </span>
      </div>

      {/* Confidence + Health */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--text-dimmed)', marginBottom: 4 }}>🎯 Độ chính xác AI</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--color-info)' }}>{diagnosis.confidence}%</div>
          <div style={{ marginTop: 6 }}>
            <div className="progress-bar">
              <div className="progress-fill blue" style={{ width: `${diagnosis.confidence}%` }}></div>
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--text-dimmed)', marginBottom: 4 }}>💚 Sức khỏe cây hiện tại</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: diagnosis.healthPercentage >= 80 ? 'var(--color-success)' : diagnosis.healthPercentage >= 60 ? 'var(--color-accent)' : 'var(--color-danger)' }}>
            {diagnosis.healthPercentage}%
          </div>
          <div style={{ marginTop: 6 }}>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${diagnosis.healthPercentage}%`, background: diagnosis.healthPercentage >= 80 ? 'var(--color-success)' : diagnosis.healthPercentage >= 60 ? 'var(--color-accent)' : 'var(--color-danger)' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Treatment */}
      <div style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
          💊 Phác đồ điều trị
        </div>
        {diagnosis.treatment.steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <span style={{ width: 22, height: 22, background: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step}</span>
          </div>
        ))}
        {diagnosis.treatment.isolationNeeded && (
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-danger)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', padding: '6px 10px' }}>
            ⚠️ Cần cách ly khu vực bệnh khỏi cây khoẻ mạnh!
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>🛒 Mua thuốc điều trị ngay</button>
        <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>📋 Ghi vào nhật ký</button>
      </div>
    </div>
  );
}

export default function AIDiagnosisPage() {
  const [step, setStep] = useState('input'); // input | analyzing | result
  const [inputType, setInputType] = useState('image');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedDiag, setSelectedDiag] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleAnalyze = () => {
    setStep('analyzing');
    setTimeout(() => {
      setSelectedDiag(aiDiagnoses[0]);
      setStep('result');
    }, 2500);
  };

  return (
    <div className="page-container animate-slide-in">
      <div className="page-header">
        <h2 className="page-title"><span className="icon">🤖</span> Chẩn đoán bệnh cây AI</h2>
        <p className="page-description">Nhận diện bệnh từ ảnh chụp · Phân tích dữ liệu IoT · Dataset 100.000+ mẫu Đông Nam Á</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
        {/* Input Panel */}
        <div>
          <div className="card">
            {/* Input Type */}
            <div className="tabs" style={{ marginBottom: 20 }}>
              <button className={`tab-btn ${inputType === 'image' ? 'active' : ''}`} onClick={() => setInputType('image')}>📷 Ảnh chụp</button>
              <button className={`tab-btn ${inputType === 'iot' ? 'active' : ''}`} onClick={() => setInputType('iot')}>📡 Dữ liệu IoT</button>
              <button className={`tab-btn ${inputType === 'text' ? 'active' : ''}`} onClick={() => setInputType('text')}>💬 Mô tả triệu chứng</button>
            </div>

            {/* Crop Selection */}
            <div className="form-group">
              <label className="form-label">🌿 Loại cây đang chẩn đoán</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {cropOptions.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedCrop(c)}
                    style={{
                      padding: '6px 14px', borderRadius: 'var(--radius-full)',
                      border: `1px solid ${selectedCrop === c ? 'var(--color-primary)' : 'var(--border-primary)'}`,
                      background: selectedCrop === c ? 'rgba(22,163,74,0.12)' : 'transparent',
                      color: selectedCrop === c ? 'var(--color-primary-light)' : 'var(--text-dimmed)',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {inputType === 'image' && (
              <div
                style={{
                  border: `2px dashed ${dragging ? 'var(--color-primary)' : 'var(--border-primary)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: 40, textAlign: 'center', cursor: 'pointer',
                  background: dragging ? 'rgba(22,163,74,0.05)' : 'transparent',
                  transition: 'all 0.2s',
                }}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); }}
              >
                <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  Kéo thả ảnh lá/cây vào đây
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-dimmed)', marginBottom: 16 }}>
                  Hỗ trợ JPG, PNG, HEIC. Chụp rõ phần lá bệnh để AI phân tích chính xác nhất.
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button className="btn btn-secondary btn-sm">📁 Chọn từ máy</button>
                  <button className="btn btn-secondary btn-sm">📸 Chụp ảnh</button>
                </div>
              </div>
            )}

            {inputType === 'iot' && (
              <div>
                <div className="alert-banner info" style={{ marginBottom: 16 }}>
                  <span className="alert-icon">📡</span>
                  <div>AI sẽ phân tích kết hợp dữ liệu cảm biến nhiệt/ẩm với mô hình dự báo dịch bệnh. Chọn vườn cần phân tích:</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {farms.filter(f => f.iotConnected).map(f => (
                    <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{f.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-dimmed)' }}>
                          🌡️ {f.sensors.temperature}°C · 💧 {f.sensors.humidity}% · 🌍 {f.sensors.soilMoisture}%
                        </div>
                      </div>
                      <span className="live-dot"></span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {inputType === 'text' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mô tả triệu chứng bằng tiếng Việt (hoặc tiếng địa phương)</label>
                <textarea
                  className="form-input"
                  rows={5}
                  placeholder="Ví dụ: Lá lúa bị vàng từ mép vào, có chấm nâu nhỏ ở giữa, xuất hiện nhiều ở luống bên cạnh mương nước. Mấy ngày nay trời hay mưa..."
                  style={{ resize: 'vertical' }}
                ></textarea>
                <div style={{ fontSize: 11, color: 'var(--text-dimmed)', marginTop: 6 }}>
                  💡 AI hiểu được phương ngữ miền Tây, Thái Lan và Indonesia
                </div>
              </div>
            )}

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}
              onClick={handleAnalyze}
              disabled={step === 'analyzing'}
            >
              {step === 'analyzing' ? '⏳ Đang phân tích...' : '🔬 Phân tích ngay'}
            </button>

            {step === 'analyzing' && (
              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 700, marginBottom: 4 }}>
                  AgriVision đang phân tích...
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-dimmed)', marginBottom: 12 }}>
                  So sánh với 100.000+ mẫu bệnh cây Đông Nam Á
                </div>
                <div className="progress-bar">
                  <div className="progress-fill blue" style={{ width: '75%', animation: 'slide-in 2s ease infinite' }}></div>
                </div>
              </div>
            )}

            {step === 'result' && selectedDiag && (
              <DiagnosisResult diagnosis={selectedDiag} />
            )}
          </div>
        </div>

        {/* History + Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { icon: '🔬', label: 'Phân tích hôm nay', value: '3' },
              { icon: '🎯', label: 'Độ chính xác TB', value: '91%' },
              { icon: '🦠', label: 'Bệnh phát hiện', value: '2' },
              { icon: '✅', label: 'Đã điều trị', value: '1' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 22 }}>{s.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dimmed)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent diagnoses */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>📋 Lịch sử chẩn đoán</div>
            {aiDiagnoses.map(d => (
              <div key={d.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{d.disease.split('(')[0].trim()}</span>
                  <span className={`diagnosis-severity ${d.severity}`} style={{ fontSize: 10, padding: '2px 8px' }}>
                    {d.severity === 'low' ? '🟢' : d.severity === 'medium' ? '🟡' : '🔴'}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-dimmed)' }}>
                  📅 {new Date(d.date).toLocaleDateString('vi-VN')} · {d.confidence}% chính xác
                </div>
              </div>
            ))}
          </div>

          {/* Predictive Alert */}
          <div className="card" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-danger)', marginBottom: 8 }}>🔮 Dự báo dịch tễ</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Với nhiệt độ 27°C và độ ẩm 78% kéo dài, xác suất bùng phát bệnh đạo ôn trong <strong style={{ color: 'var(--color-danger)' }}>3 ngày tới là 68%</strong>.
            </div>
            <button className="btn btn-danger" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>
              🔔 Đăng ký nhận cảnh báo sớm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
