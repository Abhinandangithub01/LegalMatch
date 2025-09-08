import CryptoJS from 'crypto-js'
import { zkAuth } from './zkAuthentication'

export interface CaseRequirements {
  practiceArea: string
  caseType: string
  complexity: 'simple' | 'moderate' | 'complex' | 'highly-complex'
  urgency: 'low' | 'medium' | 'high' | 'urgent'
  budget: {
    min: number
    max: number
    type: 'hourly' | 'flat-fee' | 'contingency'
  }
  location: {
    state: string
    city?: string
    remote: boolean
  }
  languagePreference?: string[]
  trialExperienceRequired: boolean
  firmSizePreference?: 'solo' | 'small' | 'medium' | 'large'
  description: string
}

export interface AttorneyProfile {
  id: string
  anonymousName: string
  practiceAreas: string[]
  specializations: string[]
  yearsExperience: number
  jurisdiction: string[]
  hourlyRate: number
  acceptsContingency: boolean
  acceptsFlatFee: boolean
  firmSize: 'solo' | 'small' | 'medium' | 'large'
  languages: string[]
  trialExperience: boolean
  clientRating: number
  casesWon: number
  casesTotal: number
  responseTime: string
  availability: 'immediate' | 'within-week' | 'within-month' | 'limited'
  barCompliance: boolean
  malpracticeInsurance: boolean
  lastActive: string
}

export interface MatchResult {
  attorney: AttorneyProfile
  matchScore: number
  matchReasons: string[]
  concerns: string[]
  estimatedCost: {
    min: number
    max: number
    type: string
  }
  confidence: 'low' | 'medium' | 'high' | 'excellent'
}

export interface CaseMatchingRequest {
  id: string
  clientId: string
  requirements: CaseRequirements
  createdAt: string
  status: 'pending' | 'matched' | 'declined' | 'expired'
  matches: MatchResult[]
  selectedAttorneyId?: string
}

class LegalCaseMatchingEngine {
  private attorneys: AttorneyProfile[] = []
  private matchingRequests: CaseMatchingRequest[] = []

  constructor() {
    this.loadFromStorage()
    this.initializeMockAttorneys()
  }

  private loadFromStorage(): void {
    try {
      const attorneysData = localStorage.getItem('legal_attorneys')
      const requestsData = localStorage.getItem('matching_requests')

      if (attorneysData) {
        this.attorneys = JSON.parse(attorneysData)
      }

      if (requestsData) {
        this.matchingRequests = JSON.parse(requestsData)
      }
    } catch (error) {
      console.error('Failed to load matching data from storage:', error)
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('legal_attorneys', JSON.stringify(this.attorneys))
      localStorage.setItem('matching_requests', JSON.stringify(this.matchingRequests))
    } catch (error) {
      console.error('Failed to save matching data to storage:', error)
    }
  }

