
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, Gift, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newGiftCard, setNewGiftCard] = useState({
    amount: "",
    recipient_email: "",
    message: "",
    expires_at: ""
  });

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const fetchGiftCards = async () => {
    try {
      const { data, error } = await supabase
        .from("gift_cards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGiftCards(data || []);
    } catch (error: any) {
      console.error("Error fetching gift cards:", error);
      toast({
        title: "Error fetching gift cards",
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
    return result;
  };

  const createGiftCard = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const giftCardData = {
        code: generateGiftCardCode(),
        amount: parseFloat(newGiftCard.amount),
        initial_amount: parseFloat(newGiftCard.amount),
        recipient_email: newGiftCard.recipient_email || null,
        message: newGiftCard.message || null,
        expires_at: newGiftCard.expires_at || null,
        created_by: user.id,
        is_active: true
      };

      const { error } = await supabase
        .from("gift_cards")
        .insert(giftCardData);

      if (error) throw error;

      toast({
        title: "Gift card created",
        description: "New gift card has been created successfully",
      });

      setNewGiftCard({
        amount: "",
        recipient_email: "",
        message: "",
        expires_at: ""
      });
      setIsDialogOpen(false);
      fetchGiftCards();
    } catch (error: any) {
      console.error("Error creating gift card:", error);
      toast({
        title: "Error creating gift card",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleGiftCardStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("gift_cards")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Gift card updated",
        description: `Gift card ${!currentStatus ? "activated" : "deactivated"}`,
      });

      fetchGiftCards();
    } catch (error: any) {
      console.error("Error updating gift card:", error);
      toast({
        title: "Error updating gift card",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredGiftCards = giftCards.filter(card =>
    card.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (card.recipient_email && card.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Gift Card Manager</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Gift Card
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Gift Card</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-foreground">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newGiftCard.amount}
                  onChange={(e) => setNewGiftCard(prev => ({ ...prev, amount: e.target.value }))}
                  className="bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="recipient" className="text-foreground">Recipient Email (Optional)</Label>
                <Input
                  id="recipient"
                  type="email"
                  placeholder="recipient@example.com"
                  value={newGiftCard.recipient_email}
                  onChange={(e) => setNewGiftCard(prev => ({ ...prev, recipient_email: e.target.value }))}
                  className="bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-foreground">Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Gift card message..."
                  value={newGiftCard.message}
                  onChange={(e) => setNewGiftCard(prev => ({ ...prev, message: e.target.value }))}
                  className="bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="expires" className="text-foreground">Expires At (Optional)</Label>
                <Input
                  id="expires"
                  type="date"
                  value={newGiftCard.expires_at}
                  onChange={(e) => setNewGiftCard(prev => ({ ...prev, expires_at: e.target.value }))}
                  className="bg-background text-foreground"
                />
              </div>
              <Button onClick={createGiftCard} className="w-full">
                Create Gift Card
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Gift Cards</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search gift cards..."
              className="pl-10 bg-background text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredGiftCards.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No gift cards found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "No gift cards match your search." : "Create your first gift card to get started."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredGiftCards.map((card) => (
                <Card key={card.id} className="bg-background border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-primary" />
                          <span className="font-mono text-sm font-medium text-foreground">{card.code}</span>
                          <Badge variant={card.is_active ? "default" : "secondary"}>
                            {card.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span>${card.amount.toFixed(2)} / ${card.initial_amount.toFixed(2)}</span>
                          </div>
                          {card.expires_at && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Expires {format(new Date(card.expires_at), "MMM d, yyyy")}</span>
                            </div>
                          )}
                        </div>
                        {card.recipient_email && (
                          <p className="text-sm text-muted-foreground">To: {card.recipient_email}</p>
                        )}
                        {card.message && (
                          <p className="text-sm text-muted-foreground italic">"{card.message}"</p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleGiftCardStatus(card.id, card.is_active)}
                      >
                        {card.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GiftCardManager;
