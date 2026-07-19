(function () {
    'use strict';

    ssKpiCard.$inject = [];

    function ssKpiCard() {
        return {
            restrict: 'E',
            scope: {
                title: '@',
                value: '<',
                iconClass: '@',
                supportingLabel: '@',
                trendIndicator: '<'
            },
            bindToController: true,
            controller: KpiCardController,
            controllerAs: 'vm',
            templateUrl: 'src/app/modules/dashboard/templates/kpi-card.html'
        };
    }

    KpiCardController.$inject = [];

    function KpiCardController() {
        var vm = this;
    }

    angular.module('app')
        .directive('ssKpiCard', ssKpiCard);

})();
