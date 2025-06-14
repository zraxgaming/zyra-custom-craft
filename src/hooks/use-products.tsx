
import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  rating?: number;
  review_count?: number;
  is_new?: boolean;
  discount_percentage?: number;
  in_stock: boolean;
  slug: string;
  description?: string;
  category?: string;
  featured?: boolean;
  is_customizable?: boolean;
  created_at?: string;
}

export const useProducts = () => {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for initial load
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Custom T-Shirt',
        price: 29.99,
        images: ['/placeholder.svg'],
        rating: 4.5,
        review_count: 12,
        is_new: true,
        discount_percentage: 0,
        in_stock: true,
        slug: 'custom-t-shirt',
        description: 'High-quality custom t-shirt with personalization options',
        category: 'Clothing',
        featured: true,
        is_customizable: true,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Personalized Mug',
        price: 19.99,
        images: ['/placeholder.svg'],
        rating: 4.8,
        review_count: 25,
        is_new: false,
        discount_percentage: 10,
        in_stock: true,
        slug: 'personalized-mug',
        description: 'Custom ceramic mug perfect for gifts',
        category: 'Home',
        featured: true,
        is_customizable: true,
        created_at: new Date().toISOString()
      }
    ];

    setTimeout(() => {
      setData(mockProducts);
      setIsLoading(false);
    }, 500);
  }, []);

  return { data, isLoading };
};
