import React, { useState, useEffect } from 'react';
import { Star, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
  user_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
    display_name: string;
  };
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            display_name
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const allReviews = data || [];
      const currentUserReview = user ? allReviews.find(r => r.user_id === user.id) : null;
      const otherReviews = user ? allReviews.filter(r => r.user_id !== user.id) : allReviews;

      setReviews(otherReviews);
      setUserReview(currentUserReview || null);

      if (currentUserReview) {
        setReviewForm({
          rating: currentUserReview.rating,
          title: currentUserReview.title || '',
          comment: currentUserReview.comment || ''
        });
      }
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to write a review",
        variant: "destructive"
      });
      return;
    }

    try {
      const reviewData = {
        product_id: productId,
        user_id: user.id,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment
      };

      if (isEditing && userReview) {
        const { error } = await supabase
          .from('reviews')
          .update(reviewData)
          .eq('id', userReview.id);

        if (error) throw error;
        toast({ title: "Success", description: "Review updated successfully!" });
      } else {
        const { error } = await supabase
          .from('reviews')
          .insert(reviewData);

        if (error) throw error;
        toast({ title: "Success", description: "Review submitted successfully!" });
      }

      setIsWritingReview(false);
      setIsEditing(false);
      fetchReviews();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive"
      });
    }
  };

  const handleDeleteReview = async (reviewId: string, isOwnReview = false) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({ title: "Success", description: "Review deleted successfully!" });
      
      if (isOwnReview) {
        setUserReview(null);
        setReviewForm({ rating: 5, title: '', comment: '' });
      }
      
      fetchReviews();
    } catch (error: any) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive"
      });
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  const getDisplayName = (review: Review) => {
    if (review.profiles?.display_name) return review.profiles.display_name;
    if (review.profiles?.first_name && review.profiles?.last_name) {
      return `${review.profiles.first_name} ${review.profiles.last_name}`;
    }
    return 'Anonymous User';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User's Review Section */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Your Review
              {userReview && !isEditing && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteReview(userReview.id, true)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!userReview && !isWritingReview ? (
              <Button onClick={() => setIsWritingReview(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            ) : userReview && !isEditing ? (
              <div className="space-y-3">
                {renderStars(userReview.rating)}
                {userReview.title && (
                  <h4 className="font-semibold">{userReview.title}</h4>
                )}
                <p className="text-muted-foreground">{userReview.comment}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(userReview.created_at).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  {renderStars(reviewForm.rating, true, (rating) =>
                    setReviewForm(prev => ({ ...prev, rating }))
                  )}
                </div>

                <div>
                  <Label htmlFor="review-title">Title (Optional)</Label>
                  <Input
                    id="review-title"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Summary of your review"
                  />
                </div>

                <div>
                  <Label htmlFor="review-comment">Comment</Label>
                  <Textarea
                    id="review-comment"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your thoughts about this product..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex space-x-2">
                  <Button type="submit">
                    {isEditing ? 'Update Review' : 'Submit Review'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsWritingReview(false);
                      setIsEditing(false);
                      if (userReview) {
                        setReviewForm({
                          rating: userReview.rating,
                          title: userReview.title || '',
                          comment: userReview.comment || ''
                        });
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* Other Reviews */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">
          Customer Reviews ({reviews.length + (userReview ? 1 : 0)})
        </h3>

        {reviews.length === 0 && !userReview ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      {renderStars(review.rating)}
                      {review.verified_purchase && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className="font-medium">{getDisplayName(review)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {review.title && (
                  <h4 className="font-semibold mb-2">{review.title}</h4>
                )}
                <p className="text-muted-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
