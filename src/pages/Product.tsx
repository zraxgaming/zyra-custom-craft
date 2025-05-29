
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/components/cart/CartProvider';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Star, Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Product } from '@/types/product';

const ProductPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState({
    text: '',
    color: '#000000',
    image: null as File | null
  });
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchProduct();
      fetchReviews();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            first_name,
            last_name
          )
        `)
        .eq('product_id', product?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart({
        productId: product.id,
        quantity,
        customization: product.is_customizable ? customization : undefined
      });

      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product) return;

    setSubmittingReview(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: product.id,
          user_id: user.id,
          rating: newReview.rating,
          title: newReview.title,
          comment: newReview.comment
        });

      if (error) throw error;

      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
      });

      setNewReview({ rating: 5, title: '', comment: '' });
      fetchReviews();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/shop">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <img
              src={product.images?.[0] || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full rounded-lg shadow-lg animate-scale-in"
            />
          </div>

          <div className="space-y-6 animate-slide-in-right">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-semibold text-primary mb-4">${product.price}</p>
              
              {product.rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.review_count} reviews)
                  </span>
                </div>
              )}

              <p className="text-muted-foreground mb-6">{product.description}</p>
            </div>

            {product.is_customizable && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Customization Options</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="custom-text">Custom Text</Label>
                      <Input
                        id="custom-text"
                        value={customization.text}
                        onChange={(e) => setCustomization(prev => ({ ...prev, text: e.target.value }))}
                        placeholder="Enter custom text"
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-color">Color</Label>
                      <Input
                        id="custom-color"
                        type="color"
                        value={customization.color}
                        onChange={(e) => setCustomization(prev => ({ ...prev, color: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="quantity">Quantity:</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20"
                />
              </div>
              <Button onClick={handleAddToCart} className="flex-1 hover:scale-105 transition-transform">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          
          {user && (
            <Card className="animate-scale-in">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Write a Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <Label>Rating</Label>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 cursor-pointer transition-colors ${
                            star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                          onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="review-title">Title</Label>
                    <Input
                      id="review-title"
                      value={newReview.title}
                      onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Review title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="review-comment">Comment</Label>
                    <Textarea
                      id="review-comment"
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Write your review"
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {reviews.map((review: any) => (
              <Card key={review.id} className="animate-slide-in-up">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{review.title}</span>
                  </div>
                  <p className="text-muted-foreground mb-2">{review.comment}</p>
                  <p className="text-sm text-muted-foreground">
                    by {review.profiles?.first_name || 'Anonymous'} on {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
