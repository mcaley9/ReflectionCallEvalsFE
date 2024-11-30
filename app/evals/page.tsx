import { getCombinedLLMResults } from "@/db/queries/combined-llm-results-queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PhaseDetails } from "@/components/ui/data-display/phase-details";

const formatDate = (date: Date | null) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

const StatusDot = ({ value, details, phaseType }: { value: boolean | string | null, details?: string | null, phaseType?: string }) => {
  let bgColor = "bg-gray-200";
  
  // Convert string values to lowercase for case-insensitive comparison
  const stringValue = typeof value === 'string' ? value.toLowerCase() : value;
  
  if (value === true || value === "true" || stringValue === "yes") bgColor = "bg-green-500";
  else if (value === false || value === "false" || stringValue === "missed") bgColor = "bg-red-500";
  else if (stringValue === "partial" || stringValue === "warning") bgColor = "bg-yellow-500";
  else if (stringValue === "notreached") bgColor = "bg-black";
  else if (value === null) bgColor = "bg-gray-200";
  
  const dot = <div className={`w-3 h-3 rounded-full ${bgColor}`} />;

  if (details && phaseType) {
    return (
      <PhaseDetails id="1" phaseType={phaseType} details={details}>
        {dot}
      </PhaseDetails>
    );
  }

  return dot;
};

const getOverallStatus = (result: any) => {
  const statuses = [
    result.authPhaseSmooth,
    result.selectionPhaseSmooth,
    result.initiationPhaseSmooth,
    result.greetStudentScore,
    result.understandFeelingsScore,
    result.provideOverviewScore,
    result.goalReviewScore,
    result.competencyReviewScore,
    result.purposeReviewScore,
    result.keyEventsReflectionScore,
    result.goalSettingScore,
    result.closingScore,
    result.userExperienceIssues
  ];

  // Check for red status (false, "false", "missed")
  const hasRed = statuses.some(status => {
    const stringStatus = typeof status === 'string' ? status.toLowerCase() : status;
    return status === false || status === "false" || stringStatus === "missed";
  });

  // Check for yellow status ("partial", "warning")
  const hasYellow = statuses.some(status => {
    const stringStatus = typeof status === 'string' ? status.toLowerCase() : status;
    return stringStatus === "partial" || stringStatus === "warning";
  });

  if (hasRed) return "false";
  if (hasYellow) return "warning";
  
  // Check if all non-null values are green (true, "true", "yes")
  const allGreen = statuses.every(status => {
    if (status === null || status === "notreached") return true;
    const stringStatus = typeof status === 'string' ? status.toLowerCase() : status;
    return status === true || status === "true" || stringStatus === "yes";
  });

  return allGreen ? "true" : null;
};

