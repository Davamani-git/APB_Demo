(function () {
  "use strict";

  monthSelectorDirective.$inject = [];

  function monthSelectorDirective() {
    return {
      restrict: "E",
      scope: {
        monthOptions: "=",
        selectedMonth: "=",
        onChange: "&"
      },
      bindToController: true,
      controllerAs: "vm",
      controller: function () {
        const vm = this;
        vm.handleChange = function () {
          vm.onChange();
        };
      },
      templateUrl: "app/shared/components/month-selector.template.html",
      transclude: false,
      replace: false
    };
  }

  angular
    .module("app")
    .directive("monthSelector", monthSelectorDirective);
})();
