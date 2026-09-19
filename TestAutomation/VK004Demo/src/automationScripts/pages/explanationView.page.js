const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.ExplanationViewPage = class ExplanationViewPage {
  constructor(page) {
    this.page = page;
    this.explanationModal = page.locator('#explanation-modal');
    this.closeExplanationButton = page.locator('#close-explanation-modal');
    this.payerName = page.locator('#explanation-modal h4:nth-of-type(2)');
    this.ruleSetVersion = page.locator('#explanation-modal .card:has-text("Rule Set Information") p:has-text("Rule Set Version")');
    this.effectiveDate = page.locator('#explanation-modal .card:has-text("Rule Set Information") p:has-text("Effective Date")');
    this.evaluationDate = page.locator('#explanation-modal .card:has-text("Rule Set Information") p:has-text("Evaluation Date")');
    this.decisionExplanation = page.locator('#explanation-modal .card:has-text("Decision Explanation") p');
    this.requirementDetailsTable = page.locator('#explanation-modal .card:has-text("Requirement Details") table');
    this.recommendationsSection = page.locator('#explanation-modal .card:has-text("Recommendations")');
  }

  async clickViewExplanation(payerId) {
    logger.info(`Clicking View Explanation for payer: ${payerId}`);
    const viewExplanationButton = this.page.locator(`.card:has-text("${payerId}") button:has-text("View Explanation")`);
    await viewExplanationButton.click();
    await expect(this.explanationModal).toHaveClass(/active/);
    logger.info('Explanation modal opened');
  }

  async closeExplanation() {
    logger.info('Closing explanation modal');
    await this.closeExplanationButton.click();
    await expect(this.explanationModal).not.toBeVisible();
    logger.info('Explanation modal closed');
  }
};
