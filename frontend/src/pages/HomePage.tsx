import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Zap, 
  Target, 
  FileCheck, 
  Brain, 
  BookOpen, 
  Mic, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Activity,
  BarChart3
} from 'lucide-react'
import { useAnalysisContext } from '../context/AnalysisContext'

const DEMO_RESUME_TEXT = `John Doe
Senior Full-Stack Engineer | San Francisco, CA | john.doe@example.com | github.com/johndoe

SUMMARY
Versatile software engineer with 6+ years of experience building scalable distributed web applications, cloud-native microservices, and AI-assisted tooling. Proven track record in TypeScript, React, Python, FastAPI, PostgreSQL, and Kubernetes.

WORK EXPERIENCE
Senior Software Engineer | CloudScale Systems (2021 – Present)
• Architected and shipped low-latency microservices using FastAPI and PostgreSQL handling 15,000 requests/sec.
• Led frontend modernization converting legacy systems to React 18 and TypeScript, boosting Core Web Vitals by 42%.
• Containerized 20+ internal services with Docker and orchestrated deployment via Kubernetes and CI/CD pipelines.
• Mentored 5 junior engineers and established automated code quality gates and unit test benchmarks (92% coverage).

Full-Stack Developer | DataCraft Labs (2018 – 2021)
• Built responsive customer dashboards using React, Redux, and TailwindCSS.
• Developed REST APIs with Python/Flask and integrated Redis caching for 3x speedup on analytical queries.
• Collaborated with product managers and UX designers to implement accessible WCAG 2.1 AA interfaces.

EDUCATION
B.S. in Computer Science | University of California, Berkeley (2018)

TECHNICAL SKILLS
Languages: Python, TypeScript, JavaScript, SQL, HTML5, CSS3
Frameworks & Libraries: React, Next.js, FastAPI, Node.js, TailwindCSS, PyTorch
Cloud & DevOps: Docker, Kubernetes, AWS (S3, EC2, Lambda), GitHub Actions, CI/CD
Databases: PostgreSQL, Redis, MongoDB
Tools: Git, Vite, Postman, Linux, Jest, Pytest`

const DEMO_JD_TEXT = `Senior Full-Stack Engineer — Platform & AI
TechForward Inc. | Remote / Hybrid

ABOUT THE ROLE:
We are looking for a Senior Full-Stack Engineer to join our core Platform team. You will build high-throughput APIs, intuitive user interfaces, and collaborate closely with our machine learning engineers to integrate generative AI models into customer workflows.

RESPONSIBILITIES:
• Design, implement, and maintain scalable APIs using Python (FastAPI/Django) and Node.js.
• Develop responsive, performant web applications using React, TypeScript, and modern CSS.
• Deploy and maintain cloud infrastructure on AWS/GCP with Docker and Kubernetes.
• Collaborate on system design, database schemas, and microservice architecture.
• Write comprehensive unit, integration, and end-to-end tests.

REQUIREMENTS:
• 5+ years of software engineering experience in modern full-stack environments.
• Strong proficiency in Python and modern TypeScript/React.
• Hands-on experience with relational databases (PostgreSQL preferred) and query optimization.
• Solid background with containerization (Docker) and cloud deployments (AWS or GCP).
• Familiarity with CI/CD automation pipelines and test-driven development.
• Strong communication skills and enthusiasm for mentoring fellow engineers.

NICE TO HAVE:
• Experience with LLM APIs (OpenAI, Anthropic, Gemini) or vector databases.
• Experience with GraphQL or gRPC microservices.`

