import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Shield,
  Lock,
  Key,
  Bell,
  Download,
  Upload,
  Settings,
  User,
  Save,
  RotateCcw,
  Scale,
  Briefcase,
  FileText,
  Gavel,
  Building,
  Globe,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import { zkAuth } from '../lib/midnight/zkAuthentication'

interface LegalProfessionalSettings {
  profile: {
    anonymousName: string
    barNumber: string
    jurisdiction: string[]
    lawSchool: string
    admissionYear: number
    firmName: string
    firmSize: 'solo' | 'small' | 'medium' | 'large'
  }
  practice: {
    specializations: string[]
    yearsExperience: number
    trialExperience: boolean
    languages: string[]
    maxCaseload: number
    hourlyRate: number
    feeStructure: 'hourly' | 'contingency' | 'flat' | 'hybrid'
  }
  availability: {
    timezone: string
    workingHours: {
      start: string
      end: string
    }
    availableDays: string[]
    responseTime: 'immediate' | 'within_hour' | 'within_day' | 'within_week'
    emergencyAvailable: boolean
  }
  communication: {
    privilegedMessaging: boolean
    encryptedDocuments: boolean
    clientPortalAccess: boolean
    videoConferencing: boolean
    phoneConsultations: boolean
    emailEncryption: boolean
  }
  compliance: {
    malpracticeInsurance: boolean
    barCompliance: boolean
    cle: {
      hoursCompleted: number
      hoursRequired: number
      expirationDate: string
    }
    conflictChecking: boolean
    clientTrustAccount: boolean
    recordRetention: number
  }
  privacy: {
    anonymityLevel: 'basic' | 'enhanced' | 'maximum'
    clientConfidentiality: boolean
    workProductProtection: boolean
    metadataStripping: boolean
    zkProofLevel: 'standard' | 'enhanced'
  }
  notifications: {
    newCases: boolean
    clientMessages: boolean
    courtDeadlines: boolean
    complianceAlerts: boolean
    systemUpdates: boolean
    emailNotifications: boolean
  }
}

