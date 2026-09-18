(function(){
'use strict';
angular.module('creditCardApp').controller('CardsController',['CardService','KpiService',function($cardService,$kpiService){
var vm=this;
vm.loading=true;
vm.cards=[];
vm.portfolioSummary={};
vm.error=null;
function init(){
vm.loading=true;
$cardService.getAllCards().then(function(cards){
vm.cards=cards;
return $cardService.getPortfolioSummary();
}).then(function(summary){
vm.portfolioSummary=summary;
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load cards';
vm.loading=false;
});
}
init();
}]);
})();