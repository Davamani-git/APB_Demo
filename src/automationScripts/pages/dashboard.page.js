const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardMenuLink = page.locator('a[href*="/dashboard"], nav a:has-text("Dashboard")');
    this.totalApplicationsCard = page.locator('.stat-card.total, [data-testid="total-applications"]');
    this.readyToSubmitCard = page.locator('.stat-card.ready, [data-testid="ready-to-submit"]');
    this.incompleteCard = page.locator('.stat-card.incomplete, [data-testid="incomplete"]');
    this.expiringSoonCard = page.locator('.stat-card.expiring, [data-testid="expiring-soon"]');
    this.coordinatorList = page.locator('.coordinator-list, [data-testid="coordinator-list"]');
    this.payerList = page.locator('.payer-list, [data-testid="payer-list"]');
    this.highPrioritySection = page.locator('.priority-section, [data-testid="high-priority"]');
  }

  async navigateToDashboard() {
    await expect(this.dashboardMenuLink).toBeVisible();
    await this.dashboardMenuLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyTotalApplicationsCount(expectedCount) {
    await expect(this.totalApplicationsCard).toBeVisible();
    await expect(this.totalApplicationsCard).toContainText(expectedCount.toString());
  }

  async verifyStatusCount(status, expectedCount) {
    let card;
    switch(status) {
      case 'Ready to Submit':
        card = this.readyToSubmitCard;
        break;
      case 'Incomplete':
        card = this.incompleteCard;
        break;
      case 'Expiring Soon':
        card = this.expiringSoonCard;
        break;
    }
    await expect(card).toBeVisible();
    await expect(card).toContainText(expectedCount.toString());
  }

  async clickStatusCard(status) {
    let card;
    switch(status) {
      case 'Ready to Submit':
        card = this.readyToSubmitCard;
        break;
      case 'Incomplete':
        card = this.incompleteCard;
        break;
      case 'Expiring Soon':
        card = this.expiringSoonCard;
        break;
    }
    await expect(card).toBeVisible();
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyCoordinatorInList(coordinatorName, applicationCount) {
    const coordinatorItem = this.page.locator(`.coordinator-item:has-text("${coordinatorName}")`);
    await expect(coordinatorItem).toBeVisible();
    await expect(coordinatorItem).toContainText(applicationCount.toString());
  }

  async clickCoordinatorDrillDown(coordinatorName) {
    const coordinatorItem = this.page.locator(`.coordinator-item:has-text("${coordinatorName}")`);
    await expect(coordinatorItem).toBeVisible();
    await coordinatorItem.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyPayerInList(payerName, applicationCount) {
    const payerItem = this.page.locator(`.payer-item:has-text("${payerName}")`);
    await expect(payerItem).toBeVisible();
    await expect(payerItem).toContainText(applicationCount.toString());
  }

  async clickPayerDrillDown(payerName) {
    const payerItem = this.page.locator(`.payer-item:has-text("${payerName}")`);
    await expect(payerItem).toBeVisible();
    await payerItem.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyHighPriorityApplication(applicationId, priorityScore) {
    const priorityItem = this.page.locator(`.priority-item:has-text("${applicationId}")`);
    await expect(priorityItem).toBeVisible();
    await expect(priorityItem).toContainText(priorityScore.toString());
  }
};
