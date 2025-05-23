
import React from "react";

interface BarcodeGeneratorProps {
  value: string;
  format?: "CODE128" | "CODE39" | "EAN13" | "EAN8";
  width?: number;
  height?: number;
  displayValue?: boolean;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({
  value,
  format = "CODE128",
  width = 2,
  height = 100,
  displayValue = true,
}) => {
  // Simple barcode representation for now
  // In a real implementation, you'd use a library like JsBarcode
  const generateBarcodePattern = (text: string) => {
    // Simple pattern generation based on text
    return text.split('').map((char, index) => ({
      width: (char.charCodeAt(0) % 4) + 1,
      isBar: index % 2 === 0
    }));
  };

  const pattern = generateBarcodePattern(value);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-end" style={{ height: `${height}px` }}>
        {pattern.map((bar, index) => (
          <div
            key={index}
            className={bar.isBar ? "bg-black" : "bg-white"}
            style={{
              width: `${bar.width * width}px`,
              height: `${height}px`,
            }}
          />
        ))}
      </div>
      {displayValue && (
        <span className="text-xs font-mono text-center">{value}</span>
      )}
    </div>
  );
};

export default BarcodeGenerator;
