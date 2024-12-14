import { FileText } from 'lucide-react';

export const ROW_CONFIGS = [
  {
    label: "Perfectly Smooth",
    getValue: (result: any) => result.smoothnessLevel === 'completely_smooth' ? 'yes' : 'no',
    phaseType: "overall",
    bgColor: "bg-gray-50"
  },
  {
    label: "Auth Phase",
    getValue: (result: any) => result.authPhaseSmooth ? 'yes' : 'no',
    getDetails: (result: any) => JSON.stringify({
      ...result.authPhaseDetails,
      publicUrl: result.publicUrl,
      vapiCallId: result.vapiCallId
    }),
    phaseType: "auth phase",
    bgColor: "bg-orange-50"
  },
  {
    label: "Selection Phase",
    getValue: (result: any) => result.selectionPhaseSmooth ? 'yes' : 'no',
    getDetails: (result: any) => JSON.stringify({
      ...result.selectionPhaseDetails,
      publicUrl: result.publicUrl,
      vapiCallId: result.vapiCallId
    }),
    phaseType: "selection phase",
    bgColor: "bg-orange-50"
  },
  {
    label: "Initiation Phase",
    getValue: (result: any) => result.initiationPhaseSmooth ? 'yes' : 'no',
    getDetails: (result: any) => JSON.stringify({
      ...result.initiationPhaseDetails,
      publicUrl: result.publicUrl,
      vapiCallId: result.vapiCallId
    }),
    phaseType: "initiation phase",
    bgColor: "bg-orange-50"
  },
  {
    label: "Greet Student",
    getValue: (result: any) => {
      const score = result.greetStudentScore;
      if (!score) return null;
      return score.toLowerCase() === 'yes' ? 'yes' : 
             score.toLowerCase() === 'partial' ? 'partial' : 'no';
    },
    getDetails: (result: any) => JSON.stringify({
      ...result.greetStudentCriteria,
      publicUrl: result.publicUrl,
      vapiCallId: result.vapiCallId
    }),
    phaseType: "greet student",
    bgColor: "bg-purple-50"
  },
  {
    label: "Understand Feelings",
    getValue: (result: any) => {
      const score = result.understandFeelingsScore;
      if (!score) return null;
      return score.toLowerCase() === 'yes' ? 'yes' : 
             score.toLowerCase() === 'partial' ? 'partial' : 'no';
    },
    getDetails: (result: any) => JSON.stringify({
      ...result.understandFeelingsCriteria,
      publicUrl: result.publicUrl,
      vapiCallId: result.vapiCallId
    }),
    phaseType: "understand feelings",
    bgColor: "bg-purple-50"
  },
  {
    label: "Provide Overview",
    getValue: (result: any) => {
      const score = result.provideOverviewScore;
      if (!score) return null;
      return score.toLowerCase() === 'yes' ? 'yes' : 
             score.toLowerCase() === 'partial' ? 'partial' : 'no';
    },
    getDetails: (result: any) => JSON.stringify({
      ...result.provideOverviewCriteria,
      publicUrl: result.publicUrl,
      vapiCallId: result.vapiCallId
    }),
    phaseType: "provide overview",
    bgColor: "bg-purple-50"
  },
  {
    label: "Goal Review",
    getValue: (result: any) => {
      const score = result.goalReviewScore;
      if (!score) return null;
      return score.toLowerCase() === 'yes' ? 'yes' : 
             score.toLowerCase() === 'partial' ? 'partial' : 'no';
    },
    getDetails: (result: any) => JSON.stringify({
      ...result.goalReviewCriteria,
      publicUrl: result.publicUrl,
      vapiCallId: result.vapiCallId
    }),
    phaseType: "goal review",
    bgColor: "bg-purple-50"
  },
  {
    label: "Competency Review",
    getValue: (result: any) => {
      const score = result.competencyReviewScore;
      if (!score) return null;
      return score.toLowerCase() === 'yes' ? 'yes' : 
             score.toLowerCase() === 'partial' ? 'partial' : 'no';
    },
    getDetails: (result: any) => JSON.stringify({
      ...result.competencyReviewCriteria,
      publicUrl: result.publicUrl,
      vapiCallId: result.vapiCallId
    }),
    phaseType: "competency review",
    bgColor: "bg-purple-50"
  },
  {
    label: "Purpose Review",
    getValue: (result: any) => {
      const score = result.purposeReviewScore;
      if (!score) return null;
      return score.toLowerCase() === 'yes' ? 'yes' : 
             score.toLowerCase() === 'partial' ? 'partial' : 'no';
    },
    getDetails: (result: any) => JSON.stringify({
      ...result.purposeReviewCriteria,
      publicUrl: result.publicUrl,
      vapiCallId: result.vapiCallId
    }),
    phaseType: "purpose review",
    bgColor: "bg-purple-50"
  },
  {
    label: "Key Events Reflection",
    getValue: (result: any) => {
      const score = result.keyEventsReflectionScore;
      if (!score) return null;
      return score.toLowerCase() === 'yes' ? 'yes' : 
             score.toLowerCase() === 'partial' ? 'partial' : 'no';
    },
    getDetails: (result: any) => JSON.stringify({
      ...result.keyEventsReflectionCriteria,
      publicUrl: result.publicUrl,
      vapiCallId: result.vapiCallId
    }),
    phaseType: "key events reflection",
    bgColor: "bg-purple-50"
  },
  {
    label: "Goal Setting",
    getValue: (result: any) => {
      const score = result.goalSettingScore;
      if (!score) return null;
      return score.toLowerCase() === 'yes' ? 'yes' : 
             score.toLowerCase() === 'partial' ? 'partial' : 'no';
    },
    getDetails: (result: any) => JSON.stringify({
      ...result.goalSettingCriteria,
      publicUrl: result.publicUrl,
      vapiCallId: result.vapiCallId
    }),
    phaseType: "goal setting",
    bgColor: "bg-purple-50"
  },
  {
    label: "Closing",
    getValue: (result: any) => {
      const score = result.closingScore;
      if (!score) return null;
      return score.toLowerCase() === 'yes' ? 'yes' : 
             score.toLowerCase() === 'partial' ? 'partial' : 'no';
    },
    getDetails: (result: any) => JSON.stringify({
      ...result.closingCriteria,
      publicUrl: result.publicUrl,
      vapiCallId: result.vapiCallId
    }),
    phaseType: "closing",
    bgColor: "bg-purple-50"
  },
  {
    label: "Post-Call Report Review",
    getValue: (result: any) => result.reportReviewPhaseSmooth ? 'yes' : 'no',
    getDetails: (result: any) => JSON.stringify({
      ...result.reportReviewPhaseDetails,
      publicUrl: result.publicUrl,
      vapiCallId: result.vapiCallId
    }),
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