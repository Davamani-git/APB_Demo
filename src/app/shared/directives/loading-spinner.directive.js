(function () {
  'use strict';

  LoadingSpinnerDirective.$inject = [];

  angular.module('app')
    .directive('loadingSpinner', LoadingSpinnerDirective);

  function LoadingSpinnerDirective() {
    return {
      restrict: 'E',
      scope: {
        isLoading: '<'
      },
      bindToController: true,
      controller: LoadingSpinnerController,
      controllerAs: 'vm',
      templateUrl: 'src/app/shared/directives/loading-spinner.template.html',
      transclude: false,
      replace: false
    };
  }

  LoadingSpinnerController.$inject = [];

  function LoadingSpinnerController() {
    var vm = this;
  }
})();
