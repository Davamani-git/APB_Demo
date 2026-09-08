(function() {
  'use strict';
  angular.module('transactionAnalyticsModule')
    .factory('CategorizationFactory', [function() {
      const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      return {
        mapCategory: function(transaction) {
          if (transaction.category && categories.indexOf(transaction.category) !== -1) {
            return transaction.category;
          }
          return 'Miscellaneous';
        },
        getCategories: function() {
          return categories;
        }
      };
    }]);
})();