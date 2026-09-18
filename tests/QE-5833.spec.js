const { test, expect } = require('@playwright/test');
const JiraAPIPage = require('../pages/JiraAPI.page');

test.describe('QE-5833 - Jira API Integration Validation', () => {
  let jiraAPIPage;

  test.beforeEach(async ({ page }) => {
    jiraAPIPage = new JiraAPIPage(page);
  });

  test('QE-5833 TS-001 TC-001 - Verify successful Story creation via API v2', async ({ page }) => {
    const token = 'Bearer valid_api_token_abc123';
    const response = await jiraAPIPage.createStory(token, {
      project: { key: 'DEMO' },
      issuetype: { name: 'Story' },
      summary: 'Test Story',
      parent: { key: 'DEMO-1' }
    });
    expect(response.status).toBe(201);
    await jiraAPIPage.verifyStoryCreated(response.data.key);
  });

  test('QE-5833 TS-002 TC-001 - Verify authentication error with invalid token', async ({ page }) => {
    const token = 'Bearer invalid_token_xyz';
    const response = await jiraAPIPage.createStory(token, {
      project: { key: 'DEMO' },
      issuetype: { name: 'Story' },
      summary: 'Test Story'
    });
    expect(response.status).toBe(401);
    expect(response.data.errorMessages).toContain('Unauthorized');
  });

  test('QE-5833 TS-003 TC-001 - Verify validation error with missing required fields', async ({ page }) => {
    const token = 'Bearer valid_api_token_abc123';
    const response = await jiraAPIPage.createStory(token, {
      project: { key: 'DEMO' },
      issuetype: { name: 'Story' }
    });
    expect(response.status).toBe(400);
    expect(response.data.errors.summary).toContain('required');
  });
});