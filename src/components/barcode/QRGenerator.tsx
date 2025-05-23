
import React from "react";

interface QRGeneratorProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
}

const QRGenerator: React.FC<QRGeneratorProps> = ({
  value,
  size = 200,
  level = "M",
}) => {
  // Simple QR code placeholder - in production use qrcode library
  const generateQRPattern = (text: string, gridSize: number = 21) => {
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
    
    // Simple pattern based on text (not a real QR algorithm)
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const index = (i * gridSize + j) % text.length;
        grid[i][j] = (text.charCodeAt(index) + i + j) % 2 === 0;
      }
    }
    
    return grid;
  };

  const pattern = generateQRPattern(value);
  const cellSize = size / pattern.length;

  return (
    <div className="flex flex-col items-center space-y-2">
      <div 
        className="border border-gray-300"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size}>
          {pattern.map((row, i) =>
            row.map((cell, j) => (
              <rect
                key={`${i}-${j}`}
                x={j * cellSize}
                y={i * cellSize}
                width={cellSize}
                height={cellSize}
                fill={cell ? "#000" : "#fff"}
              />
            ))
          )}
        </svg>
      </div>
      <span className="text-xs text-center break-all max-w-[200px]">{value}</span>
    </div>
  );
};

export default QRGenerator;
