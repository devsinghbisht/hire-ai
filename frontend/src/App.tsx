import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import AnalyzePage from './pages/AnalyzePage'
import ReportPage from './pages/ReportPage'
import ATSPage from './pages/ATSPage'
import ImprovePage from './pages/ImprovePage'
import SkillGapsPage from './pages/SkillGapsPage'
import RoadmapPage from './pages/RoadmapPage'
import InterviewPage from './pages/InterviewPage'
import PrivacyPage from './pages/PrivacyPage'
import { AnalysisProvider } from './context/AnalysisContext'

export default function App() {
  return (
    <BrowserRouter>
      <AnalysisProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/ats-check" element={<ATSPage />} />
            <Route path="/resume-improve" element={<ImprovePage />} />
            <Route path="/skill-gaps" element={<SkillGapsPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/interview-prep" element={<InterviewPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Routes>
        </AppLayout>
      </AnalysisProvider>
    </BrowserRouter>
  )
}
