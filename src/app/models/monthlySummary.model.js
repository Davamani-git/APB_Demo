(function () {
    "use strict";

    angular.module("app")
        .factory("MonthlySummaryModel", MonthlySummaryModelFactory);

    MonthlySummaryModelFactory.$inject = [];

    function MonthlySummaryModelFactory() {
        function MonthlySummaryModel(dto) {
            dto = dto || {};
            this.cardId = dto.cardId || "";
            this.month = dto.month || "";
            this.totalSpend = typeof dto.totalSpend === "number" ? dto.totalSpend : 0;
            this.currency = dto.currency || "USD";
            this.statementType = dto.statementType || "statement";
            this.dataFreshness = dto.dataFreshness || "";
        }

        MonthlySummaryModel.prototype.isValid = function () {
            return !!this.cardId && !!this.month && this.totalSpend >= 0 && !!this.currency;
        };

        return MonthlySummaryModel;
    }
})();
