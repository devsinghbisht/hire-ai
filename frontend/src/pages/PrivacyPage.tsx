import React from 'react'
import { Shield, Lock, EyeOff, Server, HardDrive, RefreshCw, CheckCircle2 } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 animate-fade-in">
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          <Shield size={14} />
          <span>Candidate Privacy Commitment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How HireAI Protects Your Data
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          We believe job seekers deserve absolute transparency. Here is exactly what happens to your resume, job postings, and personal information when you use HireAI.
        </p>
      </div>

      {/* Key Guarantees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <HardDrive size={20} />
          </div>
          <h2 className="text-base font-bold text-slate-900">Ephemeral In-Memory Processing</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Uploaded resumes (PDF, DOCX, TXT) are read directly into memory buffers for text extraction and scoring. They are never written to disk or permanent file storage.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <EyeOff size={20} />
          </div>
          <h2 className="text-base font-bold text-slate-900">Zero AI Training On Your Data</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your resume content is never used to train or fine-tune public foundation models. We utilize enterprise API endpoints with zero-data-retention agreements where configured.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Server size={20} />
          </div>
          <h2 className="text-base font-bold text-slate-900">Optional Cloud Database (Supabase)</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Database persistence is strictly opt-in. By default, HireAI operates in a completely stateless mode. Even when connected to Supabase, no raw resume files are archived.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <RefreshCw size={20} />
          </div>
          <h2 className="text-base font-bold text-slate-900">Offline Heuristic Engine</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            HireAI includes a deterministic local parsing and scoring engine that operates without external network requests or third-party AI keys if you prefer total isolation.
          </p>
        </div>
      </div>

      {/* Detailed Technical Statement */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <h3 className="text-lg font-bold text-slate-900">Technical Data Lifecycle</h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-800">1. Reception & Sanitization</h4>
            <p className="text-xs text-slate-600 mt-1">
              When you upload a file, our FastAPI backend validates MIME types and byte limits (maximum 10MB) before extracting plain text via <code>pypdf</code> or <code>python-docx</code>.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800">2. Analysis Execution</h4>
            <p className="text-xs text-slate-600 mt-1">
              Extracted text is processed by our structured evaluation service to calculate requirement coverage, ATS compatibility, and improvement suggestions. Once the JSON response is delivered to your browser, server memory is garbage collected.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800">3. Candidate Control</h4>
            <p className="text-xs text-slate-600 mt-1">
              You maintain 100% ownership of your resume and all generated reports. You can export HTML/JSON copies locally or clear your browser session at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
