import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Scale, 
  MessageCircle, 
  Calendar, 
  Shield, 
  Bell, 
  Settings, 
  Plus, 
  Activity, 
  Gavel, 
  Clock, 
  Eye,
  Search,
  UserPlus,
  FileText,
  AlertCircle,
  Lock,
  TrendingUp,
  Database,
  DollarSign,
  Building,
  Award,
  CheckCircle,
  User,
  BarChart3,
  MapPin,
  Star
} from 'lucide-react'
import { zkAuth } from '../lib/midnight/zkAuthentication'

interface LegalCase {
  id: string
  title: string
  type: string
  status: 'active' | 'pending' | 'completed' | 'consultation'
  clientName: string
  priority: 'high' | 'medium' | 'low'
  lastActivity: string
  nextDeadline?: string
  billableHours: number
  estimatedValue: string
}

interface ClientCommunication {
  id: string
  clientName: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isUrgent: boolean
  caseType: string
}

interface ComplianceMetric {
  id: string
  name: string
  status: 'compliant' | 'warning' | 'violation'
  lastChecked: string
  nextDue?: string
}

interface ProfessionalStats {
  activeCases: number
  totalClients: number
  billableHours: number
  complianceScore: number
  monthlyRevenue: string
  successRate: number
}

const LegalDashboard = () => {
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [cases, setCases] = useState<LegalCase[]>([])
  const [communications, setCommunications] = useState<ClientCommunication[]>([])
  const [compliance, setCompliance] = useState<ComplianceMetric[]>([])
  const [stats, setStats] = useState<ProfessionalStats>({
    activeCases: 12,
    totalClients: 45,
    billableHours: 156.5,
    complianceScore: 94,
    monthlyRevenue: '$125,000',
    successRate: 87
  })
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const identity = zkAuth.getCurrentIdentity()
      if (identity) {
        setUserProfile(identity)
      }

      // Mock legal cases data
      setCases([
        {
          id: '1',
          title: 'Corporate Merger - TechCorp Acquisition',
          type: 'Corporate Law',
          status: 'active',
          clientName: 'TechCorp Industries',
          priority: 'high',
          lastActivity: '2 hours ago',
          nextDeadline: 'Dec 15, 2024',
          billableHours: 45.5,
          estimatedValue: '$75,000'
        },
        {
          id: '2',
          title: 'Employment Dispute Resolution',
          type: 'Employment Law',
          status: 'pending',
          clientName: 'Sarah Johnson',
          priority: 'medium',
          lastActivity: '1 day ago',
          nextDeadline: 'Dec 20, 2024',
          billableHours: 12.0,
          estimatedValue: '$15,000'
        },
        {
          id: '3',
          title: 'Contract Negotiation - Software License',
          type: 'Contract Law',
          status: 'consultation',
          clientName: 'StartupXYZ',
          priority: 'low',
          lastActivity: '3 days ago',
          billableHours: 3.5,
          estimatedValue: '$8,000'
        }
      ])

      // Mock communications data
      setCommunications([
        {
          id: '1',
          clientName: 'TechCorp Industries',
          lastMessage: 'Need urgent review of merger documents before board meeting',
          timestamp: '10 minutes ago',
          unreadCount: 3,
          isUrgent: true,
          caseType: 'Corporate Law'
        },
        {
          id: '2',
          clientName: 'Sarah Johnson',
          lastMessage: 'Thank you for the case update. When can we schedule next meeting?',
          timestamp: '2 hours ago',
          unreadCount: 1,
          isUrgent: false,
          caseType: 'Employment Law'
        }
      ])

      // Mock compliance data
      setCompliance([
        {
          id: '1',
          name: 'Bar License Renewal',
          status: 'compliant',
          lastChecked: '2024-01-15',
          nextDue: '2025-01-15'
        },
        {
          id: '2',
          name: 'Malpractice Insurance',
          status: 'compliant',
          lastChecked: '2024-06-01',
          nextDue: '2025-06-01'
        },
        {
          id: '3',
          name: 'CLE Requirements',
          status: 'warning',
          lastChecked: '2024-03-01',
          nextDue: '2024-12-31'
        }
      ])

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'consultation': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'violation': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Legal Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {userProfile?.username || 'Legal Professional'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
              
              <button
                onClick={() => navigate('/matching')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>New Case</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Cases</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCases}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Billable Hours</p>
                <p className="text-2xl font-bold text-gray-900">{stats.billableHours}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Compliance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.complianceScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{stats.monthlyRevenue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Active Cases */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Active Cases</h2>
                  <button
                    onClick={() => navigate('/cases')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {cases.map((case_) => (
                    <motion.div
                      key={case_.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/cases/${case_.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{case_.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                              {case_.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center">
                              <Building className="w-4 h-4 mr-1" />
                              <span>{case_.clientName}</span>
                            </div>
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 mr-1" />
                              <span>{case_.type}</span>
                            </div>
                            <div className={`flex items-center ${getPriorityColor(case_.priority)}`}>
                              <AlertCircle className="w-4 h-4 mr-1" />
                              <span className="capitalize">{case_.priority} Priority</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Last activity: {case_.lastActivity}</span>
                            {case_.nextDeadline && (
                              <span className="text-red-600">Due: {case_.nextDeadline}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <div className="text-lg font-bold text-gray-900">{case_.estimatedValue}</div>
                          <div className="text-sm text-gray-600">{case_.billableHours}h logged</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Client Communications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Recent Communications</h2>
                  <button
                    onClick={() => navigate('/chat')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {communications.map((comm) => (
                    <div
                      key={comm.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate('/chat')}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-gray-900">{comm.clientName}</div>
                        <div className="flex items-center space-x-2">
                          {comm.isUrgent && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          {comm.unreadCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                              {comm.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{comm.lastMessage}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{comm.caseType}</span>
                        <span>{comm.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Compliance Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Compliance Status</h2>
                  <button
                    onClick={() => navigate('/privacy')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Shield className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {compliance.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        {item.nextDue && (
                          <div className="text-xs text-gray-500">Due: {item.nextDue}</div>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplianceColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/matching')}
                  className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Scale className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Find New Cases</span>
                </button>
                
                <button
                  onClick={() => navigate('/chat')}
                  className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Client Messages</span>
                </button>
                
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Settings</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default LegalDashboard
