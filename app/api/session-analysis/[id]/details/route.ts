import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { combinedLLMResults } from "@/db/schema/combined-llm-results-schema";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await db
      .select({
        authPhaseDetails: combinedLLMResults.authPhaseDetails,
        selectionPhaseDetails: combinedLLMResults.selectionPhaseDetails,
        initiationPhaseDetails: combinedLLMResults.initiationPhaseDetails,
        userExperienceIssues: combinedLLMResults.userExperienceIssues
      })
      .from(combinedLLMResults)
      .where(eq(combinedLLMResults.id, params.id))
      .limit(1);

    if (!result[0]) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching analysis details:", error);
    return NextResponse.json(
      { error: "Failed to fetch analysis details" }, 
      { status: 500 }
    );
  }
} 