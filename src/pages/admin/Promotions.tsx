
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Loader2, Plus } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Promotion } from "@/types/order";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Promotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Partial<Promotion> | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<Partial<Promotion>>({
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    start_date: new Date().toISOString(),
    end_date: null,
    active: true,
    placement: "homepage",
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPromotions(data || []);
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

  const handleEditPromotion = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description,
      image_url: promotion.image_url,
      link_url: promotion.link_url,
      start_date: promotion.start_date,
      end_date: promotion.end_date,
      active: promotion.active,
      placement: promotion.placement,
    });
    setIsDialogOpen(true);
  };

  const handleNewPromotion = () => {
    setSelectedPromotion(null);
    setFormData({
      title: "",
      description: "",
      image_url: "",
      link_url: "",
      start_date: new Date().toISOString(),
      end_date: null,
      active: true,
      placement: "homepage",
    });
    setIsDialogOpen(true);
  };

  const handleInputChange = (field: string, value: string | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedPromotion?.id) {
        // Update existing promotion
        const { error } = await supabase
          .from("promotions")
          .update(formData)
          .eq("id", selectedPromotion.id);

        if (error) throw error;

        toast({
          title: "Promotion updated",
          description: "The promotion has been updated successfully.",
        });
      } else {
        // Create new promotion
        const { error } = await supabase.from("promotions").insert(formData);

        if (error) throw error;

        toast({
          title: "Promotion created",
          description: "The new promotion has been created successfully.",
        });
      }

      setIsDialogOpen(false);
      fetchPromotions();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "There was an error processing your request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPromotion?.id) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("promotions")
        .delete()
        .eq("id", selectedPromotion.id);

      if (error) throw error;

      toast({
        title: "Promotion deleted",
        description: "The promotion has been deleted successfully.",
      });

      setIsDeleteDialogOpen(false);
      fetchPromotions();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "There was an error processing your request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Promotions</h1>
          <Button onClick={handleNewPromotion}>
            <Plus className="mr-2 h-4 w-4" />
            New Promotion
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
          </div>
        ) : promotions.length === 0 ? (
          <div className="bg-muted rounded-lg p-12 text-center">
            <h3 className="text-xl font-medium mb-2">No promotions found</h3>
            <p className="text-muted-foreground mb-6">
              Create your first promotion to display on your website.
            </p>
            <Button onClick={handleNewPromotion}>
              <Plus className="mr-2 h-4 w-4" />
              Create Promotion
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Placement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell className="font-medium">
                      {promotion.title}
                    </TableCell>
                    <TableCell>{promotion.placement}</TableCell>
                    <TableCell>
                      <Badge
                        variant={promotion.active ? "default" : "outline"}
                      >
                        {promotion.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(promotion.start_date), "MMM d, yyyy")}
                      {promotion.end_date && (
                        <> - {format(new Date(promotion.end_date), "MMM d, yyyy")}</>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPromotion(promotion)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteClick(promotion)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedPromotion ? "Edit Promotion" : "Create Promotion"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url || ""}
                    onChange={(e) =>
                      handleInputChange("image_url", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link_url">Link URL</Label>
                  <Input
                    id="link_url"
                    value={formData.link_url || ""}
                    onChange={(e) =>
                      handleInputChange("link_url", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <div className="flex">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.start_date
                            ? format(new Date(formData.start_date), "PPP")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            formData.start_date
                              ? new Date(formData.start_date)
                              : undefined
                          }
                          onSelect={(date) =>
                            handleInputChange(
                              "start_date",
                              date ? date.toISOString() : null
                            )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <div className="flex">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.end_date
                            ? format(new Date(formData.end_date), "PPP")
                            : "No end date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            formData.end_date
                              ? new Date(formData.end_date)
                              : undefined
                          }
                          onSelect={(date) =>
                            handleInputChange(
                              "end_date",
                              date ? date.toISOString() : null
                            )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="placement">Placement</Label>
                  <select
                    id="placement"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={formData.placement || "homepage"}
                    onChange={(e) =>
                      handleInputChange("placement", e.target.value)
                    }
                    required
                  >
                    <option value="homepage">Homepage</option>
                    <option value="shop">Shop Page</option>
                    <option value="product">Product Pages</option>
                    <option value="checkout">Checkout</option>
                    <option value="banner">Top Banner</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center justify-between pt-2">
                    <span>Active</span>
                    <Switch
                      checked={formData.active || false}
                      onCheckedChange={(checked) =>
                        handleInputChange("active", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {selectedPromotion ? "Update Promotion" : "Create Promotion"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Promotion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete this promotion? This action cannot
              be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Promotions;
