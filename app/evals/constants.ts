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
    getDetails: (result: any) => result.authPhaseDetails,
    phaseType: "auth phase",
    bgColor: "bg-orange-50"
  },
  {
    label: "Selection Phase",
    getValue: (result: any) => result.selectionPhaseSmooth,
    getDetails: (result: any) => result.selectionPhaseDetails,
    phaseType: "selection phase",
    bgColor: "bg-orange-50"
  },
  {
    label: "Initiation Phase",
    getValue: (result: any) => result.initiationPhaseSmooth,
    getDetails: (result: any) => result.initiationPhaseDetails,
    phaseType: "initiation phase",
    bgColor: "bg-orange-50"
  },
  {
    label: "Greet Student",
    getValue: (result: any) => result.greetStudentScore,
    getDetails: (result: any) => result.greetStudentCriteria,
    phaseType: "greet student",
    bgColor: "bg-purple-50"
  },
  {
    label: "Understand Feelings",
    getValue: (result: any) => result.understandFeelingsScore,
    getDetails: (result: any) => result.understandFeelingsCriteria,
    phaseType: "understand feelings",
    bgColor: "bg-purple-50"
  },
  {
    label: "Provide Overview",
    getValue: (result: any) => result.provideOverviewScore,
    getDetails: (result: any) => result.provideOverviewCriteria,
    phaseType: "provide overview",
    bgColor: "bg-purple-50"
  },
  {
    label: "Goal Review",
    getValue: (result: any) => result.goalReviewScore,
    getDetails: (result: any) => result.goalReviewCriteria,
    phaseType: "goal review",
    bgColor: "bg-purple-50"
  },
  {
    label: "Competency Review",
    getValue: (result: any) => result.competencyReviewScore,
    getDetails: (result: any) => result.competencyReviewCriteria,
    phaseType: "competency review",
    bgColor: "bg-purple-50"
  },
  {
    label: "Purpose Review",
    getValue: (result: any) => result.purposeReviewScore,
    getDetails: (result: any) => result.purposeReviewCriteria,
    phaseType: "purpose review",
    bgColor: "bg-purple-50"
  },
  {
    label: "Key Events Reflection",
    getValue: (result: any) => result.keyEventsReflectionScore,
    getDetails: (result: any) => result.keyEventsReflectionCriteria,
    phaseType: "key events reflection",
    bgColor: "bg-purple-50"
  },
  {
    label: "Goal Setting",
    getValue: (result: any) => result.goalSettingScore,
    getDetails: (result: any) => result.goalSettingCriteria,
    phaseType: "goal setting",
    bgColor: "bg-purple-50"
  },
  {
    label: "Closing",
    getValue: (result: any) => result.closingScore,
    getDetails: (result: any) => result.closingCriteria,
    phaseType: "closing",
    bgColor: "bg-purple-50"
  },
  {
    label: "UX Issues",
    getValue: (result: any) => result.userExperienceIssues,
    getDetails: (result: any) => result.userExperienceIssues,
    phaseType: "UX issues",
    bgColor: "bg-orange-50"
  }
]; 