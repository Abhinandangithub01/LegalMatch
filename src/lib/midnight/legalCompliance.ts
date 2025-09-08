import CryptoJS from 'crypto-js'
import { zkAuth, LegalCredentials } from './zkAuthentication'

export interface ComplianceMetrics {
  barCompliance: {
    status: 'compliant' | 'warning' | 'non-compliant'
    lastVerified: string
    expirationDate?: string
    jurisdiction: string[]
    violations: ComplianceViolation[]
  }
  malpracticeInsurance: {
    status: 'active' | 'expired' | 'pending'
    provider: string
    policyNumber: string
    coverageAmount: string
    expirationDate: string
    lastVerified: string
  }
  continuingEducation: {
    status: 'current' | 'behind' | 'overdue'
    hoursCompleted: number
    hoursRequired: number
    reportingPeriod: string
    lastUpdated: string
    certificates: CLECertificate[]
  }
  privilegeProtection: {
    status: 'protected' | 'at-risk' | 'violated'
    encryptionLevel: 'high' | 'medium' | 'low'
    communicationsSecured: number
    lastAudit: string
    violations: PrivilegeViolation[]
  }
  dataRetention: {
    status: 'compliant' | 'review-needed' | 'violation'
    retentionPeriod: number
    documentsManaged: number
    lastCleanup: string
    scheduledCleanup: string
  }
  overallScore: number
  lastAssessment: string
  nextReview: string
}

export interface ComplianceViolation {
  id: string
  type: 'bar' | 'insurance' | 'cle' | 'privilege' | 'retention'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  detectedAt: string
  resolvedAt?: string
  status: 'open' | 'in-progress' | 'resolved'
  remediation?: string
}

export interface CLECertificate {
  id: string
  courseName: string
  provider: string
  hours: number
  completionDate: string
  category: string
  certificateHash: string
}

export interface PrivilegeViolation {
  id: string
  communicationId: string
  violationType: 'unencrypted' | 'unauthorized-access' | 'improper-disclosure'
  severity: 'low' | 'medium' | 'high'
  detectedAt: string
  description: string
  remediated: boolean
}

export interface ComplianceAlert {
  id: string
  type: 'bar-expiration' | 'insurance-renewal' | 'cle-deadline' | 'privilege-breach' | 'retention-cleanup'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  title: string
  message: string
  dueDate?: string
  createdAt: string
  acknowledged: boolean
  actionRequired: boolean
}

class LegalComplianceMonitor {
  private metrics: ComplianceMetrics | null = null
  private violations: ComplianceViolation[] = []
  private alerts: ComplianceAlert[] = []

  constructor() {
    this.loadFromStorage()
    this.initializeDefaultMetrics()
  }

  private loadFromStorage(): void {
    try {
      const metricsData = localStorage.getItem('compliance_metrics')
      const violationsData = localStorage.getItem('compliance_violations')
      const alertsData = localStorage.getItem('compliance_alerts')

      if (metricsData) {
        this.metrics = JSON.parse(metricsData)
      }

      if (violationsData) {
        this.violations = JSON.parse(violationsData)
      }

      if (alertsData) {
        this.alerts = JSON.parse(alertsData)
      }
    } catch (error) {
      console.error('Failed to load compliance data from storage:', error)
    }
  }

  private saveToStorage(): void {
    try {
      if (this.metrics) {
        localStorage.setItem('compliance_metrics', JSON.stringify(this.metrics))
      }
      localStorage.setItem('compliance_violations', JSON.stringify(this.violations))
      localStorage.setItem('compliance_alerts', JSON.stringify(this.alerts))
    } catch (error) {
      console.error('Failed to save compliance data to storage:', error)
    }
  }

  private initializeDefaultMetrics(): void {
    if (!this.metrics) {
      const now = new Date().toISOString()
      const nextYear = new Date()
      nextYear.setFullYear(nextYear.getFullYear() + 1)

      this.metrics = {
        barCompliance: {
          status: 'compliant',
          lastVerified: now,
          expirationDate: nextYear.toISOString(),
          jurisdiction: ['NY', 'CA'],
          violations: []
        },
        malpracticeInsurance: {
          status: 'active',
          provider: 'Legal Shield Insurance',
          policyNumber: 'POL789456123',
          coverageAmount: '$2,000,000',
          expirationDate: nextYear.toISOString(),
          lastVerified: now
        },
        continuingEducation: {
          status: 'current',
          hoursCompleted: 24,
          hoursRequired: 24,
          reportingPeriod: '2024',
          lastUpdated: now,
          certificates: []
        },
        privilegeProtection: {
          status: 'protected',
          encryptionLevel: 'high',
          communicationsSecured: 0,
          lastAudit: now,
          violations: []
        },
        dataRetention: {
          status: 'compliant',
          retentionPeriod: 7, // years
          documentsManaged: 0,
          lastCleanup: now,
          scheduledCleanup: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
        },
        overallScore: 95,
        lastAssessment: now,
        nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }

      this.saveToStorage()
    }
  }

