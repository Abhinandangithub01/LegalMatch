import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Shield,
  Lock,
  Key,
  Eye,
  Bell,
  Download,
  Upload,
  Settings,
  User,
  Database,
  Save,
  RotateCcw,
  EyeOff,
  Smartphone,
  Globe,
  Accessibility,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import { zkAuth } from '../lib/midnight/zkAuthentication'

interface UserSettings {
  profile: {
    anonymousName: string
    preferredPronouns: string
    timezone: string
    language: string
  }
  privacy: {
    anonymityLevel: 'basic' | 'enhanced' | 'maximum'
    showOnlineStatus: boolean
    allowDirectMessages: boolean
    shareActivityStatus: boolean
    dataMinimization: boolean
  }
  security: {
    twoFactorEnabled: boolean
    sessionTimeout: number
    deviceTrust: boolean
    biometricAuth: boolean
    keyRotationFreq: 'daily' | 'weekly' | 'monthly'
  }
  notifications: {
    groupMessages: boolean
    directMessages: boolean
    sessionReminders: boolean
    crisisAlerts: boolean
    systemUpdates: boolean
    emailNotifications: boolean
  }
  encryption: {
    keyDerivation: 'PBKDF2' | 'Argon2'
    encryptionStrength: '256' | '512'
    zkProofComplexity: 'standard' | 'enhanced'
    autoKeyRotation: boolean
  }
  storage: {
    localStorageLimit: number
    autoCleanup: boolean
    dataRetention: number
    backupFrequency: 'daily' | 'weekly' | 'monthly'
  }
  accessibility: {
    fontSize: 'small' | 'medium' | 'large'
    highContrast: boolean
    screenReader: boolean
    reducedMotion: boolean
    colorBlind: boolean
  }
}

