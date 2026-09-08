angular.module('transactionAnalyticsModule').service('AnalyticsService', ['CategorizationFactory', function(CategorizationFactory) {
  this.aggregateByCategory = function(transactions) {
    try {
      const categoryMap = {};
      let totalSpending = 0;
      transactions.forEach(function(txn) {
        const category = CategorizationFactory.getCategory(txn);
        if (!categoryMap[category]) {
          categoryMap[category] = { categoryName: category, totalAmount: 0, transactionCount: 0, percentage: 0 };
        }
        categoryMap[category].totalAmount += txn.amount;
        categoryMap[category].transactionCount++;
        totalSpending += txn.amount;
      });
      const categoryBreakdown = Object.values(categoryMap);
      categoryBreakdown.forEach(function(cat) {
        cat.percentage = totalSpending > 0 ? (cat.totalAmount / totalSpending * 100).toFixed(2) : 0;
      });
      const topCategory = categoryBreakdown.reduce(function(max, cat) {
        return cat.totalAmount > max.totalAmount ? cat : max;
      }, { totalAmount: 0, categoryName: '' }).categoryName;
      return {
        totalSpending: totalSpending,
        categoryBreakdown: categoryBreakdown,
        dateRange: this.getDateRange(transactions),
        topCategory: topCategory
      };
    } catch (error) {
      console.error('Error aggregating transactions:', error);
      return { totalSpending: 0, categoryBreakdown: [], dateRange: {}, topCategory: '' };
    }
  };
  this.getDateRange = function(transactions) {
    if (!transactions || transactions.length === 0) return { startDate: null, endDate: null };
    const dates = transactions.map(function(t) { return new Date(t.transactionDate); });
    return {
      startDate: new Date(Math.min.apply(null, dates)),
      endDate: new Date(Math.max.apply(null, dates))
    };
  };
}]);