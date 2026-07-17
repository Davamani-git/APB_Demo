'use strict';

describe('Reminders E2E', function () {
  it('should load reminders dashboard', function () {
    browser.get('#/reminders');
    expect(element(by.css('.reminders-dashboard h2')).getText()).toContain('Bill Reminders');
  });
});
