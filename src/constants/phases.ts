import { MintPhase } from "../interface/api";

export const PHASE_CONFIG = {
    [MintPhase.CLOSED]: {
        name: 'CLOSED',
        description: 'Minting is currently closed',
        color: 'red',
        bgColor: 'bg-red-900/50',
        borderColor: 'border-red-600',
        textColor: 'text-red-400',
        allowsMinting: false,
        requiresPayment: false,
        showProgress: false
    },
    [MintPhase.CLAIM]: {
        name: 'CLAIM',
        description: 'Free claiming for presale participants',
        color: 'green',
        bgColor: 'bg-green-900/50',
        borderColor: 'border-green-600',
        textColor: 'text-green-400',
        allowsMinting: true,
        requiresPayment: false,
        showProgress: true
    },
    [MintPhase.GUARANTEED]: {
        name: 'GUARANTEED',
        description: 'Paid minting with guaranteed allocation',
        color: 'blue',
        bgColor: 'bg-blue-900/50',
        borderColor: 'border-blue-600',
        textColor: 'text-blue-400',
        allowsMinting: true,
        requiresPayment: true,
        showProgress: true
    },
    [MintPhase.FCFS]: {
        name: 'FCFS',
        description: 'First come, first served for whitelisted users',
        color: 'purple',
        bgColor: 'bg-purple-900/50',
        borderColor: 'border-purple-600',
        textColor: 'text-purple-400',
        allowsMinting: true,
        requiresPayment: true,
        showProgress: true
    }
} as const;

export function getPhaseConfig(phase: MintPhase) {
    return PHASE_CONFIG[phase];
}