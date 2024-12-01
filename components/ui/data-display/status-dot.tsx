"use client";

import React, { useState } from "react";
import { PhaseDetails } from "./phase-details";
import { LLMBossDetails } from "./llm-boss-details";
import { getDetailedLLMBossResultByUniqueId } from "@/actions/llm-boss-actions";

type StatusDotProps = {
  value: boolean | string | null;
  details?: string | null;
  phaseType?: string;
  uniqueId?: string | null;
};

export function StatusDot({ value, details, phaseType, uniqueId }: StatusDotProps) {
  const [showLLMBossDetails, setShowLLMBossDetails] = useState(false);
  const [llmBossData, setLLMBossData] = useState<any>(null);
  const [showPhaseDetails, setShowPhaseDetails] = useState(false);
  let bgColor = "bg-gray-200";
  
  // Convert string values to lowercase for case-insensitive comparison
  const stringValue = typeof value === 'string' ? value.toLowerCase() : value;
  
  if (value === true || value === "true" || stringValue === "yes") bgColor = "bg-green-500";
  else if (value === false || value === "false" || stringValue === "missed") bgColor = "bg-red-500";
  else if (stringValue === "partial" || stringValue === "warning") bgColor = "bg-yellow-500";
  else if (stringValue === "notreached") bgColor = "bg-black";
  else if (value === null) bgColor = "bg-gray-200";

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If this is the overall status dot and has a uniqueId, show LLM boss details
    if (phaseType === "overall" && uniqueId) {
      try {
        const result = await getDetailedLLMBossResultByUniqueId(uniqueId);
        if (result?.[0]) {
          setLLMBossData(result[0]);
          setShowLLMBossDetails(true);
        }
      } catch (error) {
        console.error('Error fetching LLM Boss details:', error);
      }
    } 
    // For all other dots with details, show phase details
    else if (details && phaseType) {
      setShowPhaseDetails(true);
    }
  };
  
  const dot = (
    <div 
      className={`w-3 h-3 rounded-full ${bgColor} cursor-pointer`} 
      onClick={handleClick}
    />
  );

  return (
    <>
      {dot}
      
      {/* Show LLM Boss Details for overall status */}
      {llmBossData && (
        <LLMBossDetails
          open={showLLMBossDetails}
          onOpenChange={setShowLLMBossDetails}
          data={llmBossData}
        />
      )}

      {/* Show Phase Details for other phases */}
      {details && phaseType && (
        <PhaseDetails
          id="1"
          phaseType={phaseType}
          details={details}
          open={showPhaseDetails}
          onOpenChange={setShowPhaseDetails}
        >
          {null}
        </PhaseDetails>
      )}
    </>
  );
} 