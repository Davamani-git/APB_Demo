(function() {
  'use strict';
  angular
    .module('execDashboard.scope')
    .directive('scopeTile', scopeTile);

  function scopeTile() {
    return {
      restrict: 'E',
      scope: {
        scopeItem: '=',
        onEdit: '&'
      },
      templateUrl: 'src/app/scope/views/scope-tile.html'
    };
  }
})();
