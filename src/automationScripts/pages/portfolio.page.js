const { expect } = require('@playwright/test');
const { logger } = require('../../../utils/logger');

exports.PortfolioPage = class PortfolioPage {
  constructor(page) {
    this.page = page;
    this.summarySection = page.locator('#portfolio-summary');
    this.cardRows = page.locator('[data-testid="portfolio-card-row"]');
    this.cardName = page.locator('[data-testid="portfolio-card-name"]');
    this.institution = page.locator('[data-testid="portfolio-institution"]');
    this.maskedCardNumber = page.locator('[data-testid="portfolio-masked-card-number"]');
    this.creditLimit = page.locator('[data-testid="portfolio-credit-limit"]');
    this.availableCredit = page.locator('[data-testid="portfolio-available-credit"]');
    this.outstanding = page.locator('[data-testid="portfolio-outstanding"]');
    this.billingDate = page.locator('[data-testid="portfolio-billing-date"]');
    this.dueDate = page.locator('[data-testid="portfolio-due-date"]');
    this.sensitiveInfo = page.locator('[data-testid="portfolio-sensitive-info"]');
  }
  async goToSummarySection() {
    logger.info('Navigating to portfolio summary section');
    await expect(this.summarySection).toBeVisible();
  }
  async assertAllCardDetailsVisible() {
    logger.info('Asserting all card details are visible');
    const rowCount = await this.cardRows.count();
    for (let i = 0; i < rowCount; i++) {
      const row = this.cardRows.nth(i);
      await expect(row.locator('[data-testid="portfolio-card-name"]')).toBeVisible();
      await expect(row.locator('[data-testid="portfolio-institution"]')).toBeVisible();
      await expect(row.locator('[data-testid="portfolio-masked-card-number"]')).toBeVisible();
      await expect(row.locator('[data-testid="portfolio-credit-limit"]')).toBeVisible();
      await expect(row.locator('[data-testid="portfolio-available-credit"]')).toBeVisible();
      await expect(row.locator('[data-testid="portfolio-outstanding"]')).toBeVisible();
      await expect(row.locator('[data-testid="portfolio-billing-date"]')).toBeVisible();
      await expect(row.locator('[data-testid="portfolio-due-date"]')).toBeVisible();
    }
  }
  async selectCard(cardLabel) {
    logger.info(`Selecting card: ${cardLabel}`);
    await this.cardRows.filter({ hasText: cardLabel }).first().click();
    await expect(this.creditLimit).toBeVisible();
    await expect(this.availableCredit).toBeVisible();
    await expect(this.outstanding).toBeVisible();
  }
  async assertNoSensitiveInfo() {
    logger.info('Asserting no sensitive info is exposed');
    await expect(this.sensitiveInfo).toHaveCount(0);
  }
};
