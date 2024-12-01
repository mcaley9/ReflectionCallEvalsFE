import { Metadata } from "next";
import { getCachedCombinedResults } from "@/db/queries/cached-queries";
import { Table, TableBody } from "@/components/ui/table";
import { EvalRow } from "./components/eval-row";
import { ROW_CONFIGS } from "./constants";
import { mapSmoothnessToStatus, getOverallStatusDetails } from "./utils";
import { submitAdminResultsInput } from "@/actions/admin-results-input-actions";

// Add metadata for the page
export const metadata: Metadata = {
  title: 'Evaluation Results',
  description: 'View and analyze evaluation results',
};

// Add revalidation period
export const revalidate = 60; // Revalidate the page every 60 seconds

interface Feedback {
  phase_type: string | null;
  feedback_type: 'phase' | 'boss';
  sentiment: 'up' | 'down' | null;
  is_flagged: boolean;
  override_status: string | null;
  comment: string | null;
}

// Update the type guard function
function isNonNullString(value: string | null): value is string {
  return typeof value === 'string' && value !== null;
}

export default async function EvalsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = 100;
  
  const results = await getCachedCombinedResults(currentPage, pageSize);
  
  if (!results || results.length === 0) {
    throw new Error("Failed to load evaluation results. Please try again later.");
  }

  // Filter out results with null uniqueIds before fetching feedback
  const validResults = results.filter((result): result is typeof result & { uniqueId: string } => 
    isNonNullString(result.uniqueId)
  );
  
  // Now TypeScript knows uniqueId is definitely a string
  // Initialize an empty feedbackResults array since getFeedback is commented out
  const feedbackResults: Feedback[][] = [];
  
  // Create a map of feedback by uniqueId and phase
  const feedbackMap = new Map<string, Feedback[]>();
  feedbackResults.forEach((feedbacks: Feedback[], index: number) => {
    const uniqueId = validResults[index].uniqueId;
    if (uniqueId) {  // TypeScript guard
      feedbackMap.set(uniqueId, feedbacks);
    }
  });

  // Calculate perfectly smooth rate for metric card
  const perfectlySmoothCount = results.filter(result => 
    result.smoothnessLevel === 'completely_smooth'
  ).length;
  const smoothRate = results.length > 0 ? (perfectlySmoothCount / results.length) * 100 : 0;

  // Pre-compute all row data
  const rowsData = ROW_CONFIGS.map(config => {
    const resultData = results.map(result => {
      const value = config.label === "Perfectly Smooth" 
        ? mapSmoothnessToStatus(config.getValue(result))
        : config.getValue(result);
      
      const details = config.label === "Perfectly Smooth"
        ? getOverallStatusDetails(result)
        : config.getDetails?.(result);

      // Only try to get feedback if uniqueId is not null
      const feedback = result.uniqueId 
        ? feedbackMap.get(result.uniqueId)?.find((f: Feedback) => 
            f.phase_type === config.phaseType || 
            (config.phaseType === 'overall' && f.feedback_type === 'boss')
          )
        : null;

      return {
        id: result.id,
        uniqueId: result.uniqueId,
        value,
        details,
        overrideStatus: feedback?.override_status ?? null,
        existingFeedback: feedback ?? null
      };
    });

    return {
      label: config.label,
      resultData,
      phaseType: config.phaseType,
      bgColor: config.bgColor
    };
  });

  return (
    <div className="space-y-6 p-4">
      {/* Metrics Card */}
      <div className="bg-white rounded-lg shadow p-6 w-fit">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-500">Perfectly Smooth Rate</h3>
          <div className="text-3xl font-semibold">{smoothRate.toFixed(1)}%</div>
          <p className="text-sm text-gray-500">
            {perfectlySmoothCount} out of {results.length} calls were perfectly smooth
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto">
        <Table>
          <TableBody className="group">
            {rowsData.map((rowData, index) => (
              <EvalRow
                key={index}
                {...rowData}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
