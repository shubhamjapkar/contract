import React, { useState } from "react";

interface CopyIconProps {
    textToCopy?: string;
}

export default function CopyIcon({ textToCopy = "" }: CopyIconProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleCopy = async () => {
        if (!textToCopy) return;

        try {
            await navigator.clipboard.writeText(textToCopy);
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 2000);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    };

    return (
        <div className="relative">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                className="cursor-pointer hover:opacity-100 opacity-80 transition-opacity"
                onClick={handleCopy}
            >
                <path d="M20.5 2H10.5C9.397 2 8.5 2.897 8.5 4V8H4.5C3.397 8 2.5 8.897 2.5 10V20C2.5 21.103 3.397 22 4.5 22H14.5C15.603 22 16.5 21.103 16.5 20V16H20.5C21.603 16 22.5 15.103 22.5 14V4C22.5 2.897 21.603 2 20.5 2ZM4.5 20V10H14.5L14.502 20H4.5ZM20.5 14H16.5V10C16.5 8.897 15.603 8 14.5 8H10.5V4H20.5V14Z" fill="white" fillOpacity="0.8"/>
            </svg>

            {showTooltip && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                    Copied!
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-green-600"></div>
                </div>
            )}
        </div>
    );
}