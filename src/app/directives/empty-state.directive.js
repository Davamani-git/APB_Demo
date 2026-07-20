(function () {
    'use strict';

    angular
        .module('app')
        .directive('emptyState', emptyState);

    function emptyState() {
        return {
            restrict: 'E',
            scope: {
                icon: '@',
                message: '@',
                description: '@'
            },
            templateUrl: 'src/templates/directives/empty-state.html'
        };
    }
})();