const { expect } = require('@playwright/test');

exports.DataSourceConfigPage = class DataSourceConfigPage {
  constructor(page) {
    this.page = page;
    this.configTitle = page.locator('h2', { hasText: 'Data Source Configuration' });
    this.addNewBtn = page.locator('button', { hasText: 'Add New Data Source' });
    this.hostInput = page.locator('#host');
    this.portInput = page.locator('#port');
    this.dbInput = page.locator('#database');
    this.userInput = page.locator('#dbuser');
    this.passwordInput = page.locator('#dbpassword');
    this.tlsCheckbox = page.locator('#tls_ssl');
    this.certUpload = page.locator('#certUpload');
    this.testConnectionBtn = page.locator('button', { hasText: 'Test Connection' });
    this.saveBtn = page.locator('button', { hasText: 'Save Configuration' });
    this.successMsg = page.locator('.alert-success');
    this.errorMsg = page.locator('.alert-danger');
  }
  async assertConfigPageDisplayed() {
    await expect(this.configTitle).toBeVisible();
  }
  async clickAddNewDataSource() {
    await expect(this.addNewBtn).toBeVisible();
    await this.addNewBtn.click();
  }
  async enterConnectionParameters(params) {
    await expect(this.hostInput).toBeVisible();
    await this.hostInput.fill(params.host);
    await expect(this.portInput).toBeVisible();
    await this.portInput.fill(params.port);
    await expect(this.dbInput).toBeVisible();
    await this.dbInput.fill(params.db);
    await expect(this.userInput).toBeVisible();
    await this.userInput.fill(params.user);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(params.password);
  }
  async assertFieldsAcceptInput() {
    await expect(this.hostInput).toHaveValue(/.+/);
    await expect(this.portInput).toHaveValue(/.+/);
    await expect(this.dbInput).toHaveValue(/.+/);
    await expect(this.userInput).toHaveValue(/.+/);
    await expect(this.passwordInput).toHaveValue(/.+/);
  }
  async enableTlsSsl() {
    await expect(this.tlsCheckbox).toBeVisible();
    await this.tlsCheckbox.check();
  }
  async assertTlsSslEnabled() {
    await expect(this.tlsCheckbox).toBeChecked();
  }
  async uploadCertificate(certFile) {
    await expect(this.certUpload).toBeVisible();
    await this.certUpload.setInputFiles(certFile);
  }
  async assertCertificateValidated() {
    await expect(this.successMsg).toContainText('Certificate validated');
  }
  async testConnection() {
    await expect(this.testConnectionBtn).toBeEnabled();
    await this.testConnectionBtn.click();
  }
  async assertConnectionSuccess() {
    await expect(this.successMsg).toContainText('Connection successful');
  }
  async assertConnectionFailure() {
    await expect(this.errorMsg).toContainText('Authentication failure');
  }
  async saveConfiguration() {
    await expect(this.saveBtn).toBeEnabled();
    await this.saveBtn.click();
  }
  async assertConfigurationSaved() {
    await expect(this.successMsg).toContainText('Configuration saved');
  }
  async assertConfigurationNotSaved() {
    await expect(this.errorMsg).toContainText('Configuration not saved');
  }
  async assertTlsConnectionSaved() {
    await expect(this.successMsg).toContainText('TLS/SSL configuration saved');
  }
};