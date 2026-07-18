(function () {
  "use strict";

  errorPanelDirective.$inject = [];

  function errorPanelDirective() {
    return {
      restrict: "E",
      scope: {
        error: "=",
        onRetry: "&"
      },
      bindToController: true,
      controllerAs: "vm",
      controller: function () {
        const vm = this;
        vm.getDisplayMessage = function () {
          if (!vm.error) {
            return "An unexpected error occurred.";
          }
          return vm.error.message || "An unexpected error occurred.";
        };
      },
      templateUrl: "app/shared/directives/error-panel.template.html",
      transclude: false,
      replace: false
    };
  }

  angular
    .module("app")
    .directive("errorPanel", errorPanelDirective);
})();
