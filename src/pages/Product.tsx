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
import SEOHead from "@/components/seo/SEOHead";

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
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
          .maybeSingle();

        if (error) throw error;
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

    fetchProduct();
  }, [slug, toast]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?.id) return;
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("product_id", product.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Fetch associated user display name (from profiles).
        const profileNames: Record<string, string> = {};
        for (const review of data) {
          if (!review.user_id) continue;
          if (!profileNames[review.user_id]) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("display_name, first_name, last_name")
              .eq("id", review.user_id)
              .maybeSingle();
            if (profile) {
              profileNames[review.user_id] =
                profile.display_name ||
                [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
                "Anonymous";
            } else {
              profileNames[review.user_id] = "Anonymous";
            }
          }
        }

        const formatted = data.map((review) => ({
          ...review,
          user_name: profileNames[review.user_id] || "Anonymous",
        }));

        setReviews(formatted);
      } catch (error: any) {
        toast({
          title: "Error fetching reviews",
          description: error.message,
          variant: "destructive",
        });
      }
    };
    fetchReviews();
  }, [product, toast]);

  const handleAddReview = async () => {
    if (!user) {
      toast({
        title: "You must be logged in to add a review",
        variant: "destructive",
      });
      return;
    }

    if (!newReview.rating) {
      toast({ title: "Rating required" });
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

      if (error) throw error;

      setNewReview({ rating: 5, comment: "" });
      toast({ title: "Review added successfully!" });

      // Refresh reviews
      const { data, error: fetchError } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", product.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const profileNames: Record<string, string> = {};
      for (const review of data) {
        if (!review.user_id) continue;
        if (!profileNames[review.user_id]) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, first_name, last_name")
            .eq("id", review.user_id)
            .maybeSingle();
          if (profile) {
            profileNames[review.user_id] =
              profile.display_name ||
              [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
              "Anonymous";
          } else {
            profileNames[review.user_id] = "Anonymous";
          }
        }
      }
      const formatted = data.map((review) => ({
        ...review,
        user_name: profileNames[review.user_id] || "Anonymous",
      }));
      setReviews(formatted);
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

  if (loading) return (
    <>
      <SEOHead
        title="Loading Product - Zyra Custom Craft"
        description="Loading product details..."
        url={`https://shopzyra.vercel.app/product/${slug}`}
      />
      <div>Loading product details...</div>
    </>
  );
  if (!product) return (
    <>
      <SEOHead
        title="Product Not Found - Zyra Custom Craft"
        description="The product you are looking for was not found."
        url={`https://shopzyra.vercel.app/product/${slug}`}
      />
      <div>Product not found.</div>
    </>
  );

  return (
    <>
      <SEOHead
        title={`${product.name} - Zyra Custom Craft`}
        description={product.description || "View product details, reviews and make it yours at Zyra Custom Craft."}
        url={`https://shopzyra.vercel.app/product/${slug}`}
        image={product.images?.[0]}
      />
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
                {/* NO edit or delete options! */}
              </div>
            ))}
          </div>
          {/* Always show the review form, allow adding multiple reviews */}
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
    </>
  );
};

export default Product;

// src/pages/Product.tsx is getting long! Consider asking to refactor it soon.
