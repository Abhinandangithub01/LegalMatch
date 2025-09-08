import { useState, useCallback } from 'react'

// Mock CryptoJS implementation for development
const CryptoJS = {
  SHA256: (message: string) => ({
    toString: () => 'mock_hash_' + message.slice(0, 10)
  }),
  AES: {
    encrypt: (message: string, key: string) => ({
      toString: () => 'encrypted_' + message.slice(0, 10)
    }),
    decrypt: (ciphertext: any, key: string) => ({
      toString: (encoding: any) => 'decrypted_message'
    })
  },
  enc: {
    Utf8: {}
  },
  lib: {
    WordArray: {
      random: (bytes: number) => ({
        toString: () => Math.random().toString(36).substring(2, 15)
      })
    }
  }
};

// Mock types for Midnight Network integration
export interface ZKProof {
  proof: string
  publicInputs: string[]
  verificationKey: string
}

export interface ConditionData {
  category: string
  severity: number
  duration: string
  symptoms: string[]
  treatmentHistory: string
}

export interface UserPreferences {
  ageRange: string
  supportType: string[]
  communicationStyle: string
  timeZone: string
  availability: string[]
}

export interface AnonymousIdentity {
  commitment: string
  nullifier: string
  pseudonym: string
  publicKey: string
}

export interface CompatibilityScore {
  score: number
  matchingFactors: string[]
  groupId: string
}

// Utility functions for identity and privacy
export const generateUserIdentitySecret = (): string => {
  let secret = localStorage.getItem('user_identity_secret')
  if (!secret) {
    secret = CryptoJS.lib.WordArray.random(32).toString()
    localStorage.setItem('user_identity_secret', secret)
  }
  return secret
}

export const generateUserSalt = (): string => {
  return CryptoJS.lib.WordArray.random(16).toString()
}

export const hashMedicalCondition = (
  conditionType: string, 
  severity: number, 
  salt: string
): string => {
  return CryptoJS.SHA256(conditionType + severity.toString() + salt).toString()
}

// Enhanced matching algorithm with multiple criteria
export const calculateAdvancedCompatibility = (
  userProfile: any,
  groupProfile: any
): number => {
  let totalScore = 0
  let weightSum = 0

  // Support type compatibility (40% weight)
  const supportTypeWeight = 0.4
  const supportTypeScore = calculateSupportTypeCompatibility(
    userProfile.supportTypes || [],
    groupProfile.supportTypes || []
  )
  totalScore += supportTypeScore * supportTypeWeight
  weightSum += supportTypeWeight

  // Experience level compatibility (20% weight)
  const experienceWeight = 0.2
  const experienceScore = calculateExperienceCompatibility(
    userProfile.experienceLevel || 'new',
    groupProfile.averageExperience || 'mixed'
  )
  totalScore += experienceScore * experienceWeight
  weightSum += experienceWeight

  // Communication style compatibility (15% weight)
  const communicationWeight = 0.15
  const communicationScore = calculateCommunicationCompatibility(
    userProfile.communicationStyle || 'balanced',
    groupProfile.communicationStyle || 'balanced'
  )
  totalScore += communicationScore * communicationWeight
  weightSum += communicationWeight

  // Availability compatibility (15% weight)
  const availabilityWeight = 0.15
  const availabilityScore = calculateAvailabilityCompatibility(
    userProfile.availability || [],
    groupProfile.meetingTimes || []
  )
  totalScore += availabilityScore * availabilityWeight
  weightSum += availabilityWeight

  // Severity level compatibility (10% weight)
  const severityWeight = 0.1
  const severityScore = calculateSeverityCompatibility(
    userProfile.severityLevel || 'moderate',
    groupProfile.averageSeverity || 'moderate'
  )
  totalScore += severityScore * severityWeight
  weightSum += severityWeight

  return Math.round((totalScore / weightSum) * 100)
}

