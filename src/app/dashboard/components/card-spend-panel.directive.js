angular.module('apbDemo.dashboard')
.directive('cardSpendPanel', [function() {
    return {
        restrict: 'E',
        scope: { cards: '=' },
        template: '<div style="padding: 10px; margin-top: 10px; border: 1px solid #ddd;"><h4>Card Spend</h4><pre>{{cards | json}}</pre></div>'
    };
}]);