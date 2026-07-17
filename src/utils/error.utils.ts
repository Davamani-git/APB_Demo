interface ErrorMappingResult {
  userMessage: string;
  correlationId?: string;
}

export const mapErrorToUserMessage = (error: any): ErrorMappingResult => {
  const response = error?.response;
  const code: string | undefined = response?.data?.code;
  const status: number | undefined = response?.status;
  const correlationId: string | undefined = response?.headers?.['x-correlation-id'];

  if (code === 'CONSENT_REQUIRED' || status === 409) {
    return {
      userMessage:
        'Insights are currently unavailable. Please enable spending insights in your preferences.',
      correlationId
    };
  }

  if (status === 401 || status === 403 || code === 'ACCESS_DENIED' || code === 'UNAUTHORIZED') {
    return {
      userMessage: 'You do not have access to this summary.',
      correlationId
    };
  }

  if (status === 503 || code === 'SERVICE_UNAVAILABLE') {
    return {
      userMessage: 'We are unable to load your summary right now. Please try again.',
      correlationId
    };
  }

  if (status === 400 || code === 'INVALID_MONTH') {
    return {
      userMessage: 'Month must be in format YYYY-MM and not in the future.',
      correlationId
    };
  }

  return {
    userMessage: 'Something went wrong while loading your monthly summary. Please try again.',
    correlationId
  };
};
