(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CategoryService', ['$http', '$q', function($http, $q) {
      var self = this;
      var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      self.getCategoryList = function() {
        return $q.resolve(categories);
      };
      self.classifyTransaction = function(merchant, description) {
        var keywords = {
          'Food & Dining': ['restaurant', 'cafe', 'food', 'dining'],
          'Fuel': ['gas', 'fuel', 'petrol', 'diesel'],
          'Shopping': ['store', 'shop', 'mall', 'retail'],
          'Travel': ['airline', 'hotel', 'travel', 'uber', 'taxi'],
          'Entertainment': ['movie', 'cinema', 'theater', 'entertainment'],
          'Utilities': ['electric', 'water', 'internet', 'utility'],
          'Healthcare': ['hospital', 'pharmacy', 'medical', 'health'],
          'Education': ['school', 'university', 'education', 'course']
        };
        var text = (merchant + ' ' + description).toLowerCase();
        for (var category in keywords) {
          for (var i = 0; i < keywords[category].length; i++) {
            if (text.indexOf(keywords[category][i]) !== -1) {
              return category;
            }
          }
        }
        return 'Miscellaneous';
      };
    }]);
})();