import { getProfileByUserId } from "@/db/queries/profiles-queries";
import { getAllSessionPhaseAnalyses } from "@/db/queries/session-phase-analysis-queries";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusIndicator } from "@/components/ui/data-display/status-indicators";
import { SessionPhaseDetails } from "@/components/ui/data-display/SessionPhaseDetails";

export default async function EvalsPage() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/login");
  }

  const profile = await getProfileByUserId(userId);

  if (!profile) {
    return redirect("/signup");
  }

  const analyses = await getAllSessionPhaseAnalyses();

  // Define the rows we want to display
  const rows = [
    { label: "Session ID", getValue: (a: any) => a.sessionId },
    { 
      label: "Auth Phase", 
      getValue: (a: any) => (
        <SessionPhaseDetails 
          status={a.authPhaseSmooth} 
          analysisId={a.id}
          phaseType="auth"
        />
      )
    },
    { 
      label: "Selection Phase", 
      getValue: (a: any) => (
        <SessionPhaseDetails 
          status={a.selectionPhaseSmooth} 
          analysisId={a.id}
          phaseType="selection"
        />
      )
    },
    { 
      label: "Initiation Phase", 
      getValue: (a: any) => (
        <SessionPhaseDetails 
          status={a.initiationPhaseSmooth} 
          analysisId={a.id}
          phaseType="initiation"
        />
      )
    },
    { label: "Duration (s)", getValue: (a: any) => a.totalDurationSeconds },
    { label: "Created At", getValue: (a: any) => new Date(a.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Session Phase Analyses</h1>
      
      <Table>
        <TableCaption>A list of all session phase analyses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            {analyses.map((analysis) => (
              <TableHead key={analysis.id}>Analysis {analysis.id}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="font-medium">{row.label}</TableCell>
              {analyses.map((analysis) => (
                <TableCell key={analysis.id}>
                  {row.getValue(analysis)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
