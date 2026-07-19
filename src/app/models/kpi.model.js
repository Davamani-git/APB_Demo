(function () {
    "use strict";

    function KpiModel(data) {
        this.id = data.id;
        this.label = data.label;
        this.value = data.value;
        this.formattedValue = data.formattedValue;
        this.iconClass = data.iconClass;
        this.trendIndicator = data.trendIndicator;
        this.trendLabel = data.trendLabel;
        this.supportingLabel = data.supportingLabel;
    }

    angular
        .module("app")
        .factory("KpiModel", function () { return KpiModel; });
})();