  private initializeMockAttorneys(): void {
    if (this.attorneys.length === 0) {
      const mockAttorneys: AttorneyProfile[] = [
        {
          id: 'attorney_001',
          anonymousName: 'CorporateCounsel_Alpha',
          practiceAreas: ['Corporate Law', 'Securities', 'M&A'],
          specializations: ['Public Offerings', 'Private Equity', 'Corporate Governance'],
          yearsExperience: 12,
          jurisdiction: ['NY', 'DE', 'CA'],
          hourlyRate: 650,
          acceptsContingency: false,
          acceptsFlatFee: true,
          firmSize: 'large',
          languages: ['English'],
          trialExperience: false,
          clientRating: 4.8,
          casesWon: 89,
          casesTotal: 95,
          responseTime: 'Within 2 hours',
          availability: 'within-week',
          barCompliance: true,
          malpracticeInsurance: true,
          lastActive: new Date().toISOString()
        },
        {
          id: 'attorney_002',
          anonymousName: 'LitigationLion_Beta',
          practiceAreas: ['Civil Litigation', 'Commercial Disputes', 'Employment Law'],
          specializations: ['Class Actions', 'Contract Disputes', 'Wrongful Termination'],
          yearsExperience: 15,
          jurisdiction: ['NY', 'NJ', 'CT'],
          hourlyRate: 550,
          acceptsContingency: true,
          acceptsFlatFee: false,
          firmSize: 'medium',
          languages: ['English', 'Spanish'],
          trialExperience: true,
          clientRating: 4.9,
          casesWon: 127,
          casesTotal: 142,
          responseTime: 'Within 4 hours',
          availability: 'immediate',
          barCompliance: true,
          malpracticeInsurance: true,
          lastActive: new Date().toISOString()
        },
        {
          id: 'attorney_003',
          anonymousName: 'FamilyAdvocate_Gamma',
          practiceAreas: ['Family Law', 'Divorce', 'Child Custody'],
          specializations: ['High-Asset Divorce', 'International Custody', 'Prenuptial Agreements'],
          yearsExperience: 8,
          jurisdiction: ['CA', 'NV'],
          hourlyRate: 400,
          acceptsContingency: false,
          acceptsFlatFee: true,
          firmSize: 'small',
          languages: ['English', 'Mandarin'],
          trialExperience: true,
          clientRating: 4.7,
          casesWon: 78,
          casesTotal: 89,
          responseTime: 'Within 6 hours',
          availability: 'within-week',
          barCompliance: true,
          malpracticeInsurance: true,
          lastActive: new Date().toISOString()
        },
        {
          id: 'attorney_004',
          anonymousName: 'CriminalDefender_Delta',
          practiceAreas: ['Criminal Defense', 'DUI', 'White Collar Crime'],
          specializations: ['Federal Crimes', 'Financial Fraud', 'Drug Offenses'],
          yearsExperience: 18,
          jurisdiction: ['TX', 'OK', 'LA'],
          hourlyRate: 500,
          acceptsContingency: false,
          acceptsFlatFee: true,
          firmSize: 'solo',
          languages: ['English', 'Spanish'],
          trialExperience: true,
          clientRating: 4.6,
          casesWon: 156,
          casesTotal: 189,
          responseTime: 'Within 1 hour',
          availability: 'immediate',
          barCompliance: true,
          malpracticeInsurance: true,
          lastActive: new Date().toISOString()
        },
        {
          id: 'attorney_005',
          anonymousName: 'IntellectualProperty_Epsilon',
          practiceAreas: ['Intellectual Property', 'Patent Law', 'Trademark'],
          specializations: ['Software Patents', 'Trademark Prosecution', 'IP Litigation'],
          yearsExperience: 10,
          jurisdiction: ['CA', 'WA', 'OR'],
          hourlyRate: 600,
          acceptsContingency: true,
          acceptsFlatFee: true,
          firmSize: 'medium',
          languages: ['English', 'Korean'],
          trialExperience: true,
          clientRating: 4.8,
          casesWon: 92,
          casesTotal: 98,
          responseTime: 'Within 3 hours',
          availability: 'within-month',
          barCompliance: true,
          malpracticeInsurance: true,
          lastActive: new Date().toISOString()
        }
      ]

      this.attorneys = mockAttorneys
      this.saveToStorage()
    }
  }

  private generateId(): string {
    return CryptoJS.lib.WordArray.random(16).toString()
  }

