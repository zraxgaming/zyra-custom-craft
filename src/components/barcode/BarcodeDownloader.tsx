
import React from 'react';

interface Props {
  data: string;
  type: string;
  filename?: string;
}
const BarcodeDownloader: React.FC<Props> = ({ data, type, filename }) => {
  const handleDownload = async () => {
    // Dynamically import bwip-js to generate barcode image
    const { toCanvas } = await import('bwip-js');
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
