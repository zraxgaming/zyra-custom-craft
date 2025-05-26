
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Eye, Palette, Package } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import ProductCustomizer from "./ProductCustomizer";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    navigate(`/products/${product.slug}`);
  };

  const discountedPrice = product.discount_percentage 
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-card/80 to-card border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      <div className="relative overflow-hidden">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-muted/30">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay with quick actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleViewProduct}
              className="bg-white/90 hover:bg-white text-black hover:scale-105 transition-all duration-300"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {product.is_customizable && (
              <ProductCustomizer
                productId={product.id}
                trigger={
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/90 hover:bg-white text-black hover:scale-105 transition-all duration-300"
                  >
                    <Palette className="h-4 w-4 mr-1" />
                    Customize
                  </Button>
                }
              />
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_new && (
            <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white animate-pulse">
              New
            </Badge>
          )}
          {product.discount_percentage && product.discount_percentage > 0 && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
              -{product.discount_percentage}%
            </Badge>
          )}
          {!product.in_stock && (
            <Badge variant="destructive" className="animate-pulse">
              Out of Stock
            </Badge>
          )}
          {product.is_customizable && (
            <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              <Palette className="h-3 w-3 mr-1" />
              Custom
            </Badge>
          )}
          {product.is_digital && (
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
              Digital
            </Badge>
          )}
        </div>

        {/* Stock indicator */}
        <div className="absolute top-3 right-3">
          {product.in_stock ? (
            <div className="flex items-center gap-1 bg-green-500/90 text-white px-2 py-1 rounded-full text-xs">
              <Package className="h-3 w-3" />
              {product.stock_quantity || 0}
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-red-500/90 text-white px-2 py-1 rounded-full text-xs">
              <Package className="h-3 w-3" />
              0
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Product Name */}
        <h3 
          className="font-semibold text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors duration-300"
          onClick={handleViewProduct}
        >
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating!)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.review_count || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">
            ${discountedPrice.toFixed(2)}
          </span>
          {product.discount_percentage && product.discount_percentage > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <div className="pt-2">
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: discountedPrice,
              images: product.images
            }}
            inStock={product.in_stock}
            disabled={!product.in_stock}
            className={`w-full transition-all duration-300 ${
              product.in_stock 
                ? 'hover:scale-105 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90' 
                : 'opacity-50 cursor-not-allowed'
            }`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
