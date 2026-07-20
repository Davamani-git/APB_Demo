(function () {
    'use strict';

    angular.module('apbDemo')
        .directive('kpiCard', kpiCard);

    kpiCard.$inject = [];

    function kpiCard() {
        return {
            restrict: 'E',
            scope: {
                kpi: '<'
            },
            templateUrl: 'templates/components/kpi-card.html',
            controller: KpiCardController,
            controllerAs: 'vm',
            bindToController: true
        };
    }

    KpiCardController.$inject = [];

    function KpiCardController() {
        var vm = this;
        vm.getIconClass = function () {
            if (!vm.kpi || !vm.kpi.id) {
                return 'fa-bar-chart';
            }
            if (vm.kpi.id === 'totalSpend') {
                return 'fa-line-chart';
            }
            if (vm.kpi.id === 'transactionCount') {
                return 'fa-list-ul';
            }
            if (vm.kpi.id === 'averageTransactionValue') {
                return 'fa-calculator';
            }
            return 'fa-bar-chart';
        };
    }
})();
