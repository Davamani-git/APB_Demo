(function () {
    'use strict';

    angular.module('apbDemo')
        .filter('percentage', percentage);

    percentage.$inject = [];

    function percentage() {
        return function (value) {
            if (typeof value !== 'number') {
                return '';
            }
            return value.toFixed(2) + '%';
        };
    }
})();
