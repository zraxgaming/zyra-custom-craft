
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Ticket, Plus, Edit, Trash2, Percent, DollarSign, Calendar, Users, Target } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'fixed' | 'percentage';
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
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage' as 'fixed' | 'percentage',
    discount_value: 0,
    min_purchase: 0,
    max_uses: 100,
    starts_at: '',
    expires_at: '',
    active: true
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
      
      // Type assertion with proper validation
      const validCoupons = (data || []).map(item => ({
        ...item,
        discount_type: ['fixed', 'percentage'].includes(item.discount_type) 
          ? item.discount_type as 'fixed' | 'percentage'
          : 'percentage'
      }));
      
      setCoupons(validCoupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || formData.discount_value <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingCoupon) {
        const { error } = await supabase
          .from('coupons')
          .update({
            code: formData.code.toUpperCase(),
            discount_type: formData.discount_type,
            discount_value: formData.discount_value,
            min_purchase: formData.min_purchase,
            max_uses: formData.max_uses,
            starts_at: formData.starts_at || new Date().toISOString(),
            expires_at: formData.expires_at,
            active: formData.active
          })
          .eq('id', editingCoupon.id);

        if (error) throw error;
        toast({
          title: "Coupon Updated! 🎫",
          description: "Coupon has been updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert({
            code: formData.code.toUpperCase(),
            discount_type: formData.discount_type,
            discount_value: formData.discount_value,
            min_purchase: formData.min_purchase,
            max_uses: formData.max_uses,
            used_count: 0,
            starts_at: formData.starts_at || new Date().toISOString(),
            expires_at: formData.expires_at,
            active: formData.active
          });

        if (error) throw error;
        toast({
          title: "Coupon Created! 🎉",
          description: "New coupon has been created successfully",
        });
      }

      resetForm();
      fetchCoupons();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save coupon",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
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
        title: "Coupon Deleted",
        description: "Coupon has been deleted successfully",
      });
      
      fetchCoupons();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete coupon",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_purchase: 0,
      max_uses: 100,
      starts_at: '',
      expires_at: '',
      active: true
    });
    setEditingCoupon(null);
    setShowForm(false);
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading coupons...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg animate-pulse-glow">
              <Ticket className="h-6 w-6 text-white animate-float" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Coupon Management
              </h1>
              <p className="text-muted-foreground">Create and manage discount coupons</p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? 'Cancel' : 'Add Coupon'}
          </Button>
        </div>

        {showForm && (
          <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 animate-scale-in">
            <CardHeader>
              <CardTitle className="text-purple-700 dark:text-purple-300">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="code">Coupon Code *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="SAVE10"
                        required
                        className="border-purple-200 focus:border-purple-500"
                      />
                      <Button type="button" onClick={generateCouponCode} variant="outline">
                        Generate
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Discount Type *</Label>
                    <Select
                      value={formData.discount_type}
                      onValueChange={(value: 'fixed' | 'percentage') => 
                        setFormData(prev => ({ ...prev, discount_type: value }))
                      }
                    >
                      <SelectTrigger className="border-purple-200 focus:border-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount_value">
                      Discount Value * {formData.discount_type === 'percentage' ? '(%)' : '($)'}
                    </Label>
                    <Input
                      id="discount_value"
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount_value: Number(e.target.value) }))}
                      min="0"
                      max={formData.discount_type === 'percentage' ? '100' : undefined}
                      required
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min_purchase">Minimum Purchase ($)</Label>
                    <Input
                      id="min_purchase"
                      type="number"
                      value={formData.min_purchase}
                      onChange={(e) => setFormData(prev => ({ ...prev, min_purchase: Number(e.target.value) }))}
                      min="0"
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_uses">Maximum Uses</Label>
                    <Input
                      id="max_uses"
                      type="number"
                      value={formData.max_uses}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_uses: Number(e.target.value) }))}
                      min="1"
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="starts_at">Start Date (Optional)</Label>
                    <Input
                      id="starts_at"
                      type="datetime-local"
                      value={formData.starts_at}
                      onChange={(e) => setFormData(prev => ({ ...prev, starts_at: e.target.value }))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
                    <Input
                      id="expires_at"
                      type="datetime-local"
                      value={formData.expires_at}
                      onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                  </Button>
                  <Button type="button" onClick={resetForm} variant="outline">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon, index) => (
            <Card 
              key={coupon.id} 
              className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-slide-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg animate-pulse">
                      {coupon.discount_type === 'percentage' ? (
                        <Percent className="h-4 w-4 text-white" />
                      ) : (
                        <DollarSign className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <CardTitle className="text-lg">{coupon.code}</CardTitle>
                  </div>
                  <Badge variant={coupon.active ? "default" : "secondary"} className="animate-pulse">
                    {coupon.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 animate-pulse">
                    {coupon.discount_type === 'percentage' 
                      ? `${coupon.discount_value}% OFF`
                      : `$${coupon.discount_value} OFF`
                    }
                  </div>
                  {coupon.min_purchase > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Min. purchase: ${coupon.min_purchase}
                    </p>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Usage:
                    </span>
                    <span>{coupon.used_count}/{coupon.max_uses}</span>
                  </div>
                  
                  {coupon.expires_at && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Expires:
                      </span>
                      <span>{new Date(coupon.expires_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleEdit(coupon)}
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:scale-105 transition-transform duration-300"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(coupon.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 hover:scale-105 transition-all duration-300"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {coupons.length === 0 && (
          <Card className="text-center py-12 animate-bounce-in">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-full">
                  <Ticket className="h-12 w-12 text-purple-600 dark:text-purple-300 animate-float" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">No Coupons Yet</h3>
                  <p className="text-muted-foreground">Create your first coupon to start offering discounts!</p>
                </div>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Coupon
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCoupons;
