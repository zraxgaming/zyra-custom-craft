
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Update the ProductCard component to handle the Supabase database fields
interface ProductCardProps {
  product: any; // Using any since the Supabase schema may differ from our type definition
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card group animate-fade-in">
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.slug}`}>
          <img
            src={product.images?.[0] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <button
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart className="h-4 w-4 text-gray-600" />
        </button>
        {product.is_new && (
          <Badge className="absolute top-3 left-3 bg-zyra-purple text-white">
            New
          </Badge>
        )}
        {product.discount_percentage > 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white">
            {product.discount_percentage}% OFF
          </Badge>
        )}
      </div>
      <div className="p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-lg font-medium text-gray-900 hover:text-zyra-purple transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center mt-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${
                  i < (product.rating || 0) ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-600 ml-1">
              ({product.review_count || 0})
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div>
            {product.discount_percentage > 0 ? (
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-900">
                  ${(product.price * (1 - product.discount_percentage / 100)).toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-semibold text-gray-900">
                ${product.price?.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button asChild className="flex-1 bg-zyra-purple hover:bg-zyra-dark-purple text-white">
            <Link to={`/products/${product.slug}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