  private calculateMatchScore(attorney: AttorneyProfile, requirements: CaseRequirements): {
    score: number
    reasons: string[]
    concerns: string[]
  } {
    let score = 0
    const reasons: string[] = []
    const concerns: string[] = []
    const maxScore = 100

    // Practice area match (25 points)
    const practiceAreaMatch = attorney.practiceAreas.some(area => 
      area.toLowerCase().includes(requirements.practiceArea.toLowerCase()) ||
      requirements.practiceArea.toLowerCase().includes(area.toLowerCase())
    )
    
    if (practiceAreaMatch) {
      score += 25
      reasons.push(`Specializes in ${requirements.practiceArea}`)
    } else {
      concerns.push(`No direct experience in ${requirements.practiceArea}`)
    }

    // Jurisdiction match (20 points)
    const jurisdictionMatch = attorney.jurisdiction.includes(requirements.location.state)
    if (jurisdictionMatch) {
      score += 20
      reasons.push(`Licensed in ${requirements.location.state}`)
    } else if (requirements.location.remote) {
      score += 10
      reasons.push('Available for remote consultation')
    } else {
      concerns.push(`Not licensed in ${requirements.location.state}`)
    }

    // Budget compatibility (15 points)
    const budgetCompatible = attorney.hourlyRate >= requirements.budget.min && 
                            attorney.hourlyRate <= requirements.budget.max
    
    if (budgetCompatible) {
      score += 15
      reasons.push('Rate within budget range')
    } else if (attorney.hourlyRate > requirements.budget.max) {
      concerns.push('Hourly rate exceeds budget')
    } else {
      concerns.push('Rate below minimum (quality concern)')
    }

    // Payment type compatibility (10 points)
    if (requirements.budget.type === 'contingency' && attorney.acceptsContingency) {
      score += 10
      reasons.push('Accepts contingency fee arrangements')
    } else if (requirements.budget.type === 'flat-fee' && attorney.acceptsFlatFee) {
      score += 10
      reasons.push('Offers flat fee pricing')
    } else if (requirements.budget.type === 'hourly') {
      score += 10
      reasons.push('Standard hourly billing available')
    } else {
      concerns.push(`Does not accept ${requirements.budget.type} payment`)
    }

    // Experience level (10 points)
    const complexityExperienceMap = {
      'simple': 2,
      'moderate': 5,
      'complex': 8,
      'highly-complex': 12
    }
    
    const requiredExperience = complexityExperienceMap[requirements.complexity]
    if (attorney.yearsExperience >= requiredExperience) {
      score += 10
      reasons.push(`${attorney.yearsExperience} years experience for ${requirements.complexity} case`)
    } else {
      const deficit = requiredExperience - attorney.yearsExperience
      score += Math.max(0, 10 - deficit * 2)
      concerns.push(`May lack experience for ${requirements.complexity} case complexity`)
    }

    // Trial experience (5 points)
    if (requirements.trialExperienceRequired) {
      if (attorney.trialExperience) {
        score += 5
        reasons.push('Experienced trial attorney')
      } else {
        concerns.push('No trial experience')
      }
    } else {
      score += 5 // No requirement, so full points
    }

    // Client rating (5 points)
    const ratingScore = Math.round((attorney.clientRating / 5) * 5)
    score += ratingScore
    if (attorney.clientRating >= 4.5) {
      reasons.push(`Excellent client rating (${attorney.clientRating}/5)`)
    } else if (attorney.clientRating >= 4.0) {
      reasons.push(`Good client rating (${attorney.clientRating}/5)`)
    } else {
      concerns.push(`Below average client rating (${attorney.clientRating}/5)`)
    }

    // Success rate (5 points)
    const successRate = attorney.casesTotal > 0 ? attorney.casesWon / attorney.casesTotal : 0
    const successScore = Math.round(successRate * 5)
    score += successScore
    if (successRate >= 0.85) {
      reasons.push(`High success rate (${Math.round(successRate * 100)}%)`)
    } else if (successRate >= 0.70) {
      reasons.push(`Good success rate (${Math.round(successRate * 100)}%)`)
    } else {
      concerns.push(`Lower success rate (${Math.round(successRate * 100)}%)`)
    }

    // Availability (3 points)
    const availabilityScore = {
      'immediate': 3,
      'within-week': 2,
      'within-month': 1,
      'limited': 0
    }
    
    score += availabilityScore[attorney.availability]
    if (attorney.availability === 'immediate' && requirements.urgency === 'urgent') {
      reasons.push('Immediately available for urgent case')
    } else if (attorney.availability === 'limited') {
      concerns.push('Limited availability')
    }

    // Language preference (2 points)
    if (requirements.languagePreference) {
      const languageMatch = requirements.languagePreference.some(lang => 
        attorney.languages.includes(lang)
      )
      if (languageMatch) {
        score += 2
        reasons.push('Speaks preferred language')
      } else {
        concerns.push('Language preference not available')
      }
    } else {
      score += 2 // No preference, so full points
    }

    // Compliance status (bonus/penalty)
    if (attorney.barCompliance && attorney.malpracticeInsurance) {
      reasons.push('Fully compliant (bar + insurance)')
    } else {
      score -= 10
      concerns.push('Compliance issues detected')
    }

    return {
      score: Math.min(maxScore, Math.max(0, score)),
      reasons,
      concerns
    }
  }

  private estimateCost(attorney: AttorneyProfile, requirements: CaseRequirements): {
    min: number
    max: number
    type: string
  } {
    const complexityMultipliers = {
      'simple': { min: 5, max: 15 },
      'moderate': { min: 15, max: 40 },
      'complex': { min: 40, max: 100 },
      'highly-complex': { min: 100, max: 300 }
    }

    const multiplier = complexityMultipliers[requirements.complexity]
    
    if (requirements.budget.type === 'contingency') {
      // Estimate case value for contingency
      const estimatedValue = attorney.hourlyRate * multiplier.max
      return {
        min: estimatedValue * 0.25, // 25% contingency
        max: estimatedValue * 0.40, // 40% contingency
        type: 'Contingency Fee (25-40% of recovery)'
      }
    } else if (requirements.budget.type === 'flat-fee') {
      return {
        min: attorney.hourlyRate * multiplier.min * 0.8,
        max: attorney.hourlyRate * multiplier.max * 0.8,
        type: 'Flat Fee'
      }
    } else {
      return {
        min: attorney.hourlyRate * multiplier.min,
        max: attorney.hourlyRate * multiplier.max,
        type: 'Hourly Rate'
      }
    }
  }

