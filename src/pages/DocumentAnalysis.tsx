import React, { useState, useEffect, useCallback } from 'react'
import { Upload, FileText, AlertTriangle, CheckCircle, Clock, Eye, Download, Trash2, BarChart3 } from 'lucide-react'
import { aiDocumentAnalyzer, DocumentAnalysisResult } from '../lib/midnight/aiDocumentAnalysis'

const DocumentAnalysis = () => {
  const [analysisResults, setAnalysisResults] = useState<DocumentAnalysisResult[]>([])
  const [selectedResult, setSelectedResult] = useState<DocumentAnalysisResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    loadAnalysisResults()
  }, [])

  const loadAnalysisResults = () => {
    const results = aiDocumentAnalyzer.getAllAnalysisResults()
    setAnalysisResults(results)
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    await handleFiles(files)
  }, [])

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      await handleFiles(files)
    }
  }

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      if (file.type === 'application/pdf' || file.type.includes('document') || file.type === 'text/plain') {
        try {
          const analysisId = await aiDocumentAnalyzer.uploadAndAnalyzeDocument(file)
          setUploadProgress(prev => ({ ...prev, [analysisId]: 0 }))
          
          // Simulate upload progress
          const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
              const currentProgress = prev[analysisId] || 0
              if (currentProgress >= 100) {
                clearInterval(progressInterval)
                loadAnalysisResults()
                return prev
              }
              return { ...prev, [analysisId]: currentProgress + 10 }
            })
          }, 200)
        } catch (error) {
          console.error('Failed to upload file:', error)
        }
      }
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'processing': return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Document Analysis</h1>
          <p className="mt-2 text-gray-600">Upload legal documents for AI-powered risk analysis and clause extraction</p>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-lg font-medium text-gray-900">Upload documents</span>
                <p className="text-gray-500">Drag and drop files here, or click to select</p>
                <p className="text-sm text-gray-400 mt-2">Supports PDF, DOC, DOCX, and TXT files</p>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileInput}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Analyses</h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {analysisResults.map((result) => (
                  <div
                    key={result.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedResult?.id === result.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedResult(result)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <p className="text-sm font-medium text-gray-900 truncate">{result.fileName}</p>
                        </div>
                        <div className="mt-1 flex items-center space-x-2">
                          {getStatusIcon(result.status)}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getRiskColor(result.riskLevel)}`}>
                            {result.riskLevel} risk
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(result.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {analysisResults.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <FileText className="mx-auto h-8 w-8 text-gray-300" />
                    <p className="mt-2">No documents analyzed yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2">
            {selectedResult ? (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">{selectedResult.fileName}</h2>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(selectedResult.riskLevel)}`}>
                        Risk Score: {selectedResult.riskScore}/100
                      </span>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Summary */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Analysis Summary</h3>
                    <p className="text-gray-700">{selectedResult.summary}</p>
                  </div>

                  {/* Document Type */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Document Classification</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Type</p>
                          <p className="text-gray-900">{selectedResult.documentType.subType}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Confidence</p>
                          <p className="text-gray-900">{Math.round(selectedResult.documentType.confidence * 100)}%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Clauses */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Key Clauses</h3>
                    <div className="space-y-3">
                      {selectedResult.clauses.map((clause) => (
                        <div key={clause.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{clause.title}</h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRiskColor(clause.riskLevel)}`}>
                              {clause.riskLevel}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{clause.analysis}</p>
                          {clause.suggestions.length > 0 && (
                            <div className="text-xs text-blue-600">
                              <strong>Suggestions:</strong> {clause.suggestions.join('; ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  {selectedResult.recommendations.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Recommendations</h3>
                      <div className="space-y-3">
                        {selectedResult.recommendations.map((rec) => (
                          <div key={rec.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-blue-900">{rec.title}</h4>
                              <span className={`text-xs px-2 py-1 rounded ${
                                rec.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {rec.priority}
                              </span>
                            </div>
                            <p className="text-sm text-blue-800 mb-2">{rec.description}</p>
                            <p className="text-xs text-blue-600">
                              <strong>Action:</strong> {rec.suggestedAction}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Eye className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Select a document</h3>
                <p className="mt-2 text-gray-500">Choose a document from the list to view its analysis results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentAnalysis
