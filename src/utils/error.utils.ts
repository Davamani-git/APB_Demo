interface DisplayError {
  message: string;
  code?: string;
  correlationId?: string;
}

export const mapErrorToDisplay = (error: any): DisplayError => {
  const response = error?.response;
  const status: number | undefined = response?.status;
  const data = response?.data as { code?: string; message?: string } | undefined;
  const errorCode = data?.code;
  const correlationId = response?.headers?.['x-correlation-id'];

  if (status === 401 || status === 403 || errorCode === 'ACCESS_DENIED') {
    return {
      message: 'You do not have access to this summary.',
      code: errorCode ?? 'ACCESS_DENIED',
      correlationId,
    };
  }

  if (status === 409 && errorCode === 'CONSENT_REQUIRED') {
    return {
      message: 'Insights are currently unavailable. Please enable spending insights in your preferences.',
      code: 'CONSENT_REQUIRED',
      correlationId,
    };
  }

  if (status === 503 || errorCode === 'SERVICE_UNAVAILABLE') {
    return {
      message: 'We are unable to load your summary right now. Please try again.',
      code: 'SERVICE_UNAVAILABLE',
      correlationId,
    };
  }

  return {
    message: data?.message || 'Something went wrong while loading your summary.',
    code: errorCode,
    correlationId,
  };
};
