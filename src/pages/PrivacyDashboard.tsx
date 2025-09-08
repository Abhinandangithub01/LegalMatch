import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Key,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Scale,
  Gavel,
  Building,
  Users,
  Download,
  Upload,
  Settings,
  Info,
  Trash2,
  RefreshCw,
  Database,
  Globe,
  Fingerprint
} from 'lucide-react'
import { zkAuth } from '../lib/midnight/zkAuthentication'

interface ComplianceMetrics {
  barCompliance: {
    status: 'compliant' | 'warning' | 'non-compliant'
    lastCheck: string
    expirationDate: string
    jurisdiction: string[]
  }
  attorneyClientPrivilege: {
    messagesEncrypted: number
    documentsProtected: number
    breachAttempts: number
    lastAudit: string
  }
  dataRetention: {
    clientRecords: number
    retentionPeriod: number
    scheduledDeletion: string[]
    complianceLevel: 'full' | 'partial' | 'non-compliant'
  }
  malpracticeInsurance: {
    status: 'active' | 'expired' | 'pending'
    coverage: number
    expirationDate: string
    provider: string
  }
  conflictChecking: {
    enabled: boolean
    checksPerformed: number
    conflictsDetected: number
    lastUpdate: string
  }
}

const LegalComplianceDashboard = () => {
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState<ComplianceMetrics>({
    barCompliance: {
      status: 'compliant',
      lastCheck: '2024-01-15',
      expirationDate: '2024-12-31',
      jurisdiction: ['California', 'New York']
    },
    attorneyClientPrivilege: {
      messagesEncrypted: 1247,
      documentsProtected: 89,
      breachAttempts: 0,
      lastAudit: '2024-01-10'
    },
    dataRetention: {
      clientRecords: 156,
      retentionPeriod: 7,
      scheduledDeletion: ['2024-02-15', '2024-03-20'],
      complianceLevel: 'full'
    },
    malpracticeInsurance: {
      status: 'active',
      coverage: 2000000,
      expirationDate: '2024-06-30',
      provider: 'Legal Shield Pro'
    },
    conflictChecking: {
      enabled: true,
      checksPerformed: 234,
      conflictsDetected: 3,
      lastUpdate: '2024-01-14'
    }
  })

  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadComplianceData()
  }, [])

  const loadComplianceData = async () => {
    try {
      const savedMetrics = localStorage.getItem('legalComplianceMetrics')
      if (savedMetrics) {
        const parsed = JSON.parse(savedMetrics)
        setMetrics(prev => ({ ...prev, ...parsed }))
      }
    } catch (error) {
      console.error('Error loading compliance data:', error)
    }
  }

  const refreshCompliance = async () => {
    setLoading(true)
    try {
      // Simulate compliance check
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const updatedMetrics = {
        ...metrics,
        barCompliance: {
          ...metrics.barCompliance,
          lastCheck: new Date().toISOString().split('T')[0]
        },
        attorneyClientPrivilege: {
          ...metrics.attorneyClientPrivilege,
          lastAudit: new Date().toISOString().split('T')[0]
        }
      }
      
      setMetrics(updatedMetrics)
      localStorage.setItem('legalComplianceMetrics', JSON.stringify(updatedMetrics))
    } catch (error) {
      console.error('Error refreshing compliance:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportComplianceReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      metrics,
      summary: {
        overallCompliance: 'Compliant',
        riskLevel: 'Low',
        actionItems: []
      }
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `legal-compliance-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'active':
      case 'full':
        return 'text-green-600 bg-green-100'
      case 'warning':
      case 'partial':
      case 'pending':
        return 'text-amber-600 bg-amber-100'
      case 'non-compliant':
      case 'expired':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Shield },
    { id: 'privilege', name: 'Attorney-Client Privilege', icon: Lock },
    { id: 'compliance', name: 'Bar Compliance', icon: Scale },
    { id: 'data', name: 'Data Management', icon: Database },
    { id: 'insurance', name: 'Insurance & Risk', icon: Building }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Legal Compliance Dashboard</h1>
            <p className="text-gray-600">Monitor your professional compliance and data protection status</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={refreshCompliance}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </button>
            
            <button
              onClick={exportComplianceReport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Compliance Status Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Scale className="w-8 h-8 text-blue-600" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metrics.barCompliance.status)}`}>
                {metrics.barCompliance.status}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Bar Compliance</h3>
            <p className="text-sm text-gray-600">Last checked: {metrics.barCompliance.lastCheck}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Lock className="w-8 h-8 text-green-600" />
              <span className="px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100">
                Protected
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Privilege Protection</h3>
            <p className="text-sm text-gray-600">{metrics.attorneyClientPrivilege.messagesEncrypted} encrypted messages</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Building className="w-8 h-8 text-purple-600" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metrics.malpracticeInsurance.status)}`}>
                {metrics.malpracticeInsurance.status}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Malpractice Insurance</h3>
            <p className="text-sm text-gray-600">${(metrics.malpracticeInsurance.coverage / 1000000).toFixed(1)}M coverage</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Database className="w-8 h-8 text-amber-600" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metrics.dataRetention.complianceLevel)}`}>
                {metrics.dataRetention.complianceLevel}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Data Retention</h3>
            <p className="text-sm text-gray-600">{metrics.dataRetention.clientRecords} client records</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab metrics={metrics} />}
            {activeTab === 'privilege' && <PrivilegeTab metrics={metrics} />}
            {activeTab === 'compliance' && <ComplianceTab metrics={metrics} />}
            {activeTab === 'data' && <DataManagementTab metrics={metrics} />}
            {activeTab === 'insurance' && <InsuranceTab metrics={metrics} />}
          </div>
        </div>
      </div>
    </div>
  )
}

