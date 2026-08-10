(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .directive('dashboardWidget', ['$compile', function($compile) {
      return {
        restrict: 'E',
        scope: {
          widget: '=',
          data: '='
        },
        template: '<div class="widget-container" ng-style="getWidgetStyle()"><div class="widget-content" ng-transclude></div></div>',
        transclude: true,
        link: function(scope, element, attrs) {
          scope.getWidgetStyle = function() {
            if (!scope.widget || !scope.widget.size) return {};
            return {
              width: (scope.widget.size.width * 100 / 12) + '%',
              height: (scope.widget.size.height * 100) + 'px'
            };
          };
        }
      };
    }]);
})();