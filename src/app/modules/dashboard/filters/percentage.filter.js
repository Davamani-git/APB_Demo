(function () {
    'use strict';

    percentage.$inject = [];

    function percentage() {
        return function (value) {
            if (value === null || value === undefined || isNaN(value)) {
                return 'Not available';
            }
            var percent = (parseFloat(value) * 100).toFixed(2);
            return percent + '%';
        };
    }

    angular.module('app')
        .filter('percentage', percentage);

})();
