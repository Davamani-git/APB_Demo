angular.module('transactionAnalyticsModule').service('AnalyticsService', ['CategorizationFactory', function(CategorizationFactory) {
  this.aggregateByCategory = function(transactions) {
    if (!transactions || !Array.isArray(transactions)) {
      return { totalSpending: 0, categoryBreakdown: [], dateRange: null, topCategory: null };
    }
    const categoryMap = {};
    let totalSpending = 0;
    let minDate = null;
    let maxDate = null;
    transactions.forEach(function(txn) {
      const category = CategorizationFactory.getCategory(txn);
      const amount = parseFloat(txn.amount) || 0;
      totalSpending += amount;
      if (!categoryMap[category]) {
        categoryMap[category] = { categoryName: category, totalAmount: 0, transactionCount: 0, percentage: 0 };
      }
      categoryMap[category].totalAmount += amount;
      categoryMap[category].transactionCount++;
      const txnDate = new Date(txn.transactionDate);
      if (!minDate || txnDate < minDate) minDate = txnDate;
      if (!maxDate || txnDate > maxDate) maxDate = txnDate;
    });
    const categoryBreakdown = Object.values(categoryMap);
    categoryBreakdown.forEach(function(cat) {
      cat.percentage = totalSpending > 0 ? (cat.totalAmount / totalSpending * 100).toFixed(2) : 0;
    });
    categoryBreakdown.sort(function(a, b) { return b.totalAmount - a.totalAmount; });
    const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0].categoryName : null;
    return {
      totalSpending: totalSpending,
      categoryBreakdown: categoryBreakdown,
      dateRange: { startDate: minDate, endDate: maxDate },
      topCategory: topCategory
    };
  };
}]);