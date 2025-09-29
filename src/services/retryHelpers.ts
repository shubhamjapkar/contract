import { CONFIG } from '../config/environment.ts';

export interface RetryOptions {
    maxAttempts?: number;
    delay?: number;
    backoff?: 'linear' | 'exponential';
    maxDelay?: number;
    retryIf?: (error: Error, attempt: number) => boolean;
    onRetry?: (error: Error, attempt: number) => void;
}

export async function withRetry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = CONFIG.MAX_RETRY_ATTEMPTS,
    options: RetryOptions = {}
): Promise<T> {
    const {
        delay = CONFIG.RETRY_DELAY_MS,
        backoff = 'exponential',
        maxDelay = 30000,
        retryIf,
        onRetry
    } = options;

    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));

            // Check if we should retry this error
            if (retryIf && !retryIf(lastError, attempt)) {
                throw lastError;
            }

            // Don't retry on the last attempt
            if (attempt === maxAttempts) {
                throw lastError;
            }

            // Calculate delay
            let retryDelay = delay;
            if (backoff === 'exponential') {
                retryDelay = Math.min(delay * Math.pow(2, attempt - 1), maxDelay);
            } else {
                retryDelay = Math.min(delay * attempt, maxDelay);
            }

            // Call retry callback
            if (onRetry) {
                onRetry(lastError, attempt);
            }

            if (CONFIG.ENABLE_DEBUG_MODE) {
                console.log(`Retry attempt ${attempt}/${maxAttempts} after ${retryDelay}ms:`, lastError.message);
            }

            // Wait before retrying
            await sleep(retryDelay);
        }
    }

    throw lastError!;
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function isRetryableError(error: Error): boolean {
    const retryableMessages = [
        'network',
        'timeout',
        'connection',
        'ETIMEDOUT',
        'ECONNRESET',
        'ECONNREFUSED',
        'rate limit',
        'server error',
        'internal error'
    ];

    const message = error.message.toLowerCase();
    return retryableMessages.some(msg => message.includes(msg));
}