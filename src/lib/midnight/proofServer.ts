import { ProofResult } from './midnightIntegration';

// Browser polyfill for Node.js globals
const processPolyfill = {
  env: {
    NODE_ENV: 'development'
  }
};

// Make process available globally if not defined
if (typeof window !== 'undefined' && typeof (window as any).process === 'undefined') {
  (window as any).process = processPolyfill;
}

export interface ProofServerConfig {
  url: string;
  timeout: number;
  retries: number;
}

export interface ProofRequest {
  circuitName: string;
  inputs: Record<string, any>;
  requestId: string;
}

export interface ProofResponse {
  success: boolean;
  proof?: ProofResult;
  error?: string;
  processingTime?: number;
}

export class ProofServerClient {
  private config: ProofServerConfig;
  private isConnected = false;
  private connectionAttempts = 0;
  private maxConnectionAttempts = 3;

  constructor(config: Partial<ProofServerConfig> = {}) {
    this.config = {
      url: config.url || 'http://localhost:8080',
      timeout: config.timeout || 30000, // 30 seconds
      retries: config.retries || 3
    };
    
    this.checkConnection();
  }

  // Check if proof server is running
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.url}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000) // 5 second timeout for health check
      });

      if (response.ok) {
        const data = await response.json();
        this.isConnected = data.status === 'healthy';
        this.connectionAttempts = 0;
        
        if (this.isConnected) {
          console.log('✅ Proof server connected:', this.config.url);
        }
        
        return this.isConnected;
      }
    } catch (error) {
      this.connectionAttempts++;
      console.warn(`⚠️ Proof server connection attempt ${this.connectionAttempts} failed:`, error);
      
      if (this.connectionAttempts >= this.maxConnectionAttempts) {
        console.error('❌ Max connection attempts reached. Running in mock mode.');
        this.isConnected = false;
      }
    }
    
    return false;
  }

  // Generate proof using proof server
  async generateProof(
    circuitName: string,
    inputs: Record<string, any>
  ): Promise<ProofResult> {
    if (!this.isConnected) {
      const connected = await this.checkConnection();
      if (!connected) {
        throw new Error('Proof server not available');
      }
    }

    const requestId = this.generateRequestId();
    const startTime = Date.now();

    try {
      const proofRequest: ProofRequest = {
        circuitName,
        inputs,
        requestId
      };

      const response = await fetch(`${this.config.url}/generate-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId
        },
        body: JSON.stringify(proofRequest),
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        throw new Error(`Proof server error: ${response.status} ${response.statusText}`);
      }

      const result: ProofResponse = await response.json();
      const processingTime = Date.now() - startTime;

      if (!result.success || !result.proof) {
        throw new Error(result.error || 'Proof generation failed');
      }

      console.log(`✅ Proof generated in ${processingTime}ms for circuit: ${circuitName}`);
      return result.proof;

    } catch (error) {
      console.error(`❌ Proof generation failed for ${circuitName}:`, error);
      throw error;
    }
  }

  // Verify proof using proof server
  async verifyProof(
    circuitName: string,
    proof: ProofResult
  ): Promise<boolean> {
    if (!this.isConnected) {
      const connected = await this.checkConnection();
      if (!connected) {
        return false;
      }
    }

    try {
      const response = await fetch(`${this.config.url}/verify-proof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          circuitName,
          proof: proof.proof,
          publicSignals: proof.publicSignals
        }),
        signal: AbortSignal.timeout(10000) // 10 second timeout for verification
      });

      if (!response.ok) {
        throw new Error(`Verification error: ${response.status}`);
      }

      const result = await response.json();
      return result.valid === true;

    } catch (error) {
      console.error(`❌ Proof verification failed for ${circuitName}:`, error);
      return false;
    }
  }

  // Get proof server statistics
  async getStats(): Promise<any> {
    if (!this.isConnected) {
      return null;
    }

    try {
      const response = await fetch(`${this.config.url}/stats`, {
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Failed to get proof server stats:', error);
    }

    return null;
  }

  // List available circuits
  async getAvailableCircuits(): Promise<string[]> {
    if (!this.isConnected) {
      return [];
    }

    try {
      const response = await fetch(`${this.config.url}/circuits`, {
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        const data = await response.json();
        return data.circuits || [];
      }
    } catch (error) {
      console.warn('Failed to get available circuits:', error);
    }

    return [];
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  // Getters
  get connected(): boolean {
    return this.isConnected;
  }

  get serverUrl(): string {
    return this.config.url;
  }
}

// Mock proof server for development
export class MockProofServer {
  private processingDelay: number;

  constructor(processingDelay = 100) {
    this.processingDelay = processingDelay;
  }

  async generateProof(
    circuitName: string,
    inputs: Record<string, any>
  ): Promise<ProofResult> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, this.processingDelay));

    // Generate mock proof
    const mockProof = this.hashInputs(circuitName, inputs);
    
    return {
      proof: mockProof,
      publicSignals: Object.values(inputs).map(v => v.toString()),
      nullifier: inputs.nullifier || this.hashInputs('nullifier', inputs),
      commitment: inputs.commitment || this.hashInputs('commitment', inputs)
    };
  }

  async verifyProof(
    circuitName: string,
    proof: ProofResult
  ): Promise<boolean> {
    // Simulate verification time
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Mock verification - always return true for valid-looking proofs
    return proof.proof.length > 0 && proof.publicSignals.length > 0;
  }

  async getStats() {
    return {
      status: 'mock',
      proofsGenerated: Math.floor(Math.random() * 1000),
      averageProcessingTime: this.processingDelay,
      circuitsLoaded: 6
    };
  }

  async getAvailableCircuits(): Promise<string[]> {
    return [
      'identity_verification',
      'membership_rln',
      'economic_bonding',
      'harassment_report',
      'bond_slashing',
      'reputation_update'
    ];
  }

  private hashInputs(prefix: string, inputs: Record<string, any>): string {
    const inputString = JSON.stringify(inputs);
    // Simple hash function for mock purposes
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
      const char = inputString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `${prefix}_${Math.abs(hash).toString(16)}_${Date.now()}`;
  }

  get connected(): boolean {
    return true;
  }

  get serverUrl(): string {
    return 'mock://localhost:8080';
  }
}

// Factory function to create appropriate proof server
export function createProofServer(useMock = false): ProofServerClient | MockProofServer {
  if (useMock || process.env.VITE_USE_MOCK_PROOFS === 'true') {
    console.log('🔄 Using mock proof server for development');
    return new MockProofServer();
  } else {
    return new ProofServerClient();
  }
}

// Export singleton instance
export const proofServer = createProofServer();