const OverviewTab: React.FC<{ metrics: ComplianceMetrics }> = ({ metrics }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Summary</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <span className="font-medium text-gray-900">Overall Status</span>
            </div>
            <span className="text-green-600 font-semibold">Compliant</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-blue-600 mr-3" />
              <span className="font-medium text-gray-900">Security Level</span>
            </div>
            <span className="text-blue-600 font-semibold">High</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-amber-600 mr-3" />
              <span className="font-medium text-gray-900">Next Review</span>
            </div>
            <span className="text-amber-600 font-semibold">30 days</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center">
              <Gavel className="w-5 h-5 text-purple-600 mr-3" />
              <span className="font-medium text-gray-900">Risk Level</span>
            </div>
            <span className="text-purple-600 font-semibold">Low</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const PrivilegeTab: React.FC<{ metrics: ComplianceMetrics }> = ({ metrics }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Attorney-Client Privilege Protection</h3>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{metrics.attorneyClientPrivilege.messagesEncrypted}</div>
          <div className="text-sm text-gray-600">Encrypted Messages</div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{metrics.attorneyClientPrivilege.documentsProtected}</div>
          <div className="text-sm text-gray-600">Protected Documents</div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{metrics.attorneyClientPrivilege.breachAttempts}</div>
          <div className="text-sm text-gray-600">Breach Attempts</div>
        </div>
      </div>
    </div>
  </div>
)

const ComplianceTab: React.FC<{ metrics: ComplianceMetrics }> = ({ metrics }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Bar Compliance Status</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <div className="font-medium text-gray-900">Compliance Status</div>
            <div className="text-sm text-gray-600">Current standing with bar associations</div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(metrics.barCompliance.status)}`}>
            {metrics.barCompliance.status}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <div className="font-medium text-gray-900">Jurisdictions</div>
            <div className="text-sm text-gray-600">{metrics.barCompliance.jurisdiction.join(', ')}</div>
          </div>
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
      </div>
    </div>
  </div>
)

const DataManagementTab: React.FC<{ metrics: ComplianceMetrics }> = ({ metrics }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Retention & Management</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">Client Records</div>
            <div className="text-2xl font-bold text-blue-600">{metrics.dataRetention.clientRecords}</div>
            <div className="text-sm text-gray-600">Active records under management</div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">Retention Period</div>
            <div className="text-2xl font-bold text-green-600">{metrics.dataRetention.retentionPeriod} years</div>
            <div className="text-sm text-gray-600">Standard retention policy</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">Scheduled Deletions</div>
            <div className="space-y-2">
              {metrics.dataRetention.scheduledDeletion.map((date, index) => (
                <div key={index} className="text-sm text-gray-600">{date}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const InsuranceTab: React.FC<{ metrics: ComplianceMetrics }> = ({ metrics }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Liability Insurance</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">Coverage Amount</div>
            <div className="text-2xl font-bold text-green-600">${(metrics.malpracticeInsurance.coverage / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-gray-600">Professional liability coverage</div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">Provider</div>
            <div className="text-lg font-semibold text-gray-900">{metrics.malpracticeInsurance.provider}</div>
            <div className="text-sm text-gray-600">Insurance carrier</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">Status</div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(metrics.malpracticeInsurance.status)}`}>
              {metrics.malpracticeInsurance.status}
            </span>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">Expiration Date</div>
            <div className="text-lg font-semibold text-gray-900">{metrics.malpracticeInsurance.expirationDate}</div>
            <div className="text-sm text-gray-600">Policy renewal required</div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const getStatusColor = (status: string) => {
  switch (status) {
    case 'compliant':
    case 'active':
    case 'full':
      return 'text-green-600 bg-green-100'
    case 'warning':
    case 'partial':
    case 'pending':
      return 'text-amber-600 bg-amber-100'
    case 'non-compliant':
    case 'expired':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export default LegalComplianceDashboard
