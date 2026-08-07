(function() {
  'use strict';
  angular.module('app.creditCardDashboard')
    .factory('CreditCardService', ['$http', '$q', 'API_ENDPOINTS', function($http, $q, API_ENDPOINTS) {
      var mockData = [
        {
          cardId: 'CC001',
          cardNumber: '**** **** **** 1234',
          cardType: 'Visa Platinum',
          totalCreditLimit: 50000,
          currentBalance: 15000,
          availableCredit: 35000,
          monthlySpend: 12000,
          outstandingAmount: 15000
        },
        {
          cardId: 'CC002',
          cardNumber: '**** **** **** 5678',
          cardType: 'Mastercard Gold',
          totalCreditLimit: 30000,
          currentBalance: 8000,
          availableCredit: 22000,
          monthlySpend: 6500,
          outstandingAmount: 8000
        },
        {
          cardId: 'CC003',
          cardNumber: '**** **** **** 9012',
          cardType: 'Amex Premium',
          totalCreditLimit: 75000,
          currentBalance: 25000,
          availableCredit: 50000,
          monthlySpend: 18000,
          outstandingAmount: 25000
        }
      ];
      return {
        getCreditCards: function() {
          var deferred = $q.defer();
          setTimeout(function() {
            deferred.resolve(mockData);
          }, 300);
          return deferred.promise;
        }
      };
    }]);
})();