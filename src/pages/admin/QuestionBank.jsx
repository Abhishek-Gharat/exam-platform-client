import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Plus, Upload, Edit, Trash2 } from 'lucide-react';
import { questionsAPI } from '../../api/questionsAPI';
import { QUESTION_TYPES } from '../../constants/questionTypes';
import { DIFFICULTY_LIST } from '../../constants/difficulty';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/ui/SearchBar';
import Spinner from '../../components/ui/Spinner';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import QuestionForm from '../../components/admin/QuestionForm';
import BulkImport from '../../components/admin/BulkImport';
import toast from 'react-hot-toast';

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [diffFilter, setDiffFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const handleTypeFilter = useCallback((val) => {
    setTypeFilter(val);
    setPage(1);
  }, []);

  const handleDiffFilter = useCallback((val) => {
    setDiffFilter(val);
    setPage(1);
  }, []);

  const abortRef = useRef(null);

  const load = useCallback(async (isInitial = false) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    if (isInitial) setInitialLoading(true);
    setFetching(true);
    try {
      const r = await questionsAPI.getQuestions(
        { search: debouncedSearch, type: typeFilter, difficulty: diffFilter, page },
        { signal: abortRef.current.signal }
      );
      setQuestions(r.data.questions || []);
      setTotalPages(r.data.totalPages || 1);
    } catch (err) {
      if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') return;
      toast.error('Failed to load questions');
    } finally {
      setInitialLoading(false);
      setFetching(false);
    }
  }, [debouncedSearch, typeFilter, diffFilter, page]);

  useEffect(() => {
    load(questions.length === 0);
  }, [debouncedSearch, typeFilter, diffFilter, page]);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editData) {
        await questionsAPI.updateQuestion(editData.id, data);
        toast.success('Question updated');
      } else {
        await questionsAPI.createQuestion(data);
        toast.success('Question created');
      }
      setShowForm(false);
      setEditData(null);
      load();
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await questionsAPI.deleteQuestion(deleteId);
      toast.success('Question deleted');
      setDeleteId(null);
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const typeBadge = (type) =>
    type === 'MCQ' ? 'mcq' : type === 'EXPLAIN_ME' ? 'explain' : 'code';

  return (
    <PageWrapper
      title="Question Bank"
      subtitle="Manage exam questions"
      actions={
        <>
          <Button variant="secondary" size="sm" onClick={() => setShowBulk(true)} leftIcon={<Upload size={14} />}>
            Bulk Import
          </Button>
          <Button size="sm" onClick={() => { setEditData(null); setShowForm(true); }} leftIcon={<Plus size={14} />}>
            Add Question
          </Button>
        </>
      }
    >
      {/* Compact single-row filters */}
      <div className="flex items-center gap-2 mb-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search questions..."
          className="flex-1 min-w-0"
        />
        <select
          value={typeFilter}
          onChange={(e) => handleTypeFilter(e.target.value)}
          className="exp-input rounded-lg text-xs py-2 px-3 w-auto min-w-[120px]"
        >
          <option value="">All Types</option>
          {Object.entries(QUESTION_TYPES).map(([k, v]) => (
            <option key={k} value={v}>{v}</option>
          ))}
        </select>
        <select
          value={diffFilter}
          onChange={(e) => handleDiffFilter(e.target.value)}
          className="exp-input rounded-lg text-xs py-2 px-3 w-auto min-w-[130px]"
        >
          <option value="">All Difficulties</option>
          {DIFFICULTY_LIST.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      {initialLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : questions.length === 0 && !fetching ? (
        <EmptyState
          title="No questions found"
          description="Create your first question."
          actionLabel="Add Question"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="relative exp-card exp-card-flat overflow-hidden">
          {/* Lightweight transition overlay */}
          {fetching && (
            <div className="absolute inset-0 z-10 bg-white/50 dark:bg-slate-950/50 flex items-center justify-center">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-surface-800 shadow-md border border-gray-200 dark:border-gray-700">
                <Spinner size="sm" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Loading...</span>
              </div>
            </div>
          )}

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
            {questions.map((q, idx) => (
              <div key={q.id} className="px-3 py-2.5 space-y-1.5 animate-fade-up" style={{ animationDelay: `${idx * 30}ms` }}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1 flex-1">{q.title}</h3>
                  <span className="text-xs text-gray-500 flex-shrink-0">{q.points}pts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant={typeBadge(q.type)} size="sm">{q.type}</Badge>
                  <Badge variant={q.difficulty.toLowerCase()} size="sm">{q.difficulty}</Badge>
                  <span className="text-xs text-gray-400 ml-1">{q.topic}</span>
                </div>
                <div className="flex gap-1 pt-1">
                  <Button variant="ghost" size="sm" onClick={() => { setEditData(q); setShowForm(true); }} leftIcon={<Edit size={12} />}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(q.id)} leftIcon={<Trash2 size={12} />} className="text-danger-600">Delete</Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary-200/30 dark:border-primary-900/30 bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-950/20 dark:to-primary-900/10">
                  <th className="text-left py-2 px-3 font-semibold text-xs text-gray-700 dark:text-gray-300">Title</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs text-gray-700 dark:text-gray-300 w-24">Type</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs text-gray-700 dark:text-gray-300 w-32">Topic</th>
                  <th className="text-left py-2 px-3 font-semibold text-xs text-gray-700 dark:text-gray-300 w-24">Difficulty</th>
                  <th className="text-center py-2 px-3 font-semibold text-xs text-gray-700 dark:text-gray-300 w-16">Pts</th>
                  <th className="text-right py-2 px-3 font-semibold text-xs text-gray-700 dark:text-gray-300 w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, idx) => (
                  <tr
                    key={q.id}
                    style={{ animationDelay: `${idx * 30}ms` }}
                    className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-primary-50/40 dark:hover:bg-primary-950/10 transition-colors animate-fade-up"
                  >
                    <td className="py-1.5 px-3">
                      <span className="font-medium text-xs text-gray-900 dark:text-white line-clamp-1">{q.title}</span>
                    </td>
                    <td className="py-1.5 px-3">
                      <Badge variant={typeBadge(q.type)} size="sm">{q.type}</Badge>
                    </td>
                    <td className="py-1.5 px-3 text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{q.topic}</td>
                    <td className="py-1.5 px-3">
                      <Badge variant={q.difficulty.toLowerCase()} size="sm">{q.difficulty}</Badge>
                    </td>
                    <td className="py-1.5 px-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">{q.points}</td>
                    <td className="py-1.5 px-3">
                      <div className="flex gap-0.5 justify-end">
                        <button
                          onClick={() => { setEditData(q); setShowForm(true); }}
                          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-primary-600 transition-colors"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(q.id)}
                          className="p-1.5 rounded-md hover:bg-danger-50 dark:hover:bg-danger-900/20 text-gray-500 hover:text-danger-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-surface-900/30">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </div>

          {/* Mobile Pagination */}
          <div className="md:hidden px-3 py-2 border-t border-gray-100 dark:border-gray-800/50">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditData(null); }} title={editData ? 'Edit Question' : 'Add Question'} size="lg">
        <QuestionForm initialData={editData} onSave={handleSave} onCancel={() => { setShowForm(false); setEditData(null); }} loading={saving} />
      </Modal>
      <Modal isOpen={showBulk} onClose={() => setShowBulk(false)} title="Bulk Import Questions" size="md">
        <BulkImport onClose={() => setShowBulk(false)} onSuccess={load} />
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Question?" message="This will permanently remove the question." />
    </PageWrapper>
  );
};

export default QuestionBank;