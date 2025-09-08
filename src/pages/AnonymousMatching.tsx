import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Scale,
  Shield,
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  DollarSign,
  FileText,
  Gavel,
  Building,
  User,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Award,
  Calendar,
  Lock,
  Eye,
  AlertCircle,
  Plus,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { zkAuth } from '../lib/midnight/zkAuthentication'

interface CaseDetails {
  caseType: string
  practiceArea: string
  description: string
  urgency: 'low' | 'medium' | 'high' | 'urgent'
  budget: string
  location: string
  preferredLanguage: string
  caseComplexity: 'simple' | 'moderate' | 'complex'
  timeframe: string
}

interface LawyerProfile {
  id: string
  anonymousName: string
  practiceAreas: string[]
  experience: number
  rating: number
  reviewCount: number
  hourlyRate: string
  location: string
  languages: string[]
  specializations: string[]
  availability: 'immediate' | 'within_week' | 'within_month'
  caseTypes: string[]
  successRate: number
  barAdmissions: string[]
  education: string
  matchScore: number
}

const practiceAreas = [
  'Corporate Law', 'Criminal Defense', 'Family Law', 'Personal Injury',
  'Real Estate', 'Employment Law', 'Immigration', 'Intellectual Property',
  'Tax Law', 'Bankruptcy', 'Contract Law', 'Civil Litigation',
  'Estate Planning', 'Environmental Law', 'Healthcare Law', 'Securities Law'
]

const caseTypes = [
  'Contract Dispute', 'Personal Injury Claim', 'Divorce/Custody', 'Criminal Defense',
  'Business Formation', 'Real Estate Transaction', 'Employment Issue', 'Immigration Matter',
  'Intellectual Property', 'Tax Problem', 'Bankruptcy Filing', 'Estate Planning',
  'Civil Lawsuit', 'Regulatory Compliance', 'Merger & Acquisition', 'Patent Application'
]

