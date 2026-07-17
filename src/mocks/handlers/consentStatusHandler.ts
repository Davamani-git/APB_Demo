import sample from '@mocks/data/consentStatus.sample.json';
import { ConsentStatus } from '@models/common';

export const consentMockApi = {
  async getInsightsConsentStatus(): Promise<ConsentStatus> {
    return sample as unknown as ConsentStatus;
  }
};