export default function HomePage() {
  const navigate = useNavigate()
  const { setJobDescription, setJobInfo, setResumeFile } = useAnalysisContext()

  const handleLoadDemo = () => {
    // Generate valid minimal PDF blob with resume text
    const cleanedText = DEMO_RESUME_TEXT.replace(/\r?\n/g, ' ').replace(/[()\\]/g, '')
    const streamContent = `BT
/F1 10 Tf
50 720 Td
(${cleanedText}) Tj
ET`
    const streamLen = streamContent.length
    const pdfData = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLen} >>
stream
${streamContent}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000370 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
441
%%EOF`

    const blob = new Blob([pdfData], { type: 'application/pdf' })
    const file = new File([blob], 'John_Doe_Senior_FullStack_Resume.pdf', { type: 'application/pdf' })
    setResumeFile(file)
    setJobDescription(DEMO_JD_TEXT)
    setJobInfo('Senior Full-Stack Engineer — Platform & AI', 'TechForward Inc.')
    navigate('/analyze')
  }

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 text-brand-700 text-xs sm:text-sm font-semibold border border-brand-200/60 shadow-sm animate-fade-in">
            <Sparkles size={14} className="text-brand-600 animate-spin-slow" />
            <span>AI-Powered Career Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none max-w-4xl mx-auto">
            Bridge the Gap Between Your Resume and <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Your Dream Job</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Instant explainable ATS matching, verifiable skill gap analysis, personalized 30-day upskilling roadmaps, and targeted interview prep.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg transition-all text-base"
            >
              <Target size={18} />
              Start Free Analysis
              <ArrowRight size={18} />
            </Link>

            <button
              onClick={handleLoadDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm hover:border-slate-400 transition-all text-base"
            >
              <Zap size={18} className="text-amber-500" />
              Try With Sample Data
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>100% Explainable Scoring</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-brand-500" />
              <span>Zero Resume Storage (Privacy First)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity size={16} className="text-indigo-500" />
              <span>Heuristic & AI Multi-Provider</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Engineered for Transparency & Real Career Growth
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            No vague black-box percentages. Every score point is tied directly to textual evidence from your resume and target job description.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Explainable Match Engine</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Transparent weighted breakdown across essential skills, qualifications, hands-on projects, and preferred skills with direct text citations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Honest ATS Compatibility</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Detects formatting traps, missing sections, and keyword coverage without perpetuating false myths about automated rejection filters.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">High-Impact Bullet Rewriter</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Transform passive descriptions into accomplishment-driven bullets using the Google XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Brain size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Actionable Skill Gap Insights</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Identifies missing required skills vs partially demonstrated competencies and prescribes concrete projects to bridge them.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">30-Day Learning Roadmap</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Prioritized, weekly actionable objectives with realistic effort estimates, practice tasks, and measurable completion criteria.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Mic size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Custom Interview Questions</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Generate role-specific technical, behavioral, and architecture questions grounded in your resume experiences and job requirements.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">How HireAI Works</h2>
            <p className="text-slate-600 text-sm sm:text-base">Four transparent steps from upload to comprehensive career readiness.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold text-lg flex items-center justify-center mx-auto">1</div>
              <h3 className="font-bold text-slate-800">Upload & Parse</h3>
              <p className="text-xs text-slate-500">Securely parse PDF, DOCX, or TXT into structured candidate profile sections.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold text-lg flex items-center justify-center mx-auto">2</div>
              <h3 className="font-bold text-slate-800">Analyze Requirements</h3>
              <p className="text-xs text-slate-500">Deconstruct job descriptions into essential, preferred, and tool requirements.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold text-lg flex items-center justify-center mx-auto">3</div>
              <h3 className="font-bold text-slate-800">Evidence Matching</h3>
              <p className="text-xs text-slate-500">Cross-reference candidate experience with explicit proof and confidence metrics.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold text-lg flex items-center justify-center mx-auto">4</div>
              <h3 className="font-bold text-slate-800">Guidance & Action</h3>
              <p className="text-xs text-slate-500">Receive bullet rewrites, learning roadmaps, and tailored interview prep.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-brand-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Ready to Benchmark Your Resume?</h2>
          <p className="text-brand-100 max-w-xl mx-auto text-sm sm:text-base">
            Upload your resume and paste a job posting to unlock explainable match metrics, ATS warnings, and strategic improvements.
          </p>
          <div className="pt-2">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-brand-900 bg-white hover:bg-brand-50 shadow-lg hover:shadow-xl transition-all text-base"
            >
              <Target size={18} />
              Launch Analysis Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
