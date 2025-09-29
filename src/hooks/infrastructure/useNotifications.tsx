import { useState, useCallback, useRef, useEffect } from 'react';
import { Notification, NotificationType, NotificationAction } from '../../interface/api';

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const timeoutsRef = useRef<any>(new Map());

    const generateId = () => `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const notify = useCallback((
        title: string,
        message: string,
        type: NotificationType = 'info',
        options: {
            duration?: number;
            persistent?: boolean;
            actions?: NotificationAction[];
            metadata?: Record<string, any>;
        } = {}
    ) => {
        const id = generateId();
        const duration = options.persistent ? 0 : (options.duration ?? 5000);

        const notification: Notification = {
            id,
            type,
            title,
            message,
            duration,
            persistent: options.persistent,
            actions: options.actions,
            metadata: options.metadata,
        };

        setNotifications(prev => [...prev, notification]);

        // Auto-remove after duration (if not persistent)
        if (duration > 0) {
            const timeout = setTimeout(() => {
                remove(id);
            }, duration);
            timeoutsRef.current.set(id, timeout);
        }

        return id;
    }, []);

    const remove = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));

        // Clear timeout if exists
        const timeout = timeoutsRef.current.get(id);
        if (timeout) {
            clearTimeout(timeout);
            timeoutsRef.current.delete(id);
        }
    }, []);

    const clear = useCallback(() => {
        // Clear all timeouts
        timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
        timeoutsRef.current.clear();
        setNotifications([]);
    }, []);

    const update = useCallback((id: string, updates: Partial<Notification>) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, ...updates }
                    : notification
            )
        );
    }, []);

    // Convenience methods
    const success = useCallback((title: string, message: string, options?: any) =>
        notify(title, message, 'success', options), [notify]);

    const error = useCallback((title: string, message: string, options?: any) =>
        notify(title, message, 'error', { persistent: true, ...options }), [notify]);

    const warning = useCallback((title: string, message: string, options?: any) =>
        notify(title, message, 'warning', options), [notify]);

    const info = useCallback((title: string, message: string, options?: any) =>
        notify(title, message, 'info', options), [notify]);

    // Clean up timeouts on unmount
    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
            timeoutsRef.current.clear();
        };
    }, []);

    return {
        notifications,
        notify,
        remove,
        clear,
        update,
        success,
        error,
        warning,
        info,
    };
}