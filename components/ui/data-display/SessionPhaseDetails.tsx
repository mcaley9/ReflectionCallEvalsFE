'use client';

import { useState } from 'react';
import { StatusIndicator } from "./status-indicators";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SessionPhaseDetailsProps {
  status: boolean;
  analysisId: number;
  phaseType: 'auth' | 'selection' | 'initiation';
}

export function SessionPhaseDetails({ status, analysisId, phaseType }: SessionPhaseDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsOpen(true);
    if (!details) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/session-analysis/${analysisId}/details`);
        if (!response.ok) {
          throw new Error('Failed to fetch details');
        }
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        console.error('Failed to fetch details:', error);
        setError('Failed to load details');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getPhaseDetails = () => {
    if (!details) return null;
    switch (phaseType) {
      case 'auth':
        return details.authPhaseDetails;
      case 'selection':
        return details.selectionPhaseDetails;
      case 'initiation':
        return details.initiationPhaseDetails;
    }
  };

  return (
    <>
      <div onClick={handleClick} className="cursor-pointer">
        <StatusIndicator status={status} />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {phaseType.charAt(0).toUpperCase() + phaseType.slice(1)} Phase Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {isLoading ? (
              <div className="text-center">Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-[400px] text-sm">
                {JSON.stringify(getPhaseDetails(), null, 2)}
              </pre>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 