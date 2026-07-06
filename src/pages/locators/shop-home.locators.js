const locators = {
  homeBanner: (page) => page.locator('[data-testid="home-banner"]'),
  catalogNavBtn: (page) => page.locator('[data-testid="catalog-nav-btn"]'),
  loginBtn: (page) => page.locator('[data-testid="login-btn"]'),
  usernameInput: (page) => page.locator('[data-testid="username-input"]'),
  passwordInput: (page) => page.locator('[data-testid="password-input"]'),
  submitLogin: (page) => page.locator('[data-testid="submit-login"]'),
  dashboardBanner: (page) => page.locator('[data-testid="dashboard-banner"]'),
};
module.exports = locators;
