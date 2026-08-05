(function(){
  'use strict';
  angular.module('appmrn25.dashboard')
    .controller('DashboardOverviewController', ['DashboardService', 'CardDataService', 'TransactionDataService', 'LoggingService', '$scope', function(DashboardService, CardDataService, TransactionDataService, LoggingService, $scope){
      var vm = this;
      vm.loading = false;
      vm.error = null;
      vm.isStale = false;
      vm.summary = null;
      vm.cards = [];
      vm.selectedCardId = null;
      vm.init = function(){
        vm.loading = true;
        vm.error = null;
        DashboardService.getOverview().then(function(response){
          vm.summary = response.summary;
          vm.cards = response.cards;
          vm.isStale = response.isStale;
          if(!vm.selectedCardId && vm.cards.length){
            vm.selectedCardId = vm.cards[0].cardId;
          }
        }).catch(function(err){
          vm.error = DashboardService.toUserMessage(err);
          LoggingService.error('DashboardOverview', err);
        }).finally(function(){
          vm.loading = false;
        });
      };
      vm.refresh = function(){
        DashboardService.invalidateCache();
        vm.init();
      };
      vm.selectCard = function(cardId){
        vm.selectedCardId = cardId;
      };
      vm.getUtilization = function(card){
        return CardDataService.computeUtilization(card);
      };
      $scope.$on('auth:logout', function(){
        vm.summary = null;
        vm.cards = [];
      });
      vm.init();
    }]);
})();
