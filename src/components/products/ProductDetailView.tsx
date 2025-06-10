
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, Heart, ShoppingCart, Zap, Shield, Truck, RotateCcw, Sparkles } from 'lucide-react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { WishlistButton } from '@/components/wishlist/WishlistButton';

interface ProductDetailViewProps {
  product: any;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const images = Array.isArray(product.images) ? product.images : [];
  const mainImage = images.length > 0 ? images[selectedImage] : '/placeholder-product.jpg';

  const features = [
    { icon: Shield, text: 'Premium Quality Guarantee', color: 'text-green-500' },
    { icon: Truck, text: 'Free Shipping Worldwide', color: 'text-blue-500' },
    { icon: RotateCcw, text: '30-Day Return Policy', color: 'text-purple-500' },
    { icon: Zap, text: 'Fast Processing', color: 'text-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-2xl animate-pulse-gentle"></div>
      </div>

      <Container className="py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
          {/* Product Images */}
          <div className="space-y-6 animate-slide-in-left">
            <Card className="overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <div className="relative aspect-square group">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-product.jpg';
                  }}
                />
                {product.is_featured && (
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 animate-bounce">
                    <Sparkles className="h-4 w-4 mr-1 animate-spin" />
                    Featured
                  </Badge>
                )}
                <div className="absolute top-4 right-4 animate-slide-in-right">
                  <WishlistButton productId={product.id} />
                </div>
              </div>
            </Card>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4 animate-slide-in-up">
                {images.map((image, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-xl ${
                      selectedImage === index ? 'ring-2 ring-primary shadow-lg' : ''
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <div className="aspect-square">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8 animate-slide-in-right">
            <div className="space-y-4">
              <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Badge variant="outline" className="animate-pulse">
                  {product.category || 'Uncategorized'}
                </Badge>
                {product.in_stock ? (
                  <Badge className="bg-green-500 animate-bounce">In Stock</Badge>
                ) : (
                  <Badge variant="destructive" className="animate-pulse">Out of Stock</Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-text-shimmer">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
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
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.review_count || 0} reviews)
                </span>
              </div>

              <div className="text-5xl font-bold text-primary animate-bounce-in" style={{ animationDelay: '0.6s' }}>
                ${product.price?.toFixed(2) || '0.00'}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <Card className="p-6 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm border-0 shadow-xl animate-scale-in" style={{ animationDelay: '0.8s' }}>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </Card>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '1s' }}>
              {features.map((feature, index) => (
                <Card key={index} className="p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-in-up" style={{ animationDelay: `${1.2 + index * 0.1}s` }}>
                  <div className="flex items-center gap-3">
                    <feature.icon className={`h-5 w-5 ${feature.color} animate-pulse`} />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Quantity and Add to Cart */}
            <Card className="p-6 bg-gradient-to-r from-primary/5 to-purple-500/5 border-2 border-primary/20 animate-bounce-in" style={{ animationDelay: '1.4s' }}>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <label className="text-lg font-semibold">Quantity:</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="hover:scale-110 transition-transform duration-200"
                    >
                      -
                    </Button>
                    <span className="text-xl font-bold px-4 py-2 bg-background rounded-lg">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="hover:scale-110 transition-transform duration-200"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      images: product.images
                    }}
                    quantity={quantity}
                    disabled={!product.in_stock}
                    className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  />
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 border-2 hover:scale-105 transition-all duration-300"
                  >
                    <Heart className="h-5 w-5 mr-2 animate-bounce" />
                    Save
                  </Button>
                </div>
              </div>
            </Card>

            {/* Product Specifications */}
            <Card className="p-6 animate-slide-in-right" style={{ animationDelay: '1.6s' }}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary animate-pulse" />
                Product Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">SKU:</span>
                    <span className="text-muted-foreground">{product.sku || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Weight:</span>
                    <span className="text-muted-foreground">{product.weight || 'N/A'} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Stock:</span>
                    <span className="text-muted-foreground">{product.stock_quantity || 0} units</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Brand:</span>
                    <span className="text-muted-foreground">{product.brand || 'Zyra'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Material:</span>
                    <span className="text-muted-foreground">{product.material || 'Premium'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Customizable:</span>
                    <span className="text-muted-foreground">{product.is_customizable ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailView;
