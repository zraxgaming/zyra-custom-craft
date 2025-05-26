import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, ArrowLeft, Heart, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AddToCartButton from "@/components/cart/AddToCartButton";
import WishlistButton from "@/components/products/WishlistButton";
import ProductCustomizer from "@/components/products/ProductCustomizer";
import { Product } from "@/types/product";
import SEOHead from "@/components/seo/SEOHead";

const ProductDetail = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        
        // Transform the data to match our Product interface
        const transformedProduct: Product = {
          ...data,
          images: Array.isArray(data.images) 
            ? data.images.filter(img => typeof img === 'string') as string[]
            : []
        };
        
        setProduct(transformedProduct);
      } catch (error: any) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, toast]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Link to="/shop">
              <Button className="hover:scale-105 transition-all duration-300">Back to Shop</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={product ? `${product.name} | Custom Product by Zyra` : "Product Details | Zyra"}
        description={product ? `${product.description || ''} Shop custom ${product.name} at Zyra. Premium quality, fast delivery. Discover personalized gifts, custom phone cases, and unique accessories at ShopZyra. Spyra offers the best in custom products for every occasion.` : "Discover custom products at Zyra. Personalize your phone case, gift, or accessory. ShopZyra and Spyra for premium, personalized items."}
        keywords={product ? `custom product, personalized, ${product.name}, shopzyra, spyra, custom phone case, custom gift, premium, ecommerce, custom accessories, unique gifts, personalized phone case, custom design, ${product.category || ''}, buy custom ${product.name}, best custom products, shop zyra, shop spyra, custom ${product.name} online, ${product.brand || 'Zyra'}` : "custom product, personalized, shopzyra, spyra, custom phone case, custom gift, premium, ecommerce, custom accessories, unique gifts, personalized phone case, custom design, shop zyra, shop spyra, best custom products"}
        url={`https://zyra.lovable.app/product/${product ? product.slug : ''}`}
        image={product && product.images && product.images.length > 0 ? product.images[0] : "/icon-512.png"}
        structuredData={product ? {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "image": product.images,
          "description": product.description,
          "sku": product.sku,
          "brand": {
            "@type": "Brand",
            "name": product.brand || "Zyra"
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": product.price,
            "availability": product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          }
        } : undefined}
      />
      <Navbar />
      <div className="min-h-screen bg-background py-8 animate-fade-in">
        <div className="container mx-auto px-4">
          <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 hover:scale-105 transition-all duration-300">
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>

          {product && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted animate-scale-in hover:scale-105 transition-all duration-500">
                <img
                  src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg'}
                  alt={`Custom ${product.name} by Zyra | ShopZyra | Spyra | Custom Phone Case | Personalized Gift`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-product.jpg';
                  }}
                />
              </div>

              <div className="space-y-6 animate-slide-in-right">
                <div>
                  <h1 className="text-3xl font-bold mb-2 animate-bounce-in">{product.name}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 transition-all duration-300 hover:scale-125 ${
                            star <= (product.rating || 0)
                              ? "fill-yellow-400 text-yellow-400 animate-pulse"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">
                        ({product.review_count || 0} reviews)
                      </span>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-primary mb-4 animate-pulse-glow">
                    ${product.price.toFixed(2)}
                  </p>
                  {!product.in_stock && (
                    <Badge variant="destructive" className="mb-4 animate-wiggle">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                <Separator className="animate-gradient-flow bg-gradient-to-r from-primary to-purple-600" />

                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                  <div className="mt-4 text-sm text-gray-700 leading-relaxed">
                    <strong>Why choose ShopZyra and Spyra for your custom products?</strong> Discover the best in <b>custom phone cases</b>, <b>personalized gifts</b>, and <b>unique accessories</b> at Zyra. Our premium quality, fast delivery, and endless customization options make us the top choice for anyone searching for <b>custom products</b> online. Whether you want to <b>customize your phone case</b>, create a <b>personalized gift</b>, or shop for <b>unique, custom accessories</b>, ShopZyra and Spyra have you covered. Buy your <b>custom {product.name}</b> today and experience the difference!
                  </div>
                </div>

                <div className="flex gap-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                  <div className="flex-1">
                    <AddToCartButton
                      product={{
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        images: product.images
                      }}
                      disabled={!product.in_stock}
                      className="hover:scale-105 transition-all duration-300"
                    />
                  </div>
                  <WishlistButton productId={product.id} />
                  <Button variant="outline" size="icon" className="hover:scale-110 hover:rotate-12 transition-all duration-300">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                {product.is_customizable && (
                  <Card className="animate-slide-in-up hover:shadow-xl transition-all duration-500">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Customization Options</h3>
                      <ProductCustomizer productId={product.id}>
                        <Button variant="outline" className="w-full hover:scale-105 transition-all duration-300">
                          Customize This Product
                        </Button>
                      </ProductCustomizer>
                    </CardContent>
                  </Card>
                )}

                {/* SEO-optimized FAQ Section */}
                <div className="mt-8 p-4 bg-muted rounded-lg shadow animate-fade-in" id="product-faq">
                  <h3 className="font-bold text-lg mb-2">Frequently Asked Questions about Custom Products</h3>
                  <div className="space-y-3 text-sm text-gray-800">
                    <div>
                      <strong>What makes ShopZyra and Spyra the best for custom products?</strong>
                      <p>ShopZyra and Spyra offer premium quality, fast delivery, and endless customization options for custom phone cases, personalized gifts, and unique accessories. Our products are designed to help you express your individuality and make perfect gifts for any occasion.</p>
                    </div>
                    <div>
                      <strong>Can I customize my phone case or gift?</strong>
                      <p>Absolutely! With our easy-to-use product customizer, you can design your own custom phone case, personalized gift, or unique accessory. Just click the &quot;Customize This Product&quot; button above to get started.</p>
                    </div>
                    <div>
                      <strong>How fast is delivery for custom products?</strong>
                      <p>We pride ourselves on fast delivery. Most custom products ship within 2-3 business days, so you can enjoy your personalized items quickly.</p>
                    </div>
                    <div>
                      <strong>Where can I find more information?</strong>
                      <p>Visit our <Link to="/faq" className="text-primary underline">FAQ page</Link> or <Link to="/contact" className="text-primary underline">Contact Us</Link> for more details about custom products, shipping, and more.</p>
                    </div>
                  </div>
                </div>

                {/* Internal links for SEO */}
                <div className="mt-6 text-xs text-muted-foreground">
                  <span>Explore more: </span>
                  <Link to="/shop" className="text-primary underline">Shop Custom Products</Link>
                  {" | "}
                  <Link to="/categories" className="text-primary underline">Custom Phone Cases</Link>
                  {" | "}
                  <Link to="/faq" className="text-primary underline">FAQ</Link>
                  {" | "}
                  <Link to="/contact" className="text-primary underline">Contact ShopZyra</Link>
                </div>

                {/* FAQPage Structured Data for SEO */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What makes ShopZyra and Spyra the best for custom products?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "ShopZyra and Spyra offer premium quality, fast delivery, and endless customization options for custom phone cases, personalized gifts, and unique accessories. Our products are designed to help you express your individuality and make perfect gifts for any occasion."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Can I customize my phone case or gift?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Absolutely! With our easy-to-use product customizer, you can design your own custom phone case, personalized gift, or unique accessory. Just click the 'Customize This Product' button above to get started."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How fast is delivery for custom products?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "We pride ourselves on fast delivery. Most custom products ship within 2-3 business days, so you can enjoy your personalized items quickly."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Where can I find more information?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Visit our FAQ page or Contact Us for more details about custom products, shipping, and more."
                      }
                    }
                  ]
                }) }} />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
