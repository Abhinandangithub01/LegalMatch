import { generateProof, verifyProof } from './zkProof'

// Rate-Limit Nullifier (RLN) System
// Prevents spam while maintaining anonymity using epoch-based nullifiers

export interface RLNConfig {
  epochDuration: number // Duration of each epoch in milliseconds
  maxMessagesPerEpoch: number // Maximum messages allowed per user per epoch
  circuitWasmPath: string
  circuitZkeyPath: string
}

export interface RLNProof {
  nullifier: string
  epoch: number
  proof: any
  publicSignals: string[]
}

export interface RLNState {
  currentEpoch: number
  nullifiers: Set<string>
  messageCount: Map<string, number>
  lastEpochUpdate: number
}

class RLNSystem {
  private config: RLNConfig
  private state: RLNState
  private readonly STORAGE_KEY = 'rln_state'

  constructor(config: RLNConfig) {
    this.config = config
    this.state = this.loadState()
    this.updateEpoch()
  }

  private loadState(): RLNState {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          currentEpoch: parsed.currentEpoch || 0,
          nullifiers: new Set(parsed.nullifiers || []),
          messageCount: new Map(parsed.messageCount || []),
          lastEpochUpdate: parsed.lastEpochUpdate || Date.now()
        }
      }
    } catch (error) {
      console.warn('Failed to load RLN state:', error)
    }

    return {
      currentEpoch: 0,
      nullifiers: new Set(),
      messageCount: new Map(),
      lastEpochUpdate: Date.now()
    }
  }

  private saveState(): void {
    try {
      const stateToSave = {
        currentEpoch: this.state.currentEpoch,
        nullifiers: Array.from(this.state.nullifiers),
        messageCount: Array.from(this.state.messageCount.entries()),
        lastEpochUpdate: this.state.lastEpochUpdate
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave))
    } catch (error) {
      console.warn('Failed to save RLN state:', error)
    }
  }

  private updateEpoch(): void {
    const now = Date.now()
    const expectedEpoch = Math.floor(now / this.config.epochDuration)
    
    if (expectedEpoch > this.state.currentEpoch) {
      // New epoch - reset nullifiers and message counts
      this.state.currentEpoch = expectedEpoch
      this.state.nullifiers.clear()
      this.state.messageCount.clear()
      this.state.lastEpochUpdate = now
      this.saveState()
    }
  }

  private generateNullifier(userSecret: string, epoch: number): string {
    // Generate deterministic nullifier for user in this epoch
    // In production, this would use proper cryptographic hash
    const data = `${userSecret}_${epoch}`
    return btoa(data).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)
  }

  async generateRLNProof(
    userSecret: string,
    messageHash: string,
    groupId: string
  ): Promise<RLNProof> {
    this.updateEpoch()

    const nullifier = this.generateNullifier(userSecret, this.state.currentEpoch)
    
    // Check if user has exceeded rate limit
    const currentCount = this.state.messageCount.get(nullifier) || 0
    if (currentCount >= this.config.maxMessagesPerEpoch) {
      throw new Error('Rate limit exceeded for this epoch')
    }

    // Check if nullifier already used (double-spending protection)
    if (this.state.nullifiers.has(nullifier)) {
      throw new Error('Nullifier already used in this epoch')
    }

    // Generate ZK proof for membership and rate limiting
    const circuitInputs = {
      userSecret: userSecret,
      epoch: this.state.currentEpoch,
      messageHash: messageHash,
      groupId: groupId,
      nullifier: nullifier
    }

    try {
      // In production, this would generate actual ZK proof
      const proof = await this.generateMockProof(circuitInputs)
      
      // Update state
      this.state.nullifiers.add(nullifier)
      this.state.messageCount.set(nullifier, currentCount + 1)
      this.saveState()

      return {
        nullifier,
        epoch: this.state.currentEpoch,
        proof: proof.proof,
        publicSignals: proof.publicSignals
      }
    } catch (error) {
      throw new Error(`Failed to generate RLN proof: ${error.message}`)
    }
  }

  private async generateMockProof(inputs: any): Promise<{ proof: any; publicSignals: string[] }> {
    // Mock proof generation for development
    // In production, this would use actual zk-SNARK circuit
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          proof: {
            pi_a: ['0x' + Math.random().toString(16).substring(2, 66)],
            pi_b: [['0x' + Math.random().toString(16).substring(2, 66)]],
            pi_c: ['0x' + Math.random().toString(16).substring(2, 66)]
          },
          publicSignals: [
            inputs.nullifier,
            inputs.epoch.toString(),
            inputs.messageHash,
            inputs.groupId
          ]
        })
      }, 100) // Simulate proof generation time
    })
  }

  async verifyRLNProof(proof: RLNProof, messageHash: string, groupId: string): Promise<boolean> {
    this.updateEpoch()

    try {
      // Verify epoch is current
      if (proof.epoch !== this.state.currentEpoch) {
        console.warn('Proof epoch mismatch')
        return false
      }

      // Verify nullifier hasn't been used
      if (this.state.nullifiers.has(proof.nullifier)) {
        console.warn('Nullifier already used')
        return false
      }

      // Verify ZK proof
      const isValidProof = await this.verifyMockProof(proof, messageHash, groupId)
      if (!isValidProof) {
        console.warn('Invalid ZK proof')
        return false
      }

      // Add nullifier to prevent reuse
      this.state.nullifiers.add(proof.nullifier)
      this.saveState()

      return true
    } catch (error) {
      console.error('RLN proof verification failed:', error)
      return false
    }
  }

  private async verifyMockProof(proof: RLNProof, messageHash: string, groupId: string): Promise<boolean> {
    // Mock proof verification for development
    // In production, this would verify actual zk-SNARK proof
    return new Promise((resolve) => {
      setTimeout(() => {
        // Basic validation of proof structure
        const hasValidStructure = proof.proof && 
          proof.publicSignals && 
          proof.publicSignals.length === 4 &&
          proof.publicSignals[2] === messageHash &&
          proof.publicSignals[3] === groupId
        
        resolve(hasValidStructure)
      }, 50)
    })
  }

  getCurrentEpoch(): number {
    this.updateEpoch()
    return this.state.currentEpoch
  }

  getRemainingMessages(userSecret: string): number {
    this.updateEpoch()
    const nullifier = this.generateNullifier(userSecret, this.state.currentEpoch)
    const used = this.state.messageCount.get(nullifier) || 0
    return Math.max(0, this.config.maxMessagesPerEpoch - used)
  }

  getEpochTimeRemaining(): number {
    this.updateEpoch()
    const now = Date.now()
    const epochStart = this.state.currentEpoch * this.config.epochDuration
    const epochEnd = epochStart + this.config.epochDuration
    return Math.max(0, epochEnd - now)
  }

  getStats() {
    this.updateEpoch()
    return {
      currentEpoch: this.state.currentEpoch,
      activeNullifiers: this.state.nullifiers.size,
      totalMessages: Array.from(this.state.messageCount.values()).reduce((a, b) => a + b, 0),
      epochTimeRemaining: this.getEpochTimeRemaining(),
      maxMessagesPerEpoch: this.config.maxMessagesPerEpoch
    }
  }
}

// Default RLN configuration
export const defaultRLNConfig: RLNConfig = {
  epochDuration: 60 * 60 * 1000, // 1 hour epochs
  maxMessagesPerEpoch: 50, // 50 messages per hour
  circuitWasmPath: '/circuits/rln.wasm',
  circuitZkeyPath: '/circuits/rln_final.zkey'
}

// Global RLN instance
export const rlnSystem = new RLNSystem(defaultRLNConfig)

// Utility functions
export async function sendMessageWithRLN(
  userSecret: string,
  message: string,
  groupId: string
): Promise<{ message: string; proof: RLNProof }> {
  const messageHash = btoa(message).substring(0, 32) // Simple hash for demo
  const proof = await rlnSystem.generateRLNProof(userSecret, messageHash, groupId)
  
  return {
    message,
    proof
  }
}

export async function verifyMessageRLN(
  message: string,
  proof: RLNProof,
  groupId: string
): Promise<boolean> {
  const messageHash = btoa(message).substring(0, 32)
  return await rlnSystem.verifyRLNProof(proof, messageHash, groupId)
}
