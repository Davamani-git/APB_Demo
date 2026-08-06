(function() {
  'use strict';
  angular.module('executiveDashboardApp').directive('progressBar', ['CalculationService', function(CalculationService) {
    return {
      restrict: 'A',
      scope: {
        completed: '=',
        total: '='
      },
      template: '<div class="progress-bar-container"><div class="progress-bar-fill" ng-style="{width: percentage + \'%\'}"></div></div>',
      link: function(scope, element, attrs) {
        function updatePercentage() {
          scope.percentage = CalculationService.calculatePercentage(scope.completed, scope.total);
        }
        scope.$watch('completed', updatePercentage);
        scope.$watch('total', updatePercentage);
        updatePercentage();
      }
    };
  }]);
})();