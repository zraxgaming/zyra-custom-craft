import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, X } from "lucide-react";

interface ProductFormProps {
  productId?: string;
  onSuccess?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    price: "",
    cost_price: "",
    sku: "",
    barcode: "",
    category: "",
    stock_quantity: "",
    manage_stock: true,
    is_customizable: false,
    is_digital: false,
    is_featured: false,
    status: "draft",
    images: [] as string[],
    weight: "",
    dimensions_length: "",
    dimensions_width: "",
    dimensions_height: "",
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!productId);
  const [imageInput, setImageInput] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) throw error;

      if (data) {
        // Convert images JSON to string array safely
        const imagesArray = Array.isArray(data.images) 
          ? data.images.filter(img => typeof img === 'string') as string[]
          : [];

        setFormData({
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          short_description: data.short_description || "",
          price: data.price?.toString() || "",
          cost_price: data.cost_price?.toString() || "",
          sku: data.sku || "",
          barcode: data.barcode || "",
          category: data.category || "",
          stock_quantity: data.stock_quantity?.toString() || "",
          manage_stock: data.manage_stock ?? true,
          is_customizable: data.is_customizable ?? false,
          is_digital: data.is_digital ?? false,
          is_featured: data.is_featured ?? false,
          status: data.status || "draft",
          images: imagesArray,
          weight: data.weight?.toString() || "",
          dimensions_length: data.dimensions_length?.toString() || "",
          dimensions_width: data.dimensions_width?.toString() || "",
          dimensions_height: data.dimensions_height?.toString() || "",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error fetching product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: generateSlug(value)
    }));
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput("");
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        short_description: formData.short_description,
        price: parseFloat(formData.price),
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        sku: formData.sku,
        barcode: formData.barcode,
        category: formData.category,
        stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : 0,
        manage_stock: formData.manage_stock,
        is_customizable: formData.is_customizable,
        is_digital: formData.is_digital,
        is_featured: formData.is_featured,
        status: formData.status,
        images: formData.images,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions_length: formData.dimensions_length ? parseFloat(formData.dimensions_length) : null,
        dimensions_width: formData.dimensions_width ? parseFloat(formData.dimensions_width) : null,
        dimensions_height: formData.dimensions_height ? parseFloat(formData.dimensions_height) : null,
        in_stock: formData.stock_quantity ? parseInt(formData.stock_quantity) > 0 : true,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (productId) {
        result = await supabase
          .from("products")
          .update(productData)
          .eq("id", productId)
          .select()
          .single();
      } else {
        result = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: productId ? "Product updated" : "Product created",
        description: `${formData.name} has been ${productId ? 'updated' : 'created'} successfully.`
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: productId ? "Error updating product" : "Error creating product",
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="product-slug"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Input
              id="short_description"
              value={formData.short_description}
              onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
              placeholder="Brief product description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed product description"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cost_price">Cost Price</Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) => setFormData(prev => ({ ...prev, cost_price: e.target.value }))}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="Product SKU"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                placeholder="Product barcode"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories & Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Manage Stock</Label>
                <p className="text-sm text-muted-foreground">Track inventory for this product</p>
              </div>
              <Switch
                checked={formData.manage_stock}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, manage_stock: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Customizable</Label>
                <p className="text-sm text-muted-foreground">Allow customers to customize this product</p>
              </div>
              <Switch
                checked={formData.is_customizable}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_customizable: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Digital Product</Label>
                <p className="text-sm text-muted-foreground">This is a digital/downloadable product</p>
              </div>
              <Switch
                checked={formData.is_digital}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_digital: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Featured</Label>
                <p className="text-sm text-muted-foreground">Feature this product on the homepage</p>
              </div>
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1"
            />
            <Button type="button" onClick={addImage} disabled={!imageInput.trim()}>
              <Upload className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!formData.is_digital && (
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dimensions_length">Length (cm)</Label>
                <Input
                  id="dimensions_length"
                  type="number"
                  step="0.01"
                  value={formData.dimensions_length}
                  onChange={(e) => setFormData(prev => ({ ...prev, dimensions_length: e.target.value }))}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensions_width">Width (cm)</Label>
                <Input
                  id="dimensions_width"
                  type="number"
                  step="0.01"
                  value={formData.dimensions_width}
                  onChange={(e) => setFormData(prev => ({ ...prev, dimensions_width: e.target.value }))}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensions_height">Height (cm)</Label>
                <Input
                  id="dimensions_height"
                  type="number"
                  step="0.01"
                  value={formData.dimensions_height}
                  onChange={(e) => setFormData(prev => ({ ...prev, dimensions_height: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {productId ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
