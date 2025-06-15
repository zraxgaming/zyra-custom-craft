
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Upload } from "lucide-react";

interface ProductCustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (options: { text: string; imageBase64?: string }) => void;
  allowText?: boolean;
  allowImage?: boolean;
  maxTextLength?: number;
}

const ProductCustomizationModal: React.FC<ProductCustomizationModalProps> = ({
  open, onOpenChange, onSave, allowText = true, allowImage = true, maxTextLength = 80
}) => {
  const [customText, setCustomText] = useState("");
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!customImageFile) {
      setImagePreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(customImageFile);
  }, [customImageFile]);

  const handleSave = () => {
    if (allowText && !customText.trim()) {
      toast({ title: "Enter text", variant: "destructive" });
      return;
    }
    if (allowImage && !customImageFile) {
      toast({ title: "Upload image", variant: "destructive" });
      return;
    }
    if (allowImage && customImageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        onSave({ text: customText.trim(), imageBase64: reader.result as string });
        onOpenChange(false);
      };
      reader.readAsDataURL(customImageFile);
    } else {
      onSave({ text: customText.trim() });
      onOpenChange(false);
    }
  };

  const resetModal = () => {
    setCustomText("");
    setCustomImageFile(null);
    setImagePreview(null);
  };

  useEffect(() => {
    if (!open) resetModal();
    // eslint-disable-next-line
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {allowText && (
            <div>
              <Label htmlFor="customText">Custom Text *</Label>
              <Textarea
                id="customText"
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                maxLength={maxTextLength}
                placeholder="Enter your message"
                className="w-full"
                required
              />
              <p className="text-xs text-muted-foreground">{customText.length}/{maxTextLength} characters</p>
            </div>
          )}
          {allowImage && (
            <div>
              <Label htmlFor="customImage">Upload Image *</Label>
              <Input
                id="customImage"
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files ? e.target.files[0] : null;
                  setCustomImageFile(file);
                }}
              />
              {imagePreview && (
                <div className="mt-2"><img src={imagePreview} alt="Preview" className="h-24 rounded border" /></div>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}><ShoppingCart className="mr-2 h-4 w-4" />Add to Cart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ProductCustomizationModal;
