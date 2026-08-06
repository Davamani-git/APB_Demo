(function() {
  'use strict';
  angular.module('executiveDashboardApp').controller('MainController', ['$scope', function($scope) {
    var vm = this;
    vm.activeTab = 'dashboard';
    vm.setTab = function(tab) {
      vm.activeTab = tab;
    };
  }]);
})();