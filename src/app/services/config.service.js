(function(){
'use strict';
angular.module('FraudAlertModule').factory('ConfigService',['$http','$q','$window',ConfigService]);
function ConfigService($http,$q,$window){
var apiBase='/api';
var service={getThresholds:getThresholds,updateThresholds:updateThresholds,getFeatureFlags:getFeatureFlags};
return service;
function getThresholds(){
var cached=$window.localStorage.getItem('alertThresholds');
if(cached){
return $q.resolve(JSON.parse(cached));
}
return $http.get(apiBase+'/config/thresholds').then(function(response){
$window.localStorage.setItem('alertThresholds',JSON.stringify(response.data));
return response.data;
},function(error){
return $q.reject(error);
});
}
function updateThresholds(thresholds){
return $http.put(apiBase+'/config/thresholds',thresholds).then(function(response){
$window.localStorage.setItem('alertThresholds',JSON.stringify(response.data));
return response.data;
},function(error){
return $q.reject(error);
});
}
function getFeatureFlags(){
return $http.get(apiBase+'/config/features').then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
}
}
})();