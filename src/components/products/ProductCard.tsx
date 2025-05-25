
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
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.slug}`}>
          <div className="aspect-square bg-gray-100 dark:bg-gray-700">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>No Image</span>
              </div>
            )}
          </div>
        </Link>
        
        <WishlistButton 
          productId={product.id}
          className="absolute top-2 right-2"
        />
        
        {product.is_new && (
          <Badge className="absolute top-2 left-2 bg-green-500 text-white">
            New
          </Badge>
        )}
        
        {product.discount_percentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            {product.discount_percentage}% OFF
          </Badge>
        )}
        
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) 
                    ? "text-yellow-400 fill-current" 
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
              ({product.review_count})
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <div>
            {product.discount_percentage > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <AddToCartButton 
            product={product}
            className="w-full"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
