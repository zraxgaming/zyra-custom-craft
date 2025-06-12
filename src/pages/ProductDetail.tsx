
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/components/cart/CartProvider';
import { useWishlist } from '@/hooks/use-wishlist';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Heart, Star, ArrowLeft, Loader2, Palette, Type, Plus, Minus } from 'lucide-react';
import SEOHead from '@/components/seo/SEOHead';
import ProductReviews from '@/components/reviews/ProductReviews';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showCustomization, setShowCustomization] = useState(false);
  const [customization, setCustomization] = useState({
    text: '',
    position: 'center',
    fontSize: '16',
    color: '#000000'
  });

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`id.eq.${id},slug.eq.${id}`)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return;
      }

      if (data) {
        const transformedProduct: Product = {
          ...data,
          images: Array.isArray(data.images) 
            ? (data.images as string[]).filter(img => typeof img === 'string')
            : []
        };
        setProduct(transformedProduct);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image_url: product.images?.[0],
      slug: product.slug,
      customization: showCustomization ? customization : undefined
    };
    
    addToCart(cartItem);
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist`,
      });
    } else {
      addToWishlist(product.id);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Container className="py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading product details...</p>
            </div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Container className="py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/shop">Browse Products</Link>
            </Button>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  const discountedPrice = product.discount_percentage 
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={`${product.name} - Zyra Custom Craft`}
        description={product.description || `${product.name} - Premium customizable product`}
        keywords={`${product.name}, custom, personalized, ${product.category || 'products'}`}
      />
      <Navbar />
      
      <Container className="py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/shop">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Palette className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
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
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.featured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
                {product.is_customizable && (
                  <Badge variant="outline">Customizable</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.review_count || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                {product.discount_percentage ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <Badge className="bg-red-100 text-red-700">
                      {product.discount_percentage}% OFF
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity & Customization */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label className="text-base font-medium">Quantity:</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {product.is_customizable && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="customize"
                      checked={showCustomization}
                      onChange={(e) => setShowCustomization(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="customize" className="text-base font-medium">
                      Add Custom Text
                    </Label>
                  </div>

                  {showCustomization && (
                    <Card className="p-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="custom-text">Custom Text</Label>
                        <Input
                          id="custom-text"
                          placeholder="Enter your custom text"
                          value={customization.text}
                          onChange={(e) => setCustomization(prev => ({ ...prev, text: e.target.value }))}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Position</Label>
                          <Select
                            value={customization.position}
                            onValueChange={(value) => setCustomization(prev => ({ ...prev, position: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="top">Top</SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="bottom">Bottom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Font Size</Label>
                          <Select
                            value={customization.fontSize}
                            onValueChange={(value) => setCustomization(prev => ({ ...prev, fontSize: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="12">Small</SelectItem>
                              <SelectItem value="16">Medium</SelectItem>
                              <SelectItem value="20">Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="text-color">Text Color</Label>
                        <input
                          type="color"
                          id="text-color"
                          value={customization.color}
                          onChange={(e) => setCustomization(prev => ({ ...prev, color: e.target.value }))}
                          className="w-full h-10 rounded border"
                        />
                      </div>

                      {customization.text && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                          <div 
                            className="text-center"
                            style={{ 
                              color: customization.color,
                              fontSize: `${customization.fontSize}px`,
                              fontWeight: 'bold'
                            }}
                          >
                            {customization.text}
                          </div>
                        </div>
                      )}
                    </Card>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="flex-1 h-12 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleWishlistToggle}
                className="h-12 px-6"
              >
                <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current text-red-500' : ''}`} />
              </Button>
            </div>

            {/* Product Details */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU:</span>
                  <span>{product.sku || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{product.category || 'Uncategorized'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stock:</span>
                  <span className={product.in_stock ? 'text-green-600' : 'text-red-600'}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ProductReviews productId={product.id} />
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default ProductDetail;
