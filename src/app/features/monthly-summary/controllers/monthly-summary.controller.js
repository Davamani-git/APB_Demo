(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .controller('MonthlySummaryController', MonthlySummaryController);

  MonthlySummaryController.$inject = ['SummaryDomainService', 'EnvConfigService', 'LoggingService'];

  function MonthlySummaryController(SummaryDomainService, EnvConfigService, LoggingService) {
    var vm = this;

    vm.summary = null;
    vm.availableMonths = [];
    vm.selectedMonth = '';
    vm.isLoading = false;
    vm.error = null;

    vm.init = init;
    vm.onMonthChange = onMonthChange;
    vm.refresh = refresh;

    function init() {
      EnvConfigService.loadEnvConfig().then(function() {
        vm.availableMonths = buildAvailableMonths();
        if (vm.availableMonths.length > 0) {
          vm.selectedMonth = vm.availableMonths[0];
        }
        loadSummary(vm.selectedMonth);
      }).catch(function(error) {
        vm.error = error;
      });
    }

    function buildAvailableMonths() {
      var months = [];
      var now = new Date();
      var maxLookbackMonths = EnvConfigService.getEnvConfig().maxLookbackMonths || 24;
      for (var i = 0; i <= maxLookbackMonths; i++) {
        var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var monthStr = (month < 10 ? '0' : '') + month;
        months.push(year + '-' + monthStr);
      }
      return months;
    }

    function onMonthChange(month) {
      vm.selectedMonth = month;
      loadSummary(month);
    }

    function refresh() {
      loadSummary(vm.selectedMonth);
    }

    function loadSummary(month) {
      vm.isLoading = true;
      vm.error = null;
      vm.summary = null;

      var accountId = 'MOCK-ACCOUNT';

      SummaryDomainService.getMonthlySummary(accountId, month)
        .then(function(summary) {
          vm.summary = summary;
          vm.isLoading = false;
          if (vm.summary.transactionCount === 0) {
            vm.error = {
              message: 'There is no spending activity for the selected month.'
            };
          }
        })
        .catch(function(error) {
          vm.isLoading = false;
          vm.summary = null;
          vm.error = error;
          LoggingService.error('Failed to load monthly summary', error);
        });
    }

    vm.init();
  }
})();
