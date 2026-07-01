import { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  Bot,
  CloudLightning,
  Filter,
  Heart,
  Image as ImageIcon,
  LineChart,
  MapPin,
  MessageCircle,
  Radio,
  RefreshCcw,
  Send,
  ShieldAlert,
  ThermometerSun,
  Video,
  Wifi,
  X,
} from 'lucide-react';
import { defaultIntelStream, roles } from '../../data/greenovaData';

const farmerSeedPosts = [
  {
    id: 'FARM-FEED-01',
    author: 'Ngô Hoàng Trường Đạt',
    role: 'Nông dân · Thạnh Phú',
    time: '15 phút trước',
    content: 'Vườn chanh sau mưa có vài lá đốm vàng nhẹ. Mình đã giảm tưới chiều nay, bà con có gặp tình trạng này chưa?',
    tags: ['Chanh không hạt', 'Đốm lá', 'Bến Lức'],
    likes: 18,
    liked: false,
    comments: 4,
    commentList: [
      { id: 'CMT-F-01', author: 'KS. Nguyễn Minh Khoa', text: 'Anh kiểm tra mặt dưới lá thêm giúp em, nếu lan nhanh thì tạo SOS để kỹ sư xem kỹ hơn.' },
    ],
    tone: 'lime',
    media: {
      type: 'image',
      url: '/lime_orchard.png',
      alt: 'Vườn chanh của nông dân',
    },
  },
  {
    id: 'FARM-FEED-02',
    author: 'KS. Nguyễn Minh Khoa',
    role: 'Kỹ sư nông nghiệp',
    time: '1 giờ trước',
    content: 'Độ ẩm không khí cao liên tục, bà con nên thăm vườn buổi sáng và tránh làm ướt tán lá khi tưới.',
    tags: ['Cảnh báo vùng', 'Nấm lá'],
    likes: 42,
    liked: false,
    comments: 9,
    commentList: [
      { id: 'CMT-F-02', author: 'Mai Thị Lan', text: 'Cảm ơn kỹ sư, sáng nay em đã mở rãnh thoát nước trước.' },
    ],
    tone: 'alert',
    media: {
      type: 'image',
      url: '/botanical_bg.png',
      alt: 'Kiểm tra lá cây ngoài vườn',
    },
  },
  {
    id: 'FARM-FEED-03',
    author: 'Mai Thị Lan',
    role: 'Nông dân trồng khóm',
    time: '3 giờ trước',
    content: 'Lô khóm gần mương đã thoát nước tốt hơn sau khi vét rãnh. Cảm biến báo độ ẩm còn 68%, cây đứng lại rồi.',
    tags: ['Khóm', 'IoT', 'Thoát nước'],
    likes: 27,
    liked: false,
    comments: 6,
    commentList: [
      { id: 'CMT-F-03', author: 'Ngô Hoàng Trường Đạt', text: 'Nhìn ổn hơn nhiều đó chị, khóm sau mưa cần thoát nước nhanh.' },
    ],
    tone: 'pineapple',
    media: {
      type: 'image',
      url: '/pineapple_field.png',
      alt: 'Ruộng khóm sau mưa',
    },
  },
];

const expertTreatmentSuggestions = [
  'Khuyến nghị tỉa lá bệnh, ngưng tưới chiều tối 2 ngày và theo dõi mặt dưới lá.',
  'Có thể dùng Nano đồng bạc liều nhẹ theo nhãn, phun lúc sáng sớm và tránh trước mưa.',
  'Bổ sung Trichoderma khi đất ráo để phục hồi hệ rễ, chưa nên bón thêm đạm.',
];

