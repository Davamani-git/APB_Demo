angular.module('apbDemo.dashboard')
.directive('errorBanner', [function() {
    return {
        restrict: 'E',
        scope: {
            error: '=',
            onRetry: '&'
        },
        template: '<div ng-if="error" style="padding: 10px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 5px;">' +
                  '<strong>Error:</strong> {{error.message}} ' +
                  '<button ng-click="onRetry()">Retry</button>' +
                  '</div>'
    };
}]);