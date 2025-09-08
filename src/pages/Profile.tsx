import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Shield,
  Scale,
  Briefcase,
  Award,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Building,
  GraduationCap,
  FileText,
  Clock,
  DollarSign
} from 'lucide-react'
import { zkAuth } from '../lib/midnight/zkAuthentication'

interface LegalProfile {
  anonymousName: string
  barNumber: string
  jurisdiction: string[]
  lawSchool: string
  admissionYear: number
  specializations: string[]
  yearsExperience: number
  firmName: string
  firmSize: string
  hourlyRate: number
  casesWon: number
  casesTotal: number
  clientRating: number
  responseTime: string
  languages: string[]
  trialExperience: boolean
  barCompliance: boolean
  malpracticeInsurance: boolean
}

const LegalProfilePage = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<LegalProfile>({
    anonymousName: 'Attorney_Phoenix',
    barNumber: '***-***-1234',
    jurisdiction: ['California', 'New York'],
    lawSchool: 'Stanford Law School',
    admissionYear: 2018,
    specializations: ['Corporate Law', 'Securities', 'M&A'],
    yearsExperience: 6,
    firmName: 'Confidential',
    firmSize: 'Large Firm (50+ attorneys)',
    hourlyRate: 450,
    casesWon: 47,
    casesTotal: 52,
    clientRating: 4.8,
    responseTime: 'Within 2 hours',
    languages: ['English', 'Spanish'],
    trialExperience: true,
    barCompliance: true,
    malpracticeInsurance: true
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const identity = zkAuth.getCurrentIdentity()
      if (identity) {
        setProfile(prev => ({
          ...prev,
          anonymousName: identity.username
        }))
      }

      const savedProfile = localStorage.getItem('legalProfile')
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile)
        setProfile(prev => ({ ...prev, ...parsed }))
        setEditedProfile(prev => ({ ...prev, ...parsed }))
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const saveProfile = async () => {
    setLoading(true)
    try {
      localStorage.setItem('legalProfile', JSON.stringify(editedProfile))
      setProfile(editedProfile)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const winRate = profile.casesTotal > 0 ? (profile.casesWon / profile.casesTotal * 100).toFixed(1) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Legal Professional Profile</h1>
            <p className="text-gray-600">Your anonymous professional credentials and practice information</p>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={saveProfile}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Identity</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Anonymous Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.anonymousName}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, anonymousName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.anonymousName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bar Number (Encrypted)</label>
                  <p className="text-gray-900 font-mono">{profile.barNumber}</p>
                  <p className="text-xs text-gray-500">Verified but never displayed publicly</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Law School</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.lawSchool}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, lawSchool: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.lawSchool}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bar Admission Year</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedProfile.admissionYear}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, admissionYear: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.admissionYear}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Practice Areas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Practice Areas & Experience</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                  <div className="flex flex-wrap gap-2">
                    {profile.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                    <p className="text-2xl font-bold text-blue-600">{profile.yearsExperience}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
                    <p className="text-2xl font-bold text-green-600">${profile.hourlyRate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Case Statistics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Case Performance</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{profile.casesTotal}</div>
                  <div className="text-sm text-gray-600">Total Cases</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{profile.casesWon}</div>
                  <div className="text-sm text-gray-600">Cases Won</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">{winRate}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Compliance Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bar Compliance</span>
                  {profile.barCompliance ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Malpractice Insurance</span>
                  {profile.malpracticeInsurance ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trial Experience</span>
                  {profile.trialExperience ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Client Rating */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Feedback</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-500">{profile.clientRating}</div>
                <div className="flex justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(profile.clientRating)
                          ? 'text-amber-400'
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600 mt-1">Average Client Rating</div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Response Time: {profile.responseTime}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    Jurisdictions: {profile.jurisdiction.join(', ')}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Building className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">{profile.firmSize}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full flex items-center px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Shield className="w-4 h-4 mr-3" />
                  Professional Settings
                </button>
                
                <button
                  onClick={() => navigate('/privacy')}
                  className="w-full flex items-center px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Scale className="w-4 h-4 mr-3" />
                  Privacy & Compliance
                </button>
                
                <button
                  onClick={() => navigate('/matching')}
                  className="w-full flex items-center px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Briefcase className="w-4 h-4 mr-3" />
                  Find Cases
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LegalProfilePage
