(function() {
  'use strict';
  angular.module('app.nlquery')
    .directive('nlQueryInput', ['NLQueryService', function(NLQueryService) {
      return {
        restrict: 'E',
        scope: {
          onSubmit: '&'
        },
        template: '<div class="input-group">' +
          '<input type="text" class="form-control" ng-model="query" placeholder="Ask about your finances..." ng-keypress="handleKeypress($event)">' +
          '<span class="input-group-btn">' +
          '<button class="btn btn-primary" ng-click="submit()">Ask</button>' +
          '</span>' +
          '</div>',
        link: function(scope) {
          scope.query = '';
          scope.submit = function() {
            if (scope.query.trim()) {
              scope.onSubmit({query: scope.query});
              scope.query = '';
            }
          };
          scope.handleKeypress = function(event) {
            if (event.keyCode === 13) {
              scope.submit();
            }
          };
        }
      };
    }]);
})();