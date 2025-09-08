import CryptoJS from 'crypto-js'

export interface FundraisingCampaign {
  id: string
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  isAnonymous: boolean
  category: 'therapy' | 'medication' | 'crisis' | 'general'
  createdAt: string
  expiresAt: string
  creatorId: string
  milestones: CampaignMilestone[]
  donations: AnonymousDonation[]
  zkProofs: ZKFundraisingProof[]
}

export interface CampaignMilestone {
  id: string
  amount: number
  description: string
  reached: boolean
  reachedAt?: string
}

export interface AnonymousDonation {
  id: string
  campaignId: string
  amount: number
  commitment: string
  nullifier: string
  timestamp: string
  donorAlias: string
  message?: string
  isVerified: boolean
}

export interface ZKFundraisingProof {
  id: string
  type: 'donation' | 'milestone' | 'withdrawal'
  commitment: string
  nullifier: string
  proof: string
  publicSignals: string[]
  timestamp: string
}

export interface DonationRequest {
  amount: number
  campaignId: string
  donorSecret: string
  message?: string
}

export interface WithdrawalRequest {
  campaignId: string
  amount: number
  recipientSecret: string
  purpose: string
}

class SimpleZKFundraising {
  private campaigns: Map<string, FundraisingCampaign> = new Map()
  private donations: Map<string, AnonymousDonation> = new Map()
  private proofs: Map<string, ZKFundraisingProof> = new Map()

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    try {
      const campaignsData = localStorage.getItem('zkFundraising_campaigns')
      const donationsData = localStorage.getItem('zkFundraising_donations')
      const proofsData = localStorage.getItem('zkFundraising_proofs')

      if (campaignsData) {
        const campaigns = JSON.parse(campaignsData)
        campaigns.forEach((campaign: FundraisingCampaign) => {
          this.campaigns.set(campaign.id, campaign)
        })
      }

      if (donationsData) {
        const donations = JSON.parse(donationsData)
        donations.forEach((donation: AnonymousDonation) => {
          this.donations.set(donation.id, donation)
        })
      }

      if (proofsData) {
        const proofs = JSON.parse(proofsData)
        proofs.forEach((proof: ZKFundraisingProof) => {
          this.proofs.set(proof.id, proof)
        })
      }
    } catch (error) {
      console.error('Failed to load fundraising data from storage:', error)
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('zkFundraising_campaigns', JSON.stringify(Array.from(this.campaigns.values())))
      localStorage.setItem('zkFundraising_donations', JSON.stringify(Array.from(this.donations.values())))
      localStorage.setItem('zkFundraising_proofs', JSON.stringify(Array.from(this.proofs.values())))
    } catch (error) {
      console.error('Failed to save fundraising data to storage:', error)
    }
  }

  private generateId(): string {
    return CryptoJS.lib.WordArray.random(16).toString()
  }

  private generateCommitment(amount: number, secret: string, campaignId: string): string {
    const data = `${amount}:${secret}:${campaignId}:${Date.now()}`
    return CryptoJS.SHA256(data).toString()
  }

  private generateNullifier(secret: string, campaignId: string): string {
    const data = `nullifier:${secret}:${campaignId}`
    return CryptoJS.SHA256(data).toString()
  }

  private generateDonorAlias(): string {
    const adjectives = ['Anonymous', 'Kind', 'Caring', 'Generous', 'Supportive', 'Compassionate', 'Helpful', 'Loving']
    const nouns = ['Helper', 'Supporter', 'Friend', 'Guardian', 'Angel', 'Donor', 'Advocate', 'Ally']
    const number = Math.floor(Math.random() * 1000)
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    
    return `${adjective}${noun}${number}`
  }

  private generateZKProof(type: string, commitment: string, nullifier: string): ZKFundraisingProof {
    // Simulate ZK proof generation using Midnight Network
    const proofData = {
      type,
      commitment,
      nullifier,
      timestamp: Date.now()
    }
    
    const proof = CryptoJS.SHA256(JSON.stringify(proofData)).toString()
    const publicSignals = [commitment, nullifier]

    return {
      id: this.generateId(),
      type: type as any,
      commitment,
      nullifier,
      proof,
      publicSignals,
      timestamp: new Date().toISOString()
    }
  }

  async createCampaign(
    title: string,
    description: string,
    targetAmount: number,
    category: 'therapy' | 'medication' | 'crisis' | 'general',
    creatorId: string,
    isAnonymous: boolean = true,
    durationDays: number = 30
  ): Promise<FundraisingCampaign> {
    const campaignId = this.generateId()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000)

    const milestones: CampaignMilestone[] = [
      { id: this.generateId(), amount: targetAmount * 0.25, description: '25% milestone reached', reached: false },
      { id: this.generateId(), amount: targetAmount * 0.5, description: '50% milestone reached', reached: false },
      { id: this.generateId(), amount: targetAmount * 0.75, description: '75% milestone reached', reached: false },
      { id: this.generateId(), amount: targetAmount, description: 'Goal achieved!', reached: false }
    ]

    const campaign: FundraisingCampaign = {
      id: campaignId,
      title,
      description,
      targetAmount,
      currentAmount: 0,
      isAnonymous,
      category,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      creatorId,
      milestones,
      donations: [],
      zkProofs: []
    }

    this.campaigns.set(campaignId, campaign)
    this.saveToStorage()

    return campaign
  }

  async makeDonation(request: DonationRequest): Promise<AnonymousDonation> {
    const campaign = this.campaigns.get(request.campaignId)
    if (!campaign) {
      throw new Error('Campaign not found')
    }

    if (new Date() > new Date(campaign.expiresAt)) {
      throw new Error('Campaign has expired')
    }

    const donationId = this.generateId()
    const commitment = this.generateCommitment(request.amount, request.donorSecret, request.campaignId)
    const nullifier = this.generateNullifier(request.donorSecret, request.campaignId)
    const donorAlias = this.generateDonorAlias()

    // Generate ZK proof for donation
    const zkProof = this.generateZKProof('donation', commitment, nullifier)
    this.proofs.set(zkProof.id, zkProof)

    const donation: AnonymousDonation = {
      id: donationId,
      campaignId: request.campaignId,
      amount: request.amount,
      commitment,
      nullifier,
      timestamp: new Date().toISOString(),
      donorAlias,
      message: request.message,
      isVerified: true
    }

    // Update campaign
    campaign.currentAmount += request.amount
    campaign.donations.push(donation)
    campaign.zkProofs.push(zkProof)

    // Check and update milestones
    campaign.milestones.forEach(milestone => {
      if (!milestone.reached && campaign.currentAmount >= milestone.amount) {
        milestone.reached = true
        milestone.reachedAt = new Date().toISOString()
      }
    })

    this.donations.set(donationId, donation)
    this.campaigns.set(request.campaignId, campaign)
    this.saveToStorage()

    return donation
  }

  async withdrawFunds(request: WithdrawalRequest): Promise<{ success: boolean; amount: number; txHash: string }> {
    const campaign = this.campaigns.get(request.campaignId)
    if (!campaign) {
      throw new Error('Campaign not found')
    }

    if (request.amount > campaign.currentAmount) {
      throw new Error('Insufficient funds')
    }

    const commitment = this.generateCommitment(request.amount, request.recipientSecret, request.campaignId)
    const nullifier = this.generateNullifier(request.recipientSecret, request.campaignId)

    // Generate ZK proof for withdrawal
    const zkProof = this.generateZKProof('withdrawal', commitment, nullifier)
    this.proofs.set(zkProof.id, zkProof)

    // Update campaign
    campaign.currentAmount -= request.amount
    campaign.zkProofs.push(zkProof)

    this.campaigns.set(request.campaignId, campaign)
    this.saveToStorage()

    // Simulate transaction hash
    const txHash = CryptoJS.SHA256(`withdrawal:${request.campaignId}:${request.amount}:${Date.now()}`).toString()

    return {
      success: true,
      amount: request.amount,
      txHash
    }
  }

  getCampaigns(): FundraisingCampaign[] {
    return Array.from(this.campaigns.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  getCampaignsByCategory(category: string): FundraisingCampaign[] {
    return this.getCampaigns().filter(campaign => campaign.category === category)
  }

  getCampaign(campaignId: string): FundraisingCampaign | undefined {
    return this.campaigns.get(campaignId)
  }

  getDonations(campaignId?: string): AnonymousDonation[] {
    const donations = Array.from(this.donations.values())
    if (campaignId) {
      return donations.filter(donation => donation.campaignId === campaignId)
    }
    return donations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  getZKProofs(campaignId?: string): ZKFundraisingProof[] {
    const proofs = Array.from(this.proofs.values())
    if (campaignId) {
      const campaign = this.campaigns.get(campaignId)
      return campaign ? campaign.zkProofs : []
    }
    return proofs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  verifyDonation(donationId: string): boolean {
    const donation = this.donations.get(donationId)
    if (!donation) return false

    // Verify ZK proof exists and is valid
    const proof = Array.from(this.proofs.values()).find(p => 
      p.commitment === donation.commitment && p.nullifier === donation.nullifier
    )

    return proof !== undefined && donation.isVerified
  }

  getTotalDonated(): number {
    return Array.from(this.donations.values()).reduce((total, donation) => total + donation.amount, 0)
  }

  getTotalCampaigns(): number {
    return this.campaigns.size
  }

  getSuccessfulCampaigns(): number {
    return Array.from(this.campaigns.values()).filter(campaign => 
      campaign.currentAmount >= campaign.targetAmount
    ).length
  }

  clearAllData(): void {
    this.campaigns.clear()
    this.donations.clear()
    this.proofs.clear()
    localStorage.removeItem('zkFundraising_campaigns')
    localStorage.removeItem('zkFundraising_donations')
    localStorage.removeItem('zkFundraising_proofs')
  }
}

// Export singleton instance
export const zkFundraising = new SimpleZKFundraising()
export default zkFundraising
