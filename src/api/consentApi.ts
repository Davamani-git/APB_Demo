import { CONSENT_INSIGHTS_STATUS } from './endpoints';
import { ConsentStatus } from '@models/common';
import { USE_MOCK_API } from '@shared/constants';
import { httpClient } from './httpClient';
import { consentMockApi } from '@mocks/handlers/consentStatusHandler';

export const consentApi = {
  async getInsightsConsentStatus(): Promise<ConsentStatus> {
    if (USE_MOCK_API) {
      return consentMockApi.getInsightsConsentStatus();
    }

    const response = await httpClient.get<ConsentStatus>(CONSENT_INSIGHTS_STATUS);
    return response.data;
  }
};
