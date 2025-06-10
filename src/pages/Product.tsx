
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/components/cart/CartProvider';
import { useWishlist } from '@/hooks/use-wishlist';
import { Heart, ShoppingCart, Star, ArrowLeft, Share2, Package, Truck, Shield, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui/container';
import SEOHead from '@/components/seo/SEOHead';

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    await addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image_url: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : undefined
    });
  };

  const handleWishlistToggle = async () => {
    if (!product) return;

    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Container>
          <div className="py-12">
            <div className="animate-pulse">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="aspect-square bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
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
        <Container>
          <div className="py-12 text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Link to="/shop">
              <Button>Back to Shop</Button>
            </Link>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-blue-950/30">
      <SEOHead 
        title={`${product.name} - Zyra Custom Craft`}
        description={product.description || `Shop ${product.name} at Zyra Custom Craft. Premium custom products with personalization options.`}
        ogImage={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : undefined}
      />
      <Navbar />
      
      <Container>
        <div className="py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 animate-fade-in">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            {product.categories && (
              <>
                <span>/</span>
                <Link to={`/category/${product.categories.slug}`} className="hover:text-primary transition-colors">
                  {product.categories.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4 animate-slide-in-left">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-2xl">
                {Array.isArray(product.images) && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900 to-pink-900 flex items-center justify-center">
                    <Package className="h-24 w-24 text-purple-600 dark:text-purple-300" />
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {Array.isArray(product.images) && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-110 ${
                        selectedImage === index
                          ? 'border-purple-500 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700'
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
                <div className="flex items-center gap-2 mb-2">
                  <Link to="/shop" className="text-purple-600 hover:text-purple-700 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                  {product.categories && (
                    <Badge variant="secondary" className="animate-fade-in">
                      {product.categories.name}
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {product.name}
                </h1>

                {product.rating && product.rating > 0 && (
                  <div className="flex items-center gap-2 mb-4 animate-fade-in">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating.toFixed(1)} ({product.review_count || 0} reviews)
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl font-bold text-purple-600 animate-pulse">
                    ${product.price}
                  </div>
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <div className="text-xl text-muted-foreground line-through">
                      ${product.compare_at_price}
                    </div>
                  )}
                </div>

                {product.description && (
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className="space-y-3">
                {product.stock_quantity > 0 ? (
                  <div className="flex items-center gap-2 text-green-600 animate-fade-in">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">
                      {product.stock_quantity > 10 
                        ? 'In Stock' 
                        : `Only ${product.stock_quantity} left in stock`
                      }
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 animate-fade-in">
                    <Package className="h-5 w-5" />
                    <span className="font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-xl p-1 bg-background">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10"
                    >
                      -
                    </Button>
                    <span className="font-semibold px-4 min-w-[3rem] text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-10 w-10"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity <= 0}
                    className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWishlistToggle}
                    className={`h-14 w-14 rounded-2xl border-2 transition-all duration-300 hover:scale-110 ${
                      isInWishlist(product.id)
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Heart 
                      className={`h-6 w-6 ${
                        isInWishlist(product.id) ? 'fill-current' : ''
                      }`} 
                    />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-2xl border-2 hover:scale-110 transition-all duration-300"
                  >
                    <Share2 className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-fade-in">
                  <Truck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">UAE wide</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Secure Payment</p>
                    <p className="text-xs text-muted-foreground">Ziina protected</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">Quality Guaranteed</p>
                    <p className="text-xs text-muted-foreground">Premium materials</p>
                  </div>
                </div>
              </div>

              {/* Product Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="space-y-2 animate-fade-in">
                  <p className="font-medium text-sm text-muted-foreground">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="animate-scale-in hover:scale-105 transition-transform duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default Product;
