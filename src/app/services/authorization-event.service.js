(function(){
'use strict';
angular.module('FraudAlertModule').factory('AuthorizationEventService',['$http','$q',AuthorizationEventService]);
function AuthorizationEventService($http,$q){
var apiBase='/api';
var service={getTransactionEvents:getTransactionEvents,getEventById:getEventById};
return service;
function getTransactionEvents(filters){
var params=filters||{};
return $http.get(apiBase+'/authorization/events',{params:params}).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
}
function getEventById(eventId){
return $http.get(apiBase+'/authorization/events/'+eventId).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
}
}
})();