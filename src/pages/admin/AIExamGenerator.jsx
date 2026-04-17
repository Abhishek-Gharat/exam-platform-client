// client/src/pages/admin/AIExamGenerator.jsx
import { useState } from 'react';
import aiAPI from '../../api/aiAPI';

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

const inputClass = "w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400";

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewQuestions, setPreviewQuestions] = useState(null);
  const [generatedExam, setGeneratedExam] = useState(null);

  const activeTopic = topic === 'Custom' ? customTopic : topic;
  const totalQuestions = mcqCount + codeCount + explainCount;

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handlePreview = async () => {
    clearMessages();
    if (!activeTopic) { setError('Please select or enter a topic'); return; }
    if (totalQuestions === 0) { setError('Add at least one question'); return; }
    if (totalQuestions > 20) { setError('Maximum 20 questions per generation'); return; }

    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleGenerateExam = async () => {
    clearMessages();
    if (!activeTopic) { setError('Please select or enter a topic'); return; }
    if (totalQuestions === 0) { setError('Add at least one question'); return; }

    setLoading(true);
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
        setSuccess(`Exam "${data.exam.title}" created with ${data.exam.totalQuestions} questions! It's now published and visible to students.`);
      } else {
        setError(data.error || 'Exam creation failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Exam creation failed');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = (q, index) => {
    return (
      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
            q.type === 'MCQ' ? 'bg-blue-100 text-blue-700'
            : q.type === 'WRITE_CODE' ? 'bg-green-100 text-green-700'
            : 'bg-purple-100 text-purple-700'
          }`}>{q.type}</span>
          <span className={`text-xs px-2 py-0.5 rounded ${
            q.difficulty === 'EASY' ? 'bg-green-50 text-green-600'
            : q.difficulty === 'MEDIUM' ? 'bg-yellow-50 text-yellow-600'
            : 'bg-red-50 text-red-600'
          }`}>{q.difficulty}</span>
          <span className="text-xs text-gray-500">{q.points} pts</span>
        </div>

        <h4 className="font-semibold text-gray-800 mb-1">{index + 1}. {q.title}</h4>
        <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">{q.content}</p>

        {q.type === 'MCQ' && q.options && (
          <div className="space-y-1 mb-3">
            {q.options.map((opt, i) => {
              const label = opt.label || ['A', 'B', 'C', 'D'][i];
              const text = opt.text || opt;
              const isCorrect = q.correct_option === i;
              return (
                <div key={i} className={`text-sm px-3 py-1.5 rounded ${
                  isCorrect ? 'bg-green-50 border border-green-300 text-green-800 font-medium'
                  : 'bg-gray-50 border border-gray-200 text-gray-700'
                }`}>
                  <span className="font-medium mr-2">{label}.</span>{text}
                  {isCorrect && <span className="ml-2 text-green-600">✓ Correct</span>}
                </div>
              );
            })}
          </div>
        )}

        {q.type === 'WRITE_CODE' && (
          <div className="space-y-2 mb-3">
            {q.starter_code && (
              <div>
                <span className="text-xs font-semibold text-gray-500">Starter Code:</span>
                <pre className="bg-gray-900 text-green-400 text-xs p-2 rounded mt-1 overflow-x-auto">{q.starter_code}</pre>
              </div>
            )}
            {q.test_cases && q.test_cases.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-gray-500">Test Cases:</span>
                {q.test_cases.map((tc, ti) => (
                  <div key={ti} className="text-xs bg-gray-50 text-gray-700 p-1.5 rounded mt-1">
                    Input: <code>{tc.input}</code> → Expected: <code>{tc.expected_output}</code>
                  </div>
                ))}
              </div>
            )}
            {q.model_answer && (
              <div>
                <span className="text-xs font-semibold text-gray-500">Model Answer:</span>
                <pre className="bg-gray-900 text-green-400 text-xs p-2 rounded mt-1 overflow-x-auto">{q.model_answer}</pre>
              </div>
            )}
          </div>
        )}

        {q.type === 'EXPLAIN_ME' && q.model_answer && (
          <div className="mb-3">
            <span className="text-xs font-semibold text-gray-500">Model Answer:</span>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-1">{q.model_answer}</p>
          </div>
        )}

        {q.explanation && (
          <div className="border-t pt-2 mt-2">
            <span className="text-xs font-semibold text-gray-500">Explanation:</span>
            <p className="text-sm text-gray-600 mt-0.5">{q.explanation}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          🤖 AI Exam Generator
        </h1>
        <p className="text-gray-500 mt-1">
          Generate exam questions automatically using AI. Preview first, then save.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          ✅ {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Configuration Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-5 space-y-4 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Configuration
            </h2>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={inputClass}
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
                <option value="Custom">✏️ Custom Topic</option>
              </select>
              {topic === 'Custom' && (
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Enter custom topic..."
                  className={inputClass + " mt-2"}
                />
              )}
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded transition ${
                      difficulty === d
                        ? d === 'EASY' ? 'bg-green-500 text-white'
                          : d === 'MEDIUM' ? 'bg-yellow-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >{d}</button>
                ))}
              </div>
            </div>

            {/* Question Counts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Types</label>
              <div className="space-y-2">
                {[
                  { label: 'MCQ', value: mcqCount, set: setMcqCount, max: 15 },
                  { label: 'Write Code', value: codeCount, set: setCodeCount, max: 10 },
                  { label: 'Explain', value: explainCount, set: setExplainCount, max: 10 },
                ].map(({ label, value, set, max }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{label}</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => set(Math.max(0, value - 1))}
                        className="w-7 h-7 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-center leading-7 font-bold">-</button>
                      <span className="w-6 text-center font-semibold text-gray-800">{value}</span>
                      <button type="button" onClick={() => set(Math.min(max, value + 1))}
                        className="w-7 h-7 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-center leading-7 font-bold">+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Total: {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Math.max(1, parseInt(e.target.value) || 1))}
                min={1} max={180}
                className={inputClass}
              />
            </div>

            {/* Passing Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score (%)</label>
              <input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                min={0} max={100}
                className={inputClass}
              />
            </div>

            {/* Exam Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Title (optional)</label>
              <input
                type="text"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                placeholder="Auto-generated if empty"
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <textarea
                value={examDescription}
                onChange={(e) => setExamDescription(e.target.value)}
                placeholder="Auto-generated if empty"
                rows={2}
                className={inputClass}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button type="button" onClick={handlePreview} disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2.5 rounded transition text-sm">
                {loading ? '⏳ Generating...' : '👁️ Preview Questions'}
              </button>
              <button type="button" onClick={handleGenerateExam} disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium py-2.5 rounded transition text-sm">
                {loading ? '⏳ Generating...' : '🚀 Generate & Save Exam'}
              </button>
            </div>

            {loading && (
              <div className="text-center text-sm text-gray-500 animate-pulse">
                AI is generating questions... This may take 15-30 seconds.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Preview Area */}
        <div className="lg:col-span-2">
          {generatedExam && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-green-800">✅ Exam Created Successfully</h3>
              <div className="text-sm text-green-700 mt-1 space-y-0.5">
                <p><strong>Title:</strong> {generatedExam.title}</p>
                <p><strong>Questions:</strong> {generatedExam.totalQuestions}</p>
                <p><strong>Max Score:</strong> {generatedExam.maxScore} points</p>
                <p><strong>Status:</strong> Published (visible to students)</p>
                <p className="text-xs text-green-600 mt-1">Exam ID: {generatedExam.id}</p>
              </div>
            </div>
          )}

          {previewQuestions && previewQuestions.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Generated Questions ({previewQuestions.length})
              </h2>
              <div className="space-y-3">
                {previewQuestions.map((q, i) => renderQuestion(q, i))}
              </div>
            </div>
          ) : !loading ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center text-gray-400">
              <div className="text-5xl mb-3">🤖</div>
              <p className="text-lg font-medium">No questions generated yet</p>
              <p className="text-sm mt-1">
                Configure your exam on the left and click "Preview Questions" or "Generate & Save Exam"
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}