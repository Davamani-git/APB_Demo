(function () {
    "use strict";

    angular.module("app")
        .factory("BreakdownItemModel", BreakdownItemModelFactory);

    BreakdownItemModelFactory.$inject = [];

    function BreakdownItemModelFactory() {
        function BreakdownItemModel(dto) {
            dto = dto || {};
            this.categoryId = dto.categoryId || "";
            this.categoryName = dto.categoryName || "";
            this.amount = typeof dto.amount === "number" ? dto.amount : 0;
            this.percentageOfTotal = typeof dto.percentageOfTotal === "number" ? dto.percentageOfTotal : 0;
        }

        BreakdownItemModel.prototype.isValid = function () {
            return !!this.categoryName && this.amount >= 0 && this.percentageOfTotal >= 0;
        };

        return BreakdownItemModel;
    }
})();
