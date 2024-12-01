'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PhaseDetailsProps {
  id: string;
  phaseType: string;
  details: string | null;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PhaseDetails({ 
  id, 
  phaseType, 
  details, 
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange 
}: PhaseDetailsProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen;

  const handleClick = () => {
    if (onOpenChange) {
      onOpenChange(true);
    }
  };

  const formatDetails = (details: string | null) => {
    if (!details) return 'No details available';
    
    try {
      // If it's already an object (stringified or not)
      const parsed = typeof details === 'string' ? JSON.parse(details) : details;
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      // If it's a plain string or invalid JSON
      return details;
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
        </DialogContent>
      </Dialog>
    </>
  );
} 