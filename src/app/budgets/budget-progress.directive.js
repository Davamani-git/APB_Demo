(function() {
  'use strict';
  angular.module('app.budgets')
    .directive('budgetProgress', ['BudgetService', function(BudgetService) {
      return {
        restrict: 'E',
        scope: {
          budget: '='
        },
        template: '<div class="budget-progress">' +
          '<div class="progress" ng-class="progressClass">' +
          '<div class="progress-bar" role="progressbar" ng-style="{width: progress + \'%\'}">' +
          '{{progress | number:0}}%' +
          '</div></div>' +
          '<p><strong>${{budget.spentAmount | number:2}}</strong> of <strong>${{budget.limitAmount | number:2}}</strong></p>' +
          '</div>',
        link: function(scope) {
          scope.$watch('budget', function(budget) {
            if (budget) {
              scope.progress = BudgetService.calculateProgress(budget);
              if (scope.progress < 50) {
                scope.progressClass = 'progress-green';
              } else if (scope.progress < 80) {
                scope.progressClass = 'progress-yellow';
              } else {
                scope.progressClass = 'progress-red';
              }
            }
          }, true);
        }
      };
    }]);
})();