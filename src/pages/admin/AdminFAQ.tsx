
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_published: boolean;
}

const AdminFAQ = () => {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    sort_order: 0,
    is_published: true
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      // Mock data since table might not exist yet
      const mockFaqs: FAQ[] = [
        {
          id: '1',
          question: 'How do I place a custom order?',
          answer: 'You can place a custom order by selecting a product and clicking the "Customize" button.',
          category: 'Orders',
          sort_order: 1,
          is_published: true
        },
        {
          id: '2',
          question: 'What payment methods do you accept?',
          answer: 'We accept PayPal, credit cards, and Ziina payments.',
          category: 'Payment',
          sort_order: 2,
          is_published: true
        }
      ];
      setFaqs(mockFaqs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        // Update existing FAQ
        const updatedFaqs = faqs.map(faq => 
          faq.id === editingFaq.id 
            ? { ...editingFaq, ...formData }
            : faq
        );
        setFaqs(updatedFaqs);
        toast({
          title: "Success",
          description: "FAQ updated successfully"
        });
      } else {
        // Create new FAQ
        const newFaq: FAQ = {
          id: Date.now().toString(),
          ...formData
        };
        setFaqs([...faqs, newFaq]);
        toast({
          title: "Success",
          description: "FAQ created successfully"
        });
      }

      // Reset form
      setFormData({
        question: '',
        answer: '',
        category: 'General',
        sort_order: 0,
        is_published: true
      });
      setEditingFaq(null);
    } catch (error: any) {
      console.error('Error saving FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to save FAQ",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      sort_order: faq.sort_order,
      is_published: faq.is_published
    });
  };

  const handleDelete = async (id: string) => {
    try {
      setFaqs(faqs.filter(faq => faq.id !== id));
      toast({
        title: "Success",
        description: "FAQ deleted successfully"
      });
    } catch (error: any) {
      console.error('Error deleting FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">FAQ Management</h1>
      </div>

      {/* FAQ Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Orders">Orders</SelectItem>
                    <SelectItem value="Payment">Payment</SelectItem>
                    <SelectItem value="Shipping">Shipping</SelectItem>
                    <SelectItem value="Returns">Returns</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                rows={4}
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
              <Label htmlFor="is_published">Published</Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingFaq ? 'Update FAQ' : 'Create FAQ'}
              </Button>
              {editingFaq && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingFaq(null);
                    setFormData({
                      question: '',
                      answer: '',
                      category: 'General',
                      sort_order: 0,
                      is_published: true
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* FAQs List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Existing FAQs</h2>
        {faqs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No FAQs found</p>
            </CardContent>
          </Card>
        ) : (
          faqs.map((faq) => (
            <Card key={faq.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                        {faq.category}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Order: {faq.sort_order}
                      </span>
                      {faq.is_published ? (
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                          Published
                        </span>
                      ) : (
                        <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(faq)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(faq.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminFAQ;
