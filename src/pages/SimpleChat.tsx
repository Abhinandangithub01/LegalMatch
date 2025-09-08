import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Send,
  Shield,
  Lock,
  Scale,
  FileText,
  Paperclip,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Gavel,
  Building,
  User,
  MessageCircle
} from 'lucide-react'
import { zkAuth } from '../lib/midnight/zkAuthentication'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
  encrypted: boolean
  privileged: boolean
  type: 'text' | 'document' | 'system'
  attachments?: string[]
}

interface LegalCommunication {
  id: string
  participantType: 'client' | 'attorney'
  participantName: string
  caseType: string
  privilegeLevel: 'standard' | 'enhanced' | 'maximum'
  complianceStatus: 'compliant' | 'warning' | 'violation'
}

const SimpleChat: React.FC = () => {
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'System',
      content: 'Attorney-client privilege protection is active. All communications are encrypted and legally protected.',
      timestamp: new Date(Date.now() - 300000),
      encrypted: true,
      privileged: true,
      type: 'system'
    },
    {
      id: '2',
      sender: 'Attorney_Phoenix',
      content: 'Good morning. I\'ve reviewed your case details. Based on the information provided, I believe we have strong grounds for your corporate litigation matter.',
      timestamp: new Date(Date.now() - 240000),
      encrypted: true,
      privileged: true,
      type: 'text'
    },
    {
      id: '3',
      sender: 'Client_Confidential',
      content: 'Thank you for the quick response. What would be our next steps in this matter?',
      timestamp: new Date(Date.now() - 180000),
      encrypted: true,
      privileged: true,
      type: 'text'
    },
    {
      id: '4',
      sender: 'Attorney_Phoenix',
      content: 'I\'ll need to review the contracts you mentioned. Can you securely upload them through our encrypted document portal?',
      timestamp: new Date(Date.now() - 120000),
      encrypted: true,
      privileged: true,
      type: 'text'
    }
  ])

  const [newMessage, setNewMessage] = useState('')
  const [currentUser, setCurrentUser] = useState<LegalCommunication>({
    id: 'user1',
    participantType: 'client',
    participantName: 'Client_Confidential',
    caseType: 'Corporate Litigation',
    privilegeLevel: 'enhanced',
    complianceStatus: 'compliant'
  })
  const [isTyping, setIsTyping] = useState(false)
  const [showPrivilegeInfo, setShowPrivilegeInfo] = useState(false)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadUserIdentity()
  }, [])

  const loadUserIdentity = async () => {
    try {
      const identity = zkAuth.getCurrentIdentity()
      if (identity) {
        setCurrentUser(prev => ({
          ...prev,
          participantName: identity.username
        }))
      }
    } catch (error) {
      console.error('Error loading identity:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: currentUser.participantName,
      content: newMessage,
      timestamp: new Date(),
      encrypted: true,
      privileged: true,
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate attorney response
    if (currentUser.participantType === 'client') {
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          const responses = [
            "I understand your concern. Let me review the relevant statutes and precedents.",
            "That's an important point. I'll need to research this further and get back to you.",
            "Based on my experience with similar cases, here's what I recommend...",
            "I'll draft a response to opposing counsel regarding this matter.",
            "Let's schedule a secure video conference to discuss this in detail."
          ]
          
          const attorneyMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'Attorney_Phoenix',
            content: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
            encrypted: true,
            privileged: true,
            type: 'text'
          }
          
          setMessages(prev => [...prev, attorneyMessage])
          setIsTyping(false)
        }, 2000)
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-amber-600 bg-amber-100'
      case 'violation': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-amber-600 rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Legal Communications</h1>
                <p className="text-gray-600">Secure attorney-client privileged messaging</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentUser.complianceStatus)}`}>
                <Shield className="w-4 h-4 inline mr-1" />
                {currentUser.complianceStatus}
              </div>
              <button
                onClick={() => setShowPrivilegeInfo(!showPrivilegeInfo)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Privilege Information */}
          <AnimatePresence>
            {showPrivilegeInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-start space-x-3">
                  <Gavel className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Attorney-Client Privilege Protection</h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
                        All messages are end-to-end encrypted
                      </div>
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Communications protected by attorney-client privilege
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Compliance monitoring active
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{currentUser.caseType}</h3>
                  <p className="text-sm text-gray-600">Privilege Level: {currentUser.privilegeLevel}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure Connection</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === currentUser.participantName ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.type === 'system'
                      ? 'bg-blue-50 border border-blue-200 text-blue-800 text-center text-sm'
                      : message.sender === currentUser.participantName
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                  }`}>
                    {message.type !== 'system' && (
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs opacity-75 font-medium">
                          {message.sender}
                        </span>
                        <div className="flex items-center space-x-1">
                          {message.encrypted && (
                            <Lock className="w-3 h-3 opacity-75" />
                          )}
                          {message.privileged && (
                            <Shield className="w-3 h-3 opacity-75" />
                          )}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-75">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.sender === currentUser.participantName && (
                        <CheckCircle className="w-3 h-3 opacity-75" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Paperclip className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... (Protected by attorney-client privilege)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <Lock className="w-4 h-4 text-green-600" />
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Lock className="w-3 h-3 mr-1 text-green-600" />
                  End-to-end encrypted
                </div>
                <div className="flex items-center">
                  <Shield className="w-3 h-3 mr-1 text-blue-600" />
                  Attorney-client privilege
                </div>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                Compliance verified
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/privacy')}
            className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Compliance Dashboard</div>
              <div className="text-sm text-gray-600">View legal compliance status</div>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <User className="w-8 h-8 text-green-600 mr-3" />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Professional Profile</div>
              <div className="text-sm text-gray-600">Manage your legal profile</div>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/matching')}
            className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Scale className="w-8 h-8 text-amber-600 mr-3" />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Case Matching</div>
              <div className="text-sm text-gray-600">Find legal representation</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SimpleChat
