(function () {
  'use strict';

  angular
    .module('apb.layout')
    .controller('ShellController', ShellController);

  ShellController.$inject = ['LoggerService'];

  function ShellController(LoggerService) {
    var vm = this;
    vm.title = 'Monthly Spend Dashboard';

    LoggerService.info('ShellController initialized');
  }
})();
