(function() {
  'use strict';
  angular.module('fraudAlertModule')
    .directive('alertList', ['alertRecordService', function(alertRecordService) {
      return {
        restrict: 'E',
        scope: {
          alerts: '=',
          onUpdate: '&'
        },
        templateUrl: 'src/app/fraud-alert/views/alert-list.template.html',
        link: function(scope, element, attrs) {
          scope.sortField = 'createdAt';
          scope.sortReverse = true;
          
          scope.sortBy = function(field) {
            if (scope.sortField === field) {
              scope.sortReverse = !scope.sortReverse;
            } else {
              scope.sortField = field;
              scope.sortReverse = false;
            }
          };
          
          scope.getSortIcon = function(field) {
            if (scope.sortField !== field) {
              return '';
            }
            return scope.sortReverse ? '▼' : '▲';
          };
          
          scope.getRiskClass = function(level) {
            const classes = {
              low: 'success',
              medium: 'warning',
              high: 'danger',
              confirmed_fraud: 'danger'
            };
            return classes[level] || 'default';
          };
        }
      };
    }]);
})();