  private generateId(): string {
    return CryptoJS.lib.WordArray.random(16).toString()
  }

  async assessCompliance(): Promise<ComplianceMetrics> {
    if (!this.metrics) {
      this.initializeDefaultMetrics()
    }

    const identity = zkAuth.getCurrentIdentity()
    if (!identity) {
      throw new Error('No legal identity found for compliance assessment')
    }

    const now = new Date()
    const credentials = identity.credentials

    // Assess bar compliance
    if (credentials.barAdmission) {
      const barStatus = credentials.barAdmission.status
      this.metrics!.barCompliance.status = barStatus === 'active' ? 'compliant' : 'non-compliant'
      this.metrics!.barCompliance.lastVerified = now.toISOString()
    }

    // Assess malpractice insurance
    if (credentials.malpracticeInsurance) {
      const expirationDate = new Date(credentials.malpracticeInsurance.expirationDate)
      const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysUntilExpiration > 30) {
        this.metrics!.malpracticeInsurance.status = 'active'
      } else if (daysUntilExpiration > 0) {
        this.metrics!.malpracticeInsurance.status = 'pending'
        this.createAlert('insurance-renewal', 'high', 'Malpractice Insurance Renewal Due', 
          `Your malpractice insurance expires in ${daysUntilExpiration} days`, credentials.malpracticeInsurance.expirationDate)
      } else {
        this.metrics!.malpracticeInsurance.status = 'expired'
        this.createViolation('insurance', 'high', 'Malpractice insurance has expired')
      }
    }

    // Assess continuing education
    if (credentials.continuingEducation) {
      const hoursCompleted = credentials.continuingEducation.hoursCompleted
      const hoursRequired = credentials.continuingEducation.requiredHours
      
      if (hoursCompleted >= hoursRequired) {
        this.metrics!.continuingEducation.status = 'current'
      } else if (hoursCompleted >= hoursRequired * 0.75) {
        this.metrics!.continuingEducation.status = 'behind'
        this.createAlert('cle-deadline', 'medium', 'CLE Hours Behind Schedule', 
          `You need ${hoursRequired - hoursCompleted} more CLE hours`)
      } else {
        this.metrics!.continuingEducation.status = 'overdue'
        this.createViolation('cle', 'medium', `CLE requirements not met: ${hoursCompleted}/${hoursRequired} hours`)
      }
    }

    // Calculate overall compliance score
    this.calculateOverallScore()
    
    this.metrics!.lastAssessment = now.toISOString()
    this.metrics!.nextReview = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
    
