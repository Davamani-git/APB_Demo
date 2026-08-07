const { test, expect } = require('@playwright/test');
const { RegistrationPage } = require('./pages/registration.page');
const { logger } = require('../../data/logger');

const testData = {
  url: 'https://onlineshop.example.com',
  username: 'testuser',
  email: 'testuser@email.com',
  password: 'Pass@123',
};

test('TS-001 TC-1110: Registration flow', async ({ page }) => {
  logger.info('Step 1: Launch the Online Shopping Platform');
  const registrationPage = new RegistrationPage(page);
  await registrationPage.navigate(testData.url);
  await expect(registrationPage.loginOrRegisterContainer).toBeVisible();

  logger.info('Step 2: Click on Register button');
  await registrationPage.clickRegisterButton();
  await expect(registrationPage.registrationFormContainer).toBeVisible();

  logger.info('Step 3: Enter valid user details');
  await registrationPage.enterRegistrationDetails(testData.username, testData.email, testData.password);
  await expect(registrationPage.registrationSubmitButton).toBeEnabled();

  logger.info('Step 4: Submit the registration form');
  await registrationPage.submitRegistration();
  await expect(registrationPage.dashboardContainer).toBeVisible();
});