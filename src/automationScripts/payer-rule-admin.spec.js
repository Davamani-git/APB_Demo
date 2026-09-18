const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { PayerRuleAdminPage } = require('./pages/payer-rule-admin.page');
const { AuditLogPage } = require('./pages/audit-log.page');
const logger = require('../utils/logger');

test.describe('QE-5937: Payer Rule Set Administration', () => {
  let loginPage, payerRuleAdminPage, auditLogPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    payerRuleAdminPage = new PayerRuleAdminPage(page);
    auditLogPage = new AuditLogPage(page);
    await loginPage.navigate();
    await loginPage.login('admin1', 'Admin@123');
    logger.info('User logged in successfully as admin1');
  });

  test('TS-001 TC-001: Create new payer rule set with versioning and audit', async ({ page }) => {
    logger.info('Starting test: Create new payer rule set');
    
    await payerRuleAdminPage.navigate();
    await expect(payerRuleAdminPage.pageTitle).toBeVisible();
    logger.info('Payer Rule Set Admin page loaded');
    
    await payerRuleAdminPage.clickAddNewRuleSet();
    await expect(payerRuleAdminPage.ruleSetForm).toBeVisible();
    logger.info('New rule set creation form displayed');
    
    await payerRuleAdminPage.fillPayerName('Blue Shield of California');
    await payerRuleAdminPage.fillEffectiveDate('01/01/2025');
    await payerRuleAdminPage.addRequiredDocument('DEA Certificate');
    await payerRuleAdminPage.addRequiredDocument('Medical License');
    await payerRuleAdminPage.addRequiredDocument('Malpractice Insurance');
    await payerRuleAdminPage.addRequiredDocument('Board Certification');
    await payerRuleAdminPage.addRequiredField('NPI');
    await payerRuleAdminPage.addRequiredField('Tax ID');
    await payerRuleAdminPage.addRequiredField('Practice Address');
    logger.info('Rule set details entered');
    
    await payerRuleAdminPage.clickSave();
    await expect(payerRuleAdminPage.successMessage).toBeVisible();
    const version = await payerRuleAdminPage.getRuleSetVersion('Blue Shield of California');
    expect(version).toBe('1.0');
    logger.info('Rule set saved successfully with version 1.0');
    
    const isAvailable = await payerRuleAdminPage.isRuleSetAvailableForSelection('Blue Shield of California');
    expect(isAvailable).toBe(true);
    logger.info('New rule set immediately available for application evaluation');
    
    await auditLogPage.navigate();
    await auditLogPage.filterByEventType('RuleSetCreated');
    const auditEntry = await auditLogPage.getLatestEntry();
    expect(auditEntry.eventType).toBe('RuleSetCreated');
    expect(auditEntry.userId).toBe('admin1');
    expect(auditEntry.details).toContain('Blue Shield of California');
    logger.info('Audit log entry verified for rule set creation');
  });

  test('TS-002 TC-001: Edit existing payer rule set with versioning', async ({ page }) => {
    logger.info('Starting test: Edit existing payer rule set');
    
    await payerRuleAdminPage.navigate();
    await payerRuleAdminPage.selectRuleSet('Aetna', '2.0');
    await expect(payerRuleAdminPage.ruleSetDetails).toBeVisible();
    logger.info('Aetna v2.0 rule set selected');
    
    await payerRuleAdminPage.clickEdit();
    await expect(payerRuleAdminPage.ruleSetForm).toBeVisible();
    logger.info('Rule set form in edit mode');
    
    await payerRuleAdminPage.addRequiredDocument('Work History');
    logger.info('Added Work History to required documents');
    
    await payerRuleAdminPage.clickSave();
    await expect(payerRuleAdminPage.successMessage).toBeVisible();
    const newVersion = await payerRuleAdminPage.getRuleSetVersion('Aetna');
    expect(newVersion).toBe('3.0');
    logger.info('Rule set updated to version 3.0');
    
    await payerRuleAdminPage.createTestApplication('Aetna');
    const requirements = await payerRuleAdminPage.getApplicationRequirements();
    expect(requirements).toContain('Work History');
    logger.info('New applications now require Work History document');
    
    await auditLogPage.navigate();
    await auditLogPage.filterByEventType('RuleSetModified');
    await auditLogPage.filterByRuleSet('Aetna');
    const auditEntry = await auditLogPage.getLatestEntry();
    expect(auditEntry.eventType).toBe('RuleSetModified');
    expect(auditEntry.oldValue).toContain('v2.0');
    expect(auditEntry.newValue).toContain('v3.0');
    expect(auditEntry.newValue).toContain('Work History');
    logger.info('Audit log verified with old and new values');
  });

  test('TS-003 TC-001: Deactivate payer rule set with active applications', async ({ page }) => {
    logger.info('Starting test: Deactivate payer rule set');
    
    await payerRuleAdminPage.navigateToApplicationList();
    await payerRuleAdminPage.filterByPayer('UnitedHealthcare');
    await payerRuleAdminPage.filterByStatus('Active');
    const activeApps = await payerRuleAdminPage.getApplicationCount();
    expect(activeApps).toBeGreaterThan(0);
    logger.info(`Verified ${activeApps} active applications for UnitedHealthcare`);
    
    await payerRuleAdminPage.navigate();
    await payerRuleAdminPage.selectRuleSet('UnitedHealthcare');
    await expect(payerRuleAdminPage.ruleSetDetails).toBeVisible();
    logger.info('UnitedHealthcare rule set selected');
    
    await payerRuleAdminPage.clickDeactivate();
    await expect(payerRuleAdminPage.confirmationDialog).toBeVisible();
    logger.info('Deactivation confirmation dialog displayed');
    
    await payerRuleAdminPage.confirmDeactivation();
    const result = await payerRuleAdminPage.getDeactivationResult();
    expect(result).toMatch(/deactivated|prevented/);
    logger.info(`Deactivation result: ${result}`);
    
    if (result.includes('deactivated')) {
      await payerRuleAdminPage.navigateToApplicationList();
      await payerRuleAdminPage.filterByPayer('UnitedHealthcare');
      const appDetail = await payerRuleAdminPage.viewFirstApplication();
      const historicalStatus = await payerRuleAdminPage.getHistoricalReadinessStatus();
      expect(historicalStatus).toBeDefined();
      logger.info('Historical evaluation integrity maintained');
    }
    
    await auditLogPage.navigate();
    await auditLogPage.filterByEventType('RuleSetDeactivated');
    const auditEntry = await auditLogPage.getLatestEntry();
    expect(auditEntry.eventType).toBe('RuleSetDeactivated');
    expect(auditEntry.ruleSetId).toContain('UnitedHealthcare');
    expect(auditEntry.userId).toBe('admin1');
    logger.info('Audit log entry verified for deactivation');
  });
});
