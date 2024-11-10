import { getSessionPhaseAnalysisDetails } from "@/db/queries/session-phase-analysis-queries";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const details = await getSessionPhaseAnalysisDetails(Number(params.id));
    if (!details) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }
    return NextResponse.json(details);
  } catch (error) {
    console.error("Error fetching analysis details:", error);
    return NextResponse.json(
      { error: "Failed to fetch analysis details" }, 
      { status: 500 }
    );
  }
} 