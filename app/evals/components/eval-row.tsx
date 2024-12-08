import { TableCell, TableRow } from "@/components/ui/table";
import { StatusDot } from "./status-dot";
import { FileText } from 'lucide-react';
import { PhaseDetails } from "./phase-details";

interface ResultData {
  id: string;
  uniqueId: string | null;
  value: any;
  details?: string | { details: any; publicUrl: any } | null;
  overrideStatus?: string | null;
  publicUrl?: string;
  existingFeedback?: {
    sentiment: 'up' | 'down' | null;
    is_flagged: boolean;
    override_status: "yes" | "partial" | "no" | "notreached" | null;
    comment: string | null;
  };
}

interface EvalRowProps {
  label: string;
  resultData: ResultData[];
  phaseType: string;
  bgColor?: string;
}

function getDetailsString(details: string | { details: any; publicUrl: any } | null | undefined): { details: string | null, publicUrl: string | undefined } {
  if (!details) return { details: null, publicUrl: undefined };
  if (typeof details === 'string') return { details, publicUrl: undefined };
  return { details: JSON.stringify(details.details), publicUrl: details.publicUrl || undefined };
}

export function EvalRow({
  label,
  resultData,
  phaseType,
  bgColor = "bg-gray-50"
}: EvalRowProps) {
  return (
    <TableRow className={bgColor}>
      <TableCell className="font-medium w-48 min-w-48">{label}</TableCell>
      {resultData.map((data) => (
        <TableCell 
          key={data.id} 
          className="text-center p-0.5 relative group/cell"
        >
          <div className="absolute inset-0 -m-px bg-gray-50 opacity-0 group-hover/cell:opacity-100 pointer-events-none" />
          <div className="relative flex justify-center">
            {phaseType === 'session' ? (
              <PhaseDetails
                id={data.id}
                phaseType={phaseType}
                details={getDetailsString(data.details).details}
                currentStatus={data.value}
                uniqueId={data.uniqueId || ''}
                existingFeedback={data.existingFeedback}
                publicUrl={getDetailsString(data.details).publicUrl}
              >
                <FileText className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
              </PhaseDetails>
            ) : (
              <StatusDot 
                value={data.value}
                details={getDetailsString(data.details).details}
                phaseType={phaseType}
                uniqueId={data.uniqueId}
                overrideStatus={data.overrideStatus}
                existingFeedback={data.existingFeedback}
                publicUrl={getDetailsString(data.details).publicUrl}
              />
            )}
          </div>
        </TableCell>
      ))}
    </TableRow>
  );
} 