import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product as ProductType } from "@/types/product";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/components/cart/CartProvider";
import { Separator } from "@/components/ui/separator";
import { Info, ChevronLeft, Star, ShoppingCart, Plus, Minus } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCustomizationModal from "@/components/products/ProductCustomizationModal";

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // Customization fields
  const [customText, setCustomText] = useState<string>("");
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);

  const { toast } = useToast();
  const { addToCart } = useCart();
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [pendingCustomization, setPendingCustomization] = useState<any>(null);

  // Fetch product from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        if (error || !data) {
          setProduct(null);
        } else {
          // Ensure images type and a fallback
          const safeImages: string[] = Array.isArray(data.images)
            ? data.images.filter((img): img is string => typeof img === "string")
            : [];
          setProduct({ ...data, images: safeImages });
          setSelectedImage(safeImages[0] || "/placeholder-product.jpg");
        }
      } catch (e) {
        setProduct(null);
        toast({ title: "Error", description: "Could not load product.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProduct();
  }, [slug, toast]);

  // Handle custom image preview
  useEffect(() => {
    if (!customImageFile) {
      setCustomImagePreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setCustomImagePreview(reader.result as string);
    reader.readAsDataURL(customImageFile);
  }, [customImageFile]);

  // Handle add to cart, with validation
  const isCustomizable = !!product?.is_customizable;
  const allowText = true;
  const allowImage = true;
  const mustProvideCustomization = isCustomizable;
  const canAddToCart =
    !mustProvideCustomization ||
    ((allowText ? customText.trim().length > 0 : true) &&
      (allowImage ? !!customImageFile : true));

  // NEW: Open modal for customizable products instead of inline UI
  const openCustomizationModal = () => setCustomizationModalOpen(true);
  const handleCustomizationSave = async (options: { text: string; imageBase64?: string }) => {
    setPendingCustomization(options);
    if (!product) return;
    await addToCart(
      {
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: selectedImage ?? "/placeholder-product.jpg",
      },
      quantity,
      options
    );
    toast({
      title: "Added to cart!",
      description: `${quantity} ${product.name} (Customized) added!`
    });
  };

  const handleAddToCartBtn = () => {
    if (isCustomizable) {
      openCustomizationModal();
      return;
    }
    if (product) {
      addToCart(
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          image_url: selectedImage ?? "/placeholder-product.jpg",
        },
        quantity
      );
      toast({ title: "Added to cart!", description: `${quantity} ${product.name} added!` });
    }
  };

  // ----------- Layout Starts Here -----------
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div>
              <Skeleton className="h-10 w-2/3 mb-4" />
              <Skeleton className="h-6 w-1/3 mb-4" />
              <Skeleton className="h-6 w-1/2" />
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
        <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center min-h-[40vh]">
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

  const productImages: string[] = Array.isArray(product.images)
    ? product.images
    : [];

  // ----------- Actual product detail layout -----------
  return (
    <>
      <SEOHead
        title={`${product.name} | Zyra Custom Craft`}
        description={product.meta_description || product.short_description || ""}
        url={`https://shopzyra.vercel.app/product/${product.slug}`}
        image={selectedImage || productImages[0]}
      />
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* H1 for SEO */}
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 text-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          {product.name}
        </h1>
        {/* Sub Info & badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {product.is_new && <Badge variant="secondary" className="bg-green-600 text-white">New</Badge>}
          {product.is_featured && <Badge variant="secondary" className="bg-purple-700 text-white">Featured</Badge>}
          {!product.in_stock && <Badge variant="destructive">Out of Stock</Badge>}
          <span className="text-muted-foreground ml-2 text-base">SKU: {product.sku || "N/A"}</span>
          <div className="flex items-center ml-auto gap-2 text-yellow-400">
            <Star className="w-5 h-5" /><span className="font-semibold">{Number(product.rating || 0).toFixed(1)} ({product.review_count || 0})</span>
          </div>
        </div>
        <Separator className="mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product images */}
          <section>
            <Card className="overflow-hidden shadow-lg bg-muted-foreground/10 rounded-lg">
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
                  <button
                    key={i}
                    className={`w-20 h-20 rounded border-2 focus:outline-none ${selectedImage === img ? "border-primary" : "border-gray-200"}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`thumb-${i}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </section>
          {/* Product info & Customization */}
          <section>
            <div className="mb-3 flex items-end gap-3 flex-wrap">
              <span className="text-3xl font-bold text-primary">
                AED {product.price.toFixed(2)}
              </span>
              {product.discount_percentage > 0 && (
                <span className="ml-2 text-xl text-gray-400 line-through">
                  AED {(product.price / (1 - Number(product.discount_percentage) / 100)).toFixed(2)}
                </span>
              )}
            </div>
            <p className="mb-3 text-lg text-muted-foreground">{product.short_description}</p>

            <Separator className="mb-6" />

            {/* Instead of inline customization UI: */}
            {isCustomizable && (
              <div className="mb-6 space-y-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-purple-800 mb-2">Customize this product</h2>
                <Button variant="default" onClick={openCustomizationModal}>Open Customization Editor</Button>
                <ProductCustomizationModal
                  open={customizationModalOpen}
                  onOpenChange={setCustomizationModalOpen}
                  onSave={handleCustomizationSave}
                  allowText={true} allowImage={true} maxTextLength={80}
                />
                <p className="text-xs text-muted-foreground">
                  Please review your customization carefully. Customized products are final sale.
                </p>
              </div>
            )}

            {/* Quantity and buttons */}
            <div className="flex gap-2 items-center mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus />
              </Button>
              <span className="w-12 text-center font-semibold text-xl">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(q => q + 1)}
              >
                <Plus />
              </Button>
            </div>
            <Button
              size="lg"
              onClick={handleAddToCartBtn}
              className="flex-1 h-12 bg-gradient-to-r from-primary to-purple-700 text-white font-semibold mb-3"
              disabled={!product.in_stock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.in_stock ? (isCustomizable ? "Customize & Add to Cart" : "Add to Cart") : "Out of Stock"}
            </Button>

            {/* Internal links for navigation */}
            <div className="flex flex-wrap mt-5 gap-2 text-primary">
              <Link to="/shop" className="underline underline-offset-2">Shop</Link>
              <span>|</span>
              <Link to="/categories" className="underline underline-offset-2">Categories</Link>
              <span>|</span>
              <Link to="/faq" className="underline underline-offset-2">FAQ</Link>
              <span>|</span>
              <Link to="/contact" className="underline underline-offset-2">Contact</Link>
            </div>
          </section>
        </div>

        {/* Main product description */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-2">Full Description</h2>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: product.description || "No product description available.",
            }}
          />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;

// NOTE: This file is getting long. Consider asking Lovable to split it up for maintainability.
