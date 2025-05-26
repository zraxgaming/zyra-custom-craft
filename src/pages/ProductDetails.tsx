
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

const ProductDetails = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

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
          images: Array.isArray(data.images) 
            ? data.images.filter(img => typeof img === 'string') as string[]
            : []
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
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent shadow-lg"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-primary opacity-20"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce">😔</div>
            <h1 className="text-2xl font-bold mb-4 animate-slide-in-up">Product not found</h1>
            <Link to="/shop">
              <Button className="animate-scale-in hover:animate-pulse">Back to Shop</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const imageUrl = Array.isArray(product?.images) && product.images.length > 0 
    ? product.images[selectedImage] 
    : '/placeholder-product.jpg';

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-all duration-500 hover:scale-110 hover:translate-x-2 animate-slide-in-left">
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="relative">
              Back to Shop
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 transition-transform duration-300 hover:scale-x-100"></span>
            </span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4 animate-fade-in">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-muted/20 to-muted/40 hover:shadow-2xl transition-all duration-700 hover:scale-[1.02] group">
                <img
                  src={imageUrl}
                  alt={product?.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-product.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              {Array.isArray(product?.images) && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto animate-slide-in-up">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-500 hover:scale-110 hover:rotate-3 ${
                        selectedImage === index 
                          ? 'border-primary shadow-xl animate-pulse-glow ring-4 ring-primary/20' 
                          : 'border-transparent hover:border-primary/50 hover:shadow-lg'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-125"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6 animate-slide-in-right">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text animate-fade-in">{product.name}</h1>
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2 animate-scale-in">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 transition-all duration-300 hover:scale-125 ${
                          star <= (product.rating || 5)
                            ? "fill-yellow-400 text-yellow-400 animate-pulse"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2 animate-fade-in">
                      ({product.review_count || 0} reviews)
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text animate-gradient-flow mb-4">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                {!product.in_stock && (
                  <Badge variant="destructive" className="mb-4 animate-wiggle">
                    Out of Stock
                  </Badge>
                )}
              </div>

              <Separator className="animate-fade-in" />

              <div className="animate-slide-in-up">
                <h3 className="font-semibold mb-3 text-lg">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              <div className="flex gap-3 animate-bounce-in">
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
                  />
                </div>
                <WishlistButton productId={product.id} />
                <Button variant="outline" size="icon" className="hover:rotate-12 transition-transform duration-300">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {product.is_customizable && (
                <Card className="animate-scale-in hover:shadow-xl transition-all duration-500 border-dashed border-primary/30">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="animate-pulse">✨</span>
                      Customization Options
                    </h3>
                    <ProductCustomizer productId={product.id}>
                      <Button variant="outline" className="w-full hover:scale-105 transition-transform duration-300">
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

export default ProductDetails;
