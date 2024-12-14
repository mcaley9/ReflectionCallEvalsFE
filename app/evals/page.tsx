import { Metadata } from "next";
import { getCachedCombinedResults, getActiveClients } from "@/db/queries/cached-queries";
import { Table, TableBody } from "@/components/ui/table";
import { EvalRow } from "./components/eval-row";
import { ClientSelector } from "./components/client-selector";
import { ROW_CONFIGS } from "./constants";
import { mapSmoothnessToStatus, getOverallStatusDetails } from "./utils";
import { getAdminResultsInputForMultipleIds, type AdminResultsInput } from "../actions/admin-results-input-actions";

// Add metadata for the page
export const metadata: Metadata = {
  title: 'Evaluation Results',
  description: 'View and analyze evaluation results',
};

// Add revalidation period
export const revalidate = 60; // Revalidate the page every 60 seconds

interface Result {
  id: string;
  sessionId: string | null;
  uniqueId: string | null;
  clientName: string | null;
  reviewQueueId: string | null;
  posthogId: string | null;
  vapiCallId: string | null;
  authPhaseSmooth: boolean | null;
  authPhaseDetails: string | null;
  selectionPhaseSmooth: boolean | null;
  selectionPhaseDetails: string | null;
  initiationPhaseSmooth: boolean | null;
  initiationPhaseDetails: string | null;
  reportReviewPhaseSmooth: boolean | null;
  reportReviewPhaseDetails: string | null;
  totalDurationSeconds: string | null;
  userExperienceIssues: string | null;
  evaluationId: string | null;
  smoothnessLevel: string | null;
  createdAt: Date | null;
  posthogVisionAiAnalysis: unknown;
}

interface Feedback {
  uniqueId: string;
  phaseType: string | null;
  sentiment: 'up' | 'down' | null;
  isFlagged: boolean;
  overrideStatus: "yes" | "partial" | "no" | "notreached" | null;
  comment: string | null;
}

// Update the type guard function
function isNonNullString(value: string | null): value is string {
  return typeof value === 'string' && value !== null;
}

export default async function EvalsPage({
  searchParams,
}: {
  searchParams: { page?: string; client?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = 1000;
  const selectedClient = searchParams.client;
  
  const [results, activeClients] = await Promise.all([
    getCachedCombinedResults(currentPage, pageSize),
    getActiveClients()
  ]) as [Result[], string[]];
  
  if (!results || results.length === 0) {
    throw new Error("Failed to load evaluation results. Please try again later.");
  }

  console.log('Raw Results from DB:', JSON.stringify(results[0], null, 2));

  // Filter results by selected client if one is selected
  const filteredResults = selectedClient 
    ? results.filter(r => r.clientName === selectedClient)
    : results;

  // Filter out results with null uniqueIds before fetching feedback
  const validResults = filteredResults.filter(result => 
    result.uniqueId !== null
  );
  
  // Fetch feedback data for all valid unique IDs
  const feedbackData = await getAdminResultsInputForMultipleIds(
    validResults.map(result => result.uniqueId!)
  );
  
  // Create a map of feedback by uniqueId and phaseType
  const feedbackMap = new Map<string, Map<string, AdminResultsInput>>();
  
  // Group feedback by uniqueId and phase, keeping only the most recent
  feedbackData.forEach((feedback) => {
    const key = feedback.uniqueId;
    if (!feedbackMap.has(key)) {
      feedbackMap.set(key, new Map());
    }
    
    // Create a unique key for the phase
    const phaseKey = feedback.phaseType || '';
    
    // Get the current map of phases for this uniqueId
    const phasesMap = feedbackMap.get(key)!;
    
    // Get all feedback for this phase and sort by updatedAt
    const existingFeedback = phasesMap.get(phaseKey);
    const feedbackDate = feedback.updatedAt || new Date(0);
    const existingDate = existingFeedback?.updatedAt || new Date(0);
    
    if (!existingFeedback || feedbackDate > existingDate) {
      phasesMap.set(phaseKey, feedback);
    }
  });

  // Calculate perfectly smooth rate for metric card
  const perfectlySmoothCount = filteredResults.filter(result => 
    result.smoothnessLevel === 'completely_smooth'
  ).length;
  const smoothRate = filteredResults.length > 0 ? (perfectlySmoothCount / filteredResults.length) * 100 : 0;

  // Pre-compute all row data
  const rowsData = ROW_CONFIGS.map(config => {
    const resultData = filteredResults.map(result => {
      const value = config.getValue(result);
      console.log(`Value for ${config.label}:`, { value, result });
      
      return {
        id: result.id,
        uniqueId: result.uniqueId,
        value,
        details: config.getDetails?.(result),
        overrideStatus: null,
        existingFeedback: undefined
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
      {/* Header with metrics and client selector */}
      <div className="flex justify-between items-start">
        {/* Metrics Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Perfectly Smooth Rate</h3>
            <div className="text-3xl font-semibold">{smoothRate.toFixed(1)}%</div>
            <p className="text-sm text-gray-500">
              {perfectlySmoothCount} out of {filteredResults.length} calls were perfectly smooth
            </p>
          </div>
        </div>

        {/* Client Selector */}
        <ClientSelector clients={activeClients} />
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
