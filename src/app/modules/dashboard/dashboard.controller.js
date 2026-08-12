(function() {
  'use strict';
  angular.module('creditCardDashboard')
    .controller('DashboardController', ['$scope', '$interval', 'CreditCardService', 'AuthService', function($scope, $interval, CreditCardService, AuthService) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.summary = {
        totalCreditLimit: 0,
        totalAvailableCredit: 0,
        totalOutstanding: 0,
        totalMonthlySpend: 0,
        cards: []
      };
      function loadDashboardData() {
        if (!AuthService.validateSession()) {
          vm.error = 'Session expired. Please login again.';
          vm.loading = false;
          return;
        }
        CreditCardService.getAllCards().then(function(cards) {
          vm.summary.cards = cards;
          vm.summary.totalCreditLimit = cards.reduce(function(sum, card) { return sum + card.creditLimit; }, 0);
          vm.summary.totalAvailableCredit = cards.reduce(function(sum, card) { return sum + card.availableCredit; }, 0);
          vm.summary.totalOutstanding = cards.reduce(function(sum, card) { return sum + card.outstandingAmount; }, 0);
          vm.summary.totalMonthlySpend = cards.reduce(function(sum, card) { return sum + card.monthlySpend; }, 0);
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
          console.error('Dashboard error:', error);
        });
      }
      loadDashboardData();
      var refreshInterval = $interval(function() {
        loadDashboardData();
      }, 30000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
      vm.refresh = function() {
        vm.loading = true;
        loadDashboardData();
      };
    }]);
})();