'use strict';

describe('Insights E2E', function () {
  it('should load insights dashboard', function () {
    browser.get('#/insights');
    expect(element(by.css('.insights-dashboard h2')).getText()).toContain('Personalized Financial Insights');
  });
});
