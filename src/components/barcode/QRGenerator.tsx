
import React from "react";

interface QRGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ value, size = 100, className = "" }) => {
  // Simple QR code placeholder - in production, use a proper QR code library like qrcode.js
  return (
    <div 
      className={`bg-white border border-gray-300 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="text-xs text-center p-2 font-mono break-all">
        QR: {value.substring(0, 10)}...
      </div>
    </div>
  );
};

export default QRGenerator;
