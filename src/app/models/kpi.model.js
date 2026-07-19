(function () {
    "use strict";

    function KpiModel(data) {
        data = data || {};
        this.id = data.id || "";
        this.label = data.label || "";
        this.value = data.value;
        this.formattedValue = data.formattedValue || "";
        this.iconUrl = data.iconUrl || "";
        this.trendIndicator = data.trendIndicator || "";
        this.supportingLabel = data.supportingLabel || "";
        this.tooltip = data.tooltip || "";
    }

    angular.module("app")
        .factory("KpiModel", function () {
            return KpiModel;
        });
})();
