const { test, expect } = require('../../fixtures');
const DashboardPage = require('../../pages/dashboard.page');
const TD = require('../../data/workday-test-data');

test.describe('@regression QE-3755 TS-001 TC-001 - Dashboard Cards Overview', () => {
  test('should display card overview with correct credit details for multiple cards', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.loginAsCustomer(TD.customers.multipleActiveCards);
    await dashboard.goto();
    await dashboard.waitForCardOverview();
    expect(await dashboard.isCardOverviewVisible()).toBeTruthy();

    for (const card of TD.customers.multipleActiveCards.cards) {
      const cardInfo = await dashboard.getCardDetails(card.cardId);
      expect(cardInfo).toMatchObject({
        creditLimit: card.limit,
        outstanding: card.outstanding,
        available: card.limit - card.outstanding
      });
    }
  });
});
