'use client'

import { useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import dynamicImport from 'next/dynamic'
import { Upload, Github, Loader2, X, ArrowLeft, FileText, CheckCircle, Wand2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

// Lazy load componentes
const Navbar = dynamicImport(() => import('@/components/shared/layout/Navbar'), { ssr: true })
const Footer = dynamicImport(() => import('@/components/shared/layout/Footer'), { ssr: true })

function CreateProjectPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [githubUrl, setGithubUrl] = useState('')
  const [processing, setProcessing] = useState(false)
  const [method, setMethod] = useState<'upload' | 'github'>('upload')
  const [enableCustomization, setEnableCustomization] = useState(false)
  const [customForm, setCustomForm] = useState({
    objective: '',
    changes: '',
    technologies: '',
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    toast.success(`${acceptedFiles.length} file(s) selected`)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/javascript': ['.js', '.jsx'],
      'application/typescript': ['.ts', '.tsx'],
      'application/json': ['.json'],
      'text/css': ['.css'],
      'text/html': ['.html'],
    },
    multiple: true,
  })

  const handleSubmit = async () => {
    if (!user) {
      router.push('/auth/login?redirect=/dashboard/create')
      return
    }

    if (method === 'upload' && files.length === 0) {
      toast.error('Select at least one file')
      return
    }

    if (method === 'github' && !githubUrl) {
      toast.error('Paste the GitHub link')
      return
    }

    setProcessing(true)

    try {
      const formData = new FormData()
      
      if (method === 'upload') {
        files.forEach((file) => {
          formData.append('files', file)
        })
      } else {
        formData.append('githubUrl', githubUrl)
    }

      // Adicionar dados de customização se habilitado
      if (enableCustomization) {
        formData.append('customization', JSON.stringify(customForm))
      }

      const response = await fetch('/api/prompt/generate', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error processing project')
      }

      toast.success('Project analyzed successfully!')
      router.push(`/dashboard/result/${data.promptId}`)
    } catch (error: any) {
      toast.error(error.message || 'Error processing project')
    } finally {
      setProcessing(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      
      <div className="flex-1 py-8 px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            New Project
          </h1>

          {/* Submission Method */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => setMethod('upload')}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                method === 'upload'
                  ? 'border-primary-500 bg-primary-500/10 dark:bg-primary-500/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  method === 'upload' ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <Upload className={`w-5 h-5 ${method === 'upload' ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                  File Upload
                </h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Accepts .zip or multiple files
              </p>
            </button>

            <button
              onClick={() => setMethod('github')}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                method === 'github'
                  ? 'border-primary-500 bg-primary-500/10 dark:bg-primary-500/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  method === 'github' ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <Github className={`w-5 h-5 ${method === 'github' ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                  GitHub Link
                </h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Paste the repository link
              </p>
            </button>
          </div>

          {/* File Upload */}
          {method === 'upload' && (
            <div className="mb-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all bg-gray-50 dark:bg-gray-900/50 ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className={`w-12 h-12 mx-auto mb-3 ${isDragActive ? 'text-primary-500' : 'text-gray-400'}`} />
                <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {isDragActive
                    ? 'Drop files here'
                    : 'Drag files here or click to select'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Supported formats: .js .ts .jsx .tsx .json .css .html .zip
                </p>
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Selected files ({files.length}):
                  </p>
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {file.name}
                        </span>
                      </div>
                      <button
                        onClick={() => setFiles(files.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* GitHub Link */}
          {method === 'github' && (
            <div className="mb-4">
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/usuario/projeto"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {githubUrl && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Valid link</span>
              </div>
              )}
            </div>
          )}

          {/* Analyze Project Button */}
          {!enableCustomization && (
            <button
              onClick={handleSubmit}
              disabled={processing || (method === 'upload' && files.length === 0) || (method === 'github' && !githubUrl)}
              className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold text-base hover:bg-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shadow-lg mb-4"
            >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Analyze Project
              </>
            )}
          </button>
          )}

          {/* Customization Checkbox */}
          <div className="mb-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={enableCustomization}
                onChange={(e) => setEnableCustomization(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-700 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary-500" />
                <span className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                  Enable customization
                </span>
              </div>
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-8 mt-1">
              Customize the prompt with your specific requirements
            </p>
          </div>

          {/* Customization Fields */}
          {enableCustomization && (
            <div className="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border-2 border-primary-500/20 dark:border-primary-500/20">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary-500" />
                Customization Options
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    What do you want to create now?
                  </label>
                  <input
                    type="text"
                    value={customForm.objective}
                    onChange={(e) => setCustomForm({ ...customForm, objective: e.target.value })}
                    placeholder='Example: "A financial SaaS"'
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                    </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    What should change?
                  </label>
                  <textarea
                    value={customForm.changes}
                    onChange={(e) => setCustomForm({ ...customForm, changes: e.target.value })}
                    placeholder='Example: "Remove auth, new layout"'
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Preferred Technologies
                  </label>
                  <input
                    type="text"
                    value={customForm.technologies}
                    onChange={(e) => setCustomForm({ ...customForm, technologies: e.target.value })}
                    placeholder='Example: "Tailwind, App Router"'
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Submit Button when customization is enabled */}
              <button
                onClick={handleSubmit}
                disabled={processing || (method === 'upload' && files.length === 0) || (method === 'github' && !githubUrl)}
                className="w-full mt-4 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold text-base hover:bg-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shadow-lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Submit
                  </>
              )}
              </button>
            </div>
          )}

          {/* UX States */}
          {processing && (
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-200">Analyzing project...</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Reading structure • Identifying technologies • Organizing context</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CreateProjectPage
