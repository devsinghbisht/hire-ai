import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Brain, FileText, Target, BookOpen, Mic, Shield, BarChart2, Menu, X, Zap } from 'lucide-react'

const navItems = [
  { path: '/', label: 'Analyze', icon: Target },
  { path: '/report', label: 'Report', icon: BarChart2 },
  { path: '/ats-check', label: 'ATS Check', icon: FileText },
  { path: '/skill-gaps', label: 'Skill Gaps', icon: Brain },
  { path: '/roadmap', label: 'Roadmap', icon: BookOpen },
  { path: '/interview-prep', label: 'Interview Prep', icon: Mic },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm group-hover:bg-brand-700 transition-colors">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-black text-brand-700 tracking-tight">
              Hire<span className="text-brand-500">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1" aria-label="Main navigation">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === path
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3 ml-auto">
            <Link to="/privacy" className="text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1">
              <Shield size={13} />
              Privacy
            </Link>
            <Link
              to="/"
              className="btn-primary py-2 text-sm"
            >
              <Target size={14} />
              Analyze Resume
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden ml-auto p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 animate-fade-in">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === path ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <Link to="/privacy" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-500">
              <Shield size={16} />Privacy
            </Link>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
                <Zap size={13} className="text-white" />
              </div>
              <span className="font-bold text-brand-700">HireAI</span>
              <span className="text-slate-400 text-sm">— Open-source career guidance platform</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <Link to="/privacy" className="hover:text-brand-600 transition-colors">Privacy</Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition-colors">GitHub</a>
              <span>MIT License</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400 text-center sm:text-left">
            HireAI measures alignment between your resume and job description. It is not a prediction of hiring outcomes.
            Always verify AI suggestions before acting on them.
          </p>
        </div>
      </footer>
    </div>
  )
}
