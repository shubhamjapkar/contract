export interface WhitelistStatus {
    wallet: string;
    entries: WhitelistEntry[];
    totalAllowedQuantity: number;
}

export interface WhitelistEntry {
    tierId: number;
    phaseId: number;
    allowedQuantity: number;
}

export interface MerkleProofResponse {
    proof: string[];
    root: string;
    leaf: string;
    isValid: boolean;
}

export interface UpdateMintDateResponse {
    success: boolean;
    updatedTokens: number;
    errors: string[];
    results: Array<{
        tokenId: number;
        updated: boolean;
        error?: string;
    }>;
}

// src/types/contract.ts
export enum MintPhase {
    CLOSED = 0,
    CLAIM = 1,
    GUARANTEED = 2,
    FCFS = 3
}

export const PHASE_NAMES: Record<MintPhase, string> = {
    [MintPhase.CLOSED]: 'CLOSED',
    [MintPhase.CLAIM]: 'CLAIM',
    [MintPhase.GUARANTEED]: 'GUARANTEED',
    [MintPhase.FCFS]: 'FCFS',
};

export const PHASE_DESCRIPTIONS: Record<MintPhase, string> = {
    [MintPhase.CLOSED]: 'Minting is currently closed',
    [MintPhase.CLAIM]: 'Free claiming for presale participants',
    [MintPhase.GUARANTEED]: 'Paid minting with guaranteed allocation',
    [MintPhase.FCFS]: 'First come, first served for whitelisted users',
};

export interface TierInfo {
    name: string;
    price: bigint;
    maxSupply: number;
    currentSupply: number;
}

export interface MintTransaction {
    success: boolean;
    txHash: string;
    tokenIds: number[];
    gasUsed?: number;
    effectiveGasPrice?: bigint;
}

// src/types/ui.ts
export interface LoadingState {
    isLoading: boolean;
    operation: string | null;
    progress?: {
        current: number;
        total: number;
        step: string;
    };
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}

export interface ValidationError {
    field: string;
    message: string;
    code: string;
}

export interface ValidationWarning {
    message: string;
    type: 'info' | 'warning';
}

// src/types/notifications.ts
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationAction {
    label: string;
    action: () => void;
    style?: 'primary' | 'secondary';
}

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
    persistent?: boolean;
    actions?: NotificationAction[];
    metadata?: Record<string, any>;
}