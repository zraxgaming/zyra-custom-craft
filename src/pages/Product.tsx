import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Home, ChevronRight, ShoppingCart, Heart, Star, StarHalf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/hooks/use-wishlist";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product as ProductType } from "@/types/product";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchProduct(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (product && product.id) {
      const w = localStorage.getItem('wishlist');
      let found = false;
      if (w) {
        try {
          const wArr = JSON.parse(w) as { id: string }[];
          found = wArr.some(item => item.id === product.id);
        } catch (_) {}
      }
      setIsWishlisted(found);
    }
    if (product) setSelectedImage(product.images?.[0] || null);
  }, [product]);

  const fetchProduct = async (slug: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`*, category:categories(name)`)
        .eq('slug', slug)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive",
        });
      }

      if (data) {
        const transformedProduct: ProductType = {
          ...data,
          images: Array.isArray(data.images)
            ? data.images.filter(img => typeof img === 'string') as string[]
            : [],
          is_featured: data.is_featured || false,
          is_customizable: data.is_customizable || false,
          stock_quantity: data.stock_quantity || 0,
          category: data.category ? data.category.name : 'Category'
        };
        setProduct(transformedProduct);
      }
    } catch (error) {
      console.error("Unexpected error fetching product:", error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while loading the product.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: ProductType) => {
    if (!product) return;
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      in_stock: product.in_stock,
      customization: {
        images: product.images?.[0] || '/placeholder-product.jpg'
      },
    });
  };

  const toggleWishlist = (product: ProductType) => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      let wArr: { id: string; name: string; price: number; image: string }[] = [];
      try {
        const w = localStorage.getItem('wishlist');
        if (w) wArr = JSON.parse(w);
        wArr.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '/placeholder-product.jpg'
        });
        localStorage.setItem('wishlist', JSON.stringify(wArr));
      } catch (_) {}
      setIsWishlisted(true);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/shop" className="text-blue-500 hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-500" />);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<StarHalf key={i} className="w-4 h-4 text-yellow-500" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <>
      <SEOHead
        title={`${product.name} - Zyra`}
        description={product.description}
        url={`https://shopzyra.vercel.app/product/${product.slug}`}
        image={product.images?.[0] || '/placeholder-product.jpg'}
      />
      <div className="min-h-screen bg-background">
        <Navbar />

        <Container className="py-12">
          {/* Breadcrumb section - fix null category_id errors */}
          <div className="mb-6 animate-fade-in">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link to="/home" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-400 dark:hover:text-white">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <Link to="/shop" className="ml-1 text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-400 dark:hover:text-white md:ml-2">
                      Shop
                    </Link>
                  </div>
                </li>
                {product?.category && (
                  <li>
                    <div className="flex items-center">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2">
                        {product.category || 'Category'}
                      </span>
                    </div>
                  </li>
                )}
                <li aria-current="page">
                  <div className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2">
                      {product?.name}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-in-bottom">
            {/* Product Images */}
            <div className="space-y-4">
              <AspectRatio ratio={1 / 1}>
                <img
                  src={selectedImage || product.images?.[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="object-cover rounded-lg shadow-md w-full h-full"
                />
              </AspectRatio>

              <div className="flex overflow-x-auto space-x-4">
                {product.images?.map((image, index) => (
                  <div key={index} className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden shadow-sm cursor-pointer hover:opacity-75 transition-opacity">
                    <AspectRatio ratio={1 / 1}>
                      <img
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="object-cover w-full h-full"
                        onClick={() => setSelectedImage(image)}
                      />
                    </AspectRatio>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{product.name}</h1>
              <div className="flex items-center space-x-3">
                <div className="flex items-center">{renderRating(product.rating || 0)}</div>
                <span className="text-sm text-gray-500 dark:text-gray-400">({product.review_count || 0} Reviews)</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">${product.price}</h2>
                {/* No discount_price block */}
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Description</h3>
                <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Category: <Badge variant="secondary">{product.category}</Badge>
                </h3>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Status: <Badge variant={product.in_stock ? 'default' : 'destructive'}>{product.in_stock ? 'In Stock' : 'Out of Stock'}</Badge>
                </h3>
              </div>

              <Separator />

              <div className="flex flex-col space-y-4">
                <div className="flex space-x-4">
                  <Button
                    size="lg"
                    className="w-full md:w-auto flex items-center justify-center gap-2"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.in_stock}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full md:w-auto flex items-center justify-center gap-2"
                    onClick={() => toggleWishlist(product)}
                  >
                    {isWishlisted ? (
                      <>
                        <Heart className="w-5 h-5 text-red-500" />
                        Remove from Wishlist
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5" />
                        Add to Wishlist
                      </>
                    )}
                  </Button>
                </div>

                {product.is_customizable && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="secondary" className="w-full md:w-auto">Customize</Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-lg p-0">
                      <SheetHeader className="text-left p-6">
                        <SheetTitle>Customize Your {product.name}</SheetTitle>
                      </SheetHeader>
                      <ScrollArea className="h-[calc(100vh-80px)]">
                        <div className="p-6">
                          {/* Add customization options here */}
                          <p>Customization options coming soon...</p>
                        </div>
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>
                )}
              </div>
            </div>
          </div>
        </Container>

        <Footer />
      </div>
    </>
  );
}
