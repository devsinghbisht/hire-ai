import React, { createContext, useContext, useState, useCallback } from 'react'
import type { AnalysisResponse } from '../types'

interface AnalysisContextValue {
  analysis: AnalysisResponse | null
  jobTitle: string
  companyName: string
  resumeFile: File | null
  jobDescription: string
  setAnalysis: (a: AnalysisResponse | null) => void
  setJobInfo: (title: string, company: string) => void
  setResumeFile: (f: File | null) => void
  setJobDescription: (jd: string) => void
  clearAnalysis: () => void
}

const Ctx = createContext<AnalysisContextValue | null>(null)

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null)
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')

  const setJobInfo = useCallback((title: string, company: string) => {
    setJobTitle(title)
    setCompanyName(company)
  }, [])

  const clearAnalysis = useCallback(() => {
    setAnalysis(null)
    setJobTitle('')
    setCompanyName('')
    setResumeFile(null)
    setJobDescription('')
  }, [])

  return (
    <Ctx.Provider value={{
      analysis, jobTitle, companyName, resumeFile, jobDescription,
      setAnalysis, setJobInfo, setResumeFile, setJobDescription, clearAnalysis,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAnalysisContext() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAnalysisContext must be used inside AnalysisProvider')
  return ctx
}
