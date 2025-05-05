
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  featured: boolean;
  isNew: boolean;
  inStock: boolean;
  customizationOptions: {
    allowText: boolean;
    allowImage: boolean;
    maxTextLength: number;
    maxImageCount: number;
    allowResizeRotate: boolean;
  };
}

export interface CartItem {
  productId: number;
  quantity: number;
  customization: {
    text?: string;
    image?: string;
    position?: {
      x: number;
      y: number;
    };
    scale?: number;
    rotation?: number;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
}
