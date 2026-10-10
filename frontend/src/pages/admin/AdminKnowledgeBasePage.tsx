import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Database, ArrowLeft, Plus, Trash2, ShieldCheck, Search, Filter,
  CheckCircle2, AlertCircle, Edit3, Globe, UploadCloud, RefreshCw,
  ExternalLink, Eye, ChevronDown, ChevronUp, Sparkles, BookOpen
} from 'lucide-react';
import { apiRequest } from '../../api/client';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

const CATEGORIES = [
  'All',
  'Agriculture & Farming',
  'Dairy & Livestock',
  'Food Processing',
  'Digital Literacy',
  'Digital Marketing',
  'Branding',
  'Finance & Business Management',
  'Business Registration',
  'Government Support',
  'E-Commerce',
  'Customer Service',
  'Handicrafts & Tailoring',
  'Cybersecurity & Online Safety',
  'Entrepreneurship Basics',
  'Women Entrepreneurship',
  'Digital Record Keeping',
  'Rural Business Growth',
];

interface KBItem {
  id: string;
  title: string;
  topic?: string;
  category: string;
  question: string;
  question_en?: string;
  question_hi?: string;
  question_mr?: string;
  answer: string;
  answer_en?: string;
  answer_hi?: string;
  answer_mr?: string;
  language: string;
  tags: string[];
  source: string;
  source_url?: string;
  is_verified: boolean;
  status: 'published' | 'draft';
  embedding_status: 'indexed' | 'pending' | 'failed';
  embedding_error?: string;
  created_at?: string;
  updated_at?: string;
  version?: number;
}

