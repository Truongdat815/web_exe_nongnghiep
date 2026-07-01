import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bot,
  Camera,
  CheckCircle2,
  Image as ImageIcon,
  Leaf,
  Loader2,
  Mic,
  Paperclip,
  Send,
  Sparkles,
  Sprout,
} from 'lucide-react';
import { addLedgerEntry, Badge } from './pageUtils';

const QUICK_PROMPTS = [
  'Lá chanh có đốm vàng sau mưa 3 ngày, đất còn ẩm 82%, tôi nên làm gì?',
  'Khóm bị vàng mép lá, rễ hơi mềm, khu gần mương vừa ngập nước.',
  'Cây chanh ra đọt non nhưng lá xoăn và có chấm đen nhỏ dưới mặt lá.',
  'Độ mặn đất 0.9‰, độ ẩm 38%, van tưới có nên mở ngay không?',
];

const INITIAL_MESSAGES = [
  {
    id: 'msg-welcome',
    sender: 'ai',
    time: 'Bây giờ',
    text: 'Chào chú Đạt, con là GREENOVA AI. Chú mô tả cây trồng, triệu chứng, thời điểm phát hiện và chỉ số IoT nếu có. Con sẽ phân tích sơ bộ, gợi ý xử lý và báo khi nào cần gọi kỹ sư.',
    sections: [
      {
        title: 'Con có thể hỗ trợ',
        items: ['Nhận diện dấu hiệu nấm lá, thiếu dinh dưỡng, úng rễ.', 'Đọc nhanh độ ẩm, độ mặn, nhiệt độ từ trạm ESP32.', 'Gợi ý bước xử lý an toàn trước khi tạo SOS cho kỹ sư.'],
      },
    ],
  },
  {
    id: 'msg-sample',
    sender: 'user',
    time: '15 phút trước',
    text: 'Lá chanh sau mưa có vài đốm vàng, mặt dưới hơi sẫm màu. Độ ẩm đất khu A đang 82%, nhiệt độ 27°C.',
  },
  {
    id: 'msg-sample-ai',
    sender: 'ai',
    time: '14 phút trước',
    text: 'Dựa trên mô tả và điều kiện ẩm cao, khả năng cao là giai đoạn đầu của bệnh đốm lá do nấm. Chưa nên bón thêm đạm lúc này.',
    confidence: 84,
    severity: 'Theo dõi sát',
    sections: [
      {
        title: 'Việc nên làm trong 24 giờ',
        items: ['Tỉa bỏ lá bệnh nặng và gom ra khỏi vườn.', 'Ngưng tưới chiều tối, ưu tiên tưới sáng sớm nếu đất xuống dưới 55%.', 'Mở rãnh thoát nước quanh khu A để giảm ẩm kéo dài.'],
      },
      {
        title: 'Khi nào cần tạo SOS',
        items: ['Đốm lan sang trên 20% tán lá.', 'Có mảng cháy nâu lớn hoặc rụng lá hàng loạt.', 'AI confidence dưới 75% sau khi chú gửi thêm ảnh cận mặt dưới lá.'],
      },
    ],
    products: ['Nano đồng bạc', 'Trichoderma', 'Bẫy dính vàng'],
  },
];

