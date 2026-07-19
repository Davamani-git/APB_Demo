const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { DataSourceConfigPage } = require('./pages/dataSourceConfig.page');
const { ExtractionPage } = require('./pages/extraction.page');
const { TransformationPage } = require('./pages/transformation.page');
const { ValidationPage } = require('./pages/validation.page');

const logger = require('../../data/logger');
const env = require('../../data/env');

// QE-3232 TS-001 TC-001
 test('QE-3232 TS-001 TC-001: Configure new data source with valid credentials', async ({ page }) => {
  logger.info('Launching ETL management application');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.etlUrl);
  await loginPage.assertLoginPageDisplayed();

  logger.info('Logging in as System Administrator');
  await loginPage.login('sysadmin', 'Admin@123');
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.assertDashboardDisplayed();

  logger.info('Navigating to Data Source Configuration');
  await dashboardPage.goToDataSourceConfiguration();
  const dsConfigPage = new DataSourceConfigPage(page);
  await dsConfigPage.assertConfigPageDisplayed();

  logger.info('Adding new data source');
  await dsConfigPage.clickAddNewDataSource();
  await dsConfigPage.enterConnectionParameters({host: 'db01', port: '5432', db: 'substances', user: 'etluser', password: 'P@ssword1'});
  await dsConfigPage.assertFieldsAcceptInput();

  logger.info('Testing connection');
  await dsConfigPage.testConnection();
  await dsConfigPage.assertConnectionSuccess();

  logger.info('Saving configuration');
  await dsConfigPage.saveConfiguration();
  await dsConfigPage.assertConfigurationSaved();
 });

// QE-3232 TS-002 TC-001
 test('QE-3232 TS-002 TC-001: Add new data source with invalid credentials', async ({ page }) => {
  logger.info('Logging in and navigating to Data Source Configuration');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.etlUrl);
  await loginPage.login('sysadmin', 'Admin@123');
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.goToDataSourceConfiguration();
  const dsConfigPage = new DataSourceConfigPage(page);
  await dsConfigPage.assertConfigPageDisplayed();

  logger.info('Adding new data source with invalid credentials');
  await dsConfigPage.clickAddNewDataSource();
  await dsConfigPage.enterConnectionParameters({host: 'db01', port: '5432', db: 'substances', user: 'wronguser', password: 'WrongPass'});
  await dsConfigPage.assertFieldsAcceptInput();

  logger.info('Testing connection failure');
  await dsConfigPage.testConnection();
  await dsConfigPage.assertConnectionFailure();

  logger.info('Attempting to save failed configuration');
  await dsConfigPage.saveConfiguration();
  await dsConfigPage.assertConfigurationNotSaved();
 });

// QE-3232 TS-003 TC-001
 test('QE-3232 TS-003 TC-001: Add new data source with TLS/SSL and certificate', async ({ page }) => {
  logger.info('Logging in and opening Data Source Configuration');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.etlUrl);
  await loginPage.login('sysadmin', 'Admin@123');
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.goToDataSourceConfiguration();
  const dsConfigPage = new DataSourceConfigPage(page);
  await dsConfigPage.assertConfigPageDisplayed();

  logger.info('Adding new data source and enabling TLS/SSL');
  await dsConfigPage.clickAddNewDataSource();
  await dsConfigPage.enableTlsSsl();
  await dsConfigPage.assertTlsSslEnabled();

  logger.info('Entering valid parameters and uploading certificate');
  await dsConfigPage.enterConnectionParameters({host: 'db01', port: '5432', db: 'substances', user: 'etluser', password: 'P@ssword1'});
  await dsConfigPage.uploadCertificate('valid-cert.pem');
  await dsConfigPage.assertCertificateValidated();

  logger.info('Testing and saving TLS/SSL connection');
  await dsConfigPage.testConnection();
  await dsConfigPage.saveConfiguration();
  await dsConfigPage.assertTlsConnectionSaved();
 });

// QE-3233 TS-001 TC-001
 test('QE-3233 TS-001 TC-001: Scheduled ETL job and extraction log verification', async ({ page }) => {
  logger.info('Ensuring ETL job schedule and source availability');
  const extractionPage = new ExtractionPage(page);
  await extractionPage.ensureJobScheduled('2:00 AM');
  await extractionPage.assertSourcesOnline();

  logger.info('Waiting for scheduled time and monitoring job');
  await extractionPage.waitForJobStart();
  await extractionPage.assertJobStarted();

  logger.info('Verifying extraction of modified data');
  await extractionPage.verifyExtractionOfModifiedRecords();

  logger.info('Checking extraction log for metrics');
  await extractionPage.verifyExtractionLogMetrics();
 });

