(function () {
  "use strict";

  function kpiCardsDirective() {
    return {
      restrict: "E",
      scope: {
        kpis: "="
      },
      bindToController: true,
      controllerAs: "vm",
      controller: [function () {
        // Presentation-only directive; logic handled in controller
      }],
      templateUrl: "src/spending-dashboard/components/kpi-cards/kpi-cards.template.html",
      transclude: false,
      replace: false
    };
  }

  angular.module("app")
    .directive("kpiCards", kpiCardsDirective);
})();
