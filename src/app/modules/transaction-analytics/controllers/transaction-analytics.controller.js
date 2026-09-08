(function() {
  'use strict';
  angular.module('transactionAnalyticsModule')
    .controller('TransactionAnalyticsController', ['$scope', 'TransactionService', 'AnalyticsService', function($scope, TransactionService, AnalyticsService) {
      const vm = this;
      vm.transactions = [];
      vm.filteredTransactions = [];
      vm.analyticsData = null;
      vm.selectedCategory = null;
      vm.dateRange = { startDate: null, endDate: null };
      vm.loading = true;
      vm.error = null;
      vm.init = function() {
        TransactionService.getTransactions()
          .then(function(data) {
            vm.transactions = data;
            vm.filteredTransactions = vm.transactions;
            vm.updateAnalytics();
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load transactions. Please try again.';
            vm.loading = false;
            console.error('Error loading transactions:', error);
          });
      };
      vm.updateAnalytics = function() {
        vm.analyticsData = AnalyticsService.aggregateByCategory(vm.filteredTransactions);
        $scope.$broadcast('analyticsUpdated', vm.analyticsData);
      };
      vm.updateFilter = function(category) {
        vm.selectedCategory = category;
        vm.applyFilters();
      };
      vm.updateDateRange = function(startDate, endDate) {
        vm.dateRange.startDate = startDate;
        vm.dateRange.endDate = endDate;
        vm.applyFilters();
      };
      vm.applyFilters = function() {
        vm.filteredTransactions = vm.transactions.filter(function(txn) {
          let match = true;
          if (vm.selectedCategory && txn.category !== vm.selectedCategory) {
            match = false;
          }
          if (vm.dateRange.startDate && new Date(txn.transactionDate) < new Date(vm.dateRange.startDate)) {
            match = false;
          }
          if (vm.dateRange.endDate && new Date(txn.transactionDate) > new Date(vm.dateRange.endDate)) {
            match = false;
          }
          return match;
        });
        vm.updateAnalytics();
      };
      vm.clearFilters = function() {
        vm.selectedCategory = null;
        vm.dateRange = { startDate: null, endDate: null };
        vm.filteredTransactions = vm.transactions;
        vm.updateAnalytics();
      };
      vm.init();
    }]);
})();