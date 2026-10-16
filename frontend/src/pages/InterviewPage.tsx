import React, { useState } from 'react'
import { Mic, Filter, HelpCircle, Sparkles, CheckCircle2, RefreshCw, Loader2, AlertCircle } from 'lucide-react'
import { useAnalysisContext } from '../context/AnalysisContext'
import InterviewQuestionCard from '../components/report/InterviewQuestionCard'
import EmptyState from '../components/common/EmptyState'
import { api, APIError } from '../services/api'
import type { InterviewQuestion } from '../types'

export default function InterviewPage() {
  const { analysis, setAnalysis, resumeFile, jobDescription } = useAnalysisContext()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [loadingMore, setLoadingMore] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 animate-fade-in">
        <EmptyState
          title="No Interview Questions Generated"
          description="Analyze your resume with a job posting to unlock customized technical, behavioral, and architecture questions."
          action={{ label: "Go to Analyzer", href: "/analyze" }}
        />
      </div>
    )
  }

  const questions = analysis.interview_questions || []

  const categories = ['all', ...Array.from(new Set(questions.map(q => q.category)))]
  const difficulties = ['all', 'easy', 'medium', 'hard']

  const filtered = questions.filter(q => {
    const matchesCat = selectedCategory === 'all' || q.category === selectedCategory
    const matchesDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty
    return matchesCat && matchesDiff
  })

  const handleGenerateMore = async () => {
    if (!resumeFile) {
      setNotice('The original resume file from this session is not in browser memory. Please run an analysis from the Analyzer page to generate a fresh set.')
      return
    }
    setLoadingMore(true)
    setNotice(null)
    try {
      const more = await api.generateInterviewQuestions(
        resumeFile,
        jobDescription || 'General technical position',
        selectedCategory !== 'all' ? [selectedCategory] : undefined,
        8,
      )
      // Merge unique questions
      const existingQs = new Set(questions.map(q => q.question.toLowerCase().trim()))
      const newUnique = more.filter(q => !existingQs.has(q.question.toLowerCase().trim()))
      
      const updated = [...questions, ...newUnique]
      setAnalysis({
        ...analysis,
        interview_questions: updated,
      })
      setNotice(`Added ${newUnique.length} new tailored questions based on your demonstrated skills.`)
      setTimeout(() => setNotice(null), 4000)
    } catch (err) {
      if (err instanceof APIError) {
        setNotice(`Failed to generate more questions: ${err.message}`)
      } else {
        setNotice('Failed to generate additional questions. Please try again.')
      }
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Mic className="text-brand-600" size={30} />
              Targeted Interview Preparation
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Questions likely to be asked based specifically on your demonstrated projects and the job requirements, complete with STAR talking points.
            </p>
          </div>
          <button
            onClick={handleGenerateMore}
            disabled={loadingMore}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all"
          >
            {loadingMore ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Generate More Questions</span>
              </>
            )}
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2 animate-fade-in">
          <AlertCircle size={15} className="text-blue-600 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Category filter */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter size={13} />
            Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Difficulty filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Difficulty:</span>
          {difficulties.map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                selectedDifficulty === diff
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
            No interview questions match the selected filters.
          </div>
        ) : (
          filtered.map((q, idx) => (
            <InterviewQuestionCard key={idx} question={q} index={idx} />
          ))
        )}
      </div>
    </div>
  )
}
