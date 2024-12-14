"use client";

import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function InfoLabel({ label, value }: { label: string; value: string }) {
  const getColor = (value: string) => {
    switch (value.toLowerCase()) {
      case 'yes':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'no':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="text-base font-medium flex-1">{label}</span>
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getColor(value)}`}>
        {value}
      </span>
    </div>
  );
}

interface PhaseDetailsProps {
  id: string;
  phaseType: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  currentStatus: string;
  uniqueId: string;
  publicUrl?: string;
  vapiCallId?: string | null;
}

export function PhaseDetails({
  id,
  phaseType,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  currentStatus,
  uniqueId,
  publicUrl: propPublicUrl,
  vapiCallId: propVapiCallId,
}: PhaseDetailsProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen;

  const [data, setData] = useState<{
    phases?: any;
    metadata?: any;
  }>({});

  useEffect(() => {
    if (open && uniqueId) {
      // Fetch details from the new unified endpoint
      fetch(`/api/session-analysis/${uniqueId}/details`)
        .then(res => res.json())
        .then(json => {
          setData(json);
        })
        .catch(err => {
          console.error('Error fetching phase details:', err);
        });
    }
  }, [open, uniqueId]);

  const handleClick = () => {
    if (onOpenChange) {
      onOpenChange(true);
    }
  };

  // Extract the current info and metadata from the fetched data
  const phaseKey = phaseType
    .replace(/\s/g, '_')
    .replace('-', '_')
    .toLowerCase(); // map "auth phase" -> "auth", "selection phase" -> "selection_phase", etc.
  
  const phaseData = data.phases?.[phaseKey] || {};
  const metadata = data.metadata || {};

  // Determine if it's a yes/no/partial for the "current info" tab
  // For auth/selection/initiation/report_review phases, we use `smooth` boolean.
  // For greet_student, understand_feelings, etc., we use `score`.
  let usedNameVal = metadata.used_name || 'No';
  let warmGreetingVal = metadata.warm_greeting || 'No';
  let waitedForResponseVal = metadata.waited_for_response || 'No';

  // The "Current Info" tab is originally designed for the selection phase details.
  // We'll generalize it: if we have a `score` or `smooth` boolean, we show them.
  let currentValueLabel = 'No';
  if (phaseData.score) {
    currentValueLabel = phaseData.score;
  } else if (typeof phaseData.smooth === 'boolean') {
    currentValueLabel = phaseData.smooth ? 'Yes' : 'No';
  }

  // For the transcript tab:
  const transcript = metadata.transcript || '';

  return (
    <>
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                {phaseType.charAt(0).toUpperCase() + phaseType.slice(1)} Details
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onOpenChange?.(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">Current Info</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>
            
            {/* Current Info Tab */}
            <TabsContent value="current" className="mt-4">
              <div className="rounded-lg border p-6">
                <div className="space-y-0.5 mb-8">
                  {/* Show relevant info: if this is a greet or other mid-phase,
                      used_name/warm_greeting/waited_for_response might not be relevant.
                      We'll always show them anyway since user requested original fields. */}
                  <InfoLabel label="Used Name" value={usedNameVal} />
                  <InfoLabel label="Warm Greeting" value={warmGreetingVal} />
                  <InfoLabel label="Waited for Response" value={waitedForResponseVal} />
                </div>
                <div className="flex justify-end gap-3">
                  {propVapiCallId && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(`https://dashboard.vapi.ai/calls/${propVapiCallId}`, '_blank')}
                      className="gap-2"
                    >
                      View VAPI Call
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  {metadata && metadata.public_url && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(metadata.public_url, '_blank')}
                      className="gap-2"
                    >
                      View PostHog
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* Metadata Tab */}
            <TabsContent value="metadata" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Field</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Activity Type</TableCell>
                    <TableCell>{metadata.activity_type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Experience Type</TableCell>
                    <TableCell>{metadata.experience_type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Call Type</TableCell>
                    <TableCell>{metadata.call_type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Started At</TableCell>
                    <TableCell>{new Date(metadata.started_at).toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ended At</TableCell>
                    <TableCell>{new Date(metadata.ended_at).toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Duration (minutes)</TableCell>
                    <TableCell>{metadata.duration_minutes}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ended Reason</TableCell>
                    <TableCell>{metadata.ended_reason}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            
            {/* Transcript Tab */}
            <TabsContent value="transcript" className="mt-4">
              <ScrollArea className="h-[400px] rounded-lg border p-4">
                <div className="space-y-4">
                  {transcript.split('\n').map((line, index) => {
                    if (line.startsWith('System:')) {
                      return (
                        <p key={index} className="text-sm text-muted-foreground">
                          {line}
                        </p>
                      );
                    }
                    if (line.startsWith('AI Guide:')) {
                      return (
                        <div key={index} className="flex gap-2">
                          <div className="min-w-[80px] text-sm font-medium text-primary">AI Guide:</div>
                          <p className="text-sm">{line.replace('AI Guide:', '')}</p>
                        </div>
                      );
                    }
                    if (line.startsWith('Student:')) {
                      return (
                        <div key={index} className="flex gap-2">
                          <div className="min-w-[80px] text-sm font-medium text-secondary">Student:</div>
                          <p className="text-sm font-medium">{line.replace('Student:', '')}</p>
                        </div>
                      );
                    }
                    return <p key={index} className="text-sm">{line}</p>;
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}