(function () {
  'use strict';

  MonthlySummaryController.$inject = [
    'SpendingApiService',
    'SpendingMockService',
    'EnvConfigService',
    'LoggingService',
    '$q',
    '$timeout'
  ];

  angular
    .module('app')
    .controller('MonthlySummaryController', MonthlySummaryController);

  function MonthlySummaryController(
    SpendingApiService,
    SpendingMockService,
    EnvConfigService,
    LoggingService,
    $q,
    $timeout
  ) {
    var vm = this;

    vm.selectedMonth = null;
    vm.availableMonths = [];
    vm.isLoading = false;
    vm.error = null;
    vm.summary = null;
    vm.kpiCards = [];
    vm.breakdownRows = [];
    vm.deeperInsightsAvailable = true; // can be controlled by feature flags if needed

    vm.initialize = initialize;
    vm.onMonthChange = onMonthChange;
    vm.reloadSummary = reloadSummary;
    vm.retry = retry;

    initialize();

    function initialize() {
      var config = EnvConfigService.getConfig();
      buildAvailableMonths(config.maxLookbackMonths || 12);

      if (!vm.selectedMonth && vm.availableMonths.length > 0) {
        vm.selectedMonth = vm.availableMonths[0];
      }

      LoggingService.audit('VIEW_MONTHLY_SUMMARY', {
        month: vm.selectedMonth
      });

      reloadSummary();
    }

    function buildAvailableMonths(maxLookbackMonths) {
      var now = new Date();
      var months = [];
      for (var i = 0; i < maxLookbackMonths; i++) {
        var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        var year = d.getFullYear();
        var month = ('0' + (d.getMonth() + 1)).slice(-2);
        months.push(year + '-' + month);
      }
      vm.availableMonths = months;
    }

    function onMonthChange(selectedMonth) {
      if (vm.availableMonths.indexOf(selectedMonth) === -1) {
        vm.error = {
          code: 'INVALID_MONTH',
          message: 'Please select a valid month within the supported range.',
          httpStatus: 0,
          type: 'validation',
          retryable: false,
          correlationId: ''
        };
        return;
      }

      vm.selectedMonth = selectedMonth;
      LoggingService.audit('CHANGE_MONTH_SELECTION', {
        month: vm.selectedMonth
      });
      reloadSummary();
    }

    function reloadSummary() {
      if (!vm.selectedMonth) {
        return;
      }

      vm.isLoading = true;
      vm.error = null;

      var loadPromise = _loadSummary(vm.selectedMonth);

      loadPromise
        .then(function (summaryModel) {
          _handleSuccess(summaryModel);
        })
        .catch(function (errorModel) {
          _handleError(errorModel);
        });
    }

    function retry() {
      if (!vm.selectedMonth) {
        return;
      }
      LoggingService.audit('RETRY_LOAD_SUMMARY', {
        month: vm.selectedMonth,
        previousError: vm.error
      });
      reloadSummary();
    }

    function _loadSummary(month) {
      var deferred = $q.defer();
      var config = EnvConfigService.getConfig();
      var cardId = 'CARD-12345'; // card context; in real app this comes from authenticated profile

      var promise;
      if (EnvConfigService.isMockMode()) {
        promise = SpendingMockService.getMonthlySummary(cardId, month);
      } else {
        promise = SpendingApiService.getMonthlySummary(cardId, month);
      }

      promise
        .then(function (summaryModel) {
          deferred.resolve(summaryModel);
        })
        .catch(function (errorModel) {
          deferred.reject(errorModel);
        });

      return deferred.promise;
    }

    function _handleSuccess(summaryModel) {
      vm.summary = summaryModel;
      vm.isLoading = false;
      vm.error = null;
      _buildViewModels(summaryModel);
    }

    function _handleError(errorModel) {
      vm.summary = null;
      vm.isLoading = false;
      vm.error = errorModel;
    }

    function _buildViewModels(summaryModel) {
      vm.kpiCards = [];

      var metrics = summaryModel.metrics || {};

      vm.kpiCards.push({
        cssClass: 'kpi-card-total',
        title: 'Total Spend',
        iconCssClass: 'kpi-icon-total',
        value: formatCurrency(metrics.totalSpend, summaryModel.currency),
        subtitle: 'Posted credit card transactions for ' + summaryModel.month
      });

      vm.kpiCards.push({
        cssClass: 'kpi-card-count',
        title: 'Transactions',
        iconCssClass: 'kpi-icon-count',
        value: metrics.transactionCount,
        subtitle: 'Number of credit card transactions'
      });

      vm.kpiCards.push({
        cssClass: 'kpi-card-average',
        title: 'Average Transaction',
        iconCssClass: 'kpi-icon-average',
        value: formatCurrency(metrics.averageTransactionAmount, summaryModel.currency),
        subtitle: 'Average credit card transaction amount'
      });

      vm.breakdownRows = [];
      var breakdown = summaryModel.breakdown || {};
      var totalSpend = metrics.totalSpend || 0;

      Object.keys(breakdown).forEach(function (category) {
        var amount = breakdown[category] || 0;
        var percentage = totalSpend > 0 ? (amount / totalSpend) * 100 : 0;
        vm.breakdownRows.push({
          category: category,
          amount: amount,
          percentage: percentage
        });
      });
    }

    function formatCurrency(amount, currency) {
      var value = typeof amount === 'number' ? amount : 0;
      var symbol = currency === 'USD' ? '$' : currency + ' ';
      return symbol + value.toFixed(2);
    }
  }
})();
