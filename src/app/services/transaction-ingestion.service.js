(function(){
'use strict';
angular.module('fraudAlertApp').service('TransactionIngestionService',['$http','API_CONFIG',function($http,API_CONFIG){
const self=this;
self.getTransactions=function(){
return $http.get(API_CONFIG.baseUrl+API_CONFIG.transactionsEndpoint).then(function(response){
return response.data;
}).catch(function(error){
throw error;
});
};
self.getTransactionById=function(transactionId){
return $http.get(API_CONFIG.baseUrl+API_CONFIG.transactionsEndpoint+'/'+transactionId).then(function(response){
return response.data;
}).catch(function(error){
throw error;
});
};
}]);
})();