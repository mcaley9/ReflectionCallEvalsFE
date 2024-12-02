"use client";

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
import { useState, useEffect } from "react";
import { submitFeedback } from "@/app/actions/feedback-actions";
import { useToast } from "@/components/ui/use-toast";

interface LLMBossDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: string;
  uniqueId: string;
  existingFeedback?: {
    sentiment: 'up' | 'down' | null;
    is_flagged: boolean;
    override_status: "yes" | "partial" | "no" | "notreached" | null;
    comment: string | null;
  };
  data: {
    smoothnessLevel: string | null;
    technicalScore: number | null;
    conversationScore: number | null;
    overallScore: number | null;
    confidenceLevel: string | null;
    technicalHighlights: any | null;
    technicalIssues: any | null;
    conversationHighlights: any | null;
    conversationIssues: any | null;
    assessmentSummary: string | null;
    keyFactors: any | null;
    technicalRecommendations: any | null;
    conversationalRecommendations: any | null;
    improvementPriority: string | null;
    status: string | null;
    createdAt: Date | null;
  };
}

export function LLMBossDetails({ 
  open, 
  onOpenChange, 
  data, 
  currentStatus,
  uniqueId,
  existingFeedback 
}: LLMBossDetailsProps) {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [isFlagged, setIsFlagged] = useState(false);
  const [comment, setComment] = useState('');
  const [overrideStatus, setOverrideStatus] = useState<"yes" | "partial" | "no" | "notreached" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing feedback when dialog opens
  useEffect(() => {
    if (open && existingFeedback) {
      setFeedback(existingFeedback.sentiment);
      setIsFlagged(existingFeedback.is_flagged);
      if (existingFeedback.override_status === "yes" || 
          existingFeedback.override_status === "partial" || 
          existingFeedback.override_status === "no" || 
          existingFeedback.override_status === "notreached" || 
          existingFeedback.override_status === null) {
        setOverrideStatus(existingFeedback.override_status);
      }
      setComment(existingFeedback.comment || '');
    }
  }, [open, existingFeedback]);

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  const formatJsonb = (data: any) => {
    if (!data) return 'N/A';
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return data;
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      setIsSubmitting(true);
      await submitFeedback({
        uniqueId,
        phaseType: null, // null for boss feedback
        feedbackType: 'boss',
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
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>LLM Boss Analysis Details</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Smoothness Level:</span> {data.smoothnessLevel ?? 'N/A'}</p>
              <p><span className="font-medium">Confidence Level:</span> {data.confidenceLevel ?? 'N/A'}</p>
              <p><span className="font-medium">Status:</span> {data.status ?? 'N/A'}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Assessment Summary</h3>
            <p className="text-sm whitespace-pre-wrap">{data.assessmentSummary ?? 'N/A'}</p>
          </div>
        </div>

        <div className="mt-6 space-y-2 border-t pt-4">
          <h3 className="font-semibold text-sm">Status</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>AI Status:</span>
            <span className="font-medium">{currentStatus}</span>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Override Status</Label>
            <RadioGroup
              value={overrideStatus ?? ""}
              onValueChange={(value: "yes" | "partial" | "no" | "notreached") => setOverrideStatus(value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="boss-yes" />
                <Label htmlFor="boss-yes" className="text-green-600 font-medium">Green</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partial" id="boss-partial" />
                <Label htmlFor="boss-partial" className="text-yellow-600 font-medium">Yellow</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="boss-no" />
                <Label htmlFor="boss-no" className="text-red-600 font-medium">Red</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="notreached" id="boss-notreached" />
                <Label htmlFor="boss-notreached" className="text-gray-400 font-medium">Grey</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t pt-4">
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
      </DialogContent>
    </Dialog>
  );
} 