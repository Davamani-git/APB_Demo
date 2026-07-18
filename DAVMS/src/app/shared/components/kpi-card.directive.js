(function () {
  "use strict";

  kpiCardDirective.$inject = [];

  function kpiCardDirective() {
    return {
      restrict: "E",
      scope: {
        card: "="
      },
      bindToController: true,
      controllerAs: "vm",
      controller: function () {},
      templateUrl: "app/shared/components/kpi-card.template.html",
      transclude: false,
      replace: false
    };
  }

  angular
    .module("app")
    .directive("kpiCard", kpiCardDirective);
})();
