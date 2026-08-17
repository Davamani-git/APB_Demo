(function() {
  'use strict';
  angular.module('creditCardDashboardModule')
    .factory('AggregationService', ['CreditCardDataService', function(CreditCardDataService) {
      return {
        aggregateCardData: function() {
          return CreditCardDataService.fetchAllCards();
        }
      };
    }]);
})();