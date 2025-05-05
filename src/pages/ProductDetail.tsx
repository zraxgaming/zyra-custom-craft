
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProducts } from "@/data/mockData";
import { toast } from "sonner";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = mockProducts.find((p) => p.slug === slug);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

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

  const handleAddToCart = () => {
    // This would normally add the product to the cart
    // For now, just show a toast notification
    toast.success(`${product.name} added to cart!`, {
      description: `Quantity: ${quantity}`,
    });
  };

  const handleCustomize = () => {
    // This would normally navigate to the customization page
    // For now, just show a toast notification
    toast(`Let's customize your ${product.name}!`, {
      description: "Customization feature coming soon.",
    });
  };

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
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`border-2 rounded-md overflow-hidden ${
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
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 ml-1">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
              
              <div className="mb-6">
                {product.discountPercentage > 0 ? (
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900">
                      ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-500 line-through ml-2">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {product.discountPercentage}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              
              <div className="prose max-w-none text-gray-600 mb-6">
                <p>{product.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Customization Options</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  {product.customizationOptions.allowText && (
                    <li>• Add custom text (up to {product.customizationOptions.maxTextLength} characters)</li>
                  )}
                  {product.customizationOptions.allowImage && (
                    <li>• Upload {product.customizationOptions.maxImageCount} image{product.customizationOptions.maxImageCount > 1 ? 's' : ''}</li>
                  )}
                  {product.customizationOptions.allowResizeRotate && (
                    <li>• Resize and rotate elements</li>
                  )}
                </ul>
              </div>
              
              <div className="mb-6">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-300 rounded-md max-w-[120px]">
                  <button
                    type="button"
                    className="p-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <span className="sr-only">Decrease</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                    className="w-full focus:outline-none text-center"
                  />
                  <button
                    type="button"
                    className="p-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <span className="sr-only">Increase</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  className="bg-zyra-purple hover:bg-zyra-dark-purple flex-1 py-6" 
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="border-zyra-purple text-zyra-purple hover:bg-zyra-purple hover:text-white flex-1 py-6"
                  onClick={handleCustomize}
                >
                  Customize Now
                </Button>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <svg className="h-5 w-5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>In stock and ready to ship</span>
              </div>
            </div>
          </div>

          {/* Product tabs */}
          <div className="mt-16 border-t border-gray-200 pt-8">
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <div className="prose max-w-none text-gray-600">
                  <p>
                    Our {product.name} is made with high-quality materials to ensure durability and long-lasting performance.
                    Each product is carefully crafted and quality checked before shipping.
                  </p>
                  <h4 className="text-base font-medium mt-4 mb-2">Materials</h4>
                  <p>
                    Depending on the product type, we use premium materials like soft cotton for t-shirts, 
                    durable plastic for phone cases, or ceramic for mugs.
                  </p>
                  <h4 className="text-base font-medium mt-4 mb-2">Customization Process</h4>
                  <p>
                    We use state-of-the-art printing technology to ensure vibrant colors and long-lasting prints
                    on all our customizable products. Your design will not fade or peel easily.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="shipping" className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Shipping & Returns</h3>
                <div className="prose max-w-none text-gray-600">
                  <h4 className="text-base font-medium mb-2">Shipping Policy</h4>
                  <p>
                    We process and ship all orders within 2-3 business days. Standard shipping typically 
                    takes 5-7 business days to arrive after processing. Express shipping options are available 
                    at checkout for faster delivery.
                  </p>
                  <h4 className="text-base font-medium mt-4 mb-2">Return Policy</h4>
                  <p>
                    We want you to be completely satisfied with your purchase. If for any reason you're not happy 
                    with your order, you may return it within 30 days of delivery for a full refund or exchange.
                    Please note that custom products can only be returned if there's a manufacturing defect.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${i < 5 ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <h4 className="text-base font-medium ml-2">Exceptional Quality!</h4>
                    </div>
                    <p className="text-gray-600 mb-1">
                      I absolutely love my new {product.name}! The customization came out perfectly and the quality is amazing.
                      Will definitely order more products in the future.
                    </p>
                    <p className="text-sm text-gray-500">Sarah J. - 2 weeks ago</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <h4 className="text-base font-medium ml-2">Great Product</h4>
                    </div>
                    <p className="text-gray-600 mb-1">
                      The customization tools were super easy to use and the final product looks great. 
                      Shipping was a little slower than expected, but overall very satisfied.
                    </p>
                    <p className="text-sm text-gray-500">Mike T. - 1 month ago</p>
                  </div>
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
