(function(){
'use strict';
angular.module('creditCardApp').factory('creditCardDataFactory',['$http','$q','API_ENDPOINTS',function($http,$q,API_ENDPOINTS){
var factory={};
factory.fetchCreditCards=function(){
var deferred=$q.defer();
$http.get(API_ENDPOINTS.baseUrl+API_ENDPOINTS.creditCards).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return factory;
}]);
})();