export function FeedPage({ role, notify }) {
  const account = roles.find((item) => item.id === role);
  const [stream, setStream] = useState(defaultIntelStream);
  const [filter, setFilter] = useState('ALL');
  const [farmerPosts, setFarmerPosts] = useState(farmerSeedPosts);
  const [draft, setDraft] = useState('');
  const [draftMedia, setDraftMedia] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({});

  const visibleStream = stream.filter(evt => {
    if (filter === 'ALL') return true;
    if (filter === 'CRITICAL') return evt.severity === 'high';
    if (filter === 'IOT') return evt.type === 'IOT_TELEMETRY';
    if (filter === 'AI') return evt.source.includes('AI');
    return true;
  });

  const triggerManualAlert = () => {
    const newAlert = {
      id: `EVT-${Date.now()}`,
      type: "CRITICAL_ALERT",
      source: `Chuyên gia ${account.accountName}`,
      location: "Khu vực giám sát",
      title: "Cảnh báo khẩn cấp (Thủ công)",
      description: "Chuyên gia vừa kích hoạt cảnh báo khẩn. Yêu cầu toàn bộ nông trại kiểm tra hệ thống tiêu thoát nước ngay lập tức.",
      severity: "high",
      timestamp: new Date().toISOString(),
      metrics: { status: "URGENT", level: 5 }
    };
    setStream([newAlert, ...stream]);
    notify('Đã phát đi cảnh báo khẩn cấp trên toàn hệ thống!');
  };

  const getSeverityColor = (sev) => {
    if (sev === 'high') return 'red';
    if (sev === 'warning') return 'orange';
    if (sev === 'success') return 'green';
    return 'blue';
  };

  const getIcon = (type) => {
    if (type === 'CRITICAL_ALERT') return <ShieldAlert size={18} />;
    if (type === 'IOT_TELEMETRY') return <Radio size={18} />;
    if (type === 'MARKET_INSIGHT') return <LineChart size={18} />;
    if (type === 'WEATHER_WARNING') return <CloudLightning size={18} />;
    return <Activity size={18} />;
  };

  const chooseDraftMedia = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const mediaType = file.type.startsWith('video') ? 'video' : 'image';
    setDraftMedia({
      type: mediaType,
      url: URL.createObjectURL(file),
      alt: file.name,
    });
    event.target.value = '';
  };

  const submitFarmerPost = () => {
    const content = draft.trim();
    if (!content && !draftMedia) {
      notify('Bạn nhập nội dung hoặc chọn ảnh/video trước nha.');
      return;
    }
    const isExpert = role === 'expert';
    setFarmerPosts([
      {
        id: `FARM-FEED-${Date.now()}`,
        author: account?.accountName || (isExpert ? 'Kỹ sư GREENOVA' : 'Nông dân GREENOVA'),
        role: isExpert ? 'Kỹ sư nông nghiệp · Bến Lức' : 'Nông dân · Bến Lức',
        time: 'Vừa xong',
        content: content || (isExpert ? 'Đã thêm hình ảnh cảnh báo kỹ thuật cho bà con.' : 'Đã thêm ảnh/video từ vườn.'),
        tags: isExpert ? ['Khuyến cáo kỹ thuật', 'BVTV', 'Bến Lức'] : ['Hỏi đáp', 'Vườn nhà'],
        likes: 0,
        liked: false,
        comments: 0,
        commentList: [],
        tone: 'lime',
        media: draftMedia,
      },
      ...farmerPosts,
    ]);
    setDraft('');
    setDraftMedia(null);
    notify(isExpert ? 'Đã đăng hướng dẫn kỹ thuật lên bảng tin.' : 'Đã đăng bài lên bảng tin.');
  };

  const toggleLike = (postId) => {
    setFarmerPosts((posts) => posts.map((post) => {
      if (post.id !== postId) return post;
      const liked = !post.liked;
      return { ...post, liked, likes: Math.max(0, post.likes + (liked ? 1 : -1)) };
    }));
  };

  const submitComment = (postId) => {
    const text = (commentDrafts[postId] || '').trim();
    if (!text) return;
    setFarmerPosts((posts) => posts.map((post) => (
      post.id === postId
        ? {
            ...post,
            comments: post.comments + 1,
            commentList: [
              ...(post.commentList || []),
              { id: `CMT-${Date.now()}`, author: account?.accountName || 'Bạn', text },
            ],
          }
        : post
    )));
    setCommentDrafts((drafts) => ({ ...drafts, [postId]: '' }));
  };

  const applyExpertSuggestion = (postId, text) => {
    setCommentDrafts((drafts) => ({ ...drafts, [postId]: text }));
    window.setTimeout(() => document.getElementById(`farmer-comment-${postId}`)?.focus(), 0);
  };

  if (role === 'farmer' || role === 'expert') {
    const isExpertFeed = role === 'expert';
    return (
      <section className="farmer-feed page-grid">
        <header className="farmer-feed-head">
          <div>
            <p className="eyebrow">{isExpertFeed ? 'Kỹ sư nông nghiệp' : 'Cộng đồng'}</p>
            <h1>{isExpertFeed ? 'Bảng tin tư vấn cây trồng' : 'Bảng tin nhà nông'}</h1>
            <p>
              {isExpertFeed
                ? 'Theo dõi câu hỏi của nông dân, bình luận biện pháp xử lý bệnh và gợi ý vật tư phù hợp.'
                : 'Đăng câu hỏi, xem cảnh báo của kỹ sư và trao đổi kinh nghiệm canh tác.'}
            </p>
          </div>
        </header>

        <article className="farmer-composer">
          <div className="farmer-composer-top">
            <div className={isExpertFeed ? 'farmer-avatar expert' : 'farmer-avatar'}>{isExpertFeed ? 'K' : 'N'}</div>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={3}
              placeholder={isExpertFeed ? 'Đăng cảnh báo vùng, hướng dẫn xử lý bệnh hoặc khuyến cáo dùng thuốc...' : 'Bạn đang nghĩ gì về vườn hôm nay?'}
            />
          </div>
          {draftMedia && (
            <div className="farmer-draft-media">
              <button onClick={() => setDraftMedia(null)} aria-label="Xóa media"><X size={16} /></button>
              {draftMedia.type === 'video' ? (
                <video src={draftMedia.url} controls />
              ) : (
                <img src={draftMedia.url} alt={draftMedia.alt || 'Ảnh bài viết'} />
              )}
            </div>
          )}
          <div className="farmer-composer-actions">
            <label>
              <ImageIcon size={16} /> Ảnh
              <input type="file" accept="image/*" onChange={chooseDraftMedia} />
            </label>
            <label>
              <Video size={16} /> Video
              <input type="file" accept="video/*" onChange={chooseDraftMedia} />
            </label>
            <button type="button" className="primary" onClick={submitFarmerPost}>
              <Send size={16} /> {isExpertFeed ? 'Đăng hướng dẫn' : 'Đăng'}
            </button>
          </div>
        </article>

        <div className="farmer-feed-layout">
          <main className="farmer-post-list">
            {farmerPosts.map((post) => (
              <article key={post.id} className="farmer-post-card">
                <div className="farmer-post-header">
                  <div className={post.role.includes('Kỹ sư') ? 'farmer-avatar expert' : 'farmer-avatar'}>
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <strong>{post.author}</strong>
                    <span>{post.role} · {post.time}</span>
                  </div>
                </div>
                <p>{post.content}</p>
                {post.media && (
                  <div className="farmer-post-media">
                    {post.media.type === 'video' ? (
                      <video src={post.media.url} controls />
                    ) : (
                      <img src={post.media.url} alt={post.media.alt || post.content} loading="lazy" />
                    )}
                  </div>
                )}
                <div className="farmer-post-tags">
                  {post.tags.map((tag) => <span key={tag}>#{tag}</span>)}
                </div>
                <div className="farmer-post-actions">
                  <button
                    className={post.liked ? 'liked' : ''}
                    onClick={() => toggleLike(post.id)}
                    aria-label="Thích bài viết"
                    title="Thích"
                  >
                    <Heart size={20} /> <span>{post.likes}</span>
                  </button>
                  <button
                    onClick={() => document.getElementById(`farmer-comment-${post.id}`)?.focus()}
                    aria-label="Bình luận bài viết"
                    title="Bình luận"
                  >
                    <MessageCircle size={20} /> <span>{post.comments}</span>
                  </button>
                </div>
                <div className="farmer-comments">
                  {(post.commentList || []).map((comment) => (
                    <div key={comment.id} className="farmer-comment">
                      <div className="farmer-comment-avatar">{comment.author.charAt(0)}</div>
                      <p><strong>{comment.author}</strong>{comment.text}</p>
                    </div>
                  ))}
                  <div className="farmer-comment-input">
                    <div className="farmer-comment-avatar">{isExpertFeed ? 'K' : 'B'}</div>
                    <input
                      id={`farmer-comment-${post.id}`}
                      value={commentDrafts[post.id] || ''}
                      onChange={(event) => setCommentDrafts((drafts) => ({ ...drafts, [post.id]: event.target.value }))}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') submitComment(post.id);
                      }}
                      placeholder={isExpertFeed ? 'Viết biện pháp xử lý hoặc gợi ý thuốc...' : 'Viết bình luận...'}
                    />
                    <button onClick={() => submitComment(post.id)}><Send size={15} /></button>
                  </div>
                  {isExpertFeed && (
                    <div className="expert-comment-suggestions">
                      {expertTreatmentSuggestions.map((suggestion) => (
                        <button key={suggestion} onClick={() => applyExpertSuggestion(post.id, suggestion)}>
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </main>

          <aside className="farmer-feed-side">
            <div>
              <strong>{isExpertFeed ? 'Ca cần ưu tiên' : 'Chủ đề nhanh'}</strong>
              {(isExpertFeed
                ? ['#Đốm lá sau mưa', '#Úng rễ khóm', '#Bọ trĩ đọt non', '#Gợi ý thuốc']
                : ['#Chanh không hạt', '#Nấm lá', '#IoT tưới', '#Bán nông sản']
              ).map((topic) => <span key={topic}>{topic}</span>)}
            </div>
            <div>
              <strong>{isExpertFeed ? 'Vật tư hay kê đơn' : 'Kỹ sư online'}</strong>
              {(isExpertFeed
                ? ['Nano đồng bạc', 'Trichoderma', 'Bẫy dính vàng']
                : ['KS. Nguyễn Minh Khoa', 'ThS. Lê Thu Hà']
              ).map((item) => <span key={item}>{item}</span>)}
            </div>
          </aside>
        </div>
      </section>
    );
  }

  return (
    <div className="intel-hub-wrapper">
      <div className="hub-header">
        <div className="hub-title">
          <Activity className="pulse-icon" size={28} />
          <div>
            <h1>Trung tâm Trí tuệ Nông nghiệp</h1>
            <p>Hệ thống giám sát Radar & Luồng dữ liệu thời gian thực</p>
          </div>
        </div>
        <div className="hub-status">
          <span className="live-badge"><span className="dot"></span> LIVE</span>
          <span className="sync-time">Last sync: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* TOP METRICS */}
      <div className="intel-metrics-grid">
        <div className="intel-metric-card">
          <div className="metric-icon blue"><Wifi size={24} /></div>
          <div className="metric-info">
            <span className="label">Sensor Trực tuyến</span>
            <strong className="value">42 / 45</strong>
          </div>
        </div>
        <div className="intel-metric-card">
          <div className="metric-icon red"><AlertOctagon size={24} /></div>
          <div className="metric-info">
            <span className="label">Mức độ Dịch tễ</span>
            <strong className="value">Cảnh báo Cấp 2</strong>
          </div>
        </div>
        <div className="intel-metric-card">
          <div className="metric-icon teal"><Bot size={24} /></div>
          <div className="metric-info">
            <span className="label">AI Confidence (Avg)</span>
            <strong className="value">89.4%</strong>
          </div>
        </div>
        <div className="intel-metric-card">
          <div className="metric-icon orange"><ThermometerSun size={24} /></div>
          <div className="metric-info">
            <span className="label">Chỉ số Môi trường</span>
            <strong className="value">Nguy cơ Cao</strong>
          </div>
        </div>
      </div>

      <div className="intel-hub-layout">
        
        {/* LEFT COLUMN: RADAR & CONTROLS */}
        <aside className="intel-sidebar">
          
          <div className="intel-panel">
            <div className="panel-header">
              <h3><MapPin size={16} /> Radar Cảnh Báo Vùng</h3>
              {role === 'expert' && (
                <button className="danger-btn" onClick={triggerManualAlert}>
                  Phát lệnh Khẩn
                </button>
              )}
            </div>
            <div className="radar-map-mock">
              {/* Vòng Radar CSS */}
              <div className="radar-circle">
                <div className="radar-sweep"></div>
                <div className="radar-blip red" style={{ top: '30%', left: '40%' }}></div>
                <div className="radar-blip orange" style={{ top: '60%', left: '70%' }}></div>
                <div className="radar-blip blue" style={{ top: '20%', left: '80%' }}></div>
              </div>
              <div className="radar-legend">
                <span><span className="dot red"></span> Dịch bệnh</span>
                <span><span className="dot orange"></span> Thời tiết</span>
                <span><span className="dot blue"></span> Môi trường</span>
              </div>
            </div>
          </div>

          <div className="intel-panel">
            <div className="panel-header">
              <h3><Filter size={16} /> Bộ lọc Dữ liệu</h3>
            </div>
            <div className="filter-group">
              <button className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`} onClick={() => setFilter('ALL')}>
                Toàn cảnh (All)
              </button>
              <button className={`filter-btn ${filter === 'CRITICAL' ? 'active' : ''}`} onClick={() => setFilter('CRITICAL')}>
                Nguy cấp (Critical)
              </button>
              <button className={`filter-btn ${filter === 'IOT' ? 'active' : ''}`} onClick={() => setFilter('IOT')}>
                Dữ liệu IoT (Sensors)
              </button>
              <button className={`filter-btn ${filter === 'AI' ? 'active' : ''}`} onClick={() => setFilter('AI')}>
                Phân tích AI
              </button>
            </div>
          </div>

        </aside>

        {/* RIGHT COLUMN: EVENT STREAM */}
        <main className="intel-stream">
          <div className="stream-header">
            <h3>Luồng sự kiện (Live Stream)</h3>
            <button className="refresh-btn" onClick={() => notify('Đang đồng bộ dữ liệu mới nhất...')}><RefreshCcw size={14} /> Refresh</button>
          </div>
          
          <div className="stream-list">
            {visibleStream.map((evt) => (
              <div key={evt.id} className={`stream-item ${evt.severity}`}>
                <div className="stream-timeline">
                  <div className={`timeline-icon ${evt.severity}`}>
                    {getIcon(evt.type)}
                  </div>
                  <div className="timeline-line"></div>
                </div>
                
                <div className="stream-content">
                  <div className="stream-meta">
                    <span className="source">{evt.source}</span>
                    <span className="time">{new Date(evt.timestamp).toLocaleTimeString('vi-VN')}</span>
                  </div>
                  <h4 className="stream-title">{evt.title}</h4>
                  <p className="stream-desc">{evt.description}</p>
                  
                  <div className="stream-metrics">
                    {Object.entries(evt.metrics).map(([key, val]) => (
                      <div key={key} className="metric-pill">
                        <span className="m-key">{key}:</span>
                        <span className="m-val">{val}</span>
                      </div>
                    ))}
                    <span className="location-tag"><MapPin size={12} /> {evt.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