export const AdminKnowledgeBasePage: React.FC = () => {
  const [items, setItems] = useState<KBItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedVerified, setSelectedVerified] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Modals & Forms
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KBItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Alerts
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const initialFormData = {
    title: '',
    category: 'Entrepreneurship Basics',
    language: 'en',
    question: '',
    answer: '',
    question_hi: '',
    answer_hi: '',
    question_mr: '',
    answer_mr: '',
    tags: '',
    source: 'Verified Official Manual',
    source_url: '',
    is_verified: true,
    status: 'published' as 'published' | 'draft',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showMultilingualFields, setShowMultilingualFields] = useState(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchKB = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedLanguage !== 'All') params.append('language', selectedLanguage);
      if (selectedStatus !== 'All') params.append('status', selectedStatus);
      if (selectedVerified !== 'All') params.append('is_verified', selectedVerified);
      params.append('skip', String((currentPage - 1) * pageSize));
      params.append('limit', String(pageSize));

      const res = await apiRequest(`/api/admin/knowledge-base?${params.toString()}`);
      if (res && res.items) {
        setItems(res.items);
        setTotalCount(res.total || res.items.length);
      } else if (Array.isArray(res)) {
        setItems(res);
        setTotalCount(res.length);
      }
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.message || 'Could not load knowledge base entries.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKB();
  }, [searchQuery, selectedCategory, selectedLanguage, selectedStatus, selectedVerified, currentPage]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(initialFormData);
    setShowMultilingualFields(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: KBItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title || item.topic || '',
      category: item.category || 'Entrepreneurship Basics',
      language: item.language || 'en',
      question: item.question || item.question_en || '',
      answer: item.answer || item.answer_en || '',
      question_hi: item.question_hi || '',
      answer_hi: item.answer_hi || '',
      question_mr: item.question_mr || '',
      answer_mr: item.answer_mr || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
      source: item.source || '',
      source_url: item.source_url || '',
      is_verified: item.is_verified,
      status: item.status || 'published',
    });
    setShowMultilingualFields(Boolean(item.question_hi || item.question_mr));
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title.trim(),
      topic: formData.title.trim(),
      category: formData.category,
      language: formData.language,
      question: formData.question.trim(),
      question_en: formData.question.trim(),
      answer: formData.answer.trim(),
      answer_en: formData.answer.trim(),
      question_hi: formData.question_hi.trim() || undefined,
      answer_hi: formData.answer_hi.trim() || undefined,
      question_mr: formData.question_mr.trim() || undefined,
      answer_mr: formData.answer_mr.trim() || undefined,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      source: formData.source.trim(),
      source_url: formData.source_url.trim() || undefined,
      is_verified: formData.is_verified,
      status: formData.status,
    };

    try {
      if (editingItem) {
        await apiRequest(`/api/admin/knowledge-base/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showNotification('success', 'Knowledge entry updated and re-indexed.');
      } else {
        await apiRequest('/api/admin/knowledge-base', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showNotification('success', 'New knowledge entry added and made available to AI.');
      }
      setModalOpen(false);
      fetchKB();
    } catch (err: any) {
      showNotification('error', err.message || 'Operation failed.');
    }
  };

  const handleTogglePublish = async (item: KBItem) => {
    setActionLoadingId(item.id);
    const willPublish = item.status !== 'published';
    try {
      if (willPublish) {
        await apiRequest(`/api/admin/knowledge-base/${item.id}/publish`, { method: 'POST' });
        showNotification('success', `"${item.title}" is now published and retrievable by the AI chatbot.`);
      } else {
        await apiRequest(`/api/admin/knowledge-base/${item.id}/unpublish`, { method: 'POST' });
        showNotification('success', `"${item.title}" unpublished and excluded from AI retrieval.`);
      }
      fetchKB();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update publication status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleVerify = async (item: KBItem) => {
    setActionLoadingId(item.id);
    try {
      await apiRequest(`/api/admin/knowledge-base/${item.id}/verify`, { method: 'POST' });
      showNotification('success', 'Knowledge item verified as reliable source.');
      fetchKB();
    } catch (err: any) {
      showNotification('error', err.message || 'Verification failed.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRetryIndex = async (item: KBItem) => {
    setActionLoadingId(item.id);
    try {
      await apiRequest(`/api/admin/knowledge-base/${item.id}/retry-index`, { method: 'POST' });
      showNotification('success', 'Vector embedding generated and index synchronized.');
      fetchKB();
    } catch (err: any) {
      showNotification('error', err.message || 'Re-indexing failed.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiRequest(`/api/admin/knowledge-base/${id}`, { method: 'DELETE' });
      showNotification('success', 'Knowledge entry deleted and removed from RAG index.');
      setDeleteConfirmId(null);
      fetchKB();
    } catch (err: any) {
      showNotification('error', err.message || 'Could not delete item.');
    }
  };

  // Quick statistics calculated from current dataset
  const stats = useMemo(() => {
    const published = items.filter((i) => i.status === 'published').length;
    const verified = items.filter((i) => i.is_verified).length;
    return {
      total: totalCount || items.length,
      published,
      draft: items.length - published,
      verified,
    };
  }, [items, totalCount]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Back Navigation */}
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Overview</span>
      </Link>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading flex items-center gap-2">
            <span>AI Verified Knowledge Base (RAG)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
              Live Retrieval
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Dynamically add, edit, verify, and publish knowledge entries. Published entries are immediately retrievable by the RuralConnect AI Assistant without redeploying code.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={fetchKB} className="flex items-center gap-1.5">
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button variant="primary" size="sm" onClick={handleOpenAdd} className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add Knowledge Item</span>
          </Button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in duration-150 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600 text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Quick Statistics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Knowledge Base</div>
          <div className="text-2xl font-black text-slate-900">{stats.total}</div>
          <div className="text-[10px] text-slate-500">Core 72 + Dynamic entries</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Published in RAG</div>
          <div className="text-2xl font-black text-emerald-700">{stats.published}</div>
          <div className="text-[10px] text-emerald-600">Active for live AI queries</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Draft Entries</div>
          <div className="text-2xl font-black text-amber-700">{stats.draft}</div>
          <div className="text-[10px] text-amber-600">Excluded from chatbot retrieval</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">Verified Sources</div>
          <div className="text-2xl font-black text-brand-700">{stats.verified}</div>
          <div className="text-[10px] text-brand-600">Anti-hallucination grounded</div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search question, answer, topic, tags, or source..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-brand-600 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-brand-600 focus:outline-none"
            >
              <option value="All">All Languages</option>
              <option value="en">English (en)</option>
              <option value="hi">Hindi (hi)</option>
              <option value="mr">Marathi (mr)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-brand-600 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

        </div>
      </div>

      {/* Knowledge Base Entries List */}
      <div className="space-y-4">
        {items.length === 0 && !isLoading ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No knowledge entries found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or add a new verified question & answer entry.
            </p>
            <Button variant="primary" size="sm" onClick={handleOpenAdd}>
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Add Knowledge Item</span>
            </Button>
          </div>
        ) : (
          items.map((item) => {
            const isExpanded = expandedItemId === item.id;
            const hasMultilingual = Boolean(item.question_hi || item.question_mr || item.answer_hi || item.answer_mr);

            return (
              <div
                key={item.id}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition-all"
              >
                {/* Header Row: Badges & Quick Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="brand">{item.category}</Badge>
                    
                    {/* Status Badge */}
                    {item.status === 'published' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Published</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        <span>Draft</span>
                      </span>
                    )}

                    {/* Verification Badge */}
                    {item.is_verified ? (
                      <Badge variant="verified">VERIFIED SOURCE</Badge>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        <span>Unverified</span>
                      </span>
                    )}

                    {/* Indexing Status Badge */}
                    {item.embedding_status === 'indexed' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200" title="Searchable via RAG vector index">
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                        <span>Indexed</span>
                      </span>
                    ) : item.embedding_status === 'failed' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                        <AlertCircle className="w-3 h-3 text-red-500" />
                        <span>Index Failed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200">
                        <span>Pending Index</span>
                      </span>
                    )}
                  </div>

                  {/* Actions Dropdown / Buttons */}
                  <div className="flex items-center gap-1.5">
                    {/* Verify Button (if unverified) */}
                    {!item.is_verified && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerify(item)}
                        disabled={actionLoadingId === item.id}
                        className="text-xs text-emerald-700 hover:bg-emerald-50"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                        <span>Verify</span>
                      </Button>
                    )}

                    {/* Publish / Unpublish Toggle */}
                    <Button
                      variant={item.status === 'published' ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleTogglePublish(item)}
                      disabled={actionLoadingId === item.id}
                      className="text-xs"
                    >
                      {item.status === 'published' ? 'Unpublish' : 'Publish'}
                    </Button>

                    {/* Retry Indexing Button */}
                    {item.embedding_status !== 'indexed' && item.status === 'published' && (
                      <button
                        title="Retry Indexing"
                        onClick={() => handleRetryIndex(item)}
                        disabled={actionLoadingId === item.id}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                      >
                        <UploadCloud className="w-4 h-4" />
                      </button>
                    )}

                    {/* Edit Button */}
                    <button
                      title="Edit Entry"
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      title="Delete Entry"
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question */}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    <span className="text-brand-700 mr-1.5 font-black">Q:</span>
                    {item.question || item.question_en}
                  </h3>
                </div>

                {/* Primary Answer */}
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="font-black text-slate-400 block mb-1 uppercase tracking-wider text-[10px]">
                    Verified Guidance
                  </span>
                  <p className="whitespace-pre-line">{item.answer || item.answer_en}</p>
                </div>

                {/* Multilingual Preview Toggle (if Hindi or Marathi exist) */}
                {hasMultilingual && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                    >
                      <Globe className="w-3 h-3" />
                      <span>{isExpanded ? 'Hide translations' : 'Show Hindi & Marathi translations'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {item.question_hi && (
                          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 space-y-1">
                            <span className="text-[10px] font-bold text-amber-900 uppercase">हिन्दी (Hindi)</span>
                            <p className="font-semibold text-slate-900">{item.question_hi}</p>
                            <p className="text-slate-700 whitespace-pre-line text-[11px]">{item.answer_hi}</p>
                          </div>
                        )}
                        {item.question_mr && (
                          <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100 space-y-1">
                            <span className="text-[10px] font-bold text-orange-900 uppercase">मराठी (Marathi)</span>
                            <p className="font-semibold text-slate-900">{item.question_mr}</p>
                            <p className="text-slate-700 whitespace-pre-line text-[11px]">{item.answer_mr}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Source & Metadata Footer */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                  <div className="flex items-center gap-2">
                    <span>
                      Source: <strong>{item.source}</strong>
                    </span>
                    {item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-0.5 text-brand-700 hover:underline font-semibold"
                      >
                        <span>Link</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span>ID: {item.id}</span>
                    {item.updated_at && (
                      <span>Updated: {new Date(item.updated_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalCount > pageSize && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
          <span className="text-slate-500">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage * pageSize >= totalCount}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add / Edit Entry Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Knowledge Base Entry' : 'Add Verified Knowledge Entry'}
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Topic / Title *
              </label>
              <input
                type="text"
                required
                placeholder="E.g., Soil Health Card Benefits"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-brand-600 focus:outline-none"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Primary Question / Prompt (English) *
            </label>
            <input
              type="text"
              required
              placeholder="E.g., How can a rural entrepreneur apply for a Soil Health Card?"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Verified Guidance / Answer (English) *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Provide complete, factual, beginner-friendly instructions..."
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          {/* Multilingual Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowMultilingualFields(!showMultilingualFields)}
              className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{showMultilingualFields ? 'Hide Hindi / Marathi options' : '+ Add Hindi and Marathi translations'}</span>
            </button>
          </div>

          {showMultilingualFields && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
              <span className="font-bold text-slate-700 block">Multilingual Q&A (Optional)</span>
              
              <div className="space-y-2">
                <label className="font-semibold text-slate-600">Hindi Question & Answer / हिन्दी प्रश्न आणि उत्तर</label>
                <input
                  type="text"
                  placeholder="हिन्दी में प्रश्न..."
                  value={formData.question_hi}
                  onChange={(e) => setFormData({ ...formData, question_hi: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
                <textarea
                  rows={2}
                  placeholder="हिन्दी में उत्तर..."
                  value={formData.answer_hi}
                  onChange={(e) => setFormData({ ...formData, answer_hi: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="font-semibold text-slate-600">Marathi Question & Answer / मराठी प्रश्न आणि उत्तर</label>
                <input
                  type="text"
                  placeholder="मराठीत प्रश्न..."
                  value={formData.question_mr}
                  onChange={(e) => setFormData({ ...formData, question_mr: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
                <textarea
                  rows={2}
                  placeholder="मराठीत उत्तर..."
                  value={formData.answer_mr}
                  onChange={(e) => setFormData({ ...formData, answer_mr: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Source Citation *
              </label>
              <input
                type="text"
                required
                placeholder="E.g., Ministry of Agriculture, Govt of India"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Source URL or Doc Link (Optional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.source_url}
                onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Search Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="soil, testing, agriculture, farming"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_verified}
                onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span>Mark as Verified Source</span>
            </label>

            <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.status === 'published'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.checked ? 'published' : 'draft',
                  })
                }
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span>Publish into Live RAG Index</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingItem ? 'Save Changes' : 'Create Knowledge Item'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Knowledge Base Entry"
        maxWidth="md"
      >
        <div className="space-y-4 py-2">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete this verified knowledge item?
            This will immediately remove it from the AI Assistant retrieval index.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
