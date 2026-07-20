(function () {
    "use strict";

    angular.module("app")
        .factory("KpiSummaryModel", KpiSummaryModelFactory);

    KpiSummaryModelFactory.$inject = [];

    function KpiSummaryModelFactory() {
        function KpiSummaryModel(dto) {
            dto = dto || {};
            this.id = dto.id || "";
            this.label = dto.label || "";
            this.value = typeof dto.value === "number" ? dto.value : 0;
            this.formattedValue = dto.formattedValue || "";
            this.icon = dto.icon || "fa fa-circle";
            this.supportingLabel = dto.supportingLabel || "";
            this.trend = dto.trend || null;
        }

        KpiSummaryModel.prototype.isValid = function () {
            return !!this.label;
        };

        return KpiSummaryModel;
    }
})();
