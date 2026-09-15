import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HeartHandshake, Plus, Image as ImageIcon, Send, Sparkles } from 'lucide-react';
import { CommunityPost } from '../types';
import { apiRequest } from '../api/client';
import { PostCard } from '../components/community/PostCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { useAuthStore } from '../store/authStore';

export const CommunityPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Discussion');
  const [newPostImage, setNewPostImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await apiRequest('/api/community/posts');
      setPosts(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await apiRequest('/api/community/posts', {
        method: 'POST',
        body: JSON.stringify({
          content: newPostContent.trim(),
          category: newPostCategory,
          image_url: newPostImage.trim() || null,
        }),
      });
      setNewPostContent('');
      setNewPostImage('');
      setCreateModalOpen(false);
      fetchPosts();
    } catch {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="brand">{t('community.title', 'Entrepreneur Community')}</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
          Connect, Share & Grow Together
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {t(
            'community.subtitle',
            'Share your products, celebrate milestones, ask questions, and grow together.'
          )}
        </p>

        <div className="pt-2 flex justify-center">
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              if (!user) window.location.href = '/login';
              else setCreateModalOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('community.newPost', 'Create Post')}</span>
          </Button>
        </div>
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>{t('common.loading', 'Loading community updates...')}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
          No community posts yet. Be the first to share an update!
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onPostUpdated={fetchPosts} />
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Share with RuralConnect Community"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Category
            </label>
            <select
              value={newPostCategory}
              onChange={(e) => setNewPostCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none bg-white"
            >
              <option value="Discussion">General Discussion / चर्चा</option>
              <option value="Success Story">Success Story / यशोगाथा</option>
              <option value="Product Showcase">Product Showcase / उत्पादन प्रदर्शन</option>
              <option value="Question">Question / प्रश्न</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Your Message / तुमचा संदेश *
            </label>
            <textarea
              rows={4}
              required
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Tell other entrepreneurs about your craft, new orders, or questions..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Product Photo URL (Optional)
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="url"
                value={newPostImage}
                onChange={(e) => setNewPostImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              {t('community.post', 'Post Update')}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
