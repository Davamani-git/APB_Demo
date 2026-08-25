(function() {
  'use strict';
  angular.module('dashboard')
    .service('CreditCardService', ['$http', function($http) {
      this.getCards = function() {
        return $http.get('/api/creditcards')
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching credit cards:', error);
            throw error;
          });
      };
    }]);
})();