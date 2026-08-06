(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('SpendingAnalyticsService', ['TransactionDataFactory', '$q', function(TransactionDataFactory, $q) {
      var cachedAnalytics = null;
      this.getSpendingData = function(dateRange) {
        return TransactionDataFactory.fetchAllTransactions(dateRange)
          .then(function(transactions) {
            var analytics = {
              categories: [],
              monthlyTrends: [],
              cardWiseAnalysis: [],
              dateRange: dateRange
            };
            var categoryMap = {};
            var monthMap = {};
            var cardMap = {};
            var totalAmount = 0;
            transactions.forEach(function(txn) {
              var amount = txn.amount || 0;
              totalAmount += amount;
              if (!categoryMap[txn.category]) {
                categoryMap[txn.category] = { totalAmount: 0, transactionCount: 0 };
              }
              categoryMap[txn.category].totalAmount += amount;
              categoryMap[txn.category].transactionCount++;
              var monthKey = new Date(txn.date).toISOString().substring(0, 7);
              if (!monthMap[monthKey]) {
                monthMap[monthKey] = {};
              }
              if (!monthMap[monthKey][txn.category]) {
                monthMap[monthKey][txn.category] = 0;
              }
              monthMap[monthKey][txn.category] += amount;
              if (!cardMap[txn.cardId]) {
                cardMap[txn.cardId] = 0;
              }
              cardMap[txn.cardId] += amount;
            });
            Object.keys(categoryMap).forEach(function(cat) {
              analytics.categories.push({
                categoryName: cat,
                totalAmount: categoryMap[cat].totalAmount,
                transactionCount: categoryMap[cat].transactionCount,
                percentage: totalAmount > 0 ? (categoryMap[cat].totalAmount / totalAmount * 100).toFixed(2) : 0
              });
            });
            Object.keys(monthMap).forEach(function(month) {
              analytics.monthlyTrends.push({
                month: month,
                categoryBreakdown: monthMap[month]
              });
            });
            Object.keys(cardMap).forEach(function(cardId) {
              analytics.cardWiseAnalysis.push({
                cardId: cardId,
                totalSpend: cardMap[cardId]
              });
            });
            cachedAnalytics = analytics;
            return analytics;
          });
      };
      this.getCachedAnalytics = function() {
        return cachedAnalytics;
      };
    }]);
})();