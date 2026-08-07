angular.module('apbDemo.services')
.factory('TransactionDataService', ['$http', '$q', 'EnvConfig', 'ErrorHandlerService', function($http, $q, EnvConfig, ErrorHandlerService) {
    function getTransactions(dateRange) {
        var deferred = $q.defer();
        // Mocking a failure for QE-4142 demonstration
        // In a real scenario, this would be a dynamic API call
        $http.get(EnvConfig.apiBaseUrl + '/transactions-fail-mock')
            .then(function(response) {
                deferred.resolve(response.data.transactions || []);
            })
            .catch(function(error) {
                var errorModel = ErrorHandlerService.handleHttpError(error);
                deferred.reject(errorModel);
            });
        return deferred.promise;
    }

    return {
        getTransactions: getTransactions
    };
}]);