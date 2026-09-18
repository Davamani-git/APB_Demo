(function(){
'use strict';
angular.module('creditCardApp').controller('DashboardController',['KpiService','CardService',function($kpiService,$cardService){
var vm=this;
vm.loading=true;
vm.kpis={};
vm.cards=[];
vm.error=null;
function init(){
vm.loading=true;
$kpiService.getPortfolioKpis().then(function(kpis){
vm.kpis=kpis;
return $cardService.getAllCards();
}).then(function(cards){
vm.cards=cards;
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load dashboard data';
vm.loading=false;
});
}
init();
}]);
})();