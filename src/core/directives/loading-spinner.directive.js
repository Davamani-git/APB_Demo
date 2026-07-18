(function () {
    'use strict';

    loadingSpinner.$inject = [];

    function loadingSpinner() {
        return {
            restrict: 'E',
            scope: {
                visible: '<'
            },
            bindToController: true,
            controllerAs: 'vm',
            controller: LoadingSpinnerController,
            templateUrl: 'src/features/monthly-summary/components/loading-spinner.template.html',
            transclude: false,
            replace: false
        };
    }

    LoadingSpinnerController.$inject = [];

    function LoadingSpinnerController() {
        var vm = this;
    }

    angular
        .module('app')
        .directive('loadingSpinner', loadingSpinner);
})();
