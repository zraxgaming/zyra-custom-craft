import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchProducts } from "@/data/mockData";
import { toast } from "sonner";
import { useCart } from "@/components/cart/CartProvider";
import ProductCustomizer from "@/components/products/ProductCustomizer";
import { useAuth } from "@/hooks/use-auth";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customization, setCustomization] = useState<Record<string, any> | undefined>(undefined);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true); // Set loading to true before fetching
      const products = await fetchProducts();
      const foundProduct = products.find((p: any) => p.slug === slug);
      setProduct(foundProduct);
      setLoading(false); // Set loading to false after fetching
    };

    loadProduct();
  }, [slug]);

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
            <p className="text-gray-600">Fetching product details. Please wait.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle product not found state
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
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
    if (
      product.customizationOptions.allowText ||
      product.customizationOptions.allowImage
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
        product.discountPercentage > 0
          ? product.price * (1 - product.discountPercentage / 100)
          : product.price,
      quantity,
      image: product.images[0],
      customization,
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
            productImage={product.images[selectedImage]}
            customizationOptions={product.customizationOptions}
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product images */}
            <div>
              <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`border-2 rounded-md overflow-hidden flex-shrink-0 ${
                      selectedImage === index
                        ? "border-zyra-purple"
                        : "border-transparent"
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54-.588l-2.8-2.034h3.462c.969 0 1.371-1.24.588-1.81l-1.07-3.292h3.462c.969 0 1.371 1.24.588-1.81"/>
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 ml-1">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
