import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit, Trash2, Calendar, Image } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

interface Promotion {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  start_date: string;
  end_date?: string | null;
  active: boolean;
  placement: string;
  created_at: string;
  updated_at: string;
}

const Promotions = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    start_date: "",
    end_date: "",
    active: true,
    placement: "banner"
  });

  useEffect(() => {
    if (isAdmin) {
      fetchPromotions();
    }
  }, [isAdmin]);

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromotions(data || []);
    } catch (error: any) {
      console.error("Error fetching promotions:", error);
      toast({
        title: "Error loading promotions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPromotion) {
        const { error } = await supabase
          .from('promotions')
          .update(formData)
          .eq('id', editingPromotion.id);
          
        if (error) throw error;
        
        toast({
          title: "Promotion updated",
          description: "The promotion has been successfully updated.",
        });
      } else {
        const { error } = await supabase
          .from('promotions')
          .insert(formData);
          
        if (error) throw error;
        
        toast({
          title: "Promotion created",
          description: "The promotion has been successfully created.",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchPromotions();
    } catch (error: any) {
      console.error("Error saving promotion:", error);
      toast({
        title: "Error saving promotion",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Promotion deleted",
        description: "The promotion has been successfully deleted.",
      });
      fetchPromotions();
    } catch (error: any) {
      console.error("Error deleting promotion:", error);
      toast({
        title: "Error deleting promotion",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      link_url: "",
      start_date: "",
      end_date: "",
      active: true,
      placement: "banner"
    });
    setEditingPromotion(null);
  };

  const openEditDialog = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description || "",
      image_url: promotion.image_url || "",
      link_url: promotion.link_url || "",
      start_date: promotion.start_date.split('T')[0],
      end_date: promotion.end_date ? promotion.end_date.split('T')[0] : "",
      active: promotion.active,
      placement: promotion.placement
    });
    setIsDialogOpen(true);
  };

  const togglePromotionStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .update({ active: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Promotion updated",
        description: `Promotion has been ${!currentStatus ? 'activated' : 'deactivated'}.`,
      });
      fetchPromotions();
    } catch (error: any) {
      console.error("Error updating promotion status:", error);
      toast({
        title: "Error updating promotion",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center text-muted-foreground">
            You don't have permission to access this page.
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Promotions Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-background border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {editingPromotion ? "Edit Promotion" : "Create New Promotion"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-foreground">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                      className="bg-background text-foreground border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="placement" className="text-foreground">Placement</Label>
                    <select
                      id="placement"
                      value={formData.placement}
                      onChange={(e) => setFormData({...formData, placement: e.target.value})}
                      className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="banner">Banner</option>
                      <option value="popup">Popup</option>
                      <option value="sidebar">Sidebar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="bg-background text-foreground border-border"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="image_url" className="text-foreground">Image URL</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      className="bg-background text-foreground border-border"
                    />
                    {formData.image_url && (
                      <div className="mt-2">
                        <img 
                          src={formData.image_url} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-md border border-border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="link_url" className="text-foreground">Link URL</Label>
                    <Input
                      id="link_url"
                      type="url"
                      value={formData.link_url}
                      onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                      className="bg-background text-foreground border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date" className="text-foreground">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      required
                      className="bg-background text-foreground border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date" className="text-foreground">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      className="bg-background text-foreground border-border"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                  />
                  <Label htmlFor="active" className="text-foreground">Active</Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="text-foreground border-border">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {editingPromotion ? "Update" : "Create"} Promotion
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">All Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
              </div>
            ) : promotions.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No promotions yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first promotion to start engaging with customers.
                </p>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Promotion
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-foreground">Title</TableHead>
                      <TableHead className="text-foreground">Image</TableHead>
                      <TableHead className="text-foreground">Placement</TableHead>
                      <TableHead className="text-foreground">Start Date</TableHead>
                      <TableHead className="text-foreground">End Date</TableHead>
                      <TableHead className="text-foreground">Status</TableHead>
                      <TableHead className="text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {promotions.map((promotion) => (
                      <TableRow key={promotion.id} className="border-border">
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground">{promotion.title}</div>
                            {promotion.description && (
                              <div className="text-sm text-muted-foreground">
                                {promotion.description.substring(0, 50)}...
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {promotion.image_url ? (
                            <img 
                              src={promotion.image_url} 
                              alt={promotion.title}
                              className="w-16 h-16 object-cover rounded-md border border-border"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center border border-border">
                              <Image className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize text-foreground border-border">
                            {promotion.placement}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground">
                          {format(new Date(promotion.start_date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {promotion.end_date 
                            ? format(new Date(promotion.end_date), "MMM d, yyyy")
                            : "No end date"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={promotion.active}
                              onCheckedChange={() => togglePromotionStatus(promotion.id, promotion.active)}
                            />
                            <Badge 
                              variant={promotion.active ? "default" : "secondary"}
                              className={promotion.active ? "bg-green-500" : "bg-gray-500"}
                            >
                              {promotion.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(promotion)}
                              className="text-foreground hover:bg-muted"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(promotion.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Promotions;
