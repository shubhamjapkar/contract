import React from 'react';
import { useNotifications } from '../../hooks/infrastructure/useNotifications.tsx';
import { NotificationType } from '../../interface/api.ts';

const NotificationIcon = ({ type }: { type: NotificationType }) => {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
    };
    return <span className="text-lg">{icons[type]}</span>;
};

export const NotificationCenter: React.FC = () => {
    const { notifications, remove } = useNotifications();

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`
            p-4 rounded-lg shadow-lg border backdrop-blur-sm
            transform transition-all duration-300 ease-in-out
            ${notification.type === 'success'
                        ? 'bg-green-900/90 border-green-500 text-green-100'
                        : ''
                    }
            ${notification.type === 'error'
                        ? 'bg-red-900/90 border-red-500 text-red-100'
                        : ''
                    }
            ${notification.type === 'warning'
                        ? 'bg-yellow-900/90 border-yellow-500 text-yellow-100'
                        : ''
                    }
            ${notification.type === 'info'
                        ? 'bg-blue-900/90 border-blue-500 text-blue-100'
                        : ''
                    }
          `}
                    role="alert"
                    aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
                >
                    <div className="flex items-start gap-3">
                        <NotificationIcon type={notification.type} />

                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm leading-5">
                                {notification.title}
                            </h4>
                            <p className="text-sm opacity-90 mt-1 leading-relaxed">
                                {notification.message}
                            </p>

                            {notification.actions && notification.actions.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {notification.actions.map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={action.action}
                                            className={`
                        px-3 py-1 text-xs font-medium rounded
                        transition-colors duration-200
                        ${action.style === 'primary'
                                                ? 'bg-white/20 hover:bg-white/30 text-white'
                                                : 'bg-white/10 hover:bg-white/20 text-white/80'
                                            }
                      `}
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {!notification.persistent && (
                            <button
                                onClick={() => remove(notification.id)}
                                className="text-white/70 hover:text-white transition-colors duration-200 ml-2"
                                aria-label="Dismiss notification"
                            >
                                <span className="text-lg leading-none">×</span>
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};