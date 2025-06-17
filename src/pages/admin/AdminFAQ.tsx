
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

const AdminFAQ = () => {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    sort_order: 0,
    is_published: true
  });

  const categories = ['General', 'Orders', 'Payment', 'Shipping', 'Returns', 'Customization', 'Technical'];

  useEffect(() => {
    // Mock data for now
    const mockFaqs: FAQ[] = [
      {
        id: '1',
        question: 'How do I place a custom order?',
        answer: 'To place a custom order, browse our products and click on any item you\'d like to customize.',
        category: 'Orders',
        sort_order: 1,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit cards, PayPal, and Ziina for customers in the UAE.',
        category: 'Payment',
        sort_order: 2,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    setFaqs(mockFaqs);
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const faqData = {
        ...formData,
        id: editingId || Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingId) {
        // Update existing FAQ
        setFaqs(prev => prev.map(faq => 
          faq.id === editingId ? { ...faq, ...faqData } : faq
        ));
        toast({ title: "Success", description: "FAQ updated successfully!" });
      } else {
        // Add new FAQ
        setFaqs(prev => [...prev, faqData as FAQ]);
        toast({ title: "Success", description: "FAQ created successfully!" });
      }

      resetForm();
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
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      sort_order: faq.sort_order,
      is_published: faq.is_published
    });
    setEditingId(faq.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      setFaqs(prev => prev.filter(faq => faq.id !== id));
      toast({ title: "Success", description: "FAQ deleted successfully!" });
    } catch (error: any) {
      console.error('Error deleting FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      sort_order: 0,
      is_published: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">FAQ Management</h1>
          <Button onClick={() => setShowForm(true)} disabled={showForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>
        </div>

        {/* FAQ Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Edit FAQ' : 'Create New FAQ'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        sort_order: parseInt(e.target.value) || 0 
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="answer">Answer</Label>
                  <Textarea
                    id="answer"
                    value={formData.answer}
                    onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                  />
                  <Label htmlFor="is_published">Published</Label>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Create'} FAQ
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{faq.category}</Badge>
                      <Badge variant={faq.is_published ? "default" : "outline"}>
                        {faq.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground mb-4">{faq.answer}</p>
                    <p className="text-xs text-muted-foreground">
                      Sort Order: {faq.sort_order} | 
                      Created: {new Date(faq.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(faq)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(faq.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {faqs.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No FAQs found. Create your first FAQ to get started.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFAQ;
