
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, ExternalLink } from "lucide-react";

interface TypeformFeedbackProps {
  typeformId?: string;
  triggerText?: string;
  className?: string;
  openInNewTab?: boolean;
}

const TypeformFeedback: React.FC<TypeformFeedbackProps> = ({
  typeformId = "GcTxpZxC",
  triggerText = "Give Feedback",
  className = "",
  openInNewTab = false
}) => {
  useEffect(() => {
    if (!openInNewTab) {
      // Load TypeForm embed script only if not opening in new tab
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
    }
  }, [openInNewTab]);

  const openTypeform = () => {
    if (openInNewTab) {
      // Open in new tab/window
      window.open(`https://form.typeform.com/to/${typeformId}`, '_blank', 'width=800,height=600');
    } else {
      // Use TypeForm's popup method if available
      if (window.tf && window.tf.createPopup) {
        const popup = window.tf.createPopup(typeformId, {
          autoClose: 3000,
          hideHeaders: true,
          hideFooter: true,
          width: 800,
          height: 600,
          onSubmit: () => {
            console.log('Thank you for your feedback!');
          }
        });
        popup.open();
      } else {
        // Fallback to opening in new tab
        window.open(`https://form.typeform.com/to/${typeformId}`, '_blank');
      }
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
      {openInNewTab && <ExternalLink className="w-3 h-3 ml-2" />}
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
