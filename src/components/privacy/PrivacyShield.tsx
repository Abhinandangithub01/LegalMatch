import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

interface PrivacyShieldProps {
  isActive: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const PrivacyShield = ({ isActive, size = 'md', className = '' }: PrivacyShieldProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`inline-block ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} mx-auto privacy-shield ${isActive ? 'privacy-shield-activate' : ''}`}
        animate={isActive ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Shield className={`${iconSizes[size]} text-white`} />
      </motion.div>
      
      {isActive && (
        <motion.div
          className={`absolute inset-0 rounded-full border-2 border-blue-300 ${sizeClasses[size]}`}
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  )
}

export default PrivacyShield
