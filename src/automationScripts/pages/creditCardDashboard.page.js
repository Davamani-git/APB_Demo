const { expect } = require('@playwright/test');

exports.CreditCardDashboardPage = class CreditCardDashboardPage {
  constructor(page) {
    this.page = page;
    
    // Dashboard container
    this.dashboardContainer = page.locator('[class*="dashboard"], [id*="dashboard"], main, [role="main"]');
    
    // KPI locators
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend"], [class*="monthly-spend"], [id*="monthly-spend"], :text("Monthly Spend") >> xpath=ancestor::*[contains(@class, "kpi") or contains(@class, "card") or contains(@class, "metric")][1]');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit"], [class*="total-credit-limit"], [id*="total-credit-limit"], :text("Total Credit Limit") >> xpath=ancestor::*[contains(@class, "kpi") or contains(@class, "card") or contains(@class, "metric")][1]');
    this.availableCreditKPI = page.locator('[data-testid="available-credit"], [class*="available-credit"], [id*="available-credit"], :text("Available Credit") >> xpath=ancestor::*[contains(@class, "kpi") or contains(@class, "card") or contains(@class, "metric")][1]');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount"], [class*="outstanding-amount"], [id*="outstanding-amount"], :text("Outstanding Amount") >> xpath=ancestor::*[contains(@class, "kpi") or contains(@class, "card") or contains(@class, "metric")][1]');
    
    // Empty state and error messages
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"], [class*="no-cards"], [class*="empty-state"], :text("No credit cards linked"), :text("No active credit cards")');
    this.emptyStateMessage = page.locator('[data-testid="empty-state"], [class*="empty-state"], :text("Get started by adding your first credit card")');
    this.kpiErrorMessage = page.locator('[data-testid="kpi-error"], [class*="error-message"], [class*="alert"], :text("Unable to load KPI data"), :text("Please try again later")');
    
    // Error and warning indicators
    this.errorIndicator = page.locator('[class*="error"], [data-status="error"], .error-icon, [aria-label*="error" i]');
    this.warningIndicator = page.locator('[class*="warning"], [data-status="warning"], .warning-icon, [aria-label*="warning" i]');
  }

  async navigateToDashboard() {
    await expect(this.dashboardContainer).toBeVisible();
  }

  async verifyKPIDisplaysZeroOrNull(kpiLocator) {
    await expect(kpiLocator).toBeVisible();
    const kpiText = await kpiLocator.textContent();
    const hasValidEmptyState = kpiText.includes('$0.00') || 
                                kpiText.includes('--') || 
                                kpiText.includes('N/A') || 
                                kpiText.includes('0.00');
    expect(hasValidEmptyState).toBeTruthy();
  }

  async verifyKPIShowsErrorIndicator(kpiLocator) {
    await expect(kpiLocator).toBeVisible();
    const kpiText = await kpiLocator.textContent();
    const hasErrorState = kpiText.includes('--') || 
                          kpiText.includes('Unable to load') || 
                          kpiText.includes('Error') ||
                          kpiText.includes('N/A');
    
    if (!hasErrorState) {
      // Check for error icon within or near the KPI
      const errorIcon = kpiLocator.locator('[class*="error"], [data-status="error"], .error-icon');
      await expect(errorIcon).toBeVisible();
    }
  }

  async verifyKPIShowsWarningIndicator(kpiLocator) {
    await expect(kpiLocator).toBeVisible();
    const kpiText = await kpiLocator.textContent();
    const hasWarningState = kpiText.includes('Data unavailable') || 
                            kpiText.includes('Invalid data') || 
                            kpiText.includes('--') ||
                            kpiText.includes('N/A');
    
    if (!hasWarningState) {
      // Check for warning icon within or near the KPI
      const warningIcon = kpiLocator.locator('[class*="warning"], [data-status="warning"], .warning-icon');
      await expect(warningIcon).toBeVisible();
    }
  }
};
