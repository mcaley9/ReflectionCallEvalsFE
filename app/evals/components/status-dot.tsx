"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PhaseDetails } from "./phase-details";

interface StatusDotProps {
  status: string | null;
  uniqueId?: string | null;
  existingFeedback?: {
    sentiment: 'up' | 'down' | null;
    is_flagged: boolean;
    override_status: string | null;
    comment: string | null;
  };
  phaseType: string;
  id: string;
}

export function StatusDot({
  status,
  uniqueId,
  existingFeedback,
  phaseType,
  id
}: StatusDotProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusColor = (status: string | null) => {
    if (!status) return "bg-gray-200";
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "yes":
      case "true":
        return "bg-green-500";
      case "partial":
        return "bg-yellow-500";
      case "no":
      case "false":
        return "bg-red-500";
      case "notreached":
        return "bg-gray-400";
      default:
        return "bg-gray-200";
    }
  };

  const dotColor = existingFeedback?.override_status 
    ? getStatusColor(existingFeedback.override_status)
    : getStatusColor(status);

  const dotClasses = cn(
    "w-4 h-4 rounded-full cursor-pointer transition-all duration-200",
    dotColor,
    existingFeedback?.is_flagged && "ring-2 ring-red-500",
    existingFeedback?.sentiment === 'up' && "ring-2 ring-green-500",
    existingFeedback?.sentiment === 'down' && "ring-2 ring-yellow-500"
  );

  return (
    <>
      <PhaseDetails
        id={id}
        phaseType={phaseType}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentStatus={status || ''}
        uniqueId={uniqueId || ''}
      >
        <Tooltip>
          <TooltipTrigger>
            <div className={dotClasses} />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs whitespace-pre-wrap">
              {existingFeedback?.comment || "No additional details"}
            </p>
          </TooltipContent>
        </Tooltip>
      </PhaseDetails>
    </>
  );
}