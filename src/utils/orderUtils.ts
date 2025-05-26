
export const generateOrderId = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp.slice(-8)}-${random}`;
};

export const generateTrackingNumber = () => {
  const prefix = 'TRK';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}`;
};

export const generateSKU = (productName: string) => {
  const prefix = productName.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${timestamp}`;
};

export const generateBarcode = () => {
  // Generate a 13-digit EAN barcode
  const randomDigits = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
  // Simple checksum calculation for EAN-13
  let checksum = 0;
  for (let i = 0; i < 12; i++) {
    checksum += parseInt(randomDigits[i]) * (i % 2 === 0 ? 1 : 3);
  }
  checksum = (10 - (checksum % 10)) % 10;
  return randomDigits + checksum.toString();
};

export const generateOrderBarcode = (orderId: string) => {
  // Generate barcode based on order ID
  const numericId = orderId.replace(/\D/g, '').slice(-12).padStart(12, '0');
  let checksum = 0;
  for (let i = 0; i < 12; i++) {
    checksum += parseInt(numericId[i]) * (i % 2 === 0 ? 1 : 3);
  }
  checksum = (10 - (checksum % 10)) % 10;
  return numericId + checksum.toString();
};
