(function () {
    "use strict";

    function BreakdownSegment(data) {
        data = data || {};
        this.label = data.label || "";
        this.value = typeof data.value === "number" ? data.value : 0;
        this.percentage = typeof data.percentage === "number" ? data.percentage : 0;
    }

    function BreakdownModel(data) {
        data = data || {};
        this.month = data.month || "";
        this.totalSpend = typeof data.totalSpend === "number" ? data.totalSpend : 0;
        this.segments = [];

        if (data.segments && angular.isArray(data.segments)) {
            for (var i = 0; i < data.segments.length; i++) {
                this.segments.push(new BreakdownSegment(data.segments[i]));
            }
        }
    }

    BreakdownModel.prototype.sumOfSegments = function () {
        var sum = 0;
        for (var i = 0; i < this.segments.length; i++) {
            sum += this.segments[i].value;
        }
        return sum;
    };

    angular.module("app")
        .factory("BreakdownModel", function () {
            return BreakdownModel;
        });
}());
