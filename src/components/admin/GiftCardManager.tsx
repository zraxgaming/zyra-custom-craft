
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Gift, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

interface GiftCard {
  id: string;
  code: string;
  amount: number;
  initial_amount: number;
  recipient_email?: string;
  message?: string;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  created_by?: string;
}

const GiftCardManager = () => {
  const { toast } = useToast();
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<GiftCard | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    recipient_email: "",
    message: "",
    expires_at: "",
    is_active: true
  });

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const fetchGiftCards = async () => {
    try {
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGiftCards(data || []);
    } catch (error: any) {
      console.error("Error fetching gift cards:", error);
      toast({
        title: "Error loading gift cards",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateGiftCardCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `GIFT-${result}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const giftCardData = {
        code: editingCard?.code || generateGiftCardCode(),
        amount: parseFloat(formData.amount),
        initial_amount: parseFloat(formData.amount),
        recipient_email: formData.recipient_email || null,
        message: formData.message || null,
        expires_at: formData.expires_at || null,
        is_active: formData.is_active
      };

      if (editingCard) {
        const { error } = await supabase
          .from('gift_cards')
          .update(giftCardData)
          .eq('id', editingCard.id);
          
        if (error) throw error;
        
        toast({
          title: "Gift card updated",
          description: "The gift card has been successfully updated.",
        });
      } else {
        const { error } = await supabase
          .from('gift_cards')
          .insert(giftCardData);
          
        if (error) throw error;
        
        toast({
          title: "Gift card created",
          description: `Gift card ${giftCardData.code} has been created.`,
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchGiftCards();
    } catch (error: any) {
      console.error("Error saving gift card:", error);
      toast({
        title: "Error saving gift card",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gift card?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('gift_cards')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Gift card deleted",
        description: "The gift card has been successfully deleted.",
      });
      fetchGiftCards();
    } catch (error: any) {
      console.error("Error deleting gift card:", error);
      toast({
        title: "Error deleting gift card",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      recipient_email: "",
      message: "",
      expires_at: "",
      is_active: true
    });
    setEditingCard(null);
  };

  const openEditDialog = (card: GiftCard) => {
    setEditingCard(card);
    setFormData({
      amount: card.amount.toString(),
      recipient_email: card.recipient_email || "",
      message: card.message || "",
      expires_at: card.expires_at ? card.expires_at.split('T')[0] : "",
      is_active: card.is_active
    });
    setIsDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Gift card code copied to clipboard.",
    });
  };

  const toggleCardStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('gift_cards')
        .update({ is_active: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Gift card updated",
        description: `Gift card has been ${!currentStatus ? 'activated' : 'deactivated'}.`,
      });
      fetchGiftCards();
    } catch (error: any) {
      console.error("Error updating gift card status:", error);
      toast({
        title: "Error updating gift card",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-foreground">Gift Card Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Create Gift Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-background border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {editingCard ? "Edit Gift Card" : "Create New Gift Card"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="amount" className="text-foreground">Amount (USD) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                    className="bg-background text-foreground border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="recipient_email" className="text-foreground">Recipient Email</Label>
                  <Input
                    id="recipient_email"
                    type="email"
                    value={formData.recipient_email}
                    onChange={(e) => setFormData({...formData, recipient_email: e.target.value})}
                    className="bg-background text-foreground border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-foreground">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={3}
                    className="bg-background text-foreground border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="expires_at" className="text-foreground">Expiry Date</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                    className="bg-background text-foreground border-border"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active" className="text-foreground">Active</Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="text-foreground border-border">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {editingCard ? "Update" : "Create"} Gift Card
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
          </div>
        ) : giftCards.length === 0 ? (
          <div className="text-center py-12">
            <Gift className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No gift cards yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first gift card to start offering them to customers.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-foreground">Code</TableHead>
                  <TableHead className="text-foreground">Amount</TableHead>
                  <TableHead className="text-foreground">Recipient</TableHead>
                  <TableHead className="text-foreground">Created</TableHead>
                  <TableHead className="text-foreground">Expires</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {giftCards.map((card) => (
                  <TableRow key={card.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-foreground">{card.code}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(card.code)}
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      ${card.amount.toFixed(2)} / ${card.initial_amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {card.recipient_email || "N/A"}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {format(new Date(card.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {card.expires_at 
                        ? format(new Date(card.expires_at), "MMM d, yyyy")
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={card.is_active}
                          onCheckedChange={() => toggleCardStatus(card.id, card.is_active)}
                        />
                        <Badge 
                          variant={card.is_active ? "default" : "secondary"}
                          className={card.is_active ? "bg-green-500" : "bg-gray-500"}
                        >
                          {card.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(card)}
                          className="text-foreground hover:bg-muted"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(card.id)}
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
  );
};

export default GiftCardManager;
