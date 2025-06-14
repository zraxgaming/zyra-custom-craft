
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Tag, Gift, Percent, DollarSign, Calendar, Users } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase: number;
  max_uses?: number;
  used_count: number;
  active: boolean;
  starts_at: string;
  expires_at?: string;
  created_at: string;
}

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: "",
    min_purchase: "",
    max_uses: "",
    expires_at: ""
  });

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
    } catch (error: any) {
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
    
    if (!formData.code.trim() || !formData.discount_value) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const couponData = {
        code: formData.code.toUpperCase().trim(),
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_purchase: parseFloat(formData.min_purchase) || 0,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        expires_at: formData.expires_at || null,
        active: true,
        starts_at: new Date().toISOString()
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id);

        if (error) throw error;

        toast({
          title: "Success ✨",
          description: "Coupon updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert({ ...couponData, used_count: 0 });

        if (error) throw error;

        toast({
          title: "Success ✨",
          description: "Coupon created successfully",
        });
      }

      setFormData({
        code: "",
        discount_type: "percentage",
        discount_value: "",
        min_purchase: "",
        max_uses: "",
        expires_at: ""
      });
      setIsCreating(false);
      setEditingCoupon(null);
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

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ active: !coupon.active })
        .eq('id', coupon.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Coupon ${coupon.active ? 'deactivated' : 'activated'}`,
      });

      fetchCoupons();
    } catch (error: any) {
      console.error('Error toggling coupon:', error);
      toast({
        title: "Error",
        description: "Failed to update coupon",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (coupon: Coupon) => {
    if (!confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) return;

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', coupon.id);

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
        description: "Failed to delete coupon",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      min_purchase: coupon.min_purchase.toString(),
      max_uses: coupon.max_uses?.toString() || "",
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : ""
    });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingCoupon(null);
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: "",
      min_purchase: "",
      max_uses: "",
      expires_at: ""
    });
  };

  const formatDiscount = (coupon: Coupon) => {
    return coupon.discount_type === 'percentage' 
      ? `${coupon.discount_value}%` 
      : `$${coupon.discount_value}`;
  };

  const isExpired = (coupon: Coupon) => {
    return coupon.expires_at && new Date(coupon.expires_at) < new Date();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <SEOHead 
        title="Coupons Management - Admin Dashboard"
        description="Create and manage discount coupons, track usage, and boost sales with promotional codes."
      />
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-scale-in">
                Coupons & Discounts
              </h1>
              <p className="text-muted-foreground mt-2 animate-slide-in-right">
                Create and manage promotional discount codes
              </p>
            </div>
            <Button 
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transform hover:scale-105 transition-all duration-300 animate-pulse-glow"
            >
              <Plus className="h-4 w-4 mr-2 animate-bounce" />
              Create Coupon
            </Button>
          </div>

          {isCreating && (
            <Card className="animate-scale-in border-primary/20 shadow-lg hover:shadow-xl transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Gift className="h-5 w-5 text-primary animate-pulse" />
                  {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="animate-slide-in-left">
                      <label className="text-sm font-medium mb-2 block">Coupon Code *</label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.code}
                          onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                          placeholder="SAVE20"
                          required
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setFormData(prev => ({ ...prev, code: generateCouponCode() }))}
                          className="hover:scale-105 transition-all duration-300"
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                    <div className="animate-slide-in-right">
                      <label className="text-sm font-medium mb-2 block">Discount Type *</label>
                      <Select value={formData.discount_type} onValueChange={(value: "percentage" | "fixed") => setFormData(prev => ({ ...prev, discount_type: value }))}>
                        <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="animate-fade-in">
                      <label className="text-sm font-medium mb-2 block">Discount Value *</label>
                      <Input
                        type="number"
                        value={formData.discount_value}
                        onChange={(e) => setFormData(prev => ({ ...prev, discount_value: e.target.value }))}
                        placeholder={formData.discount_type === 'percentage' ? '20' : '10.00'}
                        step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                        min="0"
                        max={formData.discount_type === 'percentage' ? '100' : undefined}
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="animate-slide-in-up">
                      <label className="text-sm font-medium mb-2 block">Minimum Purchase</label>
                      <Input
                        type="number"
                        value={formData.min_purchase}
                        onChange={(e) => setFormData(prev => ({ ...prev, min_purchase: e.target.value }))}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="animate-slide-in-down">
                      <label className="text-sm font-medium mb-2 block">Max Uses</label>
                      <Input
                        type="number"
                        value={formData.max_uses}
                        onChange={(e) => setFormData(prev => ({ ...prev, max_uses: e.target.value }))}
                        placeholder="Unlimited"
                        min="1"
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  
                  <div className="animate-scale-in">
                    <label className="text-sm font-medium mb-2 block">Expiry Date (Optional)</label>
                    <Input
                      type="date"
                      value={formData.expires_at}
                      onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300"
                    >
                      <Gift className="h-4 w-4 mr-2 animate-pulse" />
                      {editingCoupon ? 'Update' : 'Create'} Coupon
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {coupons.map((coupon, index) => (
              <Card key={coupon.id} className={`hover:shadow-lg transition-all duration-500 animate-slide-in-up border border-border/50 bg-card/60 backdrop-blur-sm ${isExpired(coupon) ? 'opacity-60' : ''}`} style={{animationDelay: `${index * 100}ms`}}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl">
                        {coupon.discount_type === 'percentage' ? (
                          <Percent className="h-6 w-6 text-primary animate-pulse" />
                        ) : (
                          <DollarSign className="h-6 w-6 text-primary animate-pulse" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-xl font-mono animate-text-shimmer">{coupon.code}</h3>
                          <Badge variant={coupon.active && !isExpired(coupon) ? 'default' : 'secondary'} className="animate-pulse">
                            {!coupon.active ? 'Inactive' : isExpired(coupon) ? 'Expired' : 'Active'}
                          </Badge>
                          <Badge variant="outline" className="animate-float">
                            {formatDiscount(coupon)} OFF
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              Min: ${coupon.min_purchase}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              Used: {coupon.used_count}/{coupon.max_uses || '∞'}
                            </span>
                            {coupon.expires_at && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Expires: {new Date(coupon.expires_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(coupon)}
                        className="hover:scale-105 transition-all duration-300"
                      >
                        {coupon.active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(coupon)}
                        className="hover:scale-105 transition-all duration-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(coupon)}
                        className="hover:scale-105 transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4 animate-pulse" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {coupons.length === 0 && (
              <Card className="p-12 text-center animate-bounce-in">
                <Gift className="h-16 w-16 mx-auto text-muted-foreground mb-4 animate-float" />
                <h3 className="text-lg font-semibold mb-2">No Coupons Yet</h3>
                <p className="text-muted-foreground mb-4">Create your first discount coupon to boost sales</p>
                <Button onClick={() => setIsCreating(true)} className="hover:scale-105 transition-all duration-300">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Coupon
                </Button>
              </Card>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminCoupons;
