(function () {
  'use strict';

  SpendSummaryController.$inject = ['SpendSummaryService', 'EnvConfigService'];

  angular.module('app')
    .controller('SpendSummaryController', SpendSummaryController);

  function SpendSummaryController(SpendSummaryService, EnvConfigService) {
    var vm = this;

    vm.month = getDefaultMonth();
    vm.summary = null;
    vm.isLoading = false;
    vm.hasError = false;
    vm.errorMessage = '';
    vm.availableMonths = buildAvailableMonths();

    vm.onMonthChange = function () {
      loadSummary(vm.month);
    };

    vm.retry = function () {
      loadSummary(vm.month);
    };

    activate();

    function activate() {
      loadSummary(vm.month);
    }

    function getDefaultMonth() {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth(); // 0-based
      if (month === 0) {
        year = year - 1;
        month = 12;
      }
      return year + '-' + pad2(month);
    }

    function pad2(value) {
      return value < 10 ? '0' + value : '' + value;
    }

    function buildAvailableMonths() {
      var maxLookback = EnvConfigService.getMaxLookbackMonths();
      var months = [];
      var date = new Date();
      for (var i = 0; i < maxLookback; i++) {
        var year = date.getFullYear();
        var month = date.getMonth();
        if (month === 0) {
          year = year - 1;
          month = 12;
        }
        var label = year + '-' + pad2(month);
        months.push(label);
        date.setMonth(date.getMonth() - 1);
      }
      return months;
    }

    function loadSummary(month) {
      vm.isLoading = true;
      vm.hasError = false;
      vm.errorMessage = '';

      SpendSummaryService.getMonthlySummary(month).then(function (model) {
        vm.summary = model;
      }).catch(function (error) {
        vm.hasError = true;
        vm.errorMessage = (error && error.data && error.data.message) ? error.data.message : 'Unable to load spending summary at this time.';
      }).finally(function () {
        vm.isLoading = false;
      });
    }
  }
})();
