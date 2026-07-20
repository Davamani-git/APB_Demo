(function () {
    'use strict';

    angular
        .module('app')
        .directive('loadingSpinner', loadingSpinner);

    function loadingSpinner() {
        return {
            restrict: 'E',
            scope: {
                isLoading: '<',
                message: '@?'
            },
            templateUrl: 'src/templates/directives/loading-spinner.html'
        };
    }
})();