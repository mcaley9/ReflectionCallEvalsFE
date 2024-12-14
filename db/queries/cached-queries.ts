'use server';

import { unstable_cache } from 'next/cache';
import { getAnalysisResults, getActiveClients as getActiveClientsBase } from './analysis-queries';

export async function getCachedCombinedResults(page: number, pageSize: number) {
  return unstable_cache(
    async () => {
      return getAnalysisResults(page, pageSize);
    },
    ['combined-results', page.toString(), pageSize.toString()],
    { revalidate: 60 } // Cache for 60 seconds
  )();
}

export async function getActiveClients() {
  return unstable_cache(
    async () => {
      return getActiveClientsBase();
    },
    ['active-clients'],
    { revalidate: 60 } // Cache for 60 seconds
  )();
} 