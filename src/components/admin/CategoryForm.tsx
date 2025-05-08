
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface CategoryFormProps {
  onSuccess?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !slug) {
      toast({
        title: "Missing fields",
        description: "Please provide a name for the category.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name,
          slug,
          description,
          image
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Category created",
        description: `The category "${name}" has been created successfully.`
      });
      
      // Reset form
      setName("");
      setSlug("");
      setDescription("");
      setImage("");
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error("Error creating category:", error);
      toast({
        title: "Error creating category",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Category</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => handleNameChange(e.target.value)} 
              placeholder="Category name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input 
              id="slug" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)}
              placeholder="category-slug"
              required
            />
            <p className="text-xs text-gray-500">
              Used in URLs. Only lowercase letters, numbers, and hyphens.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the category"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input 
              id="image" 
              value={image} 
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <CardFooter className="px-0 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Category
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
