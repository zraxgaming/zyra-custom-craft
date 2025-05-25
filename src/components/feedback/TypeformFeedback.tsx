
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface TypeformFeedbackProps {
  typeformId?: string;
  triggerText?: string;
  className?: string;
}

const TypeformFeedback: React.FC<TypeformFeedbackProps> = ({
  typeformId = "GcTxpZxC",
  triggerText = "Give Feedback",
  className = ""
}) => {
  useEffect(() => {
    // Load TypeForm embed script
    const script = document.createElement('script');
    script.src = 'https://embed.typeform.com/next/embed.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const openTypeform = () => {
    // Use TypeForm's popup method if available
    if (window.tf && window.tf.createPopup) {
      const popup = window.tf.createPopup(typeformId, {
        autoClose: 3000,
        hideHeaders: true,
        hideFooter: true,
        onSubmit: () => {
          console.log('Thank you for your feedback!');
        }
      });
      popup.open();
    } else {
      // Fallback to opening in new tab
      window.open(`https://form.typeform.com/to/${typeformId}`, '_blank');
    }
  };

  return (
    <Button
      onClick={openTypeform}
      variant="outline"
      className={`rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 border-primary ${className}`}
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      {triggerText}
    </Button>
  );
};

// Extend window object for TypeScript
declare global {
  interface Window {
    tf?: {
      createPopup: (formId: string, options?: any) => {
        open: () => void;
        close: () => void;
      };
    };
  }
}

export default TypeformFeedback;
