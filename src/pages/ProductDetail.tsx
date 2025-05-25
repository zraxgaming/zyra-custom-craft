
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Star, Heart, ShoppingCart, ArrowLeft, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import WishlistButton from "@/components/products/WishlistButton";
import ProductCustomizer from "@/components/products/ProductCustomizer";
import ProductReviews from "@/components/reviews/ProductReviews";
import { useCart } from "@/components/cart/CartProvider";
import { Product, CustomizationOptions } from "@/types/product";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState<Record<string, any>>({});

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            name,
            slug
          ),
          customization_options (*)
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) throw error;
      
      // Transform customization options to match the interface
      const transformedProduct = {
        ...data,
        customization_options: data.customization_options?.map((option: any) => ({
          id: option.id,
          allowText: option.allow_text,
          allowImage: option.allow_image,
          maxTextLength: option.max_text_length,
          maxImageCount: option.max_image_count,
          allowResizeRotate: option.allow_resize_rotate
        })) || []
      };
      
      setProduct(transformedProduct as Product);
    } catch (error: any) {
      toast({
        title: "Error fetching product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const primaryImage = Array.isArray(product.images) && product.images.length > 0 
      ? product.images[0] 
      : undefined;

    await addItem({
      name: product.name,
      productId: product.id,
      quantity,
      price: product.price,
      customization,
      image: primaryImage,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        images: Array.isArray(product.images) ? product.images : [],
        slug: product.slug,
      },
    });

    setQuantity(1);
    setCustomization({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Container className="py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
        <Container className="py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Product not found</h1>
            <Button onClick={() => navigate("/shop")}>
              Back to Shop
            </Button>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  const images = Array.isArray(product.images) ? product.images : [];
  const hasCustomization = product.customization_options && product.customization_options.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Container className="py-8">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              {images.length > 0 ? (
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image Available
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index
                        ? "border-primary"
                        : "border-border"
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
                <Badge variant="secondary">{product.categories?.name || product.category}</Badge>
                {product.is_new && <Badge className="bg-green-500 text-white">New</Badge>}
                {product.discount_percentage > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {product.discount_percentage}% OFF
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-muted-foreground">
                    ({product.review_count} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                {product.discount_percentage > 0 && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${(product.price / (1 - product.discount_percentage / 100)).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-6">
                {product.description}
              </p>
            </div>

            {/* Customization Options */}
            {hasCustomization && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-foreground">Customize Your Product</h3>
                <ProductCustomizer
                  productId={product.id}
                  customizationOptions={product.customization_options || []}
                  customization={customization}
                  onCustomizationChange={setCustomization}
                />
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium text-foreground">Quantity:</label>
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium text-foreground">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 btn-animate"
                  disabled={!product.in_stock}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.in_stock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <WishlistButton productId={product.id} />
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.in_stock ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className={product.in_stock ? "text-green-600" : "text-red-600"}>
                {product.in_stock ? "In Stock" : "Out of Stock"}
              </span>
              {product.stock_quantity && product.stock_quantity <= 5 && (
                <span className="text-orange-600">
                  (Only {product.stock_quantity} left!)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        <div className="mt-16">
          <ProductReviews 
            productId={product.id} 
            averageRating={product.rating}
            totalReviews={product.review_count}
          />
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default ProductDetail;
