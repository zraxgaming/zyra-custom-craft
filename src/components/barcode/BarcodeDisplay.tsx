
import React from "react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface BarcodeDisplayProps {
  type: "qr" | "code128" | "ean13";
  data: string;
  width?: number;
  height?: number;
}

const BarcodeDisplay: React.FC<BarcodeDisplayProps> = ({ 
  type, 
  data, 
  width = 200, 
  height = 200 
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (type === "qr") {
      QRCode.toDataURL(data, {
        width: width,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      .then(url => {
        setQrDataUrl(url);
      })
      .catch(err => {
        console.error(err);
      });
    }
  }, [data, type, width]);

  if (type === "qr") {
    return qrDataUrl ? (
      <img src={qrDataUrl} alt={`QR Code: ${data}`} className="mx-auto" />
    ) : (
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800" style={{ width, height }}>
        <span className="text-gray-500">Loading QR Code...</span>
      </div>
    );
  }

  // For code128 and ean13, we'll show a placeholder for now
  return (
    <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600" style={{ width, height }}>
      <div className="text-center">
        <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">{type.toUpperCase()}</p>
        <p className="text-gray-700 dark:text-gray-300 font-mono text-xs mt-1">{data}</p>
      </div>
    </div>
  );
};

export default BarcodeDisplay;
