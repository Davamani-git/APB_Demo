(function () {
    'use strict';

    KpiCardDirective.$inject = [];

    function KpiCardDirective() {
        return {
            restrict: 'E',
            scope: {
                label: '@',
                value: '<',
                icon: '@',
                trendIndicator: '@',
                supportingLabel: '@?'
            },
            bindToController: true,
            controller: KpiCardController,
            controllerAs: 'vm',
            templateUrl: 'templates/dashboard/kpiCard.html'
        };
    }

    KpiCardController.$inject = [];

    function KpiCardController() {
        var vm = this;

        vm.iconClass = vm.icon || 'fa-credit-card';
        vm.trendIcon = null;
        vm.trendText = null;

        if (vm.trendIndicator === 'up') {
            vm.trendIcon = 'fa-arrow-up';
            vm.trendText = 'Higher than previous month';
        } else if (vm.trendIndicator === 'down') {
            vm.trendIcon = 'fa-arrow-down';
            vm.trendText = 'Lower than previous month';
        } else if (vm.trendIndicator === 'neutral') {
            vm.trendIcon = 'fa-minus';
            vm.trendText = 'Stable compared to previous month';
        }
    }

    angular.module('app')
        .directive('kpiCard', KpiCardDirective);
})();
