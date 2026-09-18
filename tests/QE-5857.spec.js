const { test, expect } = require('@playwright/test');
const CostOptimizationPage = require('../pages/CostOptimization.page');

test.describe('QE-5857 - AI Budget Threshold Configuration', () => {
  let costOptimizationPage;

  test.beforeEach(async ({ page }) => {
    costOptimizationPage = new CostOptimizationPage(page);
  });

  test('QE-5857 TS-001 TC-001 - Verify successful configuration and storage of AI spend threshold', async ({ page }) => {
    await costOptimizationPage.navigate();
    await costOptimizationPage.selectCompany('Acme Corp');
    await costOptimizationPage.enterThreshold('50000');
    await costOptimizationPage.clickSave();
    await expect(costOptimizationPage.confirmationMessage).toBeVisible();
    await costOptimizationPage.verifyThresholdStored('50000');
  });

  test('QE-5857 TS-002 TC-001 - Verify validation error with negative threshold', async ({ page }) => {
    await costOptimizationPage.navigate();
    await costOptimizationPage.selectCompany('Acme Corp');
    await costOptimizationPage.enterThreshold('-5000');
    await costOptimizationPage.clickSave();
    await expect(costOptimizationPage.validationError).toContainText('positive numeric values only');
  });

  test('QE-5857 TS-002 TC-002 - Verify validation error with non-numeric input', async ({ page }) => {
    await costOptimizationPage.navigate();
    await costOptimizationPage.selectCompany('Acme Corp');
    await costOptimizationPage.enterThreshold('ABC123');
    await costOptimizationPage.clickSave();
    await expect(costOptimizationPage.validationError).toContainText('numeric values required');
  });

  test('QE-5857 TS-003 TC-001 - Verify validation error with missing required fields', async ({ page }) => {
    await costOptimizationPage.navigate();
    await costOptimizationPage.clickSave();
    await expect(costOptimizationPage.validationError).toContainText('threshold amount');
  });
});