const RESPONSE_LIBRARY = [
  {
    keywords: ['đốm', 'nấm', 'vàng', 'mưa', 'ẩm'],
    diagnosis: 'Nghi đốm lá do nấm Cercospora giai đoạn sớm',
    confidence: 86,
    severity: 'Trung bình',
    reply: 'Các dấu hiệu chú mô tả khớp với nhóm bệnh đốm lá sau mưa: ẩm cao, lá xuất hiện đốm vàng rồi sẫm ở mặt dưới. Mình xử lý sớm thì thường chưa cần can thiệp mạnh.',
    sections: [
      {
        title: 'Xử lý ngay',
        items: ['Tỉa lá bệnh nặng, không vứt trong vườn.', 'Giảm tưới chiều tối 2-3 ngày.', 'Theo dõi độ ẩm đất, giữ khoảng 55-70% là ổn hơn.'],
      },
      {
        title: 'Gợi ý vật tư',
        items: ['Nano đồng bạc liều nhẹ theo nhãn.', 'Bổ sung Trichoderma vùng rễ sau khi đất ráo.', 'Không bón thêm đạm khi lá đang lan đốm.'],
      },
    ],
    products: ['Nano đồng bạc', 'Trichoderma', 'Phân hữu cơ vi sinh'],
  },
  {
    keywords: ['khóm', 'dứa', 'ngập', 'mương', 'rễ', 'mềm', 'úng'],
    diagnosis: 'Nguy cơ úng rễ trên khóm do thoát nước kém',
    confidence: 81,
    severity: 'Cần xử lý sớm',
    reply: 'Khóm vàng mép lá kèm rễ mềm sau ngập nước thường nghiêng về úng rễ hơn là thiếu phân. Ưu tiên thoát nước trước, chưa nên kích phân mạnh.',
    sections: [
      {
        title: 'Ưu tiên trong hôm nay',
        items: ['Vét rãnh quanh luống, không để nước đứng quá 12 giờ.', 'Tạm ngưng tưới tự động khu gần mương.', 'Nhổ kiểm tra 2-3 cây ở rìa vùng bệnh để xem rễ có mùi hôi không.'],
      },
      {
        title: 'Theo dõi 48 giờ',
        items: ['Nếu lá đứng lại và rễ không hôi, chuyển sang phục hồi bằng hữu cơ vi sinh.', 'Nếu rễ nâu nhũn lan nhanh, tạo SOS cho kỹ sư kèm ảnh rễ.'],
      },
    ],
    products: ['Trichoderma', 'Humic phục hồi rễ', 'Chế phẩm vi sinh đất'],
  },
  {
    keywords: ['xoăn', 'bọ', 'rầy', 'chấm đen', 'mặt dưới', 'đọt non'],
    diagnosis: 'Nghi rầy mềm hoặc bọ trĩ gây xoăn lá non',
    confidence: 78,
    severity: 'Theo dõi côn trùng',
    reply: 'Lá non xoăn kèm chấm đen ở mặt dưới thường liên quan côn trùng chích hút. Chú cần kiểm tra mặt dưới lá vào sáng sớm, nhất là đọt non.',
    sections: [
      {
        title: 'Cách kiểm tra',
        items: ['Lật mặt dưới 20 lá non ở 4 góc vườn.', 'Gõ nhẹ đọt non lên tờ giấy trắng để phát hiện bọ trĩ.', 'Ghi lại khu vực có mật số cao để xử lý cục bộ.'],
      },
      {
        title: 'Xử lý an toàn',
        items: ['Treo bẫy dính vàng/xanh quanh khu bị nặng.', 'Tỉa cành rậm để giảm nơi trú ẩn.', 'Nếu mật số cao, hỏi kỹ sư trước khi phun để tránh sai hoạt chất.'],
      },
    ],
    products: ['Bẫy dính vàng', 'Dầu khoáng nông nghiệp', 'Chế phẩm sinh học Neem'],
  },
  {
    keywords: ['mặn', 'độ mặn', '0.9', 'tưới', 'van', 'khô'],
    diagnosis: 'Stress nước và mặn nhẹ, cần tưới thận trọng',
    confidence: 76,
    severity: 'Cảnh báo nước tưới',
    reply: 'Độ ẩm 38% là thấp, nhưng độ mặn 0.9‰ đã hơi nhạy với cây chanh. Không nên mở van tưới quá lâu một lần; nên chia nhịp tưới ngắn để rửa mặn từ từ.',
    sections: [
      {
        title: 'Cấu hình tưới gợi ý',
        items: ['Mở van 8-10 phút, nghỉ 20 phút rồi đo lại.', 'Không tưới dồn lượng lớn lúc nắng gắt.', 'Nếu có nước ngọt hơn, ưu tiên pha loãng nguồn tưới hiện tại.'],
      },
      {
        title: 'Ngưỡng cần báo động',
        items: ['Độ mặn vượt 1.2‰.', 'Lá héo dù đất vẫn ẩm.', 'Rìa lá cháy đồng loạt sau tưới.'],
      },
    ],
    products: ['Cảm biến EC đất', 'Humic giảm sốc mặn', 'Bộ lọc nước tưới'],
  },
];

