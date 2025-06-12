
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
import { ShoppingCart, Heart, Star, ArrowLeft, Loader2, Palette, Type } from 'lucide-react';
import SEOHead from '@/components/seo/SEOHead';
import ProductReviews from '@/components/reviews/ProductReviews';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
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
      
      // 1 second fake loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
    
    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.images?.[0],
      slug: product.slug
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
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
        description={product.short_description || product.description || `Custom ${product.name} available at Zyra Custom Craft`}
      />
      <Navbar />
      
      <Container className="py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/shop">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img
                src={product.images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
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

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  {product.discount_percentage && product.discount_percentage > 0 && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                
                {product.discount_percentage && product.discount_percentage > 0 && (
                  <Badge className="bg-red-500 text-white">
                    -{product.discount_percentage}% OFF
                  </Badge>
                )}
              </div>

              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating!) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.review_count || 0} reviews)
                  </span>
                </div>
              )}

              <div className="flex gap-2 mb-4">
                {product.is_new && (
                  <Badge className="bg-green-500 text-white">New</Badge>
                )}
                {product.featured && (
                  <Badge className="bg-yellow-500 text-white">Featured</Badge>
                )}
                <Badge variant={product.in_stock ? 'default' : 'destructive'}>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>

              {product.short_description && (
                <p className="text-lg text-muted-foreground mb-4">
                  {product.short_description}
                </p>
              )}

              {product.description && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Customization Section */}
            {product.is_customizable && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Customize This Product
                    </h3>
                    <Button
                      variant="outline"
                      onClick={() => setShowCustomization(!showCustomization)}
                    >
                      {showCustomization ? 'Hide' : 'Show'} Options
                    </Button>
                  </div>
                  
                  {showCustomization && (
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="custom-text">Custom Text</Label>
                        <Textarea
                          id="custom-text"
                          placeholder="Enter your custom text..."
                          value={customization.text}
                          onChange={(e) => setCustomization(prev => ({ ...prev, text: e.target.value }))}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="text-position">Text Position</Label>
                          <select
                            id="text-position"
                            className="w-full p-2 border rounded"
                            value={customization.position}
                            onChange={(e) => setCustomization(prev => ({ ...prev, position: e.target.value }))}
                          >
                            <option value="center">Center</option>
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="font-size">Font Size</Label>
                          <Input
                            id="font-size"
                            type="number"
                            min="8"
                            max="72"
                            value={customization.fontSize}
                            onChange={(e) => setCustomization(prev => ({ ...prev, fontSize: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="text-color">Text Color</Label>
                        <Input
                          id="text-color"
                          type="color"
                          value={customization.color}
                          onChange={(e) => setCustomization(prev => ({ ...prev, color: e.target.value }))}
                        />
                      </div>
                      
                      {customization.text && (
                        <div className="p-4 border rounded-lg bg-muted/50">
                          <p className="text-sm font-medium mb-2">Preview:</p>
                          <div className="relative bg-white border rounded p-8 text-center">
                            <span 
                              style={{ 
                                fontSize: `${customization.fontSize}px`,
                                color: customization.color,
                                position: 'relative'
                              }}
                            >
                              {customization.text}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleWishlistToggle}
                size="lg"
              >
                <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>

            {product.is_customizable && !showCustomization && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Type className="h-4 w-4" />
                    <span>This product can be customized with your personal text and design.</span>
                  </div>
                </CardContent>
              </Card>
            )}
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
