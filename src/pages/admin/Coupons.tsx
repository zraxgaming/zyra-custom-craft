
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { format } from "date-fns";
import { Coupon } from "@/types/order";

interface CouponFormData {
  id?: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_purchase: number;
  max_uses: number | null;
  active: boolean;
  starts_at: string;
  expires_at: string | null;
}

const CouponForm: React.FC<{ 
  coupon?: Coupon | null, 
  onSave: (data: CouponFormData) => void,
  onCancel: () => void
}> = ({ 
  coupon = null, 
  onSave, 
  onCancel
}) => {
  const [formData, setFormData] = useState<CouponFormData>({
    id: coupon?.id,
    code: coupon?.code || "",
    discount_type: coupon?.discount_type || "percentage",
    discount_value: coupon?.discount_value || 10,
    min_purchase: coupon?.min_purchase || 0,
    max_uses: coupon?.max_uses || null,
    active: coupon?.active ?? true,
    starts_at: coupon?.starts_at ? new Date(coupon.starts_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    expires_at: coupon?.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === "" ? null : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.discount_value) {
      return;
    }
    
    onSave(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="code">Coupon Code *</Label>
          <Input 
            id="code" 
            name="code"
            value={formData.code} 
            onChange={handleChange}
            placeholder="SUMMER20"
            className="uppercase"
            required 
          />
          <p className="text-xs text-muted-foreground mt-1">
            A unique code for customers to apply at checkout.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="discount_type">Discount Type *</Label>
            <select
              id="discount_type"
              name="discount_type"
              value={formData.discount_type}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="discount_value">
              {formData.discount_type === "percentage" ? "Discount Percentage *" : "Discount Amount *"}
            </Label>
            <Input 
              id="discount_value" 
              name="discount_value"
              type="number"
              min={0}
              max={formData.discount_type === "percentage" ? 100 : undefined}
              step={formData.discount_type === "percentage" ? 1 : 0.01}
              value={formData.discount_value} 
              onChange={handleChange}
              required 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="min_purchase">Minimum Purchase ($)</Label>
            <Input 
              id="min_purchase" 
              name="min_purchase"
              type="number"
              min={0}
              step={0.01}
              value={formData.min_purchase} 
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum cart subtotal required.
            </p>
          </div>
          
          <div>
            <Label htmlFor="max_uses">Maximum Uses</Label>
            <Input 
              id="max_uses" 
              name="max_uses"
              type="number"
              min={1}
              value={formData.max_uses === null ? "" : formData.max_uses} 
              onChange={handleChange}
              placeholder="Unlimited"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty for unlimited uses.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="starts_at">Start Date *</Label>
            <Input 
              id="starts_at" 
              name="starts_at"
              type="date"
              value={formData.starts_at} 
              onChange={handleChange}
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="expires_at">Expiration Date</Label>
            <Input 
              id="expires_at" 
              name="expires_at"
              type="date"
              value={formData.expires_at || ""} 
              onChange={handleChange}
              min={formData.starts_at}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty for no expiration.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Switch 
            id="active" 
            checked={formData.active}
            onCheckedChange={(checked) => setFormData({...formData, active: checked})}
          />
          <Label htmlFor="active">Active</Label>
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {coupon ? 'Update Coupon' : 'Create Coupon'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);
  
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  // Fetch coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        // Query coupons
        const { data, error } = await supabase
          .from("coupons")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        setCoupons(data as Coupon[] || []);
      } catch (error: any) {
        toast({
          title: "Error fetching coupons",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCoupons();
  }, [toast]);

  // Save coupon (create or update)
  const handleSaveCoupon = async (data: CouponFormData) => {
    try {
      if (currentCoupon) {
        // Update existing coupon
        const { error } = await supabase
          .from("coupons")
          .update({
            code: data.code.toUpperCase(),
            discount_type: data.discount_type,
            discount_value: data.discount_value,
            min_purchase: data.min_purchase || 0,
            max_uses: data.max_uses,
            active: data.active,
            starts_at: data.starts_at,
            expires_at: data.expires_at || null
          })
          .eq("id", currentCoupon.id);
          
        if (error) throw error;
        
        // Update state
        setCoupons(coupons.map(coupon => 
          coupon.id === currentCoupon.id 
            ? { 
                ...coupon, 
                code: data.code.toUpperCase(),
                discount_type: data.discount_type,
                discount_value: data.discount_value,
                min_purchase: data.min_purchase || 0,
                max_uses: data.max_uses,
                active: data.active,
                starts_at: data.starts_at,
                expires_at: data.expires_at || null
              } 
            : coupon
        ));
        
        toast({
          title: "Coupon updated",
          description: "The coupon has been updated successfully.",
        });
      } else {
        // Create new coupon
        const { data: newCoupon, error } = await supabase
          .from("coupons")
          .insert({
            code: data.code.toUpperCase(),
            discount_type: data.discount_type,
            discount_value: data.discount_value,
            min_purchase: data.min_purchase || 0,
            max_uses: data.max_uses,
            active: data.active,
            starts_at: data.starts_at,
            expires_at: data.expires_at || null,
            used_count: 0
          })
          .select()
          .single();
          
        if (error) throw error;
        
        // Update state
        setCoupons([newCoupon as Coupon, ...coupons]);
        
        toast({
          title: "Coupon created",
          description: "The new coupon has been created successfully.",
        });
      }
      
      // Close dialog and reset current coupon
      setIsDialogOpen(false);
      setCurrentCoupon(null);
    } catch (error: any) {
      toast({
        title: "Error saving coupon",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Delete coupon
  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    
    try {
      const { error } = await supabase
        .from("coupons")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      // Update state
      setCoupons(coupons.filter(coupon => coupon.id !== id));
      
      toast({
        title: "Coupon deleted",
        description: "The coupon has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting coupon",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Toggle coupon active status
  const toggleCouponActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from("coupons")
        .update({ active: !currentActive })
        .eq("id", id);
        
      if (error) throw error;
      
      // Update state
      setCoupons(coupons.map(coupon => 
        coupon.id === id ? { ...coupon, active: !currentActive } : coupon
      ));
      
      toast({
        title: "Coupon updated",
        description: `Coupon is now ${!currentActive ? 'active' : 'inactive'}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating coupon",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle dialog open/close
  const openNewCouponDialog = () => {
    setCurrentCoupon(null);
    setIsDialogOpen(true);
  };
  
  const openEditCouponDialog = (coupon: Coupon) => {
    setCurrentCoupon(coupon);
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    setCurrentCoupon(null);
  };

  // Helper to determine if a coupon is expired
  const isCouponExpired = (coupon: Coupon) => {
    if (!coupon.expires_at) return false;
    return new Date(coupon.expires_at) < new Date();
  };
  
  // Helper to determine if a coupon is active
  const isCouponActive = (coupon: Coupon) => {
    if (!coupon.active) return false;
    if (new Date(coupon.starts_at) > new Date()) return false;
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return false;
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) return false;
    return true;
  };
  
  // Format discount display
  const formatDiscount = (coupon: Coupon) => {
    return coupon.discount_type === "percentage" 
      ? `${coupon.discount_value}%` 
      : `$${coupon.discount_value.toFixed(2)}`;
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
          <h1 className="text-3xl font-bold">Discount Coupons</h1>
          <Button onClick={openNewCouponDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Coupon
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
          </div>
        ) : coupons.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mb-4 mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center">
                <Tag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No coupons found</h3>
              <p className="text-muted-foreground mb-6">
                Create your first coupon code for your customers to use at checkout.
              </p>
              <Button onClick={openNewCouponDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Coupon
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Usage / Limits</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-medium">{coupon.code}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p>{formatDiscount(coupon)}</p>
                        {coupon.min_purchase > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Min. purchase: ${coupon.min_purchase.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p>Used: {coupon.used_count}</p>
                        {coupon.max_uses ? (
                          <p className="text-xs">
                            Limit: {coupon.max_uses} {coupon.used_count >= coupon.max_uses && "(Reached)"}
                          </p>
                        ) : (
                          <p className="text-xs">No usage limit</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-xs">
                          Start: {format(new Date(coupon.starts_at), "MMM d, yyyy")}
                        </p>
                        {coupon.expires_at ? (
                          <p className="text-xs">
                            Expires: {format(new Date(coupon.expires_at), "MMM d, yyyy")}
                            {isCouponExpired(coupon) && " (Expired)"}
                          </p>
                        ) : (
                          <p className="text-xs">No expiration</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Switch
                          checked={coupon.active}
                          onCheckedChange={() => toggleCouponActive(coupon.id, coupon.active)}
                          className="mr-2"
                          disabled={isCouponExpired(coupon)}
                        />
                        <span 
                          className={
                            isCouponActive(coupon)
                              ? "text-green-600"
                              : "text-gray-500"
                          }
                        >
                          {isCouponActive(coupon) ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditCouponDialog(coupon)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCoupon(coupon.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {currentCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </DialogTitle>
              <DialogDescription>
                {currentCoupon 
                  ? 'Update the details of your discount coupon.'
                  : 'Create a new discount coupon code for customers to use at checkout.'}
              </DialogDescription>
            </DialogHeader>
            
            <CouponForm 
              coupon={currentCoupon}
              onSave={handleSaveCoupon}
              onCancel={closeDialog}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Coupons;
