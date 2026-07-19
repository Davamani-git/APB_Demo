(function () {
    'use strict';

    function BreakdownModel(data) {
        this.month = data.month;
        this.totalSpend = data.totalSpend;
        this.segments = data.segments || [];
    }

    angular.module('app')
        .factory('BreakdownModel', BreakdownModelFactory);

    BreakdownModelFactory.$inject = [];

    function BreakdownModelFactory() {
        return function (data) {
            return new BreakdownModel(data || {});
        };
    }
})();
