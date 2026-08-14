(function() {
  'use strict';
  angular.module('creditCardDashboard')
    .service('CreditCardService', ['$http', '$q', function($http, $q) {
      var service = this;
      service.getDashboardData = function() {
        var deferred = $q.defer();
        $http.get('/api/creditcards/dashboard')
          .then(function(response) {
            var cards = response.data;
            var dashboardKPI = {
              totalCreditLimit: 0,
              totalAvailableCredit: 0,
              totalOutstanding: 0,
              totalMonthlySpend: 0,
              creditUtilizationPercent: 0,
              cards: cards
            };
            angular.forEach(cards, function(card) {
              dashboardKPI.totalCreditLimit += card.creditLimit || 0;
              dashboardKPI.totalAvailableCredit += card.availableCredit || 0;
              dashboardKPI.totalOutstanding += card.outstandingAmount || 0;
              dashboardKPI.totalMonthlySpend += card.monthlySpend || 0;
            });
            if (dashboardKPI.totalCreditLimit > 0) {
              dashboardKPI.creditUtilizationPercent = ((dashboardKPI.totalCreditLimit - dashboardKPI.totalAvailableCredit) / dashboardKPI.totalCreditLimit * 100).toFixed(2);
            }
            deferred.resolve(dashboardKPI);
          })
          .catch(function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
    }]);
})();