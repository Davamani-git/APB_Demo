(function() {
  'use strict';
  angular.module('providerEnrollmentApp').directive('readinessStatusBadge', [readinessStatusBadge]);
  function readinessStatusBadge() {
    return {
      restrict: 'E',
      scope: { status: '=' },
      template: '<span class="label" ng-class="getLabelClass()">{{status}}</span>',
      link: function(scope) {
        scope.getLabelClass = function() {
          if (scope.status === 'Ready to Submit') return 'label-success';
          if (scope.status === 'Incomplete') return 'label-danger';
          if (scope.status === 'Expiring Soon') return 'label-warning';
          return 'label-default';
        };
      }
    };
  }
})();