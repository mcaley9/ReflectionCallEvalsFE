import { FileText } from 'lucide-react';

export const ROW_CONFIGS = [
  {
    label: "Perfectly Smooth",
    getValue: (result: any) => result.smoothnessLevel,
    phaseType: "overall",
    bgColor: "bg-gray-50"
  },
  {
    label: "Auth Phase",
    getValue: (result: any) => result.authPhaseSmooth,
    getDetails: (result: any) => {
      const details = result.authPhaseDetails;
      return {
        details,
        publicUrl: result.publicUrl
      };
    },
    phaseType: "auth phase",
    bgColor: "bg-orange-50"
  },
  {
    label: "Selection Phase",
    getValue: (result: any) => result.selectionPhaseSmooth,
    getDetails: (result: any) => {
      const details = result.selectionPhaseDetails;
      return {
        details,
        publicUrl: result.publicUrl
      };
    },
    phaseType: "selection phase",
    bgColor: "bg-orange-50"
  },
  {
    label: "Initiation Phase",
    getValue: (result: any) => result.initiationPhaseSmooth,
    getDetails: (result: any) => {
      const details = result.initiationPhaseDetails;
      return {
        details,
        publicUrl: result.publicUrl
      };
    },
    phaseType: "initiation phase",
    bgColor: "bg-orange-50"
  },
  {
    label: "Greet Student",
    getValue: (result: any) => result.greetStudentScore,
    getDetails: (result: any) => {
      const details = result.greetStudentCriteria;
      return {
        details,
        publicUrl: result.publicUrl
      };
    },
    phaseType: "greet student",
    bgColor: "bg-purple-50"
  },
  {
    label: "Understand Feelings",
    getValue: (result: any) => result.understandFeelingsScore,
    getDetails: (result: any) => {
      const details = result.understandFeelingsCriteria;
      return {
        details,
        publicUrl: result.publicUrl
      };
    },
    phaseType: "understand feelings",
    bgColor: "bg-purple-50"
  },
  {
    label: "Provide Overview",
    getValue: (result: any) => result.provideOverviewScore,
    getDetails: (result: any) => {
      const details = result.provideOverviewCriteria;
      return {
        details,
        publicUrl: result.publicUrl
      };
    },
    phaseType: "provide overview",
    bgColor: "bg-purple-50"
  },
  {
    label: "Goal Review",
    getValue: (result: any) => result.goalReviewScore,
    getDetails: (result: any) => {
      const details = result.goalReviewCriteria;
      return {
        details,
        publicUrl: result.publicUrl
      };
    },
    phaseType: "goal review",
    bgColor: "bg-purple-50"
  },
  {
    label: "Competency Review",
    getValue: (result: any) => result.competencyReviewScore,
    getDetails: (result: any) => {
      const details = result.competencyReviewCriteria;
      return {
        details,
        publicUrl: result.publicUrl
      };
    },
    phaseType: "competency review",
    bgColor: "bg-purple-50"
  },
  {
    label: "Purpose Review",
    getValue: (result: any) => result.purposeReviewScore,
    getDetails: (result: any) => {
      const details = result.purposeReviewCriteria;
      return {
        details,
        publicUrl: result.publicUrl
      };
    },
    phaseType: "purpose review",
    bgColor: "bg-purple-50"
  },
  {
    label: "Key Events Reflection",
    getValue: (result: any) => result.keyEventsReflectionScore,
    getDetails: (result: any) => {
      const details = result.keyEventsReflectionCriteria;
      return {
        details,
        publicUrl: result.publicUrl
      };
    },
    phaseType: "key events reflection",
    bgColor: "bg-purple-50"
  },
  {
    label: "Goal Setting",
    getValue: (result: any) => result.goalSettingScore,
    getDetails: (result: any) => {
      const details = result.goalSettingCriteria;
      return {
        details,
        publicUrl: result.publicUrl
      };
    },
    phaseType: "goal setting",
    bgColor: "bg-purple-50"
  },
  {
    label: "Closing",
    getValue: (result: any) => result.closingScore,
    getDetails: (result: any) => {
      const details = result.closingCriteria;
      return {
        details,
        publicUrl: result.publicUrl
      };
    },
    phaseType: "closing",
    bgColor: "bg-purple-50"
  },
  {
    label: "Post-Call Report Review",
    getValue: (result: any) => result.postCallReportReviewScore,
    getDetails: (result: any) => {
      const details = result.postCallReportReviewCriteria;
      return {
        details,
        publicUrl: result.publicUrl
      };
    },
    phaseType: "post call report review",
    bgColor: "bg-orange-50"
  },
  {
    label: "Session Info",
    phaseType: "session",
    getValue: (result: any) => "",
    getDetails: (result: any) => JSON.stringify({
      userId: result.userId,
      fronteggId: result.fronteggId,
      clientId: result.clientId,
      tenantId: result.tenantId,
      assignmentId: result.assignmentId,
      plGroupId: result.plGroupId,
      scheduleId: result.scheduleId,
      vapiCallId: result.vapiCallId,
      activityType: result.activityType,
      experienceType: result.experienceType,
      simulationDataType: result.simulationDataType,
      publicUrl: result.publicUrl,
      recordingDurationSeconds: result.recordingDurationSeconds,
      timeline: result.posthogVisionAiAnalysis?.timeline || null
    }),
    icon: FileText,
    bgColor: "bg-gray-100"
  }
]; 