const calculateSupportTypeCompatibility = (userTypes: string[], groupTypes: string[]): number => {
  if (userTypes.length === 0 || groupTypes.length === 0) return 0.5
  
  const intersection = userTypes.filter(type => groupTypes.includes(type))
  const union = [...new Set([...userTypes, ...groupTypes])]
  
  // Jaccard similarity with bonus for exact matches
  const jaccardScore = intersection.length / union.length
  const exactMatchBonus = intersection.length > 0 ? 0.2 : 0
  
  return Math.min(1, jaccardScore + exactMatchBonus)
}

const calculateExperienceCompatibility = (userLevel: string, groupLevel: string): number => {
  const experienceLevels = {
    'new': 1,
    'some': 2,
    'experienced': 3,
    'mixed': 2.5
  }
  
  const userScore = experienceLevels[userLevel as keyof typeof experienceLevels] || 2
  const groupScore = experienceLevels[groupLevel as keyof typeof experienceLevels] || 2.5
  
  // Higher compatibility for similar experience levels
  const difference = Math.abs(userScore - groupScore)
  return Math.max(0, 1 - (difference / 2))
}

const calculateCommunicationCompatibility = (userStyle: string, groupStyle: string): number => {
  const styleMatrix: { [key: string]: { [key: string]: number } } = {
    'listener': { 'listener': 0.8, 'sharer': 0.9, 'balanced': 0.85 },
    'sharer': { 'listener': 0.9, 'sharer': 0.7, 'balanced': 0.85 },
    'balanced': { 'listener': 0.85, 'sharer': 0.85, 'balanced': 0.95 }
  }
  
  return styleMatrix[userStyle]?.[groupStyle] || 0.7
}

const calculateAvailabilityCompatibility = (userTimes: string[], groupTimes: string[]): number => {
  if (userTimes.length === 0 || groupTimes.length === 0) return 0.5
  
  const overlap = userTimes.filter(time => groupTimes.includes(time))
  return overlap.length / Math.max(userTimes.length, groupTimes.length)
}

const calculateSeverityCompatibility = (userSeverity: string, groupSeverity: string): number => {
  const severityLevels = {
    'mild': 1,
    'moderate': 2,
    'severe': 3
  }
  
  const userLevel = severityLevels[userSeverity as keyof typeof severityLevels] || 2
  const groupLevel = severityLevels[groupSeverity as keyof typeof severityLevels] || 2
  
  // Perfect match for same severity, decreasing compatibility with distance
  const difference = Math.abs(userLevel - groupLevel)
  return Math.max(0.3, 1 - (difference * 0.3))
}

