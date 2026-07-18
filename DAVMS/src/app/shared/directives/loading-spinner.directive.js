(function () {
  "use strict";

  loadingSpinnerDirective.$inject = [];

  function loadingSpinnerDirective() {
    return {
      restrict: "E",
      scope: {},
      bindToController: true,
      controllerAs: "vm",
      controller: function () {},
      templateUrl: "app/shared/directives/loading-spinner.template.html",
      transclude: false,
      replace: false
    };
  }

  angular
    .module("app")
    .directive("loadingSpinner", loadingSpinnerDirective);
})();
