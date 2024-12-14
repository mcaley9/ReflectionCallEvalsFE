import { NextResponse } from "next/server";
import { getAnalysisResultByUniqueId } from "@/db/queries/analysis-queries";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const uniqueId = params.id;

    // Fetch the combined analysis result by unique ID (posthog + vapi)
    const result = await getAnalysisResultByUniqueId(uniqueId);
    if (!result) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    // Construct a structured response with all phase info
    // We'll standardize these fields so the front-end can easily pick what it needs.
    // Each phase will include yes/no/partial, criteria, and metadata if available.
    // We'll also return transcript and other fields that the UI may need.
    const phases = {
      auth: {
        smooth: result.authPhaseSmooth,
        details: result.authPhaseDetails || {}
      },
      selection: {
        smooth: result.selectionPhaseSmooth,
        details: result.selectionPhaseDetails || {}
      },
      initiation: {
        smooth: result.initiationPhaseSmooth,
        details: result.initiationPhaseDetails || {}
      },
      report_review: {
        smooth: result.reportReviewPhaseSmooth,
        details: result.reportReviewPhaseDetails || {}
      },
      greet_student: {
        score: result.greetStudentScore,
        criteria: result.greetStudentCriteria || {}
      },
      understand_feelings: {
        score: result.understandFeelingsScore,
        criteria: result.understandFeelingsCriteria || {}
      },
      provide_overview: {
        score: result.provideOverviewScore,
        criteria: result.provideOverviewCriteria || {}
      },
      goal_review: {
        score: result.goalReviewScore,
        criteria: result.goalReviewCriteria || {}
      },
      competency_review: {
        score: result.competencyReviewScore,
        criteria: result.competencyReviewCriteria || {}
      },
      purpose_review: {
        score: result.purposeReviewScore,
        criteria: result.purposeReviewCriteria || {}
      },
      key_events_reflection: {
        score: result.keyEventsReflectionScore,
        criteria: result.keyEventsReflectionCriteria || {}
      },
      goal_setting: {
        score: result.goalSettingScore,
        criteria: result.goalSettingCriteria || {}
      },
      closing: {
        score: result.closingScore,
        criteria: result.closingCriteria || {}
      }
    };

    // We'll also return a metadata section that includes activity/call info from VAPI or PostHog
    // Attempt to extract metadata from either the posthog or vapi sections included in `result`.
    // The `phase-details` UI expects fields like used_name, warm_greeting, waited_for_response,
    // activity_type, experience_type, call_type, started_at, ended_at, duration_minutes, ended_reason, transcript
    // We store them in a general metadata object for all phases.
    const metadata = {
      used_name: result?.greetStudentCriteria?.used_name || 'No',
      warm_greeting: result?.greetStudentCriteria?.warm_greeting || 'No',
      waited_for_response: result?.greetStudentCriteria?.waited_for_response || 'No',
      activity_type: result.activityType || 'Unknown',
      experience_type: result.experienceType || 'Unknown',
      call_type: result.call_type || 'Unknown',
      started_at: result.started_at || (result.createdAt?.toISOString() || new Date().toISOString()),
      ended_at: result.ended_at || new Date().toISOString(),
      duration_minutes: result.duration_minutes || (result.totalDurationSeconds ? (result.totalDurationSeconds / 60).toFixed(2) : '0'),
      ended_reason: result.ended_reason || 'Unknown',
      transcript: result.transcript || result.cleanedTranscript || ''
    };

    return NextResponse.json({
      uniqueId,
      phases,
      metadata
    });
  } catch (error) {
    console.error("Error fetching analysis details:", error);
    return NextResponse.json(
      { error: "Failed to fetch analysis details" }, 
      { status: 500 }
    );
  }
}