(function(){
'use strict';
angular.module('creditCardApp').controller('CardDetailController',['$routeParams','CardService','KpiService','TransactionService',function($routeParams,$cardService,$kpiService,$transactionService){
var vm=this;
vm.loading=true;
vm.card={};
vm.kpis={};
vm.transactions=[];
vm.error=null;
var cardId=$routeParams.cardId;
function init(){
vm.loading=true;
$cardService.getCardById(cardId).then(function(card){
vm.card=card;
return $kpiService.getCardKpis(cardId);
}).then(function(kpis){
vm.kpis=kpis;
return $transactionService.getTransactionsByCardId(cardId);
}).then(function(transactions){
vm.transactions=transactions;
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load card details';
vm.loading=false;
});
}
init();
}]);
})();