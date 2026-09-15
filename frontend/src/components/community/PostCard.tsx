import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { CommunityPost } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { apiRequest } from '../../api/client';
import { useAuthStore } from '../../store/authStore';

interface PostCardProps {
  post: CommunityPost;
  onPostUpdated?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdated }) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    const previousState = isLiked;
    const previousCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      const res = await apiRequest(`/api/community/posts/${post.id}/like`, { method: 'POST' });
      setIsLiked(res.is_liked);
      setLikesCount(res.likes_count);
    } catch {
      setIsLiked(previousState);
      setLikesCount(previousCount);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const created = await apiRequest(`/api/community/posts/${post.id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: newComment.trim() }),
      });
      setComments([...comments, created]);
      setNewComment('');
      if (onPostUpdated) onPostUpdated();
    } catch {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
      
      {/* Post author header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={post.avatar}
            alt={post.user_name}
            className="w-11 h-11 rounded-full object-cover border-2 border-brand-500"
          />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{post.user_name}</h4>
            <p className="text-xs text-slate-500">{post.user_business}</p>
          </div>
        </div>
        <Badge variant="saffron" size="sm">
          {post.category}
        </Badge>
      </div>

      {/* Content */}
      <p className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line">
        {post.content}
      </p>

      {/* Attached image if available */}
      {post.image_url && (
        <div className="rounded-xl overflow-hidden border border-slate-100 max-h-96">
          <img
            src={post.image_url}
            alt="Post media"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Interaction Buttons (Like, Comment, Share) */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 font-bold transition-colors ${
              isLiked ? 'text-red-600' : 'text-slate-600 hover:text-red-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount} Likes</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-brand-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{comments.length} Comments</span>
          </button>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Post link copied!');
          }}
          className="flex items-center gap-1 hover:text-slate-800"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No comments yet. Be the first to encourage!</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-slate-900">{c.user_name}: </span>
                  <span className="text-slate-700">{c.content}</span>
                </div>
              ))
            )}
          </div>

          {user && (
            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write an encouraging reply..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
              <Button size="sm" variant="primary" type="submit" isLoading={isSubmitting}>
                <Send className="w-3 h-3" />
              </Button>
            </form>
          )}
        </div>
      )}

    </div>
  );
};