function pickResponse(text) {
  const normalized = text.toLowerCase();
  const matched = RESPONSE_LIBRARY.find((item) => item.keywords.some((keyword) => normalized.includes(keyword)));
  return matched || {
    diagnosis: 'Cần thêm ảnh và chỉ số IoT để kết luận chắc hơn',
    confidence: 68,
    severity: 'Cần kỹ sư xác minh',
    reply: 'Mô tả hiện tại chưa đủ rõ để AI kết luận an toàn. Chú nên gửi thêm ảnh toàn cây, ảnh cận lá bệnh và ảnh mặt dưới lá. Con sẽ tạo hướng dẫn tạm thời trước khi chuyển kỹ sư nếu triệu chứng nặng.',
    sections: [
      {
        title: 'Thông tin cần bổ sung',
        items: ['Cây trồng là chanh hay khóm.', 'Triệu chứng xuất hiện bao lâu và lan nhanh không.', 'Độ ẩm đất, nhiệt độ, mưa 24 giờ gần nhất.'],
      },
      {
        title: 'Trong lúc chờ xác minh',
        items: ['Không phun thuốc theo cảm tính.', 'Khoanh vùng cây bệnh để theo dõi.', 'Chụp thêm ảnh rõ nét vào buổi sáng.'],
      },
    ],
    products: ['Gói tư vấn kỹ sư', 'Bộ test pH/EC', 'Bẫy quan sát côn trùng'],
  };
}

function buildAiMessage(text, farm) {
  const response = pickResponse(text);
  return {
    id: `msg-ai-${Date.now()}`,
    sender: 'ai',
    time: 'Vừa xong',
    text: response.reply,
    diagnosis: response.diagnosis,
    confidence: response.confidence,
    severity: response.severity,
    farmName: farm?.name || farm?.plotName || 'Vườn chanh Thạnh Phú',
    sections: response.sections,
    products: response.products,
  };
}