const getOverallStatusDetails = (result: any) => {
  const formatDuration = (seconds: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return `Date: ${formatDate(result.createdAt)}
Recording Duration: ${formatDuration(result.recordingDurationSeconds)}
User ID: ${result.userId || 'N/A'}
Frontegg ID: ${result.fronteggId || 'N/A'}
Client ID: ${result.clientId || 'N/A'}
Tenant ID: ${result.tenantId || 'N/A'}
Assignment ID: ${result.assignmentId || 'N/A'}
PL Group ID: ${result.plGroupId || 'N/A'}
Schedule ID: ${result.scheduleId || 'N/A'}
Activity Type: ${result.activityType || 'N/A'}
Experience Type: ${result.experienceType || 'N/A'}
Simulation Data Type: ${result.simulationDataType || 'N/A'}
Public URL: ${result.publicUrl || 'N/A'}`;
};

export default async function EvalsPage() {
  const results = await getCombinedLLMResults();
  
  // Sort results by createdAt in descending order (newest first)
  const sortedResults = [...results].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  // Calculate perfectly smooth rate
  const perfectlySmoothCount = sortedResults.filter(result => 
    getOverallStatus(result) === "true"
  ).length;
  const smoothRate = (perfectlySmoothCount / sortedResults.length) * 100;
  
  return (
    <div className="space-y-6 p-4">
      {/* Metrics Card */}
      <div className="bg-white rounded-lg shadow p-6 w-fit">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-500">Perfectly Smooth Rate</h3>
          <div className="text-3xl font-semibold">{smoothRate.toFixed(1)}%</div>
          <p className="text-sm text-gray-500">
            {perfectlySmoothCount} out of {sortedResults.length} calls were perfectly smooth
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto">
        <Table>
          <TableBody className="group">
            <TableRow className="bg-gray-50">
              <TableCell className="font-medium w-48 min-w-48">Overall Status</TableCell>
              {sortedResults.map((result, index) => (
                <TableCell 
                  key={result.id} 
                  className="text-center p-1 relative group/cell"
                >
                  <div className="absolute inset-0 -m-px bg-gray-50 opacity-0 group-hover/cell:opacity-100 pointer-events-none" />
                  <div className="relative flex justify-center">
                    <PhaseDetails 
                      id={result.id.toString()}
                      phaseType="overall"
                      details={getOverallStatusDetails(result)}
                    >
                      <StatusDot 
                        value={getOverallStatus(result)}
                        phaseType="overall"
                      />
                    </PhaseDetails>
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="bg-orange-50">
              <TableCell className="font-medium w-48 min-w-48">Auth Phase</TableCell>
              {sortedResults.map((result, index) => (
                <TableCell 
                  key={result.id} 
                  className="text-center p-1 relative group/cell"
                >
                  <div className="absolute inset-0 -m-px bg-gray-50 opacity-0 group-hover/cell:opacity-100 pointer-events-none" />
                  <div className="relative flex justify-center">
                    <StatusDot 
                      value={result.authPhaseSmooth} 
                      details={result.authPhaseDetails}
                      phaseType="auth phase"
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="bg-orange-50">
              <TableCell className="font-medium w-48 min-w-48">Selection Phase</TableCell>
              {sortedResults.map((result, index) => (
                <TableCell 
                  key={result.id} 
                  className="text-center p-1 relative group/cell"
                >
                  <div className="absolute inset-0 -m-px bg-gray-50 opacity-0 group-hover/cell:opacity-100 pointer-events-none" />
                  <div className="relative flex justify-center">
                    <StatusDot 
                      value={result.selectionPhaseSmooth} 
                      details={result.selectionPhaseDetails}
                      phaseType="selection phase"
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="bg-orange-50">
              <TableCell className="font-medium w-48 min-w-48">Initiation Phase</TableCell>
              {sortedResults.map((result, index) => (
                <TableCell 
                  key={result.id} 
                  className="text-center p-1 relative group/cell"
                >
                  <div className="absolute inset-0 -m-px bg-gray-50 opacity-0 group-hover/cell:opacity-100 pointer-events-none" />
                  <div className="relative flex justify-center">
                    <StatusDot 
                      value={result.initiationPhaseSmooth} 
                      details={result.initiationPhaseDetails}
                      phaseType="initiation phase"
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="bg-purple-50">
              <TableCell className="font-medium w-48 min-w-48">Greet Student</TableCell>
              {sortedResults.map((result, index) => (
                <TableCell 
                  key={result.id} 
                  className="text-center p-1 relative group/cell"
                >
                  <div className="absolute inset-0 -m-px bg-gray-50 opacity-0 group-hover/cell:opacity-100 pointer-events-none" />
                  <div className="relative flex justify-center">
                    <StatusDot 
                      value={result.greetStudentScore} 
                      details={result.greetStudentCriteria}
                      phaseType="greet student"
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="bg-purple-50">
              <TableCell className="font-medium w-48 min-w-48">Understand Feelings</TableCell>
              {sortedResults.map((result, index) => (
                <TableCell 
                  key={result.id} 
                  className="text-center p-1 relative group/cell"
                >
                  <div className="absolute inset-0 -m-px bg-gray-50 opacity-0 group-hover/cell:opacity-100 pointer-events-none" />
                  <div className="relative flex justify-center">
                    <StatusDot 
                      value={result.understandFeelingsScore} 
                      details={result.understandFeelingsCriteria}
                      phaseType="understand feelings"
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="bg-purple-50">
              <TableCell className="font-medium w-48 min-w-48">Provide Overview</TableCell>
              {sortedResults.map((result, index) => (
                <TableCell 
                  key={result.id} 
                  className="text-center p-1 relative group/cell"
                >
                  <div className="absolute inset-0 -m-px bg-gray-50 opacity-0 group-hover/cell:opacity-100 pointer-events-none" />
                  <div className="relative flex justify-center">
                    <StatusDot 
                      value={result.provideOverviewScore} 
                      details={result.provideOverviewCriteria}
                      phaseType="provide overview"
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="bg-purple-50">
              <TableCell className="font-medium w-48 min-w-48">Goal Review</TableCell>
              {sortedResults.map((result, index) => (
                <TableCell 
                  key={result.id} 
                  className="text-center p-1 relative group/cell"
                >
                  <div className="absolute inset-0 -m-px bg-gray-50 opacity-0 group-hover/cell:opacity-100 pointer-events-none" />
                  <div className="relative flex justify-center">
                    <StatusDot 
                      value={result.goalReviewScore} 
                      details={result.goalReviewCriteria}
                      phaseType="goal review"
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="bg-purple-50">
              <TableCell className="font-medium w-48 min-w-48">Competency Review</TableCell>
              {sortedResults.map((result, index) => (
                <TableCell 
                  key={result.id} 
                  className="text-center p-1 relative group/cell"
                >
                  <div className="absolute inset-0 -m-px bg-gray-50 opacity-0 group-hover/cell:opacity-100 pointer-events-none" />
                  <div className="relative flex justify-center">
                    <StatusDot 
                      value={result.competencyReviewScore} 
                      details={result.competencyReviewCriteria}
                      phaseType="competency review"
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="bg-purple-50">
              <TableCell className="font-medium w-48 min-w-48">Purpose Review</TableCell>
              {sortedResults.map((result, index) => (
                <TableCell 
                  key={result.id} 
                  className="text-center p-1 relative group/cell"
                >
                  <div className="absolute inset-0 -m-px bg-gray-50 opacity-0 group-hover/cell:opacity-100 pointer-events-none" />
                  <div className="relative flex justify-center">
                    <StatusDot 
                      value={result.purposeReviewScore} 
                      details={result.purposeReviewCriteria}
                      phaseType="purpose review"
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="bg-purple-50">
              <TableCell className="font-medium w-48 min-w-48">Key Events Reflection</TableCell>
              {sortedResults.map((result, index) => (
                <TableCell 
                  key={result.id} 
                  className="text-center p-1 relative group/cell"
                >
                  <div className="absolute inset-0 -m-px bg-gray-50 opacity-0 group-hover/cell:opacity-100 pointer-events-none" />
                  <div className="relative flex justify-center">
                    <StatusDot 
                      value={result.keyEventsReflectionScore} 
                      details={result.keyEventsReflectionCriteria}
                      phaseType="key events reflection"
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="bg-purple-50">
              <TableCell className="font-medium w-48 min-w-48">Goal Setting</TableCell>
              {sortedResults.map((result, index) => (
                <TableCell 
                  key={result.id} 
                  className="text-center p-1 relative group/cell"
                >
                  <div className="absolute inset-0 -m-px bg-gray-50 opacity-0 group-hover/cell:opacity-100 pointer-events-none" />
                  <div className="relative flex justify-center">
                    <StatusDot 
                      value={result.goalSettingScore} 
                      details={result.goalSettingCriteria}
                      phaseType="goal setting"
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="bg-purple-50">
              <TableCell className="font-medium w-48 min-w-48">Closing</TableCell>
              {sortedResults.map((result, index) => (
                <TableCell 
                  key={result.id} 
                  className="text-center p-1 relative group/cell"
                >
                  <div className="absolute inset-0 -m-px bg-gray-50 opacity-0 group-hover/cell:opacity-100 pointer-events-none" />
                  <div className="relative flex justify-center">
                    <StatusDot 
                      value={result.closingScore} 
                      details={result.closingCriteria}
                      phaseType="closing"
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="bg-orange-50">
              <TableCell className="font-medium w-48 min-w-48">UX Issues</TableCell>
              {sortedResults.map((result, index) => (
                <TableCell 
                  key={result.id} 
                  className="text-center p-1 relative group/cell"
                >
                  <div className="absolute inset-0 -m-px bg-gray-50 opacity-0 group-hover/cell:opacity-100 pointer-events-none" />
                  <div className="relative flex justify-center">
                    <StatusDot 
                      value={result.userExperienceIssues} 
                      details={result.userExperienceIssues}
                      phaseType="UX issues"
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
