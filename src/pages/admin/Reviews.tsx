
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Search, Trash2, MessageSquare, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  verified_purchase: boolean;
  created_at: string;
  products?: {
    name: string;
    images: string[];
  };
  profiles?: {
    display_name?: string;
    first_name?: string;
    last_name?: string;
  };
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          title,
          comment,
          verified_purchase,
          created_at,
          products (name, images),
          profiles (display_name, first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(reviews.filter(review => review.id !== reviewId));
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        } animate-scale-in`}
        style={{animationDelay: `${i * 0.1}s`}}
      />
    ));
  };

  const getCustomerName = (profiles: any) => {
    if (!profiles) return 'Anonymous';
    return `${profiles.first_name || ''} ${profiles.last_name || ''}`.trim() 
           || profiles.display_name 
           || 'Anonymous';
  };

  const filteredReviews = reviews.filter(review =>
    review.products?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between animate-slide-in-left">
          <h1 className="text-3xl font-bold">Reviews Management</h1>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="animate-scale-in hover-3d-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold animate-bounce-in">{reviews.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in hover-3d-lift" style={{animationDelay: '0.1s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 animate-bounce-in">
                {averageRating.toFixed(1)}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in hover-3d-lift" style={{animationDelay: '0.2s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Purchases</CardTitle>
              <Badge className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 animate-bounce-in">
                {reviews.filter(r => r.verified_purchase).length}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in hover-3d-lift" style={{animationDelay: '0.3s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">5-Star Reviews</CardTitle>
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 animate-bounce-in">
                {reviews.filter(r => r.rating === 5).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-slide-in-up">
          <CardHeader>
            <CardTitle>Search Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product, comment, or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 hover-magnetic"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {filteredReviews.map((review, index) => (
            <Card key={review.id} className="animate-slide-in-up hover:shadow-lg transition-all duration-300 hover-3d-lift" style={{animationDelay: `${index * 100}ms`}}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{getCustomerName(review.profiles)}</span>
                        {review.verified_purchase && (
                          <Badge variant="secondary" className="text-xs animate-scale-in">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <p className="font-medium text-primary">
                        {review.products?.name || 'Unknown Product'}
                      </p>
                      {review.title && (
                        <h4 className="font-semibold mt-2">{review.title}</h4>
                      )}
                      {review.comment && (
                        <p className="text-muted-foreground mt-2 leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    {review.products?.images && review.products.images.length > 0 && (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden animate-scale-in">
                        <img 
                          src={review.products.images[0]} 
                          alt={review.products.name}
                          className="w-full h-full object-cover hover-3d-lift"
                        />
                      </div>
                    )}
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteReview(review.id)}
                      className="hover-3d-lift"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredReviews.length === 0 && (
            <Card className="animate-fade-in">
              <CardContent className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4 animate-bounce" />
                <h3 className="text-lg font-medium mb-2">No Reviews Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "No reviews match your search." : "No reviews have been submitted yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
