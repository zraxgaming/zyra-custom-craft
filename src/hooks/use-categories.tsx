
import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  icon?: string;
}

export const useCategories = () => {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for initial load
    const mockCategories: Category[] = [
      {
        id: '1',
        name: 'Clothing',
        slug: 'clothing',
        description: 'Custom apparel and clothing items',
        image_url: '/placeholder.svg',
        icon: 'Shirt'
      },
      {
        id: '2',
        name: 'Home',
        slug: 'home',
        description: 'Custom home decor and accessories',
        image_url: '/placeholder.svg',
        icon: 'Home'
      },
      {
        id: '3',
        name: 'Gifts',
        slug: 'gifts',
        description: 'Personalized gift items',
        image_url: '/placeholder.svg',
        icon: 'Gift'
      }
    ];

    setTimeout(() => {
      setData(mockCategories);
      setIsLoading(false);
    }, 300);
  }, []);

  return { data, isLoading };
};
