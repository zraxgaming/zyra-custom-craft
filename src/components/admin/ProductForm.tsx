
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Upload, Image as ImageIcon, X, Plus } from "lucide-react";

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    short_description: product?.short_description || '',
    price: product?.price?.toString() || '',
    cost_price: product?.cost_price?.toString() || '',
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    stock_quantity: product?.stock_quantity?.toString() || '0',
    category: product?.category || '',
    weight: product?.weight?.toString() || '',
    dimensions_length: product?.dimensions_length?.toString() || '',
    dimensions_width: product?.dimensions_width?.toString() || '',
    dimensions_height: product?.dimensions_height?.toString() || '',
    meta_title: product?.meta_title || '',
    meta_description: product?.meta_description || '',
    is_featured: product?.is_featured || false,
    is_customizable: product?.is_customizable || false,
    is_digital: product?.is_digital || false,
    manage_stock: product?.manage_stock || true,
    status: product?.status || 'draft'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        short_description: formData.short_description,
        price: parseFloat(formData.price),
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        sku: formData.sku,
        barcode: formData.barcode,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        category: formData.category,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions_length: formData.dimensions_length ? parseFloat(formData.dimensions_length) : null,
        dimensions_width: formData.dimensions_width ? parseFloat(formData.dimensions_width) : null,
        dimensions_height: formData.dimensions_height ? parseFloat(formData.dimensions_height) : null,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        is_featured: formData.is_featured,
        is_customizable: formData.is_customizable,
        is_digital: formData.is_digital,
        manage_stock: formData.manage_stock,
        status: formData.status,
        images: images,
        in_stock: parseInt(formData.stock_quantity) > 0,
        stock_status: parseInt(formData.stock_quantity) > 0 ? 'in_stock' : 'out_of_stock'
      };

      let result;
      if (product) {
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-text-glow">
            {product ? 'Edit Product' : 'Create New Product'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 animate-slide-in-left">
                <Label htmlFor="name" className="text-lg font-semibold">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="h-12 text-lg border-2 focus:border-purple-500 transition-all duration-300 hover:shadow-lg"
                />
              </div>
              <div className="space-y-2 animate-slide-in-right">
                <Label htmlFor="slug" className="text-lg font-semibold">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="Auto-generated from name"
                  className="h-12 text-lg border-2 focus:border-purple-500 transition-all duration-300 hover:shadow-lg"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="short_description" className="text-lg font-semibold">Short Description</Label>
                <Textarea
                  id="short_description"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  rows={2}
                  className="text-lg border-2 focus:border-purple-500 transition-all duration-300 hover:shadow-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-semibold">Full Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="text-lg border-2 focus:border-purple-500 transition-all duration-300 hover:shadow-lg"
                />
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-4 animate-scale-in">
              <Label className="text-lg font-semibold flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Product Images
              </Label>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                    className="h-12 text-lg border-2 focus:border-purple-500 transition-all duration-300"
                  />
                  <Button 
                    type="button" 
                    onClick={addImage}
                    className="h-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {images.map((url, index) => (
                      <div key={index} className="relative group animate-scale-in border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                        <img 
                          src={url} 
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2 animate-slide-in-up">
                <Label htmlFor="price" className="text-lg font-semibold">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="h-12 text-lg border-2 focus:border-green-500 transition-all duration-300 hover:shadow-lg"
                />
              </div>
              <div className="space-y-2 animate-slide-in-up" style={{animationDelay: '0.1s'}}>
                <Label htmlFor="cost_price" className="text-lg font-semibold">Cost Price</Label>
                <Input
                  id="cost_price"
                  name="cost_price"
                  type="number"
                  step="0.01"
                  value={formData.cost_price}
                  onChange={handleInputChange}
                  className="h-12 text-lg border-2 focus:border-green-500 transition-all duration-300 hover:shadow-lg"
                />
              </div>
              <div className="space-y-2 animate-slide-in-up" style={{animationDelay: '0.2s'}}>
                <Label htmlFor="stock_quantity" className="text-lg font-semibold">Stock Quantity</Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  className="h-12 text-lg border-2 focus:border-blue-500 transition-all duration-300 hover:shadow-lg"
                />
              </div>
              <div className="space-y-2 animate-slide-in-up" style={{animationDelay: '0.3s'}}>
                <Label htmlFor="sku" className="text-lg font-semibold">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="h-12 text-lg border-2 focus:border-purple-500 transition-all duration-300 hover:shadow-lg"
                />
              </div>
            </div>

            {/* Product Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400">Product Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:shadow-lg transition-all duration-300">
                    <Label htmlFor="is_featured" className="text-lg font-medium">Featured Product</Label>
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleSwitchChange('is_featured', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:shadow-lg transition-all duration-300">
                    <Label htmlFor="is_customizable" className="text-lg font-medium">Customizable</Label>
                    <Switch
                      id="is_customizable"
                      checked={formData.is_customizable}
                      onCheckedChange={(checked) => handleSwitchChange('is_customizable', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:shadow-lg transition-all duration-300">
                    <Label htmlFor="is_digital" className="text-lg font-medium">Digital Product</Label>
                    <Switch
                      id="is_digital"
                      checked={formData.is_digital}
                      onCheckedChange={(checked) => handleSwitchChange('is_digital', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400">Status & Category</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-lg font-semibold">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleSwitchChange('status', value)}>
                      <SelectTrigger className="h-12 text-lg border-2 focus:border-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-lg font-semibold">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="h-12 text-lg border-2 focus:border-purple-500 transition-all duration-300 hover:shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8 animate-bounce-in">
              <Button 
                type="submit" 
                disabled={loading}
                className="h-16 px-12 text-xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl rounded-2xl"
              >
                {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
