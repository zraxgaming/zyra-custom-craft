import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
}

const Product = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) {
          throw error;
        }

        setProduct(data);
      } catch (error: any) {
        toast({
          title: "Error fetching product",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*, user:user_id(user_metadata)")
          .eq("product_id", product?.id)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        const formattedReviews = data.map((review: any) => ({
          id: review.id,
          user_id: review.user_id,
          product_id: review.product_id,
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at,
          user_name: review.user?.user_metadata?.full_name || "Anonymous",
        }));

        setReviews(formattedReviews);
      } catch (error: any) {
        toast({
          title: "Error fetching reviews",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchProduct();

    if (product?.id) {
      fetchReviews();
    }
  }, [slug, product?.id, toast]);

  useEffect(() => {
    if (product?.id) {
      const fetchReviews = async () => {
        try {
          const { data, error } = await supabase
            .from("reviews")
            .select("*, user:user_id(user_metadata)")
            .eq("product_id", product?.id)
            .order("created_at", { ascending: false });

          if (error) {
            throw error;
          }

          const formattedReviews = data.map((review: any) => ({
            id: review.id,
            user_id: review.user_id,
            product_id: review.product_id,
            rating: review.rating,
            comment: review.comment,
            created_at: review.created_at,
            user_name: review.user?.user_metadata?.full_name || "Anonymous",
          }));

          setReviews(formattedReviews);
        } catch (error: any) {
          toast({
            title: "Error fetching reviews",
            description: error.message,
            variant: "destructive",
          });
        }
      };
      fetchReviews();
    }
  }, [product?.id, toast]);

  const handleAddReview = async () => {
    if (!user) {
      toast({
        title: "You must be logged in to add a review",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("reviews").insert({
        user_id: user.id,
        product_id: product.id,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      if (error) {
        throw error;
      }

      setNewReview({ rating: 5, comment: "" });
      toast({ title: "Review added successfully!" });

      // Refresh reviews
      const { data, error: fetchError } = await supabase
        .from("reviews")
        .select("*, user:user_id(user_metadata)")
        .eq("product_id", product?.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const formattedReviews = data.map((review: any) => ({
        id: review.id,
        user_id: review.user_id,
        product_id: review.product_id,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at,
        user_name: review.user?.user_metadata?.full_name || "Anonymous",
      }));

      setReviews(formattedReviews);
    } catch (error: any) {
      toast({
        title: "Error adding review",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div>
      {/* ... product details ... */}
      <section>
        <h3 className="font-semibold text-lg mt-4">Customer Reviews</h3>
        <div>
          {reviews.map((review: Review) => (
            <div key={review.id} className="p-4 border-b">
              <div className="flex gap-2">
                <div className="font-medium">{review.user_name}</div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm mt-1">{review.comment}</div>
              {/* NO edit/delete options! */}
              {/* <Button>Edit</Button> <Button>Delete</Button> <-- DO NOT RENDER */}
            </div>
          ))}
        </div>
        {/* Allow adding more reviews: show review form always */}
        <div className="mt-4">
          <h4 className="font-medium mb-2">Add a Review</h4>
          <div>
            <Label htmlFor="rating">Rating</Label>
            <Input
              type="number"
              id="rating"
              min="1"
              max="5"
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: parseInt(e.target.value) })
              }
            />
          </div>
          <div>
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
            />
          </div>
          <Button onClick={handleAddReview} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Product;
