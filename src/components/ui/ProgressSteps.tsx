import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

interface ProgressStepsProps {
  currentStep: number
  totalSteps: number
  className?: string
}

const ProgressSteps = ({ currentStep, totalSteps, className = '' }: ProgressStepsProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)

  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <motion.div
              className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                step < currentStep
                  ? 'bg-green-600 border-green-600 text-white'
                  : step === currentStep
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-500'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: step <= currentStep ? 1 : 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {step < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="text-sm font-semibold">{step}</span>
              )}
            </motion.div>
            
            {index < steps.length - 1 && (
              <motion.div
                className={`w-12 h-0.5 mx-2 transition-colors duration-300 ${
                  step < currentStep ? 'bg-green-600' : 'bg-gray-300'
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: step < currentStep ? 1 : 0.3 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  )
}

export default ProgressSteps
