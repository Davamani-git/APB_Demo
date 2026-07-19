(function () {
    'use strict';

    function KpiModel(data) {
        this.id = data.id;
        this.label = data.label;
        this.value = data.value;
        this.formattedValue = data.formattedValue;
        this.iconUrl = data.iconUrl;
        this.trendIndicator = data.trendIndicator || null;
    }

    angular.module('app')
        .factory('KpiModel', KpiModelFactory);

    KpiModelFactory.$inject = [];

    function KpiModelFactory() {
        return function (data) {
            return new KpiModel(data || {});
        };
    }
})();
