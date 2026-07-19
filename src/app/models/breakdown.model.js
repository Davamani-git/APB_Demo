(function () {
    "use strict";

    function BreakdownModel(data) {
        this.month = data.month;
        this.totalSpend = data.totalSpend;
        this.segments = data.segments || [];
    }

    BreakdownModel.prototype.isValid = function () {
        if (!this.month) {
            return false;
        }
        if (this.totalSpend < 0) {
            return false;
        }
        return true;
    };

    angular
        .module("app")
        .factory("BreakdownModel", function () { return BreakdownModel; });
})();
