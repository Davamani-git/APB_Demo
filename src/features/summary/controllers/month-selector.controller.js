angular.module('davms.summary').controller('MonthSelectorController', MonthSelectorController);

MonthSelectorController.$inject = ['MonthContextService', 'LoggingService'];
function MonthSelectorController(MonthContextService, LoggingService) {
  const vm = this;

  vm.months = MonthContextService.getAvailableMonths();
  vm.selectedMonthKey = MonthContextService.getSelectedMonth().key;
  vm.onChange = onChange;

  function onChange() {
    LoggingService.info('MONTH_SELECTION_CHANGED', { monthKey: vm.selectedMonthKey });
    if (typeof vm.onMonthChange === 'function') {
      vm.onMonthChange({ monthKey: vm.selectedMonthKey });
    }
  }
}