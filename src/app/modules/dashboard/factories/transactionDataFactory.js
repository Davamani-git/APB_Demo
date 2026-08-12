(function(){
'use strict';
angular.module('creditCardApp').factory('transactionDataFactory',['$http','$q','API_ENDPOINTS',function($http,$q,API_ENDPOINTS){
var factory={};
factory.fetchTransactions=function(){
var deferred=$q.defer();
$http.get(API_ENDPOINTS.baseUrl+API_ENDPOINTS.transactions).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return factory;
}]);
})();