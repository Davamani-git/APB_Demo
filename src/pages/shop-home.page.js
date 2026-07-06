const loc = require('./locators/shop-home.locators');
const TD = require('../data/workday-test-data');

class HomePage {
  constructor(page) { this.page = page; }
  async goto(url) { await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); }
  async homePageLoaded() { return (await loc.homeBanner(this.page)).isVisible(); }
  async goToCatalog() { await (await loc.catalogNavBtn(this.page)).click(); }
  async login(username, password) {
    await (await loc.loginBtn(this.page)).click();
    await (await loc.usernameInput(this.page)).fill(username);
    await (await loc.passwordInput(this.page)).fill(password);
    await (await loc.submitLogin(this.page)).click();
  }
  async isDashboardLoaded() { return (await loc.dashboardBanner(this.page)).isVisible(); }
}
module.exports = HomePage;
