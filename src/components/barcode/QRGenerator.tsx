
import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ 
  value, 
  size = 200, 
  className = "" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).catch(console.error);
    }
  }, [value, size]);

  if (!value) {
    return <div className={`${className} flex items-center justify-center`}>No value provided</div>;
  }

  return (
    <div className={className}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default QRGenerator;
