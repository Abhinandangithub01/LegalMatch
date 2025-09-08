import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Send, 
  Shield, 
  Users, 
  MoreVertical, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Flag, 
  Heart, 
  ThumbsUp, 
  Smile,
  Paperclip,
  Calendar,
  Settings,
  ArrowLeft,
  Eye,
  EyeOff,
  Scale,
  FileText,
  Lock,
  Download,
  Upload,
  Clock,
  CheckCircle,
  Gavel
} from 'lucide-react'
import { zkChat } from '../lib/midnight/zkChat'
import { zkAuth } from '../lib/midnight/zkAuthentication'

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  timestamp: Date
  encrypted: boolean
  reactions: { [emoji: string]: string[] }
  isSystem?: boolean
  type: 'text' | 'system' | 'join' | 'leave' | 'document' | 'privileged'
  rlnProof?: any
  isPrivileged?: boolean
  documentName?: string
  documentSize?: string
  confidentialityLevel?: 'attorney-client' | 'work-product' | 'confidential'
}

interface LegalParticipant {
  id: string
  name: string
  role: 'attorney' | 'client' | 'paralegal' | 'expert'
  isOnline: boolean
  joinedAt: Date
  isMuted: boolean
  isBlocked: boolean
  barNumber?: string
  jurisdiction?: string
  firmName?: string
}

interface LegalCaseInfo {
  id: string
  name: string
  description: string
  participantCount: number
  type: 'consultation' | 'case-discussion' | 'document-review'
  caseNumber?: string
  confidentialityLevel: 'attorney-client' | 'work-product' | 'confidential'
  isPrivileged: boolean
  jurisdiction: string
}

