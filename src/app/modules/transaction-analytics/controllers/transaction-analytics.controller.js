angular.module('transactionAnalyticsModule').controller('TransactionAnalyticsController', ['$scope', 'TransactionService', 'AnalyticsService', function($scope, TransactionService, AnalyticsService) {
  const vm = this;
  vm.transactions = [];
  vm.filteredTransactions = [];
  vm.analyticsData = {};
  vm.selectedCategory = null;
  vm.loading = true;
  vm.error = null;
  vm.init = function() {
    TransactionService.getTransactions().then(function(data) {
      vm.transactions = data;
      vm.filteredTransactions = data;
      vm.updateAnalytics();
      vm.loading = false;
    }).catch(function(error) {
      vm.error = 'Failed to load transactions';
      vm.loading = false;
    });
  };
  vm.updateAnalytics = function() {
    vm.analyticsData = AnalyticsService.aggregateByCategory(vm.filteredTransactions);
    $scope.$broadcast('analyticsUpdated', vm.analyticsData);
  };
  vm.updateFilter = function(category) {
    vm.selectedCategory = category;
    if (category) {
      vm.filteredTransactions = vm.transactions.filter(function(txn) {
        return txn.category === category;
      });
    } else {
      vm.filteredTransactions = vm.transactions;
    }
    vm.updateAnalytics();
  };
  vm.init();
}]);