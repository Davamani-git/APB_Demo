(function () {
    "use strict";

    function KpiModel(data) {
        data = data || {};
        this.id = data.id || "";
        this.label = data.label || "";
        this.value = typeof data.value !== "undefined" ? data.value : "";
        this.formattedValue = data.formattedValue || "";
        this.iconUrl = data.iconUrl || "";
        this.trendIndicator = data.trendIndicator || "neutral";
        this.supportingLabel = data.supportingLabel || "";
    }

    angular.module("app")
        .factory("KpiModel", function () {
            return KpiModel;
        });
}());
