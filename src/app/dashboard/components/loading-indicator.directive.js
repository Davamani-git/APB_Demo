angular.module('apbDemo.dashboard')
.directive('loadingIndicator', [function() {
    return {
        restrict: 'E',
        scope: {
            isLoading: '='
        },
        template: '<div ng-if="isLoading" style="text-align: center; padding: 20px;"><strong>Loading...</strong></div>'
    };
}]);