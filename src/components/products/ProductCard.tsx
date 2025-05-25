
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, Sparkles, Package, Eye } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import WishlistButton from "@/components/products/WishlistButton";
import { Product } from "@/hooks/use-products";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountedPrice = product.discount_percentage > 0 
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  return (
    <div className="group relative bg-gradient-to-br from-card to-card/50 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden border border-border/50 hover:border-primary/30 animate-scale-in hover:scale-[1.02] transform-gpu">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.slug}`} className="block">
          <div className="aspect-square bg-muted/30 relative overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 filter group-hover:brightness-110"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center animate-pulse">
                  <Package className="h-16 w-16 mx-auto mb-2 text-muted-foreground/50" />
                  <span className="text-sm">No Image</span>
                </div>
              </div>
            )}
            
            {/* Overlay with view icon */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </Link>
        
        {/* Enhanced wishlist button */}
        <WishlistButton 
          productId={product.id}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 hover:scale-125 bg-white/90 backdrop-blur-sm shadow-lg"
        />
        
        {/* Enhanced badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_new && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-bounce shadow-lg border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              New
            </Badge>
          )}
          
          {product.discount_percentage > 0 && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white animate-pulse shadow-lg border-0">
              🔥 {product.discount_percentage}% OFF
            </Badge>
          )}

          {product.is_customizable && (
            <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Custom
            </Badge>
          )}
        </div>
        
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center animate-fade-in backdrop-blur-sm">
            <Badge variant="destructive" className="text-lg px-6 py-3 shadow-2xl animate-bounce">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-6 space-y-4 relative z-10">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-bold text-lg text-foreground hover:text-primary transition-colors line-clamp-2 story-link group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors">
          {product.description}
        </p>
        
        {/* Enhanced rating display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 transition-all duration-300 ${
                    i < Math.floor(product.rating) 
                      ? "text-yellow-500 fill-current animate-pulse" 
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
              ({product.review_count})
            </span>
          </div>
        </div>
        
        {/* Enhanced pricing */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            {product.discount_percentage > 0 ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground line-through bg-muted/50 px-2 py-1 rounded">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        
        {/* Enhanced action buttons */}
        <div className="space-y-3 pt-2">
          <AddToCartButton 
            product={product}
            className="w-full btn-animate bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
            size="sm"
          />
          
          <div className="flex items-center justify-center gap-2 text-xs text-center text-muted-foreground/80">
            {product.is_customizable && (
              <div className="flex items-center gap-1 animate-fade-in">
                <Sparkles className="h-3 w-3 text-purple-500" />
                <span>Fully Customizable</span>
              </div>
            )}
            {product.is_digital && (
              <div className="flex items-center gap-1 animate-fade-in">
                <span>📱 Digital Product</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-20 animate-pulse" />
      </div>
    </div>
  );
};

export default ProductCard;
