
import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

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
  height = 100,
  className = "" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      try {
        JsBarcode(canvasRef.current, value, {
          format,
          width,
          height,
          displayValue: true,
          fontSize: 20,
          textMargin: 5
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
      }
    }
  }, [value, format, width, height]);

  if (!value) {
    return <div className={`${className} flex items-center justify-center`}>No value provided</div>;
  }

  return (
    <div className={className}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default BarcodeGenerator;
