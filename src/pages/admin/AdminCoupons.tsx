
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Tag, Percent, DollarSign, Gift, Copy, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

interface Coupon {
  id: string;
  code: string;
  discount_type: "fixed" | "percentage";
  discount_value: number;
  min_purchase: number;
  max_uses: number;
  used_count: number;
  starts_at: string;
  expires_at: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage' as 'fixed' | 'percentage',
    discount_value: 0,
    min_purchase: 0,
    max_uses: 0,
    starts_at: '',
    expires_at: '',
    active: true
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast({
        title: "Error",
        description: "Failed to load coupons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const couponData = {
        ...formData,
        code: formData.code || generateCouponCode(),
        updated_at: new Date().toISOString()
      };

      if (editingId) {
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Coupon updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert([{
            ...couponData,
            created_at: new Date().toISOString(),
            used_count: 0
          }]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Coupon created successfully",
        });
      }

      resetForm();
      fetchCoupons();
    } catch (error: any) {
      console.error('Error saving coupon:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save coupon",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_purchase: coupon.min_purchase,
      max_uses: coupon.max_uses,
      starts_at: coupon.starts_at ? new Date(coupon.starts_at).toISOString().slice(0, 16) : '',
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().slice(0, 16) : '',
      active: coupon.active
    });
    setEditingId(coupon.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Coupon deleted successfully",
      });
      
      fetchCoupons();
    } catch (error: any) {
      console.error('Error deleting coupon:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete coupon",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_purchase: 0,
      max_uses: 0,
      starts_at: '',
      expires_at: '',
      active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const toggleCouponStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ 
          active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      fetchCoupons();
      toast({
        title: "Success",
        description: `Coupon ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      console.error('Error updating coupon status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update coupon status",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Coupon code copied to clipboard",
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const isUsedUp = (coupon: Coupon) => {
    return coupon.max_uses > 0 && coupon.used_count >= coupon.max_uses;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg animate-pulse">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold animate-slide-in-left">Coupons Management</h1>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="animate-slide-in-right hover:scale-105 transition-transform"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Coupon
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="animate-scale-in border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Coupons</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {coupons.filter(c => c.active && !isExpired(c.expires_at) && !isUsedUp(c)).length}
                  </p>
                </div>
                <Eye className="h-12 w-12 text-green-500 animate-bounce" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Coupons</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{coupons.length}</p>
                </div>
                <Tag className="h-12 w-12 text-blue-500 animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Uses</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {coupons.reduce((sum, coupon) => sum + coupon.used_count, 0)}
                  </p>
                </div>
                <Gift className="h-12 w-12 text-purple-500 animate-bounce" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in border-0 shadow-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Expired</p>
                  <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                    {coupons.filter(c => isExpired(c.expires_at)).length}
                  </p>
                </div>
                <EyeOff className="h-12 w-12 text-red-500 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>

        {showForm && (
          <Card className="animate-scale-in border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                {editingId ? 'Edit Coupon' : 'Add New Coupon'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Coupon Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                        placeholder="Enter coupon code"
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormData({...formData, code: generateCouponCode()})}
                        className="hover:scale-105 transition-transform"
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="discount_type">Discount Type</Label>
                    <Select
                      value={formData.discount_type}
                      onValueChange={(value: 'fixed' | 'percentage') => setFormData({...formData, discount_type: value})}
                    >
                      <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">
                          <div className="flex items-center gap-2">
                            <Percent className="h-4 w-4" />
                            Percentage
                          </div>
                        </SelectItem>
                        <SelectItem value="fixed">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Fixed Amount
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="discount_value">
                      Discount Value {formData.discount_type === 'percentage' ? '(%)' : '($)'}
                    </Label>
                    <Input
                      id="discount_value"
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) => setFormData({...formData, discount_value: parseFloat(e.target.value) || 0})}
                      placeholder={formData.discount_type === 'percentage' ? '10' : '5.00'}
                      step="0.01"
                      min="0"
                      max={formData.discount_type === 'percentage' ? '100' : undefined}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="min_purchase">Min Purchase ($)</Label>
                    <Input
                      id="min_purchase"
                      type="number"
                      value={formData.min_purchase}
                      onChange={(e) => setFormData({...formData, min_purchase: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="max_uses">Max Uses (0 = unlimited)</Label>
                    <Input
                      id="max_uses"
                      type="number"
                      value={formData.max_uses}
                      onChange={(e) => setFormData({...formData, max_uses: parseInt(e.target.value) || 0})}
                      placeholder="0"
                      min="0"
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="starts_at">Start Date & Time</Label>
                    <Input
                      id="starts_at"
                      type="datetime-local"
                      value={formData.starts_at}
                      onChange={(e) => setFormData({...formData, starts_at: e.target.value})}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="expires_at">Expiry Date & Time</Label>
                    <Input
                      id="expires_at"
                      type="datetime-local"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                  />
                  <Label htmlFor="active">Active Coupon</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="hover:scale-105 transition-transform">
                    {editingId ? 'Update Coupon' : 'Create Coupon'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} className="hover:scale-105 transition-transform">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="animate-slide-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              All Coupons ({coupons.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {coupons.length === 0 ? (
                <div className="text-center py-8 animate-fade-in">
                  <Gift className="h-12 w-12 mx-auto text-gray-400 mb-4 animate-float" />
                  <h3 className="text-lg font-medium mb-2">No Coupons Found</h3>
                  <p className="text-muted-foreground">Create your first coupon to start offering discounts.</p>
                </div>
              ) : (
                coupons.map((coupon, index) => (
                  <Card 
                    key={coupon.id} 
                    className="animate-slide-in-up hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-primary/50"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl">
                            {coupon.discount_type === 'percentage' ? (
                              <Percent className="h-6 w-6 text-purple-600 animate-bounce" />
                            ) : (
                              <DollarSign className="h-6 w-6 text-green-600 animate-bounce" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg animate-text-shimmer font-mono tracking-wider">
                                {coupon.code}
                              </h3>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(coupon.code)}
                                className="h-6 w-6 hover:scale-110 transition-transform"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Badge 
                                variant={coupon.active && !isExpired(coupon.expires_at) && !isUsedUp(coupon) ? "default" : "secondary"}
                                className="animate-pulse"
                              >
                                {!coupon.active ? (
                                  <><EyeOff className="h-3 w-3 mr-1" /> Inactive</>
                                ) : isExpired(coupon.expires_at) ? (
                                  <><EyeOff className="h-3 w-3 mr-1" /> Expired</>
                                ) : isUsedUp(coupon) ? (
                                  <><EyeOff className="h-3 w-3 mr-1" /> Used Up</>
                                ) : (
                                  <><Eye className="h-3 w-3 mr-1" /> Active</>
                                )}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="font-medium text-lg text-purple-600">
                                {coupon.discount_type === 'percentage' 
                                  ? `${coupon.discount_value}% off` 
                                  : `$${coupon.discount_value} off`
                                }
                              </span>
                              {coupon.min_purchase > 0 && (
                                <span>Min: ${coupon.min_purchase}</span>
                              )}
                              <span>
                                Used: {coupon.used_count}
                                {coupon.max_uses > 0 && ` / ${coupon.max_uses}`}
                              </span>
                            </div>
                            {coupon.expires_at && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Expires: {new Date(coupon.expires_at).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toggleCouponStatus(coupon.id, coupon.active)}
                            className="hover:scale-110 transition-transform"
                          >
                            {coupon.active ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(coupon)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(coupon.id)}
                            className="hover:scale-110 transition-transform hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCoupons;
