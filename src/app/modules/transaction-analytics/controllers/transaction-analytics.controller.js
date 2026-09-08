(function() {
  'use strict';
  angular.module('transactionAnalyticsModule')
    .controller('TransactionAnalyticsController', ['$scope', 'TransactionService', 'AnalyticsService', function($scope, TransactionService, AnalyticsService) {
      var vm = this;
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
            vm.filteredTransactions = data;
            vm.updateAnalytics();
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load transactions. Please try again later.';
            vm.loading = false;
          });
      };
      vm.updateAnalytics = function() {
        vm.analyticsData = AnalyticsService.aggregateByCategory(vm.filteredTransactions);
      };
      vm.updateFilter = function(category) {
        vm.selectedCategory = category;
        vm.applyFilters();
      };
      vm.applyFilters = function() {
        vm.filteredTransactions = vm.transactions;
        if (vm.selectedCategory) {
          vm.filteredTransactions = vm.filteredTransactions.filter(function(txn) {
            return txn.category === vm.selectedCategory;
          });
        }
        if (vm.dateRange.startDate && vm.dateRange.endDate) {
          vm.filteredTransactions = vm.filteredTransactions.filter(function(txn) {
            var txnDate = new Date(txn.transactionDate);
            return txnDate >= vm.dateRange.startDate && txnDate <= vm.dateRange.endDate;
          });
        }
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