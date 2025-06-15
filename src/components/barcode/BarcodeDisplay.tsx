
import React, { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';

interface BarcodeDisplayProps {
  data: string;
  type: string;
  width?: number;
  height?: number;
  className?: string;
}

const BarcodeDisplay: React.FC<BarcodeDisplayProps> = ({
  data,
  type,
  width = 300,
  height = 150,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateBarcode = async () => {
      if (!canvasRef.current || !data) return;

      try {
        if (type === 'qr') {
          await QRCode.toCanvas(canvasRef.current, data, {
            width: width,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
        } else {
          JsBarcode(canvasRef.current, data, {
            format: type.toUpperCase(),
            width: 2,
            height: height - 50,
            displayValue: true,
            fontSize: 14,
            textMargin: 5
          });
        }
      } catch (error) {
        console.error('Error generating barcode:', error);
        // Display error on canvas
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, width, height);
          ctx.fillStyle = '#ff0000';
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Error generating barcode', width / 2, height / 2);
        }
      }
    };

    generateBarcode();
  }, [data, type, width, height]);

  return (
    <div className={`border rounded-lg p-4 bg-white ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="max-w-full h-auto"
      />
    </div>
  );
};

export default BarcodeDisplay;
