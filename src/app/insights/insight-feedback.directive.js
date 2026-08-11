(function() {
  'use strict';
  angular.module('app.insights')
    .directive('insightFeedback', [function() {
      return {
        restrict: 'E',
        scope: {
          insight: '=',
          onFeedback: '&'
        },
        template: '<span>' +
          '<button class="btn btn-sm btn-success" ng-click="submitFeedback(\'positive\')" ng-disabled="insight.userFeedback">' +
          '<i class="glyphicon glyphicon-thumbs-up"></i>' +
          '</button> ' +
          '<button class="btn btn-sm btn-danger" ng-click="submitFeedback(\'negative\')" ng-disabled="insight.userFeedback">' +
          '<i class="glyphicon glyphicon-thumbs-down"></i>' +
          '</button>' +
          '<span ng-if="insight.userFeedback" style="margin-left: 10px;">Feedback submitted: {{insight.userFeedback}}</span>' +
          '</span>',
        link: function(scope) {
          scope.submitFeedback = function(feedback) {
            scope.onFeedback({insightId: scope.insight.id, feedback: feedback});
          };
        }
      };
    }]);
})();