(function() {
  'use strict';
  angular.module('app.goals')
    .directive('goalCard', ['GoalService', function(GoalService) {
      return {
        restrict: 'E',
        scope: {
          goal: '=',
          onDelete: '&'
        },
        template: '<div class="goal-card">' +
          '<h4>{{goal.name}}</h4>' +
          '<div class="progress">' +
          '<div class="progress-bar progress-bar-success" role="progressbar" ng-style="{width: progress + \'%\'}">' +
          '{{progress | number:0}}%' +
          '</div></div>' +
          '<p><strong>${{goal.currentAmount | number:2}}</strong> of <strong>${{goal.targetAmount | number:2}}</strong></p>' +
          '<p>Target Date: {{goal.targetDate | date:\'mediumDate\'}}</p>' +
          '<p ng-if="goal.projectedCompletionDate">Projected Completion: {{goal.projectedCompletionDate | date:\'mediumDate\'}}</p>' +
          '<button class="btn btn-danger btn-sm" ng-click="onDelete({goalId: goal.id})">Delete</button>' +
          '</div>',
        link: function(scope) {
          scope.$watch('goal', function(goal) {
            if (goal) {
              scope.progress = GoalService.calculateProgress(goal);
            }
          }, true);
        }
      };
    }]);
})();