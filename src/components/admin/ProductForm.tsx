
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, X, Package, Sparkles } from "lucide-react";

interface ProductFormProps {
  product?: any;
  onSuccess: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    short_description: product?.short_description || '',
    price: product?.price || '',
    cost_price: product?.cost_price || '',
    stock_quantity: product?.stock_quantity || '',
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    category_id: product?.category_id || '',
    weight: product?.weight || '',
    dimensions_length: product?.dimensions_length || '',
    dimensions_width: product?.dimensions_width || '',
    dimensions_height: product?.dimensions_height || '',
    meta_title: product?.meta_title || '',
    meta_description: product?.meta_description || '',
    is_featured: product?.is_featured || false,
    is_customizable: product?.is_customizable || false,
    is_digital: product?.is_digital || false,
    status: product?.status || 'draft',
    images: product?.images || []
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-generate slug when name changes
      if (field === 'name' && !product) {
        newData.slug = generateSlug(value);
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description,
        short_description: formData.short_description,
        price: parseFloat(formData.price) || 0,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        sku: formData.sku,
        barcode: formData.barcode,
        category_id: formData.category_id || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions_length: formData.dimensions_length ? parseFloat(formData.dimensions_length) : null,
        dimensions_width: formData.dimensions_width ? parseFloat(formData.dimensions_width) : null,
        dimensions_height: formData.dimensions_height ? parseFloat(formData.dimensions_height) : null,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        is_featured: formData.is_featured,
        is_customizable: formData.is_customizable,
        is_digital: formData.is_digital,
        status: formData.status,
        images: formData.images,
        in_stock: parseInt(formData.stock_quantity) > 0,
        stock_status: parseInt(formData.stock_quantity) > 0 ? 'in_stock' : 'out_of_stock',
        manage_stock: true,
        updated_at: new Date().toISOString()
      };

      let result;
      if (product) {
        // Update existing product
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)
          .select()
          .single();
      } else {
        // Create new product
        result = await supabase
          .from('products')
          .insert({
            ...productData,
            created_at: new Date().toISOString()
          })
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: "Success! 🎉",
        description: `Product ${product ? 'updated' : 'created'} successfully`,
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${product ? 'update' : 'create'} product`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <Card className="border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Package className="h-7 w-7 animate-bounce" />
            {product ? 'Edit Product' : 'Create New Product'}
            <Sparkles className="h-6 w-6 animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-purple-700 dark:text-purple-300 font-semibold text-lg">
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Amazing Custom Product"
                    className="border-2 border-purple-200 focus:border-purple-500 h-12 text-lg"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug" className="text-purple-700 dark:text-purple-300 font-semibold text-lg">
                    URL Slug
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="amazing-custom-product"
                    className="border-2 border-purple-200 focus:border-purple-500 h-12 text-lg"
                  />
                  <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                    Auto-generated from product name if left empty
                  </p>
                </div>

                <div>
                  <Label htmlFor="short_description" className="text-purple-700 dark:text-purple-300 font-semibold text-lg">
                    Short Description
                  </Label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => handleInputChange('short_description', e.target.value)}
                    placeholder="Brief product description for listings..."
                    rows={3}
                    className="border-2 border-purple-200 focus:border-purple-500 resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-purple-700 dark:text-purple-300 font-semibold text-lg">
                    Full Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detailed product description..."
                    rows={6}
                    className="border-2 border-purple-200 focus:border-purple-500 resize-none"
                  />
                </div>
              </div>

              <div className="space-y-6">
                {/* Pricing */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-purple-700 dark:text-purple-300 font-semibold text-lg">
                      Price * ($)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="99.99"
                      className="border-2 border-purple-200 focus:border-purple-500 h-12 text-lg"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost_price" className="text-purple-700 dark:text-purple-300 font-semibold text-lg">
                      Cost Price ($)
                    </Label>
                    <Input
                      id="cost_price"
                      type="number"
                      step="0.01"
                      value={formData.cost_price}
                      onChange={(e) => handleInputChange('cost_price', e.target.value)}
                      placeholder="49.99"
                      className="border-2 border-purple-200 focus:border-purple-500 h-12 text-lg"
                    />
                  </div>
                </div>

                {/* Inventory */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock_quantity" className="text-purple-700 dark:text-purple-300 font-semibold text-lg">
                      Stock Quantity
                    </Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                      placeholder="100"
                      className="border-2 border-purple-200 focus:border-purple-500 h-12 text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category_id" className="text-purple-700 dark:text-purple-300 font-semibold text-lg">
                      Category
                    </Label>
                    <select
                      id="category_id"
                      value={formData.category_id}
                      onChange={(e) => handleInputChange('category_id', e.target.value)}
                      className="w-full border-2 border-purple-200 focus:border-purple-500 h-12 text-lg rounded-md px-3 bg-white dark:bg-gray-800"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SKU & Barcode */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku" className="text-purple-700 dark:text-purple-300 font-semibold text-lg">
                      SKU
                    </Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      placeholder="PROD-001"
                      className="border-2 border-purple-200 focus:border-purple-500 h-12 text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="barcode" className="text-purple-700 dark:text-purple-300 font-semibold text-lg">
                      Barcode
                    </Label>
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) => handleInputChange('barcode', e.target.value)}
                      placeholder="123456789012"
                      className="border-2 border-purple-200 focus:border-purple-500 h-12 text-lg"
                    />
                  </div>
                </div>

                {/* Product Settings */}
                <div className="space-y-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <h3 className="font-semibold text-lg text-purple-700 dark:text-purple-300">Product Settings</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { key: 'is_featured', label: 'Featured Product', desc: 'Show in featured sections' },
                      { key: 'is_customizable', label: 'Customizable', desc: 'Allow customer customization' },
                      { key: 'is_digital', label: 'Digital Product', desc: 'No physical shipping required' }
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{label}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{desc}</div>
                        </div>
                        <Switch
                          checked={formData[key as keyof typeof formData] as boolean}
                          onCheckedChange={(checked) => handleInputChange(key, checked)}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-purple-700 dark:text-purple-300 font-semibold">
                      Status
                    </Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full border-2 border-purple-200 focus:border-purple-500 h-12 text-lg rounded-md px-3 bg-white dark:bg-gray-800 mt-1"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
                  <Upload className="h-6 w-6" />
                  Product Images
                  <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/20">
                    {formData.images.length} images
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group animate-scale-in">
                      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-purple-200 dark:border-purple-800">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addImageUrl}
                  className="w-full border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20 h-16 text-lg"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Add Image URL
                </Button>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <CardHeader>
                <CardTitle className="text-blue-700 dark:text-blue-300">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title" className="text-blue-700 dark:text-blue-300 font-semibold">
                    Meta Title
                  </Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => handleInputChange('meta_title', e.target.value)}
                    placeholder="Product Name | Zyra Custom Craft"
                    className="border-2 border-blue-200 focus:border-blue-500 h-12 text-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="meta_description" className="text-blue-700 dark:text-blue-300 font-semibold">
                    Meta Description
                  </Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    placeholder="Describe your product for search engines..."
                    rows={3}
                    className="border-2 border-blue-200 focus:border-blue-500 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-16 text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    {product ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Package className="h-6 w-6" />
                    {product ? 'Update Product' : 'Create Product'}
                    <Sparkles className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
