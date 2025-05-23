
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
  Card,
  CardContent
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Tag } from "lucide-react";
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
          <Label htmlFor="code" className="text-gray-900 dark:text-gray-100">Coupon Code *</Label>
          <Input 
            id="code" 
            name="code"
            value={formData.code} 
            onChange={handleChange}
            placeholder="SUMMER20"
            className="uppercase text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            required 
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            A unique code for customers to apply at checkout.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="discount_type" className="text-gray-900 dark:text-gray-100">Discount Type *</Label>
            <select
              id="discount_type"
              name="discount_type"
              value={formData.discount_type}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 dark:text-gray-100"
              required
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="discount_value" className="text-gray-900 dark:text-gray-100">
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
              className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
              required 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="min_purchase" className="text-gray-900 dark:text-gray-100">Minimum Purchase ($)</Label>
            <Input 
              id="min_purchase" 
              name="min_purchase"
              type="number"
              min={0}
              step={0.01}
              value={formData.min_purchase} 
              onChange={handleChange}
              className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Minimum cart subtotal required.
            </p>
          </div>
          
          <div>
            <Label htmlFor="max_uses" className="text-gray-900 dark:text-gray-100">Maximum Uses</Label>
            <Input 
              id="max_uses" 
              name="max_uses"
              type="number"
              min={1}
              value={formData.max_uses === null ? "" : formData.max_uses} 
              onChange={handleChange}
              placeholder="Unlimited"
              className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Leave empty for unlimited uses.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="starts_at" className="text-gray-900 dark:text-gray-100">Start Date *</Label>
            <Input 
              id="starts_at" 
              name="starts_at"
              type="date"
              value={formData.starts_at} 
              onChange={handleChange}
              className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="expires_at" className="text-gray-900 dark:text-gray-100">Expiration Date</Label>
            <Input 
              id="expires_at" 
              name="expires_at"
              type="date"
              value={formData.expires_at || ""} 
              onChange={handleChange}
              min={formData.starts_at}
              className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
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
          <Label htmlFor="active" className="text-gray-900 dark:text-gray-100">Active</Label>
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

  // Note: Since coupons table doesn't exist in the database yet,
  // we'll show a placeholder message
  useEffect(() => {
    setIsLoading(false);
    // When the coupons table is created, this will fetch real data
  }, []);

  const handleSaveCoupon = async (data: CouponFormData) => {
    // TODO: Implement when coupons table is created
    toast({
      title: "Coming soon",
      description: "Coupon management will be available once the database is updated.",
      variant: "default",
    });
    setIsDialogOpen(false);
    setCurrentCoupon(null);
  };

  const openNewCouponDialog = () => {
    setCurrentCoupon(null);
    setIsDialogOpen(true);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Discount Coupons</h1>
          <Button onClick={openNewCouponDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Coupon
          </Button>
        </div>
        
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <div className="mb-4 mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center">
              <Tag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">Coupons Coming Soon</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The coupon management system will be available once the database is properly set up.
            </p>
            <Button onClick={openNewCouponDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Preview Coupon Creation
            </Button>
          </CardContent>
        </Card>
        
        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">
                {currentCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                {currentCoupon 
                  ? 'Update the details of your discount coupon.'
                  : 'Create a new discount coupon code for customers to use at checkout.'}
              </DialogDescription>
            </DialogHeader>
            
            <CouponForm 
              coupon={currentCoupon}
              onSave={handleSaveCoupon}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Coupons;