// Enhanced group finding with multiple matching strategies
export const findCompatibleGroups = async (userProfile: any): Promise<any[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Comprehensive default groups covering all major mental health categories
  const allGroups = [
    // Anxiety & Panic Disorders
    {
      id: 'anxiety-general',
      name: 'General Anxiety Support',
      category: 'Anxiety & Panic',
      supportTypes: ['anxiety', 'panic', 'worry'],
      memberCount: 24,
      description: 'Open community for anyone dealing with anxiety. Share experiences, coping strategies, and find understanding.',
      meetingFrequency: 'Daily check-ins',
      averageExperience: 'mixed',
      communicationStyle: 'balanced',
      meetingTimes: ['morning', 'evening'],
      averageSeverity: 'moderate',
      privacyLevel: 'maximum' as const,
      ageRange: '18+',
      specialFocus: 'General Anxiety Support'
    },
    {
      id: 'anxiety-mindful',
      name: 'Mindful Anxiety Warriors',
      category: 'Anxiety & Panic',
      supportTypes: ['anxiety', 'panic', 'mindfulness'],
      memberCount: 18,
      description: 'Focus on mindfulness-based anxiety management techniques and meditation practices.',
      meetingFrequency: 'Weekly',
      averageExperience: 'mixed',
      communicationStyle: 'balanced',
      meetingTimes: ['evening', 'weekend'],
      averageSeverity: 'moderate',
      privacyLevel: 'maximum' as const,
      ageRange: '25-45',
      specialFocus: 'Mindfulness & Meditation'
    },
    {
      id: 'anxiety-professional',
      name: 'Professional Support Network',
      category: 'Anxiety & Panic',
      supportTypes: ['anxiety', 'work-stress', 'burnout'],
      memberCount: 32,
      description: 'Support for working professionals dealing with workplace anxiety and career stress.',
      meetingFrequency: 'Bi-weekly',
      averageExperience: 'experienced',
      communicationStyle: 'sharer',
      meetingTimes: ['evening', 'lunch'],
      averageSeverity: 'moderate',
      privacyLevel: 'high' as const,
      ageRange: '25-55',
      specialFocus: 'Career & Work-Life Balance'
    },

    // Depression Support
    {
      id: 'depression-general',
      name: 'Depression Support Circle',
      category: 'Depression',
      supportTypes: ['depression', 'mood', 'sadness'],
      memberCount: 28,
      description: 'Safe space for those experiencing depression. Share your journey and find hope together.',
      meetingFrequency: 'Daily check-ins',
      averageExperience: 'mixed',
      communicationStyle: 'listener',
      meetingTimes: ['morning', 'afternoon', 'evening'],
      averageSeverity: 'moderate',
      privacyLevel: 'maximum' as const,
      ageRange: '18+',
      specialFocus: 'General Depression Support'
    },
    {
      id: 'depression-young',
      name: 'Young Adults Healing Circle',
      category: 'Depression',
      supportTypes: ['depression', 'social-anxiety', 'life-transitions'],
      memberCount: 22,
      description: 'Peer support for young adults navigating depression and major life changes.',
      meetingFrequency: 'Weekly',
      averageExperience: 'new',
      communicationStyle: 'listener',
      meetingTimes: ['evening', 'weekend'],
      averageSeverity: 'mild',
      privacyLevel: 'maximum' as const,
      ageRange: '18-30',
      specialFocus: 'Life Transitions & Growth'
    },

    // Trauma & PTSD
    {
      id: 'trauma-general',
      name: 'Trauma Survivors United',
      category: 'Trauma & PTSD',
      supportTypes: ['trauma', 'ptsd', 'healing'],
      memberCount: 16,
      description: 'Compassionate community for trauma survivors. Focus on healing and recovery.',
      meetingFrequency: 'Bi-weekly',
      averageExperience: 'experienced',
      communicationStyle: 'listener',
      meetingTimes: ['afternoon', 'weekend'],
      averageSeverity: 'severe',
      privacyLevel: 'maximum' as const,
      ageRange: '21+',
      specialFocus: 'Trauma-Informed Healing'
    },
    {
      id: 'ptsd-veterans',
      name: 'Veterans PTSD Support',
      category: 'Trauma & PTSD',
      supportTypes: ['ptsd', 'military-trauma', 'adjustment'],
      memberCount: 12,
      description: 'Specialized support for veterans dealing with PTSD and military-related trauma.',
      meetingFrequency: 'Weekly',
      averageExperience: 'experienced',
      communicationStyle: 'sharer',
      meetingTimes: ['evening'],
      averageSeverity: 'severe',
      privacyLevel: 'maximum' as const,
      ageRange: '25+',
      specialFocus: 'Military & Service-Related Trauma'
    },

    // Bipolar & Mood Disorders
    {
      id: 'bipolar-general',
      name: 'Bipolar Balance Community',
      category: 'Bipolar & Mood Disorders',
      supportTypes: ['bipolar', 'mood-swings', 'mania'],
      memberCount: 20,
      description: 'Support for those managing bipolar disorder and mood fluctuations.',
      meetingFrequency: 'Weekly',
      averageExperience: 'mixed',
      communicationStyle: 'balanced',
      meetingTimes: ['morning', 'evening'],
      averageSeverity: 'moderate',
      privacyLevel: 'maximum' as const,
      ageRange: '18+',
      specialFocus: 'Mood Stabilization & Management'
    },

    // Eating Disorders
    {
      id: 'eating-disorders-general',
      name: 'Eating Disorder Recovery',
      category: 'Eating Disorders',
      supportTypes: ['eating-disorder', 'body-image', 'recovery'],
      memberCount: 14,
      description: 'Supportive community for eating disorder recovery and body positivity.',
      meetingFrequency: 'Bi-weekly',
      averageExperience: 'mixed',
      communicationStyle: 'listener',
      meetingTimes: ['afternoon', 'evening'],
      averageSeverity: 'moderate',
      privacyLevel: 'maximum' as const,
      ageRange: '16+',
      specialFocus: 'Recovery & Body Positivity'
    },

    // Addiction & Substance Use
    {
      id: 'addiction-general',
      name: 'Addiction Recovery Circle',
      category: 'Addiction & Substance Use',
      supportTypes: ['addiction', 'recovery', 'sobriety'],
      memberCount: 26,
      description: 'Support for those in addiction recovery. Share your journey to sobriety.',
      meetingFrequency: 'Daily check-ins',
      averageExperience: 'mixed',
      communicationStyle: 'sharer',
      meetingTimes: ['morning', 'evening'],
      averageSeverity: 'moderate',
      privacyLevel: 'maximum' as const,
      ageRange: '18+',
      specialFocus: 'Recovery & Sobriety'
    },

    // OCD & Anxiety Disorders
    {
      id: 'ocd-general',
      name: 'OCD Support Network',
      category: 'OCD & Compulsions',
      supportTypes: ['ocd', 'compulsions', 'intrusive-thoughts'],
      memberCount: 18,
      description: 'Understanding community for those dealing with OCD and compulsive behaviors.',
      meetingFrequency: 'Weekly',
      averageExperience: 'mixed',
      communicationStyle: 'balanced',
      meetingTimes: ['evening', 'weekend'],
      averageSeverity: 'moderate',
      privacyLevel: 'maximum' as const,
      ageRange: '18+',
      specialFocus: 'OCD Management & Coping'
    },

    // ADHD & Neurodivergent
    {
      id: 'adhd-general',
      name: 'ADHD Support Community',
      category: 'ADHD & Neurodivergent',
      supportTypes: ['adhd', 'focus', 'executive-function'],
      memberCount: 30,
      description: 'Community for adults with ADHD. Share strategies for focus and daily management.',
      meetingFrequency: 'Weekly',
      averageExperience: 'mixed',
      communicationStyle: 'sharer',
      meetingTimes: ['evening', 'weekend'],
      averageSeverity: 'mild',
      privacyLevel: 'high' as const,
      ageRange: '18+',
      specialFocus: 'ADHD Management & Productivity'
    },

    // Grief & Loss
    {
      id: 'grief-general',
      name: 'Grief & Loss Support',
      category: 'Grief & Loss',
      supportTypes: ['grief', 'loss', 'bereavement'],
      memberCount: 22,
      description: 'Compassionate support for those processing grief and loss of loved ones.',
      meetingFrequency: 'Bi-weekly',
      averageExperience: 'mixed',
      communicationStyle: 'listener',
      meetingTimes: ['afternoon', 'evening'],
      averageSeverity: 'moderate',
      privacyLevel: 'maximum' as const,
      ageRange: '18+',
      specialFocus: 'Grief Processing & Healing'
    },

    // Relationship & Social Issues
    {
      id: 'relationships-general',
      name: 'Relationship Support Circle',
      category: 'Relationships & Social',
      supportTypes: ['relationships', 'social-anxiety', 'communication'],
      memberCount: 25,
      description: 'Support for relationship challenges, social anxiety, and communication skills.',
      meetingFrequency: 'Weekly',
      averageExperience: 'mixed',
      communicationStyle: 'balanced',
      meetingTimes: ['evening', 'weekend'],
      averageSeverity: 'mild',
      privacyLevel: 'high' as const,
      ageRange: '18+',
      specialFocus: 'Relationships & Social Skills'
    },

    // Mixed Support & General Wellness
    {
      id: 'mixed-support',
      name: 'Compassionate Connections',
      category: 'Mixed Support',
      supportTypes: ['anxiety', 'depression', 'trauma', 'grief', 'stress'],
      memberCount: 35,
      description: 'Inclusive support group for various mental health challenges. All are welcome.',
      meetingFrequency: 'Daily check-ins',
      averageExperience: 'mixed',
      communicationStyle: 'balanced',
      meetingTimes: ['morning', 'afternoon', 'evening'],
      averageSeverity: 'moderate',
      privacyLevel: 'high' as const,
      ageRange: '18+',
      specialFocus: 'Holistic Mental Wellness'
    },

    // Crisis Support
    {
      id: 'crisis-support',
      name: 'Crisis Support Network',
      category: 'Crisis Support',
      supportTypes: ['crisis', 'emergency', 'immediate-support'],
      memberCount: 15,
      description: 'Immediate peer support for those in mental health crisis. Available 24/7.',
      meetingFrequency: '24/7 availability',
      averageExperience: 'experienced',
      communicationStyle: 'listener',
      meetingTimes: ['24/7'],
      averageSeverity: 'severe',
      privacyLevel: 'maximum' as const,
      ageRange: '18+',
      specialFocus: 'Crisis Intervention & Immediate Support'
    }
  ]
  
  // Calculate compatibility scores for each group
  const scoredGroups = allGroups.map(group => ({
    ...group,
    compatibilityScore: calculateAdvancedCompatibility(userProfile, group),
    isRecommended: false // Will be set based on score
  }))
  
  // Sort by compatibility score
  scoredGroups.sort((a, b) => b.compatibilityScore - a.compatibilityScore)
  
  // Mark top 5 as recommended if they meet minimum threshold
  scoredGroups.forEach((group, index) => {
    group.isRecommended = index < 5 && group.compatibilityScore >= 70
  })
  
  // Return all groups (no minimum threshold) so users always have options
  return scoredGroups
}

