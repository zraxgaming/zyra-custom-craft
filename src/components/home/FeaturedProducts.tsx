
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { ShoppingCart, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  featured: boolean;
  images?: string[];
}

const FeaturedProducts = ({ products, isLoading }: { products?: Product[]; isLoading?: boolean }) => {
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (products) {
      setLocalProducts(products);
      setLocalLoading(isLoading || false);
    } else {
      fetchFeaturedProducts();
    }
  }, [products, isLoading]);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(6);

      if (error) throw error;
      
      const transformedProducts = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        image_url: Array.isArray(product.images) && product.images.length > 0 
          ? String(product.images[0])
          : '/placeholder.svg',
        category: product.category || '',
        featured: product.featured || false,
        images: Array.isArray(product.images) ? product.images.map(String) : []
      }));
      
      setLocalProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (localLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our most popular custom products, crafted with premium materials and attention to detail
          </p>
        </div>

        {localProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              No featured products available at the moment.
            </p>
            <Button asChild>
              <Link to="/shop">
                Browse All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {localProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                      Featured
                    </Badge>
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/95 dark:bg-gray-800/95 px-3 py-1 rounded-full shadow-lg">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <Badge variant="outline" className="mb-3 border-blue-200 text-blue-600">
                        {product.category}
                      </Badge>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" variant="outline" className="border-2 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/50">
                <Link to="/shop">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </Container>
    </section>
  );
};

export default FeaturedProducts;
