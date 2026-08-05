(function(){
  'use strict';
  angular.module('appmrn25.dashboard')
    .directive('cardListPanel', [function(){
      return {
        restrict: 'E',
        scope: {
          cards: '=',
          selectedCardId: '=',
          onSelect: '&'
        },
        templateUrl: 'src/app/assets/js/app/dashboard/templates/partials/card-list-panel.html',
        controller: 'CardListController',
        controllerAs: 'vm',
        bindToController: true
      };
    }]);
})();
