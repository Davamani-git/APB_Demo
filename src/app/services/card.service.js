(function() {
  'use strict';
  angular.module('creditDashboardApp').service('CardService', ['$http', '$q', 'ApiConfigFactory', function($http, $q, ApiConfigFactory) {
    var mockCards = [
      {id: 'C001', maskedNumber: '**** 1234', issuer: 'Visa', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, dueDate: '2025-03-15', status: 'ACTIVE'},
      {id: 'C002', maskedNumber: '**** 5678', issuer: 'MasterCard', creditLimit: 75000, availableCredit: 60000, outstandingAmount: 15000, dueDate: '2025-03-20', status: 'ACTIVE'},
      {id: 'C003', maskedNumber: '**** 9012', issuer: 'Amex', creditLimit: 100000, availableCredit: 85000, outstandingAmount: 15000, dueDate: '2025-03-10', status: 'ACTIVE'}
    ];
    this.getCards = function(userId) {
      var deferred = $q.defer();
      setTimeout(function() {
        deferred.resolve(angular.copy(mockCards));
      }, 200);
      return deferred.promise;
    };
    this.getCardById = function(cardId) {
      var deferred = $q.defer();
      var card = mockCards.find(function(c) { return c.id === cardId; });
      setTimeout(function() {
        if (card) {
          deferred.resolve(angular.copy(card));
        } else {
          deferred.reject('Card not found');
        }
      }, 200);
      return deferred.promise;
    };
  }]);
  angular.module('creditDashboardApp').service('CardService').$inject = ['$http', '$q', 'ApiConfigFactory'];
})();