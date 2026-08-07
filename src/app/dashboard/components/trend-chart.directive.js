angular.module('apbDemo.dashboard')
.directive('trendChart', [function() {
    return {
        restrict: 'E',
        scope: { data: '=' },
        template: '<div style="padding: 10px; margin-top: 10px; border: 1px solid #ddd;"><h4>Trend Chart</h4><pre>{{data | json}}</pre></div>'
    };
}]);