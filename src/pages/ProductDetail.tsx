
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Heart, Share2, ShoppingCart, Palette, Type } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Product } from "@/types/product";
import { CartItem } from "@/types/cart";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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
        .eq('status', 'published')
        .single();

      if (error) throw error;

      const transformedProduct: Product = {
        ...data,
        images: Array.isArray(data.images) 
          ? data.images.filter(img => typeof img === 'string') as string[]
          : []
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

    const cartItem: Omit<CartItem, "id"> = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder-product.jpg',
      quantity: quantity,
      customization: product.is_customizable ? customization : undefined
    };

    addItem(cartItem);
    toast({
      title: "Added to Cart",
      description: `${quantity} ${product.name} added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4 animate-slide-in-left">
              <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 hover-3d-lift">
                <img
                  src={product.images[selectedImageIndex] || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 transition-all hover-magnetic ${
                        selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                      }`}
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
            <div className="space-y-6 animate-slide-in-right">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < (product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      ({product.review_count || 0} reviews)
                    </span>
                  </div>
                  {product.is_new && <Badge className="bg-green-100 text-green-800">New</Badge>}
                  {product.is_customizable && <Badge className="bg-blue-100 text-blue-800">Customizable</Badge>}
                </div>
                <p className="text-3xl font-bold text-primary mb-4">${product.price.toFixed(2)}</p>
                <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
              </div>

              {/* Customization Options */}
              {product.is_customizable && (
                <Card className="border-2 border-dashed border-primary/30 animate-scale-in">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Palette className="h-5 w-5 text-primary" />
                      Customize Your Product
                    </h3>
                    <div className="space-y-6">
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
                          className="mt-2 form-field"
                          maxLength={50}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {customization.text.length}/50 characters
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="custom-color" className="flex items-center gap-2">
                          <Palette className="h-4 w-4" />
                          Text Color
                        </Label>
                        <div className="flex items-center gap-4 mt-2">
                          <input
                            id="custom-color"
                            type="color"
                            value={customization.color}
                            onChange={(e) => setCustomization(prev => ({ ...prev, color: e.target.value }))}
                            className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer hover-magnetic"
                          />
                          <div className="flex-1">
                            <Input
                              value={customization.color}
                              onChange={(e) => setCustomization(prev => ({ ...prev, color: e.target.value }))}
                              placeholder="#000000"
                              className="form-field"
                            />
                          </div>
                        </div>
                      </div>

                      {customization.text && (
                        <div className="p-4 bg-muted rounded-lg animate-fade-in">
                          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                          <p 
                            style={{ color: customization.color }}
                            className="text-lg font-medium"
                          >
                            {customization.text}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      variant="outline"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 hover-magnetic"
                    >
                      -
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center form-field"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 hover-magnetic"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 btn-premium h-14 text-lg hover-ripple"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </Button>
                  <Button variant="outline" size="lg" className="h-14 hover-magnetic">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg" className="h-14 hover-magnetic">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Product Details */}
              <Card className="animate-fade-in">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SKU:</span>
                      <span>{product.sku || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{product.category || 'General'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stock:</span>
                      <span className={product.in_stock ? 'text-green-600' : 'text-red-600'}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
