(function () {
    'use strict';

    angular.module('apbDemo')
        .factory('BreakdownModel', BreakdownModelFactory);

    BreakdownModelFactory.$inject = [];

    function BreakdownModelFactory() {
        function BreakdownModel() {
            this.month = '';
            this.categories = [];
        }
        return BreakdownModel;
    }
})();
