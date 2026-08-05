const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.cardEntries = page.locator('.card-entry');
    this.creditLimit = (card) => card.locator('.credit-limit');
    this.outstandingAmount = (card) => card.locator('.outstanding-amount');
    this.availableCredit = (card) => card.locator('.available-credit');
    this.dashboardLoaded = page.locator('#dashboard-overview');
  }
  async loginAsCustomerWithMultipleCards() {
    // Implementation depends on the login page, assumed abstracted for test data user
    // Example: await this.page.goto('/login'); ...
    logger.info('Logging in as customer with 2+ active cards');
    // ...login logic here
  }
  async waitForDashboardLoad() {
    await expect(this.dashboardLoaded).toBeVisible();
  }
  async expectCardDetails(index, { limit, outstanding, available }) {
    const card = this.cardEntries.nth(index);
    await expect(card).toBeVisible();
    await expect(this.creditLimit(card)).toHaveText(limit);
    await expect(this.outstandingAmount(card)).toHaveText(outstanding);
    await expect(this.availableCredit(card)).toHaveText(available);
  }
};
