import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Product as ProductType } from '@/types/product';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, ShoppingCart, Heart, Minus, Plus, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/components/cart/CartProvider';
import WishlistButton from '@/components/products/WishlistButton'; // Updated path
import ProductReviews from '@/components/reviews/ProductReviews';
import ReviewForm from '@/components/products/ReviewForm';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SEOHead } from '@/components/seo/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import ProductCustomizer from '@/components/products/ProductCustomizer';
import { CartItemCustomization } from '@/types/cart';

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [customization, setCustomization] = useState<CartItemCustomization | undefined>(undefined);

  const { toast } = useToast();
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            category_id ( name, slug ),
            reviews ( id, rating, comment, created_at, title, user_id (id, display_name, avatar_url) )
          `)
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setProduct(data as ProductType);
        if (data && data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({ title: 'Error', description: 'Failed to load product details.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, toast]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.is_customizable && !customization) {
        toast({
            title: "Customization Required",
            description: "Please customize the product before adding to cart.",
            variant: "default"
        });
        // Optionally open the customizer modal here
        return;
    }
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image_url: product.images?.[0] || '/placeholder-product.jpg',
      customization: customization,
    });
    toast({
      title: 'Added to cart',
      description: `${product.name} (x${quantity}) added to your cart.`,
    });
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const renderStars = (rating: number | undefined) => {
    if (typeof rating !== 'number') return <span className="text-sm text-muted-foreground">No reviews yet</span>;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
        {halfStar && <Star key="half" className="h-5 w-5 fill-yellow-400 text-yellow-400" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />)}
        <span className="ml-2 text-sm text-muted-foreground">({product?.review_count || 0} reviews)</span>
      </div>
    );
  };
  
  const onCustomizationSave = (customizationData: CartItemCustomization) => {
    setCustomization(customizationData);
    toast({ title: "Customization Saved", description: "Your preferences have been saved." });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Skeleton className="w-full aspect-square rounded-lg" />
              <div className="flex space-x-2 mt-4">
                {[1,2,3,4].map(i => <Skeleton key={i} className="w-20 h-20 rounded" />)}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-1/2" />
            </div>
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
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-semibold">Product not found</h1>
          <Link to="/shop"><Button className="mt-4">Go to Shop</Button></Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={product.meta_title || product.name}
        description={product.meta_description || product.short_description || ''}
        imageUrl={product.images?.[0]}
      />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 animate-fade-in">
          {/* Image Gallery */}
          <div className="space-y-4">
             <Card className="overflow-hidden">
                <AspectRatio ratio={1}>
                  <img
                    src={selectedImage || product.images?.[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </AspectRatio>
             </Card>
            {product.images && product.images.length > 1 && (
              <Carousel opts={{ align: "start", loop: false }} className="w-full">
                <CarouselContent className="-ml-2">
                  {product.images.map((image, index) => (
                    <CarouselItem key={index} className="pl-2 basis-1/4 md:basis-1/5">
                      <Card 
                        onClick={() => setSelectedImage(image)} 
                        className={`overflow-hidden cursor-pointer transition-all ${selectedImage === image ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80'}`}
                      >
                        <AspectRatio ratio={1}>
                          <img src={image} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        </AspectRatio>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {product.images.length > 5 && <CarouselPrevious className="hidden sm:flex" />}
                {product.images.length > 5 && <CarouselNext className="hidden sm:flex" />}
              </Carousel>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              {product.category_id && typeof product.category_id === 'object' && (
                <Link to={`/categories/${(product.category_id as any).slug}`} className="text-sm text-primary hover:underline">
                  {(product.category_id as any).name}
                </Link>
              )}
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</h1>
              <div className="mt-2 flex items-center space-x-2">
                {renderStars(product.rating)}
              </div>
              <p className="text-3xl font-bold text-primary mt-4">AED {product.price.toFixed(2)}</p>
              {product.discount_percentage && product.discount_percentage > 0 && (
                 <Badge variant="destructive" className="ml-2 text-sm">-{product.discount_percentage}%</Badge>
              )}
            </div>
            
            <p className="text-muted-foreground leading-relaxed">{product.short_description || "No short description available."}</p>

            {product.is_customizable && (
              <ProductCustomizer
                productId={product.id}
                onSave={onCustomizationSave}
                initialCustomization={customization}
                productName={product.name}
              />
            )}

            <CardFooter className="flex-col sm:flex-row items-stretch sm:items-center gap-4 p-0 pt-6 border-t">
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button size="lg" onClick={handleAddToCart} className="flex-1">
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              <WishlistButton productId={product.id} size="lg" />
            </CardFooter>

            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                    <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-500" />
                    <span>Fast Delivery Options</span>
                </div>
            </div>
          </div>
        </div>

        {/* Tabs for Description and Reviews */}
        <Tabs defaultValue="description" className="mt-12">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product?.reviews?.length || 0})</TabsTrigger>
          </TabsList>
          <TabsContent value="description">
            <Card>
              <CardContent className="pt-6 prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available.</p>' }} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>See what others are saying about this product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ProductReviews reviews={product.reviews || []} />
                <Separator />
                {user ? (
                  <ReviewForm productId={product.id} onReviewSubmitted={() => { /* Consider refetching product or reviews */ }} />
                ) : (
                  <p className="text-center text-muted-foreground">
                    <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to leave a review.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* TODO: Add related products section */}
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
