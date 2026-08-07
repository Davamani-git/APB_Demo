const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { logger } = require('../../data/logger');

const testData = {
  url: 'https://onlineshop.example.com',
  username: 'testuser',
  password: 'Pass@123',
};

test('TS-002 TC-1111: Login flow', async ({ page }) => {
  logger.info('Step 1: Launch the Online Shopping Platform');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(testData.url);
  await expect(loginPage.loginContainer).toBeVisible();

  logger.info('Step 2: Enter valid username and password');
  await loginPage.login(testData.username, testData.password);

  logger.info('Step 3: Click on Login button');
  await expect(loginPage.dashboardContainer).toBeVisible();
});