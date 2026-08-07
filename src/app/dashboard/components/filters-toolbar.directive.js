angular.module('apbDemo.dashboard')
.directive('filtersToolbar', [function() {
    return {
        restrict: 'E',
        scope: {
            onFiltersChange: '&'
        },
        template: '<div style="padding: 10px; border-bottom: 1px solid #ccc;">' +
                  '<!-- Filter controls would go here --> ' +
                  '<button ng-click="onFiltersChange()">Refresh Data (Mock)</button>' +
                  '</div>'
    };
}]);