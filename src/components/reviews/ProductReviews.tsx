
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  created_at: string;
  user_id: string;
  verified_purchase: boolean;
  profiles?: {
    first_name?: string;
    last_name?: string;
  };
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      // Simplified query without the problematic relation
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch user profiles separately if needed
      const reviewsWithProfiles = await Promise.all(
        (data || []).map(async (review) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', review.user_id)
            .single();
          
          return {
            ...review,
            profiles: profile
          };
        })
      );
      
      setReviews(reviewsWithProfiles);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to leave a review.",
        variant: "destructive",
      });
      return;
    }

    if (newReview.rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating: newReview.rating,
          title: newReview.title || null,
          comment: newReview.comment || null
        });

      if (error) throw error;

      toast({
        title: "Review submitted!",
        description: "Thank you for your review.",
      });

      setNewReview({ rating: 0, title: '', comment: '' });
      setShowReviewForm(false);
      fetchReviews();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-muted-foreground'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate?.(star)}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Customer Reviews
            {user && !showReviewForm && (
              <Button onClick={() => setShowReviewForm(true)}>
                Write a Review
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
            {renderStars(Math.round(averageRating))}
            <span className="text-muted-foreground">
              ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating *</label>
              {renderStars(newReview.rating, true, (rating) => 
                setNewReview(prev => ({ ...prev, rating }))
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Title (Optional)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Summary of your review"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Review (Optional)</label>
              <Textarea
                placeholder="Tell others about your experience with this product"
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSubmitReview}
                disabled={isSubmitting || newReview.rating === 0}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="animate-pulse space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-4 bg-muted rounded"></div>
                      <div className="w-32 h-4 bg-muted rounded"></div>
                    </div>
                    <div className="w-full h-4 bg-muted rounded"></div>
                    <div className="w-3/4 h-4 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {review.profiles?.first_name || 'Anonymous'}
                      {review.verified_purchase && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mb-2">
                  {renderStars(review.rating)}
                </div>
                
                {review.title && (
                  <h4 className="font-medium mb-1">{review.title}</h4>
                )}
                
                {review.comment && (
                  <p className="text-muted-foreground">{review.comment}</p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                No reviews yet. Be the first to review this product!
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
