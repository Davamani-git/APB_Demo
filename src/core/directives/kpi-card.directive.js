(function () {
    'use strict';

    kpiCard.$inject = [];

    function kpiCard() {
        return {
            restrict: 'E',
            scope: {
                kpi: '<'
            },
            bindToController: true,
            controllerAs: 'vm',
            controller: KpiCardController,
            templateUrl: 'src/features/monthly-summary/components/kpi-card.template.html',
            transclude: false,
            replace: false
        };
    }

    KpiCardController.$inject = [];

    function KpiCardController() {
        var vm = this;
    }

    angular
        .module('app')
        .directive('kpiCard', kpiCard);
})();
