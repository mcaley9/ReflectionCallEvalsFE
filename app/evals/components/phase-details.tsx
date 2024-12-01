'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, Flag } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { submitFeedback } from "@/app/actions/feedback-actions";
import { useToast } from "@/components/ui/use-toast";

interface PhaseDetailsProps {
  id: string;
  phaseType: string;
  details: string | null;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  currentStatus: string;
  uniqueId: string;
  existingFeedback?: {
    sentiment: 'up' | 'down' | null;
    is_flagged: boolean;
    override_status: string | null;
    comment: string | null;
  };
}

export function PhaseDetails({ 
  id, 
  phaseType, 
  details, 
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  currentStatus,
  uniqueId,
  existingFeedback
}: PhaseDetailsProps) {
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [isFlagged, setIsFlagged] = useState(false);
  const [comment, setComment] = useState('');
  const [overrideStatus, setOverrideStatus] = useState<'yes' | 'partial' | 'no' | 'notreached' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen;

  // Load existing feedback when dialog opens
  useEffect(() => {
    if (open && existingFeedback) {
      setFeedback(existingFeedback.sentiment);
      setIsFlagged(existingFeedback.is_flagged);
      setOverrideStatus(existingFeedback.override_status);
      setComment(existingFeedback.comment || '');
    }
  }, [open, existingFeedback]);

  const handleClick = () => {
    if (onOpenChange) {
      onOpenChange(true);
    }
  };

  const formatDetails = (details: string | null) => {
    if (!details) return 'No details available';
    
    try {
      const parsed = typeof details === 'string' ? JSON.parse(details) : details;
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return details;
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      setIsSubmitting(true);
      await submitFeedback({
        uniqueId,
        phaseType,
        feedbackType: 'phase',
        sentiment: feedback,
        isFlagged,
        overrideStatus,
        comment: comment || null
      });

      toast({
        title: "Feedback submitted",
        description: "Your feedback has been saved successfully.",
      });

      // Close the dialog
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {children && (
        <div onClick={handleClick} className="cursor-pointer">
          {children}
        </div>
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {phaseType.charAt(0).toUpperCase() + phaseType.slice(1)} Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-[400px] text-sm whitespace-pre-wrap">
              {formatDetails(details)}
            </pre>
          </div>

          {/* Status Override Section */}
          <div className="mt-6 space-y-2 border-t pt-4">
            <h3 className="font-semibold text-sm">Status</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>AI Status:</span>
              <span className="font-medium">{currentStatus}</span>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Override Status</Label>
              <RadioGroup
                value={overrideStatus || ""}
                onValueChange={setOverrideStatus}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partial" id="partial" />
                  <Label htmlFor="partial">Partial</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="notreached" id="notreached" />
                  <Label htmlFor="notreached">Not Reached</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mt-6 space-y-4">
            <div className="flex gap-4 items-center">
              <Button
                variant={feedback === 'up' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                Good
              </Button>
              <Button
                variant={feedback === 'down' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
              >
                <ThumbsDown className="w-4 h-4 mr-1" />
                Bad
              </Button>
              <Button
                variant={isFlagged ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsFlagged(!isFlagged)}
              >
                <Flag className="w-4 h-4 mr-1" />
                Flag
              </Button>
            </div>

            <Textarea
              placeholder="Add your comments here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />

            <Button 
              className="w-full"
              onClick={handleSubmitFeedback}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 