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
  publicUrl?: string;
  vapiCallId?: string | null;
  existingFeedback?: {
    sentiment: 'up' | 'down' | null;
    is_flagged: boolean;
    override_status: "yes" | "partial" | "no" | "notreached" | null;
    comment: string | null;
  };
}

// First, let's define a type for the valid status values
type StatusType = 'yes' | 'partial' | 'no' | 'notreached';

export function PhaseDetails({ 
  id, 
  phaseType, 
  details, 
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  currentStatus,
  uniqueId,
  publicUrl: propPublicUrl,
  vapiCallId: propVapiCallId,
  existingFeedback
}: PhaseDetailsProps) {
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [isFlagged, setIsFlagged] = useState(false);
  const [comment, setComment] = useState('');
  // Update the type of overrideStatus to match the RadioGroup values
  const [overrideStatus, setOverrideStatus] = useState<StatusType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen;

  // Load existing feedback when dialog opens
  useEffect(() => {
    if (open && existingFeedback) {
      setFeedback(existingFeedback.sentiment);
      setIsFlagged(existingFeedback.is_flagged);
      // Cast the override_status to StatusType if it matches one of the valid values
      if (existingFeedback.override_status && 
          ['yes', 'partial', 'no', 'notreached'].includes(existingFeedback.override_status)) {
        setOverrideStatus(existingFeedback.override_status as StatusType);
      } else {
        setOverrideStatus(null);
      }
      setComment(existingFeedback.comment || '');
    }
  }, [open, existingFeedback]);

  const handleClick = () => {
    if (onOpenChange) {
      onOpenChange(true);
    }
  };

  const formatDetails = (details: string | null) => {
    if (!details) return { formattedText: 'No details available', publicUrl: null, vapiCallId: null };
    
    try {
      const parsed = typeof details === 'string' ? JSON.parse(details) : details;
      console.log('PhaseDetails - Initial Parsed Data:', parsed);
      
      // Extract publicUrl and vapiCallId before any other processing
      const parsedPublicUrl = parsed.publicUrl || null;
      const vapiCallId = parsed.vapiCallId || null;
      console.log('PhaseDetails - Extracted VapiCallId:', vapiCallId);
      
      let formattedText;
      if (phaseType === 'session') {
        // Format regular session details
        const regularDetails = Object.entries(parsed)
          .filter(([key]) => key !== 'timeline' && key !== 'publicUrl')
          .map(([key, value]) => `${key}: ${value || 'N/A'}`)
          .join('\n');
        
        // Format timeline if it exists
        const timeline = parsed.timeline;
        
        formattedText = regularDetails;
        if (timeline) {
          const formattedTimeline = typeof timeline === 'string' ? timeline : JSON.stringify(timeline, null, 2);
          formattedText = `${regularDetails}\n\nTimeline:\n${formattedTimeline}`;
        }
      } else {
        // For all other phase types
        formattedText = JSON.stringify(parsed, null, 2);
      }
      
      return {
        formattedText,
        publicUrl: parsedPublicUrl,
        vapiCallId
      };
    } catch (e) {
      console.error('PhaseDetails - Error parsing details:', e);
      // If parsing fails, return the original string
      return {
        formattedText: details,
        publicUrl: null,
        vapiCallId: null
      };
    }
  };

  const formattedResult = formatDetails(details);
  const detailsText = formattedResult.formattedText;
  const detailsPublicUrl = formattedResult.publicUrl;
  const detailsVapiCallId = formattedResult.vapiCallId;
  
  // Use either the prop values or the ones from details
  const finalPublicUrl = propPublicUrl || detailsPublicUrl;
  const finalVapiCallId = propVapiCallId || detailsVapiCallId;

  console.log('PhaseDetails - Final Values:', {
    propVapiCallId,
    detailsVapiCallId,
    finalVapiCallId,
    phaseType
  });

  console.log('Details:', details);
  console.log('Formatted Result:', formattedResult);
  console.log('Public URL:', detailsPublicUrl);

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

  // Add a handler for RadioGroup value changes
  const handleStatusChange = (value: string) => {
    if (value === '') {
      setOverrideStatus(null);
    } else if (['yes', 'partial', 'no', 'notreached'].includes(value)) {
      setOverrideStatus(value as StatusType);
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
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>
              {phaseType === 'session' ? 'Session Details' : 
                `${phaseType.charAt(0).toUpperCase() + phaseType.slice(1)} Details`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-[400px] text-sm whitespace-pre-wrap">
              {detailsText}
            </pre>
          </div>

          {/* PostHog URL and VapiCall URL */}
          <div className="mt-2 flex justify-end gap-2">
            {finalPublicUrl && (
              <a 
                href={finalPublicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline text-sm px-3 py-2 rounded-md bg-blue-50"
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                View in PostHog
              </a>
            )}
            {finalVapiCallId && (
              <a 
                href={`https://dashboard.vapi.ai/calls/${finalVapiCallId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline text-sm px-3 py-2 rounded-md bg-blue-50"
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                View Call
              </a>
            )}
          </div>

          {/* Only show feedback section for non-session details */}
          {phaseType !== 'session' && (
            <>
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
                    onValueChange={handleStatusChange}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes" className="text-green-600 font-medium">Green</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="partial" id="partial" />
                      <Label htmlFor="partial" className="text-yellow-600 font-medium">Yellow</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no" className="text-red-600 font-medium">Red</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="notreached" id="notreached" />
                      <Label htmlFor="notreached" className="text-gray-400 font-medium">Grey</Label>
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
                    AI Got It Right
                  </Button>
                  <Button
                    variant={feedback === 'down' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                  >
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    AI Got It Wrong
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
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 