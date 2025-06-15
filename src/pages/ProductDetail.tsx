
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product as ProductType } from "@/types/product";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, ShoppingCart, Heart, Minus, Plus, MessageCircle, ShieldCheck, Truck, ChevronLeft, Info, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/components/cart/CartProvider";
import WishlistButton from "@/components/products/WishlistButton";
import ProductReviews from "@/components/reviews/ProductReviews";
import ReviewForm from "@/components/products/ReviewForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import SEOHead from "@/components/seo/SEOHead";
import { useAuth } from "@/contexts/AuthContext";

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("description");
  const [customText, setCustomText] = useState("");
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);

  const { toast } = useToast();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Supabase fetch logic: must use maybeSingle() with zero or one result
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (error) {
          setProduct(null);
        } else if (data) {
          setProduct({
            ...data,
            images: Array.isArray(data.images) ? data.images.filter((img): img is string => typeof img === "string") : [],
          });
          if (data?.images?.length && typeof data.images[0] === "string") {
            setSelectedImage(data.images[0]);
          }
        } else {
          setProduct(null);
        }
      } catch (e: any) {
        console.error("Error fetching product:", e);
        toast({ title: "Error", description: "Could not load product details.", variant: "destructive" });
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    // eslint-disable-next-line
  }, [slug]);

  // Handle image preview for custom upload
  useEffect(() => {
    if (!customImage) {
      setCustomImagePreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setCustomImagePreview(reader.result as string);
    reader.readAsDataURL(customImage);
  }, [customImage]);

  const isCustomizable = !!product?.is_customizable;
  const allowText = true; // For simplicity (replace if you want to pull from product.customization_options)
  const allowImage = true; // Same as above

  // Guard: make sure customization is required before adding to cart
  const canAddToCart = !isCustomizable ||
    ((allowText ? customText.trim().length > 0 : true) && (allowImage ? !!customImage : true));

  // Enforce customization on custom product add
  const handleAddToCart = async () => {
    if (!product) return;

    if (isCustomizable) {
      // Require customization!
      if ((allowText && !customText.trim()) || (allowImage && !customImage)) {
        toast({
          title: "Customization Required!",
          description: "Please provide the required customization before adding to cart.",
          variant: "destructive",
        });
        return;
      }
    }

    let customization: any = {};
    if (allowText) customization.text = customText.trim();

    if (allowImage && customImage) {
      // Demo only: convert image to base64; in production, upload to Supabase storage and save URL
      const reader = new FileReader();
      reader.onloadend = async () => {
        customization.image_base64 = reader.result;
        await addToCart(
          {
            product_id: product.id,
            name: product.name,
            price: product.price,
            image_url: selectedImage || product.images[0] || "/placeholder-product.jpg",
          },
          quantity,
          customization
        );
        toast({ title: "Added to cart!", description: `${quantity} ${product.name} added.` });
      };
      reader.readAsDataURL(customImage);
      return;
    }

    // Standard, or text-only customization
    await addToCart(
      {
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: selectedImage || product.images[0] || "/placeholder-product.jpg",
      },
      quantity,
      customization
    );

    toast({ title: "Added to cart!", description: `${quantity} ${product.name} added.` });
  };

  // Main loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-6 w-1/2 mb-6" />
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <Skeleton className="w-full aspect-square rounded-lg shadow-md" />
              <div className="grid grid-cols-5 gap-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="w-full aspect-square rounded" />)}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-28" />
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-12" />
              </div>
            </div>
          </div>
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
        <div className="container mx-auto px-4 py-24 text-center min-h-[40vh] flex flex-col justify-center items-center">
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

  // Ensure images are string[]
  const productImages = product.images as string[];

  return (
    <>
      <SEOHead
        title={product?.meta_title || product?.name || "Product Details"}
        description={product?.meta_description || product?.short_description || "View product details"}
        url={`https://shopzyra.vercel.app/product/${product.slug}`}
        image={selectedImage || productImages[0]}
      />
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-6">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-1 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 flex-wrap mt-2">
            {product.is_new && (
              <Badge variant="secondary" className="bg-blue-500 text-white">New Arrival</Badge>
            )}
            {product.is_featured && (
              <Badge variant="secondary" className="bg-purple-500 text-white">Featured</Badge>
            )}
            {!product.in_stock && <Badge variant="destructive">Out of Stock</Badge>}
            <span className="text-base text-muted-foreground ml-2">
              SKU: {product.sku || "N/A"}
            </span>
          </div>
        </header>
        {/* Product & Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section>
            <Card className="overflow-hidden shadow-lg rounded-lg bg-muted-foreground/5 mb-3">
              <AspectRatio ratio={1}>
                <img
                  src={selectedImage || productImages[0] || "/placeholder-product.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            </Card>
            {productImages.length > 1 && (
              <div className="flex gap-2 mt-3">
                {productImages.map((img, i) => (
                  <button key={i} className={`w-20 h-20 rounded border-2 ${selectedImage === img ? "border-primary" : "border-gray-200"}`}
                    onClick={() => setSelectedImage(img)}>
                    <img src={img} alt={`thumb-${i}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </section>
          {/* Product info + Customization */}
          <section>
            <div className="mb-4">
              <span className="text-4xl font-bold text-primary">
                AED {product.price.toFixed(2)}
              </span>
              {product.discount_percentage > 0 && (
                <span className="ml-3 text-xl text-gray-400 line-through">
                  AED {(product.price / (1 - product.discount_percentage / 100)).toFixed(2)}
                </span>
              )}
            </div>
            <div className="mb-5 flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{Number(product.rating || 0).toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({product.review_count || 0})</span>
            </div>
            <p className="mb-4 text-muted-foreground">{product.short_description}</p>
            <Separator className="mb-4" />
            {/* Customization fields if required */}
            {isCustomizable && (
              <div className="mb-6 space-y-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-purple-800 mb-2">Customize your product</h2>
                {allowText && (
                  <div>
                    <label className="block mb-1 font-medium" htmlFor="customText">Custom Text *</label>
                    <input
                      id="customText"
                      type="text"
                      value={customText}
                      onChange={e => setCustomText(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Your custom text"
                      required
                    />
                  </div>
                )}
                {allowImage && (
                  <div>
                    <label className="block mb-1 font-medium" htmlFor="customImage">Custom Image *</label>
                    <input
                      id="customImage"
                      type="file"
                      accept="image/*"
                      onChange={e => setCustomImage(e.target.files ? e.target.files[0] : null)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                    {customImagePreview && (
                      <img src={customImagePreview} alt="custom preview" className="h-20 mt-2 rounded shadow" />
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  All customizations are final. Custom products cannot be returned unless faulty.
                </p>
              </div>
            )}
            {/* Quantity & buttons */}
            <div className="flex gap-2 items-center mb-4">
              <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>
                <Minus />
              </Button>
              <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q + 1)}>
                <Plus />
              </Button>
            </div>
            <div className="flex gap-2 mb-8 flex-wrap">
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-gradient-to-r from-primary to-purple-700 text-white font-semibold"
                disabled={!product.in_stock || (isCustomizable && !canAddToCart)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.in_stock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <WishlistButton productId={product.id} className="h-12 w-12" size="lg" />
            </div>
            {/* Internal Links */}
            <nav aria-label="breadcrumb" className="mb-4">
              <Link to="/shop" className="text-primary underline underline-offset-2 mr-2">Shop</Link>
              |
              <Link to="/categories" className="text-primary underline underline-offset-2 mx-2">Categories</Link>
              |
              <Link to="/faq" className="text-primary underline underline-offset-2 mx-2">FAQ</Link>
              |
              <Link to="/contact" className="text-primary underline underline-offset-2 ml-2">Contact</Link>
            </nav>
          </section>
        </div>
        {/* Product Description / Reviews as Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-12" id="details-tabs">
          <TabsList className="mb-6">
            <TabsTrigger value="description" className="mr-2">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description">
            <article className="prose dark:prose-invert max-w-none">
              <h2>Description</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: product.description || "No product description available.",
                }}
              />
            </article>
          </TabsContent>
          <TabsContent value="reviews">
            <section className="space-y-6">
              <ProductReviews productId={product.id} />
              <Separator />
              {user ? (
                <ReviewForm productId={product.id} onReviewSubmitted={() => { toast({ title: "Review Submitted!", description: "Thank you for your feedback." }); }} />
              ) : (
                <div className="text-center py-4 border rounded-lg bg-muted/50">
                  <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    <Link to={`/auth?redirect=/product/${slug}#reviews`} className="text-primary font-semibold hover:underline">Sign in</Link> or <Link to={`/auth?redirect=/product/${slug}#reviews`} className="text-primary font-semibold hover:underline">create an account</Link> to leave a review.
                  </p>
                </div>
              )}
            </section>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;

// NOTE: This file is getting long. Please ask Lovable to modularize (split components by section) for maintainability.
