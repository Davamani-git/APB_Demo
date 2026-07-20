(function () {
    'use strict';

    angular
        .module('app')
        .directive('kpiCard', kpiCard);

    function kpiCard() {
        return {
            restrict: 'E',
            scope: {
                title: '@',
                icon: '@',
                value: '<',
                format: '@?', // e.g., 'currency', 'percentage', 'number'
                tooltip: '@?'
            },
            templateUrl: 'src/templates/directives/kpi-card.html',
            controller: function () {},
            controllerAs: 'vm',
            bindToController: true
        };
    }
})();