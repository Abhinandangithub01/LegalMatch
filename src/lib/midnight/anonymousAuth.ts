// Anonymous Authentication System
// Uses cryptographic keys for anonymous account persistence

import { generateProof } from './zkProof'

export interface AnonymousAccount {
  anonymousId: string
  publicKey: string
  encryptedPrivateKey: string
  anonymousName: string
  createdAt: number
  lastLoginAt: number
  supportTypes: string[]
  preferences: any
}

export interface LoginCredentials {
  anonymousId: string
  passphrase: string
}

class AnonymousAuthSystem {
  private readonly STORAGE_KEY = 'anonymous_accounts'
  private readonly CURRENT_USER_KEY = 'current_anonymous_user'

  // Generate a new anonymous account
  async createAnonymousAccount(
    anonymousName: string,
    supportTypes: string[],
    preferences: any,
    passphrase: string
  ): Promise<AnonymousAccount> {
    try {
      // Generate cryptographic key pair
      const keyPair = await this.generateKeyPair()
      const anonymousId = this.generateAnonymousId(keyPair.publicKey)
      
      // Encrypt private key with passphrase
      const encryptedPrivateKey = await this.encryptPrivateKey(keyPair.privateKey, passphrase)
      
      const account: AnonymousAccount = {
        anonymousId,
        publicKey: keyPair.publicKey,
        encryptedPrivateKey,
        anonymousName,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
        supportTypes,
        preferences
      }

      // Store account
      this.storeAccount(account)
      this.setCurrentUser(account)

      return account
    } catch (error) {
      throw new Error(`Failed to create anonymous account: ${error.message}`)
    }
  }

