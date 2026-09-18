(function(){
'use strict';
angular.module('creditCardApp').controller('AnalyticsController',['AnalyticsService','CardService',function($analyticsService,$cardService){
var vm=this;
vm.loading=true;
vm.categoryData=[];
vm.monthlyTrends=[];
vm.cardWiseData=[];
vm.cards=[];
vm.selectedCardId=null;
vm.error=null;
vm.onCardChange=onCardChange;
function init(){
vm.loading=true;
$cardService.getAllCards().then(function(cards){
vm.cards=cards;
return loadAnalytics(vm.selectedCardId);
}).then(function(){
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load analytics';
vm.loading=false;
});
}
function loadAnalytics(cardId){
return $analyticsService.getCategoryWiseSpend(cardId).then(function(categoryData){
vm.categoryData=categoryData;
return $analyticsService.getMonthlySpendTrends(cardId);
}).then(function(monthlyTrends){
vm.monthlyTrends=monthlyTrends;
return $analyticsService.getCardWiseSpendAnalysis();
}).then(function(cardWiseData){
vm.cardWiseData=cardWiseData;
});
}
function onCardChange(){
vm.loading=true;
loadAnalytics(vm.selectedCardId).then(function(){
vm.loading=false;
}).catch(function(err){
vm.error='Failed to reload analytics';
vm.loading=false;
});
}
init();
}]);
})();