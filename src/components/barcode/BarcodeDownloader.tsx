
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';

interface BarcodeDownloaderProps {
  data: string;
  type: string;
  filename?: string;
}

const BarcodeDownloader: React.FC<BarcodeDownloaderProps> = ({
  data,
  type,
  filename = 'barcode'
}) => {
  const downloadBarcode = async () => {
    try {
      let canvas: HTMLCanvasElement;

      if (type === 'qr') {
        // Generate QR Code
        canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, data, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
      } else {
        // Generate Barcode
        canvas = document.createElement('canvas');
        JsBarcode(canvas, data, {
          format: type.toUpperCase(),
          width: 2,
          height: 100,
          displayValue: true
        });
      }

      // Download the image
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating barcode:', error);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={downloadBarcode}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Download
    </Button>
  );
};

export default BarcodeDownloader;
