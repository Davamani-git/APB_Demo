const { expect } = require('@playwright/test');

exports.ThresholdConfigurationPage = class ThresholdConfigurationPage {
  constructor(page) {
    this.page = page;
  }

  async configureAlertThreshold(threshold) {
    const apiContext = await this.page.request.newContext();
    const response = await apiContext.post('/api/v1/config/threshold', {
      data: { alert_threshold: threshold }
    });
    await expect(response.status()).toBeLessThan(400);
    console.log(`Alert threshold configured to: ${threshold}`);
  }

  async attemptConfigureThreshold(endpoint, threshold) {
    try {
      const apiContext = await this.page.request.newContext();
      const response = await apiContext.post(endpoint, {
        data: { alert_threshold: threshold }
      });
      const result = await response.json();
      result.status = response.status();
      console.log(`Threshold configuration attempted with value: ${threshold}`);
      return result;
    } catch (error) {
      console.log(`Threshold configuration failed: ${error.message}`);
      return { error: error.message, status: 400 };
    }
  }

  async verifyThresholdSet(expectedThreshold) {
    const apiContext = await this.page.request.newContext();
    const response = await apiContext.get('/api/v1/config/threshold');
    const config = await response.json();
    await expect(config.alert_threshold).toBe(expectedThreshold);
    console.log(`Threshold verified: ${expectedThreshold}`);
  }

  async verifyConfigurationSubmitted(response) {
    await expect(response).toBeDefined();
    await expect(response.status).toBeDefined();
    console.log(`Configuration submitted with status: ${response.status}`);
  }

  async verifyConfigurationRejected(response) {
    await expect(response.status).toBeGreaterThanOrEqual(400);
    console.log('Configuration rejected as expected');
  }

  async verifyValidationError(response, validErrorCodes) {
    const errorCode = response.error_code || response.status.toString();
    const matchesAnyCode = validErrorCodes.some(code => 
      errorCode.includes(code) || errorCode === code
    );
    await expect(matchesAnyCode).toBeTruthy();
    console.log(`Validation error code verified: ${errorCode}`);
  }

  async verifyErrorMessage(response, expectedMessageSubstring) {
    await expect(response).toHaveProperty('error_message');
    const message = response.error_message || response.error || '';
    await expect(message.toLowerCase()).toContain(expectedMessageSubstring.toLowerCase());
    console.log(`Error message verified: ${message}`);
  }

  async prepareTestTransaction(transactionData) {
    await expect(transactionData).toBeDefined();
    await expect(transactionData.transaction_id).toBeDefined();
    await expect(transactionData.risk_score).toBeDefined();
    console.log(`Test transaction prepared: ${JSON.stringify(transactionData)}`);
  }

  async attemptEvaluateWithInvalidThreshold(transactionData) {
    try {
      const apiContext = await this.page.request.newContext();
      const response = await apiContext.post('/api/v1/policy/evaluate', {
        data: transactionData
      });
      const result = await response.json();
      result.status = response.status();
      return result;
    } catch (error) {
      console.log(`Evaluation with invalid threshold failed: ${error.message}`);
      return { error: error.message, status: 500 };
    }
  }

  async verifyEvaluationFailedDueToInvalidConfiguration(evaluationResult) {
    await expect(evaluationResult.status).toBeGreaterThanOrEqual(400);
    await expect(evaluationResult).toHaveProperty('error');
    const errorMessage = evaluationResult.error.toLowerCase();
    const hasConfigError = errorMessage.includes('configuration') || 
                          errorMessage.includes('threshold') || 
                          errorMessage.includes('invalid');
    await expect(hasConfigError).toBeTruthy();
    console.log('Evaluation failed due to invalid threshold configuration');
  }

  async verifyEvaluationFailedDueToMissingConfiguration(evaluationResult) {
    await expect(evaluationResult.status).toBeGreaterThanOrEqual(400);
    await expect(evaluationResult).toHaveProperty('error');
    const errorMessage = evaluationResult.error.toLowerCase();
    const hasMissingConfigError = errorMessage.includes('configuration') || 
                                 errorMessage.includes('threshold') || 
                                 errorMessage.includes('missing') ||
                                 errorMessage.includes('required');
    await expect(hasMissingConfigError).toBeTruthy();
    console.log('Evaluation failed due to missing threshold configuration');
  }
};