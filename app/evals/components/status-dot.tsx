'use client';

import React from 'react';
import { StatusDot as UIStatusDot } from "@/components/ui/data-display/status-dot";

interface StatusDotProps {
  value: any;
  details?: string;
  phaseType: string;
  uniqueId?: string | null;
}

export function StatusDot(props: StatusDotProps) {
  return <UIStatusDot {...props} />;
} 