import { useState } from 'react';
import {
  Bot,
  Leaf,
} from 'lucide-react';
import { currency, statusLabel, addLedgerEntry, Badge } from './pageUtils';

export function AIDiagnosisPage({ state, setState }) {
  const [mode, setMode] = useState('auto');
  const [result, setResult] = useState(null);
  const farm = state.farms[0];

  const analyze = (confidenceMode = mode) => {
    const highConfidence = confidenceMode === 'auto';
    const diagnosis = {
      id: `AI-${Date.now()}`,
      farmId: farm.id,
      crop: farm.crop,
      disease: highConfidence ? 'Đốm lá do nấm Cercospora' : 'Triệu chứng bất thường cần chuyên gia xác minh',
      confidence: highConfidence ? 84 : 63,
      severity: highConfidence ? 'Medium' : 'High',
      prescription: highConfidence
        ? 'Tỉa lá bệnh, giảm tưới chiều muộn, phun Nano Đồng bạc và bổ sung Trichoderma.'
        : 'Tạo SOS ticket kèm 30 ngày IoT history để chuyên gia xử lý thủ công.',
      status: highConfidence ? 'Auto_Prescribed' : 'Need_Expert',
      createdAt: new Date().toISOString(),
    };
    setResult(diagnosis);
    setState((prev) => {
      let next = { ...prev, diagnoses: [diagnosis, ...prev.diagnoses] };
      next = addLedgerEntry(next, {
        type: 'AI_Diagnosis',
        farmId: farm.id,
        title: `AI chẩn đoán: ${diagnosis.disease}`,
        detail: `Confidence ${diagnosis.confidence}%. ${diagnosis.prescription}`,
      });
      if (!highConfidence) {
        next.sosTickets = [
          {
            id: `SOS-${Date.now().toString().slice(-4)}`,
            farmId: farm.id,
            farmer: 'Ngô Hoàng Trường Đạt',
            crop: farm.crop,
            issue: diagnosis.disease,
            confidence: diagnosis.confidence,
            priority: 'High',
            status: 'Open',
            iotSummary: 'Đính kèm lịch sử IoT 30 ngày: độ ẩm cao, nhiệt độ ổn định 25-28°C.',
            expertDiagnosis: '',
            treatment: '',
          },
          ...prev.sosTickets,
        ];
      }
      return next;
    });
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">AI Hub Diagnostics</p>
          <h1>Chẩn đoán bệnh cây từ ảnh và IoT</h1>
          <p>MVP mô phỏng đủ 2 nhánh: tự kê đơn khi confidence cao, tạo SOS khi confidence thấp.</p>
        </div>
      </div>

      <div className="split-grid">
        <article className="panel">
          <div className="panel-header">
            <h3>Ảnh lá chanh/khóm</h3>
            <Bot size={20} />
          </div>
          <div className="upload-box">
            <Leaf size={40} />
            <strong>Thả ảnh bệnh cây vào đây</strong>
            <p>Demo chưa upload thật, nút bên dưới sẽ mô phỏng kết quả AI.</p>
          </div>
          <div className="segmented">
            <button className={mode === 'auto' ? 'active' : ''} onClick={() => setMode('auto')}>Confidence cao</button>
            <button className={mode === 'sos' ? 'active' : ''} onClick={() => setMode('sos')}>Confidence thấp</button>
          </div>
          <button className="primary-button full" onClick={() => analyze()}>
            <Bot size={17} /> Phân tích ngay
          </button>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h3>Kết quả</h3>
            {result && <Badge status={result.confidence >= 75 ? 'success' : 'warning'}>{result.confidence}%</Badge>}
          </div>
          {!result ? (
            <div className="empty-state">Chưa có phân tích mới.</div>
          ) : (
            <div className="result-card">
              <strong>{result.disease}</strong>
              <p>{result.prescription}</p>
              {result.confidence >= 75 ? (
                <div className="recommend-box">
                  <h4>Sản phẩm gợi ý trong bán kính 15km</h4>
                  {state.products.slice(0, 2).map((item) => (
                    <div key={item.id}>
                      <span>{item.name}</span>
                      <strong>{currency(item.price)}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert-card">
                  <Badge status="warning">SOS đã tạo</Badge>
                  <p>Ticket đã chuyển sang dashboard chuyên gia kèm lịch sử IoT.</p>
                </div>
              )}
            </div>
          )}
        </article>
      </div>

      <article className="panel">
        <div className="panel-header">
          <h3>Lịch sử chẩn đoán</h3>
          <Badge>{state.diagnoses.length} bản ghi</Badge>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Mã</th><th>Cây trồng</th><th>Bệnh</th><th>Confidence</th><th>Trạng thái</th></tr></thead>
            <tbody>
              {state.diagnoses.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.crop}</td>
                  <td>{item.disease}</td>
                  <td>{item.confidence}%</td>
                  <td><Badge status={item.confidence >= 75 ? 'success' : 'warning'}>{statusLabel(item.status)}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
