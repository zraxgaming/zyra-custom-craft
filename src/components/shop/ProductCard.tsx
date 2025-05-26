
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  rating?: number;
  review_count?: number;
  is_new?: boolean;
  discount_percentage?: number;
  in_stock: boolean;
  slug: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountedPrice = product.discount_percentage 
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden hover:scale-[1.02] animate-fade-in">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <div className="aspect-square overflow-hidden">
            <img
              src={product.images?.[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_new && (
            <Badge className="bg-green-500 hover:bg-green-600 animate-pulse">New</Badge>
          )}
          {product.discount_percentage && product.discount_percentage > 0 && (
            <Badge variant="destructive" className="animate-bounce">-{product.discount_percentage}%</Badge>
          )}
          {!product.in_stock && (
            <Badge variant="secondary">Out of Stock</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-2 right-2">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background hover:scale-110 transition-all duration-200"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating!)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
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
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-primary">
            ${discountedPrice.toFixed(2)}
          </span>
          {product.discount_percentage && product.discount_percentage > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton 
          product={product}
          className="w-full hover:scale-105 transition-transform duration-200"
        />
      </CardContent>
    </Card>
  );
};

export default ProductCard;
