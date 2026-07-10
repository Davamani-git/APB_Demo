const { expect } = require('@playwright/test');

exports.TimerPage = class TimerPage {
  constructor(page) {
    this.page = page;
    this.timerDisplay = page.locator('[data-testid="timer-display"]');
    this.startButton = page.locator('[data-testid="start-button"]');
    this.pauseButton = page.locator('[data-testid="pause-button"]');
    this.stopButton = page.locator('[data-testid="stop-button"]');
    this.controls = page.locator('[data-testid="timer-controls"]');
  }

  async navigate(url) {
    await this.page.goto(url);
    await expect(this.page).toHaveURL(url);
    await expect(this.page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(this.timerDisplay).toBeVisible();
    await expect(this.controls).toBeVisible();
  }

  async assertCentered() {
    const displayBox = await this.timerDisplay.boundingBox();
    const controlsBox = await this.controls.boundingBox();
    const viewport = this.page.viewportSize();
    expect(displayBox).not.toBeNull();
    expect(controlsBox).not.toBeNull();
    // Check vertical/horizontal centering
    expect(Math.abs(displayBox.x + displayBox.width / 2 - viewport.width / 2)).toBeLessThan(10);
    expect(Math.abs(displayBox.y + displayBox.height / 2 - viewport.height / 2)).toBeLessThan(10);
    expect(Math.abs(controlsBox.x + controlsBox.width / 2 - viewport.width / 2)).toBeLessThan(10);
    expect(Math.abs(controlsBox.y + controlsBox.height / 2 - viewport.height / 2)).toBeLessThan(10);
  }

  async assertFontReadable() {
    const fontSize = await this.timerDisplay.evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
    expect(fontSize).toBeGreaterThan(16);
    expect(await this.timerDisplay.textContent()).toMatch(/\d{2}:\d{2}:\d{2}/);
  }

  async assertControlsVisible() {
    await expect(this.startButton).toBeVisible();
    await expect(this.pauseButton).toBeVisible();
    await expect(this.stopButton).toBeVisible();
  }

  async start() {
    await expect(this.startButton).toBeEnabled();
    await this.startButton.click();
  }

  async pause() {
    await expect(this.pauseButton).toBeEnabled();
    await this.pauseButton.click();
  }

  async stop() {
    await expect(this.stopButton).toBeEnabled();
    await this.stopButton.click();
  }

  async assertTimerValue(expected) {
    await expect(this.timerDisplay).toHaveText(expected);
  }

  async assertTimerRunning() {
    const initial = await this.timerDisplay.textContent();
    await this.page.waitForTimeout(1100); // Wait for timer to increment
    const after = await this.timerDisplay.textContent();
    expect(after).not.toBe(initial);
  }

  async assertTimerPaused() {
    const pausedValue = await this.timerDisplay.textContent();
    await this.page.waitForTimeout(1100);
    expect(await this.timerDisplay.textContent()).toBe(pausedValue);
  }

  async assertTimerPausedAt(value) {
    await expect(this.timerDisplay).toHaveText(value);
    await this.page.waitForTimeout(1100);
    await expect(this.timerDisplay).toHaveText(value);
  }

  async assertTimerReset() {
    await expect(this.timerDisplay).toHaveText('00:00:00');
  }

  async waitForSeconds(seconds) {
    await this.page.waitForTimeout(seconds * 1000);
  }

  async assertControlsSize() {
    for (const btn of [this.startButton, this.pauseButton, this.stopButton]) {
      const box = await btn.boundingBox();
      expect(box.width).toBeGreaterThanOrEqual(48);
      expect(box.height).toBeGreaterThanOrEqual(48);
    }
  }
};
