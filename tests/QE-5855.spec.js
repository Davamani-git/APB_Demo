const { test, expect } = require('@playwright/test');
const IntegrationPage = require('../pages/Integration.page');

test.describe('QE-5855 - AI Integration Management', () => {
  let integrationPage;

  test.beforeEach(async ({ page }) => {
    integrationPage = new IntegrationPage(page);
  });

  test('QE-5855 TS-001 TC-001 - Verify successful integration configuration', async ({ page }) => {
    await integrationPage.navigate();
    await integrationPage.clickAddIntegration();
    await integrationPage.selectProvider('AWS AI Services');
    await integrationPage.enterCredentials('AKIAIOSFODNN7EXAMPLE', 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY');
    await integrationPage.validateConnectivity();
    await expect(integrationPage.successMessage).toBeVisible();
    await integrationPage.clickSave();
    await expect(integrationPage.integrationStatus).toContainText('active');
  });

  test('QE-5855 TS-002 TC-001 - Verify connectivity failure with invalid credentials', async ({ page }) => {
    await integrationPage.navigate();
    await integrationPage.clickAddIntegration();
    await integrationPage.selectProvider('AWS AI Services');
    await integrationPage.enterCredentials('INVALID_KEY', 'INVALID_SECRET');
    await integrationPage.validateConnectivity();
    await expect(integrationPage.errorMessage).toContainText('authentication issues');
  });

  test('QE-5855 TS-003 TC-001 - Verify pending status with retry when service unreachable', async ({ page }) => {
    await integrationPage.navigate();
    await integrationPage.configureIntegration('Azure AI', 'valid_credentials');
    await integrationPage.simulateServiceUnreachable();
    await integrationPage.clickSave();
    await expect(integrationPage.integrationStatus).toContainText('Pending');
    await integrationPage.verifyRetryInitiated();
  });
});