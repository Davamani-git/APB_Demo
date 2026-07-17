import { useQuery } from '@tanstack/react-query';
import { consentApi } from '@api/consentApi';
import { ConsentStatus } from '@models/common';

const CONSENT_QUERY_KEY = 'insightsConsentStatus';

export function useConsentStatus() {
  return useQuery<ConsentStatus, Error>([CONSENT_QUERY_KEY], () => consentApi.getInsightsConsentStatus(), {
    staleTime: 10 * 60 * 1000
  });
}
