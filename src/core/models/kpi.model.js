(function () {
    'use strict';

    function KpiModel(data) {
        data = data || {};
        this.label = data.label || '';
        this.value = typeof data.value === 'number' ? data.value : 0;
        this.icon = data.icon || '';
        this.cssClass = data.cssClass || '';
    }

    KpiModel.prototype.formatValue = function () {
        return this.value;
    };

    function KpiModelFactory() {
        return KpiModel;
    }

    angular
        .module('app')
        .factory('KpiModel', KpiModelFactory);
})();
