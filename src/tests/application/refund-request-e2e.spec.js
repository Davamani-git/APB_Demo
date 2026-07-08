const { test, expect } = require('../../fixtures');
const ConsumerPage = require('../../pages/consumer.page');
const SellerPage = require('../../pages/seller.page');
const TD = require('../../data/workday-test-data');

test.describe('[UI] Refund Requests', () => {
  test('[QE-1872 TS-001 TC-001] Refund request submitted and processed', async ({ page }) => {
    const consumer = new ConsumerPage(page);
    const seller = new SellerPage(page);
    await consumer.login(TD.users.consumer);
    await consumer.submitRefundRequest(TD.orders.recentOrderId);
    await expect(await consumer.isRefundRequestSubmitted(TD.orders.recentOrderId)).toBeTruthy();
    await seller.login(TD.sellerCredentials);
    await seller.gotoRefundRequests();
    await expect(await seller.canApproveRefund(TD.orders.recentOrderId)).toBeTruthy();
    await seller.approveRefund(TD.orders.recentOrderId);
    await expect(await seller.isRefundProcessed(TD.orders.recentOrderId)).toBeTruthy();
  });
});
