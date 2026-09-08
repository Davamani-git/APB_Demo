angular.module('transactionAnalyticsModule').factory('CategorizationFactory', [function() {
  const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
  return {
    getCategory: function(transaction) {
      if (transaction && transaction.category && categories.indexOf(transaction.category) !== -1) {
        return transaction.category;
      }
      return 'Miscellaneous';
    },
    getAllCategories: function() {
      return categories;
    }
  };
}]);