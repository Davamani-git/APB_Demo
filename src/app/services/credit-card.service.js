(function() {
  'use strict';
  angular.module('creditCardDashboard').service('CreditCardService', ['$http', '$q', function($http, $q) {
    var service = this;
    var apiBaseUrl = '/api/creditcards';

    service.getAllCards = function() {
      return $http.get(apiBaseUrl).then(function(response) {
        return response.data.map(function(card) {
          card.availableCredit = card.totalCreditLimit - card.outstandingAmount;
          return card;
        });
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
  }]);
})();