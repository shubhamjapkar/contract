export interface StorageItem<T = any> {
    value: T;
    timestamp: number;
    expiry?: number;
}

class StorageHelper {
    private prefix: string;

    constructor(prefix: string = 'cinefi_') {
        this.prefix = prefix;
    }

    set<T>(key: string, value: T, expiryMinutes?: number): void {
        try {
            const item: StorageItem<T> = {
                value,
                timestamp: Date.now(),
                expiry: expiryMinutes ? Date.now() + (expiryMinutes * 60 * 1000) : undefined
            };

            localStorage.setItem(
                `${this.prefix}${key}`,
                JSON.stringify(item)
            );
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }

    get<T>(key: string): T | null {
        try {
            const storedData = localStorage.getItem(`${this.prefix}${key}`);

            if (!storedData) {
                return null;
            }

            const item: StorageItem<T> = JSON.parse(storedData);

            // Check expiry
            if (item.expiry && Date.now() > item.expiry) {
                this.remove(key);
                return null;
            }

            return item.value;
        } catch (error) {
            console.warn('Failed to read from localStorage:', error);
            return null;
        }
    }

    remove(key: string): void {
        try {
            localStorage.removeItem(`${this.prefix}${key}`);
        } catch (error) {
            console.warn('Failed to remove from localStorage:', error);
        }
    }

    clear(): void {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('Failed to clear localStorage:', error);
        }
    }
}

export const storage = new StorageHelper();
export const whitelistStorage = new StorageHelper('cinefi_whitelist_');
export const contractStorage = new StorageHelper('cinefi_contract_');