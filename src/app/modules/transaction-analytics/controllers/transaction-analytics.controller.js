angular.module('transactionAnalyticsModule').controller('TransactionAnalyticsController', ['$scope', 'TransactionService', 'AnalyticsService', 'CategorizationFactory', function($scope, TransactionService, AnalyticsService, CategorizationFactory) {
  const vm = this;
  vm.transactions = [];
  vm.filteredTransactions = [];
  vm.analyticsData = null;
  vm.selectedCategory = null;
  vm.categories = CategorizationFactory.getAllCategories();
  vm.dateRange = { startDate: null, endDate: null };
  vm.loading = false;
  vm.error = null;
  vm.init = function() {
    vm.loading = true;
    vm.error = null;
    TransactionService.getTransactions().then(function(data) {
      vm.transactions = data;
      vm.filteredTransactions = vm.transactions;
      vm.updateAnalytics();
      vm.loading = false;
    }).catch(function(error) {
      vm.error = 'Failed to load transactions. Please try again.';
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
    vm.filteredTransactions = vm.transactions.filter(function(txn) {
      let match = true;
      if (vm.selectedCategory) {
        match = match && CategorizationFactory.getCategory(txn) === vm.selectedCategory;
      }
      if (vm.dateRange.startDate) {
        match = match && new Date(txn.transactionDate) >= new Date(vm.dateRange.startDate);
      }
      if (vm.dateRange.endDate) {
        match = match && new Date(txn.transactionDate) <= new Date(vm.dateRange.endDate);
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