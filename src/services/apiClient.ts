import { CONFIG } from "../config/environment.ts";

export interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

class APIClient {
    private baseURL: string;

    constructor() {
        this.baseURL = CONFIG.ADMIN_API_URL;
    }

    private resolveUrl(url: string): string {
        // If URL is already absolute, use as-is
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        // Otherwise, prepend baseURL
        return `${this.baseURL}${url.startsWith('/') ? '' : '/'}${url}`;
    }

    async get<T>(url: string, config?: RequestInit): Promise<Response> {
        return fetch(this.resolveUrl(url), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...config?.headers,
            },
            ...config,
        });
    }

    async post<T>(url: string, data?: any, config?: RequestInit): Promise<Response> {
        return fetch(this.resolveUrl(url), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...config?.headers,
            },
            body: data ? JSON.stringify(data) : undefined,
            ...config,
        });
    }

    async put<T>(url: string, data?: any, config?: RequestInit): Promise<Response> {
        return fetch(this.resolveUrl(url), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...config?.headers,
            },
            body: data ? JSON.stringify(data) : undefined,
            ...config,
        });
    }

    async delete<T>(url: string, config?: RequestInit): Promise<Response> {
        return fetch(this.resolveUrl(url), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...config?.headers,
            },
            ...config,
        });
    }
}

export const apiClient = new APIClient();