const LegalChat = () => {
  const { caseId } = useParams<{ caseId: string }>()
  const navigate = useNavigate()
  
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [caseInfo, setCaseInfo] = useState<LegalCaseInfo | null>(null)
  const [participants, setParticipants] = useState<LegalParticipant[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showParticipants, setShowParticipants] = useState(false)
  const [showPrivilegeNotice, setShowPrivilegeNotice] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isTyping, setIsTyping] = useState<string[]>([])
  const [isJoined, setIsJoined] = useState(false)
  const [messageType, setMessageType] = useState<'text' | 'privileged'>('text')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    initializeChat()
  }, [caseId])

  const initializeChat = async () => {
    try {
      const identity = await zkAuth.getIdentity()
      if (!identity) {
        navigate('/authentication')
        return
      }
      setCurrentUser(identity)

      if (caseId) {
        const joinResult = await zkChat.joinChatRoom(caseId)
        if (joinResult.success) {
          setIsJoined(true)
          
          const history = await zkChat.getChatHistory(caseId)
          setMessages(history.messages || [])
          
          zkChat.subscribeToMessages(caseId, (message) => {
            setMessages(prev => [...prev, message])
          })

          const caseData = await zkChat.getGroupInfo(caseId)
          setCaseInfo(caseData)
          
          // Load mock participants
          setParticipants([
            {
              id: '1',
              name: 'Attorney Sarah Chen',
              role: 'attorney',
              isOnline: true,
              joinedAt: new Date(),
              isMuted: false,
              isBlocked: false,
              barNumber: 'CA-123456',
              jurisdiction: 'California',
              firmName: 'Chen & Associates'
            },
            {
              id: '2', 
              name: 'Client (Anonymous)',
              role: 'client',
              isOnline: true,
              joinedAt: new Date(),
              isMuted: false,
              isBlocked: false
            }
          ])
        } else {
          console.error('Failed to join legal consultation:', joinResult.error)
          navigate('/dashboard')
        }
      }
    } catch (error) {
      console.error('Failed to initialize legal chat:', error)
      navigate('/dashboard')
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !caseId) return

    try {
      const result = await zkChat.sendMessage(caseId, newMessage, {
        type: messageType,
        isPrivileged: messageType === 'privileged'
      })
      
      if (result.success) {
        setNewMessage('')
        setMessageType('text')
        inputRef.current?.focus()
      } else {
        alert('Failed to send message: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !caseId) return

    try {
      const result = await zkChat.uploadDocument(caseId, file, {
        confidentialityLevel: 'attorney-client',
        isPrivileged: true
      })
      
      if (result.success) {
        // Document message will be added via subscription
      } else {
        alert('Failed to upload document: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Failed to upload document:', error)
      alert('Failed to upload document. Please try again.')
    }
  }

  const handleEndConsultation = async () => {
    if (!confirm('Are you sure you want to end this legal consultation? All privileged communications will be archived securely.')) return
    
    try {
      if (caseId) {
        await zkChat.leaveChatRoom(caseId)
        await zkAuth.endConsultation(caseId)
      }
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to end consultation:', error)
      alert('Failed to end consultation. Please try again.')
    }
  }

  if (!caseInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading legal consultation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">{caseInfo.name}</h1>
                <p className="text-sm text-gray-600">{caseInfo.participantCount} participants • {caseInfo.jurisdiction}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
              <Lock className="w-3 h-3" />
              <span>Attorney-Client Privileged</span>
            </div>
            
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <Users className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Privilege Notice */}
        {showPrivilegeNotice && (
          <div className="mt-3 flex items-start space-x-3 text-sm text-amber-700 bg-amber-50 px-4 py-3 rounded-lg border border-amber-200">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium mb-1">Attorney-Client Privileged Communication</p>
              <p className="text-xs">This conversation is protected by attorney-client privilege. All communications are confidential and encrypted end-to-end.</p>
            </div>
            <button
              onClick={() => setShowPrivilegeNotice(false)}
              className="text-amber-600 hover:text-amber-700"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <LegalMessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === currentUser?.anonymousId}
                />
              ))}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="mb-3 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="regular"
                  name="messageType"
                  value="text"
                  checked={messageType === 'text'}
                  onChange={(e) => setMessageType(e.target.value as 'text')}
                  className="text-blue-600"
                />
                <label htmlFor="regular" className="text-sm text-gray-700">Regular Message</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="privileged"
                  name="messageType"
                  value="privileged"
                  checked={messageType === 'privileged'}
                  onChange={(e) => setMessageType(e.target.value as 'privileged')}
                  className="text-amber-600"
                />
                <label htmlFor="privileged" className="text-sm text-amber-700 flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>Privileged Communication</span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                title="Upload legal document"
              >
                <Upload className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={messageType === 'privileged' ? "Type privileged communication..." : "Type your message..."}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                    messageType === 'privileged' 
                      ? 'border-amber-300 focus:ring-amber-500 bg-amber-50' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`px-6 py-3 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  messageType === 'privileged'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-2 text-xs text-gray-500 text-center">
              {messageType === 'privileged' 
                ? 'Privileged communications are protected by attorney-client privilege'
                : 'All messages are end-to-end encrypted'
              }
            </div>
          </div>
        </div>

        {/* Participants Sidebar */}
        <AnimatePresence>
          {showParticipants && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white border-l border-gray-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Participants ({participants.length})</h3>
                  <button
                    onClick={() => setShowParticipants(false)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {participants.map((participant) => (
                    <LegalParticipantCard
                      key={participant.id}
                      participant={participant}
                    />
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Case Type:</span>
                      <span className="font-medium">{caseInfo.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Jurisdiction:</span>
                      <span className="font-medium">{caseInfo.jurisdiction}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Privilege Level:</span>
                      <span className="font-medium text-amber-600">{caseInfo.confidentialityLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleEndConsultation}
                    className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    End Consultation
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const LegalMessageBubble = ({ 
  message, 
  isOwn
}: {
  message: Message
  isOwn: boolean
}) => {
  if (message.isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 rounded-full text-sm text-blue-800">
          <Scale className="w-4 h-4" />
          <span>{message.content}</span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        
        {!isOwn && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-900">{message.senderName}</span>
            {message.isPrivileged && <Lock className="w-3 h-3 text-amber-600" />}
            {message.encrypted && <Shield className="w-3 h-3 text-green-600" />}
          </div>
        )}
        
        <div
          className={`relative p-3 rounded-lg ${
            message.isPrivileged
              ? isOwn 
                ? 'bg-amber-600 text-white' 
                : 'bg-amber-50 border border-amber-200 text-amber-900'
              : isOwn 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border border-gray-200 text-gray-900'
          }`}
        >
          {message.type === 'document' ? (
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5" />
              <div>
                <p className="font-medium">{message.documentName}</p>
                <p className="text-xs opacity-75">{message.documentSize}</p>
              </div>
              <button className="p-1 hover:bg-black/10 rounded">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <p>{message.content}</p>
          )}
          
          {message.isPrivileged && (
            <div className="flex items-center space-x-1 mt-2 text-xs opacity-75">
              <Lock className="w-3 h-3" />
              <span>Attorney-Client Privileged</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isOwn && (
            <div className="flex items-center space-x-1">
              {message.isPrivileged && <Lock className="w-3 h-3 text-amber-600" />}
              {message.encrypted && <Shield className="w-3 h-3 text-green-600" />}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const LegalParticipantCard = ({ 
  participant
}: {
  participant: LegalParticipant
}) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'attorney': return <Scale className="w-4 h-4 text-blue-600" />
      case 'client': return <Users className="w-4 h-4 text-green-600" />
      case 'paralegal': return <FileText className="w-4 h-4 text-purple-600" />
      case 'expert': return <Gavel className="w-4 h-4 text-orange-600" />
      default: return <Users className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'attorney': return 'text-blue-600 bg-blue-100'
      case 'client': return 'text-green-600 bg-green-100'
      case 'paralegal': return 'text-purple-600 bg-purple-100'
      case 'expert': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${participant.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
        <div className="flex items-center space-x-2">
          {getRoleIcon(participant.role)}
          <div>
            <p className="font-medium text-gray-900">{participant.name}</p>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(participant.role)}`}>
                {participant.role}
              </span>
              {participant.barNumber && (
                <span className="text-xs text-gray-500">Bar: {participant.barNumber}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LegalChat
