'use server';

import { cache } from 'react';
import { getCombinedLLMResultsWithSmoothnessLevels } from './combined-llm-results-queries';
import { unstable_cache } from 'next/cache';

// Cache key generation helper
const generateCacheKey = (page: number, limit: number) => 
  `combined-llm-results-page-${page}-limit-${limit}`;

// Cache the results with both React cache and Next.js unstable_cache
export const getCachedCombinedResults = cache(async (page: number, limit: number) => {
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