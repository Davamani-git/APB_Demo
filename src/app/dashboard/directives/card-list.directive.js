(function () {
  'use strict';

  angular
    .module('ccd.dashboard')
    .directive('ccdCardList', ccdCardList);

  function ccdCardList() {
    return {
      restrict: 'E',
      scope: {
        cards: '='
      },
      controller: 'CardListController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'src/app/dashboard/views/partials/card-list.html'
    };
  }
})();
