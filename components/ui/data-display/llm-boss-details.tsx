"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LLMBossDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function LLMBossDetails({ open, onOpenChange, data }: LLMBossDetailsProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>LLM Boss Analysis Details</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Scores</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Technical Score:</span> {data.technicalScore ?? 'N/A'}</p>
                <p><span className="font-medium">Conversation Score:</span> {data.conversationScore ?? 'N/A'}</p>
                <p><span className="font-medium">Overall Score:</span> {data.overallScore ?? 'N/A'}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Status</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Smoothness Level:</span> {data.smoothnessLevel ?? 'N/A'}</p>
                <p><span className="font-medium">Confidence Level:</span> {data.confidenceLevel ?? 'N/A'}</p>
                <p><span className="font-medium">Status:</span> {data.status ?? 'N/A'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Assessment Summary</h3>
            <p className="text-sm whitespace-pre-wrap">{data.assessmentSummary ?? 'N/A'}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Technical Analysis</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Highlights</h4>
                <pre className="text-sm bg-gray-50 p-3 rounded-md overflow-x-auto">
                  {formatJsonb(data.technicalHighlights)}
                </pre>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Issues</h4>
                <pre className="text-sm bg-gray-50 p-3 rounded-md overflow-x-auto">
                  {formatJsonb(data.technicalIssues)}
                </pre>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Recommendations</h4>
                <pre className="text-sm bg-gray-50 p-3 rounded-md overflow-x-auto">
                  {formatJsonb(data.technicalRecommendations)}
                </pre>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Conversation Analysis</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Highlights</h4>
                <pre className="text-sm bg-gray-50 p-3 rounded-md overflow-x-auto">
                  {formatJsonb(data.conversationHighlights)}
                </pre>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Issues</h4>
                <pre className="text-sm bg-gray-50 p-3 rounded-md overflow-x-auto">
                  {formatJsonb(data.conversationIssues)}
                </pre>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Recommendations</h4>
                <pre className="text-sm bg-gray-50 p-3 rounded-md overflow-x-auto">
                  {formatJsonb(data.conversationalRecommendations)}
                </pre>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Additional Information</h3>
            <div className="space-y-2">
              <div>
                <h4 className="text-sm font-medium mb-1">Key Factors</h4>
                <pre className="text-sm bg-gray-50 p-3 rounded-md overflow-x-auto">
                  {formatJsonb(data.keyFactors)}
                </pre>
              </div>
              <p><span className="font-medium">Improvement Priority:</span> {data.improvementPriority ?? 'N/A'}</p>
              <p><span className="font-medium">Created At:</span> {formatDate(data.createdAt)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 