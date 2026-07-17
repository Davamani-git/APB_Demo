(function () {
  'use strict';

  angular
    .module('apb.layout')
    .controller('ShellController', ShellController);

  ShellController.$inject = ['APP_CONFIG'];

  function ShellController(APP_CONFIG) {
    var vm = this;
    vm.appName = APP_CONFIG.appName;
  }
})();