const UserSettingsPage = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('profile')
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      anonymousName: '',
      preferredPronouns: 'they/them',
      timezone: 'UTC',
      language: 'English'
    },
    privacy: {
      anonymityLevel: 'enhanced',
      showOnlineStatus: false,
      allowDirectMessages: true,
      shareActivityStatus: false,
      dataMinimization: true
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      deviceTrust: true,
      biometricAuth: false,
      keyRotationFreq: 'weekly'
    },
    notifications: {
      groupMessages: true,
      directMessages: true,
      sessionReminders: true,
      crisisAlerts: true,
      systemUpdates: false,
      emailNotifications: false
    },
    encryption: {
      keyDerivation: 'Argon2',
      encryptionStrength: '256',
      zkProofComplexity: 'enhanced',
      autoKeyRotation: true
    },
    storage: {
      localStorageLimit: 100,
      autoCleanup: true,
      dataRetention: 30,
      backupFrequency: 'weekly'
    },
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      screenReader: false,
      reducedMotion: false,
      colorBlind: false
    }
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [exportData, setExportData] = useState<any>(null)

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

      const savedSettings = localStorage.getItem('userSettings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const updateSetting = (section: keyof UserSettings, key: string, value: any) => {
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
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings))
      
      // Update ZK identity if username changed
      if (settings.profile.anonymousName) {
        const currentIdentity = zkAuth.getCurrentIdentity()
        if (currentIdentity && currentIdentity.username !== settings.profile.anonymousName) {
          // Update identity username (this would need to be implemented in zkAuth)
          console.log('Username updated:', settings.profile.anonymousName)
        }
      }

      setHasChanges(false)
      // Show success message
      setTimeout(() => setSaving(false), 1000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaving(false)
    }
  }

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      loadSettings()
      setHasChanges(false)
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
    a.download = `healinghands-settings-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string)
          if (imported.settings) {
            setSettings(imported.settings)
            setHasChanges(true)
          }
        } catch (error) {
          console.error('Error importing settings:', error)
          alert('Invalid settings file')
        }
      }
      reader.readAsText(file)
    }
  }

  const sections = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'privacy', name: 'Privacy', icon: EyeOff },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'encryption', name: 'Encryption', icon: Key },
    { id: 'storage', name: 'Storage', icon: Database },
    { id: 'accessibility', name: 'Accessibility', icon: Accessibility }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your privacy, security, and preferences</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              className="hidden"
              id="import-settings"
            />
            <label
              htmlFor="import-settings"
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </label>
            
            <button
              onClick={exportSettings}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            
            <button
              onClick={resetSettings}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
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
            <div className="bg-white rounded-xl shadow-sm p-6">
              {activeSection === 'profile' && (
                <ProfileSettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'privacy' && (
                <PrivacySettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'security' && (
                <SecuritySettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'notifications' && (
                <NotificationSettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'encryption' && (
                <EncryptionSettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'storage' && (
                <StorageSettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'accessibility' && (
                <AccessibilitySettings settings={settings} updateSetting={updateSetting} />
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

const ProfileSettings: React.FC<{ settings: UserSettings; updateSetting: (section: keyof UserSettings, key: string, value: any) => void }> = ({ settings, updateSetting }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Anonymous Name</label>
        <input
          type="text"
          value={settings.profile.anonymousName}
          onChange={(e) => updateSetting('profile', 'anonymousName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">This is how you'll appear to other users</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Pronouns</label>
        <select
          value={settings.profile.preferredPronouns}
          onChange={(e) => updateSetting('profile', 'preferredPronouns', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="they/them">they/them</option>
          <option value="she/her">she/her</option>
          <option value="he/him">he/him</option>
          <option value="prefer not to say">prefer not to say</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
        <select
          value={settings.profile.timezone}
          onChange={(e) => updateSetting('profile', 'timezone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Chicago">Central Time</option>
          <option value="America/Denver">Mountain Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
          <option value="Europe/London">London</option>
          <option value="Europe/Paris">Paris</option>
          <option value="Asia/Tokyo">Tokyo</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
        <select
          value={settings.profile.language}
          onChange={(e) => updateSetting('profile', 'language', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="it">Italiano</option>
          <option value="pt">Português</option>
        </select>
      </div>
    </div>
  </div>
)

const PrivacySettings: React.FC<{ settings: UserSettings; updateSetting: (section: keyof UserSettings, key: string, value: any) => void }> = ({ settings, updateSetting }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Anonymity Level</label>
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
                  {level === 'basic' && 'Standard privacy protection'}
                  {level === 'enhanced' && 'Advanced privacy with metadata protection'}
                  {level === 'maximum' && 'Maximum privacy with traffic obfuscation'}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <ToggleSetting
        label="Show Online Status"
        description="Allow others to see when you're online"
        checked={settings.privacy.showOnlineStatus}
        onChange={(checked) => updateSetting('privacy', 'showOnlineStatus', checked)}
      />

      <ToggleSetting
        label="Allow Direct Messages"
        description="Let other users send you private messages"
        checked={settings.privacy.allowDirectMessages}
        onChange={(checked) => updateSetting('privacy', 'allowDirectMessages', checked)}
      />

      <ToggleSetting
        label="Share Activity Status"
        description="Show your current activity (in group, reading resources, etc.)"
        checked={settings.privacy.shareActivityStatus}
        onChange={(checked) => updateSetting('privacy', 'shareActivityStatus', checked)}
      />

      <ToggleSetting
        label="Data Minimization"
        description="Automatically delete unnecessary data and logs"
        checked={settings.privacy.dataMinimization}
        onChange={(checked) => updateSetting('privacy', 'dataMinimization', checked)}
      />
    </div>
  </div>
)

const SecuritySettings: React.FC<{ settings: UserSettings; updateSetting: (section: keyof UserSettings, key: string, value: any) => void }> = ({ settings, updateSetting }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
    <div className="space-y-6">
      <ToggleSetting
        label="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
        checked={settings.security.twoFactorEnabled}
        onChange={(checked) => updateSetting('security', 'twoFactorEnabled', checked)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
        <select
          value={settings.security.sessionTimeout}
          onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={120}>2 hours</option>
          <option value={480}>8 hours</option>
        </select>
      </div>

      <ToggleSetting
        label="Device Trust"
        description="Remember this device for faster login"
        checked={settings.security.deviceTrust}
        onChange={(checked) => updateSetting('security', 'deviceTrust', checked)}
      />

      <ToggleSetting
        label="Biometric Authentication"
        description="Use fingerprint or face recognition when available"
        checked={settings.security.biometricAuth}
        onChange={(checked) => updateSetting('security', 'biometricAuth', checked)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Key Rotation Frequency</label>
        <select
          value={settings.security.keyRotationFreq}
          onChange={(e) => updateSetting('security', 'keyRotationFreq', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    </div>
  </div>
)

const NotificationSettings: React.FC<{ settings: UserSettings; updateSetting: (section: keyof UserSettings, key: string, value: any) => void }> = ({ settings, updateSetting }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>
    <div className="space-y-6">
      <ToggleSetting
        label="Group Messages"
        description="Notifications for new messages in your support groups"
        checked={settings.notifications.groupMessages}
        onChange={(checked) => updateSetting('notifications', 'groupMessages', checked)}
      />

      <ToggleSetting
        label="Direct Messages"
        description="Notifications for private messages"
        checked={settings.notifications.directMessages}
        onChange={(checked) => updateSetting('notifications', 'directMessages', checked)}
      />

      <ToggleSetting
        label="Session Reminders"
        description="Reminders for upcoming scheduled sessions"
        checked={settings.notifications.sessionReminders}
        onChange={(checked) => updateSetting('notifications', 'sessionReminders', checked)}
      />

      <ToggleSetting
        label="Crisis Alerts"
        description="Important notifications about crisis resources"
        checked={settings.notifications.crisisAlerts}
        onChange={(checked) => updateSetting('notifications', 'crisisAlerts', checked)}
      />

      <ToggleSetting
        label="System Updates"
        description="Notifications about platform updates and maintenance"
        checked={settings.notifications.systemUpdates}
        onChange={(checked) => updateSetting('notifications', 'systemUpdates', checked)}
      />

      <ToggleSetting
        label="Email Notifications"
        description="Receive notifications via email (encrypted)"
        checked={settings.notifications.emailNotifications}
        onChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
      />
    </div>
  </div>
)

const EncryptionSettings: React.FC<{ settings: UserSettings; updateSetting: (section: keyof UserSettings, key: string, value: any) => void }> = ({ settings, updateSetting }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Encryption Settings</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Key Derivation Function</label>
        <select
          value={settings.encryption.keyDerivation}
          onChange={(e) => updateSetting('encryption', 'keyDerivation', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="PBKDF2">PBKDF2 (Standard)</option>
          <option value="Argon2">Argon2 (Recommended)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Encryption Strength</label>
        <select
          value={settings.encryption.encryptionStrength}
          onChange={(e) => updateSetting('encryption', 'encryptionStrength', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="256">256-bit (Standard)</option>
          <option value="512">512-bit (Enhanced)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">ZK Proof Complexity</label>
        <select
          value={settings.encryption.zkProofComplexity}
          onChange={(e) => updateSetting('encryption', 'zkProofComplexity', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="standard">Standard</option>
          <option value="enhanced">Enhanced</option>
        </select>
      </div>

      <ToggleSetting
        label="Auto Key Rotation"
        description="Automatically rotate encryption keys"
        checked={settings.encryption.autoKeyRotation}
        onChange={(checked) => updateSetting('encryption', 'autoKeyRotation', checked)}
      />
    </div>
  </div>
)

const StorageSettings: React.FC<{ settings: UserSettings; updateSetting: (section: keyof UserSettings, key: string, value: any) => void }> = ({ settings, updateSetting }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Storage Settings</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Local Storage Limit (MB)</label>
        <input
          type="number"
          value={settings.storage.localStorageLimit}
          onChange={(e) => updateSetting('storage', 'localStorageLimit', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <ToggleSetting
        label="Auto Cleanup"
        description="Automatically delete unnecessary data"
        checked={settings.storage.autoCleanup}
        onChange={(checked) => updateSetting('storage', 'autoCleanup', checked)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention (days)</label>
        <select
          value={settings.storage.dataRetention}
          onChange={(e) => updateSetting('storage', 'dataRetention', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={30}>30 days</option>
          <option value={90}>90 days</option>
          <option value={180}>6 months</option>
          <option value={365}>1 year</option>
          <option value={-1}>Never delete</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
        <select
          value={settings.storage.backupFrequency}
          onChange={(e) => updateSetting('storage', 'backupFrequency', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    </div>
  </div>
)

const AccessibilitySettings: React.FC<{ settings: UserSettings; updateSetting: (section: keyof UserSettings, key: string, value: any) => void }> = ({ settings, updateSetting }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Accessibility Settings</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
        <select
          value={settings.accessibility.fontSize}
          onChange={(e) => updateSetting('accessibility', 'fontSize', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <ToggleSetting
        label="High Contrast Mode"
        description="Increase contrast for better visibility"
        checked={settings.accessibility.highContrast}
        onChange={(checked) => updateSetting('accessibility', 'highContrast', checked)}
      />

      <ToggleSetting
        label="Screen Reader Support"
        description="Enhanced compatibility with screen readers"
        checked={settings.accessibility.screenReader}
        onChange={(checked) => updateSetting('accessibility', 'screenReader', checked)}
      />

      <ToggleSetting
        label="Reduced Motion"
        description="Minimize animations and transitions"
        checked={settings.accessibility.reducedMotion}
        onChange={(checked) => updateSetting('accessibility', 'reducedMotion', checked)}
      />

      <ToggleSetting
        label="Color Blind Mode"
        description="Adjust colors for better visibility"
        checked={settings.accessibility.colorBlind}
        onChange={(checked) => updateSetting('accessibility', 'colorBlind', checked)}
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

export default UserSettingsPage
