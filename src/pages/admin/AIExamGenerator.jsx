import { useState } from 'react';
import { Sparkles, Brain, Code2, MessageSquare, BookOpen, Zap, Clock, Target, ChevronDown, Loader2 } from 'lucide-react';
import aiAPI from '../../api/aiAPI';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const TOPICS = [
  'JavaScript Basics',
  'Variables & Data Types',
  'Functions & Scope',
  'Arrays & Array Methods',
  'Objects & Prototypes',
  'ES6+ Features',
  'Promises & Async/Await',
  'DOM Manipulation',
  'Event Handling',
  'Error Handling',
  'Closures',
  'Higher-Order Functions',
  'Regular Expressions',
  'Classes & OOP',
  'Modules (import/export)',
  'REST APIs & Fetch',
  'Node.js Basics',
  'React Fundamentals',
  'TypeScript Basics',
  'Data Structures in JS',
];

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

export default function AIExamGenerator() {
  const [topic, setTopic] = useState('JavaScript Basics');
  const [customTopic, setCustomTopic] = useState('');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [mcqCount, setMcqCount] = useState(5);
  const [codeCount, setCodeCount] = useState(0);
  const [explainCount, setExplainCount] = useState(0);
  const [timeLimit, setTimeLimit] = useState(30);
  const [passingScore, setPassingScore] = useState(70);
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');

  // Changed: separate loading tracker instead of single boolean
  const [loadingAction, setLoadingAction] = useState(null); // null | 'preview' | 'generate'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewQuestions, setPreviewQuestions] = useState(null);
  const [generatedExam, setGeneratedExam] = useState(null);

  const activeTopic = topic === 'Custom' ? customTopic : topic;
  const totalQuestions = mcqCount + codeCount + explainCount;
  const isLoading = loadingAction !== null;

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handlePreview = async () => {
    clearMessages();
    if (!activeTopic) { setError('Please select or enter a topic'); return; }
    if (totalQuestions === 0) { setError('Add at least one question'); return; }
    if (totalQuestions > 20) { setError('Maximum 20 questions per generation'); return; }

    setLoadingAction('preview');
    setPreviewQuestions(null);
    setGeneratedExam(null);

    try {
      const res = await aiAPI.generateQuestions({
        topic: activeTopic, difficulty, mcqCount, codeCount, explainCount,
      });
      const data = res.data || res;
      if (data.success) {
        setPreviewQuestions(data.questions);
        setSuccess(`Generated ${data.count} questions! Review them below.`);
      } else {
        setError(data.error || 'Generation failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Generation failed');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGenerateExam = async () => {
    clearMessages();
    if (!activeTopic) { setError('Please select or enter a topic'); return; }
    if (totalQuestions === 0) { setError('Add at least one question'); return; }

    setLoadingAction('generate');
    setPreviewQuestions(null);
    setGeneratedExam(null);

    try {
      const res = await aiAPI.generateExam({
        topic: activeTopic, difficulty, mcqCount, codeCount, explainCount,
        timeLimit: timeLimit * 60, passingScore,
        examTitle: examTitle || undefined,
        examDescription: examDescription || undefined,
      });
      const data = res.data || res;
      if (data.success) {
        setGeneratedExam(data.exam);
        setPreviewQuestions(data.questions);
        setSuccess(`Exam "${data.exam.title}" created with ${data.exam.totalQuestions} questions!`);
      } else {
        setError(data.error || 'Exam creation failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Exam creation failed');
    } finally {
      setLoadingAction(null);
    }
  };

  const renderQuestion = (q, index) => {
    const typeConfig = {
      MCQ: { gradient: 'from-primary-500 to-primary-600', icon: <BookOpen size={12} />, label: 'MCQ', badgeVariant: 'mcq' },
      WRITE_CODE: { gradient: 'from-warning-500 to-warning-600', icon: <Code2 size={12} />, label: 'Code', badgeVariant: 'code' },
      EXPLAIN_ME: { gradient: 'from-info-500 to-info-600', icon: <MessageSquare size={12} />, label: 'Explain', badgeVariant: 'explain' },
    };
    const tc = typeConfig[q.type] || typeConfig.MCQ;

    return (
      <div
        key={index}
        className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-fade-up"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${tc.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}>
              {index + 1}
            </span>
            <div className="min-w-0">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                {q.title || `Question ${index + 1}`}
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant={tc.badgeVariant} size="sm">{tc.label}</Badge>
            <Badge variant={(q.difficulty || 'medium').toLowerCase()} size="sm">{q.difficulty}</Badge>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
              {q.points}pts
            </span>
          </div>
        </div>

        <div className="px-5 py-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-4">
            {q.content}
          </p>

          {q.type === 'MCQ' && q.options && (
            <div className="space-y-2 mb-4">
              {q.options.map((opt, i) => {
                const label = opt.label || ['A', 'B', 'C', 'D'][i];
                const text = opt.text || opt;
                const isCorrect = q.correct_option === i;
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 transition-all text-sm ${isCorrect
                      ? 'bg-success-50 dark:bg-success-900/15 border-success-300 dark:border-success-700'
                      : 'bg-gray-50 dark:bg-surface-900 border-gray-150 dark:border-gray-800'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${isCorrect
                      ? 'bg-success-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {label}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className={`${isCorrect ? 'text-success-700 dark:text-success-300 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                        {text}
                      </span>
                      {isCorrect && (
                        <span className="ml-2 text-[10px] font-bold text-success-600 dark:text-success-400 uppercase tracking-wider">
                          ✓ Correct
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {q.type === 'WRITE_CODE' && (
            <div className="space-y-3 mb-4">
              {q.starter_code && (
                <div>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Starter Code</p>
                  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <Code2 size={12} className="text-gray-500" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Code</span>
                      <div className="ml-auto flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-danger-400" />
                        <div className="w-2 h-2 rounded-full bg-warning-400" />
                        <div className="w-2 h-2 rounded-full bg-success-400" />
                      </div>
                    </div>
                    <pre className="p-4 overflow-x-auto bg-gray-50 dark:bg-surface-900">
                      <code className="text-xs font-mono text-gray-900 dark:text-gray-100 whitespace-pre">{q.starter_code}</code>
                    </pre>
                  </div>
                </div>
              )}
              {q.options && q.options.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Output Options</p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, i) => {
                      const label = opt.label || ['A', 'B', 'C', 'D'][i];
                      const text = opt.text || opt;
                      const isCorrect = q.correct_option === i;
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${isCorrect
                            ? 'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800'
                            : 'bg-gray-50 dark:bg-gray-800/30'
                          }`}
                        >
                          <span className="font-bold text-gray-500 w-5">{label}.</span>
                          <code className={`font-mono ${isCorrect ? 'text-success-700 dark:text-success-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                            {text}
                          </code>
                          {isCorrect && <span className="ml-auto text-success-500 text-[10px] font-bold">✓</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {q.test_cases && q.test_cases.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Test Cases</p>
                  {q.test_cases.map((tc, ti) => (
                    <div key={ti} className="text-xs bg-gray-50 dark:bg-surface-900 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 mb-1.5">
                      <span className="font-mono font-bold text-gray-500">Input:</span>{' '}
                      <code className="text-info-600 dark:text-info-400">{tc.input}</code>
                      <span className="ml-3 font-mono font-bold text-gray-500">→</span>{' '}
                      <code className="text-success-600 dark:text-success-400">{tc.expected_output}</code>
                    </div>
                  ))}
                </div>
              )}
              {q.model_answer && (
                <div>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Model Answer</p>
                  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <pre className="p-4 overflow-x-auto bg-gray-50 dark:bg-surface-900">
                      <code className="text-xs font-mono text-success-600 dark:text-success-400 whitespace-pre">{q.model_answer}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {q.type === 'EXPLAIN_ME' && q.model_answer && (
            <div className="mb-4">
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Model Answer</p>
              <div className="p-4 rounded-xl bg-info-50 dark:bg-info-900/15 border border-info-200 dark:border-info-800 border-l-4 border-l-info-500">
                <p className="text-sm text-info-800 dark:text-info-300 leading-relaxed">{q.model_answer}</p>
              </div>
            </div>
          )}

          {q.explanation && (
            <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Explanation</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{q.explanation}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-glow">
            <Brain size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              AI Exam Generator
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Generate exam questions automatically using AI. Preview first, then save.
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 mb-6 animate-fade-up">
          <span className="text-danger-500 text-lg">✕</span>
          <p className="text-sm font-medium text-danger-700 dark:text-danger-300">{error}</p>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 mb-6 animate-fade-up">
          <span className="text-success-500 text-lg">✓</span>
          <p className="text-sm font-medium text-success-700 dark:text-success-300">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* LEFT: Configuration Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-gray-800 sticky top-20 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-surface-900/50">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap size={16} className="text-primary-500" />
                Configuration
              </h2>
            </div>

            <div className="p-5 space-y-5">
              {/* Topic */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Topic</label>
                <div className="relative">
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm bg-white dark:bg-surface-900 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                    <option value="Custom">✏️ Custom Topic</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {topic === 'Custom' && (
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Enter your custom topic..."
                    className="w-full mt-2 px-4 py-3 rounded-xl text-sm bg-white dark:bg-surface-900 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder-gray-400"
                  />
                )}
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Difficulty</label>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`
                        flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200
                        ${difficulty === d
                          ? d === 'EASY'
                            ? 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-glow-success'
                            : d === 'MEDIUM'
                              ? 'bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-sm'
                              : 'bg-gradient-to-r from-danger-500 to-danger-600 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Types */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Question Types</label>
                <div className="space-y-2">
                  {[
                    { label: 'MCQ', icon: BookOpen, value: mcqCount, set: setMcqCount, max: 15, color: 'text-primary-500' },
                    { label: 'Write Code', icon: Code2, value: codeCount, set: setCodeCount, max: 10, color: 'text-warning-500' },
                    { label: 'Explain', icon: MessageSquare, value: explainCount, set: setExplainCount, max: 10, color: 'text-info-500' },
                  ].map(({ label, icon: Icon, value, set, max, color }) => (
                    <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-surface-900 border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} className={color} />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => set(Math.max(0, value - 1))}
                          className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-danger-50 hover:border-danger-300 hover:text-danger-600 dark:hover:bg-danger-900/20 transition-all font-bold text-sm"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-bold text-gray-900 dark:text-white tabular-nums">{value}</span>
                        <button
                          type="button"
                          onClick={() => set(Math.min(max, value + 1))}
                          className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-success-50 hover:border-success-300 hover:text-success-600 dark:hover:bg-success-900/20 transition-all font-bold text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2 px-1">
                  <span className="text-xs text-gray-400">Total questions</span>
                  <span className={`text-sm font-bold ${totalQuestions > 0 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>
                    {totalQuestions}
                  </span>
                </div>
              </div>

              {/* Time & Pass Score */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                    <Clock size={11} className="inline mr-1" />Time (min)
                  </label>
                  <input
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1} max={180}
                    className="w-full px-4 py-3 rounded-xl text-sm bg-white dark:bg-surface-900 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                    <Target size={11} className="inline mr-1" />Pass %
                  </label>
                  <input
                    type="number"
                    value={passingScore}
                    onChange={(e) => setPassingScore(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    min={0} max={100}
                    className="w-full px-4 py-3 rounded-xl text-sm bg-white dark:bg-surface-900 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Exam Title */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Title (optional)</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="Auto-generated if empty"
                  className="w-full px-4 py-3 rounded-xl text-sm bg-white dark:bg-surface-900 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder-gray-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Description (optional)</label>
                <textarea
                  value={examDescription}
                  onChange={(e) => setExamDescription(e.target.value)}
                  placeholder="Auto-generated if empty"
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-white dark:bg-surface-900 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder-gray-400 resize-none"
                />
              </div>

              {/* Action Buttons — now each checks its own loadingAction */}
              <div className="space-y-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={handlePreview}
                  disabled={isLoading}
                  leftIcon={loadingAction === 'preview' ? <Loader2 size={16} className="animate-spin" /> : <Code2 size={16} />}
                >
                  {loadingAction === 'preview' ? 'Generating Preview...' : 'Preview Questions'}
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleGenerateExam}
                  disabled={isLoading}
                  leftIcon={loadingAction === 'generate' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                >
                  {loadingAction === 'generate' ? 'Generating Exam...' : 'Generate & Save Exam'}
                </Button>
              </div>

              {isLoading && (
                <div className="flex items-center gap-2 justify-center py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse-soft" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    AI is {loadingAction === 'preview' ? 'generating questions' : 'creating your exam'}... 15-30 seconds
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Preview Area */}
        <div className="lg:col-span-3">
          {generatedExam && (
            <div className="bg-white dark:bg-surface-800 rounded-2xl border-2 border-success-200 dark:border-success-800 overflow-hidden mb-6 animate-fade-up">
              <div className="px-5 py-4 bg-success-50 dark:bg-success-900/15 border-b border-success-200 dark:border-success-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success-100 dark:bg-success-900/40 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={20} className="text-success-600 dark:text-success-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-success-800 dark:text-success-300">Exam Created!</h3>
                    <p className="text-sm text-success-600 dark:text-success-400">
                      {generatedExam.totalQuestions} questions • Published
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-5 py-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Title</span>
                    <p className="font-semibold text-gray-900 dark:text-white">{generatedExam.title}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Max Score</span>
                    <p className="font-semibold text-gray-900 dark:text-white">{generatedExam.maxScore} pts</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">ID</span>
                    <p className="font-mono text-xs text-gray-500 dark:text-gray-400">{generatedExam.id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {previewQuestions && previewQuestions.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen size={18} className="text-primary-500" />
                  Generated Questions
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({previewQuestions.length})
                  </span>
                </h2>
              </div>
              <div className="space-y-4">
                {previewQuestions.map((q, i) => renderQuestion(q, i))}
              </div>
            </div>
          ) : !isLoading ? (
            <div className="bg-white dark:bg-surface-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center mb-5 animate-float">
                <Brain size={36} className="text-primary-400 dark:text-primary-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Ready to Generate
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                Configure your exam settings on the left and click "Preview Questions" to see AI-generated questions, or "Generate & Save" to create the exam directly.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-5 animate-pulse-soft">
                <Brain size={32} className="text-primary-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {loadingAction === 'preview' ? 'Generating Questions...' : 'Creating Exam...'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                AI is {loadingAction === 'preview' ? 'creating' : 'building an exam with'} {totalQuestions} questions about "{activeTopic}"
              </p>
              <div className="w-48 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400 animate-shimmer" style={{ width: '70%', backgroundSize: '200% 100%' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}