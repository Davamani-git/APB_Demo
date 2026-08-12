(function(){
'use strict';
angular.module('creditCardApp').controller('dashboardController',['$scope','dashboardService',function($scope,dashboardService){
var vm=this;
vm.kpiData=null;
vm.loading=true;
vm.error=null;
function init(){
dashboardService.getKPIs().then(function(data){
vm.kpiData=data;
vm.loading=false;
},function(error){
vm.error='Failed to load dashboard data. Please try again.';
vm.loading=false;
});
}
init();
}]);
})();