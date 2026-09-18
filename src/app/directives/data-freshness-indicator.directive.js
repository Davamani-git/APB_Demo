(function() {
  'use strict';
  angular.module('dashboardModule').directive('dataFreshnessIndicator', ['$filter', function($filter) {
    return {
      restrict: 'E',
      scope: {
        lastSync: '=',
        isFresh: '='
      },
      template: '<span ng-if="!isFresh" class="glyphicon glyphicon-warning-sign text-warning" uib-tooltip="{{tooltipText}}" tooltip-placement="top"></span>',
      link: function(scope, element, attrs) {
        scope.$watch('lastSync', function(newVal) {
          if (newVal) {
            scope.tooltipText = 'Data last updated: ' + $filter('date')(newVal, 'short');
          }
        });
      }
    };
  }]);
})();