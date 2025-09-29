export interface ErrorContext {
    operation: string;
    component?: string;
    metadata?: Record<string, any>;
}

export class APIError extends Error {
    public code: string;
    public status?: number;
    public context: ErrorContext;

    constructor(
        message: string,
        code: string,
        context: ErrorContext,
        status?: number
    ) {
        super(message);
        this.name = 'APIError';
        this.code = code;
        this.status = status;
        this.context = context;
    }
}

export class ValidationError extends Error {
    public field: string;
    public code: string;

    constructor(message: string, field: string, code: string) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
        this.code = code;
    }
}

export function handleAPIError(error: any, context: ErrorContext): APIError {
    let message = 'Unknown API error';
    let code = 'UNKNOWN_ERROR';
    let status: number | undefined;

    if (error instanceof Response) {
        status = error.status;
        switch (status) {
            case 400:
                message = 'Invalid request';
                code = 'BAD_REQUEST';
                break;
            case 401:
                message = 'Authentication required';
                code = 'UNAUTHORIZED';
                break;
            case 403:
                message = 'Access forbidden';
                code = 'FORBIDDEN';
                break;
            case 404:
                message = 'Resource not found';
                code = 'NOT_FOUND';
                break;
            case 429:
                message = 'Too many requests';
                code = 'RATE_LIMITED';
                break;
            case 500:
                message = 'Server error';
                code = 'SERVER_ERROR';
                break;
            default:
                message = `HTTP ${status} error`;
                code = `HTTP_${status}`;
        }
    } else if (error instanceof Error) {
        message = error.message;
        if (error.message.includes('fetch')) {
            code = 'NETWORK_ERROR';
            message = 'Network connection failed';
        }
    }

    return new APIError(message, code, context, status);
}

export function isRetryableError(error: APIError): boolean {
    const retryableCodes = [
        'NETWORK_ERROR',
        'SERVER_ERROR',
        'RATE_LIMITED'
    ];

    const retryableStatuses = [408, 429, 500, 502, 503, 504];

    return (
        retryableCodes.includes(error.code) ||
        (error.status !== undefined && retryableStatuses.includes(error.status))
    );
}
