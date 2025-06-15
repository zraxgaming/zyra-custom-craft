import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, ArrowLeft, Heart, Share2, ShoppingCart, Zap, Award, Truck } from "lucide-react";
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
          .maybeSingle();

        console.log("ProductDetails fetch result:", { data, error });

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
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent shadow-xl"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-primary opacity-20"></div>
            <div className="absolute inset-2 animate-pulse rounded-full h-12 w-12 bg-primary/10"></div>
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
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="text-8xl mb-6 animate-bounce">😔</div>
            <h1 className="text-3xl font-bold mb-6 animate-slide-in-up">Product not found</h1>
            <p className="text-muted-foreground mb-8 animate-slide-in-up" style={{animationDelay: '0.1s'}}>
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/shop">
              <Button className="animate-scale-in hover:animate-pulse hover:scale-110 transition-all duration-300" style={{animationDelay: '0.2s'}}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shop
              </Button>
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
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-8">
        <div className="container mx-auto px-4">
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground mb-8 transition-all duration-500 hover:scale-110 hover:translate-x-2 animate-slide-in-left group"
          >
            <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="relative font-medium">
              Back to Shop
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-primary to-purple-500 scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Enhanced Product Images */}
            <div className="space-y-6 animate-fade-in">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-muted/20 to-muted/40 hover:shadow-2xl transition-all duration-700 hover:scale-[1.02] group">
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
                
                {/* Product badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.is_new && (
                    <Badge className="bg-green-500 text-white animate-bounce hover:animate-pulse">NEW</Badge>
                  )}
                  {product.featured && (
                    <Badge className="bg-yellow-500 text-black animate-pulse hover:animate-bounce">FEATURED</Badge>
                  )}
                  {product.discount_percentage > 0 && (
                    <Badge className="bg-red-500 text-white animate-wiggle hover:animate-spin">
                      -{product.discount_percentage}%
                    </Badge>
                  )}
                </div>
              </div>
              
              {Array.isArray(product?.images) && product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto animate-slide-in-up">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-3 transition-all duration-500 hover:scale-110 hover:rotate-3 ${
                        selectedImage === index 
                          ? 'border-primary shadow-xl animate-pulse-glow ring-4 ring-primary/20 scale-105' 
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

            {/* Enhanced Product Info */}
            <div className="space-y-8 animate-slide-in-right">
              <div className="space-y-6">
                <div>
                  <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text animate-fade-in leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-xl text-muted-foreground animate-slide-in-up leading-relaxed">
                    {product.short_description || product.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-8 animate-scale-in">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 transition-all duration-300 hover:scale-125 ${
                          star <= (product.rating || 5)
                            ? "fill-yellow-400 text-yellow-400 animate-pulse"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-base text-muted-foreground ml-3 animate-fade-in">
                      ({product.review_count || 0} reviews)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary animate-pulse" />
                    <span className="text-sm font-medium">Premium Quality</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="flex items-center gap-4">
                    <p className="text-5xl font-bold text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text animate-gradient-shift bg-300%">
                      ${product.price.toFixed(2)}
                    </p>
                    {product.discount_percentage > 0 && (
                      <p className="text-2xl text-muted-foreground line-through animate-fade-in">
                        ${((product.price * 100) / (100 - product.discount_percentage)).toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {!product.in_stock && (
                  <Badge variant="destructive" className="mb-4 animate-wiggle text-lg py-2 px-4">
                    Out of Stock
                  </Badge>
                )}
              </div>

              <Separator className="animate-fade-in" />

              {/* Enhanced Description */}
              <div className="animate-slide-in-up">
                <h3 className="font-semibold mb-4 text-xl flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary animate-pulse" />
                  Product Details
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">{product.description}</p>
              </div>

              {/* Enhanced Features */}
              <div className="grid grid-cols-2 gap-4 animate-bounce-in">
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all duration-300 hover:scale-105">
                  <Truck className="h-6 w-6 text-primary animate-pulse" />
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-muted-foreground">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all duration-300 hover:scale-105">
                  <Award className="h-6 w-6 text-purple-500 animate-pulse" />
                  <div>
                    <p className="font-medium">Quality Guarantee</p>
                    <p className="text-sm text-muted-foreground">30-day return policy</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex gap-4 animate-bounce-in">
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
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-purple-500 hover:from-primary/80 hover:to-purple-500/80 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  />
                </div>
                <WishlistButton 
                  productId={product.id} 
                  className="h-14 w-14 hover:scale-110 hover:rotate-12 transition-all duration-300"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-14 w-14 hover:rotate-12 hover:scale-110 transition-all duration-300 hover:shadow-lg"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {product.is_customizable && (
                <Card className="animate-scale-in hover:shadow-xl transition-all duration-500 border-dashed border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                      <span className="animate-pulse text-2xl">✨</span>
                      Customization Available
                      <Zap className="h-5 w-5 text-primary animate-bounce" />
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Make this product uniquely yours with our customization options.
                    </p>
                    <ProductCustomizer productId={product.id}>
                      <Button 
                        variant="outline" 
                        className="w-full hover:scale-105 transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/50 h-12 text-lg font-medium"
                      >
                        <Zap className="h-5 w-5 mr-2 animate-pulse" />
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
