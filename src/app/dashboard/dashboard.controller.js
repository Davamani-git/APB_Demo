angular.module('creditCardApp').controller('DashboardController',['CardService',function(CardService){
var vm=this;
vm.kpis={};
vm.loading=true;
CardService.getDashboardKPIs().then(function(data){
vm.kpis=data;
vm.loading=false;
});
}]);