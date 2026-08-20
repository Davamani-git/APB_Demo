(function(){
'use strict';
angular.module('FraudAlertModule').controller('ThresholdConfigController',['$scope','ConfigService',ThresholdConfigController]);
function ThresholdConfigController($scope,ConfigService){
var vm=this;
vm.thresholds={};
vm.loading=false;
vm.error=null;
vm.success=null;
vm.loadThresholds=loadThresholds;
vm.saveThresholds=saveThresholds;
activate();
function activate(){
loadThresholds();
}
function loadThresholds(){
vm.loading=true;
vm.error=null;
ConfigService.getThresholds().then(function(data){
vm.thresholds=data;
vm.loading=false;
},function(error){
vm.error='Failed to load thresholds: '+(error.data?error.data.message:error.statusText);
vm.loading=false;
});
}
function saveThresholds(){
vm.loading=true;
vm.error=null;
vm.success=null;
ConfigService.updateThresholds(vm.thresholds).then(function(data){
vm.thresholds=data;
vm.success='Thresholds updated successfully without redeployment.';
vm.loading=false;
},function(error){
vm.error='Failed to update thresholds: '+(error.data?error.data.message:error.statusText);
vm.loading=false;
});
}
}
})();