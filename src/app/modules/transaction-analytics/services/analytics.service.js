(function() {
  'use strict';
  angular.module('transactionAnalyticsModule')
    .service('AnalyticsService', ['CategorizationFactory', function(CategorizationFactory) {
      this.aggregateByCategory = function(transactions) {
        try {
          const categoryMap = {};
          let totalSpending = 0;
          transactions.forEach(function(txn) {
            const category = CategorizationFactory.mapCategory(txn);
            if (!categoryMap[category]) {
              categoryMap[category] = { categoryName: category, totalAmount: 0, transactionCount: 0, percentage: 0 };
            }
            categoryMap[category].totalAmount += txn.amount;
            categoryMap[category].transactionCount += 1;
            totalSpending += txn.amount;
          });
          const categoryBreakdown = Object.values(categoryMap);
          categoryBreakdown.forEach(function(cat) {
            cat.percentage = totalSpending > 0 ? (cat.totalAmount / totalSpending * 100).toFixed(2) : 0;
          });
          categoryBreakdown.sort(function(a, b) { return b.totalAmount - a.totalAmount; });
          const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0].categoryName : 'N/A';
          return {
            totalSpending: totalSpending,
            categoryBreakdown: categoryBreakdown,
            dateRange: { startDate: null, endDate: null },
            topCategory: topCategory
          };
        } catch (error) {
          console.error('Error aggregating transactions:', error);
          return { totalSpending: 0, categoryBreakdown: [], dateRange: { startDate: null, endDate: null }, topCategory: 'N/A' };
        }
      };
    }]);
})();