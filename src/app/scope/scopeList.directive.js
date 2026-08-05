(function() {
  'use strict';
  angular
    .module('execDashboard.scope')
    .directive('scopeList', scopeList);

  function scopeList() {
    return {
      restrict: 'E',
      scope: {
        scopes: '=',
        filterStatus: '='
      },
      templateUrl: 'src/app/scope/views/scope-list.html'
    };
  }
})();
