import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProductFormProps {
  productId?: string;
  onSuccess?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productId, onSuccess }) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("0");
  const [category, setCategory] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [featured, setFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const { toast } = useToast();

  // Advanced product options
  const [allowCustomText, setAllowCustomText] = useState(false);
  const [allowCustomImage, setAllowCustomImage] = useState(false);
  const [maxTextLength, setMaxTextLength] = useState("100");
  const [maxImageCount, setMaxImageCount] = useState("1");
  const [allowResizeRotate, setAllowResizeRotate] = useState(false);

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("slug, name")
          .order("name");
          
        if (error) throw error;
        setCategories(data || []);
        
        // Set default category if available
        if (data && data.length > 0 && !category) {
          setCategory(data[0].slug);
        }
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error loading categories",
          description: error.message,
          variant: "destructive"
        });
      }
    };
    
    fetchCategories();
  }, [toast]);

  // Fetch product data if editing
  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        setIsLoading(true);
        try {
          // Fetch the product data
          const { data: productData, error: productError } = await supabase
            .from("products")
            .select("*")
            .eq("id", productId)
            .single();
            
          if (productError) throw productError;
          
          if (productData) {
            setName(productData.name || "");
            setSlug(productData.slug || "");
            setDescription(productData.description || "");
            setPrice(productData.price?.toString() || "");
            setDiscountPercentage(productData.discount_percentage?.toString() || "0");
            setCategory(productData.category || "");
            
            // Handle images array properly
            if (productData.images && Array.isArray(productData.images)) {
              setImageUrls(productData.images.map(img => String(img)));
            } else {
              setImageUrls([""]);
            }
            
            setFeatured(productData.featured || false);
            setIsNew(productData.is_new || false);
            setInStock(productData.in_stock !== false);
          }

          // Fetch customization options
          const { data: customizationData, error: customizationError } = await supabase
            .from("customization_options")
            .select("*")
            .eq("product_id", productId)
            .single();

          if (!customizationError && customizationData) {
            setAllowCustomText(customizationData.allow_text || false);
            setAllowCustomImage(customizationData.allow_image || false);
            setMaxTextLength(customizationData.max_text_length?.toString() || "100");
            setMaxImageCount(customizationData.max_image_count?.toString() || "1");
            setAllowResizeRotate(customizationData.allow_resize_rotate || false);
          }
        } catch (error: any) {
          console.error("Error fetching product:", error);
          toast({
            title: "Error loading product",
            description: error.message,
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [productId, toast]);

  // Generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    // Only auto-generate slug if it's a new product or if slug hasn't been manually edited
    if (!productId || slug === "" || slug === name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) {
      setSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  };

  // Handle image URL changes
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...imageUrls];
    newImages[index] = value;
    setImageUrls(newImages);
  };

  // Add another image URL field
  const addImageField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  // Remove an image URL field
  const removeImageField = (index: number) => {
    if (imageUrls.length > 1) {
      const newImages = [...imageUrls];
      newImages.splice(index, 1);
      setImageUrls(newImages);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !slug || !price || !category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Filter out empty image URLs
    const filteredImages = imageUrls.filter(url => url.trim() !== "");
    
    setIsSubmitting(true);

    try {
      // First handle the product data
      let productResult;
      
      const productData = {
        name,
        slug,
        description,
        price: parseFloat(price),
        discount_percentage: parseFloat(discountPercentage),
        category,
        images: filteredImages,
        featured,
        is_new: isNew,
        in_stock: inStock
      };
      
      if (productId) {
        // Update existing product
        productResult = await supabase
          .from("products")
          .update(productData)
          .eq("id", productId)
          .select()
          .single();
      } else {
        // Create new product
        productResult = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();
      }
      
      const { data: productResultData, error: productError } = productResult;
      if (productError) throw productError;
      
      // Now handle customization options
      const customizationData = {
        product_id: productResultData.id,
        allow_text: allowCustomText,
        allow_image: allowCustomImage,
        max_text_length: parseInt(maxTextLength),
        max_image_count: parseInt(maxImageCount),
        allow_resize_rotate: allowResizeRotate
      };

      // Check if customization options already exist
      const { data: existingCustomization } = await supabase
        .from("customization_options")
        .select()
        .eq("product_id", productResultData.id);
      
      if (existingCustomization && existingCustomization.length > 0) {
        // Update existing customization options
        const { error } = await supabase
          .from("customization_options")
          .update(customizationData)
          .eq("product_id", productResultData.id);
          
        if (error) throw error;
      } else {
        // Create new customization options
        const { error } = await supabase
          .from("customization_options")
          .insert(customizationData);
          
        if (error) throw error;
      }
      
      toast({
        title: productId ? "Product updated" : "Product created",
        description: `${name} has been ${productId ? "updated" : "created"} successfully.`
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (!productId) {
        // Reset form if creating a new product
        setName("");
        setSlug("");
        setDescription("");
        setPrice("");
        setDiscountPercentage("0");
        setImageUrls([""]);
        setFeatured(false);
        setIsNew(false);
        setInStock(true);
        setAllowCustomText(false);
        setAllowCustomImage(false);
        setMaxTextLength("100");
        setMaxImageCount("1");
        setAllowResizeRotate(false);
      }
    } catch (error: any) {
      console.error(`Error ${productId ? "updating" : "creating"} product:`, error);
      toast({
        title: `Error ${productId ? "updating" : "creating"} product`,
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="zyra-spinner w-12 h-12"></div>
      </div>
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => handleNameChange(e.target.value)} 
              placeholder="My Awesome Product"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input 
              id="slug" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)}
              placeholder="my-awesome-product"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Used in URLs. Only lowercase letters, numbers, and hyphens.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price * ($)</Label>
              <Input 
                id="price" 
                type="number"
                step="0.01"
                min="0"
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
                placeholder="19.99"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input 
                id="discount" 
                type="number"
                step="1"
                min="0"
                max="100"
                value={discountPercentage} 
                onChange={(e) => setDiscountPercentage(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={category} 
              onValueChange={setCategory} 
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description"
              rows={5}
            />
          </div>
          
          <div className="space-y-3">
            <Label>Product Images</Label>
            {imageUrls.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input 
                  value={url} 
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeImageField(index)}
                  disabled={imageUrls.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addImageField}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Another Image
            </Button>
          </div>
          
          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Customization Options</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allow-text" className="cursor-pointer">Allow Custom Text</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Enable customers to add personalized text</p>
              </div>
              <Switch 
                id="allow-text" 
                checked={allowCustomText}
                onCheckedChange={setAllowCustomText}
              />
            </div>
            
            {allowCustomText && (
              <div className="pl-4 border-l-2 border-gray-100 dark:border-gray-700 space-y-2">
                <Label htmlFor="max-text-length">Max Text Length</Label>
                <Input 
                  id="max-text-length" 
                  type="number"
                  min="1"
                  max="500"
                  value={maxTextLength}
                  onChange={(e) => setMaxTextLength(e.target.value)}
                  className="max-w-[150px]"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allow-image" className="cursor-pointer">Allow Custom Images</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Enable customers to upload their own images</p>
              </div>
              <Switch 
                id="allow-image" 
                checked={allowCustomImage}
                onCheckedChange={setAllowCustomImage}
              />
            </div>
            
            {allowCustomImage && (
              <div className="pl-4 border-l-2 border-gray-100 dark:border-gray-700 space-y-2">
                <Label htmlFor="max-image-count">Max Images Count</Label>
                <Input 
                  id="max-image-count" 
                  type="number"
                  min="1"
                  max="10"
                  value={maxImageCount}
                  onChange={(e) => setMaxImageCount(e.target.value)}
                  className="max-w-[150px]"
                />
              </div>
            )}
            
            {(allowCustomText || allowCustomImage) && (
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow-resize-rotate" className="cursor-pointer">Allow Resize & Rotate</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Enable customers to resize and rotate text/images</p>
                </div>
                <Switch 
                  id="allow-resize-rotate" 
                  checked={allowResizeRotate}
                  onCheckedChange={setAllowResizeRotate}
                />
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="featured" className="cursor-pointer">Featured Product</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Show on homepage and featured sections</p>
              </div>
              <Switch 
                id="featured" 
                checked={featured}
                onCheckedChange={setFeatured}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="new" className="cursor-pointer">Mark as New</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Highlight as a new arrival</p>
              </div>
              <Switch 
                id="new" 
                checked={isNew}
                onCheckedChange={setIsNew}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="stock" className="cursor-pointer">In Stock</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Product is available for purchase</p>
              </div>
              <Switch 
                id="stock" 
                checked={inStock}
                onCheckedChange={setInStock}
              />
            </div>
          </div>
          
          <div className="pt-6 pb-2 flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="bg-zyra-purple hover:bg-zyra-dark-purple">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {productId ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
