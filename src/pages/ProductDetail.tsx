import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useCart } from "@/components/cart/CartProvider";
import ProductCustomizer from "@/components/products/ProductCustomizer";
import ProductReviews from "@/components/reviews/ProductReviews";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customization, setCustomization] = useState<Record<string, any> | undefined>(undefined);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select(`
            *,
            customization_options (*)
          `)
          .eq("slug", slug)
          .single();
          
        if (error) {
          console.error("Error fetching product:", error);
          setProduct(null);
        } else {
          setProduct(data);
        }
      } catch (err) {
        console.error("Unexpected error fetching product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="zyra-spinner w-12 h-12 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Loading...</h1>
            <p className="text-muted-foreground">Fetching product details. Please wait.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle product not found state
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Product not found</h1>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Button asChild className="bg-zyra-purple hover:bg-zyra-dark-purple">
              <a href="/shop">Back to Shop</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle adding product to cart
  const handleAddToCart = () => {
    // Check if customization is available and required
    const customizationOptions = product.customization_options?.[0] || { 
      allow_text: false, 
      allow_image: false 
    };
    
    if (
      customizationOptions.allow_text ||
      customizationOptions.allow_image
    ) {
      if (!customization) {
        setIsCustomizing(true);
        return;
      }
    }

    addItem({
      productId: product.id.toString(),
      name: product.name,
      price:
        product.discount_percentage > 0
          ? product.price * (1 - product.discount_percentage / 100)
          : product.price,
      quantity,
      image: product.images?.[0] || "",
      customization,
    });
    
    toast.success("Added to cart!", {
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Handle starting customization
  const handleCustomize = () => {
    setIsCustomizing(true);
  };

  // Handle saving customization
  const handleSaveCustomization = (customizationData: any) => {
    setCustomization(customizationData);
    setIsCustomizing(false);
    toast.success("Customization saved!", {
      description: "Your design has been saved. You can now add the product to your cart.",
    });
  };

  // Handle canceling customization
  const handleCancelCustomization = () => {
    setIsCustomizing(false);
  };

  // If in customization mode, show the customizer
  if (isCustomizing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <ProductCustomizer
            productImage={product.images?.[selectedImage] || ""}
            customizationOptions={product.customization_options?.[0] || {}}
            onSave={handleSaveCustomization}
            onCancel={handleCancelCustomization}
            initialCustomization={customization}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Regular product detail view
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product images */}
            <div>
              <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <img
                  src={product.images?.[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {(product.images || []).map((image: string, index: number) => (
                  <button
                    key={index}
                    className={`border-2 rounded-md overflow-hidden flex-shrink-0 transition-all ${
                      selectedImage === index
                        ? "border-zyra-purple shadow-lg"
                        : "border-transparent hover:border-zyra-light-purple"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-20 h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product details */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>

              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-muted-foreground ml-1">
                  {product.rating || 0} ({product.review_count || 0} reviews)
                </span>
              </div>
              
              <div className="mb-6">
                {product.discount_percentage > 0 ? (
                  <div className="flex items-center">
                    <span className="text-2xl font-semibold text-foreground">
                      ${(product.price * (1 - product.discount_percentage / 100)).toFixed(2)}
                    </span>
                    <span className="text-lg text-muted-foreground line-through ml-2">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 text-xs font-medium px-2 py-0.5 rounded">
                      {product.discount_percentage}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-semibold text-foreground">
                    ${product.price?.toFixed(2)}
                  </span>
                )}
              </div>
              
              <div className="mb-6">
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.in_stock 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  }`}>
                    {product.in_stock ? "In Stock" : "Out of Stock"}
                  </span>
                  
                  {product.is_new && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      New
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="quantity" className="block text-sm font-medium text-foreground mb-1">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-l-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="p-2 w-16 text-center border-t border-b border-gray-300 dark:border-gray-600 bg-background"
                  />
                  <button
                    type="button"
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                <Button 
                  className="bg-zyra-purple hover:bg-zyra-dark-purple btn-animate"
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                >
                  Add to Cart
                </Button>
                
                {(product.customization_options?.[0]?.allow_text || product.customization_options?.[0]?.allow_image) && (
                  <Button 
                    variant="outline"
                    onClick={handleCustomize}
                    disabled={!product.in_stock}
                    className="border-zyra-purple text-zyra-purple hover:bg-zyra-purple hover:text-white btn-animate"
                  >
                    Customize
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-4">
                <div className="prose max-w-none dark:prose-invert">
                  <p>{product.description}</p>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="pt-4">
                <ProductReviews 
                  productId={product.id}
                  averageRating={product.rating || 0}
                  totalReviews={product.review_count || 0}
                />
              </TabsContent>
              <TabsContent value="shipping" className="pt-4">
                <div className="prose max-w-none dark:prose-invert">
                  <h4>Shipping Information</h4>
                  <p>We offer various shipping options to meet your needs:</p>
                  <ul>
                    <li>Standard Shipping (3-5 business days) - Free on orders over $50</li>
                    <li>Express Shipping (1-2 business days) - $9.99</li>
                    <li>International Shipping (7-10 business days) - Calculated at checkout</li>
                  </ul>
                  <p>Shipping costs are calculated at checkout based on your location and chosen shipping method.</p>
                  <h4>Return Policy</h4>
                  <p>We offer a 30-day return policy for all products. Items must be returned in original condition.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
