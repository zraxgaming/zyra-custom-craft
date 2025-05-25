
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
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
    <div className="group relative bg-card rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-border hover:border-primary/20 animate-scale-in hover:scale-105">
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.slug}`}>
          <div className="aspect-square bg-muted">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground animate-pulse">
                <span>No Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
        
        <WishlistButton 
          productId={product.id}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:scale-110"
        />
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_new && (
            <Badge className="bg-green-500 text-white animate-bounce-in shadow-lg">
              New
            </Badge>
          )}
          
          {product.discount_percentage > 0 && (
            <Badge className="bg-red-500 text-white animate-pulse shadow-lg">
              {product.discount_percentage}% OFF
            </Badge>
          )}
        </div>
        
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center animate-fade-in">
            <Badge variant="destructive" className="text-lg px-4 py-2 shadow-lg">Out of Stock</Badge>
          </div>
        )}
      </div>
      
      <div className="p-5 space-y-3">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-2 story-link">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 transition-colors duration-200 ${
                  i < Math.floor(product.rating) 
                    ? "text-yellow-400 fill-current animate-pulse" 
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-2">
              ({product.review_count})
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            {product.discount_percentage > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-foreground">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <AddToCartButton 
            product={product}
            className="w-full btn-animate primary-button hover:shadow-lg transition-all duration-300"
            size="sm"
          />
          {product.is_customizable && (
            <p className="text-xs text-center text-muted-foreground animate-fade-in">
              ✨ Customizable
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
