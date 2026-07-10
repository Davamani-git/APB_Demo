const { test, expect } = require('@playwright/test');
const { TimerPage } = require('./pages/timer.page');

// Utility for logging
const { logger } = require('../utils/logger');

// URLs and environment values
const timerAppUrl = require('../../data/timerAppUrl');

// QE-2183 TS-001 TC-001 - Responsive Centering

test.describe('Timer Responsive and Accessibility Tests', () => {

  test('QE-2183 TS-001 TC-001: Timer and controls remain centered across desktop and mobile', async ({ page, browserName }) => {
    const timerPage = new TimerPage(page);
    logger.info('Navigating to timer application');
    await timerPage.navigate(timerAppUrl);
    await timerPage.assertCentered();

    logger.info('Resizing to 1920px width');
    await page.setViewportSize({ width: 1920, height: 900 });
    await timerPage.assertCentered();

    logger.info('Resizing to 1366px width');
    await page.setViewportSize({ width: 1366, height: 900 });
    await timerPage.assertCentered();

    logger.info('Resizing to 1024px width');
    await page.setViewportSize({ width: 1024, height: 900 });
    await timerPage.assertCentered();

    if (browserName === 'chromium') {
      logger.info('Emulating mobile device for Chrome');
      await page.setViewportSize({ width: 375, height: 667 });
      await timerPage.assertCentered();
      logger.info('Rotating device to landscape');
      await page.setViewportSize({ width: 667, height: 375 });
      await timerPage.assertCentered();
    }
  });

  test('QE-2183 TS-002 TC-001: Timer font size is readable and scales correctly', async ({ page }) => {
    const timerPage = new TimerPage(page);
    await timerPage.navigate(timerAppUrl);
    await timerPage.assertFontReadable();
    await page.setViewportSize({ width: 320, height: 900 });
    await timerPage.assertFontReadable();
    await page.setViewportSize({ width: 1920, height: 900 });
    await timerPage.assertFontReadable();
    await page.setViewportSize({ width: 375, height: 667 });
    await timerPage.assertFontReadable();
  });

  test('QE-2183 TS-003 TC-001: Timer controls visible and accessible on small mobile', async ({ page }) => {
    const timerPage = new TimerPage(page);
    await page.setViewportSize({ width: 320, height: 568 });
    await timerPage.navigate(timerAppUrl);
    await timerPage.assertControlsVisible();
    await timerPage.start();
    await timerPage.assertTimerRunning();
    await timerPage.pause();
    await timerPage.assertTimerPaused();
    await timerPage.stop();
    await timerPage.assertTimerReset();
    await timerPage.assertControlsSize();
  });

  test('QE-2183 TS-001 TC-002: Timer display shows 00:00:00 on load', async ({ page }) => {
    const timerPage = new TimerPage(page);
    await timerPage.navigate(timerAppUrl);
    await timerPage.assertTimerValue('00:00:00');
  });

  test('QE-2183 TS-001 TC-003: Timer counts for 5 seconds after Start', async ({ page }) => {
    const timerPage = new TimerPage(page);
    await timerPage.navigate(timerAppUrl);
    await timerPage.start();
    await timerPage.waitForSeconds(5);
    await timerPage.assertTimerValue('00:00:05');
  });

  test('QE-2183 TS-001 TC-004: Timer pauses at 10 seconds', async ({ page }) => {
    const timerPage = new TimerPage(page);
    await timerPage.navigate(timerAppUrl);
    await timerPage.start();
    await timerPage.waitForSeconds(10);
    await timerPage.assertTimerValue('00:00:10');
    await timerPage.pause();
    await timerPage.assertTimerPausedAt('00:00:10');
  });

  test('QE-2183 TS-001 TC-005: Timer resumes after pause', async ({ page }) => {
    const timerPage = new TimerPage(page);
    await timerPage.navigate(timerAppUrl);
    await timerPage.start();
    await timerPage.waitForSeconds(10);
    await timerPage.pause();
    await timerPage.assertTimerPausedAt('00:00:10');
    await timerPage.start();
    await timerPage.assertTimerRunning();
  });

  test('QE-2183 TS-001 TC-006: Timer resets after Stop', async ({ page }) => {
    const timerPage = new TimerPage(page);
    await timerPage.navigate(timerAppUrl);
    await timerPage.start();
    await timerPage.waitForSeconds(3);
    await timerPage.stop();
    await timerPage.assertTimerValue('00:00:00');
  });

  test('QE-2183 TS-001 TC-007: Rapid Start clicks do not duplicate timer', async ({ page }) => {
    const timerPage = new TimerPage(page);
    await timerPage.navigate(timerAppUrl);
    await timerPage.start();
    for (let i = 0; i < 5; i++) {
      await timerPage.start();
    }
    await timerPage.waitForSeconds(2);
    await timerPage.assertTimerRunning();
  });

  test('QE-2183 TS-001 TC-008: Timer works in multiple browsers', async ({ page }) => {
    const timerPage = new TimerPage(page);
    await timerPage.navigate(timerAppUrl);
    await timerPage.start();
    await timerPage.assertTimerRunning();
    await timerPage.stop();
    await timerPage.assertTimerValue('00:00:00');
  });
});
