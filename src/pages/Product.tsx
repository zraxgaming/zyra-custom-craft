
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Product as ProductType } from "@/types/product";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SEOHead from "@/components/seo/SEOHead";
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  RefreshCw,
  Palette,
  Type,
  Upload,
  Plus,
  Minus
} from "lucide-react";

const Product = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState({
    text: '',
    color: '',
    image: null as File | null
  });

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      
      // Transform the product data to match our Product interface
      const transformedProduct: ProductType = {
        ...data,
        images: Array.isArray(data.images) 
          ? data.images.filter((img: any) => typeof img === 'string') as string[]
          : [],
        is_featured: data.is_featured || false,
        is_customizable: data.is_customizable || false,
        is_digital: data.is_digital || false,
        stock_quantity: data.stock_quantity || 0
      };

      return transformedProduct;
    },
    retry: false
  });

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        customization: product.is_customizable ? customization : undefined,
        image: product.images[0] || '/placeholder-product.jpg'
      });

      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;

    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Container className="py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg animate-pulse"></div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-20 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded animate-pulse"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
              <div className="h-6 bg-muted rounded animate-pulse w-1/2"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Container className="py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/shop')}>Browse Products</Button>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={`${product.name} - Zyra Custom Craft`}
        description={product.short_description || product.description?.substring(0, 160) || `Shop ${product.name} at Zyra Custom Craft`}
        url={`https://shopzyra.vercel.app/product/${product.slug}`}
        image={product.images[0]}
      />
      
      <Navbar />
      
      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
          {/* Product Images */}
          <div className="space-y-4 animate-slide-in-left">
            <div className="aspect-square bg-muted rounded-xl overflow-hidden group">
              <img
                src={product.images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    } hover:border-primary/50`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6 animate-slide-in-right">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-bold text-primary">${product.price}</div>
                {product.is_featured && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Featured
                  </Badge>
                )}
                {product.is_new && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    New
                  </Badge>
                )}
              </div>
              
              {product.rating && product.review_count && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.review_count} reviews)
                  </span>
                </div>
              )}
            </div>

            {product.short_description && (
              <p className="text-lg text-muted-foreground">{product.short_description}</p>
            )}

            {/* Customization Options */}
            {product.is_customizable && (
              <Card className="animate-scale-in">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Customize Your Product
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="custom-text" className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Custom Text
                      </Label>
                      <Input
                        id="custom-text"
                        value={customization.text}
                        onChange={(e) => setCustomization(prev => ({ ...prev, text: e.target.value }))}
                        placeholder="Enter your custom text"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="custom-color">Color</Label>
                      <Input
                        id="custom-color"
                        type="color"
                        value={customization.color}
                        onChange={(e) => setCustomization(prev => ({ ...prev, color: e.target.value }))}
                        className="mt-1 h-12"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="custom-image" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Custom Image
                      </Label>
                      <Input
                        id="custom-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCustomization(prev => ({ 
                          ...prev, 
                          image: e.target.files ? e.target.files[0] : null 
                        }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <Label htmlFor="quantity">Quantity:</Label>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className={`h-12 px-6 ${
                    isInWishlist(product.id) 
                      ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                      : 'hover:bg-gray-50'
                  } transform hover:scale-105 transition-all duration-300`}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold text-sm">Free Shipping</div>
                  <div className="text-xs text-muted-foreground">On orders over $50</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold text-sm">Secure Payment</div>
                  <div className="text-xs text-muted-foreground">100% protected</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <RefreshCw className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold text-sm">Easy Returns</div>
                  <div className="text-xs text-muted-foreground">30-day policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <>
            <Separator className="my-12" />
            <div className="max-w-4xl animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Product Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            </div>
          </>
        )}
      </Container>
      
      <Footer />
    </div>
  );
};

export default Product;
