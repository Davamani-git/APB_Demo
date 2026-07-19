(function () {
  "use strict";

  function breakdownTableDirective() {
    return {
      restrict: "E",
      scope: {
        breakdown: "="
      },
      bindToController: true,
      controllerAs: "vm",
      controller: [function () {
        var vm = this;

        vm.getCategoriesWithPercentage = function () {
          if (!vm.breakdown || typeof vm.breakdown.getCategoriesWithPercentage !== "function") {
            return [];
          }
          return vm.breakdown.getCategoriesWithPercentage();
        };
      }],
      templateUrl: "src/spending-dashboard/components/breakdown-table/breakdown-table.template.html",
      transclude: false,
      replace: false
    };
  }

  angular.module("app")
    .directive("breakdownTable", breakdownTableDirective);
})();
