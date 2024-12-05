'use server';

import { cache } from 'react';
import { getCombinedLLMResultsWithSmoothnessLevels } from './combined-llm-results-queries';
import { unstable_cache } from 'next/cache';

// Cache key generation helper
const generateCacheKey = (page: number, limit: number) => 
  `combined-llm-results-page-${page}-limit-${limit}`;

interface CombinedResult {
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

// Cache the results with both React cache and Next.js unstable_cache
export const getCachedCombinedResults = cache(async (page: number, limit: number): Promise<CombinedResult[]> => {
  // Use Next.js cache with a 1-minute revalidation period
  const results = await unstable_cache(
    async () => {
      return getCombinedLLMResultsWithSmoothnessLevels(page, limit);
    },
    [generateCacheKey(page, limit)],
    {
      revalidate: 60, // Cache for 1 minute
      tags: ['combined-llm-results']
    }
  )();

  return results;
});

export async function getActiveClients(): Promise<string[]> {
  const results = await getCachedCombinedResults(1, 1000);
  console.log('Active clients before filtering:', results.map(r => r.clientName));
  const uniqueClients = new Set(
    results
      .map(r => r.clientName)
      .filter((name): name is string => name !== null && name !== '')
  );
  const sortedClients = Array.from(uniqueClients).sort();
  console.log('Active clients after filtering:', sortedClients);
  return sortedClients;
} 