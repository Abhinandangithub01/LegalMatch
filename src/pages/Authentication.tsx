import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Shield, User, CheckCircle, Loader, ArrowLeft, Scale, Gavel, Building, Award, FileText, Lock } from 'lucide-react'
import { zkAuth } from '../lib/midnight/zkAuthentication'

const Authentication = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [identity, setIdentity] = useState<any>(null)
  const [selectedCredential, setSelectedCredential] = useState('')
  const [userType, setUserType] = useState<'client' | 'attorney' | ''>('')

  const attorneyCredentials = [
    { 
      id: 'bar_admission', 
      name: 'Bar Admission Verification', 
      description: 'Verify active bar membership and good standing status',
      icon: Scale
    },
    { 
      id: 'malpractice_insurance', 
      name: 'Malpractice Insurance', 
      description: 'Verify current professional liability insurance coverage',
      icon: Shield
    },
    { 
      id: 'continuing_education', 
      name: 'Continuing Legal Education', 
      description: 'Verify CLE compliance and ongoing professional development',
      icon: Award
    }
  ]

  const clientVerification = [
    {
      id: 'identity_verification',
      name: 'Identity Verification',
      description: 'Secure identity verification for confidential legal services',
      icon: User
    },
    {
      id: 'case_legitimacy',
      name: 'Case Legitimacy Check',
      description: 'Verify legitimate legal matter requiring professional representation',
      icon: FileText
    }
  ]

  const handleCreateIdentity = async () => {
    setLoading(true)
    try {
      // Generate anonymous ZK identity
      const newIdentity = await zkAuth.createIdentity()
      setIdentity(newIdentity)
      setStep(2)
    } catch (error) {
      console.error('Failed to create identity:', error)
      alert('Failed to create identity. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCredential = async () => {
    if (!selectedCredential) return
    
    setLoading(true)
    try {
      // Generate ZK proof for credential verification
      const verificationResult = await zkAuth.verifyCredential(selectedCredential, userType)
      if (verificationResult) {
        setStep(3)
      } else {
        alert('Verification failed. Please try again.')
      }
    } catch (error) {
      console.error('Failed to verify credential:', error)
      alert('Failed to verify credential. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = () => {
    navigate('/profile')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        
        {/* Back Button */}
        <button
          onClick={() => step === 1 ? navigate('/') : setStep(step - 1)}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
            </div>
          </div>

          {/* Step 1: Identity Creation & User Type Selection */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Scale className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Join LegalMatch</h2>
              <p className="text-gray-600 mb-8">
                Create a secure, anonymous identity for confidential legal services. 
                Your credentials are verified using zero-knowledge cryptography.
              </p>

              {/* User Type Selection */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">I am a:</h3>
                
                <button
                  onClick={() => setUserType('attorney')}
                  className={`w-full p-4 rounded-xl border-2 transition-colors text-left ${
                    userType === 'attorney'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Gavel className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Legal Professional</div>
                      <div className="text-sm text-gray-600">Licensed attorney seeking clients</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setUserType('client')}
                  className={`w-full p-4 rounded-xl border-2 transition-colors text-left ${
                    userType === 'client'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Client</div>
                      <div className="text-sm text-gray-600">Individual or business seeking legal representation</div>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={handleCreateIdentity}
                disabled={loading || !userType}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Creating Identity...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Create Secure Identity</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Step 2: Credential Verification */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {userType === 'attorney' ? 'Verify Legal Credentials' : 'Verify Identity'}
              </h2>
              <p className="text-gray-600 mb-8">
                {userType === 'attorney' 
                  ? 'Select your professional credential for verification. This creates a private proof of your qualifications without revealing personal details.'
                  : 'Complete identity verification to access our secure legal matching platform. Your information remains completely confidential.'
                }
              </p>

              <div className="space-y-3 mb-8">
                {(userType === 'attorney' ? attorneyCredentials : clientVerification).map((credential) => {
                  const IconComponent = credential.icon
                  return (
                    <button
                      key={credential.id}
                      onClick={() => setSelectedCredential(credential.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-colors text-left ${
                        selectedCredential === credential.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedCredential === credential.id ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`w-5 h-5 ${
                            selectedCredential === credential.id ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{credential.name}</div>
                          <div className="text-sm text-gray-600">{credential.description}</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <button
                onClick={handleVerifyCredential}
                disabled={!selectedCredential || loading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Verify & Create Proof</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Step 3: Completion */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {userType === 'attorney' ? 'Credentials Verified Successfully' : 'Identity Verified Successfully'}
              </h2>
              <p className="text-gray-600 mb-4">
                Your secure identity: <span className="font-mono text-blue-600">{identity?.username}</span>
              </p>
              <p className="text-sm text-gray-500 mb-8">
                {userType === 'attorney' 
                  ? 'Your legal credentials have been verified and you can now accept cases through our platform.'
                  : 'Your identity has been verified and you can now search for qualified legal representation.'
                }
              </p>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-2 text-green-700 mb-2">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">Privacy & Security Guaranteed</span>
                </div>
                <div className="space-y-1 text-xs text-green-600">
                  <div>• End-to-end encryption for all communications</div>
                  <div>• Zero-knowledge credential verification</div>
                  <div>• Attorney-client privilege protection</div>
                  <div>• Anonymous case matching system</div>
                </div>
              </div>

              {userType === 'attorney' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-2 text-blue-700 mb-2">
                    <Building className="w-4 h-4" />
                    <span className="text-sm font-medium">Professional Features Unlocked</span>
                  </div>
                  <div className="space-y-1 text-xs text-blue-600">
                    <div>• Access to confidential case matching</div>
                    <div>• Secure client communication portal</div>
                    <div>• Compliance monitoring dashboard</div>
                    <div>• Professional profile management</div>
                  </div>
                </div>
              )}

              <button
                onClick={handleComplete}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                <span>
                  {userType === 'attorney' ? 'Access Professional Dashboard' : 'Start Finding Legal Help'}
                </span>
              </button>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  )
}

export default Authentication
