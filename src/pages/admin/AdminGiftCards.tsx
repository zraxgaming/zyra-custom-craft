
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Plus, Eye, Trash2 } from "lucide-react";

interface GiftCard {
  id: string;
  code: string;
  amount: number;
  initial_amount: number;
  recipient_email: string;
  message: string;
  is_active: boolean;
  expires_at: string;
  created_at: string;
}

const AdminGiftCards = () => {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    recipient_email: '',
    message: '',
    expires_at: ''
  });
  const { toast } = useToast();

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
      console.error('Error fetching gift cards:', error);
      toast({
        title: "Error",
        description: "Failed to load gift cards",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateGiftCardCode = () => {
    return 'GC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleCreateGiftCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const code = generateGiftCardCode();
      const amount = parseFloat(formData.amount);
      
      const { error } = await supabase
        .from('gift_cards')
        .insert({
          code,
          amount,
          initial_amount: amount,
          recipient_email: formData.recipient_email,
          message: formData.message,
          expires_at: formData.expires_at || null,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Gift Card Created",
        description: `Gift card ${code} created successfully`,
      });

      setIsDialogOpen(false);
      setFormData({ amount: '', recipient_email: '', message: '', expires_at: '' });
      fetchGiftCards();
    } catch (error: any) {
      console.error('Error creating gift card:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeactivateGiftCard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gift_cards')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Gift Card Deactivated",
        description: "Gift card has been deactivated",
      });

      fetchGiftCards();
    } catch (error: any) {
      console.error('Error deactivating gift card:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const totalValue = giftCards.reduce((sum, card) => sum + card.amount, 0);
  const activeCards = giftCards.filter(card => card.is_active).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Gift className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Gift Cards</h1>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Gift Card
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card/90 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle>Create New Gift Card</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateGiftCard} className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    required
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="recipient_email">Recipient Email</Label>
                  <Input
                    id="recipient_email"
                    type="email"
                    value={formData.recipient_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, recipient_email: e.target.value }))}
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Input
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Optional gift message"
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                    className="bg-background/50"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  Create Gift Card
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Gift Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{giftCards.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Active Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{activeCards}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">${totalValue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Gift Cards Table */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Gift Cards</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {giftCards.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell className="font-mono">{card.code}</TableCell>
                      <TableCell>${card.amount.toFixed(2)}</TableCell>
                      <TableCell>{card.recipient_email || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={card.is_active ? "default" : "secondary"}>
                          {card.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(card.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {card.is_active && (
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeactivateGiftCard(card.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminGiftCards;
