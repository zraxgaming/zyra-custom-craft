
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload,
  Eye,
  Search,
  Filter,
  Star
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  is_customizable: boolean;
  customization_options: any;
  is_published: boolean;
  stock_quantity: number;
  rating: number;
  review_count: number;
  created_at: string;
}

const AdminProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    images: [""],
    category: "",
    is_customizable: false,
    customization_options: {},
    is_published: true,
    stock_quantity: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.description || newProduct.price <= 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .insert({
          ...newProduct,
          slug: newProduct.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          images: newProduct.images.filter(img => img.trim() !== "")
        })
        .select()
        .single();

      if (error) throw error;

      setProducts([data, ...products]);
      setIsCreating(false);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        images: [""],
        category: "",
        is_customizable: false,
        customization_options: {},
        is_published: true,
        stock_quantity: 0
      });

      toast({
        title: "Success",
        description: "Product created successfully",
      });
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          images: editingProduct.images.filter(img => img.trim() !== ""),
          category: editingProduct.category,
          is_customizable: editingProduct.is_customizable,
          customization_options: editingProduct.customization_options,
          is_published: editingProduct.is_published,
          stock_quantity: editingProduct.stock_quantity,
          slug: editingProduct.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);

      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const addImageField = (isEditing = false) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: [...editingProduct.images, ""]
      });
    } else {
      setNewProduct({
        ...newProduct,
        images: [...newProduct.images, ""]
      });
    }
  };

  const updateImageField = (index: number, value: string, isEditing = false) => {
    if (isEditing && editingProduct) {
      const newImages = [...editingProduct.images];
      newImages[index] = value;
      setEditingProduct({
        ...editingProduct,
        images: newImages
      });
    } else {
      const newImages = [...newProduct.images];
      newImages[index] = value;
      setNewProduct({
        ...newProduct,
        images: newImages
      });
    }
  };

  const removeImageField = (index: number, isEditing = false) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: editingProduct.images.filter((_, i) => i !== index)
      });
    } else {
      setNewProduct({
        ...newProduct,
        images: newProduct.images.filter((_, i) => i !== index)
      });
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "" || product.category === selectedCategory)
  );

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Products Management</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Products Management</h1>
          </div>
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="animate-slide-in-up">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-10 px-3 border border-input bg-background rounded-md"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Product Form */}
        {isCreating && (
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Product
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    placeholder="Enter category"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock_quantity}
                    onChange={(e) => setNewProduct({...newProduct, stock_quantity: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label>Product Images</Label>
                {newProduct.images.map((image, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={image}
                      onChange={(e) => updateImageField(index, e.target.value)}
                      placeholder="Image URL"
                    />
                    {newProduct.images.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeImageField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addImageField()}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Image
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="customizable"
                  checked={newProduct.is_customizable}
                  onChange={(e) => setNewProduct({...newProduct, is_customizable: e.target.checked})}
                />
                <Label htmlFor="customizable">This product can be customized</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateProduct} className="bg-green-600 hover:bg-green-700">
                  <Save className="mr-2 h-4 w-4" />
                  Create Product
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <Card 
              key={product.id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in"
              style={{animationDelay: `${index * 50}ms`}}
            >
              {editingProduct?.id === product.id ? (
                // Edit Form
                <CardContent className="p-4 space-y-3">
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    placeholder="Product name"
                  />
                  <Textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    placeholder="Description"
                    rows={2}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                    placeholder="Price"
                  />
                  <Input
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    placeholder="Category"
                  />
                  
                  <div>
                    <Label className="text-xs">Images</Label>
                    {editingProduct.images.map((image, index) => (
                      <div key={index} className="flex gap-1 mb-1">
                        <Input
                          value={image}
                          onChange={(e) => updateImageField(index, e.target.value, true)}
                          placeholder="Image URL"
                          className="text-xs"
                        />
                        {editingProduct.images.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeImageField(index, true)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addImageField(true)}
                      className="w-full h-8 text-xs"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add Image
                    </Button>
                  </div>

                  <div className="flex gap-1">
                    <Button 
                      onClick={handleUpdateProduct}
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Save className="mr-1 h-3 w-3" />
                      Save
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingProduct(null)}
                      size="sm"
                      className="flex-1"
                    >
                      <X className="mr-1 h-3 w-3" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              ) : (
                // Display Product
                <>
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 overflow-hidden relative">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-16 w-16 text-purple-400" />
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge 
                        variant={product.is_published ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {product.is_published ? "Live" : "Draft"}
                      </Badge>
                    </div>

                    {product.is_customizable && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="outline" className="text-xs bg-white/90">
                          Custom
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-sm line-clamp-2 hover:text-purple-600 transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-purple-600">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{product.rating}</span>
                            <span className="text-xs text-muted-foreground">
                              ({product.review_count})
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>Stock: {product.stock_quantity}</span>
                        {product.category && (
                          <>
                            <span>•</span>
                            <span>{product.category}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex gap-1 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingProduct(product)}
                          className="flex-1 hover:bg-blue-50"
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <Card className="animate-fade-in">
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory ? 'Try adjusting your search criteria' : 'Start by creating your first product'}
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