    this.saveToStorage()
    return this.metrics!
  }

  private calculateOverallScore(): void {
    if (!this.metrics) return

    let score = 100
    const weights = {
      barCompliance: 30,
      malpracticeInsurance: 25,
      continuingEducation: 20,
      privilegeProtection: 15,
      dataRetention: 10
    }

    // Deduct points based on compliance status
    if (this.metrics.barCompliance.status === 'non-compliant') score -= weights.barCompliance
    else if (this.metrics.barCompliance.status === 'warning') score -= weights.barCompliance * 0.5

    if (this.metrics.malpracticeInsurance.status === 'expired') score -= weights.malpracticeInsurance
    else if (this.metrics.malpracticeInsurance.status === 'pending') score -= weights.malpracticeInsurance * 0.3

    if (this.metrics.continuingEducation.status === 'overdue') score -= weights.continuingEducation
    else if (this.metrics.continuingEducation.status === 'behind') score -= weights.continuingEducation * 0.5

    if (this.metrics.privilegeProtection.status === 'violated') score -= weights.privilegeProtection
    else if (this.metrics.privilegeProtection.status === 'at-risk') score -= weights.privilegeProtection * 0.5

    if (this.metrics.dataRetention.status === 'violation') score -= weights.dataRetention
    else if (this.metrics.dataRetention.status === 'review-needed') score -= weights.dataRetention * 0.3

    this.metrics.overallScore = Math.max(0, Math.round(score))
  }

  private createViolation(type: ComplianceViolation['type'], severity: ComplianceViolation['severity'], description: string): void {
    const violation: ComplianceViolation = {
      id: this.generateId(),
      type,
      severity,
      description,
      detectedAt: new Date().toISOString(),
      status: 'open'
    }

    this.violations.push(violation)
    this.saveToStorage()
  }

  private createAlert(type: ComplianceAlert['type'], priority: ComplianceAlert['priority'], title: string, message: string, dueDate?: string): void {
    // Check if similar alert already exists
    const existingAlert = this.alerts.find(alert => 
      alert.type === type && alert.acknowledged === false
    )

    if (existingAlert) return

    const alert: ComplianceAlert = {
      id: this.generateId(),
      type,
      priority,
      title,
      message,
      dueDate,
      createdAt: new Date().toISOString(),
      acknowledged: false,
      actionRequired: true
    }

    this.alerts.push(alert)
    this.saveToStorage()
  }

  getComplianceMetrics(): ComplianceMetrics | null {
    return this.metrics
  }

  getViolations(status?: ComplianceViolation['status']): ComplianceViolation[] {
    if (status) {
      return this.violations.filter(v => v.status === status)
    }
    return this.violations
  }

  getAlerts(acknowledged?: boolean): ComplianceAlert[] {
    if (acknowledged !== undefined) {
      return this.alerts.filter(a => a.acknowledged === acknowledged)
    }
    return this.alerts
  }

  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.acknowledged = true
      this.saveToStorage()
      return true
    }
    return false
  }

  resolveViolation(violationId: string, remediation: string): boolean {
    const violation = this.violations.find(v => v.id === violationId)
    if (violation) {
      violation.status = 'resolved'
      violation.resolvedAt = new Date().toISOString()
      violation.remediation = remediation
      this.saveToStorage()
      return true
    }
    return false
  }

  async auditPrivilegeProtection(communicationCount: number): Promise<void> {
    if (!this.metrics) return

    this.metrics.privilegeProtection.communicationsSecured = communicationCount
    this.metrics.privilegeProtection.lastAudit = new Date().toISOString()

    // Check for privilege violations (mock implementation)
    const violationRisk = Math.random()
    if (violationRisk < 0.05) { // 5% chance of detecting a violation
      this.metrics.privilegeProtection.status = 'at-risk'
      this.createAlert('privilege-breach', 'high', 'Privilege Protection Alert', 
        'Potential attorney-client privilege risk detected')
    } else {
      this.metrics.privilegeProtection.status = 'protected'
    }

    this.saveToStorage()
  }

  async scheduleDataRetentionCleanup(): Promise<void> {
    if (!this.metrics) return

    const now = new Date()
    const nextCleanup = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000) // 90 days

    this.metrics.dataRetention.lastCleanup = now.toISOString()
    this.metrics.dataRetention.scheduledCleanup = nextCleanup.toISOString()
    this.metrics.dataRetention.status = 'compliant'

    this.createAlert('retention-cleanup', 'low', 'Data Retention Cleanup Scheduled', 
      'Next data retention cleanup scheduled for ' + nextCleanup.toLocaleDateString(), nextCleanup.toISOString())

    this.saveToStorage()
  }

  generateComplianceReport(): {
    summary: string
    metrics: ComplianceMetrics | null
    violations: ComplianceViolation[]
    alerts: ComplianceAlert[]
    recommendations: string[]
  } {
    const openViolations = this.getViolations('open')
    const unacknowledgedAlerts = this.getAlerts(false)
    
    const recommendations: string[] = []
    
    if (this.metrics) {
      if (this.metrics.barCompliance.status !== 'compliant') {
        recommendations.push('Renew bar admission and ensure all jurisdictions are current')
      }
      
      if (this.metrics.malpracticeInsurance.status !== 'active') {
        recommendations.push('Renew malpractice insurance coverage immediately')
      }
      
      if (this.metrics.continuingEducation.status !== 'current') {
        recommendations.push('Complete remaining CLE hours before deadline')
      }
      
      if (this.metrics.privilegeProtection.status !== 'protected') {
        recommendations.push('Review and strengthen attorney-client privilege protections')
      }
    }

    const summary = `Compliance Score: ${this.metrics?.overallScore || 0}/100. ${openViolations.length} open violations, ${unacknowledgedAlerts.length} pending alerts.`

    return {
      summary,
      metrics: this.metrics,
      violations: this.violations,
      alerts: this.alerts,
      recommendations
    }
  }

  clearAllData(): void {
    this.metrics = null
    this.violations = []
    this.alerts = []
    localStorage.removeItem('compliance_metrics')
    localStorage.removeItem('compliance_violations')
    localStorage.removeItem('compliance_alerts')
  }
}

// Export singleton instance
export const legalCompliance = new LegalComplianceMonitor()
export default legalCompliance
