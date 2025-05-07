
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, Check, Image, Save, Tag, Trash2, X } from "lucide-react";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  discount_percentage: number;
  category: string;
  slug: string;
  images: string[];
  in_stock: boolean;
  featured: boolean;
  is_new: boolean;
  customization_options?: {
    allowText: boolean;
    allowImage: boolean;
    maxTextLength: number;
    maxImageCount: number;
    allowResizeRotate: boolean;
  };
}

const ProductEdit = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, user } = useAuth();
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [imageInput, setImageInput] = useState("");
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    discount_percentage: 0,
    category: "",
    slug: "",
    images: [],
    in_stock: true,
    featured: false,
    is_new: false,
    customization_options: {
      allowText: false,
      allowImage: false,
      maxTextLength: 100,
      maxImageCount: 1,
      allowResizeRotate: false
    }
  });
  
  // Redirect if not admin
  useEffect(() => {
    if (user && !isAdmin) {
      navigate("/");
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    }
  }, [isAdmin, user, navigate, toast]);
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("id, name")
          .order("name");
          
        if (error) throw error;
        setCategories(data || []);
      } catch (error: any) {
        console.error("Error fetching categories:", error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          
          // Fetch product
          const { data: product, error: productError } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();
            
          if (productError) throw productError;
          
          // Fetch customization options
          const { data: customization, error: customizationError } = await supabase
            .from("customization_options")
            .select("*")
            .eq("product_id", id)
            .maybeSingle();
            
          if (customizationError && customizationError.code !== 'PGRST116') {
            throw customizationError;
          }
          
          // Update form data
          setFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price || 0,
            discount_percentage: product.discount_percentage || 0,
            category: product.category || "",
            slug: product.slug || "",
            images: product.images || [],
            in_stock: product.in_stock ?? true,
            featured: product.featured ?? false,
            is_new: product.is_new ?? false,
            customization_options: customization ? {
              allowText: customization.allow_text || false,
              allowImage: customization.allow_image || false,
              maxTextLength: customization.max_text_length || 100,
              maxImageCount: customization.max_image_count || 1,
              allowResizeRotate: customization.allow_resize_rotate || false
            } : {
              allowText: false,
              allowImage: false,
              maxTextLength: 100,
              maxImageCount: 1,
              allowResizeRotate: false
            }
          });
          
        } catch (error: any) {
          console.error("Error fetching product:", error);
          toast({
            title: "Error",
            description: "Failed to load product data. Please try again.",
            variant: "destructive",
          });
          navigate("/admin/products");
        } finally {
          setLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [id, isEditMode, navigate, toast]);
  
  // Handle form input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value
    }));
    
    // Auto-generate slug from name if slug field is empty
    if (name === "name" && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      
      setFormData(prev => ({ ...prev, slug }));
    }
  };
  
  // Handle boolean toggle
  const handleToggle = (name: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle customization options change
  const handleCustomizationChange = (name: string, value: boolean | number) => {
    setFormData(prev => ({
      ...prev,
      customization_options: {
        ...prev.customization_options!,
        [name]: value
      }
    }));
  };
  
  // Add image URL to images array
  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageInput.trim()]
    }));
    
    setImageInput("");
  };
  
  // Remove image from images array
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  // Save product
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validate required fields
      if (!formData.name || !formData.category || !formData.slug || formData.price <= 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields and ensure price is greater than zero.",
          variant: "destructive",
        });
        return;
      }
      
      let productId: string;
      
      if (isEditMode && id) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            discount_percentage: formData.discount_percentage,
            category: formData.category,
            slug: formData.slug,
            images: formData.images,
            in_stock: formData.in_stock,
            featured: formData.featured,
            is_new: formData.is_new
          })
          .eq("id", id);
          
        if (error) throw error;
        productId = id;
        
      } else {
        // Create new product
        const { data, error } = await supabase
          .from("products")
          .insert({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            discount_percentage: formData.discount_percentage,
            category: formData.category,
            slug: formData.slug,
            images: formData.images,
            in_stock: formData.in_stock,
            featured: formData.featured,
            is_new: formData.is_new
          })
          .select()
          .single();
          
        if (error) throw error;
        productId = data.id;
      }
      
      // Handle customization options
      if (formData.customization_options) {
        // Check if customization options exist for this product
        const { data, error } = await supabase
          .from("customization_options")
          .select("id")
          .eq("product_id", productId)
          .maybeSingle();
          
        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          // Update existing options
          await supabase
            .from("customization_options")
            .update({
              allow_text: formData.customization_options.allowText,
              allow_image: formData.customization_options.allowImage,
              max_text_length: formData.customization_options.maxTextLength,
              max_image_count: formData.customization_options.maxImageCount,
              allow_resize_rotate: formData.customization_options.allowResizeRotate
            })
            .eq("id", data.id);
        } else {
          // Create new options
          await supabase
            .from("customization_options")
            .insert({
              product_id: productId,
              allow_text: formData.customization_options.allowText,
              allow_image: formData.customization_options.allowImage,
              max_text_length: formData.customization_options.maxTextLength,
              max_image_count: formData.customization_options.maxImageCount,
              allow_resize_rotate: formData.customization_options.allowResizeRotate
            });
        }
      }
      
      // Show success message
      toast({
        title: isEditMode ? "Product Updated" : "Product Created",
        description: isEditMode 
          ? "Your product has been updated successfully." 
          : "Your product has been created successfully.",
      });
      
      // Redirect back to products list
      navigate("/admin/products");
      
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (!user) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate("/admin/products")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h1>
          </div>
          <Button 
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Product"}
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="customization">Customization Options</TabsTrigger>
                </TabsList>
                
                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Product Name *</Label>
                          <Input 
                            id="name" 
                            name="name"
                            value={formData.name} 
                            onChange={handleChange}
                            placeholder="Enter product name"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="slug">Slug *</Label>
                          <Input 
                            id="slug" 
                            name="slug"
                            value={formData.slug} 
                            onChange={handleChange}
                            placeholder="product-url-slug"
                            required
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            URL-friendly version of the name. Used in product URLs.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="price">Price ($) *</Label>
                            <Input 
                              id="price" 
                              name="price"
                              type="number"
                              min="0"
                              step="0.01"
                              value={formData.price} 
                              onChange={handleChange}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="discount_percentage">Discount (%)</Label>
                            <Input 
                              id="discount_percentage" 
                              name="discount_percentage"
                              type="number"
                              min="0"
                              max="100"
                              value={formData.discount_percentage} 
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="category">Category *</Label>
                          {categories.length > 0 ? (
                            <select
                              id="category"
                              name="category"
                              value={formData.category}
                              onChange={handleChange}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              required
                            >
                              <option value="">Select a category</option>
                              {categories.map(category => (
                                <option key={category.id} value={category.name}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <Input
                              id="category"
                              name="category"
                              value={formData.category}
                              onChange={handleChange}
                              placeholder="Enter category"
                              required
                            />
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter product description"
                            rows={6}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="in_stock" 
                              checked={formData.in_stock}
                              onCheckedChange={(checked) => handleToggle("in_stock", checked)}
                            />
                            <Label htmlFor="in_stock">In Stock</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="featured" 
                              checked={formData.featured}
                              onCheckedChange={(checked) => handleToggle("featured", checked)}
                            />
                            <Label htmlFor="featured">Featured Product</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="is_new" 
                              checked={formData.is_new}
                              onCheckedChange={(checked) => handleToggle("is_new", checked)}
                            />
                            <Label htmlFor="is_new">New Product</Label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Images Tab */}
                <TabsContent value="images" className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="image_url">Add Image URL</Label>
                          <div className="flex gap-2">
                            <Input
                              id="image_url"
                              value={imageInput}
                              onChange={(e) => setImageInput(e.target.value)}
                              placeholder="https://example.com/image.jpg"
                              className="flex-1"
                            />
                            <Button 
                              onClick={handleAddImage}
                              disabled={!imageInput.trim()}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Product Images</Label>
                          
                          {formData.images.length === 0 ? (
                            <div className="border border-dashed rounded-lg p-8 text-center">
                              <Image className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">No images added yet</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Add image URLs above to display your product
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {formData.images.map((url, index) => (
                                <div 
                                  key={index}
                                  className="relative border rounded-lg overflow-hidden aspect-square bg-muted"
                                >
                                  <img 
                                    src={url} 
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                                    }}
                                  />
                                  <Button 
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                    onClick={() => handleRemoveImage(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {formData.images.length > 0 && (
                          <div className="pt-2">
                            <p className="text-sm text-muted-foreground">
                              The first image will be used as the main product image.
                              Drag and drop to reorder images.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Customization Options Tab */}
                <TabsContent value="customization" className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="allowText" 
                              checked={formData.customization_options?.allowText ?? false}
                              onCheckedChange={(checked) => handleCustomizationChange("allowText", checked)}
                            />
                            <Label htmlFor="allowText">Allow Text Customization</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="allowImage" 
                              checked={formData.customization_options?.allowImage ?? false}
                              onCheckedChange={(checked) => handleCustomizationChange("allowImage", checked)}
                            />
                            <Label htmlFor="allowImage">Allow Image Upload</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="allowResizeRotate" 
                              checked={formData.customization_options?.allowResizeRotate ?? false}
                              onCheckedChange={(checked) => handleCustomizationChange("allowResizeRotate", checked)}
                            />
                            <Label htmlFor="allowResizeRotate">Allow Resize & Rotate</Label>
                          </div>
                        </div>
                        
                        {formData.customization_options?.allowText && (
                          <div>
                            <Label htmlFor="maxTextLength">Maximum Text Length</Label>
                            <Input 
                              id="maxTextLength" 
                              type="number"
                              min="1"
                              value={formData.customization_options?.maxTextLength || 100} 
                              onChange={(e) => handleCustomizationChange("maxTextLength", parseInt(e.target.value))}
                            />
                          </div>
                        )}
                        
                        {formData.customization_options?.allowImage && (
                          <div>
                            <Label htmlFor="maxImageCount">Maximum Image Count</Label>
                            <Input 
                              id="maxImageCount" 
                              type="number"
                              min="1"
                              value={formData.customization_options?.maxImageCount || 1} 
                              onChange={(e) => handleCustomizationChange("maxImageCount", parseInt(e.target.value))}
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Preview Card */}
            <div>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">Product Preview</h3>
                  
                  <div className="space-y-4">
                    <div className="aspect-square bg-muted rounded-md overflow-hidden">
                      {formData.images && formData.images[0] ? (
                        <img 
                          src={formData.images[0]} 
                          alt={formData.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium">{formData.name || "Product Name"}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {formData.description || "Product description will appear here."}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <p className="font-medium">${formData.price.toFixed(2)}</p>
                      {formData.discount_percentage > 0 && (
                        <p className="text-sm text-muted-foreground line-through">
                          ${(formData.price / (1 - formData.discount_percentage / 100)).toFixed(2)}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.category && (
                        <div className="bg-muted px-2 py-1 rounded-full text-xs">
                          <Tag className="h-3 w-3 inline mr-1" />
                          {formData.category}
                        </div>
                      )}
                      
                      {formData.in_stock && (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          <Check className="h-3 w-3 inline mr-1" />
                          In Stock
                        </div>
                      )}
                      
                      {formData.is_new && (
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          New
                        </div>
                      )}
                    </div>
                    
                    {(formData.customization_options?.allowText || formData.customization_options?.allowImage) && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium mb-2">Customization Options:</h4>
                        <ul className="text-xs space-y-1">
                          {formData.customization_options?.allowText && (
                            <li className="flex items-center gap-1">
                              <Check className="h-3 w-3 text-green-600" />
                              Text customization
                            </li>
                          )}
                          {formData.customization_options?.allowImage && (
                            <li className="flex items-center gap-1">
                              <Check className="h-3 w-3 text-green-600" />
                              Image upload
                            </li>
                          )}
                          {formData.customization_options?.allowResizeRotate && (
                            <li className="flex items-center gap-1">
                              <Check className="h-3 w-3 text-green-600" />
                              Resize and rotate
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductEdit;