export function AIDiagnosisPage({ state, setState, notify }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedName, setAttachedName] = useState('');
  const chatEndRef = useRef(null);
  const timerRef = useRef(null);
  const farm = state.farms[0];

  const latestDiagnosis = useMemo(
    () => messages.filter((message) => message.sender === 'ai' && message.confidence).at(-1),
    [messages],
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const persistDiagnosis = (aiMessage, userText) => {
    const diagnosis = {
      id: `AI-${Date.now()}`,
      farmId: farm.id,
      crop: farm.crop,
      disease: aiMessage.diagnosis,
      confidence: aiMessage.confidence,
      severity: aiMessage.severity,
      prescription: aiMessage.sections.flatMap((section) => section.items).slice(0, 4).join(' '),
      status: aiMessage.confidence >= 75 ? 'Auto_Prescribed' : 'Need_Expert',
      createdAt: new Date().toISOString(),
    };

    setState((prev) => {
      let next = { ...prev, diagnoses: [diagnosis, ...prev.diagnoses] };
      next = addLedgerEntry(next, {
        type: 'AI_Diagnosis',
        farmId: farm.id,
        title: `AI chẩn đoán: ${diagnosis.disease}`,
        detail: `Câu hỏi: ${userText}. Confidence ${diagnosis.confidence}%. ${diagnosis.prescription}`,
      });
      if (aiMessage.confidence < 75) {
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
            iotSummary: 'Đính kèm lịch sử IoT 30 ngày: độ ẩm, nhiệt độ, độ mặn và mưa 24h gần nhất.',
            expertDiagnosis: '',
            treatment: '',
          },
          ...prev.sosTickets,
        ];
      }
      return next;
    });
  };

  const sendMessage = (text = draft) => {
    const content = text.trim();
    if (!content && !attachedName) {
      notify?.('Bạn nhập triệu chứng hoặc đính kèm ảnh trước nha.');
      return;
    }

    const userText = content || `Tôi vừa gửi ảnh ${attachedName}, nhờ AI xem giúp cây có dấu hiệu gì.`;
    const userMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      time: 'Vừa xong',
      text: attachedName ? `${userText}\nĐính kèm: ${attachedName}` : userText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft('');
    setAttachedName('');
    setIsTyping(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const aiMessage = buildAiMessage(userText, farm);
      setMessages((prev) => [...prev, aiMessage]);
      persistDiagnosis(aiMessage, userText);
      setIsTyping(false);
      notify?.(aiMessage.confidence >= 75 ? 'AI đã trả lời và ghi nhật ký chẩn đoán.' : 'AI đã tạo khuyến nghị và đánh dấu cần kỹ sư xác minh.');
    }, 2000);
  };

  const attachMockImage = () => {
    setAttachedName('anh-la-chanh-dom-vang.jpg');
    notify?.('Đã đính kèm ảnh mẫu để demo chat AI.');
  };

  return (
    <section className="ai-chat-page">
      <aside className="ai-chat-sidebar">
        <div className="ai-chat-brand">
          <span><Sparkles size={18} /></span>
          <div>
            <strong>GREENOVA AI</strong>
            <small>Trợ lý bệnh cây & IoT</small>
          </div>
        </div>

        <div className="ai-context-card">
          <p className="eyebrow">Vườn đang theo dõi</p>
          <h3>{farm.name || 'Vườn chanh Thạnh Phú'}</h3>
          <div>
            <span>Cây trồng</span>
            <strong>{farm.crop}</strong>
          </div>
          <div>
            <span>Độ ẩm đất</span>
            <strong>{state.devices[0]?.telemetry?.soilMoisture || 82}%</strong>
          </div>
          <div>
            <span>Nhiệt độ</span>
            <strong>{state.devices[0]?.telemetry?.ambientTemp || 27}°C</strong>
          </div>
        </div>

        {latestDiagnosis && (
          <div className="ai-context-card">
            <p className="eyebrow">Kết luận mới nhất</p>
            <h3>{latestDiagnosis.diagnosis}</h3>
            <Badge status={latestDiagnosis.confidence >= 75 ? 'success' : 'warning'}>
              Confidence {latestDiagnosis.confidence}%
            </Badge>
          </div>
        )}

        <div className="ai-prompt-list">
          <strong>Câu hỏi mẫu</strong>
          {QUICK_PROMPTS.map((prompt) => (
            <button key={prompt} onClick={() => sendMessage(prompt)} disabled={isTyping}>
              {prompt}
            </button>
          ))}
        </div>
      </aside>

      <main className="ai-chat-shell">
        <header className="ai-chat-header">
          <div>
            <p className="eyebrow">Chat AI chẩn đoán</p>
            <h1>Hỏi GREENOVA AI về triệu chứng cây trồng</h1>
          </div>
          <div className="ai-chat-status">
            <span />
            Online
          </div>
        </header>

        <div className="ai-message-list">
          {messages.map((message) => (
            <article key={message.id} className={`ai-message ${message.sender}`}>
              <div className="ai-message-avatar">
                {message.sender === 'ai' ? <Bot size={18} /> : <Sprout size={18} />}
              </div>
              <div className="ai-message-bubble">
                <div className="ai-message-meta">
                  <strong>{message.sender === 'ai' ? 'GREENOVA AI' : 'Bạn'}</strong>
                  <span>{message.time}</span>
                </div>
                <p>{message.text}</p>

                {message.diagnosis && (
                  <div className="ai-diagnosis-strip">
                    <Leaf size={16} />
                    <div>
                      <span>Chẩn đoán sơ bộ</span>
                      <strong>{message.diagnosis}</strong>
                    </div>
                    <Badge status={message.confidence >= 75 ? 'success' : 'warning'}>{message.confidence}%</Badge>
                  </div>
                )}

                {message.sections?.map((section) => (
                  <div key={section.title} className="ai-answer-section">
                    <strong>{section.title}</strong>
                    <ul>
                      {section.items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ))}

                {message.products && (
                  <div className="ai-product-row">
                    {message.products.map((product) => <span key={product}>{product}</span>)}
                  </div>
                )}
              </div>
            </article>
          ))}

          {isTyping && (
            <article className="ai-message ai">
              <div className="ai-message-avatar"><Bot size={18} /></div>
              <div className="ai-message-bubble typing">
                <div className="ai-message-meta">
                  <strong>GREENOVA AI</strong>
                  <span>đang soạn</span>
                </div>
                <div className="typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </article>
          )}
          <div ref={chatEndRef} />
        </div>

        <footer className="ai-chat-composer">
          {attachedName && (
            <div className="ai-attachment-pill">
              <ImageIcon size={15} />
              {attachedName}
              <button onClick={() => setAttachedName('')}>Gỡ</button>
            </div>
          )}
          <div className="ai-composer-bar">
            <button onClick={attachMockImage} title="Đính kèm ảnh mẫu"><Paperclip size={18} /></button>
            <button onClick={attachMockImage} title="Ảnh lá bệnh"><Camera size={18} /></button>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              rows={1}
              placeholder="Mô tả triệu chứng cây trồng, ví dụ: lá vàng, đốm nâu, rễ mềm, độ ẩm đất..."
              disabled={isTyping}
            />
            <button className="ghost-mic" title="Ghi âm demo"><Mic size={18} /></button>
            <button className="send" onClick={() => sendMessage()} disabled={isTyping}>
              {isTyping ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
            </button>
          </div>
          <small><CheckCircle2 size={13} /> Phản hồi là mock AI để demo MVP, không thay thế tư vấn kỹ sư tại vườn.</small>
        </footer>
      </main>
    </section>
  );
}
