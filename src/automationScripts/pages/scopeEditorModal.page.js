const { expect } = require('@playwright/test');

exports.ScopeEditorModalPage = class ScopeEditorModalPage {
  constructor(page) {
    this.page = page;
    this.editorModal = page.locator('#scope-editor-modal');
    this.completedInput = page.locator('#completed-usecases');
    this.pendingInput = page.locator('#pending-usecases');
    this.totalInput = page.locator('#total-usecases');
    this.statusSelect = page.locator('#readiness-status');
    this.saveButton = page.locator('#save-scope');
    this.cancelButton = page.locator('#cancel-scope');
    this.validationMessage = page.locator('.validation-message');
  }
  async openForScope() {
    // Implementation to open the modal for a scope
  }
  async enterScopeFields({ completed, pending, total, status }) {
    if (completed !== undefined) {
      await this.completedInput.fill(completed.toString());
    }
    if (pending !== undefined) {
      await this.pendingInput.fill(pending.toString());
    }
    if (total !== undefined) {
      await this.totalInput.fill(total.toString());
    }
    if (status !== undefined) {
      await this.statusSelect.selectOption(status);
    }
  }
  async save() {
    await expect(this.saveButton).toBeVisible();
    await this.saveButton.click();
  }
  async cancel() {
    await expect(this.cancelButton).toBeVisible();
    await this.cancelButton.click();
  }
  async modifyField(field, value) {
    if (field === 'completed') {
      await this.completedInput.fill(value.toString());
    }
    // Add other fields if needed
  }
  async expectNoChangesPersisted() {
    // Custom logic to verify no changes
  }
};
