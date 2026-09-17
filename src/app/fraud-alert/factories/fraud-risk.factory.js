(function(){
'use strict';
angular.module('fraudAlertModule').factory('FraudRiskFactory',['$resource','RISK_API_ENDPOINT',function($resource,RISK_API_ENDPOINT){
return $resource(RISK_API_ENDPOINT,{},{getRiskScore:{method:'POST',isArray:false}});
}]);
})();