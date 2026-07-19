(function () {
    'use strict';

    percentage.$inject = ['$filter'];

    function percentage($filter) {
        return function (value) {
            if (value === null || value === undefined || isNaN(value)) {
                return '-';
            }
            var formatted = $filter('number')(value, 1);
            return formatted + '%';
        };
    }

    angular.module('app')
        .filter('percentage', percentage);
})();