const LegalCaseMatching = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [caseDetails, setCaseDetails] = useState<CaseDetails>({
    caseType: '',
    practiceArea: '',
    description: '',
    urgency: 'medium',
    budget: '',
    location: '',
    preferredLanguage: 'English',
    caseComplexity: 'moderate',
    timeframe: ''
  })
  
  const [matches, setMatches] = useState<LawyerProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<LawyerProfile | null>(null)
  const [filters, setFilters] = useState({
    minRating: 0,
    maxRate: 1000,
    experience: 0,
    availability: 'any',
    location: 'any'
  })

  const mockLawyers: LawyerProfile[] = [
    {
      id: '1',
      anonymousName: 'CorporateCounsel_Alpha',
      practiceAreas: ['Corporate Law', 'Securities Law', 'Contract Law'],
      experience: 15,
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: '$450-650',
      location: 'New York, NY',
      languages: ['English', 'Spanish'],
      specializations: ['M&A', 'Securities Compliance', 'Corporate Governance'],
      availability: 'within_week',
      caseTypes: ['Business Formation', 'Merger & Acquisition', 'Contract Dispute'],
      successRate: 94,
      barAdmissions: ['NY', 'NJ', 'CT'],
      education: 'Harvard Law School',
      matchScore: 0
    },
    {
      id: '2',
      anonymousName: 'DefenseAttorney_Beta',
      practiceAreas: ['Criminal Defense', 'Civil Litigation'],
      experience: 12,
      rating: 4.8,
      reviewCount: 89,
      hourlyRate: '$300-450',
      location: 'Los Angeles, CA',
      languages: ['English'],
      specializations: ['White Collar Crime', 'DUI Defense', 'Federal Cases'],
      availability: 'immediate',
      caseTypes: ['Criminal Defense', 'Civil Lawsuit'],
      successRate: 87,
      barAdmissions: ['CA', 'NV'],
      education: 'UCLA School of Law',
      matchScore: 0
    },
    {
      id: '3',
      anonymousName: 'FamilyLaw_Gamma',
      practiceAreas: ['Family Law', 'Estate Planning'],
      experience: 8,
      rating: 4.7,
      reviewCount: 156,
      hourlyRate: '$250-350',
      location: 'Chicago, IL',
      languages: ['English', 'French'],
      specializations: ['Child Custody', 'Divorce Mediation', 'Prenuptial Agreements'],
      availability: 'within_week',
      caseTypes: ['Divorce/Custody', 'Estate Planning'],
      successRate: 91,
      barAdmissions: ['IL', 'WI'],
      education: 'Northwestern Law',
      matchScore: 0
    },
    {
      id: '4',
      anonymousName: 'InjuryAdvocate_Delta',
      practiceAreas: ['Personal Injury', 'Civil Litigation'],
      experience: 10,
      rating: 4.6,
      reviewCount: 203,
      hourlyRate: 'Contingency',
      location: 'Miami, FL',
      languages: ['English', 'Spanish'],
      specializations: ['Car Accidents', 'Medical Malpractice', 'Slip & Fall'],
      availability: 'immediate',
      caseTypes: ['Personal Injury Claim', 'Civil Lawsuit'],
      successRate: 89,
      barAdmissions: ['FL', 'GA'],
      education: 'University of Miami Law',
      matchScore: 0
    }
  ]

  const calculateMatchScore = (lawyer: LawyerProfile, caseDetails: CaseDetails): number => {
    let score = 0
    
    // Practice area match (40% weight)
    if (lawyer.practiceAreas.includes(caseDetails.practiceArea)) {
      score += 40
    }
    
    // Case type match (30% weight)
    if (lawyer.caseTypes.includes(caseDetails.caseType)) {
      score += 30
    }
    
    // Urgency and availability match (15% weight)
    if (caseDetails.urgency === 'urgent' && lawyer.availability === 'immediate') {
      score += 15
    } else if (caseDetails.urgency === 'high' && lawyer.availability !== 'within_month') {
      score += 10
    } else if (caseDetails.urgency === 'medium') {
      score += 8
    }
    
    // Rating bonus (10% weight)
    score += (lawyer.rating / 5) * 10
    
    // Experience bonus (5% weight)
    if (caseDetails.caseComplexity === 'complex' && lawyer.experience >= 10) {
      score += 5
    } else if (caseDetails.caseComplexity === 'moderate' && lawyer.experience >= 5) {
      score += 3
    }
    
    return Math.min(score, 100)
  }

  const findMatches = () => {
    setLoading(true)
    
    setTimeout(() => {
      const scoredLawyers = mockLawyers.map(lawyer => ({
        ...lawyer,
        matchScore: calculateMatchScore(lawyer, caseDetails)
      })).sort((a, b) => b.matchScore - a.matchScore)
      
      setMatches(scoredLawyers)
      setLoading(false)
      setStep(3)
    }, 2000)
  }

  const handleCaseSubmit = () => {
    if (!caseDetails.practiceArea || !caseDetails.caseType || !caseDetails.description) {
      alert('Please fill in all required fields')
      return
    }
    setStep(2)
    findMatches()
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'immediate': return 'text-green-600'
      case 'within_week': return 'text-yellow-600'
      case 'within_month': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Case Matching</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the perfect attorney for your legal matter using our intelligent matching system
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= stepNum 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-8">
            <span className="text-sm text-gray-600">Case Details</span>
            <span className="text-sm text-gray-600">Matching</span>
            <span className="text-sm text-gray-600">Results</span>
          </div>
        </div>

        {/* Step 1: Case Details Form */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Describe Your Legal Matter</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Practice Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Practice Area *
                </label>
                <select
                  value={caseDetails.practiceArea}
                  onChange={(e) => setCaseDetails({...caseDetails, practiceArea: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select practice area</option>
                  {practiceAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              {/* Case Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Type *
                </label>
                <select
                  value={caseDetails.caseType}
                  onChange={(e) => setCaseDetails({...caseDetails, caseType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select case type</option>
                  {caseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select
                  value={caseDetails.urgency}
                  onChange={(e) => setCaseDetails({...caseDetails, urgency: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low - No rush</option>
                  <option value="medium">Medium - Within a month</option>
                  <option value="high">High - Within a week</option>
                  <option value="urgent">Urgent - Immediate attention needed</option>
                </select>
              </div>

              {/* Case Complexity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Complexity
                </label>
                <select
                  value={caseDetails.caseComplexity}
                  onChange={(e) => setCaseDetails({...caseDetails, caseComplexity: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="simple">Simple - Straightforward matter</option>
                  <option value="moderate">Moderate - Some complexity</option>
                  <option value="complex">Complex - Highly specialized</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <select
                  value={caseDetails.budget}
                  onChange={(e) => setCaseDetails({...caseDetails, budget: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select budget range</option>
                  <option value="under-5k">Under $5,000</option>
                  <option value="5k-15k">$5,000 - $15,000</option>
                  <option value="15k-50k">$15,000 - $50,000</option>
                  <option value="50k-plus">$50,000+</option>
                  <option value="contingency">Contingency Fee</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Location
                </label>
                <input
                  type="text"
                  value={caseDetails.location}
                  onChange={(e) => setCaseDetails({...caseDetails, location: e.target.value})}
                  placeholder="City, State or 'Remote'"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Case Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Description *
              </label>
              <textarea
                value={caseDetails.description}
                onChange={(e) => setCaseDetails({...caseDetails, description: e.target.value})}
                placeholder="Please describe your legal matter in detail. Include relevant facts, timeline, and what outcome you're seeking..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Privacy Notice */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">Privacy Protected</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    Your case details are encrypted and anonymized. Lawyers will only see relevant information needed for matching.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleCaseSubmit}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>Find Matching Lawyers</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Loading */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Finding Your Perfect Match</h2>
            <p className="text-gray-600 mb-8">
              Our AI is analyzing your case details and matching you with qualified attorneys...
            </p>
            <div className="flex justify-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {matches.length} Matching Attorneys Found
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Ranked by compatibility with your case: {caseDetails.practiceArea} - {caseDetails.caseType}
                  </p>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                  {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200 grid md:grid-cols-4 gap-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="0">Any Rating</option>
                        <option value="4">4.0+ Stars</option>
                        <option value="4.5">4.5+ Stars</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="0">Any Experience</option>
                        <option value="5">5+ Years</option>
                        <option value="10">10+ Years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="any">Any Availability</option>
                        <option value="immediate">Immediate</option>
                        <option value="within_week">Within Week</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="any">Any Location</option>
                        <option value="local">Local Only</option>
                        <option value="remote">Remote OK</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Lawyer Matches */}
            <div className="space-y-4">
              {matches.map((lawyer, index) => (
                <motion.div
                  key={lawyer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-amber-600 rounded-full flex items-center justify-center">
                          <Gavel className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{lawyer.anonymousName}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span>{lawyer.rating} ({lawyer.reviewCount} reviews)</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{lawyer.experience} years experience</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Practice Areas</h4>
                          <div className="flex flex-wrap gap-2">
                            {lawyer.practiceAreas.map(area => (
                              <span
                                key={area}
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  area === caseDetails.practiceArea
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Specializations</h4>
                          <div className="flex flex-wrap gap-2">
                            {lawyer.specializations.map(spec => (
                              <span key={spec} className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{lawyer.location}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span>{lawyer.hourlyRate}</span>
                          </div>
                          <div className={`flex items-center ${getAvailabilityColor(lawyer.availability)}`}>
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="capitalize">{lawyer.availability.replace('_', ' ')}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Success Rate:</span>
                          <span className="font-medium text-green-600">{lawyer.successRate}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-blue-600">{lawyer.matchScore}%</div>
                        <div className="text-xs text-gray-500">Match Score</div>
                      </div>
                      
                      <div className="space-y-2">
                        <button
                          onClick={() => navigate('/chat')}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Contact</span>
                        </button>
                        <button
                          onClick={() => setSelectedMatch(lawyer)}
                          className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* New Search Button */}
            <div className="text-center">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Start New Search
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default LegalCaseMatching
