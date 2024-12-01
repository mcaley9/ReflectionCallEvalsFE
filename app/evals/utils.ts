export const formatDate = (date: Date | null) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

const formatDuration = (seconds: number) => {
  if (!seconds) return 'N/A';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export const getOverallStatusDetails = (result: any) => {
  return `Date: ${formatDate(result.createdAt)}
Recording Duration: ${formatDuration(result.recordingDurationSeconds)}
User ID: ${result.userId || 'N/A'}
Frontegg ID: ${result.fronteggId || 'N/A'}
Client ID: ${result.clientId || 'N/A'}
Tenant ID: ${result.tenantId || 'N/A'}
Assignment ID: ${result.assignmentId || 'N/A'}
PL Group ID: ${result.plGroupId || 'N/A'}
Schedule ID: ${result.scheduleId || 'N/A'}
Activity Type: ${result.activityType || 'N/A'}
Experience Type: ${result.experienceType || 'N/A'}
Simulation Data Type: ${result.simulationDataType || 'N/A'}
Public URL: ${result.publicUrl || 'N/A'}`;
};

export const mapSmoothnessToStatus = (smoothnessLevel: string | null) => {
  if (!smoothnessLevel) return null;
  
  switch (smoothnessLevel.toLowerCase()) {
    case 'completely_smooth':
    case 'completely smooth':
      return "true";
    case 'mostly_smooth':
    case 'mostly smooth':
      return "warning";
    case 'not_smooth':
    case 'not smooth':
      return "false";
    default:
      console.log('Unknown smoothness level:', smoothnessLevel);
      return null;
  }
}; 