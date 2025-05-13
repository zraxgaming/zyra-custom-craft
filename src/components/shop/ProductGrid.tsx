
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
  in_stock: boolean;
  is_new: boolean;
  discount_percentage: number;
  rating: number;
}

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-gray-100 animate-pulse" />
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No products found</h3>
        <p className="text-gray-600 mb-6">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <Link to={`/products/${product.slug}`} className="block">
            <div className="aspect-square relative">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              {!product.in_stock && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <span className="bg-white text-black font-medium px-3 py-1 rounded-md">
                    Out of Stock
                  </span>
                </div>
              )}
              {product.is_new && (
                <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
                  New
                </span>
              )}
              {product.discount_percentage > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                  {product.discount_percentage}% OFF
                </span>
              )}
            </div>
          </Link>
          <CardContent className="p-4">
            <Link to={`/products/${product.slug}`} className="block">
              <h3 className="font-medium text-lg mb-1 line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {product.discount_percentage > 0 ? (
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">
                      $
                      {(
                        product.price *
                        (1 - product.discount_percentage / 100)
                      ).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="font-semibold">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm ml-1">
                  {product.rating ? product.rating.toFixed(1) : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-4 pb-4 pt-0">
            <Link
              to={`/products/${product.slug}`}
              className="w-full"
            >
              <Button
                variant="outline"
                className="w-full"
                disabled={!product.in_stock}
              >
                View Details
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
