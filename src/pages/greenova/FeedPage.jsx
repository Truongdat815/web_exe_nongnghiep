import { useState } from 'react';
import {
  AlertTriangle,
  Bot,
  Camera,
  ClipboardList,
  FileCheck2,
  Heart,
  Image as ImageIcon,
  MoreHorizontal,
  QrCode,
  MessageCircle,
  Send,
  Share2,
  Smile,
  Sprout,
} from 'lucide-react';
import { roles } from '../../data/greenovaData';

export function FeedPage({ state, setState, role, notify }) {
  const account = roles.find((item) => item.id === role);
  const [content, setContent] = useState('');
  const [tagText, setTagText] = useState(role === 'expert' ? 'Cảnh báo dịch, Bến Lức' : 'Chanh không hạt, Hỏi đáp');
  const [commentDrafts, setCommentDrafts] = useState({});
  const [feedFilter, setFeedFilter] = useState('all');

  const visiblePosts = (state.feedPosts || []).filter((post) => {
    if (feedFilter === 'all') return true;
    if (feedFilter === 'question') return post.type === 'question';
    if (feedFilter === 'alert') return post.type === 'alert' || post.type === 'guide';
    return post.tags.some((tag) => tag.toLowerCase().includes(feedFilter.toLowerCase()));
  });

  const createPost = () => {
    const cleanContent = content.trim();
    if (!cleanContent) {
      notify('Bạn nhập nội dung bài viết trước đã nha.');
      return;
    }
    const tags = tagText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 4);

    setState((prev) => ({
      ...prev,
      feedPosts: [
        {
          id: `POST-${Date.now()}`,
          authorRole: role,
          authorName: account.accountName,
          authorTitle: role === 'expert' ? 'Kỹ sư nông nghiệp' : 'Nông dân',
          location: account.location,
          content: cleanContent,
          tags,
          type: role === 'expert' ? 'alert' : 'question',
          mediaTitle: tags[0] || 'Bài đăng GREENOVA',
          mediaTone: role === 'expert' ? 'guide' : 'field',
          likes: 0,
          comments: [],
          createdAt: new Date().toISOString(),
        },
        ...(prev.feedPosts || []),
      ],
    }));
    setContent('');
    notify('Đã đăng bài lên Bảng tin.');
  };

  const likePost = (postId) => {
    setState((prev) => ({
      ...prev,
      feedPosts: prev.feedPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    }));
    notify('Đã đánh dấu bài viết là hữu ích.');
  };

  const addComment = (postId) => {
    const cleanContent = (commentDrafts[postId] || '').trim();
    if (!cleanContent) {
      notify('Bạn nhập bình luận trước đã nha.');
      return;
    }
    setState((prev) => ({
      ...prev,
      feedPosts: prev.feedPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: `CMT-${Date.now()}`,
                  authorName: account.accountName,
                  authorRole: role,
                  content: cleanContent,
                },
              ],
            }
          : post,
      ),
    }));
    setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
    notify('Đã thêm bình luận.');
  };

  const seedComposer = (kind) => {
    const presets = {
      photo: {
        content: 'Mình vừa chụp ảnh vườn sáng nay. Lá ở hàng gần mương có vài đốm lạ, nhờ mọi người xem giúp.',
        tags: 'Ảnh vườn, Chanh không hạt, Bến Lức',
      },
      symptom: {
        content: 'Triệu chứng: lá vàng nhẹ từ mép vào, xuất hiện sau mưa lớn 2 ngày. Độ ẩm không khí đang trên 85%.',
        tags: 'Triệu chứng, Nấm lá, IoT',
      },
      mood: {
        content: 'Hôm nay hệ thống IoT báo van tưới tự bật đúng lúc đất xuống 38%. Demo này thấy khá sát nhu cầu thực tế.',
        tags: 'Cảm nhận, IoT tưới tự động',
      },
    };
    setContent(presets[kind].content);
    setTagText(presets[kind].tags);
    notify('Đã điền nội dung mẫu vào ô đăng bài.');
  };

  const sharePost = async (post) => {
    const text = `${post.authorName}: ${post.content}`;
    try {
      await navigator.clipboard.writeText(text);
      notify('Đã copy nội dung bài viết để chia sẻ.');
    } catch {
      notify('Đã tạo hành động chia sẻ demo.');
    }
  };

  const openPostMenu = (post) => {
    notify(`Menu bài viết: đã lưu "${post.mediaTitle || post.tags[0]}" vào danh sách theo dõi demo.`);
  };

  return (
    <section className="facebook-feed">
      <aside className="fb-left-rail">
        <div className="fb-profile-mini">
          <div className="fb-avatar big">{account.accountName.charAt(0)}</div>
          <div>
            <strong>{account.accountName}</strong>
            <span>{role === 'expert' ? 'Kỹ sư nông nghiệp' : 'Nông dân'} tại {account.location}</span>
          </div>
        </div>
        {[
          ['Cộng đồng Bến Lức', Sprout],
          ['Ca bệnh đang theo dõi', ClipboardList],
          ['Cảnh báo dịch tễ', AlertTriangle],
          ['Kho bài viết kỹ thuật', FileCheck2],
          ['Nhật ký đã chia sẻ', QrCode],
        ].map(([label, Icon]) => (
          <button
            key={label}
            className="fb-left-link"
            onClick={() => {
              if (label.includes('Ca bệnh')) setFeedFilter('question');
              else if (label.includes('Cảnh báo')) setFeedFilter('alert');
              else if (label.includes('Nhật ký')) setFeedFilter('QR');
              else setFeedFilter('all');
              notify(`Đã lọc Bảng tin theo: ${label}.`);
            }}
          >
            <Icon size={20} /> {label}
          </button>
        ))}
      </aside>

      <main className="fb-center-feed">
        <div className="fb-stories">
          {[
            ['Vườn chanh', 'Độ ẩm thấp, van đã bật'],
            ['Khóm ven kênh', 'Cần kiểm tra lá vàng'],
            ['Kỹ sư Khoa', 'Mẹo phòng nấm lá'],
          ].map(([title, desc]) => (
            <article key={title} className="fb-story-card">
              <div className="fb-story-avatar">{title.charAt(0)}</div>
              <strong>{title}</strong>
              <span>{desc}</span>
            </article>
          ))}
        </div>

        <article className="fb-composer">
          <div className="fb-composer-top">
            <div className="fb-avatar">{account.accountName.charAt(0)}</div>
            <button className="fb-input-pill" onClick={() => document.getElementById('feed-post-box')?.focus()}>
              {role === 'expert' ? 'Chia sẻ cảnh báo hoặc hướng dẫn kỹ thuật...' : 'Bạn đang nghĩ gì về vườn hôm nay?'}
            </button>
          </div>
          <textarea
            id="feed-post-box"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={
              role === 'expert'
                ? 'Ví dụ: Bà con trồng chanh ở Bến Lức nên kiểm tra mặt dưới lá sau mưa...'
                : 'Ví dụ: Lá chanh có đốm vàng sau 3 ngày mưa, mình nên xử lý sao?'
            }
            rows={3}
          />
          <input
            className="fb-tag-input"
            value={tagText}
            onChange={(event) => setTagText(event.target.value)}
            placeholder="Tag, cách nhau bằng dấu phẩy"
          />
          <div className="fb-composer-actions">
            <button onClick={() => seedComposer('photo')}><Camera size={19} /> Ảnh vườn</button>
            <button onClick={() => seedComposer('symptom')}><ImageIcon size={19} /> Triệu chứng</button>
            <button onClick={() => seedComposer('mood')}><Smile size={19} /> Cảm nhận</button>
            <button className="fb-post-button" onClick={createPost}><Send size={16} /> Đăng</button>
          </div>
        </article>

        <div className="fb-post-list">
          {visiblePosts.map((post) => {
            const PostIcon = post.authorRole === 'expert' ? Bot : Sprout;
            return (
              <article key={post.id} className="fb-post-card">
                <header className="fb-post-header">
                  <div className={`fb-avatar ${post.authorRole}`}>
                    <PostIcon size={18} />
                  </div>
                  <div>
                    <strong>{post.authorName}</strong>
                    <span>{post.authorTitle} · {post.location}</span>
                    <small>{new Date(post.createdAt).toLocaleString('vi-VN')} · Công khai</small>
                  </div>
                  <button className="fb-icon-plain" onClick={() => openPostMenu(post)}><MoreHorizontal size={20} /></button>
                </header>

                <p className="fb-post-content">{post.content}</p>
                <div className="fb-tags">
                  {post.tags.map((tag) => <span key={tag}>#{tag}</span>)}
                </div>

                <div className={`fb-post-media ${post.authorRole} ${post.mediaTone || ''}`}>
                  <div>
                    <span>{post.type === 'alert' ? 'Cảnh báo kỹ thuật' : post.type === 'guide' ? 'Hướng dẫn kỹ thuật' : 'Ảnh vườn mô phỏng'}</span>
                    <strong>{post.mediaTitle || post.tags[0] || 'GREENOVA Field'}</strong>
                  </div>
                </div>

                <div className="fb-social-counts">
                  <span><Heart size={14} /> {post.likes} người thấy hữu ích</span>
                  <span>{post.comments.length} bình luận</span>
                </div>

                <div className="fb-post-actions">
                  <button onClick={() => likePost(post.id)}><Heart size={18} /> Hữu ích</button>
                  <button onClick={() => document.getElementById(`comment-${post.id}`)?.focus()}><MessageCircle size={18} /> Bình luận</button>
                  <button onClick={() => sharePost(post)}><Share2 size={18} /> Chia sẻ</button>
                </div>

                <div className="fb-comment-list">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="fb-comment-item">
                      <div className={`fb-comment-avatar ${comment.authorRole}`}>
                        {comment.authorName.charAt(0)}
                      </div>
                      <p>
                        <strong>{comment.authorName}</strong>
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="fb-comment-box">
                  <div className="fb-comment-avatar">{account.accountName.charAt(0)}</div>
                  <input
                    id={`comment-${post.id}`}
                    value={commentDrafts[post.id] || ''}
                    onChange={(event) =>
                      setCommentDrafts((prev) => ({ ...prev, [post.id]: event.target.value }))
                    }
                    placeholder="Viết bình luận..."
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') addComment(post.id);
                    }}
                  />
                  <button onClick={() => addComment(post.id)}>
                    <Send size={15} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      <aside className="fb-right-rail">
        <article className="fb-side-card">
          <div className="fb-side-title">
            <strong>Chủ đề nổi bật</strong>
            <MessageCircle size={18} />
          </div>
          {['Chanh không hạt', 'Nấm lá', 'IoT tưới tự động', 'Escrow vật tư', 'Khóm Bến Lức'].map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setFeedFilter(topic);
                notify(`Đã lọc bài theo chủ đề #${topic}.`);
              }}
            >
              #{topic}
            </button>
          ))}
        </article>
        <article className="fb-side-card">
          <div className="fb-side-title">
            <strong>Kỹ sư đang hoạt động</strong>
            <span className="online-dot" />
          </div>
          {['KS. Nguyễn Minh Khoa', 'ThS. Lê Thu Hà', 'Trạm BVTV Long An'].map((name) => (
            <button
              key={name}
              className="fb-contact"
              onClick={() => notify(`Đã mở chat demo với ${name}.`)}
            >
              <div className="fb-contact-avatar">{name.charAt(0)}</div>
              <span>{name}</span>
            </button>
          ))}
        </article>
        <article className="fb-side-card">
          <div className="fb-side-title"><strong>Gợi ý đăng bài</strong></div>
          <p className="feed-rule">
            Ghi rõ cây trồng, vị trí, triệu chứng, thời điểm phát hiện và chỉ số IoT nếu có.
          </p>
        </article>
      </aside>
    </section>
  );
}
