import { TableCell, TableRow } from "@/components/ui/table";
import { StatusDot } from "./status-dot";
import { FileText } from 'lucide-react';
import { PhaseDetails } from "./phase-details";

interface ResultData {
  id: string;
  uniqueId: string | null;
  value: any;
  details?: any;
  publicUrl?: string;
}

interface EvalRowProps {
  label: string;
  resultData: ResultData[];
  phaseType: string;
  bgColor?: string;
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
      {resultData.map((data) => {
        return (
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
                  currentStatus={data.value || ''}
                  uniqueId={data.uniqueId || ''}
                  publicUrl={data.publicUrl}
                >
                  <FileText className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                </PhaseDetails>
              ) : (
                <StatusDot 
                  status={data.value}
                  phaseType={phaseType}
                  uniqueId={data.uniqueId || ''}
                  id={data.id}
                />
              )}
            </div>
          </TableCell>
        );
      })}
    </TableRow>
  );
}