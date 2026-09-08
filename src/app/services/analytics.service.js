(function() {
  'use strict';
  angular.module('transactionAnalyticsModule')
    .service('AnalyticsService', ['CategorizationFactory', function(CategorizationFactory) {
      var service = this;
      service.aggregateByCategory = function(transactions) {
        var categoryMap = {};
        var totalSpending = 0;
        transactions.forEach(function(txn) {
          var category = CategorizationFactory.getCategory(txn);
          if (!categoryMap[category]) {
            categoryMap[category] = {
              categoryName: category,
              totalAmount: 0,
              transactionCount: 0,
              percentage: 0
            };
          }
          categoryMap[category].totalAmount += txn.amount;
          categoryMap[category].transactionCount += 1;
          totalSpending += txn.amount;
        });
        var categoryBreakdown = Object.keys(categoryMap).map(function(key) {
          var cat = categoryMap[key];
          cat.percentage = totalSpending > 0 ? (cat.totalAmount / totalSpending * 100).toFixed(2) : 0;
          return cat;
        });
        categoryBreakdown.sort(function(a, b) { return b.totalAmount - a.totalAmount; });
        var topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0].categoryName : 'N/A';
        var dateRange = service.getDateRange(transactions);
        return {
          totalSpending: totalSpending,
          categoryBreakdown: categoryBreakdown,
          dateRange: dateRange,
          topCategory: topCategory
        };
      };
      service.getDateRange = function(transactions) {
        if (transactions.length === 0) {
          return { startDate: null, endDate: null };
        }
        var dates = transactions.map(function(txn) { return new Date(txn.transactionDate); });
        return {
          startDate: new Date(Math.min.apply(null, dates)),
          endDate: new Date(Math.max.apply(null, dates))
        };
      };
    }]);
})();