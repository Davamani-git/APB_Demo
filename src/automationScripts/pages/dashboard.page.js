const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.navigationMenu = page.locator('.nav');
    this.dashboardNavLink = page.locator('.nav a[href="#!/dashboard"]');
    this.myCardsNavLink = page.locator('.nav a[href="#!/cards"]');
    this.analyticsNavLink = page.locator('.nav a[href="#!/analytics"]');
    this.kpiCardsContainer = page.locator('.kpi-grid');
    this.monthlySpendKPI = page.locator('.kpi-card:has-text("Monthly Spend") .value');
    this.totalCreditLimitKPI = page.locator('.kpi-card:has-text("Total Credit Limit") .value');
    this.availableCreditKPI = page.locator('.kpi-card:has-text("Available Credit") .value');
    this.outstandingAmountKPI = page.locator('.kpi-card:has-text("Outstanding Amount") .value');
    this.allKPICards = page.locator('.kpi-card');
  }

  async navigate() {
    await this.page.goto('index.html');
    await expect(this.page).toHaveURL(/index.html/);
  }

  async clickDashboardNav() {
    await expect(this.dashboardNavLink).toBeVisible();
    await this.dashboardNavLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickMyCardsNav() {
    await expect(this.myCardsNavLink).toBeVisible();
    await this.myCardsNavLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickAnalyticsNav() {
    await expect(this.analyticsNavLink).toBeVisible();
    await this.analyticsNavLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getAllKPICards() {
    await expect(this.allKPICards.first()).toBeVisible();
    return await this.allKPICards.all();
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    return await this.monthlySpendKPI.textContent();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    return await this.totalCreditLimitKPI.textContent();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    return await this.availableCreditKPI.textContent();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    return await this.outstandingAmountKPI.textContent();
  }

  async verifyKPIValuesDisplayed() {
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
  }
};