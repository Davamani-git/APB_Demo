angular.module('apbDemo.dashboard')
.directive('categoryBreakdownPanel', [function() {
    return {
        restrict: 'E',
        scope: { categories: '=' },
        template: '<div style="padding: 10px; margin-top: 10px; border: 1px solid #ddd;"><h4>Category Breakdown</h4><pre>{{categories | json}}</pre></div>'
    };
}]);