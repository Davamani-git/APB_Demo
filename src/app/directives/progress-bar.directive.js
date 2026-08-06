angular.module('executiveDashboard').directive('progressBar', [function() {
return {
restrict: 'E',
scope: {
percentage: '=',
color: '='
},
template: '<div class="progress-bar-container"><div class="progress-bar-fill" ng-style="{width: percentage + \u0027%\u0027, backgroundColor: color}"></div><span class="progress-bar-label">{{percentage}}%</span></div>',
link: function(scope, element, attrs) {
scope.$watch('percentage', function(newVal) {
if (newVal < 0) scope.percentage = 0;
if (newVal > 100) scope.percentage = 100;
});
}
};
}]);
