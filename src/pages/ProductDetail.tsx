
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, ArrowLeft, Heart, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AddToCartButton from "@/components/cart/AddToCartButton";
import WishlistButton from "@/components/products/WishlistButton";
import ProductCustomizer from "@/components/products/ProductCustomizer";
import { Product } from "@/types/product";

const ProductDetail = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        
        // Transform the data to match our Product interface
        const transformedProduct: Product = {
          ...data,
          images: Array.isArray(data.images) ? data.images : []
        };
        
        setProduct(transformedProduct);
      } catch (error: any) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, toast]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Link to="/shop">
              <Button className="hover:scale-105 transition-all duration-300">Back to Shop</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-8 animate-fade-in">
        <div className="container mx-auto px-4">
          <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 hover:scale-105 transition-all duration-300">
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted animate-scale-in hover:scale-105 transition-all duration-500">
              <img
                src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.jpg';
                }}
              />
            </div>

            <div className="space-y-6 animate-slide-in-right">
              <div>
                <h1 className="text-3xl font-bold mb-2 animate-bounce-in">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 transition-all duration-300 hover:scale-125 ${
                          star <= (product.rating || 0)
                            ? "fill-yellow-400 text-yellow-400 animate-pulse"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      ({product.review_count || 0} reviews)
                    </span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-primary mb-4 animate-pulse-glow">
                  ${product.price.toFixed(2)}
                </p>
                {!product.in_stock && (
                  <Badge variant="destructive" className="mb-4 animate-wiggle">
                    Out of Stock
                  </Badge>
                )}
              </div>

              <Separator className="animate-gradient-flow bg-gradient-to-r from-primary to-purple-600" />

              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              <div className="flex gap-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="flex-1">
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      price: product.price,
                      images: product.images
                    }}
                    disabled={!product.in_stock}
                    className="hover:scale-105 transition-all duration-300"
                  />
                </div>
                <WishlistButton productId={product.id} />
                <Button variant="outline" size="icon" className="hover:scale-110 hover:rotate-12 transition-all duration-300">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {product.is_customizable && (
                <Card className="animate-slide-in-up hover:shadow-xl transition-all duration-500">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Customization Options</h3>
                    <ProductCustomizer productId={product.id}>
                      <Button variant="outline" className="w-full hover:scale-105 transition-all duration-300">
                        Customize This Product
                      </Button>
                    </ProductCustomizer>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
