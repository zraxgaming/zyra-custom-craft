import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, CheckCircle, PackageCheck, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductReviews from "@/components/reviews/ProductReviews";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  description?: string;
  rating?: number;
  review_count?: number;
  is_featured?: boolean;
  is_customizable?: boolean;
  stock_quantity?: number;
  in_stock?: boolean;
}

const Product = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;

        // Transform the data to match our Product interface
        const transformedProduct: Product = {
          id: data.id,
          name: data.name,
          slug: data.slug,
          price: data.price,
          images: Array.isArray(data.images)
            ? data.images.filter(img => typeof img === 'string') as string[]
            : [],
          description: data.description || '',
          rating: data.rating || 0,
          review_count: data.review_count || 0,
          is_featured: data.is_featured || false,
          is_customizable: data.is_customizable || false,
          stock_quantity: data.stock_quantity || 0,
          in_stock: data.in_stock || false,
        };

        setProduct(transformedProduct);
      } catch (error: any) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive",
        });
        setProduct(null); // Ensure product is null in case of error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug, toast]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-8">
        {/* Navigation buttons */}
        <div className="flex items-center gap-3 mb-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button variant="secondary" onClick={() => navigate("/home")}>
            <Home className="h-4 w-4 mr-1" /> Home
          </Button>
          <Button variant="secondary" onClick={() => navigate("/shop")}>
            Shop
          </Button>
        </div>
        {product ? (
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
                    No Image
                  </div>
                )}
              </div>
              <div>
                <div className="mb-4">
                  <p className="text-xl font-semibold">${product.price.toFixed(2)}</p>
                  {product.is_featured && (
                    <Badge className="ml-2 bg-green-500 text-white">Featured</Badge>
                  )}
                </div>
                <div className="mb-4">
                  {product.rating && (
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                        />
                      ))}
                      <span className="ml-2 text-gray-500">({product.review_count} reviews)</span>
                    </div>
                  )}
                </div>
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    images: product.images,
                    is_customizable: product.is_customizable,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>Product not found</div>
        )}
        <div className="mt-8">
          <ProductReviews productId={product?.id || ""} />
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Product;
