import { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Bot,
  Bug,
  CheckCircle2,
  CloudLightning,
  CloudRain,
  Droplets,
  Filter,
  Heart,
  Image as ImageIcon,
  Info,
  Leaf,
  LineChart,
  MapPin,
  MessageCircle,
  Package,
  Plus,
  Radio,
  RefreshCcw,
  Search,
  Send,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Store,
  Sun,
  ThermometerSun,
  TrendingUp,
  Video,
  Wifi,
  X,
} from 'lucide-react';
import { defaultIntelStream, roles } from '../../data/greenovaData';

// ----------------------------------------------------------------------
// DATA MOCK DÀNH RIÊNG CHO BẢNG TIN NÔNG DÂN & CHUYÊN GIA
// ----------------------------------------------------------------------
const farmerSeedPosts = [
  {
    id: 'FARM-FEED-01',
    author: 'Ngô Hoàng Trường Đạt',
    role: 'Nông dân · Thạnh Phú',
    time: '15 phút trước',
    content: 'Vườn chanh sau mưa có vài lá đốm vàng nhẹ. Mình đã giảm tưới chiều nay, bà con và đại lý có gợi ý thuốc nào xử lý nhanh không?',
    tags: ['Chanh không hạt', 'Đốm lá', 'Bến Lức'],
    likes: 18,
    liked: false,
    comments: 4,
    commentList: [
      { id: 'CMT-F-01', author: 'KS. Nguyễn Minh Khoa', text: 'Anh kiểm tra mặt dưới lá thêm giúp em, nếu lan nhanh thì tạo SOS để kỹ sư xem kỹ hơn.' },
      { id: 'CMT-F-02', author: 'Đại lý Út Chanh', text: 'Chào anh Đạt, bên cửa hàng em sẵn Nano Đồng Bạc và Mancozeb phòng nấm lá rất tốt, ghé em lấy nhé!' },
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
    content: 'Độ ẩm không khí cao liên tục >88%, bà con nên thăm vườn buổi sáng, ngưng bón đạm và chuẩn bị sẵn thuốc trừ nấm lá.',
    tags: ['Cảnh báo vùng', 'Nấm lá'],
    likes: 42,
    liked: false,
    comments: 9,
    commentList: [
      { id: 'CMT-F-03', author: 'Mai Thị Lan', text: 'Cảm ơn kỹ sư, sáng nay em đã mở rãnh thoát nước trước.' },
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
      { id: 'CMT-F-04', author: 'Ngô Hoàng Trường Đạt', text: 'Nhìn ổn hơn nhiều đó chị, khóm sau mưa cần thoát nước nhanh.' },
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

// ----------------------------------------------------------------------
// DATA MOCK CẢNH BÁO DỊCH BỆNH & DỰ BÁO VẬT TƯ CHO ĐẠI LÝ
// ----------------------------------------------------------------------
const regionalOutbreaksData = [
  {
    id: 'OUTBREAK-01',
    diseaseName: 'Bệnh Nấm Lá & Thán Thư Lá Chanh',
    cropType: 'Chanh không hạt',
    location: 'Xã Thạnh Phú & Lương Hòa (Bến Lức)',
    severity: 'critical', // critical | warning | info
    severityText: '🔴 Ổ dịch bùng phát',
    reportedFarms: 14,
    affectedArea: '18.5 ha',
    trend: 'tăng nhanh 45%',
    cause: 'Thời tiết mưa dầm liên tục 3 ngày qua, độ ẩm không khí duy trì >88%, bón thừa đạm.',
    symptoms: 'Lá xuất hiện đốm tròn màu nâu vàng, mép lá cháy xém, rụng lá non và thối trái mương.',
    recommendedSupplies: [
      {
        id: 'SUP-01',
        name: 'Nano Đồng Bạc 500ml (GreenCare)',
        category: 'Thuốc trừ bệnh sinh học',
        purpose: 'Đặc trị nấm lá & thán thư sinh học, an toàn xuất khẩu',
        unit: 'Chai 500ml',
        estDemand: '⚡ Nhu cầu tăng +180%',
        suggestedStock: '50 chai',
        price: '185.000đ',
        inStore: true,
      },
      {
        id: 'SUP-02',
        name: 'Mancozeb 80WP (BioAgri)',
        category: 'Thuốc vi sinh phòng bệnh',
        purpose: 'Phun rửa vườn & tạo màng bảo vệ lá sau mưa',
        unit: 'Gói 1kg',
        estDemand: '⚡ Nhu cầu tăng +120%',
        suggestedStock: '40 gói',
        price: '145.000đ',
        inStore: true,
      },
      {
        id: 'SUP-03',
        name: 'Trichoderma Bổ Sung Vi Sinh Đất',
        category: 'Chế phẩm sinh học',
        purpose: 'Phục hồi bộ rễ bị úng đọng nước, đối kháng nấm rễ',
        unit: 'Gói 500g',
        estDemand: '⚡ Nhu cầu tăng +95%',
        suggestedStock: '30 gói',
        price: '95.000đ',
        inStore: false,
      },
    ],
  },
  {
    id: 'OUTBREAK-02',
    diseaseName: 'Bọ Trĩ & Sâu Vẽ Bùa Tấn Công Đọt Non',
    cropType: 'Chanh & Cây ăn trái',
    location: 'Xã Đức Hòa & Thị trấn Bến Lức',
    severity: 'warning',
    severityText: '🟠 Cảnh báo lan rộng',
    reportedFarms: 8,
    affectedArea: '9.2 ha',
    trend: 'tăng 20%',
    cause: 'Thời tiết xen kẽ nắng gắt và mưa rào, chanh ra đọt non rộ sau đợt tỉa cành.',
    symptoms: 'Đọt non bị quăn queo, lá biến dạng có đường ngoằn ngoèo màu bạc của sâu vẽ bùa.',
    recommendedSupplies: [
      {
        id: 'SUP-04',
        name: 'Dầu Khoáng SK Enspray 99EC',
        category: 'Thuốc trừ sâu sinh học',
        purpose: 'Bọc lá diệt trứng bọ trĩ, sâu vẽ bùa không gây kháng thuốc',
        unit: 'Chai 1 lít',
        estDemand: '⚡ Nhu cầu tăng +140%',
        suggestedStock: '35 chai',
        price: '160.000đ',
        inStore: true,
      },
      {
        id: 'SUP-05',
        name: 'Bẫy Dính Vàng Sinh Học Vườn Cây',
        category: 'Nông cụ bảo vệ',
        purpose: 'Giám sát & bẫy mật độ bọ trĩ, ruồi vàng đầu mùa',
        unit: 'Cuộn 50m',
        estDemand: '⚡ Nhu cầu tăng +80%',
        suggestedStock: '15 cuộn',
        price: '210.000đ',
        inStore: false,
      },
      {
        id: 'SUP-06',
        name: 'Phân Bón Lá Calci-Bo Chống Gãy Đọt',
        category: 'Phân bón lá',
        purpose: 'Tăng dẻo dai đọt non, giảm rụng bông trái non',
        unit: 'Chai 500ml',
        estDemand: '⚡ Nhu cầu tăng +65%',
        suggestedStock: '25 chai',
        price: '120.000đ',
        inStore: true,
      },
    ],
  },
  {
    id: 'OUTBREAK-03',
    diseaseName: 'Xâm Nhập Mặn Kênh Nội Đồng & Thối Đọt Khóm',
    cropType: 'Khóm Bến Lức & Chanh',
    location: 'Kênh Thạnh Phú - Sông Vàm Cỏ Đông',
    severity: 'info',
    severityText: '🟡 Yếu tố môi trường',
    reportedFarms: 5,
    affectedArea: '12.0 ha',
    trend: 'ổn định',
    cause: 'Triều cường dâng mang độ mặn 1.2‰ vào rạch, nước rút chậm gây thối đọt khóm.',
    symptoms: 'Nước mương rạch mặn nhẹ, gốc khóm bị thối đen do đọng nước mặn.',
    recommendedSupplies: [
      {
        id: 'SUP-07',
        name: 'Humic Mỹ Kích Rễ Giải Độc Mặn',
        category: 'Phân bón sinh học',
        purpose: 'Giải độc mặn, rửa phèn, kích rễ tơ phục hồi rễ khóm & chanh',
        unit: 'Gói 1kg',
        estDemand: '⚡ Nhu cầu tăng +110%',
        suggestedStock: '45 gói',
        price: '175.000đ',
        inStore: true,
      },
      {
        id: 'SUP-08',
        name: 'Bút Đo Độ Mặn / EC Cầm Tay AZ8371',
        category: 'Thiết bị đo đạc',
        purpose: 'Nông dân mua đo nhanh nước mương trước khi bơm tưới',
        unit: 'Cái',
        estDemand: '⚡ Nhu cầu tăng +50%',
        suggestedStock: '10 cái',
        price: '450.000đ',
        inStore: true,
      },
    ],
  },
];

const farmerSOSAlerts = [
  {
    id: 'SOS-01',
    farmerName: 'Ngô Hoàng Trường Đạt',
    farmLocation: 'Thạnh Phú · Cách đại lý 4.8 km',
    crop: 'Chanh không hạt (1.2 ha)',
    issue: 'Đốm vàng lan rộng 3 công chanh sau mưa dầm.',
    urgentMsg: 'Đại lý Út Chanh có sẵn Nano Đồng Bạc hoặc Mancozeb không? Em cần 5 chai giao sáng mai.',
    time: '10 phút trước',
    status: 'Đang cần tư vấn thuốc',
  },
  {
    id: 'SOS-02',
    farmerName: 'Mai Thị Lan',
    farmLocation: 'Lương Hòa · Cách đại lý 6.2 km',
    crop: 'Khóm Bến Lức (2.5 ha)',
    issue: 'Đọt khóm mương dưới bị thối nhũn 5%.',
    urgentMsg: 'Đại lý tư vấn giúp loại Trichoderma tưới gốc giải độc mặn với ạ.',
    time: '45 phút trước',
    status: 'Đang cần tư vấn thuốc',
  },
];

// ----------------------------------------------------------------------
// MAIN FEED PAGE COMPONENT
// ----------------------------------------------------------------------
export function FeedPage({ role, notify, dealer }) {
  const account = roles.find((item) => item.id === role);

  // States cho Farmer / Expert Feed
  const [farmerPosts, setFarmerPosts] = useState(farmerSeedPosts);
  const [draft, setDraft] = useState('');
  const [draftMedia, setDraftMedia] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({});

  // States cho Distributor Feed
  const [distributorTab, setDistributorTab] = useState('outbreaks'); // outbreaks | sos | stats | all
  const [distributorFilter, setDistributorFilter] = useState('ALL'); // ALL | CRITICAL | WARNING | INFO
  const [cropFilter, setCropFilter] = useState('ALL'); // ALL | CHANH | KHOM
  const [searchTerm, setSearchTerm] = useState('');
  const [addedItems, setAddedItems] = useState({});
  const [quoteModal, setQuoteModal] = useState(null);
  const [quoteText, setQuoteText] = useState('');

  // ------------------------------------------------------------------
  // RENDER DÀNH RIÊNG CHO NÔNG DÂN & CHUYÊN GIA (Social Feed)
  // ------------------------------------------------------------------
  if (role === 'farmer' || role === 'expert') {
    const isExpertFeed = role === 'expert';

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
      setFarmerPosts([
        {
          id: `FARM-FEED-${Date.now()}`,
          author: account?.accountName || (isExpertFeed ? 'Kỹ sư GREENOVA' : 'Nông dân GREENOVA'),
          role: isExpertFeed ? 'Kỹ sư nông nghiệp · Bến Lức' : 'Nông dân · Bến Lức',
          time: 'Vừa xong',
          content: content || (isExpertFeed ? 'Đã thêm hướng dẫn kỹ thuật cho bà con.' : 'Đã thêm ảnh/video từ vườn.'),
          tags: isExpertFeed ? ['Khuyến cáo kỹ thuật', 'BVTV', 'Bến Lức'] : ['Hỏi đáp', 'Vườn nhà'],
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
      notify(isExpertFeed ? 'Đã đăng hướng dẫn kỹ thuật lên bảng tin.' : 'Đã đăng bài lên bảng tin.');
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

        <article className="farmer-composer farmer-facebook-composer">
          <div className="farmer-composer-top">
            <div className={isExpertFeed ? 'farmer-avatar expert' : 'farmer-avatar'}>{isExpertFeed ? 'K' : 'N'}</div>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={2}
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
          <div className="farmer-composer-divider" />
          <div className="farmer-composer-actions">
            <label className="media-action image-action">
              <ImageIcon size={16} /> Ảnh
              <input type="file" accept="image/*" onChange={chooseDraftMedia} />
            </label>
            <label className="media-action video-action">
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
                        <button key={suggestion} onClick={() => setCommentDrafts((drafts) => ({ ...drafts, [post.id]: suggestion }))}>
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

  // ------------------------------------------------------------------
  // RENDER BẢNG TIN CẢNH BÁO DỊCH BỆNH & DỰ BÁO VẬT TƯ DÀNH CHO ĐẠI LÝ
  // ------------------------------------------------------------------
  const handleAddToStoreInventory = (supply) => {
    setAddedItems((prev) => ({ ...prev, [supply.id]: true }));
    notify(`Đã lưu "${supply.name}" vào Danh mục Vật tư gợi ý nhập kho của đại lý!`);
  };

  const handleOpenQuote = (sos) => {
    setQuoteModal(sos);
    setQuoteText(`Chào ${sos.farmerName}, Đại lý Út Chanh sẵn thuốc ${sos.crop.includes('Chanh') ? 'Nano Đồng Bạc & Mancozeb' : 'Trichoderma vi sinh'} đúng như anh/chị cần. Anh/chị ghé chợ Bến Lức lấy hoặc em gửi shipper giao tận vườn nhé!`);
  };

  const handleSendQuote = () => {
    if (!quoteModal) return;
    notify(`Đã gửi báo giá & tư vấn vật tư thành công đến nông dân ${quoteModal.farmerName}!`);
    setQuoteModal(null);
    setQuoteText('');
  };

  const filteredOutbreaks = regionalOutbreaksData.filter((item) => {
    if (distributorFilter !== 'ALL' && item.severity !== distributorFilter) return false;
    if (cropFilter === 'CHANH' && !item.cropType.toLowerCase().includes('chanh')) return false;
    if (cropFilter === 'KHOM' && !item.cropType.toLowerCase().includes('khóm')) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = item.diseaseName.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchCrop = item.cropType.toLowerCase().includes(q);
      const matchSupplies = item.recommendedSupplies.some((s) => s.name.toLowerCase().includes(q));
      if (!matchName && !matchLoc && !matchCrop && !matchSupplies) return false;
    }
    return true;
  });

  return (
    <div className="distributor-feed-wrapper page-grid">
      {/* HEADER BẢNG TIN ĐẠI LÝ */}
      <header className="distributor-feed-header">
        <div className="header-badge">
          <Store size={16} /> <span>ĐẠI LÝ VẬT TƯ NÔNG NGHIỆP · BẾN LỨC, LONG AN</span>
        </div>
        <div className="header-main-title">
          <div>
            <h1>Bảng Tin Dịch Bệnh Vùng & Dự Báo Nhu Cầu Vật Tư</h1>
            <p>
              Giám sát diễn biến sâu bệnh thời gian thực quanh bán kính đại lý. Giúp chủ đại lý chủ động nhập thuốc BVTV & phân bón phục vụ bà con nông dân đúng thời điểm.
            </p>
          </div>
          <button
            className="refresh-btn"
            onClick={() => notify('Đồng bộ dữ liệu dịch tễ mới nhất từ trạm giám sát Bến Lức thành công!')}
          >
            <RefreshCcw size={15} /> Làm mới dữ liệu
          </button>
        </div>
      </header>

      {/* TABS NAVIGATION BAR */}
      <nav className="distributor-tabs-nav">
        <button
          className={`dist-tab-btn ${distributorTab === 'outbreaks' ? 'active' : ''}`}
          onClick={() => setDistributorTab('outbreaks')}
        >
          <Bug size={18} /> Cảnh Báo Dịch Bệnh & Gợi Ý Vật Tư
          <span className="dist-tab-badge">{filteredOutbreaks.length}</span>
        </button>
        <button
          className={`dist-tab-btn ${distributorTab === 'sos' ? 'active' : ''}`}
          onClick={() => setDistributorTab('sos')}
        >
          <ShieldAlert size={18} /> Yêu Cầu SOS Nông Dân
          <span className="dist-tab-badge red">{farmerSOSAlerts.length}</span>
        </button>
        <button
          className={`dist-tab-btn ${distributorTab === 'stats' ? 'active' : ''}`}
          onClick={() => setDistributorTab('stats')}
        >
          <LineChart size={18} /> Thống Kê & Môi Trường Vùng
        </button>
        <button
          className={`dist-tab-btn ${distributorTab === 'all' ? 'active' : ''}`}
          onClick={() => setDistributorTab('all')}
        >
          <Activity size={18} /> Xem Toàn Cảnh
        </button>
      </nav>

      {/* METRIC SUMMARY CARDS */}
      <div className="distributor-metrics-grid">
        <div className="dist-metric-card alert-card">
          <div className="metric-icon red">
            <ShieldAlert size={26} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Ổ Dịch Đang Bùng Phát</span>
            <strong className="metric-value red-text">3 Ổ dịch vùng</strong>
            <span className="metric-sub">Bến Lức & Thạnh Phú</span>
          </div>
        </div>

        <div className="dist-metric-card warning-card">
          <div className="metric-icon orange">
            <AlertOctagon size={26} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Mức Độ Dịch Tễ Vùng</span>
            <strong className="metric-value orange-text">Cấp 3 (Nguy cơ Cao)</strong>
            <span className="metric-sub">Độ ẩm &gt;88% kéo dài</span>
          </div>
        </div>

        <div className="dist-metric-card supply-card">
          <div className="metric-icon green">
            <Package size={26} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Vật Tư Cần Chuẩn Bị Gấp</span>
            <strong className="metric-value green-text">8 Loại Thuốc & Phân</strong>
            <span className="metric-sub">Nhu cầu tăng +140%</span>
          </div>
        </div>

        <div className="dist-metric-card farm-card">
          <div className="metric-icon blue">
            <Leaf size={26} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Nông Trại Báo Bệnh</span>
            <strong className="metric-value blue-text">22 Nông trại</strong>
            <span className="metric-sub">Bán kính 10km quanh đại lý</span>
          </div>
        </div>
      </div>

      {/* TAB 1 & TAB ALL: OUTBREAKS & RECOMMENDED SUPPLIES */}
      {(distributorTab === 'outbreaks' || distributorTab === 'all') && (
        <section className="tab-section-block">
          {/* SEARCH & FILTERS BAR */}
          <div className="distributor-filter-card">
            <div className="search-input-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Tìm tên dịch bệnh, loại thuốc BVTV, khu vực hoặc nông sản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="clear-btn">
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="filter-pills-row">
              <div className="pill-group">
                <span className="pill-group-title"><Filter size={14} /> Mức độ dịch hại:</span>
                <button
                  className={`pill-btn ${distributorFilter === 'ALL' ? 'active' : ''}`}
                  onClick={() => setDistributorFilter('ALL')}
                >
                  Tất cả (3)
                </button>
                <button
                  className={`pill-btn red ${distributorFilter === 'critical' ? 'active' : ''}`}
                  onClick={() => setDistributorFilter('critical')}
                >
                  🔴 Nguy cấp (1)
                </button>
                <button
                  className={`pill-btn orange ${distributorFilter === 'warning' ? 'active' : ''}`}
                  onClick={() => setDistributorFilter('warning')}
                >
                  🟠 Cảnh báo (1)
                </button>
                <button
                  className={`pill-btn yellow ${distributorFilter === 'info' ? 'active' : ''}`}
                  onClick={() => setDistributorFilter('info')}
                >
                  🟡 Môi trường (1)
                </button>
              </div>

              <div className="pill-group">
                <span className="pill-group-title"><Leaf size={14} /> Cây trồng:</span>
                <button
                  className={`pill-btn ${cropFilter === 'ALL' ? 'active' : ''}`}
                  onClick={() => setCropFilter('ALL')}
                >
                  Tất cả
                </button>
                <button
                  className={`pill-btn lime ${cropFilter === 'CHANH' ? 'active' : ''}`}
                  onClick={() => setCropFilter('CHANH')}
                >
                  🍋 Chanh không hạt
                </button>
                <button
                  className={`pill-btn pineapple ${cropFilter === 'KHOM' ? 'active' : ''}`}
                  onClick={() => setCropFilter('KHOM')}
                >
                  🍍 Khóm Bến Lức
                </button>
              </div>
            </div>
          </div>

          <div className="distributor-outbreaks-list">
            <div className="section-title-bar">
              <h2>
                <Bug size={20} className="icon-green" /> 
                Cảnh Báo Dịch Bệnh Vùng & Danh Mục Vật Tư Gợi Ý Nhập Kho
              </h2>
              <span className="count-tag">{filteredOutbreaks.length} Ổ dịch ghi nhận</span>
            </div>

            {filteredOutbreaks.length === 0 ? (
              <div className="no-outbreak-box">
                <CheckCircle2 size={40} className="icon-green" />
                <h3>Không tìm thấy cảnh báo phù hợp với bộ lọc</h3>
                <p>Thử đổi từ khóa tìm kiếm hoặc chọn "Tất cả" để xem toàn bộ tình hình dịch tễ vùng.</p>
              </div>
            ) : (
              filteredOutbreaks.map((outbreak) => (
                <article key={outbreak.id} className={`outbreak-card ${outbreak.severity}`}>
                  {/* Outbreak Header */}
                  <div className="outbreak-card-head">
                    <div className="outbreak-title-wrap">
                      <span className={`severity-badge ${outbreak.severity}`}>
                        {outbreak.severityText}
                      </span>
                      <h3>{outbreak.diseaseName}</h3>
                      <div className="outbreak-sub-meta">
                        <span><MapPin size={14} /> {outbreak.location}</span>
                        <span>• Cây trồng: <strong>{outbreak.cropType}</strong></span>
                        <span>• Số farm báo bệnh: <strong className="highlight">{outbreak.reportedFarms} nông trại ({outbreak.affectedArea})</strong></span>
                      </div>
                    </div>
                    <div className="trend-badge">
                      <TrendingUp size={15} /> {outbreak.trend}
                    </div>
                  </div>

                  {/* Outbreak Info Grid */}
                  <div className="outbreak-info-grid">
                    <div className="info-block">
                      <strong><CloudRain size={15} /> Nguyên nhân bùng phát:</strong>
                      <p>{outbreak.cause}</p>
                    </div>
                    <div className="info-block">
                      <strong><AlertTriangle size={15} /> Triệu chứng ghi nhận:</strong>
                      <p>{outbreak.symptoms}</p>
                    </div>
                  </div>

                  {/* RECOMMENDED SUPPLIES BOX FOR DISTRIBUTOR */}
                  <div className="supplies-recommendation-box">
                    <div className="supplies-box-header">
                      <div className="supplies-box-title">
                        <ShoppingBag size={18} />
                        <div>
                          <h4>Gợi Ý Danh Mục Vật Tư & Thuốc BVTV Đại Lý Cần Chuẩn Bị</h4>
                          <p>Dựa trên triệu chứng dịch bệnh, đây là các sản phẩm nông dân lân cận đang tìm mua nhiều nhất:</p>
                        </div>
                      </div>
                    </div>

                    <div className="supplies-items-grid">
                      {outbreak.recommendedSupplies.map((supply) => {
                        const isAdded = addedItems[supply.id];
                        return (
                          <div key={supply.id} className={`supply-item-card ${isAdded ? 'added' : ''}`}>
                            <div className="supply-item-header">
                              <div className="supply-category-badge">{supply.category}</div>
                              <span className="est-demand-tag">{supply.estDemand}</span>
                            </div>

                            <h5 className="supply-name">{supply.name}</h5>
                            <p className="supply-purpose">{supply.purpose}</p>

                            <div className="supply-details-row">
                              <span className="supply-unit">Quy cách: <strong>{supply.unit}</strong></span>
                              <span className="supply-price">Giá tham khảo: <strong>{supply.price}</strong></span>
                            </div>

                            <div className="supply-stock-recommend">
                              <Info size={14} /> Khuyên nhập kho: <strong>{supply.suggestedStock}</strong>
                            </div>

                            <div className="supply-action-row">
                              {isAdded ? (
                                <button className="supply-btn added" disabled>
                                  <CheckCircle2 size={16} /> Đã lưu vào gợi ý nhập kho
                                </button>
                              ) : (
                                <button
                                  className="supply-btn primary"
                                  onClick={() => handleAddToStoreInventory(supply)}
                                >
                                  <Plus size={16} /> Thêm vào danh mục gợi ý nhập
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      )}

      {/* TAB 2 & TAB ALL: FARMER SOS ALERT TICKETS */}
      {(distributorTab === 'sos' || distributorTab === 'all') && (
        <section className="tab-section-block">
          <div className="section-title-bar">
            <h2>
              <ShieldAlert size={20} className="icon-red" />
              Yêu Cầu SOS & Hỏi Thuốc Từ Nông Dân Lân Cận
            </h2>
            <span className="count-tag red">{farmerSOSAlerts.length} Yêu cầu cần xử lý</span>
          </div>

          <div className="sos-grid-layout">
            {farmerSOSAlerts.map((sos) => (
              <div key={sos.id} className="sos-ticket-card-expanded">
                <div className="sos-card-header">
                  <div className="sos-farmer-profile">
                    <span className="farmer-avatar-large">{sos.farmerName.charAt(0)}</span>
                    <div>
                      <h3>{sos.farmerName}</h3>
                      <p><MapPin size={13} /> {sos.farmLocation}</p>
                    </div>
                  </div>
                  <span className="sos-time-badge">{sos.time}</span>
                </div>

                <div className="sos-card-body">
                  <div className="sos-meta-pill">
                    <span>Cây trồng: <strong>{sos.crop}</strong></span>
                    <span className="status-tag red">{sos.status}</span>
                  </div>

                  <div className="sos-issue-box">
                    <strong><AlertTriangle size={15} /> Sự cố xảy ra:</strong>
                    <p>{sos.issue}</p>
                  </div>

                  <div className="sos-quote-box">
                    <strong><MessageCircle size={15} /> Lời nhắn trực tiếp đến Đại lý:</strong>
                    <p>"{sos.urgentMsg}"</p>
                  </div>
                </div>

                <div className="sos-card-footer">
                  <button className="dist-quote-btn-large" onClick={() => handleOpenQuote(sos)}>
                    <Send size={16} /> Phản hồi báo giá & Tư vấn có sẵn thuốc
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3 & TAB ALL: REGIONAL STATS & ENVIRONMENT */}
      {(distributorTab === 'stats' || distributorTab === 'all') && (
        <section className="tab-section-block">
          <div className="section-title-bar">
            <h2>
              <LineChart size={20} className="icon-green" />
              Thống Kê Xu Hướng & Môi Trường Nông Nghiệp Vùng
            </h2>
          </div>

          <div className="stats-tab-grid">
            {/* ENVIRONMENT WEATHER WIDGET */}
            <div className="dist-sidebar-panel weather-panel-full">
              <div className="panel-title">
                <ThermometerSun size={20} className="icon-orange" />
                <div>
                  <h3>Thời Tiết & Môi Trường Bến Lức</h3>
                  <p>Yếu tố tác động đến sự phát triển của nấm bệnh & sâu hại trong 24h tới</p>
                </div>
              </div>

              <div className="weather-stats-grid-full">
                <div className="w-stat-card">
                  <Sun size={24} className="icon-orange" />
                  <div>
                    <span className="w-label">Nhiệt độ trung bình</span>
                    <strong className="w-val">31°C</strong>
                  </div>
                </div>
                <div className="w-stat-card">
                  <Droplets size={24} className="icon-red" />
                  <div>
                    <span className="w-label">Độ ẩm không khí</span>
                    <strong className="w-val red-text">89% (Độ ẩm cao)</strong>
                  </div>
                </div>
                <div className="w-stat-card">
                  <CloudRain size={24} className="icon-orange" />
                  <div>
                    <span className="w-label">Xác suất mưa chiều</span>
                    <strong className="w-val orange-text">70% Mưa dầm</strong>
                  </div>
                </div>
                <div className="w-stat-card">
                  <Wifi size={24} className="icon-blue" />
                  <div>
                    <span className="w-label">Độ mặn kênh nội đồng</span>
                    <strong className="w-val blue-text">1.2‰ (Thạnh Phú)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* TOP SELLING SUPPLIES IN REGION */}
            <div className="dist-sidebar-panel top-seller-panel-full">
              <div className="panel-title">
                <Sparkles size={20} className="icon-green" />
                <div>
                  <h3>Top 3 Vật Tư Bán Chạy Nhất Tuần Vùng</h3>
                  <p>Các loại thuốc & phân bón được bà con nông dân địa phương mua nhiều nhất</p>
                </div>
              </div>

              <ol className="top-sellers-list-full">
                <li>
                  <span className="rank-badge gold">1</span>
                  <div className="seller-info">
                    <strong>Nano Đồng Bạc 500ml (GreenCare)</strong>
                    <span>Chuyên đặc trị nấm lá, thán thư chanh & khóm · 142 chai đã bán</span>
                  </div>
                  <span className="trend-up-tag">+35% so tuần trước</span>
                </li>
                <li>
                  <span className="rank-badge silver">2</span>
                  <div className="seller-info">
                    <strong>NPK Hữu Cơ Sinh Học 16-16-8</strong>
                    <span>Cân bằng dinh dưỡng đất sau đợt úng mưa · 86 bao đã bán</span>
                  </div>
                  <span className="trend-up-tag">+18% so tuần trước</span>
                </li>
                <li>
                  <span className="rank-badge bronze">3</span>
                  <div className="seller-info">
                    <strong>Humic Mỹ Giải Độc Mặn 1kg</strong>
                    <span>Kích rễ tơ, hạ mặn & rửa phèn kênh rạch · 64 gói đã bán</span>
                  </div>
                  <span className="trend-up-tag">+42% so tuần trước</span>
                </li>
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* MODAL QUOTE FOR FARMER SOS */}
      {quoteModal && (
        <div className="dist-modal-overlay" onClick={() => setQuoteModal(null)}>
          <div className="dist-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="dist-modal-header">
              <h3><MessageCircle size={20} /> Tư Vấn Vật Tư Cho {quoteModal.farmerName}</h3>
              <button onClick={() => setQuoteModal(null)} className="close-btn"><X size={18} /></button>
            </div>

            <div className="dist-modal-body">
              <div className="farmer-summary-box">
                <p><strong>Nông dân:</strong> {quoteModal.farmerName} ({quoteModal.farmLocation})</p>
                <p><strong>Nhu cầu:</strong> {quoteModal.urgentMsg}</p>
              </div>

              <label className="form-label">Nội dung phản hồi từ Đại lý Út Chanh:</label>
              <textarea
                rows={4}
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
              />
            </div>

            <div className="dist-modal-footer">
              <button className="secondary-btn" onClick={() => setQuoteModal(null)}>Hủy</button>
              <button className="primary-btn" onClick={handleSendQuote}>
                <Send size={16} /> Gửi tư vấn & Báo có hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
