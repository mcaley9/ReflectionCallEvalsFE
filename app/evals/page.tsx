import { getCombinedLLMResults, getLLMBossResultByUniqueId } from "@/db/queries/combined-llm-results-queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusDot } from "@/components/ui/data-display/status-dot";

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

const mapSmoothnessToStatus = (smoothnessLevel: string | null) => {
  if (!smoothnessLevel) return null;
  
  console.log('Mapping smoothness level:', smoothnessLevel);
  
  switch (smoothnessLevel.toLowerCase()) {
    case 'completely_smooth':
    case 'completely smooth':
      return "true";
    case 'mostly_smooth':
    case 'mostly smooth':
      return "warning";
    case 'not_smooth':
    case 'not smooth':
      return "false";
    default:
      console.log('Unknown smoothness level:', smoothnessLevel);
      return null;
  }
};

export default async function EvalsPage() {
  const results = await getCombinedLLMResults();
  
  // Get smoothness levels for all results
  const resultsWithSmoothnessLevel = await Promise.all(
    results.map(async (result) => {
      if (!result.uniqueId) return { ...result, smoothnessLevel: null };
      
      const llmBossResult = await getLLMBossResultByUniqueId(result.uniqueId);
      return {
        ...result,
        smoothnessLevel: llmBossResult?.[0]?.smoothnessLevel || null
      };
    })
  );
  
  // Sort results by createdAt in descending order (newest first)
  const sortedResults = [...resultsWithSmoothnessLevel].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  // Calculate perfectly smooth rate
  const perfectlySmoothCount = sortedResults.filter(result => 
    result.smoothnessLevel === 'completely_smooth'
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
              {sortedResults.map((result) => (
                <TableCell 
                  key={result.id} 
                  className="text-center p-1 relative group/cell"
                >
                  <div className="absolute inset-0 -m-px bg-gray-50 opacity-0 group-hover/cell:opacity-100 pointer-events-none" />
                  <div className="relative flex justify-center">
                    <StatusDot 
                      value={mapSmoothnessToStatus(result.smoothnessLevel)}
                      details={getOverallStatusDetails(result)}
                      phaseType="overall"
                      uniqueId={result.uniqueId}
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="bg-orange-50">
              <TableCell className="font-medium w-48 min-w-48">Auth Phase</TableCell>
              {sortedResults.map((result) => (
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
              {sortedResults.map((result) => (
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
              {sortedResults.map((result) => (
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
              {sortedResults.map((result) => (
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
              {sortedResults.map((result) => (
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
              {sortedResults.map((result) => (
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
              {sortedResults.map((result) => (
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
              {sortedResults.map((result) => (
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
              {sortedResults.map((result) => (
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
              {sortedResults.map((result) => (
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
              {sortedResults.map((result) => (
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
              {sortedResults.map((result) => (
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
              {sortedResults.map((result) => (
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
