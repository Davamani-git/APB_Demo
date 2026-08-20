(function(){
'use strict';
angular.module('fraudDetection')
.controller('fraudConfigController',['$scope','policyDecisionService','fraudConstants',function($scope,policyDecisionService,fraudConstants){
var vm=this;
vm.thresholds=[];
vm.loading=false;
vm.error=null;
vm.success=null;
vm.loadThresholds=function(){
vm.loading=true;
vm.error=null;
policyDecisionService.getThresholds().then(function(thresholds){
vm.thresholds=angular.copy(thresholds);
vm.loading=false;
$scope.$apply();
}).catch(function(error){
vm.error='Failed to load thresholds';
vm.loading=false;
$scope.$apply();
});
};
vm.updateThreshold=function(threshold){
vm.loading=true;
vm.error=null;
vm.success=null;
policyDecisionService.updateThreshold(threshold).then(function(response){
vm.success='Threshold updated successfully';
vm.loadThresholds();
vm.loading=false;
$scope.$apply();
}).catch(function(error){
vm.error='Failed to update threshold';
vm.loading=false;
$scope.$apply();
});
};
vm.loadThresholds();
}]);
})();