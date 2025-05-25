
import React from "react";

interface BarcodeGeneratorProps {
  value: string;
  format?: string;
  width?: number;
  height?: number;
  className?: string;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({ 
  value, 
  format = "CODE128", 
  width = 2, 
  height = 50, 
  className = "" 
}) => {
  // Simple barcode placeholder - in production, use a proper barcode library like JsBarcode
  return (
    <div className={`bg-white border border-gray-300 flex flex-col items-center justify-center p-2 ${className}`}>
      <div className="flex">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className={`${i % 2 === 0 ? 'bg-black' : 'bg-white'}`}
            style={{ width: width, height: height }}
          />
        ))}
      </div>
      <div className="text-xs mt-1 font-mono">{value}</div>
    </div>
  );
};

export default BarcodeGenerator;
