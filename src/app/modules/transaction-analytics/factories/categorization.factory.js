(function() {
  'use strict';
  angular.module('transactionAnalyticsModule')
    .factory('CategorizationFactory', [function() {
      var categories = {
        'Food & Dining': ['restaurant', 'cafe', 'food', 'dining', 'pizza', 'burger'],
        'Fuel': ['fuel', 'gas', 'petrol', 'diesel', 'station'],
        'Shopping': ['mall', 'store', 'shop', 'retail', 'amazon', 'flipkart'],
        'Travel': ['airline', 'hotel', 'travel', 'uber', 'ola', 'taxi'],
        'Entertainment': ['movie', 'cinema', 'theatre', 'netflix', 'spotify', 'gaming'],
        'Utilities': ['electricity', 'water', 'internet', 'phone', 'utility'],
        'Healthcare': ['hospital', 'pharmacy', 'doctor', 'medical', 'health'],
        'Education': ['school', 'university', 'course', 'education', 'tuition'],
        'Miscellaneous': []
      };
      return {
        getCategory: function(transaction) {
          if (transaction.category) {
            return transaction.category;
          }
          var merchant = (transaction.merchantName || '').toLowerCase();
          var description = (transaction.description || '').toLowerCase();
          for (var cat in categories) {
            if (categories[cat].some(function(keyword) {
              return merchant.includes(keyword) || description.includes(keyword);
            })) {
              return cat;
            }
          }
          return 'Miscellaneous';
        },
        getCategories: function() {
          return Object.keys(categories);
        }
      };
    }]);
})();