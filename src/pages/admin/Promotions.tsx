
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Promotion } from "@/types/order";

interface PromotionFormProps { 
  promotion?: Promotion | null, 
  onSave: (data: Partial<Promotion>) => void,
  onCancel: () => void
}

const PromotionForm: React.FC<PromotionFormProps> = ({ 
  promotion = null, 
  onSave, 
  onCancel
}) => {
  const [title, setTitle] = useState(promotion?.title || '');
  const [description, setDescription] = useState(promotion?.description || '');
  const [imageUrl, setImageUrl] = useState(promotion?.image_url || '');
  const [link, setLink] = useState(promotion?.link || '');
  const [active, setActive] = useState(promotion?.active ?? true);
  const [placement, setPlacement] = useState(promotion?.placement || 'home_hero');
  const [startDate, setStartDate] = useState(promotion?.start_date ? promotion.start_date.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(promotion?.end_date ? promotion.end_date.split('T')[0] : '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !placement) {
      return;
    }
    
    onSave({
      title,
      description,
      image_url: imageUrl || undefined,
      link: link || undefined,
      active,
      placement,
      start_date: startDate,
      end_date: endDate || undefined
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input 
              id="image_url" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
              placeholder="https://example.com/image.jpg"
            />
            {imageUrl && (
              <div className="mt-2 border rounded-md p-2 bg-gray-50">
                <img 
                  src={imageUrl} 
                  alt="Banner preview" 
                  className="h-20 object-contain mx-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="link">Link URL</Label>
            <Input 
              id="link" 
              value={link} 
              onChange={(e) => setLink(e.target.value)} 
              placeholder="https://example.com/page"
            />
          </div>
          
          <div>
            <Label htmlFor="placement">Placement *</Label>
            <select 
              id="placement"
              value={placement}
              onChange={(e) => setPlacement(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="home_hero">Home Page Hero</option>
              <option value="shop_banner">Shop Page Banner</option>
              <option value="popup">Popup Banner</option>
              <option value="sidebar">Sidebar Banner</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input 
                id="start_date" 
                type="date"
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="end_date">End Date (Optional)</Label>
              <Input 
                id="end_date" 
                type="date"
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="active" 
              checked={active} 
              onCheckedChange={setActive} 
            />
            <Label htmlFor="active">Active</Label>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {promotion ? 'Update Promotion' : 'Create Promotion'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const Promotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState<Promotion | null>(null);
  
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

  // Fetch promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        // Create the promotions table if it doesn't exist yet
        try {
          // Check if table exists first by trying to query it
          const { count, error } = await supabase
            .from("promotions")
            .select("*", { count: 'exact', head: true });
          
          if (error && error.code === '42P01') {
            console.log("Promotions table doesn't exist yet");
          }
        } catch (error) {
          console.error("Error checking promotions table:", error);
        }

        // Query promotions
        const { data, error } = await supabase
          .from("promotions")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        setPromotions(data as Promotion[] || []);
      } catch (error: any) {
        toast({
          title: "Error fetching promotions",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPromotions();
  }, [toast]);

  // Create or update a promotion
  const handleSavePromotion = async (data: Partial<Promotion>) => {
    try {
      if (currentPromotion) {
        // Update existing promotion
        const { error } = await supabase
          .from("promotions")
          .update(data)
          .eq("id", currentPromotion.id);
          
        if (error) throw error;
        
        setPromotions(promotions.map(p => 
          p.id === currentPromotion.id ? { ...p, ...data } as Promotion : p
        ));
        
        toast({
          title: "Promotion updated",
          description: "The promotion has been updated successfully.",
        });
      } else {
        // Create new promotion
        const { data: newPromotion, error } = await supabase
          .from("promotions")
          .insert(data)
          .select()
          .single();
          
        if (error) throw error;
        
        setPromotions([newPromotion as Promotion, ...promotions]);
        
        toast({
          title: "Promotion created",
          description: "The new promotion has been created successfully.",
        });
      }
      
      // Close dialog and reset current promotion
      setIsDialogOpen(false);
      setCurrentPromotion(null);
    } catch (error: any) {
      toast({
        title: "Error saving promotion",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Delete a promotion
  const handleDeletePromotion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;
    
    try {
      const { error } = await supabase
        .from("promotions")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      setPromotions(promotions.filter(p => p.id !== id));
      
      toast({
        title: "Promotion deleted",
        description: "The promotion has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting promotion",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle dialog open/close
  const openNewPromotionDialog = () => {
    setCurrentPromotion(null);
    setIsDialogOpen(true);
  };
  
  const openEditPromotionDialog = (promotion: Promotion) => {
    setCurrentPromotion(promotion);
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    setCurrentPromotion(null);
  };

  // Toggle promotion active status
  const togglePromotionActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from("promotions")
        .update({ active: !currentActive })
        .eq("id", id);
        
      if (error) throw error;
      
      setPromotions(promotions.map(p => 
        p.id === id ? { ...p, active: !currentActive } : p
      ));
      
      toast({
        title: "Promotion updated",
        description: `Promotion is now ${!currentActive ? 'active' : 'inactive'}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating promotion",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getPlacementDisplayName = (placement: string) => {
    switch (placement) {
      case 'home_hero': return 'Home Page Hero';
      case 'shop_banner': return 'Shop Page Banner';
      case 'popup': return 'Popup Banner';
      case 'sidebar': return 'Sidebar Banner';
      default: return placement;
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
          <h1 className="text-3xl font-bold">Promotions & Banners</h1>
          <Button onClick={openNewPromotionDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Banner
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
          </div>
        ) : promotions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-medium mb-2">No promotions found</h3>
              <p className="text-muted-foreground mb-6">
                Create your first promotional banner to display on your store
              </p>
              <Button onClick={openNewPromotionDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Banner
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Placement</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{promotion.title}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{promotion.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getPlacementDisplayName(promotion.placement)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-xs">Start: {format(new Date(promotion.start_date), "MMM d, yyyy")}</p>
                        {promotion.end_date && (
                          <p className="text-xs">End: {format(new Date(promotion.end_date), "MMM d, yyyy")}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Switch
                          checked={promotion.active}
                          onCheckedChange={() => togglePromotionActive(promotion.id, promotion.active)}
                          className="mr-2"
                        />
                        <span className={promotion.active ? "text-green-600" : "text-gray-500"}>
                          {promotion.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditPromotionDialog(promotion)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePromotion(promotion.id)}
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
                {currentPromotion ? 'Edit Promotion' : 'Create New Promotion'}
              </DialogTitle>
              <DialogDescription>
                {currentPromotion 
                  ? 'Update the details of your promotional banner.'
                  : 'Create a new promotional banner to display on your store.'}
              </DialogDescription>
            </DialogHeader>
            
            <PromotionForm 
              promotion={currentPromotion}
              onSave={handleSavePromotion}
              onCancel={closeDialog}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Promotions;
