(function () {
    'use strict';

    angular.module('apbDemo')
        .factory('KpiModel', KpiModelFactory);

    KpiModelFactory.$inject = [];

    function KpiModelFactory() {
        function KpiModel() {
            this.id = '';
            this.label = '';
            this.value = 0;
            this.unit = '';
            this.formattedValue = '';
        }
        return KpiModel;
    }
})();