// QE-3233 TS-002 TC-001
 test('QE-3233 TS-002 TC-001: Delta extraction and audit trail', async ({ page }) => {
  logger.info('Completing initial extraction');
  const extractionPage = new ExtractionPage(page);
  await extractionPage.completeInitialExtraction();
  await extractionPage.assertInitialExtractionSuccess();

  logger.info('Modifying/adding records in source system');
  await extractionPage.modifySourceRecords();
  await extractionPage.assertRecordsModified();

  logger.info('Triggering next scheduled extraction');
  await extractionPage.triggerNextExtraction();
  await extractionPage.assertOnlyNewOrModifiedRecordsExtracted();

  logger.info('Reviewing delta log for audit trail');
  await extractionPage.verifyDeltaLogAuditTrail();
 });

// QE-3233 TS-003 TC-001
 test('QE-3233 TS-003 TC-001: Source timeout and retry handling', async ({ page }) => {
  logger.info('Simulating source system timeout');
  const extractionPage = new ExtractionPage(page);
  await extractionPage.simulateSourceTimeout();
  await extractionPage.assertTimeoutDetected();

  logger.info('Monitoring retry behavior');
  await extractionPage.monitorRetryBehavior();
  await extractionPage.assertRetryLogic(3);

  logger.info('Checking for admin alert if retries fail');
  await extractionPage.assertAdminAlertSent();

  logger.info('Reviewing job status after retries');
  await extractionPage.assertJobStatusFailedWithRetryExhausted();
 });

// QE-3234 TS-001 TC-001
 test('QE-3234 TS-001 TC-001: Data transformation and EUMDR field mapping', async ({ page }) => {
  logger.info('Ensuring extracted data in staging area');
  const transformationPage = new TransformationPage(page);
  await transformationPage.assertDataInStagingArea();

  logger.info('Initiating data transformation');
  await transformationPage.startTransformationProcess();
  await transformationPage.assertTransformationStarted();

  logger.info('Verifying mapping to EUMDR fields');
  await transformationPage.verifyFieldMapping({cas: true, name: true, concentration: true, classification: true});

  logger.info('Checking mandatory fields validation');
  await transformationPage.assertMandatoryFieldsValidated();
 });

// QE-3234 TS-002 TC-001
 test('QE-3234 TS-002 TC-001: Unit conversion and logging', async ({ page }) => {
  logger.info('Providing source data with concentrations in multiple units');
  const transformationPage = new TransformationPage(page);
  await transformationPage.provideSourceData({ppm: 1000, percent: 0.1, mgkg: 1000});
  await transformationPage.assertSourceDataAccepted();

  logger.info('Running transformation process');
  await transformationPage.startTransformationProcess();
  await transformationPage.assertTransformationCompleted();

  logger.info('Verifying conversion to EUMDR units and logging');
  await transformationPage.verifyUnitConversionAndLogging();
 });

// QE-3234 TS-003 TC-001
 test('QE-3234 TS-003 TC-001: Internal code mapping to CAS, GHS, SVHC', async ({ page }) => {
  logger.info('Providing source data with internal substance codes');
  const transformationPage = new TransformationPage(page);
  await transformationPage.provideSourceDataWithInternalCodes('SUB-001');
  await transformationPage.assertSourceDataAccepted();

  logger.info('Running transformation process');
  await transformationPage.startTransformationProcess();
  await transformationPage.assertProcessCompleted();

  logger.info('Verifying mapping to CAS, GHS, SVHC');
  await transformationPage.verifyMappingToRegulatoryFields();
 });

// QE-3235 TS-001 TC-001
 test('QE-3235 TS-001 TC-001: Validation rules engine and report review', async ({ page }) => {
  logger.info('Ensuring transformed data ready for validation');
  const validationPage = new ValidationPage(page);
  await validationPage.assertTransformedDataAvailable();

  logger.info('Executing validation rules engine');
  await validationPage.executeValidationRulesEngine();
  await validationPage.assertValidationProcessCompleted();

  logger.info('Checking EUMDR mandatory fields');
  await validationPage.assertMandatoryFieldsValidity();

  logger.info('Reviewing generated validation report');
  await validationPage.reviewValidationReport();
 });
