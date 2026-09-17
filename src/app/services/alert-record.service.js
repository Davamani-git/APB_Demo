(function(){
'use strict';
angular.module('fraudAlertApp').service('AlertRecordService',['$http','API_CONFIG','$q',function($http,API_CONFIG,$q){
const self=this;
self.createAlert=function(transaction,riskScore,decision){
const alertData={transactionId:transaction.transactionId,riskScore:riskScore.score,decision:decision.action,reason:decision.reason,createdAt:new Date().toISOString()};
return $http.post(API_CONFIG.baseUrl+API_CONFIG.alertsEndpoint,alertData).then(function(response){
return response.data;
}).catch(function(error){
throw error;
});
};
self.getAlerts=function(){
return $http.get(API_CONFIG.baseUrl+API_CONFIG.alertsEndpoint).then(function(response){
return response.data;
}).catch(function(error){
throw error;
});
};
self.getAlertById=function(alertId){
return $http.get(API_CONFIG.baseUrl+API_CONFIG.alertsEndpoint+'/'+alertId).then(function(response){
return response.data;
}).catch(function(error){
throw error;
});
};
self.updateAlert=function(alertId,updateData){
return $http.put(API_CONFIG.baseUrl+API_CONFIG.alertsEndpoint+'/'+alertId,updateData).then(function(response){
return response.data;
}).catch(function(error){
throw error;
});
};
}]);
})();