  // Login with anonymous credentials
  async loginAnonymous(credentials: LoginCredentials): Promise<AnonymousAccount> {
    try {
      const accounts = this.getStoredAccounts()
      const account = accounts.find(acc => acc.anonymousId === credentials.anonymousId)
      
      if (!account) {
        throw new Error('Anonymous account not found')
      }

      // Verify passphrase by attempting to decrypt private key
      const privateKey = await this.decryptPrivateKey(account.encryptedPrivateKey, credentials.passphrase)
      
      if (!privateKey) {
        throw new Error('Invalid passphrase')
      }

      // Update last login
      account.lastLoginAt = Date.now()
      this.updateAccount(account)
      this.setCurrentUser(account)

      return account
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`)
    }
  }

  // Get current logged in user
  getCurrentUser(): AnonymousAccount | null {
    try {
      const stored = localStorage.getItem(this.CURRENT_USER_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.warn('Failed to get current user:', error)
      return null
    }
  }

  // Logout current user
  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY)
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null
  }

  // Generate anonymous login QR code for easy access
  generateLoginQR(anonymousId: string): string {
    const loginData = {
      type: 'anonymous_login',
      anonymousId,
      platform: 'mindful_sanctuary',
      timestamp: Date.now()
    }
    
    // In production, this would generate an actual QR code
    return btoa(JSON.stringify(loginData))
  }

  // Recover account using backup phrase
  async recoverAccount(backupPhrase: string): Promise<AnonymousAccount | null> {
    try {
      const accounts = this.getStoredAccounts()
      
      // In production, backup phrase would be cryptographically linked to account
      const account = accounts.find(acc => 
        this.generateBackupPhrase(acc.publicKey) === backupPhrase
      )
      
      if (account) {
        this.setCurrentUser(account)
        return account
      }
      
      return null
    } catch (error) {
      console.error('Account recovery failed:', error)
      return null
    }
  }

  // Generate backup phrase for account recovery
  generateBackupPhrase(publicKey: string): string {
    // Simple backup phrase generation (in production, use proper BIP39)
    const words = [
      'anonymous', 'sanctuary', 'mindful', 'support', 'private', 'secure',
      'healing', 'community', 'trust', 'safe', 'encrypted', 'protected'
    ]
    
    const hash = this.simpleHash(publicKey)
    const indices = []
    
    for (let i = 0; i < 6; i++) {
      indices.push(parseInt(hash.substring(i * 2, i * 2 + 2), 16) % words.length)
    }
    
    return indices.map(i => words[i]).join(' ')
  }

  // Delete/Reset anonymous account and ZK identity
  async deleteAccount(anonymousId: string, passphrase: string): Promise<boolean> {
    try {
      const accounts = this.getStoredAccounts()
      const account = accounts.find(acc => acc.anonymousId === anonymousId)
      
      if (!account) {
        throw new Error('Account not found')
      }

      // Verify passphrase before deletion
      const privateKey = await this.decryptPrivateKey(account.encryptedPrivateKey, passphrase)
      if (!privateKey) {
        throw new Error('Invalid passphrase')
      }

      // Remove account from storage
      const updatedAccounts = accounts.filter(acc => acc.anonymousId !== anonymousId)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedAccounts))

      // Clear current user if it's the deleted account
      const currentUser = this.getCurrentUser()
      if (currentUser && currentUser.anonymousId === anonymousId) {
        this.logout()
      }

      // Clear any ZK circuit data associated with this identity
      this.clearZKCircuitData(anonymousId)

      return true
    } catch (error) {
      console.error('Account deletion failed:', error)
      return false
    }
  }

  // Reset anonymous identity (create new identity with same preferences)
  async resetIdentity(currentPassphrase: string, newAnonymousName?: string, newPassphrase?: string): Promise<AnonymousAccount | null> {
    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) {
        throw new Error('No current user to reset')
      }

      // Verify current passphrase
      const privateKey = await this.decryptPrivateKey(currentUser.encryptedPrivateKey, currentPassphrase)
      if (!privateKey) {
        throw new Error('Invalid current passphrase')
      }

      // Save current preferences
      const savedPreferences = { ...currentUser.preferences }
      const savedSupportTypes = [...currentUser.supportTypes]

      // Delete current account
      await this.deleteAccount(currentUser.anonymousId, currentPassphrase)

      // Create new account with saved preferences
      const newAccount = await this.createAnonymousAccount(
        newAnonymousName || this.generateRandomAnonymousName(),
        savedSupportTypes,
        savedPreferences,
        newPassphrase || currentPassphrase
      )

      return newAccount
    } catch (error) {
      console.error('Identity reset failed:', error)
      return null
    }
  }

  // Clear all anonymous accounts (factory reset)
  clearAllAccounts(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      localStorage.removeItem(this.CURRENT_USER_KEY)
      
      // Clear all ZK circuit data
      this.clearAllZKCircuitData()
      
      console.log('All anonymous accounts cleared')
    } catch (error) {
      console.error('Failed to clear accounts:', error)
    }
  }

  // Get all stored accounts (for account management UI)
  getAllAccounts(): AnonymousAccount[] {
    return this.getStoredAccounts()
  }

  // Generate random anonymous name
  private generateRandomAnonymousName(): string {
    const adjectives = [
      'Peaceful', 'Hopeful', 'Gentle', 'Brave', 'Calm', 'Wise', 'Kind', 'Strong',
      'Serene', 'Bright', 'Quiet', 'Warm', 'Safe', 'Free', 'Pure', 'Light'
    ]
    
    const animals = [
      'Butterfly', 'Dove', 'Owl', 'Fox', 'Wolf', 'Eagle', 'Swan', 'Deer',
      'Rabbit', 'Cat', 'Bird', 'Turtle', 'Bear', 'Lion', 'Tiger', 'Whale'
    ]
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const animal = animals[Math.floor(Math.random() * animals.length)]
    const number = Math.floor(Math.random() * 999) + 1
    
    return `${adjective}${animal}${number}`
  }

  // Clear ZK circuit data for specific identity
  private clearZKCircuitData(anonymousId: string): void {
    try {
      // Clear RLN nullifiers
      const rlnKey = `rln_nullifiers_${anonymousId}`
      localStorage.removeItem(rlnKey)
      
      // Clear ZK proof cache
      const proofKey = `zk_proofs_${anonymousId}`
      localStorage.removeItem(proofKey)
      
      // Clear circuit state
      const circuitKey = `circuit_state_${anonymousId}`
      localStorage.removeItem(circuitKey)
      
      console.log(`Cleared ZK circuit data for ${anonymousId}`)
    } catch (error) {
      console.error('Failed to clear ZK circuit data:', error)
    }
  }

  // Clear all ZK circuit data
  private clearAllZKCircuitData(): void {
    try {
      const keys = Object.keys(localStorage)
      const zkKeys = keys.filter(key => 
        key.startsWith('rln_') || 
        key.startsWith('zk_proofs_') || 
        key.startsWith('circuit_state_')
      )
      
      zkKeys.forEach(key => localStorage.removeItem(key))
      console.log(`Cleared ${zkKeys.length} ZK circuit data entries`)
    } catch (error) {
      console.error('Failed to clear all ZK circuit data:', error)
    }
  }

  // Private methods
  private async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    // Mock key generation for development
    const privateKey = this.generateRandomKey(64)
    const publicKey = this.generateRandomKey(64)
    
    return { publicKey, privateKey }
  }

  private generateAnonymousId(publicKey: string): string {
    return 'anon_' + this.simpleHash(publicKey).substring(0, 16)
  }

  private async encryptPrivateKey(privateKey: string, passphrase: string): Promise<string> {
    // Simple encryption for development (use proper encryption in production)
    const key = this.simpleHash(passphrase)
    return btoa(privateKey + '::' + key)
  }

  private async decryptPrivateKey(encryptedPrivateKey: string, passphrase: string): Promise<string | null> {
    try {
      const decoded = atob(encryptedPrivateKey)
      const [privateKey, storedKey] = decoded.split('::')
      const expectedKey = this.simpleHash(passphrase)
      
      return storedKey === expectedKey ? privateKey : null
    } catch (error) {
      return null
    }
  }

  private generateRandomKey(length: number): string {
    const chars = '0123456789abcdef'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result
  }

  private simpleHash(input: string): string {
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0')
  }

  private getStoredAccounts(): AnonymousAccount[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.warn('Failed to load stored accounts:', error)
      return []
    }
  }

  private storeAccount(account: AnonymousAccount): void {
    try {
      const accounts = this.getStoredAccounts()
      accounts.push(account)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(accounts))
    } catch (error) {
      console.error('Failed to store account:', error)
    }
  }

  private updateAccount(updatedAccount: AnonymousAccount): void {
    try {
      const accounts = this.getStoredAccounts()
      const index = accounts.findIndex(acc => acc.anonymousId === updatedAccount.anonymousId)
      
      if (index !== -1) {
        accounts[index] = updatedAccount
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(accounts))
      }
    } catch (error) {
      console.error('Failed to update account:', error)
    }
  }

  private setCurrentUser(account: AnonymousAccount): void {
    try {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(account))
    } catch (error) {
      console.error('Failed to set current user:', error)
    }
  }
}

// Global instance
export const anonymousAuth = new AnonymousAuthSystem()

// Utility functions
export async function createAnonymousAccount(
  anonymousName: string,
  supportTypes: string[],
  preferences: any,
  passphrase: string
): Promise<AnonymousAccount> {
  return await anonymousAuth.createAnonymousAccount(anonymousName, supportTypes, preferences, passphrase)
}

export async function loginAnonymous(anonymousId: string, passphrase: string): Promise<AnonymousAccount> {
  return await anonymousAuth.loginAnonymous({ anonymousId, passphrase })
}

export function getCurrentAnonymousUser(): AnonymousAccount | null {
  return anonymousAuth.getCurrentUser()
}

export function logoutAnonymous(): void {
  anonymousAuth.logout()
}

export function isAnonymouslyLoggedIn(): boolean {
  return anonymousAuth.isLoggedIn()
}

export async function deleteAccount(anonymousId: string, passphrase: string): Promise<boolean> {
  return await anonymousAuth.deleteAccount(anonymousId, passphrase)
}

export async function resetIdentity(currentPassphrase: string, newAnonymousName?: string, newPassphrase?: string): Promise<AnonymousAccount | null> {
  return await anonymousAuth.resetIdentity(currentPassphrase, newAnonymousName, newPassphrase)
}

export function clearAllAccounts(): void {
  anonymousAuth.clearAllAccounts()
}

export function getAllAccounts(): AnonymousAccount[] {
  return anonymousAuth.getAllAccounts()
}