  private determineConfidence(score: number): 'low' | 'medium' | 'high' | 'excellent' {
    if (score >= 85) return 'excellent'
    if (score >= 70) return 'high'
    if (score >= 50) return 'medium'
    return 'low'
  }

  async findMatches(requirements: CaseRequirements): Promise<MatchResult[]> {
    const matches: MatchResult[] = []

    for (const attorney of this.attorneys) {
      const matchAnalysis = this.calculateMatchScore(attorney, requirements)
      
      // Only include matches with score > 30
      if (matchAnalysis.score > 30) {
        const estimatedCost = this.estimateCost(attorney, requirements)
        const confidence = this.determineConfidence(matchAnalysis.score)

        matches.push({
          attorney,
          matchScore: matchAnalysis.score,
          matchReasons: matchAnalysis.reasons,
          concerns: matchAnalysis.concerns,
          estimatedCost,
          confidence
        })
      }
    }

    // Sort by match score (highest first)
    matches.sort((a, b) => b.matchScore - a.matchScore)

    // Return top 5 matches
    return matches.slice(0, 5)
  }

  async createMatchingRequest(requirements: CaseRequirements): Promise<CaseMatchingRequest> {
    const identity = zkAuth.getCurrentIdentity()
    if (!identity) {
      throw new Error('No identity found for matching request')
    }

    const matches = await this.findMatches(requirements)
    
    const request: CaseMatchingRequest = {
      id: this.generateId(),
      clientId: identity.id,
      requirements,
      createdAt: new Date().toISOString(),
      status: 'pending',
      matches
    }

    this.matchingRequests.push(request)
    this.saveToStorage()

    return request
  }

  getMatchingRequests(clientId?: string): CaseMatchingRequest[] {
    if (clientId) {
      return this.matchingRequests.filter(req => req.clientId === clientId)
    }
    return this.matchingRequests
  }

  getMatchingRequest(requestId: string): CaseMatchingRequest | undefined {
    return this.matchingRequests.find(req => req.id === requestId)
  }

  async selectAttorney(requestId: string, attorneyId: string): Promise<boolean> {
    const request = this.matchingRequests.find(req => req.id === requestId)
    if (!request) return false

    const selectedMatch = request.matches.find(match => match.attorney.id === attorneyId)
    if (!selectedMatch) return false

    request.selectedAttorneyId = attorneyId
    request.status = 'matched'
    
    this.saveToStorage()
    return true
  }

  getAttorneyProfiles(): AttorneyProfile[] {
    return this.attorneys
  }

  addAttorneyProfile(profile: Omit<AttorneyProfile, 'id' | 'lastActive'>): AttorneyProfile {
    const newProfile: AttorneyProfile = {
      ...profile,
      id: this.generateId(),
      lastActive: new Date().toISOString()
    }

    this.attorneys.push(newProfile)
    this.saveToStorage()
    
    return newProfile
  }

  updateAttorneyProfile(attorneyId: string, updates: Partial<AttorneyProfile>): boolean {
    const attorney = this.attorneys.find(a => a.id === attorneyId)
    if (!attorney) return false

    Object.assign(attorney, updates, { lastActive: new Date().toISOString() })
    this.saveToStorage()
    
    return true
  }

  getMatchingStatistics(): {
    totalRequests: number
    successfulMatches: number
    averageMatchScore: number
    topPracticeAreas: { area: string; count: number }[]
  } {
    const totalRequests = this.matchingRequests.length
    const successfulMatches = this.matchingRequests.filter(req => req.status === 'matched').length
    
    const allScores = this.matchingRequests.flatMap(req => 
      req.matches.map(match => match.matchScore)
    )
    const averageMatchScore = allScores.length > 0 
      ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
      : 0

    const practiceAreaCounts = new Map<string, number>()
    this.matchingRequests.forEach(req => {
      const area = req.requirements.practiceArea
      practiceAreaCounts.set(area, (practiceAreaCounts.get(area) || 0) + 1)
    })

    const topPracticeAreas = Array.from(practiceAreaCounts.entries())
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      totalRequests,
      successfulMatches,
      averageMatchScore,
      topPracticeAreas
    }
  }

  clearAllData(): void {
    this.attorneys = []
    this.matchingRequests = []
    localStorage.removeItem('legal_attorneys')
    localStorage.removeItem('matching_requests')
  }
}

// Export singleton instance
export const legalMatching = new LegalCaseMatchingEngine()
export default legalMatching
