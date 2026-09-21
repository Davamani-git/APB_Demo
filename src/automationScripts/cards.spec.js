const { test, expect } = require('@playwright/test');
const { CardsPage } = require('./pages/cards.page');
const { CardDetailPage } = require('./pages/cardDetail.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Multi-Card Management - View List of All Cards', () => {
  test('QE-6094 TS-001 TC-001 - Verify user with multiple credit cards can view complete list with card metadata in card management section', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardsPage = new CardsPage(page);

    await loginPage.navigate();
    await loginPage.login('multicard_user', 'Pass@123');
    await cardsPage.navigateToCardsSection();
    await cardsPage.verifyCardListLoaded();
    await cardsPage.verifyCardCount(3);
    await cardsPage.verifyCardName(0, 'Platinum Rewards');
    await cardsPage.verifyCardName(1, 'Travel Elite');
    await cardsPage.verifyCardName(2, 'Cashback Plus');
    await cardsPage.verifyCardNumber(0, '4521');
    await cardsPage.verifyCardNumber(1, '8832');
    await cardsPage.verifyCardNumber(2, '1234');
  });

  test('QE-6094 TS-002 TC-001 - Verify user with single credit card can view that card with metadata correctly displayed in card management section', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardsPage = new CardsPage(page);

    await loginPage.navigate();
    await loginPage.login('singlecard_user', 'Pass@123');
    await cardsPage.navigateToCardsSection();
    await cardsPage.verifyCardListLoaded();
    await cardsPage.verifyCardCount(1);
    await cardsPage.verifyCardName(0, 'Platinum Rewards');
    await cardsPage.verifyCardNumber(0, '4521');
  });

  test('QE-6094 TS-003 TC-001 - Verify appropriate message is displayed when user has no associated credit cards in card management section', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardsPage = new CardsPage(page);

    await loginPage.navigate();
    await loginPage.login('nocard_user', 'Pass@123');
    await cardsPage.navigateToCardsSection();
    await cardsPage.verifyCardListLoaded();
    await cardsPage.verifyNoCardsMessage();
    await cardsPage.verifyCardCount(0);
  });
});

test.describe('Multi-Card Management - Card-Specific KPI Visibility', () => {
  test('QE-6095 TS-001 TC-001 - Verify card-specific KPIs display correctly when user selects a specific card', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardsPage = new CardsPage(page);
    const cardDetailPage = new CardDetailPage(page);

    await loginPage.navigate();
    await loginPage.login('multicard_user', 'Pass@123');
    await cardsPage.navigateToCardsSection();
    await cardsPage.verifyCardListLoaded();
    await cardsPage.selectCard(0);
    await cardDetailPage.verifyCardDetailPageLoaded();
    await cardDetailPage.verifyCreditLimitKPI('50,000');
    await cardDetailPage.verifyAvailableCreditKPI('35,000');
    await cardDetailPage.verifyOutstandingBalanceKPI('15,000');
    await cardDetailPage.verifyAllKPIsReadable();
  });

  test('QE-6095 TS-002 TC-001 - Verify card-specific KPIs display correctly with outstanding balance showing zero when user selects a card with zero outstanding balance', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardsPage = new CardsPage(page);
    const cardDetailPage = new CardDetailPage(page);

    await loginPage.navigate();
    await loginPage.login('zerobalance_user', 'Pass@123');
    await cardsPage.navigateToCardsSection();
    await cardsPage.verifyCardListLoaded();
    await cardsPage.selectCardByName('Cashback Plus');
    await cardDetailPage.verifyCardDetailPageLoaded();
    await cardDetailPage.verifyCreditLimitKPI('20,000');
    await cardDetailPage.verifyAvailableCreditKPI('20,000');
    await cardDetailPage.verifyOutstandingBalanceKPI('0');
  });

  test('QE-6095 TS-003 TC-001 - Verify error message is displayed when user attempts to access a deactivated or removed card', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardsPage = new CardsPage(page);
    const cardDetailPage = new CardDetailPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await cardDetailPage.navigateToDeactivatedCard();
    await cardDetailPage.verifyErrorMessage();
    await cardDetailPage.verifyRedirectToValidPage();
  });
});