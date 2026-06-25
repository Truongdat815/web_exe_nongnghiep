import { useState } from 'react';
import { socialPosts, users } from '../data/mockData';

const urgencyConfig = {
  critical: { label: '🚨 Khẩn cấp', class: 'badge-red', cardClass: 'urgent-critical' },
  high: { label: '⚠️ Cao', class: 'badge-orange', cardClass: 'urgent-high' },
  medium: { label: '⚡ Vừa', class: 'badge-yellow', cardClass: '' },
  low: { label: '✅ Bình thường', class: 'badge-green', cardClass: '' },
};

const roleConfig = {
  farmer: { label: 'Nông dân', color: '#22c55e' },
  distributor: { label: 'Nhà phân phối', color: '#3b82f6' },
  expert: { label: 'Chuyên gia', color: '#f59e0b' },
  admin: { label: 'Admin', color: '#8b5cf6' },
};

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'vừa xong';
  if (h < 24) return `${h} giờ trước`;
  return `${Math.floor(h / 24)} ngày trước`;
}

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const urgency = urgencyConfig[post.urgency] || urgencyConfig.low;
  const roleInfo = roleConfig[post.author.role] || {};

  return (
    <div className={`post-card ${urgency.cardClass}`}>
      {/* Author */}
      <div className="post-author">
        <div className="post-author-avatar" style={{ background: `linear-gradient(135deg, ${roleInfo.color || '#22c55e'}, #f59e0b)` }}>
          {post.author.name.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="post-author-name">{post.author.name}</span>
            <span className="badge" style={{ background: `${roleInfo.color}22`, color: roleInfo.color, border: `1px solid ${roleInfo.color}44`, fontSize: 10 }}>
              {roleInfo.label}
            </span>
            <span className={`badge ${urgency.class}`} style={{ fontSize: 10 }}>{urgency.label}</span>
          </div>
          <div className="post-author-meta">
            📍 {post.author.location} · {timeAgo(post.timestamp)} · ⭐ {post.author.trustScore}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="post-content">{post.content}</div>

      {/* Tags */}
      <div className="post-tags">
        {post.tags.map(tag => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
        {post.crop && <span className="tag" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--color-accent)' }}>🌿 {post.crop}</span>}
        {post.region && <span className="tag" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--color-info)' }}>📍 {post.region}</span>}
      </div>

      {/* AI Response */}
      {post.aiSuggested && post.aiResponse && (
        <div className="ai-response-box">
          <div className="ai-response-header">
            🤖 AI AgriVision phân tích:
            <span style={{ marginLeft: 'auto', fontWeight: 700 }}>{post.aiResponse.confidence}% độ chính xác</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, marginBottom: 4 }}>
            📋 {post.aiResponse.disease}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            💊 {post.aiResponse.treatment}
          </div>
        </div>
      )}

      {post.aiSuggested && !post.aiResponse && (
        <div className="ai-response-box">
          <div className="ai-response-header">🤖 AI đã xác nhận và lan truyền cảnh báo đến 1,240 nông dân trong vùng</div>
        </div>
      )}

      {/* Actions */}
      <div className="post-actions">
        <button className="post-action-btn" onClick={() => setLiked(!liked)} style={{ color: liked ? 'var(--color-danger)' : '' }}>
          {liked ? '❤️' : '🤍'} {post.likes + (liked ? 1 : 0)} Hữu ích
        </button>
        <button className="post-action-btn">💬 {post.comments} Bình luận</button>
        <button className="post-action-btn">🔔 Theo dõi</button>
        <button className="post-action-btn">📤 Chia sẻ</button>
        {post.urgency === 'critical' || post.urgency === 'high' ? (
          <button className="post-action-btn" style={{ marginLeft: 'auto', color: 'var(--color-danger)' }}>
            🚨 Báo cáo khẩn
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function SocialPage() {
  const [filter, setFilter] = useState('all');
  const [showCompose, setShowCompose] = useState(false);
  const [newPost, setNewPost] = useState('');

  const filters = [
    { key: 'all', label: '🌐 Tất cả' },
    { key: 'critical', label: '🚨 Khẩn cấp' },
    { key: 'farmer', label: '🌾 Nông dân' },
    { key: 'expert', label: '🎓 Chuyên gia' },
    { key: 'distributor', label: '🏭 Phân phối' },
  ];

  const filteredPosts = socialPosts.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'critical') return p.urgency === 'critical' || p.urgency === 'high';
    return p.author.role === filter;
  });

  return (
    <div className="page-container animate-slide-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 className="page-title"><span className="icon">💬</span> Diễn đàn Tri thức Nông nghiệp</h2>
            <p className="page-description">Kết nối nông dân, chuyên gia và nhà phân phối toàn Đông Nam Á</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCompose(!showCompose)}>
            ✏️ Đăng bài
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Feed */}
        <div>
          {/* Compose */}
          {showCompose && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                ✏️ Đăng bài mới
              </div>
              <textarea
                className="form-input"
                placeholder="Mô tả tình trạng vườn, đặt câu hỏi, chia sẻ kinh nghiệm... (AI sẽ tự động phân tích và phân loại)"
                rows={4}
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                style={{ resize: 'vertical', marginBottom: 12 }}
              />
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <button className="btn btn-secondary btn-sm">📷 Thêm ảnh</button>
                <button className="btn btn-secondary btn-sm">🏷️ Gắn thẻ cây</button>
                <button className="btn btn-secondary btn-sm">📍 Địa điểm</button>
                <button className="btn btn-secondary btn-sm">🔬 Hỏi AI</button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" disabled={!newPost.trim()}>🚀 Đăng bài</button>
                <button className="btn btn-secondary" onClick={() => setShowCompose(false)}>Hủy</button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="tabs" style={{ marginBottom: 20, width: '100%' }}>
            {filters.map(f => (
              <button key={f.key} className={`tab-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Posts */}
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Sidebar */}
        <div>
          {/* Trending */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-title" style={{ marginBottom: 12 }}>🔥 Chủ đề nóng hôm nay</div>
            {[
              { topic: 'Rầy nâu Long An', posts: 34, trend: 'up' },
              { topic: 'Giá sầu riêng tháng 6', posts: 28, trend: 'up' },
              { topic: 'Kỹ thuật SRI lúa', posts: 19, trend: 'stable' },
              { topic: 'Phân bón hữu cơ vi sinh', posts: 15, trend: 'up' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>#{t.topic}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-dimmed)' }}>{t.posts} bài đăng</div>
                </div>
                <span style={{ fontSize: 16 }}>{t.trend === 'up' ? '🔥' : '📌'}</span>
              </div>
            ))}
          </div>

          {/* Top Experts */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>🏆 Chuyên gia uy tín</div>
            {users.filter(u => u.role === 'expert' || u.trustScore >= 90).slice(0, 4).map(u => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="user-avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{u.name.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-dimmed)' }}>{u.specialty || u.company || u.location}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-accent)' }}>⭐ {u.trustScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
