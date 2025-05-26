
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  verified_purchase: boolean;
  user_id: string;
  product_id: string;
  products?: {
    name: string;
  };
  profiles?: {
    display_name: string;
    email: string;
  };
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // Get reviews first
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      // Get products and profiles separately
      const reviewsWithDetails = await Promise.all(
        (reviewsData || []).map(async (review) => {
          const [productResult, profileResult] = await Promise.all([
            supabase
              .from('products')
              .select('name')
              .eq('id', review.product_id)
              .single(),
            supabase
              .from('profiles')
              .select('display_name, email')
              .eq('id', review.user_id)
              .single()
          ]);

          return {
            ...review,
            products: productResult.data,
            profiles: profileResult.data
          };
        })
      );

      setReviews(reviewsWithDetails);
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
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Reviews Management</h1>
          <Badge variant="outline" className="animate-pulse">
            {reviews.length} Total Reviews
          </Badge>
        </div>

        <div className="grid gap-6">
          {reviews.map((review, index) => (
            <Card key={review.id} className="animate-slide-in-up hover:shadow-lg transition-all duration-300" style={{animationDelay: `${index * 100}ms`}}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="font-medium">{review.rating}/5</span>
                      {review.verified_purchase && (
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{review.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:scale-105 transition-transform"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Product
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteReview(review.id)}
                      className="hover:scale-105 transition-transform"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{review.comment}</p>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="space-y-1">
                    <p className="font-medium">Product: {review.products?.name || 'Unknown Product'}</p>
                    <p className="text-sm text-muted-foreground">
                      By: {review.profiles?.display_name || review.profiles?.email || 'Anonymous'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {reviews.length === 0 && (
            <Card className="animate-fade-in">
              <CardContent className="text-center py-8">
                <Star className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
                <p className="text-muted-foreground">
                  Customer reviews will appear here once they start reviewing products.
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
