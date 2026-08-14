angular.module('creditCardDashboardModule').service('CreditCardDataService', ['$http', '$q', 'AuthFactory', function($http, $q, AuthFactory) {
  var service = this;
  
  service.getCreditCardSummary = function() {
    var deferred = $q.defer();
    
    $http.get('/api/creditcards/summary')
      .then(function(response) {
        deferred.resolve(response.data);
      })
      .catch(function(error) {
        console.error('Error fetching credit card summary:', error);
        deferred.reject(error);
      });
    
    return deferred.promise;
  };
}]);