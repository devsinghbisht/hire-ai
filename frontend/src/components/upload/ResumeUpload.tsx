import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, CheckCircle } from 'lucide-react'

interface Props {
  file: File | null
  onChange: (f: File | null) => void
  error?: string
}

export default function ResumeUpload({ file, onChange, error }: Props) {
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) onChange(accepted[0])
  }, [onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: () => onChange(null),
  })

  return (
    <div>
      {!file ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-brand-500 bg-brand-50 scale-[1.01]'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-slate-300 bg-slate-50 hover:border-brand-400 hover:bg-brand-50/50'
          }`}
        >
          <input {...getInputProps()} id="resume-upload" aria-label="Upload PDF resume" />
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isDragActive ? 'bg-brand-100' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <Upload size={24} className={isDragActive ? 'text-brand-600' : 'text-slate-400'} />
            </div>
            <div>
              <p className="font-semibold text-slate-700">
                {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
              </p>
              <p className="text-sm text-slate-500 mt-1">or <span className="text-brand-600 font-medium">browse files</span> · PDF only · Max 5 MB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <FileText size={18} className="text-emerald-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 truncate text-sm">{file.name}</p>
            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB · PDF</p>
          </div>
          <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
          <button
            onClick={(e) => { e.stopPropagation(); onChange(null) }}
            className="p-1.5 rounded-lg hover:bg-emerald-200 transition-colors"
            aria-label="Remove file"
          >
            <X size={16} className="text-slate-600" />
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}
    </div>
  )
}
