import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// REMOVE import bwip-js or comment it out as it cannot be resolved
// import bwipjs from 'bwip-js'; // COMMENTED OUT, not available in environment

interface BarcodeDownloaderProps {
  value: string;
  filename?: string;
}

const BarcodeDownloader: React.FC<BarcodeDownloaderProps> = ({ value, filename = 'barcode' }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const downloadBarcode = () => {
    if (!svgRef.current) {
      console.error("SVG element not found.");
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `${filename}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div>
      <svg ref={svgRef} id="barcode" width="300" height="150" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="50%" textAnchor="middle" fontSize="24">{value}</text>
      </svg>
      <Button onClick={downloadBarcode}>
        <Download className="h-4 w-4 mr-2" />
        Download Barcode
      </Button>
    </div>
  );
};

export default BarcodeDownloader;
