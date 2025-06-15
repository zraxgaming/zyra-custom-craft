import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product as ProductType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState("");
  const { addItemToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      setProduct(data);
    } catch (error: any) {
      console.error("Error fetching product:", error.message);
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = () => {
    if (!product) {
      toast({
        title: "Error",
        description: "Product not loaded",
        variant: "destructive",
      });
      return;
    }

    addItemToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image_url: product.images?.[0] || "",
      customization: customization,
    });

    toast({
      title: "Success",
      description: `${quantity} ${product.name} added to cart`,
    });
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Fix: images should be array of string (was string)
  const images: string[] = Array.isArray(product.images)
    ? product.images
    : product.images ? [product.images] : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <img
              src={images[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full rounded-lg shadow-md"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
            <p className="text-muted-foreground">{product.description}</p>

            <div className="flex items-center space-x-2">
              <span className="text-2xl font-semibold">${product.price}</span>
              {product.discount && (
                <Badge variant="secondary">
                  {product.discount}% off
                </Badge>
              )}
            </div>

            <Separator />

            {/* Quantity Selection */}
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center space-x-4 mt-2">
                <Slider
                  id="quantity"
                  defaultValue={[1]}
                  max={10}
                  step={1}
                  onValueChange={(value) => setQuantity(value[0])}
                />
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>

            {/* Customization */}
            <div>
              <Label htmlFor="customization">Customization</Label>
              <Input
                id="customization"
                value={customization}
                onChange={(e) => setCustomization(e.target.value)}
                placeholder="Enter your customization request"
              />
            </div>

            {/* Add to Cart Button */}
            <Button onClick={handleAddToCart} className="w-full flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>

            <Separator />

            {/* Reviews Section */}
            <div>
              <h2 className="text-xl font-semibold">Reviews</h2>
              {/* Implement reviews here */}
              <p className="text-muted-foreground">No reviews yet.</p>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Product;
