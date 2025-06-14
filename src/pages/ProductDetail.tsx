import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product as ProductType } from "@/types/product";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, ShoppingCart, Heart, Minus, Plus, MessageCircle, ShieldCheck, Truck, ChevronLeft, Info, Tag, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/components/cart/CartProvider";
import WishlistButton from "@/components/products/WishlistButton";
import ProductReviews from "@/components/reviews/ProductReviews";
import ReviewForm from "@/components/products/ReviewForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import SEOHead from "@/components/seo/SEOHead";
import { useAuth } from "@/contexts/AuthContext";
import ProductCustomizer from "@/components/products/ProductCustomizer";
import { CartItemCustomization } from "@/types/cart";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Json } from "@/integrations/supabase/types";

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('description');
  const [customization, setCustomization] = useState<CartItemCustomization | undefined>(undefined);

  const { toast } = useToast();
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            category_id ( id, name, slug ),
            reviews ( id, rating, comment, created_at, title, user_id (id, display_name, avatar_url) )
          `)
          .eq('slug', slug)
          .single();

        if (error) {
          if (error.code === 'PGRST116') { 
            setProduct(null);
          } else {
            throw error;
          }
        } else {
          setProduct(data as ProductType); 
          if (data?.images && Array.isArray(data.images) && data.images.length > 0) {
            const firstImage = data.images[0];
            if (typeof firstImage === 'string') {
                 setSelectedImage(firstImage);
            }
          }
        }
      } catch (error: any) {
        console.error('Error fetching product:', error);
        toast({ title: 'Error', description: `Failed to load product details: ${error.message}`, variant: 'destructive' });
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
        return;
    }
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image_url: (product.images && Array.isArray(product.images) && typeof product.images[0] === 'string') ? product.images[0] : '/placeholder-product.jpg',
      customization: customization,
    });
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const renderStars = (rating: number | undefined, reviewCount: number | undefined) => {
    if (typeof rating !== 'number' || rating === 0) return <span className="text-sm text-muted-foreground">No reviews yet</span>;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
        {halfStar && <Star key="half" className="h-5 w-5 fill-yellow-400 text-yellow-400" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />)}
        <a href="#reviews" className="ml-2 text-sm text-muted-foreground hover:underline">({reviewCount || 0} reviews)</a>
      </div>
    );
  };

  const onCustomizationSave = (customizationData: CartItemCustomization) => {
    setCustomization(customizationData);
    toast({ title: "Customization Saved", description: "Your preferences have been saved and applied." });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Skeleton */}
          <Skeleton className="h-6 w-1/2 mb-6" />
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery Skeleton */}
            <div className="space-y-4">
              <Skeleton className="w-full aspect-square rounded-lg shadow-md" />
              <div className="grid grid-cols-5 gap-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="w-full aspect-square rounded" />)}
              </div>
            </div>
            {/* Product Details Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" /> {/* Product Name */}
              <Skeleton className="h-6 w-1/4" /> {/* Price */}
              <Skeleton className="h-5 w-1/2" /> {/* Rating */}
              <Skeleton className="h-20 w-full" /> {/* Short Description */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-28" /> {/* Quantity */}
                <Skeleton className="h-12 flex-1" /> {/* Add to Cart */}
                <Skeleton className="h-12 w-12" /> {/* Wishlist */}
              </div>
            </div>
          </div>
          {/* Tabs Skeleton */}
          <div className="mt-12">
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-40 w-full" />
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
        <div className="container mx-auto px-4 py-8 text-center min-h-[60vh] flex flex-col justify-center items-center">
          <Info className="h-16 w-16 text-destructive mb-4" />
          <h1 className="text-3xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">Sorry, we couldn't find the product you're looking for.</p>
          <Link to="/shop">
            <Button><ChevronLeft className="mr-2 h-4 w-4" />Back to Shop</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }
  
  const productImages = (Array.isArray(product.images) ? product.images.filter(img => typeof img === 'string') : []) as string[];

  const category = product.category_id && typeof product.category_id === 'object' 
    ? product.category_id as { id: string; name: string; slug: string } 
    : null;

  return (
    <>
      <SEOHead
        title={product.meta_title || product.name}
        description={product.meta_description || product.short_description || ''}
        image={selectedImage || productImages[0]}
      />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/shop">Shop</Link></BreadcrumbLink>
            </BreadcrumbItem>
            {category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild><Link to={`/categories/${category.slug}`}>{category.name}</Link></BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 animate-fade-in">
          {/* Image Gallery */}
          <div className="space-y-4">
             <Card className="overflow-hidden shadow-lg rounded-lg">
                <AspectRatio ratio={1}>
                  <img
                    src={selectedImage || productImages[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </AspectRatio>
             </Card>
            {productImages && productImages.length > 1 && (
              <Carousel opts={{ align: "start", loop: productImages.length > 5 }} className="w-full">
                <CarouselContent className="-ml-2">
                  {productImages.map((image, index) => (
                    <CarouselItem key={index} className="pl-2 basis-1/4 sm:basis-1/5">
                      <Card 
                        onClick={() => setSelectedImage(image)} 
                        className={`overflow-hidden cursor-pointer transition-all rounded-md border-2 ${selectedImage === image ? 'border-primary' : 'border-transparent hover:border-muted-foreground/50'}`}
                      >
                        <AspectRatio ratio={1}>
                          <img src={image} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        </AspectRatio>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {productImages.length > 5 && <CarouselPrevious className="left-[-10px] hidden sm:flex" />}
                {productImages.length > 5 && <CarouselNext className="right-[-10px] hidden sm:flex" />}
              </Carousel>
            )}
          </div>

          {/* Product Details */}
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              {category && (
                <Link to={`/categories/${category.slug}`} className="text-sm text-primary hover:underline mb-1 inline-block">
                  {category.name}
                </Link>
              )}
              <CardTitle className="text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</CardTitle>
              <div className="mt-2 flex items-center space-x-2">
                {renderStars(product.rating, (product as any).review_count)}
              </div>
               <div className="mt-3 flex items-baseline gap-2">
                <p className="text-3xl font-bold text-primary">AED {product.price.toFixed(2)}</p>
                {product.discount_percentage && product.discount_percentage > 0 && (
                  <Badge variant="destructive" className="text-sm">-{product.discount_percentage}% OFF</Badge>
                )}
              </div>
              {product.sku && <p className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</p>}
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">{product.short_description || "Detailed information about this product is coming soon."}</p>
              
              {product.is_customizable && (
                <ProductCustomizer productId={product.id}>
                  <Button variant="outline">Customize Product</Button>
                </ProductCustomizer>
              )}

              <div className="flex items-center gap-2">
                {product.in_stock ? (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
                    <CheckCircle className="mr-1 h-4 w-4" />In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
                 {product.is_new && <Badge variant="secondary" className="bg-blue-500 text-white">New Arrival</Badge>}
                 {product.is_featured && <Badge variant="secondary" className="bg-purple-500 text-white">Featured</Badge>}
              </div>

            </CardContent>
            <CardFooter className="flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-6 border-t">
              <div className="flex items-center border rounded-md overflow-hidden">
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="rounded-none h-11 w-11">
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} className="rounded-none h-11 w-11">
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              <Button size="lg" onClick={handleAddToCart} className="flex-1 h-11" disabled={!product.in_stock}>
                <ShoppingCart className="mr-2 h-5 w-5" /> {product.in_stock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <WishlistButton productId={product.id} size="lg" className="h-11 w-11" />
            </CardFooter>
          </Card>
        </div>

        {/* Tabs for Description and Reviews */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-12" id="reviews">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex bg-muted p-1 rounded-lg">
            <TabsTrigger value="description" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">Description</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">Reviews ({(product as any).reviews?.length || 0})</TabsTrigger>
          </TabsList>
          <TabsContent value="description">
            <Card className="mt-4 shadow-sm rounded-lg">
              <CardContent className="pt-6 prose dark:prose-invert max-w-none">
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <p>No detailed description available for this product yet. Check back soon!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews">
            <Card className="mt-4 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle>Customer Reviews & Feedback</CardTitle>
                <CardDescription>Honest opinions from our valued customers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ProductReviews 
                  productId={product.id}
                />
                <Separator />
                {user ? (
                  <ReviewForm productId={product.id} onReviewSubmitted={() => { 
                    toast({title: "Review Submitted!", description: "Thank you for your feedback."})
                   }} 
                  />
                ) : (
                  <div className="text-center py-4 border rounded-lg bg-muted/50">
                    <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      <Link to={`/auth?redirect=/product/${slug}#reviews`} className="text-primary font-semibold hover:underline">Sign in</Link> or <Link to={`/auth?redirect=/product/${slug}#reviews`} className="text-primary font-semibold hover:underline">create an account</Link> to leave a review.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* TODO: Add related products section: <RelatedProducts categoryId={category?.id} currentProductId={product.id} /> */}
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
