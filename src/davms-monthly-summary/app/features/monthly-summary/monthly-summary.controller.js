(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .controller('MonthlySummaryController', MonthlySummaryController);

  MonthlySummaryController.$inject = ['$scope', 'MonthlySummaryService', 'MonthSelectionService', 'APP_CONSTANTS'];

  function MonthlySummaryController($scope, MonthlySummaryService, MonthSelectionService, APP_CONSTANTS) {
    var vm = this;

    vm.accounts = [
      { id: 'CC-****1234', displayName: 'Credit Card ****1234' }
    ];

    vm.availableMonths = [];
    vm.selectedAccountId = vm.accounts[0].id;
    vm.selectedMonth = null;
    vm.summary = null;
    vm.kpiSummary = null;
    vm.breakdownEntries = [];
    vm.isLoading = false;
    vm.error = null;
    vm.hasData = false;
    vm.isEmpty = false;

    vm.onAccountChange = onAccountChange;
    vm.onMonthChange = onMonthChange;
    vm.retry = retry;

    activate();

    function activate() {
      loadAvailableMonths(vm.selectedAccountId);
    }

    function loadAvailableMonths(accountId) {
      vm.isLoading = true;
      vm.error = null;

      MonthlySummaryService.getAvailableMonths(accountId)
        .then(function(months) {
          vm.availableMonths = months;
          if (months && months.length) {
            vm.selectedMonth = months[0].value;
            return loadMonthlySummary(accountId, vm.selectedMonth);
          } else {
            vm.isLoading = false;
            vm.hasData = false;
            vm.isEmpty = true;
          }
        })
        .catch(function(error) {
          vm.isLoading = false;
          vm.error = error;
        });
    }

    function loadMonthlySummary(accountId, month) {
      vm.isLoading = true;
      vm.error = null;

      MonthlySummaryService.getMonthlySummary(accountId, month)
        .then(function(summary) {
          vm.summary = summary;
          vm.breakdownEntries = summary.breakdownEntries;
          vm.kpiSummary = {
            totalSpend: summary.totalSpend,
            transactionCount: summary.transactionCount,
            averageTransactionValue: summary.averageTransactionValue,
            topCategoryLabel: summary.topCategoryLabel,
            topCategoryAmount: summary.topCategoryAmount
          };
          vm.isEmpty = summary.isEmpty();
          vm.hasData = !vm.isEmpty;
          vm.isLoading = false;
        })
        .catch(function(error) {
          vm.error = error;
          vm.isLoading = false;
          vm.hasData = false;
        });
    }

    function onAccountChange() {
      loadAvailableMonths(vm.selectedAccountId);
    }

    function onMonthChange() {
      if (vm.selectedMonth) {
        loadMonthlySummary(vm.selectedAccountId, vm.selectedMonth);
      }
    }

    function retry() {
      if (vm.selectedAccountId && vm.selectedMonth) {
        loadMonthlySummary(vm.selectedAccountId, vm.selectedMonth);
      } else if (vm.selectedAccountId) {
        loadAvailableMonths(vm.selectedAccountId);
      }
    }
  }
})();
