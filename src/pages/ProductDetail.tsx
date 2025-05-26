
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Star, Heart, ShoppingCart, Truck, Shield, ArrowLeft, Plus, Minus } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState({
    text: '',
    color: '#000000'
  });

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      const transformedProduct: Product = {
        ...data,
        images: Array.isArray(data.images) 
          ? data.images.filter(img => typeof img === 'string') as string[]
          : [],
        is_featured: data.is_featured || false,
        is_customizable: data.is_customizable || false,
        stock_quantity: data.stock_quantity || 0
      };

      setProduct(transformedProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder-product.jpg',
      quantity,
      customization: product.is_customizable ? customization : undefined
    };

    addItem(cartItem);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12">
          <Container>
            <div className="flex items-center justify-center min-h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12">
          <Container>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Product not found</h2>
              <Button onClick={() => navigate('/shop')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shop
              </Button>
            </div>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12 particle-field-bg">
        <Container>
          <div className="max-w-7xl mx-auto">
            <Button 
              variant="outline" 
              onClick={() => navigate('/shop')}
              className="mb-6 animate-slide-in-left hover-3d-lift"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4 animate-slide-in-left">
                <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-2xl hover-3d-lift border-gradient">
                  <img
                    src={product.images[selectedImage] || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square bg-white rounded-lg overflow-hidden transition-all duration-300 hover-3d-lift animate-scale-in ${
                          selectedImage === index ? 'ring-2 ring-primary shadow-lg' : 'hover:ring-1 hover:ring-primary/50'
                        }`}
                        style={{animationDelay: `${index * 0.1}s`}}
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

              {/* Product Info */}
              <div className="space-y-8 animate-slide-in-right">
                <div className="space-y-4">
                  {product.category && (
                    <Badge variant="secondary" className="animate-bounce-in">
                      {product.category}
                    </Badge>
                  )}
                  
                  <h1 className="text-4xl font-bold leading-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent animate-text-shimmer">
                    {product.name}
                  </h1>
                  
                  <div className="flex items-center gap-4 animate-slide-in-up">
                    <div className="text-3xl font-bold text-primary animate-bounce-in">
                      ${product.price.toFixed(2)}
                    </div>
                    {product.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              } animate-scale-in`}
                              style={{animationDelay: `${i * 0.1}s`}}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({product.review_count || 0} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {product.description && (
                  <div className="animate-fade-in">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                <Separator className="animate-scale-in" />

                {/* Customization Options */}
                {product.is_customizable && (
                  <Card className="animate-scale-in border-gradient">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-lg">Customize Your Product</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="custom-text">Custom Text</Label>
                          <Input
                            id="custom-text"
                            placeholder="Enter your custom text..."
                            value={customization.text}
                            onChange={(e) => setCustomization(prev => ({ ...prev, text: e.target.value }))}
                            className="mt-1 hover-magnetic"
                            maxLength={50}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="custom-color">Text Color</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="color"
                              id="custom-color"
                              value={customization.color}
                              onChange={(e) => setCustomization(prev => ({ ...prev, color: e.target.value }))}
                              className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer hover-3d-lift"
                            />
                            <span className="text-sm text-muted-foreground">
                              Selected: {customization.color}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quantity and Add to Cart */}
                <div className="space-y-6 animate-slide-in-up">
                  <div className="flex items-center gap-4">
                    <Label className="font-semibold">Quantity:</Label>
                    <div className="flex items-center border rounded-lg hover-magnetic">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="hover-3d-lift"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        className="hover-3d-lift"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {product.stock_quantity && (
                      <span className="text-sm text-muted-foreground">
                        ({product.stock_quantity} in stock)
                      </span>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 btn-premium hover-ripple animate-elastic-scale"
                      size="lg"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="hover-3d-lift"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover-3d-lift">
                    <Truck className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Free Shipping</p>
                      <p className="text-sm text-green-600">On orders over $50</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover-3d-lift">
                    <Shield className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">Secure Payment</p>
                      <p className="text-sm text-blue-600">SSL encrypted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
