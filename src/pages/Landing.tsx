import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Scale,
  Shield,
  Lock,
  Users,
  CheckCircle,
  ArrowRight,
  Eye,
  FileText,
  Gavel,
  Building,
  Globe,
  Star,
  Award,
  Clock,
  Briefcase,
  UserCheck,
  Zap
} from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    {
      icon: Scale,
      title: "Anonymous Legal Matching",
      description: "Connect with qualified attorneys while maintaining complete anonymity through zero-knowledge proofs"
    },
    {
      icon: Shield,
      title: "Bar Credential Verification",
      description: "Verify attorney credentials without revealing personal information using cryptographic proofs"
    },
    {
      icon: Lock,
      title: "Attorney-Client Privilege",
      description: "All communications protected by mathematical encryption and legal privilege"
    },
    {
      icon: FileText,
      title: "Compliance Monitoring",
      description: "Real-time tracking of legal compliance, bar standing, and professional requirements"
    }
  ]

  const stats = [
    { number: "500+", label: "Verified Attorneys", icon: UserCheck },
    { number: "1,200+", label: "Cases Matched", icon: Scale },
    { number: "99.9%", label: "Privacy Protection", icon: Shield },
    { number: "24/7", label: "Secure Access", icon: Clock }
  ]

  const practiceAreas = [
    "Corporate Law", "Criminal Defense", "Family Law", "Personal Injury",
    "Real Estate", "Immigration", "Intellectual Property", "Employment Law",
    "Tax Law", "Estate Planning", "Bankruptcy", "Civil Rights"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Scale className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
                  LegalMatch
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-600 font-medium mb-4">
                Confidential legal case matching
              </p>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Connect with qualified attorneys anonymously through zero-knowledge cryptography. 
                Protect your privacy while finding the right legal representation for your case.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <button
                onClick={() => navigate('/auth')}
                className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Scale className="w-5 h-5 mr-2" />
                Find Legal Representation
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="flex items-center justify-center px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors border-2 border-gray-200"
              >
                Join as Attorney
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 text-sm text-gray-600"
            >
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-600" />
                Zero-Knowledge Privacy
              </div>
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-2 text-blue-600" />
                End-to-End Encrypted
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-2 text-amber-600" />
                Bar Verified Attorneys
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2 text-purple-600" />
                Compliance Monitored
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Privacy-First Legal Matching
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced cryptography ensures your legal matters remain confidential while connecting you with the right attorney
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-2xl transition-all duration-300 ${
                    currentFeature === index
                      ? 'bg-white shadow-lg border-l-4 border-blue-600'
                      : 'bg-white/50 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      currentFeature === index ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <feature.icon className={`w-6 h-6 ${
                        currentFeature === index ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 shadow-2xl"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-amber-600 rounded-2xl flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Zero-Knowledge Matching</h3>
                  <p className="text-gray-600">Your case details remain private while we find the perfect attorney match</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm text-gray-700">Case type verified anonymously</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-sm text-gray-700">Attorney credentials confirmed</span>
                  </div>
                  <div className="flex items-center p-3 bg-amber-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-amber-600 mr-3" />
                    <span className="text-sm text-gray-700">Secure connection established</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              All Practice Areas Covered
            </h2>
            <p className="text-xl text-gray-600">
              Find specialized attorneys across all areas of law
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {practiceAreas.map((area, index) => (
              <motion.div
                key={area}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-gray-50 rounded-xl text-center hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <Briefcase className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <span className="font-medium">{area}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How LegalMatch Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to find your attorney while maintaining complete privacy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Submit Your Case Anonymously",
                description: "Describe your legal needs through our encrypted platform. Your identity remains protected.",
                icon: FileText
              },
              {
                step: 2,
                title: "Get Matched with Attorneys",
                description: "Our algorithm matches you with qualified attorneys based on your case type and requirements.",
                icon: Scale
              },
              {
                step: 3,
                title: "Connect Securely",
                description: "Communicate with attorneys through our encrypted messaging system with full privilege protection.",
                icon: Shield
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <step.icon className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Find Your Attorney?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of clients who have found qualified legal representation through our secure, anonymous platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/auth')}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Get Started Now
              </button>
              <button
                onClick={() => navigate('/privacy')}
                className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Learn About Privacy
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
