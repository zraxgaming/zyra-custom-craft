
import React from 'react';
// Remove bwip-js. Instead, notify user and provide helpful message.
interface Props {
  data: string;
  type: string;
  filename?: string;
}
const BarcodeDownloader: React.FC<Props> = ({ data, type, filename }) => {
  const handleDownload = async () => {
    let toCanvas: any;
    try {
      // Try to dynamically import bwip-js
      toCanvas = (await import('bwip-js')).toCanvas;
    } catch (e) {
      alert('Barcode download requires the "bwip-js" package. Please ask your admin to install it.');
      return;
    }
    const canvas = document.createElement('canvas');
    try {
      toCanvas(canvas, {
        bcid: type, // barcode type
        text: data,
        scale: 3,
        height: 10,
        includetext: true,
      });
      const link = document.createElement('a');
      link.download = `${filename || 'barcode'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      alert('Could not generate barcode!');
    }
  };

  return (
    <button type="button" className="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300" onClick={handleDownload}>
      Download
    </button>
  );
};

export default BarcodeDownloader;
