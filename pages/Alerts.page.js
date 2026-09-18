class AlertsPage {
  constructor(page) {
    this.page = page;
    this.alertNotification = page.locator('[data-testid="alert-notification"]');
    this.recommendation = page.locator('[data-testid="recommendation"]');
    this.thresholdConfig = page.locator('[data-testid="threshold-config"]');
  }

  async configureThreshold(company, amount) {
    await this.page.goto('/cost-optimization');
    await this.page.locator('[data-testid="company-dropdown"]').selectOption(company);
    await this.page.locator('[data-testid="threshold-input"]').fill(amount);
    await this.page.locator('[data-testid="save-button"]').click();
  }

  async simulateSpendData(amount) {
    await this.page.evaluate((amt) => {
      window.simulateSpend(amt);
    }, amount);
  }

  async waitForAlert(timeout = 300000) {
    await this.page.waitForSelector('[data-testid="alert-notification"]', { timeout });
  }

  async waitForProcessing() {
    await this.page.waitForTimeout(5000);
  }

  async navigateToDashboard() {
    await this.page.goto('/dashboard');
  }

  async simulateServiceFailure() {
    await this.page.route('**/api/alerts', route => route.abort());
  }

  async verifyFailureLogged() {
    const logs = await this.page.evaluate(() => window.getSystemLogs());
    if (!logs.some(log => log.includes('alert generation failure'))) {
      throw new Error('Failure not logged');
    }
  }

  async verifyRetryInitiated() {
    const logs = await this.page.evaluate(() => window.getSystemLogs());
    if (!logs.some(log => log.includes('retry'))) {
      throw new Error('Retry not initiated');
    }
  }
}

module.exports = AlertsPage;