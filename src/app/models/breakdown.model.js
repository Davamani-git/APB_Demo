(function () {
    "use strict";

    function BreakdownModel(data) {
        data = data || {};
        this.month = data.month || "";
        this.totalSpend = typeof data.totalSpend === "number" ? data.totalSpend : 0;
        this.segments = Array.isArray(data.segments) ? data.segments : [];
    }

    BreakdownModel.prototype.hasValidSegments = function () {
        return this.segments && this.segments.length > 0;
    };

    angular.module("app")
        .factory("BreakdownModel", function () {
            return BreakdownModel;
        });
})();
