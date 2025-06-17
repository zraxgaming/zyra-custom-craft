
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';

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
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    sort_order: 0,
    is_published: true
  });

  const categories = ['General', 'Orders', 'Shipping', 'Returns', 'Products', 'Customization', 'Account', 'Payments'];

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      // Direct query without type checking
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('category', { ascending: true })
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('FAQ fetch error:', error);
        setFaqs([]);
      } else {
        setFaqs(data || []);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingFaq) {
        const { error } = await supabase
          .from('faqs')
          .update(formData)
          .eq('id', editingFaq.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "FAQ updated successfully!"
        });
      } else {
        const { error } = await supabase
          .from('faqs')
          .insert(formData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "FAQ created successfully!"
        });
      }

      setEditingFaq(null);
      setIsAdding(false);
      setFormData({
        question: '',
        answer: '',
        category: 'General',
        sort_order: 0,
        is_published: true
      });
      fetchFAQs();
    } catch (error: any) {
      console.error('Error saving FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to save FAQ",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "FAQ deleted successfully!"
      });
      fetchFAQs();
    } catch (error: any) {
      console.error('Error deleting FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive"
      });
    }
  };

  const startEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      sort_order: faq.sort_order,
      is_published: faq.is_published
    });
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      sort_order: 0,
      is_published: true
    });
  };

  const cancelEdit = () => {
    setEditingFaq(null);
    setIsAdding(false);
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      sort_order: 0,
      is_published: true
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage FAQs</h1>
          <Button onClick={startAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingFaq) && (
          <Card>
            <CardHeader>
              <CardTitle>{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Enter the FAQ question"
                />
              </div>

              <div>
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                  placeholder="Enter the FAQ answer"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                      {categories.map((category) => (
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
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
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
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FAQs List */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                        {faq.category}
                      </span>
                      {!faq.is_published && (
                        <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{faq.answer}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(faq)}
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
        </div>

        {faqs.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No FAQs found. Create your first FAQ to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFAQ;
