interface ErrorMappingResult {
  userMessage: string;
}

export function mapErrorToUserMessage(error: unknown): ErrorMappingResult {
  const defaultMessage = 'We are unable to load your summary right now. Please try again.';

  const anyError = error as any;
  const response = anyError?.response;
  const status: number | undefined = response?.status;
  const data = response?.data;
  const code: string | undefined = data?.code;

  if (status === 401 || status === 403) {
    return {
      userMessage: 'You do not have access to this summary.'
    };
  }

  if (status === 409 && code === 'CONSENT_REQUIRED') {
    return {
      userMessage:
        'Insights are currently unavailable. Please enable spending insights in your preferences.'
    };
  }

  if (status === 503) {
    return {
      userMessage: 'We are unable to load your summary right now. Please try again.'
    };
  }

  return { userMessage: defaultMessage };
}