const LegalProfessionalSettingsPage = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('profile')
  const [settings, setSettings] = useState<LegalProfessionalSettings>({
    profile: {
      anonymousName: '',
      barNumber: '',
      jurisdiction: ['California'],
      lawSchool: '',
      admissionYear: 2020,
      firmName: '',
      firmSize: 'solo'
    },
    practice: {
      specializations: ['Corporate Law'],
      yearsExperience: 5,
      trialExperience: false,
      languages: ['English'],
      maxCaseload: 20,
      hourlyRate: 350,
      feeStructure: 'hourly'
    },
    availability: {
      timezone: 'America/Los_Angeles',
      workingHours: {
        start: '09:00',
        end: '17:00'
      },
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      responseTime: 'within_hour',
      emergencyAvailable: false
    },
    communication: {
      privilegedMessaging: true,
      encryptedDocuments: true,
      clientPortalAccess: true,
      videoConferencing: true,
      phoneConsultations: true,
      emailEncryption: true
    },
    compliance: {
      malpracticeInsurance: true,
      barCompliance: true,
      cle: {
        hoursCompleted: 15,
        hoursRequired: 25,
        expirationDate: '2024-12-31'
      },
      conflictChecking: true,
      clientTrustAccount: false,
      recordRetention: 7
    },
    privacy: {
      anonymityLevel: 'enhanced',
      clientConfidentiality: true,
      workProductProtection: true,
      metadataStripping: true,
      zkProofLevel: 'enhanced'
    },
    notifications: {
      newCases: true,
      clientMessages: true,
      courtDeadlines: true,
      complianceAlerts: true,
      systemUpdates: false,
      emailNotifications: true
    }
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const currentIdentity = zkAuth.getCurrentIdentity()
      if (currentIdentity) {
        setSettings(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            anonymousName: currentIdentity.username
          }
        }))
      }

      const savedSettings = localStorage.getItem('legalProfessionalSettings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const updateSetting = (section: keyof LegalProfessionalSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
    setHasChanges(true)
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      localStorage.setItem('legalProfessionalSettings', JSON.stringify(settings))
      setHasChanges(false)
      setTimeout(() => setSaving(false), 1000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaving(false)
    }
  }

  const exportSettings = () => {
    const exportData = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `legalmatch-settings-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const sections = [
    { id: 'profile', name: 'Professional Profile', icon: User },
    { id: 'practice', name: 'Practice Areas', icon: Briefcase },
    { id: 'availability', name: 'Availability', icon: Clock },
    { id: 'communication', name: 'Client Communication', icon: FileText },
    { id: 'compliance', name: 'Legal Compliance', icon: Scale },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-blue-600 hover:text-blue-700 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Legal Professional Settings</h1>
              <p className="text-gray-600">Manage your practice preferences and compliance</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={exportSettings}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="w-5 h-5 mr-3" />
                    {section.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {activeSection === 'profile' && (
                <ProfileSettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'practice' && (
                <PracticeSettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'availability' && (
                <AvailabilitySettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'communication' && (
                <CommunicationSettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'compliance' && (
                <ComplianceSettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'privacy' && (
                <PrivacySettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'notifications' && (
                <NotificationSettings settings={settings} updateSetting={updateSetting} />
              )}
            </div>

            {/* Save Bar */}
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-6 right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">You have unsaved changes</span>
                  <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const ProfileSettings: React.FC<{ settings: LegalProfessionalSettings; updateSetting: (section: keyof LegalProfessionalSettings, key: string, value: any) => void }> = ({ settings, updateSetting }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Profile</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Anonymous Professional Name</label>
        <input
          type="text"
          value={settings.profile.anonymousName}
          onChange={(e) => updateSetting('profile', 'anonymousName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">How you'll appear to potential clients</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bar Number (Encrypted)</label>
        <input
          type="text"
          value={settings.profile.barNumber}
          onChange={(e) => updateSetting('profile', 'barNumber', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">Used for verification only, never displayed publicly</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Law School</label>
        <input
          type="text"
          value={settings.profile.lawSchool}
          onChange={(e) => updateSetting('profile', 'lawSchool', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bar Admission Year</label>
        <input
          type="number"
          value={settings.profile.admissionYear}
          onChange={(e) => updateSetting('profile', 'admissionYear', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Firm Size</label>
        <select
          value={settings.profile.firmSize}
          onChange={(e) => updateSetting('profile', 'firmSize', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="solo">Solo Practice</option>
          <option value="small">Small Firm (2-10 attorneys)</option>
          <option value="medium">Medium Firm (11-50 attorneys)</option>
          <option value="large">Large Firm (50+ attorneys)</option>
        </select>
      </div>
    </div>
  </div>
)

const PracticeSettings: React.FC<{ settings: LegalProfessionalSettings; updateSetting: (section: keyof LegalProfessionalSettings, key: string, value: any) => void }> = ({ settings, updateSetting }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Practice Areas & Experience</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
        <input
          type="number"
          value={settings.practice.yearsExperience}
          onChange={(e) => updateSetting('practice', 'yearsExperience', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
        <input
          type="number"
          value={settings.practice.hourlyRate}
          onChange={(e) => updateSetting('practice', 'hourlyRate', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fee Structure</label>
        <select
          value={settings.practice.feeStructure}
          onChange={(e) => updateSetting('practice', 'feeStructure', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="hourly">Hourly</option>
          <option value="contingency">Contingency</option>
          <option value="flat">Flat Fee</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      <ToggleSetting
        label="Trial Experience"
        description="I have courtroom trial experience"
        checked={settings.practice.trialExperience}
        onChange={(checked) => updateSetting('practice', 'trialExperience', checked)}
      />
    </div>
  </div>
)

const AvailabilitySettings: React.FC<{ settings: LegalProfessionalSettings; updateSetting: (section: keyof LegalProfessionalSettings, key: string, value: any) => void }> = ({ settings, updateSetting }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Availability Settings</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
        <select
          value={settings.availability.responseTime}
          onChange={(e) => updateSetting('availability', 'responseTime', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="immediate">Immediate (within 15 minutes)</option>
          <option value="within_hour">Within 1 hour</option>
          <option value="within_day">Within 24 hours</option>
          <option value="within_week">Within 1 week</option>
        </select>
      </div>

      <ToggleSetting
        label="Emergency Availability"
        description="Available for urgent legal matters outside business hours"
        checked={settings.availability.emergencyAvailable}
        onChange={(checked) => updateSetting('availability', 'emergencyAvailable', checked)}
      />
    </div>
  </div>
)

const CommunicationSettings: React.FC<{ settings: LegalProfessionalSettings; updateSetting: (section: keyof LegalProfessionalSettings, key: string, value: any) => void }> = ({ settings, updateSetting }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Client Communication</h2>
    <div className="space-y-6">
      <ToggleSetting
        label="Privileged Messaging"
        description="Enable attorney-client privileged communications"
        checked={settings.communication.privilegedMessaging}
        onChange={(checked) => updateSetting('communication', 'privilegedMessaging', checked)}
      />

      <ToggleSetting
        label="Encrypted Documents"
        description="All document sharing uses end-to-end encryption"
        checked={settings.communication.encryptedDocuments}
        onChange={(checked) => updateSetting('communication', 'encryptedDocuments', checked)}
      />

      <ToggleSetting
        label="Video Conferencing"
        description="Available for secure video consultations"
        checked={settings.communication.videoConferencing}
        onChange={(checked) => updateSetting('communication', 'videoConferencing', checked)}
      />
    </div>
  </div>
)

const ComplianceSettings: React.FC<{ settings: LegalProfessionalSettings; updateSetting: (section: keyof LegalProfessionalSettings, key: string, value: any) => void }> = ({ settings, updateSetting }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Legal Compliance</h2>
    <div className="space-y-6">
      <ToggleSetting
        label="Malpractice Insurance"
        description="I maintain current professional liability insurance"
        checked={settings.compliance.malpracticeInsurance}
        onChange={(checked) => updateSetting('compliance', 'malpracticeInsurance', checked)}
      />

      <ToggleSetting
        label="Bar Compliance"
        description="I am in good standing with all bar associations"
        checked={settings.compliance.barCompliance}
        onChange={(checked) => updateSetting('compliance', 'barCompliance', checked)}
      />

      <ToggleSetting
        label="Conflict Checking"
        description="Enable automated conflict of interest checking"
        checked={settings.compliance.conflictChecking}
        onChange={(checked) => updateSetting('compliance', 'conflictChecking', checked)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Record Retention (years)</label>
        <select
          value={settings.compliance.recordRetention}
          onChange={(e) => updateSetting('compliance', 'recordRetention', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={5}>5 years</option>
          <option value={7}>7 years</option>
          <option value={10}>10 years</option>
          <option value={-1}>Indefinite</option>
        </select>
      </div>
    </div>
  </div>
)

const PrivacySettings: React.FC<{ settings: LegalProfessionalSettings; updateSetting: (section: keyof LegalProfessionalSettings, key: string, value: any) => void }> = ({ settings, updateSetting }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy & Security</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Privacy Level</label>
        <div className="space-y-3">
          {(['basic', 'enhanced', 'maximum'] as const).map((level) => (
            <label key={level} className="flex items-center space-x-3">
              <input
                type="radio"
                name="anonymityLevel"
                value={level}
                checked={settings.privacy.anonymityLevel === level}
                onChange={(e) => updateSetting('privacy', 'anonymityLevel', e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium capitalize">{level}</span>
                <p className="text-sm text-gray-500">
                  {level === 'basic' && 'Standard legal privacy protection'}
                  {level === 'enhanced' && 'Advanced privacy with metadata protection'}
                  {level === 'maximum' && 'Maximum privacy with zero-knowledge proofs'}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <ToggleSetting
        label="Client Confidentiality"
        description="Enforce attorney-client privilege protections"
        checked={settings.privacy.clientConfidentiality}
        onChange={(checked) => updateSetting('privacy', 'clientConfidentiality', checked)}
      />

      <ToggleSetting
        label="Work Product Protection"
        description="Protect attorney work product from disclosure"
        checked={settings.privacy.workProductProtection}
        onChange={(checked) => updateSetting('privacy', 'workProductProtection', checked)}
      />
    </div>
  </div>
)

const NotificationSettings: React.FC<{ settings: LegalProfessionalSettings; updateSetting: (section: keyof LegalProfessionalSettings, key: string, value: any) => void }> = ({ settings, updateSetting }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>
    <div className="space-y-6">
      <ToggleSetting
        label="New Cases"
        description="Notifications for new case matches"
        checked={settings.notifications.newCases}
        onChange={(checked) => updateSetting('notifications', 'newCases', checked)}
      />

      <ToggleSetting
        label="Client Messages"
        description="Notifications for client communications"
        checked={settings.notifications.clientMessages}
        onChange={(checked) => updateSetting('notifications', 'clientMessages', checked)}
      />

      <ToggleSetting
        label="Court Deadlines"
        description="Reminders for important legal deadlines"
        checked={settings.notifications.courtDeadlines}
        onChange={(checked) => updateSetting('notifications', 'courtDeadlines', checked)}
      />

      <ToggleSetting
        label="Compliance Alerts"
        description="Notifications about compliance requirements"
        checked={settings.notifications.complianceAlerts}
        onChange={(checked) => updateSetting('notifications', 'complianceAlerts', checked)}
      />
    </div>
  </div>
)

const ToggleSetting: React.FC<{
  label: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}> = ({ label, description, checked, disabled = false, onChange }) => (
  <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${disabled ? 'opacity-50' : ''}`}>
    <div className="flex-1">
      <h3 className="font-medium text-gray-900">{label}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
)

export default LegalProfessionalSettingsPage
