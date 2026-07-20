(function () {
    'use strict';

    angular
        .module('app')
        .directive('errorPanel', errorPanel);

    function errorPanel() {
        return {
            restrict: 'E',
            scope: {
                error: '<',
                retryAction: '&?'
            },
            templateUrl: 'src/templates/directives/error-panel.html'
        };
    }
})();