// Mock Midnight Network SDK
export const useMidnight = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [identity, setIdentity] = useState<AnonymousIdentity | null>(null)
  const [proofGenerationStatus, setProofGenerationStatus] = useState<'idle' | 'generating' | 'complete' | 'error'>('idle')

  // Mock connection to Midnight Network
  const connect = useCallback(async () => {
    setIsConnected(true)
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return true
  }, [])

  // Generate anonymous identity commitment
  const generateAnonymousIdentity = useCallback(async (secret: string): Promise<AnonymousIdentity> => {
    // Mock identity generation using crypto-js
    const commitment = CryptoJS.SHA256(secret + 'commitment').toString()
    const nullifier = CryptoJS.SHA256(secret + 'nullifier').toString()
    const pseudonym = CryptoJS.SHA256(secret + 'pseudonym').toString().substring(0, 16)
    const publicKey = CryptoJS.SHA256(secret + 'publickey').toString()
    
    const newIdentity = { commitment, nullifier, pseudonym, publicKey }
    setIdentity(newIdentity)
    return newIdentity
  }, [])

  // Generate zero-knowledge proof for condition verification
  const generateConditionProof = useCallback(async (conditionData: any): Promise<ZKProof> => {
    setProofGenerationStatus('generating')
    
    try {
      // Simulate proof generation delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock proof generation - handle both old and new data structures
      let conditionHash: string
      if (conditionData.medical_condition_hash) {
        // New structure from ConditionVerification
        conditionHash = conditionData.medical_condition_hash
      } else {
        // Old structure for backward compatibility
        conditionHash = CryptoJS.SHA256(JSON.stringify(conditionData)).toString()
      }
      
      const proof = CryptoJS.SHA256(conditionHash + 'proof').toString()
      const publicInputs = [
        conditionHash.substring(0, 16),
        (conditionData.severity_level || conditionData.severity || 1).toString()
      ]
      const verificationKey = CryptoJS.SHA256('verification_key').toString()
      
      setProofGenerationStatus('complete')
      return { proof, publicInputs, verificationKey }
    } catch (error) {
      console.error('Error in generateConditionProof:', error)
      setProofGenerationStatus('error')
      throw new Error('Failed to generate condition proof: ' + error.message)
    }
  }, [])

  // Calculate privacy-preserving compatibility scores
  const calculateCompatibility = useCallback(async (
    preferences: UserPreferences,
    availableGroups: any[]
  ): Promise<CompatibilityScore[]> => {
    // Simulate compatibility calculation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return availableGroups.map(group => {
      // Mock compatibility scoring algorithm
      let score = 0
      const matchingFactors: string[] = []
      
      // Age range compatibility
      if (group.ageRange === preferences.ageRange) {
        score += 25
        matchingFactors.push('Age Range')
      }
      
      // Support type overlap
      const supportOverlap = preferences.supportType.filter(type => 
        group.supportTypes?.includes(type)
      ).length
      score += supportOverlap * 15
      if (supportOverlap > 0) {
        matchingFactors.push('Support Type')
      }
      
      // Communication style
      if (group.communicationStyle === preferences.communicationStyle) {
        score += 20
        matchingFactors.push('Communication Style')
      }
      
      // Time zone compatibility
      if (Math.abs(parseInt(group.timeZone) - parseInt(preferences.timeZone)) <= 3) {
        score += 15
        matchingFactors.push('Time Zone')
      }
      
      // Availability overlap
      const availabilityOverlap = preferences.availability.filter(time =>
        group.availability?.includes(time)
      ).length
      score += availabilityOverlap * 10
      if (availabilityOverlap > 0) {
        matchingFactors.push('Availability')
      }
      
      return {
        score: Math.min(score, 100),
        matchingFactors,
        groupId: group.id
      }
    }).sort((a, b) => b.score - a.score)
  }, [])

  // Join group anonymously with ZK proof
  const joinGroupAnonymously = useCallback(async (
    groupId: string, 
    proof: ZKProof
  ): Promise<{ success: boolean; anonymousId: string }> => {
    // Simulate group joining process
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock verification of proof
    const isValidProof = proof.proof.length > 0 && proof.publicInputs.length > 0
    
    if (!isValidProof) {
      throw new Error('Invalid zero-knowledge proof')
    }
    
    // Generate anonymous group member ID
    const anonymousId = CryptoJS.SHA256(proof.proof + groupId + Date.now()).toString().substring(0, 16)
    
    return {
      success: true,
      anonymousId
    }
  }, [])

  // Encrypt message for anonymous communication
  const encryptMessage = useCallback((message: string, recipientPublicKey: string): string => {
    // Mock end-to-end encryption
    const encrypted = CryptoJS.AES.encrypt(message, recipientPublicKey).toString()
    return encrypted
  }, [])

  // Decrypt received message
  const decryptMessage = useCallback((encryptedMessage: string, privateKey: string): string => {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedMessage, privateKey).toString(CryptoJS.enc.Utf8)
      return decrypted
    } catch (error) {
      throw new Error('Failed to decrypt message')
    }
  }, [])

  // Verify anonymous message authenticity
  const verifyMessageAuthenticity = useCallback((
    message: string, 
    signature: string, 
    senderCommitment: string
  ): boolean => {
    // Mock message verification
    const expectedSignature = CryptoJS.SHA256(message + senderCommitment).toString()
    return signature === expectedSignature
  }, [])

  return {
    // Connection state
    isConnected,
    identity,
    proofGenerationStatus,
    
    // Core functions
    connect,
    generateAnonymousIdentity,
    generateConditionProof,
    calculateCompatibility,
    joinGroupAnonymously,
    
    // Communication functions
    encryptMessage,
    decryptMessage,
    verifyMessageAuthenticity,
    
    // Utility functions
    disconnect: () => setIsConnected(false),
    resetProofStatus: () => setProofGenerationStatus('idle'),
    generateUserIdentitySecret,
    generateUserSalt,
    hashMedicalCondition,
    findCompatibleGroups
  }
}

// Mock circuit compilation result
export const compiledCircuits = {
  conditionVerification: {
    wasmPath: '/circuits/condition_verification.wasm',
    zkeyPath: '/circuits/condition_verification_final.zkey',
    verificationKey: 'mock_verification_key_condition'
  },
  anonymousMatching: {
    wasmPath: '/circuits/anonymous_matching.wasm', 
    zkeyPath: '/circuits/anonymous_matching_final.zkey',
    verificationKey: 'mock_verification_key_matching'
  },
  groupMembership: {
    wasmPath: '/circuits/group_membership.wasm',
    zkeyPath: '/circuits/group_membership_final.zkey', 
    verificationKey: 'mock_verification_key_membership'
  }
}

export default useMidnight
