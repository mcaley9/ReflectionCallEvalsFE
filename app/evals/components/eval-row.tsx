import { TableCell, TableRow } from "@/components/ui/table";
import { StatusDot } from "./status-dot";

interface ResultData {
  id: string;
  uniqueId: string | null;
  value: any;
  details?: string;
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
      {resultData.map((data) => (
        <TableCell 
          key={data.id} 
          className="text-center p-1 relative group/cell"
        >
          <div className="absolute inset-0 -m-px bg-gray-50 opacity-0 group-hover/cell:opacity-100 pointer-events-none" />
          <div className="relative flex justify-center">
            <StatusDot 
              value={data.value}
              details={data.details}
              phaseType={phaseType}
              uniqueId={data.uniqueId}
            />
          </div>
        </TableCell>
      ))}
    </TableRow>
  );
} 